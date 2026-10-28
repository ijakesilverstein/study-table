const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
const stories=require('../source/story-mode-v134.json');
(async()=>{
 let browser,server;const url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8842/index.html',errors=[];
 try{
  if(!process.env.STUDY_TEST_URL){
   server=spawn('python3',['-m','http.server','8842','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});
   let ready=false;for(let i=0;i<100;i++){try{if((await fetch(url)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}
   assert(ready,'Story fixture server started');
  }
  browser=await chromium.launch(require('./browser-options.cjs'));
  const p=await browser.newPage({viewport:{width:390,height:844}});
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto(url);await p.waitForFunction(()=>typeof READY!=='undefined'&&READY&&window.studyTableFullCourses);
  const saved={schema:1,records:{'spanish-0':{attempts:3,independent:1,last:21}}};
  await p.evaluate(d=>localStorage.setItem('studytable_v102_learning',JSON.stringify(d)),saved);
  for(const story of stories){
   await p.evaluate(subject=>studyTableFullCourses.open(subject),story.subject);
   await p.waitForFunction(subject=>document.getElementById('frame')?.contentWindow?.studyTableFullCourse?.subject===subject,story.subject);
   const f=p.frames().find(x=>x.parentFrame()===p.mainFrame());
   if(await f.locator('#courseOutline').count()===0)await f.locator('[data-course-map]').first().click();
   const card=f.locator('#v134Story');
   assert.equal(await card.count(),1,story.subject);
   assert.equal(await card.locator('h2').innerText(),story.title);
   assert(await f.locator('#v134Story').evaluate(e=>e.compareDocumentPosition(document.getElementById('courseOutline'))&Node.DOCUMENT_POSITION_FOLLOWING),'Story must precede course map');
   const baseline=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
   await card.locator('[data-v134-start]').click();
   assert.equal(await card.locator('[data-v134-game]').isVisible(),true);
   assert.equal(await card.locator('[data-v134-next]').isVisible(),false,'Cannot advance before making a decision');
   for(let step=0;step<3;step++){
    const beat=story.beats[step];
    assert.equal(await card.locator('[data-v134-question]').innerText(),beat.question);
    assert.equal(await card.locator('[data-v134-options] button').count(),3);
    for(let choice=0;choice<3;choice++){
     const option=beat.options[choice];await card.locator('[data-v134-choice="'+choice+'"]').click();
     assert.equal(await card.locator('[data-v134-impact]').innerText(),option.after);
     assert.equal(await card.locator('[data-v134-why]').innerText(),option.why);
     assert.equal(await card.locator('[data-v134-choice="'+choice+'"]').getAttribute('aria-pressed'),'true');
     assert.equal(await card.locator('[data-v134-choice][aria-pressed=true]').count(),1);
    }
    const best=beat.options.findIndex(o=>o.works);
    await card.locator('[data-v134-choice="'+best+'"]').click();
    await card.locator('[data-v134-next]').click();
   }
   assert.equal(await card.locator('[data-v134-ending]').isVisible(),true,story.subject);
   assert.equal(await card.locator('[data-v134-outcome]').innerText(),story.win);
   assert.deepEqual(await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),baseline,'Story interactions cannot write progress or other values');
   await card.locator('[data-v134-replay]').click();
   await card.locator('[data-v134-choice]').first().click();
   await card.locator('[data-v134-close]').click();
   assert.equal(await card.locator('[data-v134-game]').isVisible(),false);
   assert.equal(await card.locator('[data-v134-start]').isVisible(),true);
   await card.locator('[data-v134-start]').click();
   await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   for(const width of [320,390]){
    await p.setViewportSize({width,height:844});
    for(const theme of ['light','dark']){
     await f.evaluate(t=>studyTableTheme.set(t),theme);
     assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),story.subject+'/'+width+'/'+theme+' overflows');
     const a=await f.evaluate(async()=>axe.run({include:['#v134Story']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
     if(a.violations.length)console.error('STORY_WCAG_DIAGNOSTIC',story.subject,width,theme,JSON.stringify({v:a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,checks:n.any?.map(a=>a.data)}))})),style:await f.locator('[data-v134-choice]').first().evaluate(e=>({theme:document.documentElement.dataset.studyTheme,color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor,parent:getComputedStyle(e.parentElement).backgroundColor}))}));
     assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],story.subject+'/'+width+'/'+theme+' WCAG');
    }
   }
   await card.locator('[data-v134-lesson]').count().then(n=>assert.equal(n,1));
   // Do not grade a lesson merely because a story was played.
   assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('studytable_v102_learning'))),saved);
   console.log('STORY_MODE_BROWSER_PASS',story.subject);
  }
  const last=stories.at(-1);
  await p.context().setOffline(true);
  const frame=p.frames().find(x=>x.parentFrame()===p.mainFrame()),card=frame.locator('#v134Story');
  await card.locator('[data-v134-close]').click();
  await card.locator('[data-v134-start]').click();
  await card.locator('[data-v134-choice]').first().click();
  assert.equal(await card.locator('[data-v134-why]').innerText(),last.beats[0].options[0].why);
  assert.deepEqual(errors,[]);
  console.log('STORY_MODE_COMPLETE: seven scenes, 21 decisions, 63 outcomes, reset/choice/replay, 28 phone/theme WCAG scans, no saved-state changes and offline after load.');
 }finally{await browser?.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exitCode=1});
