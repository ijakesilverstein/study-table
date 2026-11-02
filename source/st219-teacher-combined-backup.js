/* Study Table V213 — coherent practice path and combined, validated backup. Additive to V212. */
(()=>{'use strict';
const SUBJECTS={physics:'Physics',calculus:'Calculus',piano:'Piano',chess:'Chess',medicine:'Medicine',business:'Business'};
const GUIDE_KEY='studytable:v212:guided-missions',LAST_KEY='studytable:v210:last-subject',SPANISH_KEY='spanish-verb-studio-v1',CAL_KEY='studytable:v214:learning-calendar',TEACH_KEY='studytable:v214:teaching-room',DEEP_KEY='studytable:v216:deep-lessons',COACH_KEY='studytable:v219:diagnostic-coach';
let dialog=null,returnFocus=null,pending=null,undo=null,message='';
const $=(sel,scope=document)=>scope.querySelector(sel);
const elem=(tag,cls,content)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(content!==undefined)e.textContent=content;return e};
function button(title,fn,cls=''){const b=elem('button',cls,title);b.type='button';b.addEventListener('click',fn);return b}
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function cleanGuided(g){
 if(!isObj(g)||g.version!==1||!isObj(g.subjects))throw Error('Guided challenges use an unsupported format.');
 const keys=Object.keys(g.subjects);if(keys.length>6||keys.some(k=>!Object.hasOwn(SUBJECTS,k)))throw Error('Guided progress contains an unknown subject.');
 const out={version:1,subjects:{}};
 for(const key of keys){const v=g.subjects[key];if(!isObj(v)||Object.keys(v).some(k=>!['completed','updated'].includes(k))||!Number.isInteger(v.completed)||v.completed<0||v.completed>3)throw Error('Guided progress contains an invalid completion count.');
 const date=String(v.updated||'');if(date.length>60||(date&&!Number.isFinite(Date.parse(date))))throw Error('Guided progress contains an invalid date.');
 out.subjects[key]={completed:v.completed,updated:date};}
 return out;
}
function validateSpanish(x){if(x===null)return null;
 if(!isObj(x))throw Error('Spanish Studio progress has an invalid format.');
 const allowed=new Set(['courseIndex','courseDone','courseMastered','mode','tense','group','level','done','first','asked','misses','sentenceIndex','scene','seen','due','courseReviews','missionIndex','missionStep','missionDone','courseStep','courseStepHadHelp','pendingChapter','chapterCheckStep','chapterCheckHadHelp','chapterChecks']);
 const keys=Object.keys(x);if(keys.length>allowed.size||keys.some(k=>!allowed.has(k)))throw Error('Spanish Studio contains an unknown record.');
 const text=JSON.stringify(x);if(text.length>200000)throw Error('Spanish Studio progress is too large.');
 const seen=new Set();function walk(v,depth){if(depth>9)throw Error('Spanish Studio progress is too deeply nested.');if(v===null||typeof v==='boolean'||typeof v==='string'&&v.length<=4000||typeof v==='number'&&Number.isFinite(v))return;
 if(typeof v==='string')throw Error('Spanish Studio text is too long.');if(Array.isArray(v)){if(v.length>500)throw Error('Spanish Studio list is too large.');for(const i of v)walk(i,depth+1);return}
 if(!isObj(v)||Object.keys(v).length>500)throw Error('Spanish Studio record is invalid.');for(const [k,y] of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k)||k.length>160)throw Error('Spanish Studio contains an unsafe record name.');walk(y,depth+1)}}
 walk(x,0);
 for(const k of ['courseIndex','done','first','asked','misses','sentenceIndex','scene','missionIndex','missionStep','courseStep','pendingChapter','chapterCheckStep'])if(k in x&&(!Number.isInteger(x[k])||x[k]<-1||x[k]>100000))throw Error('Spanish Studio progress has an invalid count.');
 if(x.courseIndex>48||x.courseStep>2||x.pendingChapter>7||x.chapterCheckStep>1)throw Error('Spanish Studio lesson index is out of range.');
 for(const k of ['courseDone','courseMastered','seen','due','missionDone'])if(k in x&&!Array.isArray(x[k]))throw Error('Spanish Studio list is invalid.');
 for(const k of ['courseStepHadHelp','chapterCheckHadHelp'])if(k in x&&typeof x[k]!=='boolean')throw Error('Spanish Studio flags are invalid.');
 for(const k of ['courseReviews','chapterChecks'])if(k in x&&!isObj(x[k]))throw Error('Spanish Studio review records are invalid.');
 if(x.mode&&!['course','verbs','sentences','conversations','missions','review'].includes(x.mode))throw Error('Spanish Studio mode is invalid.');
 if(x.tense&&!['present','preterite','imperfect','future','near','mix'].includes(x.tense))throw Error('Spanish Studio tense is invalid.');
 if(x.group&&!['starter','everyday','regular','irregular','all'].includes(x.group))throw Error('Spanish Studio verb group is invalid.');
 if(x.level&&!['choose','type'].includes(x.level))throw Error('Spanish Studio exercise mode is invalid.');
 return x;
}
function spanish(){const raw=localStorage.getItem(SPANISH_KEY);return raw===null?null:validateSpanish(JSON.parse(raw))}
function guided(){try{return cleanGuided(JSON.parse(localStorage.getItem(GUIDE_KEY)||'{"version":1,"subjects":{}}'))}catch{return {version:1,subjects:{}}}}
function numSteps(g=guided()){return Object.values(g.subjects).reduce((n,s)=>n+s.completed,0)}
function checks(){try{return window.StudyTableChapterChecks?.getState()?.chapters||{}}catch{return {}}}
function dueCount(){const now=Date.now();return Object.values(checks()).filter(r=>r&&Number.isFinite(Date.parse(r.due))&&Date.parse(r.due)<=now).length}
function preferredSubject(){let s=null;try{s=window.studyTableFullCourses?.readingPlace?.()?.subject||localStorage.getItem(LAST_KEY)}catch{}return SUBJECTS[s]?s:'physics'}
function nextMission(){const g=guided(),preferred=preferredSubject();if((g.subjects[preferred]?.completed||0)<3)return preferred;return Object.keys(SUBJECTS).find(s=>(g.subjects[s]?.completed||0)<3)||preferred}
function stats(){const list=Object.values(checks());return {due:dueCount(),reviewed:list.length,guided:numSteps(),possible:18}}
function showStatus(text,kind='info'){message=text;const el=$('#st213Status');if(el){el.textContent=text;el.dataset.kind=kind}}
function openCourse(){close();$('#st205Open')?.click()}
function openReviews(){close();$('#st205Open')?.click();setTimeout(()=>$('#st207ReviewCount')?.click(),0)}
function openLab(sub){close();window.StudyTableLabs?.open(sub)}
function resume(){const place=window.studyTableFullCourses?.readingPlace?.();close();if(place)window.studyTableFullCourses?.resume?.();else $('#st205Open')?.click()}
function pathCard(holder,eyebrow,title,detail,cta,fn){const card=elem('article','st213-step');card.append(elem('span','st213-eyebrow',eyebrow),elem('h3','',title),elem('p','',detail),button(cta,fn,'st213-primary'));holder.append(card)}
function render(){if(!dialog)return;const body=$('#st213Body',dialog);body.replaceChildren();const st=stats(),place=window.studyTableFullCourses?.readingPlace?.();
 const today=new Date(),isoDate=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
 const planned=window.StudyTableCalendar?.getPlan?.(isoDate), all=window.StudyTableTeacher?.getLessons?.()||{},planSubject=planned?.subject||preferredSubject();const subject=all[planSubject]?planSubject:'spanish',label=planSubject[0].toUpperCase()+planSubject.slice(1),lessonIndex=window.StudyTableTeacher?.next?.(subject)||0;
 const summary=elem('section','st213-summary');const learned=window.StudyTableTeacher?.counts?.().completed||0;summary.append(elem('h3','','A simple plan for today'),elem('p','',`${planned?.minutes||10} minutes planned · ${learned} guided lessons completed · ${st.due} chapter reviews due. You do not have to take a quiz to finish learning today.`));body.append(summary);
 const cards=elem('div','st213-cards');
 pathCard(cards,'FIRST · LEARN',`Understand ${label} with a worked example`,'Start with an explanation, watch each step unfold, then see the idea applied again.','Teach me this concept',()=>{close();window.StudyTableTeacher?.open(subject,lessonIndex)});
 if(Object.hasOwn(SUBJECTS,subject))pathCard(cards,'THEN · EXPLORE',`${label} · interactive lab`,'Change something and observe the result. No scoring or countdown.','Open the learning lab',()=>openLab(subject));
 else pathCard(cards,'THEN · APPLY','Explain it in your own words','Write a quick personal example or question in your guided lesson notes. This is part of learning, not a test.','Continue the lesson',()=>{close();window.StudyTableTeacher?.open(subject,lessonIndex)});
 pathCard(cards,'OPTIONAL · RECALL',st.due?`${st.due} reviews due when you are ready`:'Check your understanding','Only after learning, and only if you want: use the existing practice questions to see what you remember.','Go to chapter reviews',openReviews);
 body.append(cards);
 const row=elem('section','st213-tools');row.append(elem('h3','','Keep your progress together'),elem('p','','One file includes courses, Spanish Studio, the calendar, deep teaching, and the new mistake-repair coaching practice. Older backup buttons still work, but may cover only part of your work.'));
 const buttons=elem('div','st213-tool-buttons');buttons.append(button('Save combined backup',exportBackup,'st213-secondary'),button('Restore combined backup',()=>$('#st213File',dialog).click(),'st213-secondary'));row.append(buttons);
 const file=elem('input');file.type='file';file.accept='.json,application/json';file.id='st213File';file.hidden=true;file.addEventListener('change',async()=>{const incoming=file.files?.[0];file.value='';if(incoming)await preview(incoming)});row.append(file);body.append(row);
 const previewPane=elem('section','st213-preview');previewPane.id='st213Preview';previewPane.hidden=!pending;
 if(pending){previewPane.append(elem('h3','','Review this restore'),elem('p','',`${pending.coreCount} existing saved sections · ${numSteps(pending.guided)} guided steps · ${pending.spanish===null?"Spanish Studio not in file":"Spanish Studio included"} · ${pending.calendar?"calendar included · ":""}${pending.teaching?"guided teaching included · ":""}${pending.deep?"deeper workshops included · ":""}${pending.coach?"diagnostic practice included · ":""}${pending.changes} existing sections will change.`),elem('p','','This will replace the guided-lab progress and the saved subject preference. Existing course conflicts use the imported file. Export your current work before proceeding.'));
 const buttons=elem('div','st213-tool-buttons');buttons.append(button('Apply restore',applyRestore,'st213-primary'),button('Cancel',()=>{pending=null;render()},'st213-secondary'));previewPane.append(buttons)}body.append(previewPane);
 const actions=elem('div','st213-tool-buttons');const undoButton=button('Undo last restore',undoRestore,'st213-secondary');undoButton.disabled=!undo;actions.append(undoButton);if(undo)actions.append(button('Reload updated lessons',()=>location.reload(),'st213-secondary'));body.append(actions);
 const feedback=elem('p','st213-status',message||'All data stays in this browser until you export it.');feedback.id='st213Status';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');body.append(feedback);
}
function completeBackup(){const core=window.studyTableBackup?.collect?.();if(!core||core.format!=='study-table-backup'||!isObj(core.records))throw Error('Your older course backup is unavailable. Open the courses first and try again.');return {format:'study-table-complete',schemaVersion:1,exportedAt:new Date().toISOString(),core,guided:guided(),spanishStudio:spanish(),lastSubject:preferredSubject(),calendar:window.StudyTableCalendar?.getState?.()||null,teaching:window.StudyTableTeacher?.getState?.()||null,deepTeaching:window.StudyTableDeepLessons?.getState?.()||null,diagnosticCoaching:window.StudyTableDiagnosticCoach?.getState?.()||null}}
function downloadJson(data,name){const text=JSON.stringify(data,null,2);if(text.length>20*1024*1024)throw Error('Progress exceeds the 20 MB backup limit.');const href=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=elem('a');a.href=href;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),12000)}
function exportBackup(){try{downloadJson(completeBackup(),'study-table-complete-v219.json');showStatus('Combined backup saved. Keep the file somewhere safe.','good')}catch(e){showStatus(e.message,'warn')}}
async function preview(file){pending=null;if(file.size>20*1024*1024){showStatus('Choose a combined Study Table backup smaller than 20 MB.','warn');return}try{const data=JSON.parse(await file.text());if(!isObj(data)||data.format!=='study-table-complete'||data.schemaVersion!==1||!isObj(data.core)||!isObj(data.core.records)||!Object.keys(data.core.records).length&&!Object.keys(data.guided?.subjects||{}).length)throw Error('Choose a Study Table combined backup.');
 const g=cleanGuided(data.guided),span=validateSpanish(data.spanishStudio===undefined?null:data.spanishStudio),s=data.lastSubject;if(s!==null&&s!==undefined&&!Object.hasOwn(SUBJECTS,s))throw Error('The saved subject is invalid.');
 const hasCore=Object.keys(data.core.records).length>0;
 const plan=hasCore?window.studyTableBackup.prepare(data.core,true):null;
 const cal=data.calendar==null?null:window.StudyTableCalendar?.validate?.(data.calendar);if(data.calendar!=null&&!cal)throw Error('Learning calendar unavailable for restore.');const teach=data.teaching==null?null:window.StudyTableTeacher?.validate?.(data.teaching);if(data.teaching!=null&&!teach)throw Error('Teaching progress unavailable for restore.');const deep=data.deepTeaching==null?null:window.StudyTableDeepLessons?.validate?.(data.deepTeaching);if(data.deepTeaching!=null&&!deep)throw Error('Deeper teaching progress unavailable for restore.');
 const coach=data.diagnosticCoaching==null?null:window.StudyTableDiagnosticCoach?.validate?.(data.diagnosticCoaching);if(data.diagnosticCoaching!=null&&!coach)throw Error('Diagnostic coaching progress unavailable for restore.');
 pending={guided:g,spanish:span,calendar:cal,teaching:teach,deep,coach,lastSubject:s||'physics',coreCount:Object.keys(data.core.records).length,changes:plan?.updates?.length||0,plan};message='Nothing changed yet. Check the counts, then apply if this is the right file.';render()
 }catch(e){showStatus('Could not preview: '+e.message,'warn')}}
