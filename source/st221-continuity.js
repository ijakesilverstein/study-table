/* Study Table V221: complete local archive and explicit reload persistence check.
   This module does NOT restore arbitrary legacy keys. Validated combined restore remains the only restoration path.
   Browser file:// storage behavior must be verified by a real user on their own browser. */
(()=>{'use strict';
 const ARCHIVE_FORMAT='study-table-local-archive',PENDING_KEY='studytable:v221:reload-pending',PROBE_KEY='studytable:v221:reload-probe',RESULT_KEY='studytable:v221:reload-result';
 const MAX_ARCHIVE=24*1024*1024,MAX_ENTRY=8*1024*1024,MAX_KEYS=500,MAX_KEYNAME=256;
 const statusName=['token','password','secret','credential','apikey','api_key','auth','cookie','session'];
 const forbidden=k=>statusName.some(w=>k.toLowerCase().includes(w));
 const allowed=k=>typeof k==='string'&&k.length>0&&k.length<=MAX_KEYNAME&&/^(?:studytable(?:[_:\-]|$)|study-table(?:[_:\-]|$)|spanish-verb-studio(?:[_:\-]|$))/i.test(k)&&!/[\u0000-\u001f<>]/.test(k)&&!forbidden(k)&&![PENDING_KEY,PROBE_KEY,RESULT_KEY].includes(k);
 let result=null,message='',host=null;
 const el=(tag,cls,value)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e};
 function coveredKeys(){try{const backup=window.StudyTablePath?.completeBackup?.();if(!backup||backup.format!=='study-table-complete'||!backup.core||!backup.core.records)throw Error('Combined backup is unavailable.');
  return {ready:true,keys:new Set([...Object.keys(backup.core.records),'studytable:v212:guided-missions','studytable:v210:last-subject','spanish-verb-studio-v1','studytable:v214:learning-calendar','studytable:v214:teaching-room','studytable:v216:deep-lessons','studytable:v219:coaching'])};}
  catch(e){return {ready:false,keys:new Set(),error:String(e?.message||'combined backup unavailable').slice(0,180)}}}
 function collectArchive(){
  const coverage=coveredKeys(),covered=coverage.keys,records=Object.create(null),omitted=[];let bytes=0;
  const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k!==null&&/^(?:studytable(?:[_:\-]|$)|study-table(?:[_:\-]|$)|spanish-verb-studio(?:[_:\-]|$))/i.test(k))keys.push(k)}
  if(keys.length>MAX_KEYS)throw Error('Too many Study Table records to archive safely.');
  keys.sort();for(const k of keys){if(!allowed(k)){omitted.push(k);continue}
   const raw=localStorage.getItem(k);if(typeof raw!=='string')continue;
   if(raw.length>MAX_ENTRY)throw Error(`A saved record is too large to archive: ${k}`);
   bytes+=raw.length+k.length;if(bytes>MAX_ARCHIVE)throw Error('The stored records exceed the maximum archive size.');
   Object.defineProperty(records,k,{value:raw,enumerable:true,configurable:true,writable:true});
  }
  const uncovered=Object.keys(records).filter(k=>!covered.has(k));
  return {format:ARCHIVE_FORMAT,schemaVersion:1,createdAt:new Date().toISOString(),edition:'V221',storageScope:location.protocol,records,coverage:{archivedKeys:Object.keys(records).length,coveredKeys:Object.keys(records).length-uncovered.length,legacyOnlyKeys:coverage.ready?uncovered.length:null,combinedBackupReady:coverage.ready,combinedBackupError:coverage.ready?null:coverage.error,legacyExamples:uncovered.slice(0,8),omittedKeys:omitted.length},restoreNotice:'For emergency safekeeping only. Use the separately downloaded combined backup and the app’s validated Restore button to migrate records. This archive is not automatically restorable.'};
 }
 function validateArchive(data){if(!data||data.format!==ARCHIVE_FORMAT||data.schemaVersion!==1||!data.records||typeof data.records!=='object'||Array.isArray(data.records))throw Error('Unknown or invalid Study Table archive.');const entries=Object.entries(data.records);if(entries.length>MAX_KEYS)throw Error('Archive has too many entries.');let total=0;for(const [k,v] of entries){if(!allowed(k)||typeof v!=='string'||v.length>MAX_ENTRY)throw Error('Archive has an unsafe or too-large record.');total+=k.length+v.length;if(total>MAX_ARCHIVE)throw Error('Archive exceeds the maximum size.');}return {count:entries.length,bytes:total};}
 function download(data,name){const json=JSON.stringify(data,null,2);if(json.length>MAX_ARCHIVE+1024*1024)throw Error('The archive is larger than allowed.');const link=el('a');const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));link.href=url;link.download=name;link.hidden=true;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
 function archive(){try{const data=collectArchive();validateArchive(data);download(data,'study-table-full-local-archive-v221.json');message=data.coverage.combinedBackupReady?`Full local archive download requested: ${data.coverage.archivedKeys} records; ${data.coverage.legacyOnlyKeys} not included in the validated combined backup. Save BOTH files.`:`Emergency archive download requested: ${data.coverage.archivedKeys} raw records. The validated combined backup was unavailable, so this file is for recovery only.`;update();return data.coverage}catch(e){message='Could not create archive: '+(e?.message||'unknown error');update();return null}}
 function checkPending(){let pending;try{pending=sessionStorage.getItem(PENDING_KEY)}catch{return {status:'unavailable',note:'This browser does not allow session storage. The reload test cannot confirm continuity.'}}
  if(!pending){try{return JSON.parse(sessionStorage.getItem(RESULT_KEY)||'null')}catch{return null}}
  try{const data=JSON.parse(pending);if(!data||typeof data.nonce!=='string'||data.nonce.length>150)throw Error('Invalid probe');
   const raw=localStorage.getItem(PROBE_KEY),passed=raw===data.nonce;
   localStorage.removeItem(PROBE_KEY);sessionStorage.removeItem(PENDING_KEY);
   const response={status:passed?'passed':'failed',at:new Date().toISOString(),note:passed?'This browser retained the test record across a same-tab reload. This does not verify a renamed file, browser restart, or another device.':'The browser lost the test record across a reload. Save your progress backup now; do not assume lessons persist.'};
   sessionStorage.setItem(RESULT_KEY,JSON.stringify(response));return response;
  }catch(e){try{sessionStorage.removeItem(PENDING_KEY)}catch{};return {status:'failed',note:'Could not complete reload storage test: '+(e?.message||'browser storage error')}}
 }
 function prepareReload(reload=true){try{if(sessionStorage.getItem(PENDING_KEY))throw Error('An earlier reload test is still pending.');
  const nonce=`study-table-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(PENDING_KEY,JSON.stringify({nonce,at:new Date().toISOString()}));localStorage.setItem(PROBE_KEY,nonce);
  if(localStorage.getItem(PROBE_KEY)!==nonce)throw Error('The browser did not retain the probe after writing.');
  result={status:'pending',note:'Reload check started. The app needs to reload this same page to finish verifying the saved record.'};message=result.note;update();
  if(reload)location.reload();return true;
 }catch(e){try{sessionStorage.removeItem(PENDING_KEY)}catch{};try{localStorage.removeItem(PROBE_KEY)}catch{};result={status:'failed',note:'Could not start the reload check: '+(e?.message||'storage error')};message=result.note;update();return false}}
 function openCombinedRestore(){window.StudyTableSafety?.open?.();const d=document.querySelector('#st220SafetyDialog');d?.querySelector('#st220Message')?.scrollIntoView?.({block:'nearest'});}
 function update(){if(!host)return;const notice=host.querySelector('#st221Status');if(notice)notice.textContent=message||result?.note||'No reload continuity test has been run in this session.';
  const summary=host.querySelector('#st221Coverage');if(!summary)return;
  try{const snap=collectArchive();const c=snap.coverage;summary.textContent=c.combinedBackupReady?`${c.archivedKeys} local records found · ${c.legacyOnlyKeys} are not in the validated combined backup${c.omittedKeys?' · '+c.omittedKeys+' reserved records excluded':''}. ${c.legacyOnlyKeys?'Legacy examples: '+c.legacyExamples.slice(0,3).join(', '):'All currently found records are covered by the combined backup.'}`:`${c.archivedKeys} raw local records can be archived. The validated combined backup is unavailable (${c.combinedBackupError}); preserve this archive until progress can be recovered. No automatic restore is supported.`;
  }catch(e){summary.textContent='Storage inventory unavailable: '+(e?.message||'unknown error')}}
 function attach(){const dialog=document.querySelector('#st220SafetyDialog');if(!dialog||dialog.querySelector('#st221Continuity'))return false;
  const panel=el('section','st221-section');panel.id='st221Continuity';panel.append(el('h3','','Protect older progress'),el('p','','Download TWO files before switching computers: the validated combined backup above and this separate full local archive. The archive protects extra legacy records for recovery but cannot currently be imported automatically. It may contain your written notes.'));
  const summary=el('p','st221-summary','Checking archive coverage…');summary.id='st221Coverage';panel.append(summary);
  const row=el('div','st221-actions');const a=el('button','st221-archive','Download full local archive');a.type='button';a.addEventListener('click',archive);row.append(a);panel.append(row);
  panel.append(el('h3','','Does this browser keep progress after a reload?'),el('p','','Optional check: this safely reloads Study Table, then checks whether this browser retained a test value. It does NOT prove your work survives browser restart, moving this file, or changing devices. Save backups first.'));
  const b=el('button','st221-reload','Verify by reloading this page');b.type='button';b.addEventListener('click',()=>{if(window.confirm('Study Table will reload this page. Save any unfinished notes and download your combined backup first. Continue?'))prepareReload(true)});panel.append(b);
  const note=el('p','st221-result','');note.id='st221Status';note.setAttribute('role','status');note.setAttribute('aria-live','polite');panel.append(note);
  const actions=dialog.querySelector('.st220-actions');if(actions)actions.after(panel);else dialog.querySelector('.st220-panel')?.append(panel);
  host=panel;update();return true;}
 function init(){result=checkPending();if(result?.status==='passed'||result?.status==='failed')message=result.note;
  const ob=new MutationObserver(()=>{if(attach())ob.disconnect()});ob.observe(document.body,{childList:true,subtree:true});attach();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.StudyTableContinuity={collectArchive,validateArchive,downloadArchive:archive,prepareReload,checkPending,latest:()=>result,refresh:update};
})();