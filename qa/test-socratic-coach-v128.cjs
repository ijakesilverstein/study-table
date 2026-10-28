const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
const courses=require('../source/full-courses-built.json'),edition=Number(require('../package.json').version.split('.')[0]);
(async()=>{
 let browser,server;const errors=[];const url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8814/index.html';
 try{
  if(!process.env.STUDY_TEST_URL){
   server=spawn('python3',['-m','http.server','8814','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});
   for(let i=0;i<70;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
  }
  browser=await chromium.launch(require('./browser-options.cjs'));
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(n=>typeof READY!=='undefined'&&READY&&window.studyTableFullCourses?.version===n,edition);
  const assessment={schema:1,records:{'spanish-0':{attempts:2,independent:1,last:23}}};
  await page.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),assessment);
  for(const [subject,course] of Object.entries(courses)){
   const unit=course.units[0];
   await page.evaluate(([subject,id])=>studyTableFullCourses.open(subject,id),[subject,unit.id]);
   await page.waitForFunction(([subject,title])=>{
    const w=document.getElementById('frame')?.contentWindow;
    return w?.studyTableFullCourse?.subject===subject&&w.document.querySelector('#courseArticle h1')?.textContent===title;
   },[subject,unit.title]);
   const f=page.frames().find(x=>x.parentFrame()===page.mainFrame());
   for(const section of ['#courseFirst','#courseSecond']){
    const box=f.locator(section),coach=box.locator('.worked-coach');
    await coach.locator('summary').click();
    assert.equal(await coach.locator('.socratic-coach').count(),1,subject+' '+section+' no nudge flow');
    assert.equal(await coach.locator('[data-socratic="voice"]').getAttribute('aria-pressed'),'false');
    const n=await box.locator('.solution>li').count();
    assert(n>=3,'An actual solved case is required');
    assert.match(await coach.locator('[data-socratic-question]').innerText(),/Step 1 of/);
    assert.equal(await coach.locator('[data-socratic="previous"]').isDisabled(),true);
    await coach.locator('[data-socratic="hint"]').click();
    const hint=await coach.locator('[data-socratic-message]').innerText();
    assert.match(hint,/A nudge, without giving away the calculation/);
    const first=await box.locator('.solution>li').first().locator(':scope>p:not(.calculation)').first().innerText();
    await coach.locator('[data-socratic="compare"]').click();
    assert.match(await coach.locator('[data-socratic-message]').innerText(),/Say or type your idea/);
    const thought='<script>alert(123)</script> My approach';
    await coach.locator('[data-coach-input]').fill(thought);
    await coach.locator('[data-socratic="compare"]').click();
    assert.equal(await coach.locator('[data-socratic-learner]').innerText(),thought);
    assert.equal(await coach.locator('[data-socratic-reference]').innerText(),first);
    assert.equal(await coach.locator('script').count(),0,'Speech and text must render as literal text');
    assert.match(await coach.locator('[data-socratic-message]').innerText(),/What differs/);
    await coach.locator('[data-socratic="work"]').click();
    assert.match(await coach.locator('[data-socratic-message]').innerText(),/Here is the worked step/);
    await coach.locator('[data-socratic="next"]').click();
    assert.match(await coach.locator('[data-socratic-question]').innerText(),/Step 2 of/);
    assert.equal(await coach.locator('[data-coach-step]').inputValue(),'1');
    await coach.locator('[data-socratic="previous"]').click();
    assert.equal(await coach.locator('[data-coach-step]').inputValue(),'0');
    await coach.locator('[data-coach-step]').selectOption(String(n-1));
    await coach.locator('[data-socratic="next"]').click();
    assert.match(await coach.locator('[data-socratic-message]').innerText(),/You reached the conclusion/);
   }
   assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),subject+' mobile overflow');
   assert.equal(await f.locator('#courseArticle .worked-coach textarea').count(),2);
  }
  await page.setViewportSize({width:320,height:844});
  const frame=page.frames().find(x=>x.parentFrame()===page.mainFrame());
  assert(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'320px coach must not cause horizontal overflow');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('studytable_v102_learning'))),assessment);
  assert.deepEqual(errors,[]);
  console.log('SOCRATIC_V128_PASS: nudge, compare, explanation, next/previous, conclusion across both examples in seven courses; 320px mobile, safe user text, unchanged assessment.');
 }finally{await browser?.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