function applyRestore(){if(!pending)return;const plan=pending;
 const keys=[GUIDE_KEY,LAST_KEY,SPANISH_KEY,CAL_KEY,TEACH_KEY,DEEP_KEY,COACH_KEY];const before=Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]));
 const writes=[[GUIDE_KEY,JSON.stringify(plan.guided)],[LAST_KEY,plan.lastSubject]];
 if(plan.spanish!==null)writes.push([SPANISH_KEY,JSON.stringify(plan.spanish)]);
 if(plan.calendar!==null)writes.push([CAL_KEY,JSON.stringify(plan.calendar)]);
 if(plan.teaching!==null)writes.push([TEACH_KEY,JSON.stringify(plan.teaching)]);if(plan.deep!==null)writes.push([DEEP_KEY,JSON.stringify(plan.deep)]);if(plan.coach!==null)writes.push([COACH_KEY,JSON.stringify(plan.coach)]);
 let coreApplied=false;
 try{if(!window.confirm(`Restore ${plan.coreCount} existing sections and ${numSteps(plan.guided)} guided steps? Save a backup of your current work first.`))return;
  for(const [key,value] of writes){localStorage.setItem(key,value);if(localStorage.getItem(key)!==value)throw Error('Browser storage verification failed.');}
  if(plan.plan?.updates?.length){window.studyTableBackup.apply(plan.plan);coreApplied=true}
  const after=Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]));
  undo={before,after,coreApplied};pending=null;
  window.StudyTableChapterChecks?.reload?.();window.StudyTableCalendar?.reload?.();window.StudyTableTeacher?.reload?.();window.StudyTableDeepLessons?.reload?.();window.StudyTableDiagnosticCoach?.reload?.();render();showStatus('Restore applied. You can undo before reloading.','good');
 }catch(e){if(coreApplied)try{window.studyTableBackup.undo()}catch{};
  try{for(const [key,value] of Object.entries(before))if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);window.StudyTableCalendar?.reload?.();window.StudyTableTeacher?.reload?.();window.StudyTableDiagnosticCoach?.reload?.()}catch{};
  showStatus('Restore was not completed: '+e.message,'warn')}
}
function undoRestore(){if(!undo)return;try{for(const [key,value] of Object.entries(undo.after))if(localStorage.getItem(key)!==value)throw Error('Progress changed after the restore; Undo would overwrite it.');
 if(undo.coreApplied)window.studyTableBackup.undo();
 for(const [key,value] of Object.entries(undo.before))if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);
 undo=null;window.StudyTableChapterChecks?.reload?.();window.StudyTableCalendar?.reload?.();window.StudyTableTeacher?.reload?.();window.StudyTableDeepLessons?.reload?.();window.StudyTableDiagnosticCoach?.reload?.();render();showStatus('Your previous progress has been restored. Reload to update open exercises.','good');
 }catch(e){showStatus('Undo not completed: '+e.message,'warn')}}
