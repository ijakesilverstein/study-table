/* Study Table V230 — offline customer launch experience. No account/API required. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const N=(tag,cls='',label='')=>{const x=document.createElement(tag);if(cls)x.className=cls;if(label!==undefined&&label!==null)x.textContent=label;return x};
const B=(label,fn,cls='')=>{const x=N('button',cls,label);x.type='button';x.addEventListener('click',fn);return x};
const SUBJECTS=[['spanish','Spanish','Speak in real sentences'],['piano','Piano','Hear notes and play simple patterns'],['calculus','Calculus','Understand slopes and accumulation'],['physics','Physics','See forces and motion'],['medicine','Medicine','Reason through human physiology'],['economics','Economics','Understand real economic decisions'],['history','History','Investigate evidence and causes'],['chess','Chess','Learn moves and tactics'],['business','Business','Understand business models'],['books','Books','Read closely and think clearly']];
const FEATURES=['StudyTableTeachingStudio','StudyTableReasoningCoach','StudyTableDeepLessons','StudyTableCalendar','StudyTableProgress','StudyTablePath','StudyTableSafety'];
let dialog=null,focusBefore=null,lastCheck=null,attachQueued=false;
function close(){if(dialog?.open)dialog.close()}
function learning(s){close();if(['spanish','piano','calculus','physics'].includes(s)){window.StudyTableTeachingStudio?.open?.(s);return}
 if(window.StudyTableDeepLessons?.open){window.StudyTableDeepLessons.open(s);return}window.StudyTableTeacher?.open?.(s)}
function probe(){const tests=[];const report=(ok,label)=>tests.push({ok,label});
 for(const key of FEATURES)report(typeof window[key]==='object',key==='StudyTableProgress'?'The Progress Center loads.':`${key.replace('StudyTable','')} is available.`);
 try{const k='studytable:v230:probe:'+Math.random().toString(36).slice(2);const v='check-'+Date.now();localStorage.setItem(k,v);const ok=localStorage.getItem(k)===v;localStorage.removeItem(k);report(ok,'This browser can save, read, and remove a temporary test value.')}catch(e){report(false,'This browser cannot reliably write local progress: '+(e?.name||'storage blocked'))}
 try{const b=window.StudyTableProgress?.collectBundle?.();if(!b)throw Error('Exporter unavailable');const valid=window.StudyTableProgress.validateBundle(b);report(!!valid.combined&&!!valid.archive,'A full portable backup contains both supported progress and the older archive.');}catch(e){report(false,'Progress export needs attention: '+String(e?.message||e).slice(0,140))}
 let size=0,keys=0;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&/^(studytable|study-table|spanish-verb-studio)/i.test(k)){size+=(k.length+(localStorage.getItem(k)||'').length)*2;keys++}}if(size>3.5*1024*1024)report(false,`Stored study data is about ${(size/1048576).toFixed(1)} MiB; export your progress and check storage limits.`)}catch{}
 const origin=location.protocol;
 return {tests,pass:tests.every(t=>t.ok),origin,bytes:size,keys,storageRisk:origin==='file:'?'Downloaded HTML files can have path-specific storage. Back up before moving or renaming this file.':'Progress belongs to this browser and site address. Clearing site data may delete it.',timestamp:new Date().toISOString()};
}
function downloadProgress(){const status=$('#st230Status');try{
 const svc=window.StudyTableProgress;if(!svc)throw Error('Progress Center is unavailable');const bundle=svc.collectBundle();const validity=svc.validateBundle(bundle);
 if(!validity.combined||!validity.archive)throw Error('The portable bundle is incomplete. Open My progress to download its available components separately.');
 const content=JSON.stringify(bundle,null,2);if(content.length>30*1024*1024)throw Error('Backup exceeds the portable file limit.');
 const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));const a=N('a');a.href=url;a.download='study-table-progress-backup.json';a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),12000);
 if(status){status.dataset.kind='good';status.textContent='Backup download requested. Confirm the JSON file appears in Downloads. Keep it private: it can contain your writing.'}return true
 }catch(e){if(status){status.dataset.kind='bad';status.textContent='Backup NOT downloaded: '+String(e?.message||e).slice(0,220)}return false}}
function showChecks(){lastCheck=probe();const target=$('#st230Checks');if(!target)return;target.replaceChildren();const intro=N('p','st230-message',lastCheck.pass?'Core lesson and backup checks pass in this browser session.':'At least one check needs attention. Study lessons can still be used, but verify progress protection.');target.append(intro);
 const list=N('ul','st230-check-list');lastCheck.tests.forEach(t=>{const li=N('li',t.ok?'st230-pass':'st230-fail',(t.ok?'✓ ':'! ')+t.label);list.append(li)});target.append(list,N('p','st230-origin',lastCheck.storageRisk));}
function ensure(){if(dialog)return;dialog=N('dialog','st230-dialog');dialog.id='st230Dialog';dialog.setAttribute('aria-labelledby','st230Title');const head=N('header','st230-head');const titles=N('div');titles.append(N('span','st230-kicker','STUDY TABLE · START HERE'),N('h2','','Learn something useful today'));titles.querySelector('h2').id='st230Title';head.append(titles,B('Close',close,'st230-close'));dialog.append(head);
 const body=N('div','st230-body');const intro=N('section','st230-intro');intro.append(N('p','st230-lead','Learn from an explanation, watch a worked example, and explore the idea yourself. Quizzes are optional—not the point.'));const flow=N('div','st230-flow');['1 · Understand','2 · Watch & explore','3 · Try together','4 · Return tomorrow'].forEach(label=>flow.append(N('span','',label)));intro.append(flow);body.append(intro);
 const section=N('section','st230-subjects');section.append(N('h3','','Choose a subject'));const grid=N('div','st230-grid');SUBJECTS.forEach(([s,title,desc])=>{const b=B('',()=>learning(s),'st230-subject');b.append(N('strong','',title),N('span','',desc));grid.append(b)});section.append(grid);body.append(section);
 const safe=N('section','st230-protection');safe.append(N('h3','','Keep your learning safe'),N('p','','Your work saves in this browser, not an online account. Download a progress backup regularly, especially before updating the app or using another browser.'));const actions=N('div','st230-actions');actions.append(B('Download full progress backup',downloadProgress,'st230-primary'),B('Check saving & backup',showChecks,'st230-secondary'),B('Restore an existing backup',()=>{close();window.StudyTablePath?.open?.()},'st230-secondary'));safe.append(actions);const status=N('p','st230-status','');status.id='st230Status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');safe.append(status);const checks=N('div','st230-checks');checks.id='st230Checks';safe.append(checks);body.append(safe);
 body.append(N('p','st230-disclaimer','This is educational practice, not medical, financial, or legal advice. The built-in teacher uses authored explanations and rule-based feedback; it cannot assess every possible answer.'));dialog.append(body);dialog.addEventListener('close',()=>{if(focusBefore?.isConnected)focusBefore.focus()});document.body.append(dialog)}
function open(){focusBefore=document.activeElement;ensure();if(!dialog.open)dialog.showModal();$('#st230Dialog .st230-close')?.focus()}
const KEEP=new Set(['st228Portal','v108CoursesTop','st214Portal','st223Portal']);
function lockOfflineTutors(){
 const online=$('#v28UseOnline');if(online&&!online.disabled){online.checked=false;online.disabled=true;const settings=$('#v28Settings');if(settings&&!$('#st230OfflineNotice',settings)){{const note=N('p','st230-offline-notice','Offline edition: online tutor services are disabled. Built-in lesson help still works.');note.id='st230OfflineNotice';settings.append(note)}}}
 const endpoint=$('#v28Endpoint');if(endpoint)endpoint.disabled=true;
}
function attach(){lockOfflineTutors();const host=$('#v35Content .v36-head-actions');if(!host)return;if(!$('#st230Start',host)){const start=B('Start here',open,'st230-start');start.id='st230Start';host.prepend(start)}
 let menu=$('#st230More',host);if(!menu){menu=N('details','st230-more');menu.id='st230More';menu.append(N('summary','','More tools'),N('div','st230-menu'));host.append(menu)}
 const body=$('.st230-menu',menu);const current=new Set();for(const orig of host.querySelectorAll(':scope > button')){if(KEEP.has(orig.id)||orig.id==='st230Start')continue;const label=orig.textContent.trim();if(!label)continue;const id=orig.id||'anon-'+label.replace(/\W/g,'').slice(0,34);current.add(id);
 if(![...body.children].some(n=>n.dataset.for===id)){const proxy=B(label,()=>{menu.open=false;orig.click()},'st230-menu-item');proxy.dataset.for=id;body.append(proxy)}}
 for(const proxy of [...body.children])if(!current.has(proxy.dataset.for))proxy.remove();
 const full=$('#v108CoursesTop',host);if(full&&full.textContent!=='All subjects')full.textContent='All subjects';const cal=$('#st214Portal',host);if(cal&&cal.textContent!=='Calendar')cal.textContent='Calendar';}
function init(){attach();const observer=new MutationObserver(()=>{if(attachQueued)return;attachQueued=true;queueMicrotask(()=>{attachQueued=false;attach()})});observer.observe(document.body,{subtree:true,childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.StudyTableLaunch={open,close,probe,downloadProgress,choose:learning};
})();