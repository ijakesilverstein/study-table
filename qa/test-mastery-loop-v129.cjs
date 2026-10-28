const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
const courses=require('../source/full-courses-built.json'),edition=Number(require('../package.json').version.split('.')[0]);
(async()=>{
 let browser,server;const errors=[],url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8821/index.html';
 try{
  if(!process.env.STUDY_TEST_URL){
   server=spawn('python3',['-m','http.server','8821','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});
   for(let i=0;i<80;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
  }
  browser=await chromium.launch(require('./browser-options.cjs'));
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(n=>typeof READY!=='undefined'&&READY&&window.studyTableFullCourses?.version===n,edition);
  const saved={schema:1,records:{'piano-0':{attempts:4,independent:2,last:12}}};
  await page.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),saved);
  for(const [subject,course] of Object.entries(courses)){
   const unit=course.units[0];
   await page.evaluate(([subject,id])=>studyTableFullCourses.open(subject,id),[subject,unit.id]);
   await page.waitForFunction(([subject,title])=>{
    const w=document.getElementById('frame')?.contentWindow;
    return w?.studyTableFullCourse?.subject===subject&&w.document.querySelector('#courseArticle h1')?.textContent===title;
   },[subject,unit.title]);
   const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
   const authored=await frame.evaluate(id=>v126Lesson(byId.get(id)),unit.id);
   for(const section of ['#courseFirst','#courseSecond']){
    const box=frame.locator(section),coach=box.locator('.worked-coach');
    assert.equal(await coach.count(),1,subject+'/'+section+' missing coach');
    await coach.locator('summary').first().click();
    assert.equal(await coach.locator('.mastery-loop').count(),1);
    assert.equal(await coach.locator('.socratic-coach').count(),0,'Redundant old panel must not render');
    const n=await box.locator('.solution>li').count();
    assert.match(await coach.locator('[data-mastery-progress]').innerText(),/1 \//);
    await coach.locator('[data-mastery="hide"]').click();
    assert.equal(await box.locator('.solution>li').first().evaluate(el=>el.hidden),true,'Answer is concealed on request');
    await coach.locator('[data-mastery="hint"]').click();
    const hint=await coach.locator('[data-mastery-message]').innerText();
    assert(hint.includes(authored[section==='#courseFirst'?'first':'second'].steps[0][0]),'Hint must use current authored step title');
    assert(!hint.includes(authored[section==='#courseFirst'?'first':'second'].steps[0][1]),'Hint must not give away working');
    await coach.locator('[data-mastery="compare"]').click();
    assert.match(await coach.locator('[data-mastery-message]').innerText(),/Try saying or typing your own answer first/);
    const attempt='<script>alert("xss")</script> An explanation';
    await coach.locator('[data-coach-input]').fill(attempt);
    await coach.locator('[data-mastery="compare"]').click();
    assert.equal(await coach.locator('[data-mastery-user]').innerText(),attempt);
    assert.equal(await coach.locator('script').count(),0,'Learner transcript must never execute HTML');
    assert.equal(await box.locator('.solution>li').first().evaluate(el=>el.hidden),false,'Revealed authored working matches comparison');
    await coach.locator('[data-mastery="stuck"]').click();
    assert((await coach.locator('[data-mastery-message]').innerText()).includes(authored.mistake.diagnosis));
    for(let i=1;i<n;i++){
     await coach.locator('[data-mastery="next"]').click();
     assert.match(await coach.locator('[data-mastery-progress]').innerText(),new RegExp(''+(i+1)+' /'));
    }
    await coach.locator('[data-mastery="next"]').click();
    assert.equal(await coach.locator('[data-mastery-question]').innerText(),authored.exercise[0]);
    await coach.locator('[data-mastery="answer"]').click();
    assert((await coach.locator('[data-mastery-message]').innerText()).includes(authored.exercise[1]));
    await coach.locator('[data-mastery="next"]').click();
    assert.equal(await coach.locator('[data-mastery-question]').innerText(),authored.recall.ask);
    await coach.locator('[data-mastery="answer"]').click();
    assert((await coach.locator('[data-mastery-message]').innerText()).includes(authored.recall.answer));
    await coach.locator('[data-mastery="next"]').click();
    assert.equal(await coach.locator('[data-mastery-end]').isVisible(),true);
    await coach.locator('[data-mastery="repeat"]').click();
    assert.match(await coach.locator('[data-mastery-progress]').innerText(),/1 \//);
   }
   assert(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),subject+' horizontal overflow at 390px');
  }
  await page.setViewportSize({width:320,height:844});
  const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
  assert(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'320px screen horizontal overflow');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('studytable_v102_learning'))),saved);
  assert.deepEqual(errors,[]);
  console.log('MASTERY_LOOP_PASS: 14 cases, authored hints/solutions, input safety, transfer, recall, repeat, mobile, progress preservation');
 }finally{await browser?.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});