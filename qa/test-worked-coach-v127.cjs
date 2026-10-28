const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
const courses=require('../source/full-courses-built.json'),edition=Number(require('../package.json').version.split('.')[0]);
(async()=>{
 let browser,server;const errors=[];
 const url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8813/index.html';
 try{
  if(!process.env.STUDY_TEST_URL){
   server=spawn('python3',['-m','http.server','8813','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});
   for(let i=0;i<70;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
  }
  browser=await chromium.launch(require('./browser-options.cjs'));
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(n=>typeof READY!=='undefined'&&READY&&window.studyTableFullCourses?.version===n,edition);
  const saved={schema:1,records:{'spanish-0':{attempts:5,independent:2,last:100}}};
  await page.evaluate(v=>localStorage.setItem('studytable_v102_learning',JSON.stringify(v)),saved);
  for(const [subject,course] of Object.entries(courses)){
   const unit=course.units[0];
   await page.evaluate(([subject,id])=>studyTableFullCourses.open(subject,id),[subject,unit.id]);
   await page.waitForFunction(([subject,title])=>{
    const frame=document.getElementById('frame')?.contentWindow;
    return frame?.studyTableFullCourse?.subject===subject&&frame.document.querySelector('#courseArticle h1')?.textContent===title;
   },[subject,unit.title]);
   const f=page.frames().find(x=>x.parentFrame()===page.mainFrame());
   for(const section of ['#courseFirst','#courseSecond']){
    const caseBox=f.locator(section),coach=caseBox.locator('.worked-coach');
    assert.equal(await coach.count(),1,subject+' '+section+' missing coach');
    await coach.locator('summary').click();
    assert.equal(await coach.locator('[data-coach-input]').count(),1);
    const why=caseBox.locator('.solution>li').first().locator(':scope > p:not(.calculation)').first();
    const reason=await why.innerText();
    await coach.locator('[data-coach-topic="why"]').click();
    const options=coach.locator('[data-coach-step] option');
    assert.equal(await options.count(),(await caseBox.locator('.solution>li').count())+1);
    await coach.locator('[data-coach-step]').selectOption('0');
    assert((await coach.locator('[data-coach-response]').innerText()).includes(reason),subject+' '+section+' not anchored to authored step');
    await coach.locator('[data-coach-input]').fill('Why is this method used?');
    await coach.locator('[data-coach-check]').click();
    assert.match(await coach.locator('[data-coach-response]').innerText(),/I can help with that part/);
    await coach.locator('[data-coach-input]').fill('My thought is to do something else');
    await coach.locator('[data-coach-check]').click();
    assert.match(await coach.locator('[data-coach-response]').innerText(),/cannot honestly mark free-form reasoning/);
    await coach.locator('[data-coach-topic="mistake"]').click();
    assert.match(await coach.locator('[data-coach-response]').innerText(),/A common mistake in this lesson/);
   }
   if(subject==='spanish')assert.equal(await f.locator('[data-coach-language]').first().count(),1);
   assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),subject+' horizontal overflow');
  }
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('studytable_v102_learning'))),saved);
  assert.deepEqual(errors,[]);
  console.log('WORKED_COACH_PASS: seven courses, both cases, lesson-specific feedback, honest uncertainty, mobile layout and no assessment changes.');
 }finally{await browser?.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
