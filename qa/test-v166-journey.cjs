const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const file=path.join(root,'Study_Table_V166_Learning_Journey.html');
(async()=>{
 const html=fs.readFileSync(file,'utf8');
 const browser=await chromium.launch(require('./browser-options.cjs'));
 const errors=[];
 try{
  const subjects=['spanish','piano','chess','calculus','physics','medicine','business'];
  for(const subject of subjects){
   const page=await browser.newPage({viewport:{width:390,height:844}});
   page.on('pageerror',e=>errors.push(e.message));
   await page.setContent(html,{waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForFunction(()=>!!window.studyTableFocusV163&&!!document.getElementById('st160-open'));
   await page.locator('#st163-subject').selectOption(subject);
   await page.locator('#st160-open').click();
   const item=await page.evaluate(s=>studyTableFocusV163.content[s],subject);
   await page.locator('[data-st160-choice="'+item.answer+'"]').click();
   await page.locator('[data-st160="transfer"]').click();
   await page.locator('[data-st160-transfer="'+item.transfer.answer+'"]').click();
   assert.equal(await page.locator('[data-st160="story"]').count(),1);
   await page.locator('[data-st160="story"]').click();
   await page.waitForFunction(s=>document.getElementById('frame')?.contentWindow?.studyTableFullCourse?.subject===s,subject);
   const frame=page.frameLocator('#frame');
   await frame.locator('#v134Story [data-v134-game]').waitFor({state:'visible'});
   for(let i=0;i<3;i++){
    await frame.locator('[data-v134-choice="0"]').click();
    await frame.locator('[data-v134-next]').click();
   }
   await frame.locator('#v134Story [data-v134-ending]').waitFor({state:'visible'});
   if(subject==='spanish'){
    await frame.locator('[data-v166-real]').click();
    assert(await frame.locator('#v166SpanishReal').isVisible());
    await frame.locator('[data-v166-report]').click();
    assert.match(await frame.locator('#v166SpanishStatus').innerText(),/no real-person conversation/i);
    await frame.locator('#v166SpanishReport').selectOption('tried');
    await frame.locator('[data-v166-report]').click();
    assert.match(await frame.locator('#v166SpanishStatus').innerText(),/not verify/i);
   }
   await frame.locator('#v134Story [data-v166-try]').click();
   await frame.locator('#v133Practice [data-v133-content]').waitFor({state:'visible'});
   if(['chess','physics','medicine'].includes(subject)){
    const expected={chess:'castling',physics:'physics-2',medicine:'test-interpretation'}[subject];
    assert.equal(await frame.locator('#v133Practice').getAttribute('data-v133-unit-id'),expected);
   }
   await page.close();
   console.log('V166_JOURNEY_PASS',subject);
  }
  for(const width of [320,360,390,768,1280]){
   const page=await browser.newPage({viewport:{width,height:844}});
   await page.setContent(html,{waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForFunction(()=>!!document.getElementById('st160-open'));
   const delta=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   assert(delta<=2,`Home overflow at ${width}: ${delta}`);
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.setContent(html,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>!!window.studyTableFullCourses);
  await page.evaluate(()=>{v35Close();go('curricula/medicine.html#story')});
  const frame=page.frameLocator('#frame');
  await frame.locator('#v134Story [data-v134-game]').waitFor({state:'visible'});
  for(let i=0;i<3;i++){
   await frame.locator('[data-v134-choice="0"]').click();
   await frame.locator('[data-v134-next]').click();
  }
  await frame.locator('[data-v134-lesson]').click();
  await frame.locator('.v166-lesson-next [data-v166-try]').click();
  assert.equal(await frame.locator('#v133Practice').getAttribute('data-v133-unit-id'),'test-interpretation');
  await frame.locator('input[name="v133-choice"][value="About 90%"]') .check();
  await frame.locator('#v133Practice form button[type="submit"]').click();
  assert.equal(await frame.locator('#v133Practice [data-v133-result]').getAttribute('data-outcome'),'misconception');
  await frame.locator('input[name="v133-choice"][value="About 15%"]') .check();
  await frame.locator('#v133Practice form button[type="submit"]').click();
  assert.equal(await frame.locator('#v133Practice [data-v133-result]').getAttribute('data-outcome'),'correct');
  await page.close();
  assert.deepEqual(errors,[]);
  console.log('V166_ALL_JOURNEYS_AND_REPAIR_PASS: seven subject paths, story → lesson → practice, misconception feedback, 5 responsive widths');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