function close(){if(dialog?.open)dialog.close()}
function ensure(){if(dialog)return dialog;dialog=elem('dialog','st213-dialog');dialog.id='st213Dialog';dialog.setAttribute('aria-label','Your next ten minutes');const shell=elem('div','st213-shell');const header=elem('header','st213-header');const intro=elem('div');intro.append(elem('span','st213-eyebrow','STUDY TABLE · YOUR NEXT 10 MINUTES'),elem('h2','','Learn something. Try it. Remember it.'));header.append(intro,button('Close',close,'st213-close'));const body=elem('div','st213-body');body.id='st213Body';shell.append(header,body);dialog.append(shell);dialog.addEventListener('close',()=>returnFocus?.isConnected&&returnFocus.focus());document.body.append(dialog);return dialog}
function open(){returnFocus=document.activeElement;ensure();pending=null;render();if(!dialog.open)dialog.showModal();$('#st213Dialog .st213-close')?.focus()}
function attach(){const portal=$('#v35Content .v36-head-actions')||$('#v35Content .v35-head');if(portal&&!$('#st213Portal',portal)){const b=button('My next 10 minutes',open,'st213-portal');b.id='st213Portal';portal.append(b)}
 const hub=$('#st205Top');if(hub&&!$('#st213Launch',hub)){const b=button('My next 10 minutes',open,'st213-launch');b.id='st213Launch';hub.insertBefore(b,$('#st205Close',hub))}
 const home=$('#v90Hero .v90-actions');if(home&&!$('#st213Home',home)){const b=button('My next 10 minutes',open,'st213-home');b.id='st213Home';home.append(b)}
 const bar=$('.viewerbar');if(bar&&document.body.classList.contains('full-course-reading')){
  const reading=window.studyTableFullCourses?.readingPlace?.(),heading=bar.querySelector('strong')?.textContent||'',fallback=window.studyTableFullCourses?.courses?.find(c=>heading.startsWith(c.title))?.subject,subject=SUBJECTS[reading?.subject]?reading.subject:fallback;
  let b=$('#st213LessonLab',bar);if(Object.hasOwn(SUBJECTS,subject)){
   if(!b){const go=()=>{const s=b.dataset.subject;if(Object.hasOwn(SUBJECTS,s))window.StudyTableLabs?.open(s)};b=button('Try this in a lab',go,'st213-lesson');b.id='st213LessonLab';b.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();go()});b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});bar.append(b)}b.dataset.subject=subject;b.hidden=false;
  }else if(b)b.hidden=true;
 }else $('#st213LessonLab')?.setAttribute('hidden','');
}
function install(){document.title='Study Table — Diagnostic Teacher (V219)';const tag=$('title');if(tag)new MutationObserver(()=>{if(document.title!=='Study Table — Diagnostic Teacher (V219)')document.title='Study Table — Diagnostic Teacher (V219)'}).observe(tag,{childList:true,characterData:true,subtree:true});const meta=$('meta[name="study-table-build"]');if(meta)meta.content='V219 diagnostic teacher and combined progress backup';
 const observer=new MutationObserver(()=>{if(attach.queued)return;attach.queued=true;queueMicrotask(()=>{attach.queued=false;attach()})});observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});attach();window.addEventListener('pageshow',attach)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.StudyTablePath={open,stats,preview,completeBackup,validateGuided:cleanGuided,validateSpanish};
})();