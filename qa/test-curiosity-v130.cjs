const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
const courses=require('../source/full-courses-built.json'),edition=Number(require('../package.json').version.split('.')[0]);
(async()=>{
 let browser,server;const url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8830/index.html',errors=[];
 try{
  if(!process.env.STUDY_TEST_URL){
   server=spawn('python3',['-m','http.server','8830','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});
   for(let i=0;i<80;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
  }
  browser=await chromium.launch(require('./browser-options.cjs'));
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(n=>typeof READY!=='undefined'&&READY&&window.studyTableFullCourses?.version===n,edition);
  const saved={schema:1,records:{'business-1':{attempts:3,independent:2,last:250}}};
  await page.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),saved);
  for(const [subject,course] of Object.entries(courses)){
   await page.evaluate(subject=>studyTableFullCourses.open(subject),subject);
   await page.waitForFunction(s=>document.getElementById('frame')?.contentWindow?.studyTableFullCourse?.subject===s,subject);
   const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
   if(await frame.locator('#courseOutline').count()===0)await frame.locator('[data-course-map]').first().click();
   assert.equal(await frame.locator('#v130Curiosity').count(),1,subject+' has no surprise question');
   assert.equal(await frame.locator('[data-v130-question]').isVisible(),false);
   await frame.locator('[data-v130-pick]').click();
   let challenge=frame.locator('#v130Curiosity');
   assert.equal(await challenge.locator('[data-v130-question]').isVisible(),true);
   const title=await challenge.locator('[data-v130-title]').innerText();
   const prompt=await challenge.locator('[data-v130-prompt]').innerText();
   assert(course.units.some(u=>u.title===title),subject+' unknown random unit title');
   assert(prompt.length>10,subject+' random question missing');
   assert.equal(await challenge.locator('[data-v130-solution]').isVisible(),false);
   await challenge.locator('[data-v130-answer]').click();
   assert((await challenge.locator('[data-v130-solution]').innerText()).length>15,subject+' answer missing');
   assert.equal(await challenge.locator('[data-v130-answer]').getAttribute('aria-expanded'),'true');
   await challenge.locator('[data-v130-answer]').click();
   assert.equal(await challenge.locator('[data-v130-solution]').isVisible(),false);
   await challenge.locator('[data-v130-again]').click();
   assert.notEqual(await challenge.locator('[data-v130-title]').innerText(),title,subject+' repeat must choose new unit');
   await challenge.locator('[data-v130-learn]').click();
   assert.equal(await frame.locator('#courseArticle h1').innerText(),await frame.locator('#courseArticle h1').innerText());
   assert.equal(await frame.locator('#courseOutline').count(),0,'Jump from question must open lesson');
   for(const unit of [course.units[0],course.units.at(-1)]){
    await page.evaluate(([subject,id])=>studyTableFullCourses.open(subject,id),[subject,unit.id]);
    await page.waitForFunction(title=>document.getElementById('frame')?.contentWindow?.document.querySelector('#courseArticle h1')?.textContent===title,unit.title);
    const c=page.frames().find(f=>f.parentFrame()===page.mainFrame());
    const trap=c.locator('[data-v130-trap]');
    assert.equal(await trap.count(),1,subject+' '+unit.id+' trap missing');
    assert.equal(await trap.locator('[data-v130-choice]').count(),2);
    assert.equal(await trap.locator('[data-v130-explain]').isVisible(),false);
    await trap.locator('[data-v130-choice="trap"]').click();
    assert.match(await trap.locator('[data-v130-verdict]').innerText(),/tempting wrong turn/);
    assert.match(await trap.locator('[data-v130-why]').innerText(),/\S.{12,}/);
    assert.match(await trap.locator('[data-v130-check]').innerText(),/One more thought/);
    await trap.locator('[data-v130-choice="good"]').click();
    assert.match(await trap.locator('[data-v130-verdict]').innerText(),/stronger reasoning/);
    assert.equal(await trap.locator('[data-v130-choice="good"]').getAttribute('aria-pressed'),'true');
    await trap.locator('[data-v130-reset]').click();
    assert.equal(await trap.locator('[data-v130-explain]').isVisible(),false);
    assert.equal(await c.locator('#courseArticle .mistake-check').count(),1,'One authored misconception only');
    assert(await c.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),subject+' width overflow 390');
   }
   console.log('CURIOSITY_V130_PASS',subject,'surprise question, answer, lesson jump and misconception game');
  }
  await page.setViewportSize({width:320,height:844});
  const last=page.frames().find(f=>f.parentFrame()===page.mainFrame());
  assert(await last.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'320px layout must fit');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('studytable_v102_learning'))),saved,'Non-scored games must preserve assessment records');
  assert.deepEqual(errors,[],'No browser console exceptions');
  console.log('CURIOSITY_V130_COMPLETE: seven courses, two misconception units each, mobile 390/320, learning progress preserved');
 }finally{await browser?.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
