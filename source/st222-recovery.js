/* Study Table V222 — conservative migration from V221 emergency archives.
   Read-only until the learner exports a recovery file and explicitly restores it via V213's
   existing validated, confirmable, undoable restore. No arbitrary legacy key is ever written. */
(()=>{'use strict';
 const ARCHIVE='study-table-local-archive', COMPLETE='study-table-complete', MAX_FILE=26*1024*1024, MAX_CORE=230, SUBJECTS=new Set(['physics','calculus','piano','chess','medicine','business']);
 const ADV={
  'studytable:v212:guided-missions':['guided','validateGuided'],
  'spanish-verb-studio-v1':['spanishStudio','validateSpanish'],
  'studytable:v214:learning-calendar':['calendar','calendar'],
  'studytable:v214:teaching-room':['teaching','teacher'],
  'studytable:v216:deep-lessons':['deepTeaching','deep'],
  'studytable:v219:coaching':['coaching','coaching'],
  'studytable:v210:last-subject':['lastSubject','subject']
 };
 const create=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
 const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 let dialog=null, selected=null, pending=null, status='',busy=false,earlierFocus=null;
 function check() {if(!window.StudyTableContinuity?.validateArchive||!window.studyTableBackup?.prepare||!window.StudyTablePath?.validateGuided)throw Error('Open Study Table lessons first; the validated backup services are not ready.');}
 function parseArchive(data){check();window.StudyTableContinuity.validateArchive(data);if(!obj(data)||data.format!==ARCHIVE||data.schemaVersion!==1||!obj(data.records))throw Error('This is not a V221 progress archive.');return data}
 function baseline(){try{const saved=window.StudyTablePath.completeBackup();if(saved?.format===COMPLETE&&saved.schemaVersion===1){if(Object.keys(saved.core?.records||{}).length)window.studyTableBackup.prepare(saved.core,true);return {data:JSON.parse(JSON.stringify(saved)),usable:true};}}catch{}
  // When the core backup is malformed, preserve every *individually valid* modern section
  // before overlaying any archive fields. This prevents a Spanish-only rescue from erasing
  // intact guided lessons just because one unrelated legacy record could not be decoded.
  const data={format:COMPLETE,schemaVersion:1,exportedAt:new Date().toISOString(),core:{format:'study-table-backup',schemaVersion:1,appVersion:136,records:{}},guided:{version:1,subjects:{}},spanishStudio:null,lastSubject:'physics',calendar:null,teaching:null,deepTeaching:null,coaching:null};
  for(const [key,[field]] of Object.entries(ADV)){
   try{const raw=localStorage.getItem(key);if(raw===null)continue;data[field]=validatedAdvanced(key,raw)}catch{} // Omit only the corrupt field, never copy unchecked bytes.
  }
  return {usable:false,data};
 }
 function validatedAdvanced(key,raw){const field=ADV[key]?.[0],method=ADV[key]?.[1];if(!field)throw Error('Not an advanced record.');
  let state;if(method==='subject'){if(!SUBJECTS.has(raw))throw Error('Unknown subject.');return raw}
  try{state=JSON.parse(raw)}catch{throw Error('Not valid JSON.')}
  if(state===null||!obj(state))throw Error('Missing saved progress.');
  let validated;
  if(method==='validateGuided')validated=window.StudyTablePath.validateGuided(state);
  if(method==='validateSpanish')validated=window.StudyTablePath.validateSpanish(state);
  if(method==='calendar')validated=window.StudyTableCalendar?.validate?.(state);
  if(method==='teacher')validated=window.StudyTableTeacher?.validate?.(state);
  if(method==='deep')validated=window.StudyTableDeepLessons?.validate?.(state);
  if(method==='coaching')validated=window.StudyTableCoaching?.validate?.(state);
  if(!validated||!obj(validated))throw Error('This app version cannot validate that progress.');
  return validated;
 }
 function describe(k){return k.slice(0,96)}
 // Nothing in this routine writes browser storage. The existing core decoder is the final authority.
 function convert(input){const archive=parseArchive(input),base=baseline(),data=base.data,records=data.core.records;
  const used=[],skipped=[],warnings=[];let candidates=0;
  for(const [key,raw] of Object.entries(archive.records)){
   if(own(ADV,key)){
    try{data[ADV[key][0]]=validatedAdvanced(key,raw);used.push({key,section:'Modern learning'});}
    catch(e){skipped.push({key:describe(key),why:'Invalid modern record: '+String(e.message||e).slice(0,110)})}
    continue;
   }
   if(++candidates>MAX_CORE){skipped.push({key:describe(key),why:'Archive contains more than 230 potential core records.'});continue}
   try{
    // prepare() only reads and validates. It does NOT apply or write imported records.
    const one=Object.create(null);Object.defineProperty(one,key,{value:raw,enumerable:true});
    const trial={format:'study-table-backup',schemaVersion:1,records:one};
    const plan=window.studyTableBackup.prepare(trial,true);
    if(!plan||!Array.isArray(plan.updates))throw Error('No valid restore preview.');
    records[key]=raw;used.push({key,section:'Courses, reviews or notes'});
   }catch(e){skipped.push({key:describe(key),why:String(e.message||e).slice(0,130)})}
  }
  // The archive can be advanced-only, e.g. Spanish Studio on a fresh device.
  if(!used.length)throw Error('No compatible records found. Nothing changed. Keep the original emergency archive for later recovery.');
  // A single final validation catches interactions between recognized records and their fallback facades.
  const importedCore=Object.create(null);for(const u of used)if(u.section==='Courses, reviews or notes')importedCore[u.key]=records[u.key];
  if(Object.keys(importedCore).length)window.studyTableBackup.prepare({format:'study-table-backup',schemaVersion:1,records:importedCore},true);
  data.exportedAt=new Date().toISOString();data.migration={source:'V221 local archive',edition:'V222',compatibleRecords:used.length,unrecognizedRecords:skipped.length,note:'Preview and explicitly restore in Study Table. Unrecognized records were omitted. No progress was changed during conversion.'};
  // Only known fields are forwarded. Do not blindly copy arbitrary archive metadata.
  if(JSON.stringify(data).length>20*1024*1024)throw Error('The resulting validated recovery file would be too large.');
  return {data,used,skipped,keptCurrent:base.usable};
 }
 function setStatus(txt,isError=false){status=txt;if(dialog){const e=dialog.querySelector('#st222Status');if(e){e.textContent=txt;e.dataset.type=isError?'bad':'info'}}}
 function showPlan(){if(!dialog)return;const n=dialog.querySelector('#st222Summary'),list=dialog.querySelector('#st222Omitted'),exportBtn=dialog.querySelector('#st222Download'),next=dialog.querySelector('#st222OpenRestore');
  if(!pending){n.textContent='Choose the emergency archive JSON downloaded with V221. No records will be changed while reviewing it.';list.replaceChildren();exportBtn.disabled=true;next.disabled=true;return}
  n.textContent=`${pending.used.length} supported records can be recovered. ${pending.skipped.length} other records cannot be safely imported. ${pending.keptCurrent?'The generated file also preserves supported records already stored in this browser.':'No valid existing combined backup was available; the recovery file contains only compatible archive records.'}`;
  list.replaceChildren();const included=create('details');included.append(create('summary','','Show validated records included ('+pending.used.length+')'));const inside=create('ul');for(const item of pending.used.slice(0,60))inside.append(create('li','',item.key+' — '+item.section));if(pending.used.length>60)inside.append(create('li','','… and '+(pending.used.length-60)+' others.'));included.append(inside);list.append(included);
  if(pending.skipped.length){const details=create('details');details.append(create('summary','','Show records excluded from recovery ('+pending.skipped.length+')'));const ul=create('ul');for(const item of pending.skipped.slice(0,45)){const li=create('li','',item.key+' — '+item.why);ul.append(li)}if(pending.skipped.length>45)ul.append(create('li','','… and '+(pending.skipped.length-45)+' others.'));details.append(ul);list.append(details)}
  exportBtn.disabled=false;next.disabled=false;
 }
 async function load(file){if(busy)return;busy=true;pending=null;showPlan();setStatus('Checking archive without changing your saved work…');
  try{if(!file||file.size>MAX_FILE)throw Error('Choose a V221 archive smaller than 26 MB.');const raw=await file.text(),input=JSON.parse(raw);pending=convert(input);setStatus(`Ready to download: ${pending.used.length} validated sections. Download it, then use the existing Restore button to preview and confirm. Nothing has been changed.`)}
  catch(e){setStatus('Archive cannot be converted: '+(e.message||e),true)}finally{busy=false;showPlan()}}
 function download(){if(!pending)return;const data=JSON.stringify(pending.data,null,2),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=create('a');
  a.href=url;a.download='study-table-recovered-combined-v222.json';a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);setStatus('Recovery file download requested. Open “My next 10 minutes” → Restore combined backup to preview and apply. Save your current combined backup first.');}
 function openRestore(){close();window.StudyTablePath?.open?.();}
 function close(){if(dialog?.open)dialog.close();if(earlierFocus?.isConnected)earlierFocus.focus()}
 function makeDialog(){if(dialog)return;dialog=create('dialog','st222-dialog');dialog.id='st222Dialog';dialog.setAttribute('aria-label','Recover supported progress');const shell=create('div','st222-shell');
  const top=create('div','st222-top');top.append(create('h2','','Recover older progress'));const x=create('button','st222-close','Close');x.type='button';x.addEventListener('click',close);top.append(x);shell.append(top);
  shell.append(create('p','','This tool reads a V221 emergency archive. It recovers only records understood by the current app. It will not import unknown settings, code, or raw legacy records. Nothing is modified unless you separately confirm a restore.'));
  const picker=create('label','st222-picker','Select V221 emergency archive JSON');picker.htmlFor='st222File';const file=create('input');file.id='st222File';file.type='file';file.accept='.json,application/json';file.addEventListener('change',()=>{const selectedFile=file.files?.[0];if(selectedFile)load(selectedFile);file.value=''});shell.append(picker,file);
  const statusEl=create('p','st222-status','No file chosen.');statusEl.id='st222Status';statusEl.setAttribute('role','status');statusEl.setAttribute('aria-live','polite');shell.append(statusEl);
  const summary=create('p','st222-summary','');summary.id='st222Summary';shell.append(summary);const omitted=create('div','st222-omitted');omitted.id='st222Omitted';shell.append(omitted);
  const row=create('div','st222-actions');const exportBtn=create('button','st222-primary','Download validated recovery file');exportBtn.id='st222Download';exportBtn.addEventListener('click',download);row.append(exportBtn);const next=create('button','','Open existing Restore & Undo');next.id='st222OpenRestore';next.addEventListener('click',openRestore);row.append(next);shell.append(row);
  shell.append(create('p','st222-caution','Keep your original archive. This conversion intentionally skips unrecognized records. Restoring a converted file can replace conflicting saved records; make a current combined backup first and review the existing restore preview.'));
  dialog.append(shell);dialog.addEventListener('close',()=>earlierFocus?.isConnected&&earlierFocus.focus());document.body.append(dialog);showPlan();}
 function open(){earlierFocus=document.activeElement;makeDialog();setStatus(status||'No file chosen.');showPlan();if(!dialog.open)dialog.showModal();dialog.querySelector('#st222File')?.focus()}
 function attach(){const root=document.querySelector('#st221Continuity');if(!root||root.querySelector('#st222RecoveryLink'))return false;
  const section=create('section','st222-entry');section.id='st222RecoveryLink';section.append(create('h3','','Recover a V221 emergency archive'),create('p','','Have an emergency archive from another computer or an older Study Table? Convert only the sections this version can safely validate. You will review the converted file using the existing restore and Undo tools.'));
  const button=create('button','','Inspect archive for recovery');button.type='button';button.addEventListener('click',open);section.append(button);root.append(section);return true}
 function init(){const observer=new MutationObserver(()=>{if(attach())observer.disconnect()});observer.observe(document.body,{childList:true,subtree:true});attach()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.StudyTableRecovery={open,convert,parseArchive,load,latest:()=>pending};
})();