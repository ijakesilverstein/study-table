// Portable learning records. Backups contain data, never executable lessons.
(function(){
 'use strict';
 const APP_VERSION=__APP_VERSION__,MAX=16*1024*1024,legacy=window.studyTableV94SafeRestore,quick=__QUICK_LESSONS__;
 const QUICK=new Set(quick.map(x=>x.id)),BAD=new Set(['__proto__','prototype','constructor']);
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k),object=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
 const courseList=()=>window.studyTableFullCourses.courses;
 const course=s=>typeof s==='string'?courseList().find(c=>c.subject===s):null;
 const courseKey=(s,part)=>'studytable:full-course:'+s+':'+(['project-part','workshop-part'].includes(part)?'reading:':'')+part;
 const notebook=['notes','bookmarks','recent','last'].map(s=>'study-table-v19:'+s);
 const legacyKeys=new Set([...legacy.known,'studytable_v56_recall']);
 let pending=null,lastUndo=null,recovery=null,returnFocus=null,readingFile=0;const plans=new WeakSet();
 const bytes=s=>new TextEncoder().encode(s).length;
 const canon=v=>JSON.stringify(v,(_,x)=>object(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
 function validTree(v,depth=0,budget={n:0}){
  if(depth>16||++budget.n>100000)throw Error('The file contains too much nested data.');
  if(v===null||typeof v==='boolean')return;
  if(typeof v==='number'){if(!Number.isFinite(v))throw Error('A saved number is invalid.');return}
  if(typeof v==='string'){if(v.length>MAX)throw Error('A saved text field is too large.');return}
  if(Array.isArray(v)){if(v.length>10000)throw Error('A saved list is too long.');for(const x of v)validTree(x,depth+1,budget);return}
  if(!object(v)||Object.keys(v).length>10000)throw Error('A saved section is invalid.');
  for(const [k,x] of Object.entries(v)){if(BAD.has(k)||k.length>300)throw Error('The file contains an unsafe record name.');validTree(x,depth+1,budget)}
 }
 function pathOK(path,empty=false){
  if(typeof path!=='string'||path.length>1000)return false;if(empty&&path==='')return true;
  let decoded=path;try{for(let i=0;i<2;i++)decoded=decodeURIComponent(decoded)}catch{return false}
  return !/[<>\u0000-\u001f]/.test(decoded)&&!/(?:javascript|data)\s*:/i.test(decoded)&&typeof FILES!=='undefined'&&own(FILES,splitPath(path));
 }
 function unitOK(c,id){return typeof id==='string'&&(c.unitIds.includes(id)||id===c.projectId||id===c.workshopId||id==='project'||id==='workshop'&&!!c.workshopId||own(c.aliases||{},id))}
 function kind(key){
  for(const c of courseList())for(const part of ['progress','reading','project-part','workshop-part'])if(key===courseKey(c.subject,part))return {part,c};
  if(key==='studytable:full-course:last')return {part:'course-last'};
  if(key==='studytable_v108_reading_place')return {part:'quick-place'};
  if(notebook.includes(key))return {part:key.slice('study-table-v19:'.length),notebook:true};
  if(key.startsWith('study-table-v19:course-store:')&&pathOK(key.slice('study-table-v19:course-store:'.length)))return {part:'fallback'};
  let m=key.match(/^study-table-v19:v21:finished:(spanish|piano|chess|life|medicine|business|books)$/);if(m)return {part:'guided-finished',subject:m[1]};
  m=key.match(/^study-table-v19:v21:teachback:(spanish|piano|chess|life|medicine|business|books):(0|[1-9]\d*)$/);if(m&&Number(m[2])<window.studyTableGuidedLength(m[1]))return {part:'guided-text'};
  if(key==='study-table-v19:v21:lastGuided')return {part:'guided-place'};
  if(key==='study-table-v19:v21:lastMode')return {part:'guided-mode'};
  if(key==='study-table-v19:v22:remember:v1')return {part:'shell'};
  if(legacyKeys.has(key))return {part:'legacy'};
  throw Error('This file contains a section this edition does not recognize. Use the same or a newer edition.');
 }
 function decode(key,raw){
  if(typeof raw!=='string'||bytes(raw)>MAX)throw Error('A saved section is invalid or too large.');
  const k=kind(key);if(k.part==='reading'){if(!unitOK(k.c,raw))throw Error('A course reading place is not recognized.');return raw}
  if(k.part==='project-part'||k.part==='workshop-part'){if(!/^[0-3]$/.test(raw))throw Error('A saved project or workshop chapter is invalid.');return Number(raw)}
  let v;try{v=JSON.parse(raw)}catch{throw Error('A saved section is not readable JSON.')}
  validTree(v);
  if(k.part==='progress'){
   if(!object(v))throw Error('Course review marks must be an object.');
   for(const [id,r] of Object.entries(v)){if(!k.c.unitIds.includes(id)||!object(r)||Object.keys(r).some(p=>!['seen','recall'].includes(p))||own(r,'seen')&&typeof r.seen!=='boolean'||own(r,'recall')&&!['','ok','review'].includes(r.recall))throw Error('A course review mark is invalid or belongs to a newer unit.')}
  }else if(k.part==='course-last'){
   const c=object(v)&&course(v.subject);if(!c||!unitOK(c,v.unit)||Object.keys(v).some(p=>!['subject','unit','title'].includes(p))||own(v,'title')&&(typeof v.title!=='string'||v.title.length>300))throw Error('The saved course resume place is invalid.');
  }else if(k.part==='quick-place'){
   if(!object(v)||!QUICK.has(v.id)||!quick.some(q=>q.id===v.id&&q.subject===v.subject)||own(v,'mode')&&v.mode!=='quick')throw Error('The saved short-lesson place is invalid.');
  }else if(k.notebook){
   if(k.part==='last'){if(!pathOK(v,true))throw Error('The saved notebook place is invalid.')}
   else if(!Array.isArray(v)||v.length>(k.part==='notes'?5000:1000))throw Error('The notebook list is invalid or too long.');
   else if(k.part==='notes')for(const n of v){if(!object(n)||typeof n.text!=='string'||n.text.length>50000||!pathOK(n.path,true)||typeof n.subject!=='string'||n.subject.length>200||!['number','string'].includes(typeof n.when)||!Number.isFinite(new Date(n.when).getTime()))throw Error('A notebook note is invalid.')}
   else if(v.some(p=>!pathOK(p)))throw Error('A saved notebook link is invalid.');
  }else if(k.part==='fallback'){
   if(!object(v))throw Error('An offline course record is invalid.');
   for(const [childKey,value] of Object.entries(v)){
    if(typeof value!=='string'||value.length>2000000)throw Error('An offline course value is invalid.');
    if(courseList().some(c=>['progress','reading','project-part','workshop-part'].some(p=>courseKey(c.subject,p)===childKey)))decode(childKey,value);
    else {let parsed=value;try{parsed=JSON.parse(value)}catch{}legacy.validate(parsed)}
   }
  }else if(k.part==='guided-finished'){
   if(!Array.isArray(v)||v.some(i=>!Number.isInteger(i)||i<0||i>=window.studyTableGuidedLength(k.subject)))throw Error('An earlier guided-course place is invalid.');
  }else if(k.part==='guided-text'){
   if(typeof v!=='string'||v.length>10000)throw Error('An earlier teach-back note is invalid.');
  }else if(k.part==='guided-place'){
   if(!object(v)||!Number.isInteger(v.index)||v.index<0||v.index>=window.studyTableGuidedLength(v.subject))throw Error('An earlier guided resume place is invalid.');
  }else if(k.part==='guided-mode'){
   if(!['guided','original'].includes(v))throw Error('An earlier reading mode is invalid.');
  }else if(k.part==='shell'){legacy.validate(v);
  }else if(k.part==='legacy'){
   if(!object(v))throw Error('An earlier progress section must be an object.');if(key!=='studytable_v102_learning')legacy.validate(v);
   if(key==='studytable_v102_learning'){
    if(v.schema!==1||!object(v.records))throw Error('The learning record format is invalid.');
    for(const [id,r] of Object.entries(v.records)){
     if(!QUICK.has(id)||!object(r))throw Error('A learning record belongs to an unknown lesson.');
     for(const p of ['attempts','independent','assisted','last','next','interval'])if(own(r,p)&&(!Number.isFinite(r[p])||r[p]<0))throw Error('A learning record has an invalid count or date.');
     for(const p of ['selfReported','lastIndependent','needsWork'])if(own(r,p)&&typeof r[p]!=='boolean')throw Error('A saved learning flag is invalid.');
     if(own(r,'confidence')&&!['unsure','partly','sure'].includes(r.confidence))throw Error('A saved confidence choice is invalid.');
     for(const p of ['predictionDraft','transferDraft','repair'])if(own(r,p)&&(typeof r[p]!=='string'||r[p].length>12000))throw Error('A saved learning draft is invalid.');
    }
   }
  }
  return v;
 }
 function merge(a,b,fileWins=false){
  if(object(a)&&object(b)){const out=Object.assign(Object.create(null),a);for(const [k,v] of Object.entries(b))out[k]=own(a,k)?merge(a[k],v,fileWins):v;return out}
  if(Array.isArray(a)&&Array.isArray(b)){const out=a.slice(),seen=new Set(out.map(canon));for(const x of b){const id=canon(x);if(!seen.has(id)){seen.add(id);out.push(x)}}return out}
  return fileWins?b:a;
 }
 function combine(key,a,b,fileWins){
  const k=kind(key);
  if(k.part==='reading'||k.part==='project-part'||k.part==='workshop-part'||k.part==='course-last'||k.part==='quick-place'||k.part==='guided-place')return fileWins?b:a;
  if(key==='studytable_v102_learning'){
   const records=Object.assign(Object.create(null),a.records);for(const [id,r] of Object.entries(b.records))if(!own(records,id)||fileWins)records[id]=r;
   return {...a,schema:1,records}; // A whole attempt record wins; counters are never added.
  }
  const value=merge(a,b,fileWins);
  if(k.part==='progress')for(const id of Object.keys(value))if(a[id]?.seen||b[id]?.seen)value[id]={...value[id],seen:true};
  return value;
 }
 const rawValue=(key,value)=>kind(key).part==='reading'?value:JSON.stringify(value);
 function expand(records){
  const out=Object.assign(Object.create(null),records);
  for(const c of courseList()){
   const fk='study-table-v19:course-store:'+c.path;
   let fallback=own(out,fk)?decode(fk,out[fk]):Object.create(null),changed=false;
   for(const p of ['progress','reading','project-part','workshop-part']){
    const key=courseKey(c.subject,p);
    if(!own(out,key)&&own(fallback,key)){out[key]=fallback[key];changed=true}
    if(own(out,key)){if(p==='progress'&&own(fallback,key))out[key]=rawValue(key,combine(key,decode(key,out[key]),decode(key,fallback[key]),false));fallback={...fallback,[key]:out[key]};changed=true}
   }
   if(changed)out[fk]=JSON.stringify(fallback);
  }
  return out;
 }
 function keys(){
  const set=new Set([...legacyKeys,...notebook,'studytable:full-course:last','studytable_v108_reading_place']);
  for(const c of courseList())for(const p of ['progress','reading','project-part','workshop-part'])set.add(courseKey(c.subject,p));
  for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&(key.startsWith('study-table-v19:course-store:')||key.startsWith('study-table-v19:v21:')||key==='study-table-v19:v22:remember:v1')){try{kind(key);set.add(key)}catch{}}}
  return set;
 }
 function collect(){
  if(typeof READY!=='undefined'&&!READY)throw Error('Wait for the lessons to finish loading, then try again.');
  const records=Object.create(null);for(const key of keys()){const raw=localStorage.getItem(key);if(raw!==null)records[key]=raw}
  for(const [short,value] of Object.entries(window.studyTableShellMemory?.()||{})){const key='study-table-v19:'+short;if(notebook.includes(key)||short.startsWith('course-store:')||short.startsWith('v21:')||short==='v22:remember:v1'){try{kind(key);records[key]=JSON.stringify(value)}catch{}}}
  // Mirror the seven readers' fallback records so a file can move between storage contexts.
  return {format:'study-table-backup',schemaVersion:1,appVersion:APP_VERSION,exportedAt:new Date().toISOString(),records:expand(records)};
 }
 function parse(payload){
  validTree(payload);let records;
  if(object(payload)&&payload.format==='study-table-backup'&&payload.schemaVersion===1&&object(payload.records))records=payload.records;
  else if(object(payload)&&payload.format==='studytable-progress'&&[56,57].includes(payload.version)&&object(payload.records))records=Object.fromEntries(Object.entries(payload.records).map(([k,v])=>[k,JSON.stringify(v)]));
  else if(object(payload)&&payload.schema===1&&object(payload.records))records={'studytable_v102_learning':JSON.stringify(payload)};
  else if(object(payload)&&[1,2].includes(payload.version)&&Array.isArray(payload.notes)&&Array.isArray(payload.bookmarks)){records={'study-table-v19:notes':JSON.stringify(payload.notes),'study-table-v19:bookmarks':JSON.stringify(payload.bookmarks)};if(payload.recent)records['study-table-v19:recent']=JSON.stringify(payload.recent);
   if(payload.version===2&&payload.guided){const g=payload.guided;if(g.progress)for(const [subject,v] of Object.entries(g.progress))records['study-table-v19:v21:finished:'+subject]=JSON.stringify(v);if(g.teachbacks)for(const [id,v] of Object.entries(g.teachbacks))records['study-table-v19:v21:teachback:'+id]=JSON.stringify(v);if(g.last)records['study-table-v19:v21:lastGuided']=JSON.stringify(g.last);if(g.lastMode)records['study-table-v19:v21:lastMode']=JSON.stringify(g.lastMode)}
  }
  else throw Error('Choose a Study Table progress or notebook backup.');
  if(!Object.keys(records).length)throw Error('This file contains no saved records.');
  for(const [key,raw] of Object.entries(records))decode(key,raw);
  return expand(records);
 }
 function prepare(payload,fileWins=false){
  const currentRecords=collect().records,logicalBefore=Object.create(null);
  const incoming=parse(payload),before=Object.create(null),updates=[],groups={courses:0,notebook:0,earlier:0};let conflicts=0;
  for(const [key,raw] of Object.entries(incoming)){
   const k=kind(key),old=localStorage.getItem(key),effective=own(currentRecords,key)?currentRecords[key]:null;before[key]=old;logicalBefore[key]=effective;const imported=decode(key,raw);let result=imported;
   if(effective!==null){const current=decode(key,effective);if(canon(current)!==canon(imported))conflicts++;result=combine(key,current,imported,fileWins)}
   const value=rawValue(key,result);decode(key,value);
   if(old===null||canon(decode(key,old))!==canon(result)){updates.push([key,value]);groups[k.c||k.part==='course-last'?'courses':k.notebook?'notebook':'earlier']++}
  }
  // Canonical course records also update fallback facades, with the same chosen result.
  const map=Object.fromEntries(updates);
  for(const c of courseList()){
   const changed=['progress','reading','project-part','workshop-part'].map(p=>courseKey(c.subject,p)).filter(k=>own(map,k));if(!changed.length)continue;
   const fk='study-table-v19:course-store:'+c.path,old=localStorage.getItem(fk);if(!own(before,fk))before[fk]=old;
   logicalBefore[fk]=own(currentRecords,fk)?currentRecords[fk]:null;const source=own(map,fk)?decode(fk,map[fk]):logicalBefore[fk]===null?{}:decode(fk,logicalBefore[fk]),value=JSON.stringify({...source,...Object.fromEntries(changed.map(k=>[k,map[k]]))});
   const at=updates.findIndex(([k])=>k===fk);if(at<0)updates.push([fk,value]);else updates[at]=[fk,value];decode(fk,value);
  }
  for(const name of Object.keys(groups))groups[name]=0;for(const [key] of updates){const k=kind(key);groups[k.c||k.part==='course-last'?'courses':k.notebook?'notebook':'earlier']++}const plan=Object.freeze({before:Object.freeze(before),logicalBefore:Object.freeze(logicalBefore),updates:Object.freeze(updates.map(pair=>Object.freeze(pair))),groups:Object.freeze(groups),conflicts,fileWins,records:Object.keys(incoming).length});plans.add(plan);return plan;
 }
 function invalidate(keys){window.studyTableInvalidateShellCache?.(keys)}
 function rollback(attempted,before){
  let ok=true;for(const key of attempted)try{localStorage.removeItem(key)}catch{ok=false}
  for(const key of attempted)if(before[key]!==null)try{localStorage.setItem(key,before[key])}catch{ok=false}
  try{return attempted.every(key=>localStorage.getItem(key)===before[key])}catch{return false}
 }
 function apply(plan){
  if(!plan||!plans.has(plan))throw Error('Preview the file before restoring.');plans.delete(plan);
  for(const [key,raw] of Object.entries(plan.before))if(localStorage.getItem(key)!==raw)throw Error('Saved work changed after the preview. Preview the file again before restoring.');
  const currentRecords=collect().records;for(const [key,raw] of Object.entries(plan.logicalBefore))if((own(currentRecords,key)?currentRecords[key]:null)!==raw)throw Error('Saved work changed after the preview. Preview the file again before restoring.');
  if(!plan.updates.length)return {count:0,message:'This file adds no changes with your selected conflict choice.'};
  recovery=collect();const cachedBefore=window.studyTableShellMemory?.()||{},attempted=[];
  try{for(const [key,raw] of plan.updates){attempted.push(key);localStorage.setItem(key,raw)}for(const [key,raw] of plan.updates)if(localStorage.getItem(key)!==raw)throw Error('Save verification failed.')}
  catch{const ok=rollback(attempted,plan.before);throw Error(ok?'The browser could not save the restore. The previous values were restored.':'The restore could not finish, and some previous values could not be written back. Keep this page open and save the previous-data copy below.')}
  lastUndo={before:Object.fromEntries(plan.updates.map(([key])=>[key,key.startsWith('study-table-v19:')&&own(cachedBefore,key.slice('study-table-v19:'.length))?JSON.stringify(cachedBefore[key.slice('study-table-v19:'.length)]):plan.before[key]])),after:Object.fromEntries(plan.updates)};invalidate(plan.updates.map(([key])=>key));
  return {count:plan.updates.length,message:'Saved the restored work. Reload to refresh open exercises. Undo is available in this page session until you change these records.'};
 }
 function undo(){
  if(!lastUndo)throw Error('There is no restore to undo in this page session.');
  for(const [key,value] of Object.entries(lastUndo.after))if(localStorage.getItem(key)!==value)throw Error('New work was saved after the restore. Undo will not replace it. Save a backup of your current work first.');
  const currentRecords=collect().records;for(const [key,value] of Object.entries(lastUndo.after))if(!own(currentRecords,key)||canon(decode(key,currentRecords[key]))!==canon(decode(key,value)))throw Error('New work was saved after the restore. Undo will not replace it. Save a backup of your current work first.');
  const attempted=Object.keys(lastUndo.before),after=lastUndo.after;
  if(!rollback(attempted,lastUndo.before)){rollback(attempted,after);throw Error('The browser could not complete Undo. Keep this page open and save the previous-data copy.')}
  lastUndo=null;invalidate(attempted);return 'The values from before this restore are back. Reload to refresh open exercises.';
 }
 function download(payload,name='study-table-progress-v'+APP_VERSION+'.json'){
  const text=JSON.stringify(payload,null,2);if(bytes(text)>MAX)throw Error('This backup exceeds 16 MB.');
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.hidden=true;dialog().append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
 }
 function status(message){document.getElementById('v124BackupStatus').textContent=message;document.getElementById('v124Undo').disabled=!lastUndo;document.getElementById('v124Recovery').hidden=!recovery}
 function summary(plan){
  const area=document.getElementById('v124BackupPreview');area.replaceChildren();const h=document.createElement('h3');h.textContent='Review this restore';area.append(h);
  const p=document.createElement('p');p.textContent=plan.updates.length+' saved sections would change. '+plan.conflicts+' sections differ from work already in this browser. Nothing has changed yet.';area.append(p);
  const list=document.createElement('ul');for(const [key,label] of [['courses','Full-course places and review marks'],['notebook','Notebook and saved places'],['earlier','Practice records and offline course records']]){const item=document.createElement('li');item.textContent=label+': '+plan.groups[key];list.append(item)}area.append(list);
  document.getElementById('v124Apply').disabled=!plan.updates.length;area.hidden=false;
 }
 async function readFile(file){
  const generation=++readingFile;pending=null;document.getElementById('v124Apply').disabled=true;document.getElementById('v124BackupPreview').hidden=true;document.getElementById('v124FileInfo').hidden=true;
  try{if(!file)return;if(file.size>MAX)throw Error('Progress files must be smaller than 16 MB.');const text=await file.text();if(generation!==readingFile)return;const payload=JSON.parse(text);const plan=prepare(payload,document.getElementById('v124Conflict').value==='file');pending={payload,plan};const info=document.getElementById('v124FileInfo'),date=typeof payload.exportedAt==='string'?new Date(payload.exportedAt):null;info.textContent=file.name.slice(0,300)+(date&&Number.isFinite(date.getTime())?' • saved '+date.toLocaleString():'');info.hidden=false;summary(plan);status('Check the preview and conflict choice, then choose Apply restore.')}
  catch(e){if(generation===readingFile)status('Could not preview: '+e.message)}
 }
 function dialog(){
  let d=document.getElementById('v124BackupDialog');if(d)return d;
  d=document.createElement('dialog');d.id='v124BackupDialog';d.setAttribute('aria-labelledby','v124BackupTitle');
  d.innerHTML='<header><h2 id="v124BackupTitle">Back up your learning</h2><button type="button" id="v124BackupClose">Close</button></header><p>Save your course places, review marks, notebook and practice records in a progress file. To move them, open Study Table in the other browser and restore that file.</p><button type="button" id="v124Export">Save a backup file</button><hr><h3>Restore a saved file</h3><label for="v124File">Choose a progress or notebook backup</label><input type="file" id="v124File" accept=".json,application/json"><p id="v124FileInfo" class="v124-note" hidden></p><label for="v124Conflict">When the same item differs</label><select id="v124Conflict"><option value="local">Keep this browser’s item</option><option value="file">Use the file’s item</option></select><p class="v124-note">New notes and items are merged. Main lesson attempts are kept as whole records. Practice counters are never added together. Reading and self-review marks stay separate from assessed results.</p><section id="v124BackupPreview" hidden></section><div class="v124-actions"><button type="button" id="v124Apply" disabled>Apply restore</button><button type="button" id="v124Undo" disabled>Undo last restore</button><button type="button" id="v124Reload">Reload the app</button></div><p id="v124BackupStatus" role="status" aria-live="polite"></p><button type="button" id="v124Recovery" hidden>Save the copy from before restoring</button>';
  document.body.append(d);
  d.querySelector('#v124BackupClose').onclick=()=>d.close();
  d.addEventListener('close',()=>{if(d.open)return;/* A queued close from a previous session must not cancel a freshly reopened import. */ readingFile++;pending=null;d.querySelector('#v124Apply').disabled=true;d.querySelector('#v124BackupPreview').hidden=true;d.querySelector('#v124FileInfo').hidden=true;d.querySelector('#v124Conflict').value='local';if(returnFocus?.isConnected&&returnFocus.getClientRects().length)returnFocus.focus();else document.getElementById('v101ToolsButton')?.focus()});
  d.querySelector('#v124Export').onclick=()=>{try{download(collect());status('Your progress file is ready to save. Keep a copy somewhere you can find on the other device.')}catch(e){status('Could not save a backup: '+e.message)}};
  d.querySelector('#v124File').onchange=e=>{readFile(e.target.files?.[0]);e.target.value=''};
  d.querySelector('#v124Conflict').onchange=()=>{if(!pending)return;try{pending.plan=prepare(pending.payload,d.querySelector('#v124Conflict').value==='file');summary(pending.plan);status('Preview updated. Apply restore to save these changes.')}catch(e){pending=null;d.querySelector('#v124Apply').disabled=true;status('Could not preview: '+e.message)}};
  d.querySelector('#v124Apply').onclick=()=>{try{if(!pending)throw Error('Choose and preview a file first.');const result=apply(pending.plan);pending=null;d.querySelector('#v124Apply').disabled=true;d.querySelector('#v124BackupPreview').hidden=true;status(result.message)}catch(e){pending=null;d.querySelector('#v124Apply').disabled=true;d.querySelector('#v124BackupPreview').hidden=true;status(e.message)}};
  d.querySelector('#v124Undo').onclick=()=>{try{status(undo())}catch(e){status(e.message)}};
  d.querySelector('#v124Recovery').onclick=()=>{try{if(recovery)download(recovery,'study-table-before-restore.json')}catch(e){status(e.message)}};
  d.querySelector('#v124Reload').onclick=()=>location.reload();return d;
 }
 function open(trigger){const d=dialog();returnFocus=trigger instanceof HTMLElement?trigger:document.activeElement;if(!d.open){/* Closing emits an asynchronous event: invalidate the old preview before reopening, not after. */readingFile++;pending=null;d.querySelector('#v124Apply').disabled=true;d.querySelector('#v124BackupPreview').hidden=true;d.querySelector('#v124FileInfo').hidden=true;d.querySelector('#v124Conflict').value='local';d.showModal()}status(lastUndo?'You can undo the last restore in this page session.':'Choose Save a backup file, or preview a file to restore it.');d.querySelector('#v124BackupClose').focus()}
 function mount(){
  if(!document.getElementById('v124OpenBackup')){const b=document.createElement('button');b.id='v124OpenBackup';b.hidden=true;b.onclick=()=>open(document.getElementById('v101ToolsButton'));document.body.append(b)}
  const home=document.querySelector('#v90Hero .v90-actions');if(home&&!document.getElementById('v124BackupHome')){const b=document.createElement('button');b.id='v124BackupHome';b.type='button';b.textContent='Back up or restore';b.onclick=()=>open(b);home.append(b)}
 }
 document.addEventListener('click',event=>{const b=event.target.closest?.('#v90Backup,#v56Export,#v102Backup,#exportNotes');if(!b)return;event.preventDefault();event.stopImmediatePropagation();open(b);document.getElementById('v124Export').click()},true);
 document.addEventListener('change',event=>{if(!['v90Restore','v56Import','v102Restore','importNotes'].includes(event.target.id))return;event.stopImmediatePropagation();const file=event.target.files?.[0];event.target.value='';open(event.target);readFile(file)},true);
 new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});mount();
 window.studyTableBackup={version:APP_VERSION,collect,prepare,apply,undo,open};
})();
