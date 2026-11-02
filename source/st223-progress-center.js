/* Study Table V223 — one validated read-side progress registry and portable bundle.
   Source modules retain their own writers until explicit migrations are tested. This
   facade never writes study progress; imports are inspect/extract only. Offline. */
(()=>{'use strict';
const FORMAT='study-table-portable-bundle',LIMIT=42*1024*1024;
const SUBJECTS=['spanish','piano','chess','calculus','physics','medicine','history','economics','business','books'];
const TITLES={spanish:'Spanish',piano:'Piano',chess:'Chess',calculus:'Calculus',physics:'Physics',medicine:'Medicine',history:'History',economics:'Economics',business:'Business',books:'Books'};
let dialog=null,returnFocus=null,selection=null,lastStatus='';
const el=(tag,cls,txt)=>{const v=document.createElement(tag);if(cls)v.className=cls;if(txt!==undefined)v.textContent=String(txt);return v};
const b=(txt,act,cls)=>{const node=el('button',cls,txt);node.type='button';node.addEventListener('click',act);return node};
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
const len=x=>JSON.stringify(x).length;
const err=e=>String(e?.message||e||'Unknown error').slice(0,260);
function readSafe(label,fn,fallback){try{return fn()}catch(e){return fallback}}
function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
// This noncryptographic digest detects accidental edits, NOT malicious changes.
function checksum(value){const t=JSON.stringify(value);let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
function readOverview(){
 const teaching=readSafe('teaching',()=>window.StudyTableTeacher?.counts?.(),{})||{};
 const deep=readSafe('deep',()=>window.StudyTableDeepLessons?.counts?.(),{})||{};
 const coaching=readSafe('coaching',()=>window.StudyTableCoaching?.summary?.(),{})||{};
 const path=readSafe('chapter',()=>window.StudyTablePath?.stats?.(),{})||{};
 const recent=[];for(let days=0;days<7;days++){const d=new Date();d.setDate(d.getDate()-days);const day=localDate(d);const act=readSafe('calendar',()=>window.StudyTableCalendar?.getActivity?.(day),null);if(act?.hasStudy)recent.push(day)}
 const subjects=SUBJECTS.map(id=>({id,title:TITLES[id],intro:Number(teaching.bySubject?.[id]||0),workshops:Number(deep.bySubject?.[id]||0)}));
 let storage='available';try{const k='studytable:v223:read-only-check';localStorage.getItem(k)}catch{storage='blocked'}
 return {version:1,subjects,teachingDone:Number(teaching.completed||0),teachingTotal:Number(teaching.total||0),deepDone:Number(deep.completed||0),deepTotal:Number(deep.total||0),diagnosticTried:Number(coaching.practiced||0),diagnosticReview:Number(coaching.needsReview||0),chapterDue:Number(path.due||0),studyDaysLast7:recent.length,storage};
}
function validateCombined(data){
 if(!isObj(data)||data.format!=='study-table-complete'||data.schemaVersion!==1||!isObj(data.core)||!isObj(data.core.records))throw Error('Invalid combined progress backup.');
 if(data.core.format!=='study-table-backup')throw Error('Unrecognized original course backup format.');
 if(Object.keys(data.core.records).length>0){if(typeof window.studyTableBackup?.prepare!=='function')throw Error('Original course validator is unavailable.');window.studyTableBackup.prepare(data.core,true)}
 if(data.guided!=null){if(typeof window.StudyTablePath?.validateGuided!=='function')throw Error('Guided progress validator is unavailable.');window.StudyTablePath.validateGuided(data.guided)}
 if(data.spanishStudio!=null){if(typeof window.StudyTablePath?.validateSpanish!=='function')throw Error('Spanish progress validator is unavailable.');window.StudyTablePath.validateSpanish(data.spanishStudio)}
 for(const [field,api] of [['calendar','StudyTableCalendar'],['teaching','StudyTableTeacher'],['deepTeaching','StudyTableDeepLessons'],['coaching','StudyTableCoaching']])if(data[field]!=null){if(typeof window[api]?.validate!=='function')throw Error('The '+field+' validator is unavailable.');window[api].validate(data[field])}
 if(data.lastSubject!==undefined&&data.lastSubject!==null&&!['physics','calculus','piano','chess','medicine','business'].includes(data.lastSubject))throw Error('Unknown saved study subject.');
 return data;
}
function collectBundle(){
 let combined=null,archive=null;const failures=[];
 try{combined=validateCombined(window.StudyTablePath.completeBackup())}catch(e){failures.push('Validated combined backup unavailable: '+err(e))}
 try{archive=window.StudyTableContinuity.collectArchive();window.StudyTableContinuity.validateArchive(archive)}catch(e){failures.push('Legacy archive unavailable: '+err(e))}
 if(!combined&&!archive)throw Error('Neither progress exporter is available. Open a lesson first and retry. '+failures.join('; '));
 const payload={combined,archive};
 const bundle={format:FORMAT,schemaVersion:1,createdAt:new Date().toISOString(),payload,checksum:checksum(payload),checks:{combinedReady:!!combined,archiveReady:!!archive,archivedKeys:Object.keys(archive?.records||{}).length,limitations:failures}};
 if(len(bundle)>LIMIT)throw Error('Progress exceeds the portable file size limit. Download the existing backups separately.');
 return bundle;
}
function validateBundle(raw){
 if(!isObj(raw)||raw.format!==FORMAT||raw.schemaVersion!==1||!isObj(raw.payload)||!own(raw.payload,'combined')||!own(raw.payload,'archive'))throw Error('Choose a V223 portable Study Table progress file.');
 if(len(raw)>LIMIT)throw Error('This progress bundle is too large.');
 if(!/^[a-f0-9]{8}$/.test(raw.checksum||'')||raw.checksum!==checksum(raw.payload))throw Error('The bundle integrity check failed. Use a fresh export.');
 const {combined,archive}=raw.payload;
 if(!combined&&!archive)throw Error('This file contains no progress.');
 if(combined)validateCombined(combined);
 if(archive){if(typeof window.StudyTableContinuity?.validateArchive!=='function')throw Error('Legacy archive validation is unavailable.');window.StudyTableContinuity.validateArchive(archive)}
 return {combined,archive,summary:{combined:!!combined,archive:!!archive,archiveKeys:Object.keys(archive?.records||{}).length,partial:!(combined&&archive)}};
}
function download(data,name){const body=JSON.stringify(data,null,2);if(body.length>LIMIT)throw Error('File is too large to download.');const blob=new Blob([body],{type:'application/json'});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000)}
function status(msg,bad=false){lastStatus=msg;const node=dialog?.querySelector('#st223Status');if(node){node.textContent=msg;node.dataset.kind=bad?'warn':'good'}}
function createSection(title,description){const node=el('section','st223-panel');node.append(el('h3','',title));if(description)node.append(el('p','st223-muted',description));return node}
function render(){if(!dialog)return;const main=dialog.querySelector('#st223Main');main.replaceChildren();const o=readOverview();
 const summary=createSection('What you have learned','Progress reflects saved lesson completions and practice attempts, not certified mastery.');
 const metrics=el('div','st223-metrics');for(const [num,label] of [[`${o.teachingDone}/${o.teachingTotal}`,'guided lessons'],[`${o.deepDone}/${o.deepTotal}`,'deeper workshops'],[o.studyDaysLast7,'study days · last 7'],[o.diagnosticReview,'concepts to revisit']]){const m=el('div','st223-metric');m.append(el('strong','',num),el('span','',label));metrics.append(m)}summary.append(metrics);
 const rows=el('div','st223-subjects');for(const s of o.subjects){const row=el('div','st223-subject');row.append(el('strong','',s.title),el('span','',`${s.intro} guided · ${s.workshops} workshops`));rows.append(row)}summary.append(rows);main.append(summary);
 const next=createSection('Choose what to learn','Keep teaching ahead of tests. Your next lesson opens with an explanation and a worked example.');const controls=el('div','st223-actions');controls.append(b('Learning calendar',()=>{close();window.StudyTableCalendar?.open?.()},'st223-secondary'),b('My next 10 minutes',()=>{close();window.StudyTablePath?.open?.()},'st223-secondary'));next.append(controls);main.append(next);
 const portable=createSection('One portable progress file','Contains your validated combined backup and a separate legacy archive. The archive protects additional older records but cannot be automatically restored.');
 const exportButton=b('Download my progress bundle',()=>{try{const bundle=collectBundle();download(bundle,'study-table-progress-bundle-v223.json');status(bundle.checks.combinedReady&&bundle.checks.archiveReady?'Progress bundle download requested. Keep it private; it can contain study notes.':'Partial bundle downloaded. '+bundle.checks.limitations.join(' '),!bundle.checks.combinedReady||!bundle.checks.archiveReady)}catch(e){status('Export failed: '+err(e),true)}},'st223-primary');exportButton.id='st223Export';portable.append(exportButton);
 const choose=el('label','st223-input-label','Inspect a portable progress bundle (no changes to saved work)');choose.htmlFor='st223File';const picker=el('input');picker.type='file';picker.id='st223File';picker.accept='.json,application/json';picker.addEventListener('change',async()=>{const file=picker.files?.[0];picker.value='';if(!file)return;selection=null;try{if(file.size>LIMIT)throw Error('File is too large.');const parsed=JSON.parse(await file.text());const result=validateBundle(parsed);selection=result;render();status(`Validated bundle: ${result.summary.combined?'combined backup included':'no combined backup'}; ${result.summary.archiveKeys} legacy archive records. Nothing restored yet.`)}catch(e){render();status('Cannot inspect bundle: '+err(e),true)}});portable.append(choose,picker);
 if(selection){const inspected=createSection('Inspected file','Extract only what this app validates. Extraction downloads files and never writes your saved progress.');const actions=el('div','st223-actions');
  if(selection.combined){const c=b('Download validated backup for Restore',()=>{try{download(selection.combined,'study-table-combined-from-v223.json');status('Combined backup extracted. Open Restore, preview, and confirm there if you want to use it.')}catch(e){status(err(e),true)}},'st223-secondary');c.id='st223ExtractCombined';actions.append(c)}
  if(selection.archive){const a=b('Download legacy archive for recovery',()=>{try{download(selection.archive,'study-table-legacy-archive-from-v223.json');status('Legacy archive extracted. Use Recover older progress to inspect supported records.')}catch(e){status(err(e),true)}},'st223-secondary');a.id='st223ExtractArchive';actions.append(a)}inspected.append(actions);portable.append(inspected)}
 const more=el('div','st223-actions');more.append(b('Open validated Restore & Undo',()=>{close();window.StudyTablePath?.open?.()},'st223-secondary'),b('Recover an older archive',()=>{close();window.StudyTableRecovery?.open?.()},'st223-secondary'));portable.append(more,el('p','st223-warning','Keep the downloaded file private: notes and study data may be inside. A successful browser storage check does not prove your progress will survive renaming the HTML or changing browsers.'));main.append(portable);
 status(lastStatus||'Your progress is stored locally in this browser. Export a bundle before changing browsers or clearing site data.');}
function ensure(){if(dialog)return;dialog=el('dialog','st223-dialog');dialog.id='st223Dialog';dialog.setAttribute('aria-label','Study Table Progress Center');const shell=el('div','st223-shell');const head=el('header','st223-head');const left=el('div');left.append(el('p','st223-eyebrow','STUDY TABLE · V223'),el('h2','','Your learning & progress'));head.append(left,b('Close',close,'st223-close'));shell.append(head);const main=el('div','st223-main');main.id='st223Main';shell.append(main);const foot=el('div','st223-status');foot.id='st223Status';foot.setAttribute('role','status');foot.setAttribute('aria-live','polite');shell.append(foot);dialog.append(shell);dialog.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus()});document.body.append(dialog)}
function open(){returnFocus=document.activeElement;ensure();selection=null;lastStatus='';render();if(!dialog.open)dialog.showModal();dialog.querySelector('.st223-close')?.focus()}
function close(){if(dialog?.open)dialog.close()}
function attach(){const portal=document.querySelector('#v35Content .v36-head-actions')||document.querySelector('#v35Content .v35-head');if(portal&&!document.getElementById('st223Portal')){const button=b('My progress',open,'st223-launch');button.id='st223Portal';portal.append(button)}
 const legacy=document.getElementById('st220SafetyDialog');const root=legacy?.querySelector('.st220-body')||legacy?.querySelector('.st220-shell');if(root&&!document.getElementById('st223StorageLink')){const button=b('Open Progress Center',()=>{legacy.close();open()},'st223-launch');button.id='st223StorageLink';root.append(button)}
 const path=document.querySelector('#st213Dialog .st213-header');if(path&&!document.getElementById('st223Path')){const button=b('My progress',()=>{document.querySelector('#st213Dialog')?.close();open()},'st223-launch');button.id='st223Path';path.append(button)}
 const calendar=document.querySelector('#st214Dialog .st214-head');if(calendar&&!document.getElementById('st223Calendar')){const button=b('My progress',()=>{window.StudyTableCalendar?.close?.();open()},'st223-launch');button.id='st223Calendar';calendar.append(button)}
 const home=document.querySelector('#v90Hero .v90-actions');if(home&&!document.getElementById('st223Home')){const button=b('My progress',open,'st223-launch');button.id='st223Home';home.append(button)}}
function init(){const observer=new MutationObserver(()=>{if(attach.queued)return;attach.queued=true;queueMicrotask(()=>{attach.queued=false;attach()})});observer.observe(document.body,{childList:true,subtree:true});attach();document.title='Study Table — Unified Progress (V223)'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.StudyTableProgress={open,readOverview,collectBundle,validateBundle,validateCombined,checksum,close};
})();