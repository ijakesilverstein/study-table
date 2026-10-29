const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
const revisions=require('../source/lesson-revisions-v135.json'),guidance=require('../source/specific-teaching-v135.json'),courses=require('../source/full-courses-built.json');
(async()=>{let browser,server;const errors=[],url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8855/index.html';
 try{
  if(!process.env.STUDY_TEST_URL){server=spawn('python3',['-m','http.server','8855','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});let ready=false;for(let i=0;i<60;i++){try{if((await fetch(url)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}assert(ready,'QA server unavailable')}
  browser=await chromium.launch(require('./browser-options.cjs'));const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(n=>READY&&studyTableFullCourses.version===n,Number(require('../package.json').version.split('.')[0]));
  const record={schema:1,records:{'piano-2':{attempts:4,independent:1,last:100}}};await page.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),record);
  for(const [id,d] of Object.entries(revisions)){
   await page.evaluate(([s,id])=>studyTableFullCourses.open(s,id),[d.subject,id]);await page.waitForFunction(([s,id])=>document.getElementById('frame')?.contentWindow?.studyTableFullCourse?.subject===s&&document.getElementById('frame')?.contentDocument.querySelector('#courseArticle')?.dataset.unitId===id,[d.subject,id]);
   const f=page.frames().find(frame=>frame.parentFrame()===page.mainFrame()),base=courses[d.subject].units.find(u=>u.id===id),before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
   assert.deepEqual(await f.locator('#courseArticle>.course-goal~p').allTextContents(),d.opening);
   assert.deepEqual(await f.locator('.explanation>p').allTextContents(),d.teaching);
   assert.equal(await f.locator('.explanation h2').innerText(),d.heading);
   assert.equal(await f.locator('.takeaway p').innerText(),d.takeaway);
   assert.equal(await f.locator('[data-step-coach]').count(),0,'These additions teach through the shared coach, not unverified answer grading');
   for(const name of ['first','second']){
    const box=f.locator(name==='first'?'#courseFirst':'#courseSecond');assert.equal(await box.locator('.case-problem').innerText(),base[name].problem);
    assert.deepEqual(await box.locator('.solution>li>h3').allTextContents(),d[name+'Steps'].map(s=>s[0]));
    assert.deepEqual(await box.locator('.solution>li>p:not(.calculation)').allTextContents(),d[name+'Steps'].map(s=>s[2]));
    assert(await box.locator('.solution').isVisible(),'Complete worked teaching must be visible before an attempt');
    const t=d.tables[name];assert.deepEqual(await box.locator('.lesson-reference tbody tr').evaluateAll(rows=>rows.map(row=>[...row.children].map(cell=>cell.textContent))),t.rows);
    for(const col of t.languageColumns)assert.equal(await box.locator('.lesson-reference tbody tr').first().locator('th,td').nth(col).getAttribute('lang'),'es');
    const coach=box.locator('.worked-coach');await coach.locator('summary').first().click();
    for(let i=0;i<4;i++){
     const turn=guidance[id][name][i];await coach.locator('[data-coach-step]').selectOption(String(i));assert.equal(await coach.locator('[data-mastery-question]').innerText(),turn.prompt);
     await coach.locator('[data-mastery="hint"]').click();assert.equal(await coach.locator('[data-mastery-message]').innerText(),turn.hint);
     await coach.locator('[data-mastery="stuck"]').click();assert.equal(await coach.locator('[data-mastery-message]').innerText(),turn.help);
    }
    await coach.locator('summary').first().click();
   }
   const old=f.locator('.lesson-deeper');await old.locator('summary').click();assert.deepEqual(await old.locator(':scope>p').allTextContents(),base.teaching);
   const detective=f.locator('.v132-detective');assert.equal(await detective.evaluate(d=>d.open),false);await detective.locator('summary').click();assert([guidance[id].comparison.correct,guidance[id].comparison.tempting].includes(await detective.locator('.v132-claim').textContent()));await detective.locator('[data-v130-show]').click();assert.equal(await detective.locator('[data-v130-why]').innerText(),guidance[id].comparison.why);
   assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),before,'Studying/asking for help must not change saved records');
   await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});for(const width of [320,390]){await page.setViewportSize({width,height:844});for(const theme of ['light','dark']){
    await f.evaluate(t=>studyTableTheme.set(t),theme);assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' overflow '+width+'/'+theme);
    const a=await f.evaluate(()=>axe.run({include:['#courseArticle']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(a.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],id+'/'+width+'/'+theme);
   }}
   if(['piano-2','descriptions','chess-2'].includes(id)){await f.locator('#courseFirst .lesson-reference').scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/study-v135-'+id+'.png'});}
   console.log('TEACHER_DEMONSTRATION_PASS',id,'eight worked steps, both references, eight precise help turns, earlier explanation and mobile/theme checks');
  }
  await page.context().setOffline(true);await page.evaluate(()=>studyTableFullCourses.open('spanish','habits'));await page.waitForFunction(()=>document.getElementById('frame')?.contentDocument.querySelector('#courseArticle')?.dataset.unitId==='habits');assert.equal(await page.frameLocator('#frame').locator('[data-lesson-revision="135"]').count(),2);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('studytable_v102_learning'))),record);assert.deepEqual(errors,[]);
  console.log('TEACHER_DEMONSTRATIONS_BROWSER_PASS: six full revisions; 48 rendered prompts/hints/sticking-point explanations; 12 before-attempt reference tables; retained original teaching; 24 phone/theme WCAG scans; saved records unchanged; offline after initial load.');
 }finally{await browser?.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
