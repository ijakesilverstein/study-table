/* Study Table V226 — schema-v4 shared write path for seven learning systems.
   Early-loaded before the legacy chapters. Retains old keys as a compatibility mirror.
   Does not claim all older systems are migrated. No remote dependencies. */
(()=>{'use strict';
const VERSION=4,PREFIX='studytable:v226:live:',HEAD=PREFIX+'head',SLOT={a:PREFIX+'slot-a',b:PREFIX+'slot-b'};
const NAMES={
 'studytable:v207:chapter-checks':'Chapter reviews',
 'studytable:v214:learning-calendar':'Learning calendar',
 'studytable:v214:teaching-room':'Guided teaching',
 'studytable:v216:deep-lessons':'Teacher-led workshops',
 'studytable:v219:coaching':'Diagnostic coaching',
 'spanish-verb-studio-v1':'Spanish Verb Studio',
 'studytable:v212:guided-missions':'Guided lab missions'
};
const KEYS=Object.keys(NAMES),LIMIT=3*1024*1024,MAX=12*1024*1024;
const OLD_PREFIX='studytable:v225:live:',OLD_HEAD=OLD_PREFIX+'head';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function checksum(x){let h=2166136261;const s=typeof x==='string'?x:JSON.stringify(x);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
function hashMirror(s){return s===null?'null':checksum(s)}
function validator(k){const w=window;
 if(k===KEYS[0])return d=>w.StudyTableChapterChecks?.validate(d)===true;
 if(k===KEYS[1])return d=>!!w.StudyTableCalendar?.validate(d);
 if(k===KEYS[2])return d=>!!w.StudyTableTeacher?.validate(d);
 if(k===KEYS[3])return d=>!!w.StudyTableDeepLessons?.validate(d);
 if(k===KEYS[4])return d=>!!w.StudyTableCoaching?.validate(d);
 if(k===KEYS[5])return d=>!!w.StudyTablePath?.validateSpanish(d);
 if(k===KEYS[6])return d=>!!w.StudyTablePath?.validateGuided(d);
 return ()=>false;
}
function checkData(k,text,strict=true){if(!Object.hasOwn(NAMES,k))throw Error('Unsupported progress section.');if(typeof text!=='string'||text.length>LIMIT)throw Error('Progress record is too large or invalid: '+NAMES[k]);
 let data;try{data=JSON.parse(text)}catch{throw Error('Invalid JSON in '+NAMES[k])}
 if(!obj(data))throw Error('Invalid data in '+NAMES[k]);
 if(strict){const valid=validator(k);try{if(!valid(data))throw Error('Validator not yet available or record rejected.')}catch(e){throw Error(NAMES[k]+' could not be validated: '+String(e.message||e).slice(0,110))}}
 return data;
}
function checkRecord(record,strict=false){
 if(!obj(record)||record.format!=='study-table-live-store'||record.schemaVersion!==VERSION||!Number.isInteger(record.revision)||record.revision<1||record.revision>10000000||!obj(record.items)||!Number.isFinite(Date.parse(record.savedAt)))throw Error('Live-store checkpoint schema is invalid.');
 const json=JSON.stringify(record);if(json.length>MAX)throw Error('Live-store checkpoint exceeds its size limit.');
 if(!/^[a-f0-9]{8}$/.test(record.checksum||'')||record.checksum!==checksum(record.items))throw Error('Live-store checkpoint checksum does not match.');
 if(Object.keys(record.items).some(k=>!Object.hasOwn(NAMES,k)))throw Error('An unknown key was added to the live-store.');
 for(const [k,v] of Object.entries(record.items)){
  if(!obj(v)||typeof v.text!=='string'||!/^(null|[0-9a-f]{8})$/.test(v.mirrorHash||''))throw Error('Damaged progress entry.');
  checkData(k,v.text,strict);
 }
 return record;
}
function readSlot(slot,strict=false){const raw=localStorage.getItem(SLOT[slot]);if(raw===null)return null;return checkRecord(JSON.parse(raw),strict)}
function readHead(){const raw=localStorage.getItem(HEAD);if(raw===null)return null;const x=JSON.parse(raw);if(!obj(x)||x.schemaVersion!==VERSION||!['a','b'].includes(x.active)||!Number.isInteger(x.revision)||x.revision<1||typeof x.checksum!=='string')throw Error('Live-store head is invalid.');return x}
function current(strict=false){const h=readHead();if(!h)return null;const s=readSlot(h.active,strict);if(!s||s.revision!==h.revision||s.checksum!==h.checksum)throw Error('The live-store active checkpoint is missing or damaged.');return {...s,slot:h.active}}
function previous(){const h=readHead();if(!h)return null;try{const s=readSlot(h.active==='a'?'b':'a',true);return s?{...s,slot:h.active==='a'?'b':'a'}:null}catch{return null}}

// An existing V225 schema-v3 checkpoint is never discarded on upgrade.
// The user's current browser records are the source of truth; if they disagree
// with V225's mirror hashes, require explicit adoption before migration.
function predecessor(){
 const raw=localStorage.getItem(OLD_HEAD);if(raw===null)return {status:'none'};
 try{
  const h=JSON.parse(raw);if(!obj(h)||h.schemaVersion!==3||!['a','b'].includes(h.active)||!Number.isInteger(h.revision)||!/^[a-f0-9]{8}$/.test(h.checksum||''))throw Error('V225 head is invalid');
  const text=localStorage.getItem(OLD_PREFIX+'slot-'+h.active);if(text===null)throw Error('V225 active checkpoint is missing');
  const r=JSON.parse(text);if(!obj(r)||r.format!=='study-table-live-store'||r.schemaVersion!==3||r.revision!==h.revision||r.checksum!==h.checksum||!obj(r.items)||r.checksum!==checksum(r.items))throw Error('V225 checkpoint failed its integrity check');
  const labels=[];for(const [k,v] of Object.entries(r.items)){
   if(!Object.hasOwn(NAMES,k)||k===KEYS[5]||k===KEYS[6]||!obj(v)||typeof v.text!=='string'||v.mirrorHash!==hashMirror(v.text))throw Error('V225 record schema mismatch');
   checkData(k,v.text,true);if(hashMirror(localStorage.getItem(k))!==v.mirrorHash)labels.push(NAMES[k]);
  }
  if(JSON.stringify(r).length>MAX)throw Error('V225 checkpoint is too large');
  return {status:labels.length?'external-changes':'ready',revision:r.revision,issues:labels,record:r};
 }catch(e){return {status:'damaged',error:String(e.message||e).slice(0,160)}}
}
function exportPredecessor(){const p=predecessor();if(!p.record)throw Error('No validated V225 checkpoint is available.');return p.record}

function conflicts(c){const issues=[];if(!c)return issues;for(const k of KEYS){const now=localStorage.getItem(k),saved=c.items[k];if(saved){if(hashMirror(now)!==saved.mirrorHash)issues.push(k)}else if(now!==null)issues.push(k)}return issues}
// READ: use the central record only if its legacy mirror still agrees.
// An external restore is never silently overwritten by a stale canonical value.
function read(k){if(!Object.hasOwn(NAMES,k))return localStorage.getItem(k);try{const c=current();if(!c)return localStorage.getItem(k);const r=c.items[k],mirror=localStorage.getItem(k);return r&&hashMirror(mirror)===r.mirrorHash?r.text:mirror}catch{return localStorage.getItem(k)}}
let busy=false;
function commit(items,legacy=null){
 const h=readHead();let prior=null;if(h)prior=current(true);
 const nextSide=h?(h.active==='a'?'b':'a'):'a',rev=h?h.revision+1:1;if(rev>10000000)throw Error('Maximum checkpoint revision reached.');
 const r={format:'study-table-live-store',schemaVersion:VERSION,revision:rev,savedAt:new Date().toISOString(),items,checksum:checksum(items)};
 checkRecord(r,true);const encoded=JSON.stringify(r);if(encoded.length>MAX)throw Error('The live-store is full.');
 const inactiveBefore=localStorage.getItem(SLOT[nextSide]);let oldMirror=null,mirrorChanged=false,headChanged=false;
 try{
  localStorage.setItem(SLOT[nextSide],encoded);
  const verified=readSlot(nextSide,true);if(verified.checksum!==r.checksum)throw Error('Could not verify staged checkpoint.');
  if(legacy){oldMirror=localStorage.getItem(legacy.key);localStorage.setItem(legacy.key,legacy.text);mirrorChanged=true;
   if(localStorage.getItem(legacy.key)!==legacy.text)throw Error('Legacy mirror write verification failed.');}
  const ptr={schemaVersion:VERSION,active:nextSide,revision:rev,checksum:r.checksum};localStorage.setItem(HEAD,JSON.stringify(ptr));
  headChanged=true;if(current(true)?.revision!==rev)throw Error('Live-store commit verification failed.');
  return {revision:rev,slot:nextSide};
 }catch(e){
  // Roll back only before the new pointer is successfully committed; afterwards
  // the new record is authoritative and must not be silently deleted.
  let committed=false;try{const cur=readHead();committed=cur?.revision===rev&&cur.active===nextSide&&cur.checksum===r.checksum}catch{}
  if(!committed){
   if(mirrorChanged){try{if(oldMirror===null)localStorage.removeItem(legacy.key);else localStorage.setItem(legacy.key,oldMirror)}catch{}}
   if(headChanged){try{if(h)localStorage.setItem(HEAD,JSON.stringify(h));else localStorage.removeItem(HEAD)}catch{}}
   try{if(inactiveBefore===null)localStorage.removeItem(SLOT[nextSide]);else localStorage.setItem(SLOT[nextSide],inactiveBefore)}catch{}
  }
  throw e;
 }
}
function capture(){const items={};for(const k of KEYS){const raw=localStorage.getItem(k);if(raw===null)continue;checkData(k,raw,true);items[k]={text:raw,mirrorHash:hashMirror(raw)}}return items}
function activate(adoptOldChanges=false){if(busy)throw Error('Progress operation already underway.');busy=true;try{
 const c=current(true);if(c)throw Error('Unified live saves are already enabled.');
 const p=predecessor();if(p.status==='external-changes'&&!adoptOldChanges)throw Error('V225 contains external changes. Save a complete backup, then explicitly choose to adopt the current browser records.');
 if(p.status==='damaged'&&!adoptOldChanges)throw Error('V225 has a damaged checkpoint. Save a complete backup and explicitly choose to adopt the current browser records.');
 return commit(capture());
}finally{busy=false}}
function reconcile(){if(busy)throw Error('Progress operation already underway.');busy=true;try{
 const c=current(true);if(!c)throw Error('Enable unified live saves first.');
 const changed=conflicts(c);if(!changed.length)throw Error('There are no external changes to reconcile.');
 return {...commit(capture()),changed:changed.map(k=>NAMES[k])};
}finally{busy=false}}
function write(k,text){if(!Object.hasOwn(NAMES,k))throw Error('Unsupported live progress key.');if(busy)throw Error('Progress migration already underway.');busy=true;
 try{
  checkData(k,text,true);
  const c=current(true);if(!c){localStorage.setItem(k,text);return true} // Before opting in, old behavior is retained.
  const changed=conflicts(c);if(changed.length)throw Error('External progress changes detected in '+changed.map(x=>NAMES[x]).join(', ')+'. Open Unified live saves to review and reconcile before continuing.');
  const items={...c.items,[k]:{text,mirrorHash:hashMirror(text)}};commit(items,{key:k,text});return true;
 }finally{busy=false}
}
function health(){try{const c=current(true);if(!c)return {status:'not-activated',revision:0,managed:KEYS.length,issues:[],stored:0,previous:null,predecessor:predecessor()};const issues=conflicts(c);return {status:issues.length?'external-changes':'ready',revision:c.revision,managed:KEYS.length,issues:issues.map(k=>({key:k,label:NAMES[k]})),stored:Object.keys(c.items).length,previous:previous()?.revision||null,savedAt:c.savedAt}}
 catch(e){let recoverable=0;for(const side of ['a','b'])try{if(readSlot(side,true))recoverable++}catch{}return {status:'damaged',error:String(e.message||e),recoverable,managed:KEYS.length}}
}
function repair(){if(busy)throw Error('Progress operation already underway.');busy=true;try{
 try{if(current(true))throw Error('Active checkpoint is healthy.')}catch(e){if(e.message==='Active checkpoint is healthy.')throw e}
 const candidates=[];for(const side of ['a','b'])try{const r=readSlot(side,true);if(r)candidates.push({...r,slot:side})}catch{}
 if(!candidates.length)throw Error('No validated saved checkpoint is available. The older lesson keys are untouched.');
 const c=candidates.sort((x,y)=>y.revision-x.revision)[0];const ptr={schemaVersion:VERSION,active:c.slot,revision:c.revision,checksum:c.checksum};
 localStorage.setItem(HEAD,JSON.stringify(ptr));if(current(true)?.revision!==c.revision)throw Error('Pointer repair failed.');return {revision:c.revision,issues:conflicts(c).map(k=>NAMES[k])};
}finally{busy=false}}
function exportSnapshot(which='current'){
 const data=which==='previous'?previous():current(true);if(!data)throw Error('No validated checkpoint available for export.');
 const record={...data};delete record.slot;return record;
}
window.StudyTableLiveStore={VERSION,NAMES,KEYS,read,write,activate,reconcile,health,repair,current,previous,conflicts,checkData,checkRecord,exportSnapshot,predecessor,exportPredecessor};
})();