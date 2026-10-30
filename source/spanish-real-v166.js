/* V166: a tiny, authored practice -> real person -> reflect -> return loop.
   Inspired by the concurrent Spanish for Someone V53 product direction.
   Not a verbatim port of V53 source and not evidence that speech was recorded. */
const V166_SPANISH_SCENES = __V166_SCENES__;
const V166_KEY='studytable:spanish:real-life:v166';
const V166_SCENES=Object.fromEntries(V166_SPANISH_SCENES.map(s=>[s.id,s]));
let v166State={scene:'cafe',step:0,choice:null,stage:'intro',draft:''};
const v166Today=(when=new Date())=>[when.getFullYear(),String(when.getMonth()+1).padStart(2,'0'),String(when.getDate()).padStart(2,'0')].join('-');
function v166DayShift(days){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return v166Today(d)}
function v166Load(){
 try{const x=JSON.parse(localStorage.getItem(V166_KEY)||'null');if(x?.version!==1||!Array.isArray(x.entries))return {version:1,entries:[]};return {version:1,entries:x.entries.filter(e=>e&&V166_SCENES[e.scene]).slice(-25)}}catch{return {version:1,entries:[]}}
}
function v166Save(entries){try{localStorage.setItem(V166_KEY,JSON.stringify({version:1,entries:entries.slice(-25)}));return true}catch{return false}}
function v166SpanishMarkup(){
 return '<section class="v166-real" id="v166Real" aria-labelledby="v166Title">'+
 '<p class="v166-eyebrow">Spanish outside the app</p><h2 id="v166Title">Take one conversation into real life</h2>'+
 '<p>You can rehearse here, but the goal is to speak with an actual person. A good first try might be one sentence. The app will never call practice a real conversation.</p>'+
 '<div class="v166-start"><label for="v166Scene">Choose a moment you may actually encounter</label><select id="v166Scene">'+V166_SPANISH_SCENES.map(s=>'<option value="'+escape(s.id)+'">'+escape(s.title)+'</option>').join('')+'</select><button type="button" data-v166-start>Practice this conversation</button></div>'+
 '<div id="v166Stage" aria-live="polite"></div><div id="v166Journal"></div><p class="v166-private">Your plan and report are saved in this browser only. They are not in Study Table’s existing progress backup. You can export your Spanish conversation journal below.</p></section>';
}
function v166LessonBridge(unit){return unit.id==='spanish-5'?'<aside class="v166-bridge"><p><strong>Want to try this with a real person?</strong> Rehearse a short conversation, then record what actually happened—separately from app practice.</p><button type="button" data-v166-lesson>Make a real-world conversation plan</button></aside>':''}
function v166Audio(text){
 if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window))return false;
 window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=.85;
 const spanish=window.speechSynthesis.getVoices().find(v=>v.lang?.toLowerCase().startsWith('es'));
 if(spanish)u.voice=spanish;window.speechSynthesis.speak(u);return true
}
function v166Render(){
 const host=document.getElementById('v166Stage');if(!host)return;
 const scene=V166_SCENES[v166State.scene];if(!scene)return;
 const at=v166State.step,turn=scene.turns[at];
 if(v166State.stage==='intro'){
  host.innerHTML='<p class="v166-context">'+escape(scene.goal)+' You will meet a <strong>'+escape(scene.person.toLowerCase())+'</strong> in this rehearsal. Choose what to say. Then try saying it aloud yourself.</p>';return;
 }
 if(v166State.stage==='practice'){
  const chosen=v166State.choice;
  host.innerHTML='<div class="v166-play"><p class="v166-step">Turn '+(at+1)+' of '+scene.turns.length+' · '+escape(scene.title)+'</p><p class="v166-heard" lang="es">'+escape(turn.heard)+'</p><div class="v166-inline"><button type="button" data-v166-audio="heard">Hear the Spanish</button><button type="button" data-v166-meaning aria-expanded="false">What does that mean?</button></div><p data-v166-translation hidden>'+escape(turn.meaning)+'</p><h3>What would you say?</h3><div class="v166-options">'+turn.options.map((x,i)=>'<button type="button" data-v166-choice="'+i+'" aria-pressed="'+(chosen===i)+'" lang="es">'+escape(x)+'</button>').join('')+'</div><div class="v166-feedback" '+(chosen===null?'hidden':'')+'><p>'+(chosen===null?'':escape(turn.why[chosen]))+'</p>'+(chosen===null?'':'<p>Another useful way to say it: <span lang="es">'+escape(turn.repair)+'</span></p><button type="button" data-v166-audio="chosen">Hear my response</button>')+'</div><label for="v166Scratch">Try it in your own words (optional; not graded)</label><textarea id="v166Scratch" rows="2" maxlength="300" placeholder="Think it, say it, or type it here..."></textarea><div class="v166-inline"><button type="button" data-v166-next '+(chosen===null?'disabled':'')+'>'+(at===2?'Finish rehearsal':'Next turn')+'</button><button type="button" data-v166-skip>Show the meaning and useful response</button></div></div>';
  host.querySelector('#v166Scratch').value=v166State.draft||'';
  return;
 }
 if(v166State.stage==='plan'){
  host.innerHTML='<div class="v166-plan"><h3>Now try a real conversation</h3><p>You rehearsed three turns. That is preparation, not proof you talked with anyone. When might you actually try it?</p><fieldset><legend>When do you expect an opportunity?</legend><label><input name="v166-when" type="radio" value="today" checked> Later today</label><label><input name="v166-when" type="radio" value="tomorrow"> Tomorrow</label><label><input name="v166-when" type="radio" value="unknown"> Not sure yet</label></fieldset><p>Try one sentence, listen to the response, and ask for slower speech if needed: <span lang="es">¿Puede repetirlo más despacio?</span></p><button type="button" data-v166-save-plan>Save this preparation plan</button><button type="button" data-v166-again>Rehearse again</button><p class="v166-state" data-v166-message role="status"></p></div>';
 }
}
function v166ReportStatus(entry){
 if(!entry.report)return 'Preparation saved · real-world outcome not reported';
 const r=entry.report;
 if(r.outcome==='no-chance')return 'No opportunity yet · not a real conversation';
 const day=r.realDay||null; // Freeze the reported calendar day; never shift evidence as time passes.
 const expected=entry.when==='today'?entry.day:entry.when==='tomorrow'?(()=>{const d=new Date(entry.day+'T12:00:00');d.setDate(d.getDate()+1);return v166Today(d)})():null;
 if(entry.plannedAt && r.after==='yes' && day && expected===day && r.outcome==='used')return 'Reported real Spanish use after preparation · self-reported, not independently verified';
 if(entry.plannedAt && r.after==='yes' && day && expected===day && r.outcome==='tried')return 'Reported trying to speak after preparation · self-reported, not independently verified';
 if(!entry.plannedAt||r.after==='no')return 'After-the-fact or earlier conversation · not counted as prepared use';
 return 'Timing or outcome uncertain · not counted as prepared use';
}
function v166Journal(){
 const host=document.getElementById('v166Journal');if(!host)return;
 const entries=v166Load().entries;
 const latest=entries.slice(-5).reverse();
 host.innerHTML='<section class="v166-journal"><h3>Return after the real conversation</h3><p>Only you can say what happened. Rehearsal never becomes a completed conversation automatically.</p>'+
 (latest.length?'<div class="v166-records">'+latest.map((e,i)=>'<article><strong>'+escape(V166_SCENES[e.scene]?.title||'Spanish moment')+'</strong><p>'+escape(v166ReportStatus(e))+'</p><p class="v166-small">Prepared: '+(e.plannedAt?escape(e.day):'Not prepared in advance')+'. '+(e.report?'Reported: '+escape(e.report.reportedDay):'No outcome yet')+'</p><button type="button" data-v166-report="'+(entries.length-1-i)+'">'+(e.report?'Correct what I reported':'Report what actually happened')+'</button></article>').join('')+'</div>':'<p>No plans saved yet. You can also report an earlier conversation without pretending you prepared for it.</p>')+
 '<div class="v166-inline"><button type="button" data-v166-past>Record an earlier conversation</button>'+(entries.length?'<button type="button" data-v166-export>Export my Spanish journal</button><button type="button" data-v166-clear>Clear journal from this browser</button>':'')+'</div><div id="v166ReportArea"></div></section>';
}
function v166OpenReport(index){
 const area=document.getElementById('v166ReportArea');if(!area)return;
 const all=v166Load().entries,old=all[index],isPast=index===-1;
 const scene=isPast?v166State.scene:(old?.scene||v166State.scene);
 area.innerHTML='<form id="v166ReportForm" class="v166-report"><h4>'+(isPast?'Record an earlier conversation':'What actually happened?')+'</h4><p>Choose carefully. It is fine if you never got the chance.</p>'+
 (isPast?'<label for="v166PastScene">Which kind of conversation?</label><select id="v166PastScene" name="scene">'+V166_SPANISH_SCENES.map(s=>'<option value="'+escape(s.id)+'"'+(s.id===scene?' selected':'')+'>'+escape(s.title)+'</option>').join('')+'</select>':'')+
 '<label for="v166Outcome">What happened?</label><select id="v166Outcome" name="outcome" required><option value="used">I used some Spanish with a real person</option><option value="tried">I tried but got stuck</option><option value="no-chance">I did not have the opportunity</option></select>'+
 '<label for="v166Day">When?</label><select id="v166Day" name="day"><option value="today">Today</option><option value="yesterday">Yesterday</option><option value="earlier">Earlier</option><option value="unknown">I am not sure</option></select>'+
 '<label for="v166After">Did the conversation happen after you practiced here?</label><select id="v166After" name="after"><option value="unknown">Not sure / not applicable</option><option value="yes">Yes, after practicing here</option><option value="no">No, before practicing here</option></select>'+
 '<label for="v166Note">One thing you said, heard or want to try next (optional)</label><textarea id="v166Note" name="note" rows="2" maxlength="300" placeholder="Keep this short and avoid private details about other people."></textarea>'+
 '<div class="v166-inline"><button type="submit">'+(old?.report?'Save correction':'Save my report')+'</button><button type="button" data-v166-cancel>Cancel</button></div><p class="v166-small">Real-life use and its timing are self-reported. An uncertain or later report cannot be converted into verified progress.</p></form>';
 area.querySelector('#v166ReportForm').dataset.index=String(index);
 if(old?.report){for(const f of ['outcome','day','after','note'])area.querySelector('[name="'+f+'"]').value=old.report[f]||''}
 area.scrollIntoView({block:'nearest'});area.querySelector('#v166Outcome').focus({preventScroll:true});
}
function v166SaveReport(form){
 const entries=v166Load().entries,index=Number(form.dataset.index);const fd=new FormData(form);
 const outcome=fd.get('outcome'),day=fd.get('day'),after=fd.get('after'),note=String(fd.get('note')||'').trim().slice(0,300);
 if(!['used','tried','no-chance'].includes(outcome)||!['today','yesterday','earlier','unknown'].includes(day)||!['yes','no','unknown'].includes(after))return;
 const report={outcome,day,realDay:day==='today'?v166Today():day==='yesterday'?v166DayShift(-1):null,after,note,reportedAt:new Date().toISOString(),reportedDay:v166Today()};
 if(index===-1){const scene=fd.get('scene');if(!V166_SCENES[scene])return;entries.push({scene,day:v166Today(),when:'unknown',plannedAt:null,report})}
 else if(entries[index])entries[index].report=report;
 else return;
 if(!v166Save(entries)){const p=form.querySelector('.v166-small');p.textContent='This browser could not save the report. Your answer has not been recorded.';return}
 v166Journal();document.getElementById('v166Journal')?.querySelector('h3')?.focus({preventScroll:true});
}
function v166Start(scene=v166State.scene){
 if(!V166_SCENES[scene])scene='cafe';v166State={scene,step:0,choice:null,stage:'practice',draft:''};
 const select=document.getElementById('v166Scene');if(select)select.value=scene;
 v166Render();document.querySelector('#v166Stage .v166-heard')?.scrollIntoView({block:'nearest'});
}
function v166GoMap(){showMap();const spot=document.getElementById('v166Real');if(spot){spot.scrollIntoView({block:'start'});spot.querySelector('[data-v166-start]')?.focus({preventScroll:true})}}
function v166Open(){v166GoMap()}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-v166-start],[data-v166-choice],[data-v166-next],[data-v166-meaning],[data-v166-skip],[data-v166-audio],[data-v166-save-plan],[data-v166-again],[data-v166-report],[data-v166-past],[data-v166-cancel],[data-v166-export],[data-v166-clear],[data-v166-lesson],[data-v166-open]');
 if(!button)return;
 if(button.hasAttribute('data-v166-lesson')||button.hasAttribute('data-v166-open')){v166GoMap();return}
 if(button.hasAttribute('data-v166-start')){v166Start(document.getElementById('v166Scene')?.value);return}
 if(button.hasAttribute('data-v166-choice')){v166State.choice=Number(button.dataset.v166Choice);v166State.draft=document.getElementById('v166Scratch')?.value||'';v166Render();document.querySelector('[data-v166-choice="'+v166State.choice+'"]')?.focus({preventScroll:true});return}
 if(button.hasAttribute('data-v166-meaning')){const p=document.querySelector('#v166Stage [data-v166-translation]');if(p){p.hidden=!p.hidden;button.setAttribute('aria-expanded',String(!p.hidden))}return}
 if(button.hasAttribute('data-v166-audio')){const scene=V166_SCENES[v166State.scene],turn=scene.turns[v166State.step];const spoken=button.dataset.v166Audio==='chosen'?turn.options[v166State.choice]:turn.heard;if(spoken&&!v166Audio(spoken))button.textContent='Audio unavailable here; read the Spanish aloud';return}
 if(button.hasAttribute('data-v166-skip')){const turn=V166_SCENES[v166State.scene].turns[v166State.step];const p=document.querySelector('[data-v166-translation]');if(p)p.hidden=false;v166State.draft=document.getElementById('v166Scratch')?.value||'';v166State.choice=turn.best;v166Render();const t=document.querySelector('[data-v166-translation]');if(t)t.hidden=false;return}
 if(button.hasAttribute('data-v166-next')){if(v166State.choice===null)return;v166State.draft='';if(v166State.step===2)v166State.stage='plan';else{v166State.step++;v166State.choice=null}v166Render();return}
 if(button.hasAttribute('data-v166-save-plan')){
  const when=document.querySelector('[name="v166-when"]:checked')?.value;if(!['today','tomorrow','unknown'].includes(when))return;
  const entries=v166Load().entries;
  entries.push({scene:v166State.scene,day:v166Today(),plannedAt:new Date().toISOString(),when,report:null});
  const message=document.querySelector('[data-v166-message]');if(v166Save(entries)){if(message)message.textContent='Preparation saved. Return after an actual conversation to tell us what happened. This does not count as real-world use yet.';button.disabled=true;v166Journal()}else if(message)message.textContent='This browser could not save your plan. You can still try the conversation.';
  return;
 }
 if(button.hasAttribute('data-v166-again')){v166Start();return}
 if(button.hasAttribute('data-v166-report')){v166OpenReport(Number(button.dataset.v166Report));return}
 if(button.hasAttribute('data-v166-past')){v166OpenReport(-1);return}
 if(button.hasAttribute('data-v166-cancel')){document.getElementById('v166ReportArea').replaceChildren();return}
 if(button.hasAttribute('data-v166-export')){
  const data=v166Load();const blob=new Blob([JSON.stringify({kind:'studytable-spanish-conversation-journal',...data},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='study-table-spanish-conversations-v166.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);return;
 }
 if(button.hasAttribute('data-v166-clear')){if(window.confirm('Clear the locally saved Spanish conversation journal? Export it first if you want a copy.')){try{localStorage.removeItem(V166_KEY)}catch{}v166Journal()}return}
});
document.addEventListener('submit',event=>{if(event.target.id==='v166ReportForm'){event.preventDefault();v166SaveReport(event.target)}});
document.addEventListener('change',event=>{if(event.target.id==='v166Scene'&&V166_SCENES[event.target.value]){v166State={...v166State,scene:event.target.value,step:0,choice:null,stage:'intro',draft:''};v166Render()}});
// New card is reconstructed when a reader opens its map; keep journal current each time.
const v166Observe=new MutationObserver(()=>{const card=document.getElementById('v166Real');if(card&&!card.dataset.v166Mounted){card.dataset.v166Mounted='1';v166State.stage='intro';v166Render();v166Journal()}});
v166Observe.observe(document.getElementById('courseArticle'),{childList:true});
window.studyTableSpanishV166={version:166,scenes:V166_SPANISH_SCENES,load:v166Load,open:v166Open,reportStatus:v166ReportStatus};