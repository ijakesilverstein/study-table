/* V163 standalone browser test: no saving or network, 11 authored repair loops. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const file=path.join(__dirname,'..','public','study-table-v163.html');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.setContent(fs.readFileSync(file,'utf8'),{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.studyTableFocusV163&&document.getElementById('st160-open'),{timeout:30000});
  const subjects=await page.evaluate(()=>studyTableFocusV163.subjects);
  if(subjects.length!==11)throw Error('Expected 11 authored subjects');
  for(const subject of subjects){
   await page.locator('#st163-subject').selectOption(subject);
   await page.locator('#st160-open').click();
   const item=await page.evaluate(s=>studyTableFocusV163.content[s],subject);
   const wrong=(item.answer+1)%3;
   await page.locator('[data-st160-choice="'+wrong+'"]').click();
   if(await page.locator('.st160-feedback').count())throw Error('Answer leaked before repair: '+subject);
   if(await page.locator('[data-st162-hinge]').count()!==3)throw Error('Missing prerequisite: '+subject);
   await page.locator('[data-st162="rethink"]').click();
   await page.locator('[data-st160-choice="'+item.answer+'"]').click();
   await page.locator('[data-st160="transfer"]').click();
   const bad=(item.transfer.answer+1)%3;
   await page.locator('[data-st160-transfer="'+bad+'"]').click();
   if(await page.locator('.st160-feedback').count())throw Error('Transfer leaked: '+subject);
   await page.locator('[data-st162="retry-transfer"]').click();
   await page.locator('[data-st160-transfer="'+item.transfer.answer+'"]').click();
   await page.locator('#st160-reason').fill('One clear explanation');
   await page.locator('[data-st160="close"]').click();
  }
  for(const width of [320,375,390,768,1280]){
   await page.setViewportSize({width,height:850});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   if(overflow>2)throw Error('Home overflow '+width+'px: '+overflow);
  }
  if(errors.length)throw Error('Page errors: '+errors.join('; '));
  console.log('PASS V163: 11 authored flows, transfer retries, five widths, no page exceptions');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
