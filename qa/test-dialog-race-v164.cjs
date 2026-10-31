/* V164: verify an old queued close event never destroys a newly opened session. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs');
const path=require('path');
(async()=>{
 const browser=await chromium.launch(require('./browser-options.cjs'));
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.evaluate(()=>{
   const values=new Map();
   Object.defineProperty(window,'localStorage',{configurable:true,value:{
    get length(){return values.size},
    key(i){return [...values.keys()][i]??null},
    getItem(k){return values.has(String(k))?values.get(String(k)):null},
    setItem(k,v){values.set(String(k),String(v))},
    removeItem(k){values.delete(String(k))},clear(){values.clear()}
   }});
  });
  const html=fs.readFileSync((process.env.STUDY_CANDIDATE_HTML||path.join(__dirname,'../public/study-table-v164.html')),'utf8');
  await page.setContent(html,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.studyTableBackup&&window.studyTableFocusV163&&document.getElementById('v124BackupHome')&&typeof READY!=='undefined'&&READY);
  const example={version:1,notes:[{text:'Thought worth saving',path:'',subject:'Notebook',when:100}],bookmarks:[]};
  await page.evaluate(()=>studyTableBackup.open());
  await page.locator('#v124File').setInputFiles({name:'notes.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(example))});
  await page.locator('#v124BackupPreview').waitFor({state:'visible'});
  // Simulate a previously queued close event arriving after new preview opens.
  await page.evaluate(()=>document.getElementById('v124BackupDialog').dispatchEvent(new Event('close')));
  assert(await page.locator('#v124BackupPreview').isVisible(),'A late close event erased the new preview');
  await page.locator('#v124Apply').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('study-table-v19:notes'))[0].text),'Thought worth saving');
  await page.locator('#v124BackupClose').click();
  await page.waitForFunction(()=>!document.getElementById('v124BackupDialog').open);
  // A read of a file from the previous dialog session must never populate the new one.
  const oldText=JSON.stringify({version:1,notes:[{text:'OLD, SHOULD NOT APPEAR',path:'',subject:'Notebook',when:100}],bookmarks:[]});
  await page.evaluate(text=>{
   const native=File.prototype.text;
   File.prototype.text=function(){
    if(this.name==='slow.json')return new Promise(resolve=>{window.__finishOldRead=()=>resolve(text)});
    return native.call(this);
   };
  },oldText);
  await page.evaluate(()=>studyTableBackup.open());
  await page.locator('#v124File').setInputFiles({name:'slow.json',mimeType:'application/json',buffer:Buffer.from(oldText)});
  await page.waitForFunction(()=>typeof window.__finishOldRead==='function');
  await page.evaluate(()=>{document.getElementById('v124BackupDialog').close();studyTableBackup.open()});
  await page.evaluate(()=>window.__finishOldRead());
  await page.waitForTimeout(20);
  assert.equal(await page.locator('#v124BackupPreview').isVisible(),false,'Old file read entered a new backup session');
  assert.equal(await page.locator('#v124Apply').isEnabled(),false,'Old file became applicable in a new session');
  await page.locator('#v124BackupClose').click();
  await page.waitForFunction(()=>!document.getElementById('v124BackupDialog').open);
  await page.locator('#st160-open').click();
  await page.locator('#st160-body h2').waitFor();
  await page.evaluate(()=>document.getElementById('st160-quest').dispatchEvent(new Event('close')));
  assert(await page.evaluate(()=>document.getElementById('st160-quest').contains(document.activeElement)),'A late tutor close event stole focus');
  await page.locator('[data-st160="close"]').click();
  const subjects=await page.evaluate(()=>studyTableFocusV163.subjects);
  assert.equal(subjects.length,11);
  for(const subject of subjects){
   await page.locator('#st163-subject').selectOption(subject);
   await page.locator('#st160-open').click();
   const item=await page.evaluate(s=>studyTableFocusV163.content[s],subject);
   await page.locator('[data-st160-choice="'+item.answer+'"]').click();
   await page.locator('[data-st160="transfer"]').click();
   await page.locator('[data-st160-transfer="'+item.transfer.answer+'"]').click();
   assert(await page.locator('#st160-reason').isVisible(),subject+' lost its final reflection');
   await page.locator('[data-st160="close"]').click();
  }
  for(const width of [320,360,390,768,1280]){
   await page.setViewportSize({width,height:900});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   assert(overflow<=2,width+'px overflow: '+overflow);
  }
  assert.deepEqual(errors,[]);
  console.log('V164_DIALOG_RACE_AND_LEARNING_PASS: previous close cannot erase new preview or steal focus; restored note, 11 subjects, five layouts');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
