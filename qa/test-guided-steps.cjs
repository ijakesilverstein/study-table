const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
const courses=require('../source/full-courses-built.json'),edition=Number(require('../package.json').version.split('.')[0]);
(async()=>{
 let browser,server;
 const errors=[],url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8807/index.html';
 try{
  if(!process.env.STUDY_TEST_URL){
   server=spawn('python3',['-m','http.server','8807','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});
   for(let i=0;i<60;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
  }
  browser=await chromium.launch(require('./browser-options.cjs'));
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(n=>typeof READY!=='undefined'&&READY&&window.studyTableFullCourses?.version===n,edition);
  const marker={schema:1,records:{'spanish-0':{attempts:4,independent:2,last:12345}}};
  await page.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),marker);
  for(const [subject,course] of Object.entries(courses)){
   const unit=course.units[0];
   await page.evaluate(([subject,id])=>studyTableFullCourses.open(subject,id),[subject,unit.id]);
   await page.waitForFunction(([subject,title])=>{
    const w=document.getElementById('frame')?.contentWindow;
    return w?.studyTableFullCourse?.subject===subject&&w.document.querySelector('#courseArticle h1')?.textContent===title;
   },[subject,unit.title]);
   const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
   for(const part of ['#courseFirst','#courseSecond']){
    const example=frame.locator(part),steps=example.locator(':scope > .solution > li'),length=await steps.count();
    assert(length>=3,subject+' needs a complete example');
    assert.equal(await steps.evaluateAll(rows=>rows.filter(row=>row.hidden).length),0);
    assert.equal(await example.locator('.case-notice').evaluate(e=>e.hidden),false);
    await example.locator('[data-guided-start]').click();
    assert.equal(await example.locator('[data-guided-start]').getAttribute('aria-expanded'),'true');
    assert.equal(await steps.evaluateAll(rows=>rows.filter(row=>row.hidden).length),length);
    assert.equal(await example.locator('.case-notice').evaluate(e=>e.hidden),true);
    assert(await example.locator(':scope > .lesson-reference,:scope > .teacher-table').evaluateAll(rows=>rows.every(row=>row.hidden)));
    for(let i=0;i<length;i++){
     await example.locator('[data-guided-reveal]').click();
     assert.equal(await steps.evaluateAll(rows=>rows.filter(row=>!row.hidden).length),i+1,subject+'/'+part+' step '+i);
    }
    assert.equal(await example.locator('.case-notice').evaluate(e=>e.hidden),true);
    await example.locator('[data-guided-reveal]').click();
    assert.equal(await example.locator('.case-notice').evaluate(e=>e.hidden),false);
    assert(await example.locator(':scope > .lesson-reference,:scope > .teacher-table').evaluateAll(rows=>rows.every(row=>!row.hidden)));
    assert.equal(await example.locator('[data-guided-reveal]').evaluate(e=>e.hidden),true);
    await example.locator('[data-guided-exit]').click();
    assert.equal(await steps.evaluateAll(rows=>rows.filter(row=>row.hidden).length),0);
    assert.equal(await example.locator('[data-guided-start]').getAttribute('aria-expanded'),'false');
   }
   assert(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),subject+' overflow on phone');
  }
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('studytable_v102_learning'))),marker);
  assert.deepEqual(errors,[]);
  console.log('GUIDED_STEPS_PASS: both worked examples in all seven courses reveal sequentially, restore full reading, fit mobile, and never change assessed progress.');
 }finally{await browser?.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
