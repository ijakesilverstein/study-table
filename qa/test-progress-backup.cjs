const edition=Number(require('../package.json').version.split('.')[0]);
const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict'),fs=require('fs');
(async()=>{let browser,server;const url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8796/index.html',errors=[];
 try{
  if(!process.env.STUDY_TEST_URL){server=spawn('python3',['-m','http.server','8796','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});for(let i=0;i<50;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}}
  browser=await chromium.launch(require('./browser-options.cjs'));
  const make=async()=>{const c=await browser.newContext({acceptDownloads:true,viewport:{width:1280,height:900}}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.waitForFunction(()=>READY&&window.studyTableBackup&&document.getElementById('v124BackupHome'));return p};
  const p=await make();
  const seed=await p.evaluate(()=>{
   const key=(s,p)=>'studytable:full-course:'+s+':'+(['project-part','workshop-part'].includes(p)?'reading:':'')+p,records={};
   for(const c of studyTableFullCourses.courses){records[key(c.subject,'reading')]=c.workshopId;records[key(c.subject,'progress')]=JSON.stringify({[c.unitIds[0]]:{seen:true,recall:'review'},[c.unitIds[1]]:{seen:true,recall:'ok'}});records[key(c.subject,'project-part')]='3';records[key(c.subject,'workshop-part')]='2'}
   records['studytable:full-course:last']=JSON.stringify({subject:'business',unit:studyTableFullCourses.courses.find(c=>c.subject==='business').workshopId});
   records['studytable_v102_learning']=JSON.stringify({schema:1,records:{'piano-1':{attempts:3,independent:1,last:100,next:200,transferDraft:'Keep <b>literal text</b> and x < y',selfReported:true}}});
   records['study-table-v19:notes']=JSON.stringify([{text:'Unicode: café ∫ and <img src=x onerror="window.backupXSS=1">',path:'',subject:'Notebook',when:100}]);
   records['study-table-v19:bookmarks']=JSON.stringify(['curricula/calculus.html#functions']);records['study-table-v19:recent']=JSON.stringify(['curricula/business.html']);records['study-table-v19:last']=JSON.stringify('curricula/medicine.html#homeostasis');
   records['study-table-v19:v21:finished:spanish']=JSON.stringify([0]);records['study-table-v19:v21:teachback:spanish:0']=JSON.stringify('My own explanation');
   for(const [k,v] of Object.entries(records))localStorage.setItem(k,v);localStorage.setItem('unrelated-private-key','do not export or touch');
   window.studyTableInvalidateShellCache();return records;
  });
  await p.locator('#v124BackupHome').click();const download=p.waitForEvent('download');await p.locator('#v124Export').click();const file=await download;assert.equal(file.suggestedFilename(),'study-table-progress-v'+edition+'.json');const payload=JSON.parse(fs.readFileSync(await file.path(),'utf8'));
  assert.equal(payload.schemaVersion,1);assert.equal(payload.format,'study-table-backup');assert(!('unrelated-private-key' in payload.records));for(const [k,v] of Object.entries(seed))assert.deepEqual(k.endsWith(':reading')?payload.records[k]:JSON.parse(payload.records[k]),k.endsWith(':reading')?v:JSON.parse(v),k);
  const q=await make();await q.evaluate(()=>studyTableBackup.open());await q.locator('#v124File').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});await q.locator('#v124BackupPreview').waitFor({state:'visible'});
  assert.match(await q.locator('#v124FileInfo').innerText(),/progress.json/);assert.equal(await q.evaluate(()=>localStorage.getItem('studytable:full-course:spanish:reading')),null,'preview wrote data');await q.locator('#v124Apply').click();assert.match(await q.locator('#v124BackupStatus').innerText(),/Saved the restored work/);assert.equal(await q.locator('#v124BackupPreview').isVisible(),false);
  const restored=await q.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),Object.keys(seed));
  for(const [k,v] of Object.entries(seed))assert.deepEqual(k.endsWith(':reading')?restored[k]:JSON.parse(restored[k]),k.endsWith(':reading')?v:JSON.parse(v),k);
  await q.locator('#v124Undo').click();assert.match(await q.locator('#v124BackupStatus').innerText(),/values from before/);assert.equal(await q.evaluate(()=>localStorage.getItem('studytable:full-course:spanish:reading')),null);
  await q.locator('#v124File').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});await q.locator('#v124BackupPreview').waitFor({state:'visible'});await q.locator('#v124Apply').click();
  assert.equal(await q.evaluate(x=>studyTableBackup.prepare(x).updates.length,payload),0,'repeat import must be idempotent');
  await q.locator('#v124BackupClose').click();await q.reload();await q.waitForFunction(()=>READY&&window.studyTableBackup);await q.locator('#v90Continue').click();await q.waitForFunction(()=>document.getElementById('frame')?.contentWindow.studyTableFullCourse?.subject==='business'&&document.getElementById('frame').contentWindow.document.querySelector('#workshopChapter')?.dataset.chapter==='2');
  for(const subject of ['spanish','piano','chess','calculus','physics','medicine','business']){await q.evaluate(s=>studyTableFullCourses.open(s,'project'),subject);await q.waitForFunction(s=>document.getElementById('frame')?.contentWindow.studyTableFullCourse?.subject===s&&document.getElementById('frame').contentWindow.document.querySelector('#projectPart')?.dataset.projectPart==='3',subject)}
  await q.evaluate(()=>openNotebook());assert.equal(await q.locator('#savedNotes img').count(),0);assert.match(await q.locator('#savedNotes').innerText(),/<img/);assert.equal(await q.evaluate(()=>window.backupXSS),undefined);await q.locator('#notebookClose').click();
  console.log('BACKUP_SEVEN_COURSES_NOTES_ACTUAL_DOWNLOAD_PREVIEW_UNDO_RESUME_AND_XSS_PASS');
  const r=await make();
  const results=await r.evaluate(payload=>{
   const api=studyTableBackup,snapshot=()=>JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))),out=[];
   const assessment='studytable_v102_learning';localStorage.setItem(assessment,JSON.stringify({schema:1,records:{'piano-1':{attempts:9,independent:2,last:900,repair:'Local work'}}}));
   let plan=api.prepare(payload);api.apply(plan);let state=JSON.parse(localStorage.getItem(assessment));out.push(state.records['piano-1'].attempts===9&&state.records['piano-1'].independent===2&&state.records['piano-1'].repair==='Local work');
   plan=api.prepare(payload,true);api.apply(plan);state=JSON.parse(localStorage.getItem(assessment));out.push(state.records['piano-1'].attempts===3&&state.records['piano-1'].independent===1);out.push(api.prepare(payload,true).updates.length===0);
   localStorage.setItem(assessment,JSON.stringify({schema:1,records:{'piano-1':{attempts:10,last:1000}}}));const before=snapshot();try{api.undo();out.push(false)}catch(e){out.push(/New work/.test(e.message)&&snapshot()===before)}
   for(const invalid of [
    {...payload,records:{...payload.records,'unrelated-private-key':'"bad"'}},
    {...payload,records:{'studytable:full-course:spanish:progress':'{"__proto__":{"seen":true}}'}},
    {...payload,records:{'studytable:full-course:spanish:progress':'{"unknown-unit":{"seen":true}}'}},
    {...payload,records:{'studytable:full-course:spanish:reading:workshop-part':'9'}},
    {...payload,records:{'studytable:full-course:last':'{"subject":"constructor","unit":"x"}'}},
    {...payload,records:{'study-table-v19:bookmarks':'["curricula/physics.html?x=%3Cscript%3E"]'}},
    {schema:1,records:{'piano-1':{attempts:-1}}}
   ]){const before=snapshot();try{api.prepare(invalid);out.push(false)}catch{out.push(snapshot()===before)}}
   try{api.apply({before:{},updates:[['unrelated-private-key','"bad"']]});out.push(false)}catch{out.push(true)}
   plan=api.prepare(payload,true);const ckey='studytable:full-course:spanish:progress';localStorage.setItem(ckey,JSON.stringify({'spanish-0':{seen:true,recall:''}}));const changed=snapshot();try{api.apply(plan);out.push(false)}catch(e){out.push(/changed after/.test(e.message)&&snapshot()===changed)}
   return out;
  },payload);assert(results.every(Boolean),JSON.stringify(results));
  console.log('BACKUP_CONFLICT_CHOICES_NO_COUNTER_INFLATION_IDEMPOTENCE_STALE_PREVIEW_AND_INVALID_INPUT_PASS');
  const t=await make();const rollback=await t.evaluate(payload=>{
   const api=studyTableBackup;localStorage.setItem('unrelated-private-key','untouched');const snap=()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));const before=snap(),plan=api.prepare(payload),native=Storage.prototype.setItem;let calls=0,message='';
   Storage.prototype.setItem=function(k,v){if(this===localStorage&&++calls===2)throw new DOMException('Full','QuotaExceededError');return native.call(this,k,v)};
   try{api.apply(plan)}catch(e){message=e.message}finally{Storage.prototype.setItem=native}
   return {before,after:snap(),message};
  },payload);assert.deepEqual(rollback.after,rollback.before);assert.match(rollback.message,/previous values were restored/);
  const memory=await t.evaluate(()=>{
   const api=studyTableBackup,note={text:'A note held in this session',path:'',subject:'Notebook',when:1234},native=Storage.prototype.setItem;
   Storage.prototype.setItem=function(k,v){if(k==='study-table-v19:notes')throw new DOMException('Full','QuotaExceededError');return native.call(this,k,v)};
   try{safeStore.set('notes',[note])}finally{Storage.prototype.setItem=native}
   const saved=api.collect(),other={...saved,records:{'studytable_v102_learning':JSON.stringify({schema:1,records:{'piano-1':{attempts:1,last:3}}})}};api.apply(api.prepare(other));return {note,exported:JSON.parse(saved.records['study-table-v19:notes']),retained:getNoteData()};
  });assert.deepEqual(memory.exported,[memory.note]);assert.deepEqual(memory.retained,[memory.note]);
  const memoryStale=await t.evaluate(()=>{
   const api=studyTableBackup,file={format:'study-table-backup',schemaVersion:1,records:{'study-table-v19:notes':JSON.stringify([{text:'from file',path:'',subject:'Notebook',when:99}])}},plan=api.prepare(file),native=Storage.prototype.setItem;
   Storage.prototype.setItem=function(k,v){if(k==='study-table-v19:notes')throw Error('full');return native.call(this,k,v)};
   try{safeStore.set('notes',[{text:'new session note',path:'',subject:'Notebook',when:888}])}finally{Storage.prototype.setItem=native}
   try{api.apply(plan);return false}catch(e){return /changed after/.test(e.message)&&getNoteData()[0].text==='new session note'}
  });assert(memoryStale);
  const sessionUndo=await t.evaluate(()=>{
   const api=studyTableBackup,before=getNoteData(),file={format:'study-table-backup',schemaVersion:1,records:{'study-table-v19:notes':JSON.stringify([{text:'from file',path:'',subject:'Notebook',when:99}])}};
   api.apply(api.prepare(file));api.undo();return {before,after:getNoteData()};
  });assert.deepEqual(sessionUndo.after,sessionUndo.before,'Undo must retain notes that existed only in session memory');
  console.log('BACKUP_QUOTA_ROLLBACK_SESSION_ONLY_NOTES_AND_CACHE_CONFLICT_PASS');
  const u=await make();const legacy=await u.evaluate(()=>{
   const api=studyTableBackup,forms=[{format:'studytable-progress',version:57,records:{studytable_v35_progress:{'spanish:0':{seen:true}}}},{schema:1,records:{'spanish-0':{attempts:1,last:2}}},{version:1,notes:[{text:'older notebook',path:'',subject:'Notebook',when:4}],bookmarks:[]},{version:2,notes:[],bookmarks:[],guided:{progress:{spanish:[0]},teachbacks:{'spanish:0':'An older explanation'},last:{subject:'spanish',index:0},lastMode:'guided'}}];
   for(const f of forms)api.apply(api.prepare(f));return {notes:getNoteData(),guided:JSON.parse(localStorage.getItem('study-table-v19:v21:finished:spanish')),text:JSON.parse(localStorage.getItem('study-table-v19:v21:teachback:spanish:0'))};
  });assert(legacy.notes.some(n=>n.text==='older notebook'));assert.deepEqual(legacy.guided,[0]);assert.equal(legacy.text,'An older explanation');
  const fallback=await u.evaluate(()=>{
   const c=studyTableFullCourses.courses.find(c=>c.subject==='medicine'),key='studytable:full-course:medicine:progress',fk='study-table-v19:course-store:'+c.path;
   localStorage.setItem(fk,JSON.stringify({[key]:JSON.stringify({homeostasis:{seen:true,recall:'review'}})}));localStorage.removeItem(key);const file=studyTableBackup.collect();return {key,fk,file};
  });assert(fallback.file.records[fallback.key]);const v=await make();await v.evaluate(file=>studyTableBackup.apply(studyTableBackup.prepare(file)),fallback.file);assert.equal(await v.evaluate(k=>JSON.parse(localStorage.getItem(k)).homeostasis.recall,fallback.key),'review');assert.equal(await v.evaluate(([fk,k])=>JSON.parse(JSON.parse(localStorage.getItem(fk))[k]).homeostasis.recall,[fallback.fk,fallback.key]),'review');
  const legacyUI=await make();await legacyUI.evaluate(()=>openNotebook());
  const oldExport=legacyUI.waitForEvent('download');await legacyUI.locator('#exportNotes').click();assert.equal((await oldExport).suggestedFilename(),'study-table-progress-v'+edition+'.json');await legacyUI.locator('#v124BackupClose').click();
  await legacyUI.locator('#importNotes').setInputFiles({name:'older-notebook.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,notes:[{text:'Import waits for my choice',path:'',subject:'Notebook',when:100}],bookmarks:[]}))});
  await legacyUI.locator('#v124BackupPreview').waitFor({state:'visible'});assert.equal(await legacyUI.evaluate(()=>getNoteData().length),0,'Old import UI must also wait for Apply');await legacyUI.locator('#v124Apply').click();assert.equal(await legacyUI.evaluate(()=>getNoteData()[0].text),'Import waits for my choice');
  console.log('BACKUP_OLDER_FORMATS_AND_OFFLINE_STORAGE_FACADE_TRANSFER_PASS');
  const failure=await make();await failure.evaluate(()=>studyTableBackup.open());await failure.locator('#v124File').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});await failure.locator('#v124BackupPreview').waitFor({state:'visible'});
  await failure.evaluate(()=>{window.backupOriginalSet=Storage.prototype.setItem;window.backupOriginalRemove=Storage.prototype.removeItem;let calls=0;Storage.prototype.setItem=function(k,v){if(this===localStorage&&++calls>=2)throw Error('blocked');return backupOriginalSet.call(this,k,v)};Storage.prototype.removeItem=function(){throw Error('blocked')}});
  await failure.locator('#v124Apply').click();assert.match(await failure.locator('#v124BackupStatus').innerText(),/some previous values could not be written back/);assert(await failure.locator('#v124Recovery').isVisible());
  const recoveryDownload=failure.waitForEvent('download');await failure.locator('#v124Recovery').click();const savedRecovery=JSON.parse(fs.readFileSync(await (await recoveryDownload).path(),'utf8'));assert.equal(savedRecovery.format,'study-table-backup');assert(!savedRecovery.records['studytable:full-course:spanish:reading']);
  await failure.evaluate(()=>{Storage.prototype.setItem=backupOriginalSet;Storage.prototype.removeItem=backupOriginalRemove});
  console.log('BACKUP_FAILED_ROLLBACK_PREVIOUS_DATA_RECOVERY_FILE_PASS');
  await p.locator('#v124BackupClose').click();await p.locator('#v101ToolsButton').click();await p.locator('[data-tool="v124OpenBackup"]').click();assert(await p.locator('#v124BackupDialog').evaluate(e=>e.matches(':modal')));
  await p.locator('#v124File').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});await p.locator('#v124BackupPreview').waitFor({state:'visible'});await p.locator('#v124Conflict').selectOption('file');await p.evaluate(()=>{const d=document.getElementById('v124BackupDialog');d.close();studyTableBackup.open()});assert.equal(await p.locator('#v124Apply').isDisabled(),true,'Reopening in the same browser task must clear a stale preview synchronously');assert.equal(await p.locator('#v124BackupPreview').isVisible(),false);assert.equal(await p.locator('#v124Conflict').inputValue(),'local');
  await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});for(const width of [320,360,390]){await p.setViewportSize({width,height:844});for(const theme of ['light','dark']){await p.evaluate(t=>studyTableTheme.set(t),theme);assert(await p.locator('#v124BackupDialog').evaluate(d=>d.scrollWidth<=d.clientWidth+1));const result=await p.evaluate(()=>axe.run({include:['#v124BackupDialog']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(result.violations.map(x=>({id:x.id,nodes:x.nodes.map(n=>n.target)})),[],width+'/'+theme)}}
  for(let i=0;i<20;i++){await p.keyboard.press(i%2?'Shift+Tab':'Tab');assert(await p.locator('#v124BackupDialog').evaluate(d=>d.contains(document.activeElement)))}await p.keyboard.press('Escape');assert.equal(await p.locator('#v124BackupDialog').evaluate(d=>d.open),false);
  assert.deepEqual(errors,[]);console.log('PROGRESS_BACKUP_PASS: actual export/import, all seven courses, notes and older formats, preview/conflict/Undo safety, quota recovery, storage contexts, keyboard and phone/both-theme accessibility.');
 }finally{if(browser)await browser.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
