const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
(async()=>{let browser,server;const url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8843/index.html';
 try{
  if(!process.env.STUDY_TEST_URL){server=spawn('python3',['-m','http.server','8843','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});let ready=false;for(let i=0;i<80;i++){try{if((await fetch(url)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}assert(ready)}
  browser=await chromium.launch(require('./browser-options.cjs'));
  const page=await browser.newPage();await page.goto(url);await page.waitForFunction(()=>READY&&studyTableBackup);
  await page.evaluate(()=>openNotebook());
  const payload={version:1,notes:[{text:'A note from the old notebook',path:'',subject:'Notebook',when:42}],bookmarks:[]};
  for(let i=0;i<4;i++){
   await page.locator('#exportNotes').click();
   await page.locator('#v124BackupClose').click();
   await page.locator('#importNotes').setInputFiles({name:'old-notebook.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});
   await page.locator('#v124BackupPreview').waitFor({state:'visible',timeout:5000});
   assert.equal(await page.locator('#v124BackupDialog').evaluate(d=>d.open),true,'Import reopened dialog');
   await page.evaluate(()=>document.getElementById('v124BackupDialog').dispatchEvent(new Event('close')));
   assert.equal(await page.locator('#v124BackupPreview').isVisible(),true,'A late close event cannot erase a freshly reopened preview');
   assert.equal(await page.locator('#v124Apply').isDisabled(),false);
   assert.equal(await page.evaluate(()=>getNoteData().length),0,'Preview must never apply imported notes');
   await page.locator('#v124BackupClose').click();
  }
  console.log('BACKUP_REOPEN_RACE_PASS: legacy notebook import survives rapid dialog reopen and late close event; preview remains uncommitted.');
 }finally{await browser?.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exitCode=1});