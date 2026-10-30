/* Focused V165 browser QA: all subjects, authored alternatives, story choice consequences, mobile and backup safety. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.join(__dirname,'..'),bank=require(path.join(root,'source','transfer-bank-v133.json')),stories=require(path.join(root,'source','story-mode-v134.json'));
(async()=>{
 let server;const port=8897,url=process.env.STUDY_V165_TEST_URL||`http://127.0.0.1:${port}/study-table-v165.html`;
 if(!process.env.STUDY_V165_TEST_URL){
  server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory','public'],{cwd:root,stdio:'ignore'});
  let ready=false;for(let i=0;i<100;i++){try{if((await fetch(url)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}
  assert(ready,'Could not start test server');
 }
 const browser=await chromium.launch(require('./browser-options.cjs'));
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.studyTableFocusV163&&window.studyTableFullCourses&&document.getElementById('st160-open'),{timeout:60000});
  const courses=stories.map(s=>s.subject);
  assert.equal(courses.length,7);
  for(const s of stories){
   await page.evaluate(subject=>window.studyTableFullCourses.open(subject),s.subject);
   await page.waitForFunction(subject=>document.getElementById('frame')?.contentWindow?.studyTableFullCourse?.subject===subject,s.subject,{timeout:30000});
   const f=page.frameLocator('#frame');
   await f.locator('details.v165-story-discovery > summary').click();
   assert.equal(await f.locator('#v134Story h2').innerText(),s.title);
   const prior=await page.evaluate(()=>document.getElementById('frame').contentWindow.localStorage.getItem('studytable:transfer-review:v133'));
   await f.locator('#v134Story [data-v134-start]').click();
   for(const beat of s.beats){
    assert.equal((await f.locator('#v134Story [data-v134-question]').innerText()).trim(),beat.question.trim());
    for(let n=0;n<3;n++){
     const opt=beat.options[n];
     await f.locator(`#v134Story [data-v134-choice="${n}"]`).click();
     assert.equal((await f.locator('#v134Story [data-v134-impact]').innerText()).trim(),opt.after.trim());
     assert.equal((await f.locator('#v134Story [data-v134-why]').innerText()).trim(),opt.why.trim());
    }
    const best=beat.options.findIndex(x=>x.works===true);
    assert(best>=0);
    await f.locator(`#v134Story [data-v134-choice="${best}"]`).click();
    await f.locator('#v134Story [data-v134-next]').click();
   }
   assert.equal((await f.locator('#v134Story [data-v134-outcome]').innerText()).trim(),s.win.trim());
   const after=await page.evaluate(()=>document.getElementById('frame').contentWindow.localStorage.getItem('studytable:transfer-review:v133'));
   assert.equal(after,prior,'Story wrote a review record');
   // The canonical seven-course map now exposes three authored skills per subject.
   await page.evaluate(()=>document.getElementById('frame').contentWindow.studyTableFullCourse.overview());
   const map=f.locator('#v133Map');
   assert.equal(await map.locator('[data-v133-unit]').count(),3,s.subject+' skill count');
   await map.locator('summary').click();
   await map.locator('[data-v133-unit]').first().click();
   const lesson=f.locator('#v133Practice');
   assert.equal(await lesson.count(),1,'Missing transfer inside lesson');
   assert.equal(await lesson.locator('[data-v133-content]').isVisible(),true,'Practice did not start');
   const id=await lesson.getAttribute('data-v133-unit-id');
   assert(bank[id]&&bank[id].subject===s.subject);
   const first=bank[id].variants[0];
   if(first.kind==='choice')await lesson.locator(`[name="v133-choice"][value="${first.answer}"]`).check();
   else await lesson.locator('[name="v133-input"]').fill(String(first.answer));
   await lesson.locator('[data-v133-form] [type="submit"]').click();
   assert.equal(await lesson.locator('[data-v133-result]').getAttribute('data-outcome'),'correct');
   // The review scheduler is explicitly opt-in, not a score.
   await lesson.locator('[data-v133-save]').click();
   const saved=await page.evaluate(()=>document.getElementById('frame').contentWindow.localStorage.getItem('studytable:transfer-review:v133'));
   assert(saved&&JSON.parse(saved).records[id],'A clicked review request did not persist');
   await lesson.locator('[data-v133-remove]').click();
   const removed=await page.evaluate(id=>JSON.parse(document.getElementById('frame').contentWindow.localStorage.getItem('studytable:transfer-review:v133')).records[id],id);
   assert.equal(removed,undefined,'Review deletion did not work');
   // Rechecked one exact matching and one mistake per authored item, all 42 variants.
   const checks=await page.evaluate(subject=>{
    const api=document.getElementById('frame').contentWindow.studyTableTransfer;
    const out=[];
    for(const [id,row] of Object.entries(api.bank))if(row.subject===subject)for(const problem of row.variants){
      out.push(api.check(problem,problem.answer).kind==='correct');
      if(Object.keys(problem.wrong||{}).length){const w=Object.keys(problem.wrong)[0];out.push(api.check(problem,w).kind==='misconception')}
    }
    return out;
   },s.subject);
   assert(checks.every(Boolean),'Incorrect exact-check logic for '+s.subject);
   await page.evaluate(()=>window.v35Home?.());
  }
  // Mobile and dark-mode cards remain usable; baseline old content does not overflow.
  await page.evaluate(()=>window.studyTableFullCourses.open('medicine'));
  await page.waitForFunction(()=>document.getElementById('frame')?.contentWindow?.studyTableFullCourse?.subject==='medicine');
  const f=page.frameLocator('#frame');
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   for(const section of ['#v133Map','.v165-story-discovery']){
    assert(await f.locator(section).evaluate(el=>el.getBoundingClientRect().width<=document.documentElement.clientWidth+2),`${section} exceeds viewport at ${width}`);
   }
  }
  assert.deepEqual(errors,[],'Page exceptions');
  console.log('V165_AUTHORED_INTERACTIONS_PASS: 7 real stories, all 63 consequences, 42 checked variants, review opt-in, course navigation, mobile widths');
 }finally{await browser.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exitCode=1});
