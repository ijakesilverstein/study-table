/* Study Table V224 — schema-versioned durable checkpoint ledger.
   Compatibility migration: copies validated combined + separately validated raw
   legacy archive into dual slots. Older teaching writers remain in place.
   Never auto-restores unvalidated records or overwrites a legacy study key.
   No network or API dependencies. */
(()=>{'use strict';
const VERSION=2, PREFIX='studytable:v224:ledger:',HEAD=PREFIX+'head',SLOT={a:PREFIX+'slot-a',b:PREFIX+'slot-b'};
const MAX=42*1024*1024,subjects=['spanish','piano','chess','calculus','physics','medicine','business','history','economics','books'];
const $=(s,r=document)=>r.querySelector(s),obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const el=(tag,cls,content)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(content!==undefined)x.textContent=String(content);return x};
const button=(label,cb,cls='')=>{const x=el('button',cls,label);x.type='button';x.addEventListener('click',cb);return x};
const safeError=e=>String(e?.message||e||'Unknown error').slice(0,240);
function hash(value){const text=JSON.stringify(value);let v=2166136261;for(let i=0;i<text.length;i++){v^=text.charCodeAt(i);v=Math.imul(v,16777619)}return (v>>>0).toString(16).padStart(8,'0')}
function validatePayload(payload){
 if(!obj(payload)||!Object.hasOwn(payload,'combined')||!Object.hasOwn(payload,'archive'))throw Error('Incomplete checkpoint payload.');
 if(!payload.combined&&!payload.archive)throw Error('There is no progress to checkpoint.');
 if(payload.combined)window.StudyTableProgress.validateCombined(payload.combined);
 if(payload.archive)window.StudyTableContinuity.validateArchive(payload.archive);
 return payload;
}
function validateSlot(raw){
 if(!obj(raw)||raw.format!=='study-table-progress-ledger'||raw.schemaVersion!==VERSION||!Number.isInteger(raw.revision)||raw.revision<1||raw.revision>10000000||typeof raw.savedAt!=='string'||!Number.isFinite(Date.parse(raw.savedAt))||!obj(raw.payload)||!obj(raw.coverage))throw Error('Unknown ledger schema.');
 if(JSON.stringify(raw).length>MAX)throw Error('Ledger exceeds the size limit.');
 if(!/^[a-f0-9]{8}$/.test(raw.checksum||'')||hash(raw.payload)!==raw.checksum)throw Error('The checkpoint integrity check failed.');
 validatePayload(raw.payload);return raw;
}
function slotRead(slot){const t=localStorage.getItem(SLOT[slot]);if(t===null)return null;return validateSlot(JSON.parse(t))}
function headRead(){const text=localStorage.getItem(HEAD);if(!text)return null;const h=JSON.parse(text);if(!obj(h)||h.schemaVersion!==VERSION||!['a','b'].includes(h.active)||!Number.isInteger(h.revision)||h.revision<1||typeof h.checksum!=='string')throw Error('Invalid checkpoint pointer.');return h}
function readCurrent(){const h=headRead();if(!h)return null;const s=slotRead(h.active);if(!s||s.revision!==h.revision||s.checksum!==h.checksum)throw Error('The active checkpoint is missing or corrupted. Original saved progress has not been changed.');return {...s,slot:h.active}}
function readPrevious(){const h=headRead();if(!h)return null;const other=h.active==='a'?'b':'a';let s=null;try{s=slotRead(other)}catch{return null}return s?{...s,slot:other}:null}
function countData(payload){return {validated:!!payload.combined,legacy:!!payload.archive,keys:Object.keys(payload.archive?.records||{}).filter(k=>!k.startsWith(PREFIX)).length,coreKeys:Object.keys(payload.combined?.core?.records||{}).length}}
function collect(){
 if(!window.StudyTableProgress?.validateCombined||!window.StudyTableContinuity?.collectArchive)throw Error('Study Table progress services are not ready.');
 // A bad legacy record must not make validated modern work disappear, or vice versa.
 let combined=null,archive=null;const warnings=[];
 try{combined=window.StudyTableProgress.validateCombined(window.StudyTablePath.completeBackup())}catch(e){warnings.push('Validated course backup: '+safeError(e))}
 try{
  const a=window.StudyTableContinuity.collectArchive();window.StudyTableContinuity.validateArchive(a);
  // Drop prior checkpoint keys to prevent recursive archive growth; never redact user notes.
  const records={};for(const [k,v] of Object.entries(a.records))if(!k.startsWith(PREFIX))records[k]=v;
  archive={...a,records,coverage:{...a.coverage,archivedKeys:Object.keys(records).length}};window.StudyTableContinuity.validateArchive(archive);
 }catch(e){warnings.push('Older progress archive: '+safeError(e))}
 const payload=validatePayload({combined,archive});return {payload,warnings,coverage:countData(payload)};
}
let busy=false,stale=false,lastMessage='',dialog=null,returnFocus=null;
function migrate(){
 if(busy)throw Error('A checkpoint operation is already running.');busy=true;
 try{
  const {payload,warnings,coverage}=collect();
  const prior=headRead();let old=null;
  if(prior){old=readCurrent()} // If active is corrupt, refuse to overwrite: preserve the existing recovery slot.
  const slot=prior?(prior.active==='a'?'b':'a'):'a';
  const revision=prior?prior.revision+1:1;
  if(revision>10000000)throw Error('Checkpoint revision limit reached.');
  const record={format:'study-table-progress-ledger',schemaVersion:VERSION,revision,savedAt:new Date().toISOString(),payload,coverage,warnings,checksum:hash(payload)};
  const encoded=JSON.stringify(record);
  if(encoded.length>MAX)throw Error('The checkpoint exceeds the safe size limit.');
  // Dual-slot transaction: inactive slot is written and read back BEFORE pointer changes.
  // Restore inactive old bytes if staging fails so rollback remains available.
  const priorInactive=localStorage.getItem(SLOT[slot]);
  try{
   localStorage.setItem(SLOT[slot],encoded);
   const checked=slotRead(slot);
   if(!checked||checked.checksum!==record.checksum||checked.revision!==revision)throw Error('Checkpoint verification failed.');
   const pointer={schemaVersion:VERSION,active:slot,revision,checksum:record.checksum};
   localStorage.setItem(HEAD,JSON.stringify(pointer));
   if(headRead()?.active!==slot)throw Error('Checkpoint activation failed.');
  }catch(e){
   // If pointer did not move, revert staging. If it did move, do NOT undo a successful commit.
   let active=false;try{active=headRead()?.active===slot&&headRead()?.revision===revision}catch{}
   if(!active){try{if(priorInactive===null)localStorage.removeItem(SLOT[slot]);else localStorage.setItem(SLOT[slot],priorInactive)}catch{}}
   throw e;
  }
  lastMessage='Checkpoint '+revision+' saved. '+(warnings.length?'Some data could only be preserved as a raw archive.':'Validated backup and legacy archive included.');
  return {revision,slot,coverage,warnings,previous:old?.revision??null};
 }finally{busy=false}
}
function rollback(){
 if(busy)throw Error('Another checkpoint operation is in progress.');busy=true;
 try{
  const h=headRead();if(!h)throw Error('No checkpoint exists.');
  const prior=readPrevious();if(!prior)throw Error('There is no valid earlier checkpoint to return to.');
  if(prior.revision>=h.revision)throw Error('Only an earlier version can be restored as the active checkpoint.');
  const current=readCurrent();
  localStorage.setItem(HEAD,JSON.stringify({schemaVersion:VERSION,active:prior.slot,revision:prior.revision,checksum:prior.checksum}));
  try{if(readCurrent()?.revision!==prior.revision)throw Error('Rollback verification failed.')}catch(e){
   try{localStorage.setItem(HEAD,JSON.stringify({schemaVersion:VERSION,active:current.slot,revision:current.revision,checksum:current.checksum}))}catch{}
   throw e;
  }
  lastMessage='Active checkpoint returned to revision '+prior.revision+'. Live lessons were not overwritten.';
  return prior;
 }finally{busy=false}
}
function recoverHead(){
 if(busy)throw Error('Another checkpoint operation is in progress.');busy=true;
 try{
  let currentValid=false;try{currentValid=!!readCurrent()}catch{}
  if(currentValid)throw Error('The current checkpoint is healthy. Nothing needs to be repaired.');
  const candidates=[];
  for(const side of ['a','b']){try{const record=slotRead(side);if(record)candidates.push({...record,slot:side})}catch{}}
  if(!candidates.length)throw Error('Neither checkpoint slot is recoverable. Your original lesson records are still unchanged.');
  const best=candidates.sort((a,b)=>b.revision-a.revision)[0];
  const pointer={schemaVersion:VERSION,active:best.slot,revision:best.revision,checksum:best.checksum};
  localStorage.setItem(HEAD,JSON.stringify(pointer));
  if(readCurrent()?.revision!==best.revision)throw Error('Checkpoint pointer could not be recovered.');
  lastMessage='Recovered version '+best.revision+' as your active checkpoint. No legacy lesson records were changed.';
  return best;
 }finally{busy=false}
}
function integrity(){
 const out={state:'new',current:null,previous:null,error:null};
 try{out.current=readCurrent();out.previous=readPrevious();out.state=out.current?'ready':'new'}
 catch(e){out.state='corrupt';out.error=safeError(e);for(const side of ['a','b']){try{const candidate=slotRead(side);if(candidate){out.previous={...candidate,slot:side};break}}catch{}}}
 return out;
}
function download(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000)}
function exportCurrent(kind='combined'){
 const c=readCurrent();if(!c)throw Error('Create your first checkpoint before exporting it.');
 const x=c.payload[kind];if(!x)throw Error(kind==='combined'?'This checkpoint has no validated combined backup.':'This checkpoint has no legacy archive.');
 if(kind==='combined')window.StudyTableProgress.validateCombined(x);else window.StudyTableContinuity.validateArchive(x);
 download(x,kind==='combined'?'study-table-v224-supported-restore.json':'study-table-v224-legacy-archive.json');return true;
}
function refresh(){if(!dialog?.open)return;const main=$('#st224Main',dialog);if(!main)return;main.replaceChildren();const status=integrity();
 const info=el('section','st224-card');info.append(el('h3','','Versioned progress store'));
 if(status.current){info.append(el('p','',`Active revision ${status.current.revision} · ${new Date(status.current.savedAt).toLocaleString()}`));const cov=status.current.coverage;info.append(el('p','st224-muted',`${cov.coreKeys} validated original course keys · ${cov.keys} archived browser keys · ${cov.validated?'supported restore included':'supported restore unavailable'}.`));
  if(status.current.warnings?.length)info.append(el('p','st224-warning','Partial capture: '+status.current.warnings.join(' | ')));
 }else info.append(el('p','st224-warning',status.error?'Checkpoint needs attention: '+status.error:'No checkpoint yet. The original lesson progress is still unchanged.'));
 if(status.state==='corrupt'&&status.previous){const recover=button('Recover a surviving checkpoint',()=>{try{recoverHead();refresh()}catch(e){lastMessage='Recovery failed: '+safeError(e);refresh()}},'st224-secondary');recover.id='st224RecoverPointer';info.append(recover)}
 const controls=el('div','st224-actions');const create=button(status.current?'Save a new checkpoint':'Migrate my saved progress',()=>{try{const x=migrate();lastMessage=`Saved version ${x.revision}. Your original lesson records are unchanged.`;refresh()}catch(e){lastMessage='Save failed: '+safeError(e);refresh()}},'st224-primary');create.id='st224Commit';controls.append(create);
 const undo=button('Return to previous checkpoint',()=>{try{rollback();refresh()}catch(e){lastMessage='Rollback failed: '+safeError(e);refresh()}},'st224-secondary');undo.id='st224Rollback';undo.disabled=!status.current||!status.previous||status.previous.revision>=status.current.revision;controls.append(undo);info.append(controls);
 info.append(el('p','st224-muted','Checkpoint rollback only changes which saved snapshot is active. It never overwrites your current lessons. To restore supported lesson data, export the backup below and use the existing Restore & Undo screen.'));
 main.append(info);
 const recovery=el('section','st224-card');recovery.append(el('h3','','Recover from a checkpoint'),el('p','st224-muted','Use the existing validated restore flow. Unknown historical records remain in the legacy archive; they are never written back automatically.'));
 const row=el('div','st224-actions');const supported=button('Download supported restore',()=>{try{exportCurrent('combined');lastMessage='Validated backup downloaded. Preview it in Restore before applying.';refresh()}catch(e){lastMessage=safeError(e);refresh()}},'st224-secondary');supported.id='st224ExportCombined';supported.disabled=!status.current?.payload.combined;
 const legacy=button('Download older-record archive',()=>{try{exportCurrent('archive');lastMessage='Raw legacy archive downloaded. Use the existing archive recovery tool to inspect it.';refresh()}catch(e){lastMessage=safeError(e);refresh()}},'st224-secondary');legacy.id='st224ExportLegacy';legacy.disabled=!status.current?.payload.archive;
 row.append(supported,legacy,button('Open Restore & Undo',()=>{close();window.StudyTablePath?.open?.()},'st224-secondary'));recovery.append(row);main.append(recovery);
 const limitations=el('section','st224-card');limitations.append(el('h3','','What this migration covers'),el('p','',`The new versioned ledger contains validated modern course records and a bounded archive of older Study Table keys. Existing modules still read/write their original keys while compatibility testing continues.`),el('p','st224-warning','This is a manual checkpoint: save a new version after studying. Legacy writers still use their original keys, and file:// persistence across browser changes is unverified. Download a backup before changing devices.'));main.append(limitations);
 const msg=$('#st224Status',dialog);if(msg)msg.textContent=lastMessage||'Your original saved work remains in its current browser keys.';
}
function open(){returnFocus=document.activeElement;if(!dialog){dialog=el('dialog','st224-dialog');dialog.id='st224Dialog';const shell=el('div','st224-shell'),header=el('div','st224-head');header.append(el('div','','Study Table · V224 progress migration'),button('Close',close,'st224-close'));shell.append(header);const main=el('div','st224-main');main.id='st224Main';shell.append(main);const s=el('p','st224-status');s.id='st224Status';s.setAttribute('role','status');s.setAttribute('aria-live','polite');shell.append(s);dialog.append(shell);document.body.append(dialog);dialog.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus()})}
 if(!dialog.open)dialog.showModal();refresh();dialog.querySelector('.st224-close')?.focus();}
function close(){if(dialog?.open)dialog.close()}
function attach(){const progress=$('#st223Dialog .st223-main');if(progress&&!$('#st224ProgressLink')){const x=button('Open versioned progress migration',()=>{window.StudyTableProgress?.close?.();open()},'st224-launch');x.id='st224ProgressLink';progress.prepend(x)}
 const portal=$('#v35Content .v36-head-actions')||$('#v35Content .v35-head');if(portal&&!$('#st224Portal')){const x=button('Protect my progress',open,'st224-launch');x.id='st224Portal';portal.append(x)} }
function install(){if(!document.body)return;const observer=new MutationObserver(()=>{if(attach.waiting)return;attach.waiting=true;queueMicrotask(()=>{attach.waiting=false;attach()})});observer.observe(document.body,{childList:true,subtree:true});attach();document.title='Study Table — Progress Migration (V224)'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.StudyTableLedger={VERSION,collect,migrate,rollback,recoverHead,integrity,readCurrent,readPrevious,validateSlot,exportCurrent,open,close};
})();