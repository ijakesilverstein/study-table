/* Reproducible V166 browser check: authored choices, real-person evidence hygiene, lesson handoffs. */
const fs=require('fs'),zlib=require('zlib'),assert=require('node:assert/strict'),path=require('path');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const shell=fs.readFileSync((process.env.STUDY_CANDIDATE_HTML||path.join(ROOT,'public','study-table-v166.html')),'utf8');
const b64=shell.match(/<script id="full-bundle" type="text\/plain">([\s\S]*?)<\/script>/)?.[1];
assert(b64,'Embedded archive missing');
const archive=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const subject=archive['v15/spanish-for-someone/complete-practice-v40/index.html'].t;
const scenes=JSON.parse(fs.readFileSync(path.join(ROOT,'source','spanish-real-v166.json'),'utf8'));
(async()=>{
 const browser=await chromium.launch(require('./browser-options.cjs'));
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.evaluate(()=>{
   // Browser navigation is blocked in some test environments. Provide a local-only storage
   // facade for about:blank without making any network request or invoking real accounts.
   const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{
    get length(){return m.size},getItem:k=>m.has(String(k))?m.get(String(k)):null,
    setItem:(k,v)=>m.set(String(k),String(v)),removeItem:k=>m.delete(String(k)),
    key:i=>[...m.keys()][i]??null,clear:()=>m.clear()
   }});
  });
  await page.setContent(subject,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>!!window.studyTableSpanishV166&&!!document.getElementById('v166Real'));
  assert.equal(scenes.length,8);assert.equal(scenes.flatMap(x=>x.turns).length,24);
  for(const scene of scenes){
   await page.locator('#v166Scene').selectOption(scene.id);
   await page.locator('[data-v166-start]').click();
   for(const turn of scene.turns){
    assert.equal(await page.locator('.v166-heard').innerText(),turn.heard);
    assert.equal(await page.locator('[data-v166-next]').isDisabled(),true);
    await page.locator('[data-v166-meaning]').click();
    assert.equal(await page.locator('[data-v166-translation]').innerText(),turn.meaning);
    for(const choice of [1-turn.best,turn.best]){
     await page.locator('[data-v166-choice="'+choice+'"]').click();
     assert((await page.locator('.v166-feedback').innerText()).includes(turn.why[choice]));
    }
    await page.locator('[data-v166-next]').click();
   }
   await page.locator('[data-v166-save-plan]').click();
   assert.equal(await page.locator('[data-v166-save-plan]').isDisabled(),true);
   assert((await page.locator('[data-v166-message]').innerText()).includes('does not count as real-world use'));
  }
  assert.equal(await page.evaluate(()=>studyTableSpanishV166.load().entries.length),8);
  await page.locator('[data-v166-report]').first().click();
  await page.locator('#v166After').selectOption('yes');
  await page.locator('#v166ReportForm button[type="submit"]').click();
  assert((await page.locator('.v166-records article').first().innerText()).includes('self-reported, not independently verified'));
  await page.locator('[data-v166-report]').first().click();
  await page.locator('#v166After').selectOption('unknown');
  await page.locator('#v166ReportForm button[type="submit"]').click();
  assert((await page.locator('.v166-records article').first().innerText()).includes('Timing or outcome uncertain'));
  await page.locator('[data-v166-past]').click();
  await page.locator('#v166After').selectOption('no');
  await page.locator('#v166ReportForm button[type="submit"]').click();
  assert((await page.locator('.v166-records article').first().innerText()).includes('not counted as prepared use'));
  const entry=await page.evaluate(()=>studyTableSpanishV166.load().entries.at(-2));
  assert(entry.report?.realDay,'Absolute date must be saved, not recalculated on subsequent visits');
  const bad=await page.evaluate(()=>{const e=studyTableSpanishV166.load().entries.at(-2);e.report.realDay='2001-01-01';e.report.after='yes';return studyTableSpanishV166.reportStatus(e)});
  assert(bad.includes('not counted as prepared use'));
  const downloadPromise=page.waitForEvent('download');await page.locator('[data-v166-export]').click();
  const download=await downloadPromise;
  assert.equal(download.suggestedFilename(),'study-table-spanish-conversations-v166.json');
  const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
  assert.equal(exported.kind,'studytable-spanish-conversation-journal');assert.equal(exported.entries.length,9);
  await page.evaluate(()=>studyTableFullCourse.open('spanish-5'));
  assert.equal(await page.locator('[data-v166-lesson]').count(),1);
  await page.locator('[data-v166-lesson]').click();
  if(await page.locator('#v167More').count()&&!await page.locator('#v167More').evaluate(d=>d.open))await page.locator('#v167More>summary').click();
  await page.locator('.v165-story-discovery summary').click();
  await page.locator('#v134Story [data-v134-start]').click();
  for(let i=0;i<3;i++){await page.locator('#v134Story [data-v134-choice]').first().click();await page.locator('#v134Story [data-v134-next]').click()}
  await page.locator('#v134Story [data-v166-open]').click();
  assert.equal(await page.locator('#v166Real').count(),1);
  await page.evaluate(()=>studyTableFullCourse.open('spanish-1'));
  assert.equal(await page.locator('#v133Practice').count(),1);
  await page.evaluate(()=>studyTableFullCourse.open('descriptions'));
  assert.equal(await page.locator('.v136-companion').count(),1);
  for(const width of [320,360,390,768,1280]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>studyTableFullCourse.overview());
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   assert(overflow<=2,'Horizontal overflow '+width+'px: '+overflow);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS V166: 8 real-life scenes / 24 authored speaking turns, wrong/right feedback, stable timing and correction, exported journal, story->real life->checked lesson, V136 companion, five widths, no JS exceptions');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});