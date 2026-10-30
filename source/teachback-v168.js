/* V168: optional, source-grounded self-explanation across all 87 authored units.
   Never grade or store freeform writing. Exact checked practice is a separate module. */
function v168InviteMarkup(unit){
 if(V133_BANK[unit?.id]?.subject!==COURSE.subject)return "";
 return '<p id="v168Invite" class="v168-invite" hidden>Already tried a fresh problem? Make the reasoning yours.<button type="button" data-v168-open>Explain it in your own words</button></p>';
}
function v168TeachbackMarkup(unit){
  if(!unit?.exercise?.[0]||!unit?.exercise?.[1])return '';
  const special=V167_REFLECTIONS[unit.id] || (unit.id===V167_ROUTE.storyUnit?[V167_ROUTE.reflection,V167_ROUTE.example]:null);
  const prompt=special?.[0]||unit.exercise[0];
  const insight=special?.[1]||unit.exercise[1];
  const canCheck=V133_BANK[unit.id]?.subject===COURSE.subject;
  return '<details class="v168-teachback" id="v168Teachback" data-v168-teachback>'+
   '<summary>Teach it back <span>— a minute to make it stick</span></summary>'+
   '<div class="v168-inner">'+
    '<p class="v168-kicker">Try it without peeking</p><h2>What makes this work?</h2>'+
    '<p class="v168-prompt">'+escape(prompt)+'</p>'+
    '<label for="v168Draft">Your explanation (optional)</label>'+
    '<textarea id="v168Draft" data-v168-draft maxlength="4000" rows="3" placeholder="Explain it as you would to a friend. You can also speak it aloud without recording."></textarea>'+
    '<p class="v168-privacy">Your writing stays on this screen. We do not save it, listen to you, or automatically judge it.</p>'+
    '<div class="v168-actions"><button type="button" data-v168-compare aria-expanded="false" aria-controls="v168Comparison">Compare with the explanation</button><button type="button" data-v168-trap aria-expanded="false" aria-controls="v168Trap">Show the common trap</button></div>'+
    '<div id="v168Comparison" class="v168-comparison" data-v168-comparison hidden><div class="v168-grid"><div><h3>Your words</h3><p data-v168-own></p></div><div><h3>Key reasoning</h3><p>'+escape(insight)+'</p></div></div>'+
    (special?'<details class="v168-full"><summary>See the complete worked answer</summary><p>'+escape(unit.exercise[1])+'</p></details>':'')+
    '<p class="v168-checkline">Find one idea you explained clearly and one detail you would add. Different wording can still be right.</p></div>'+
    '<div id="v168Trap" class="v168-trap" data-v168-trap-panel hidden><h3>Where people often go wrong</h3><p>'+escape(unit.mistake?.diagnosis||'Check the assumptions before choosing a method.')+'</p>'+
    (unit.mistake?.check?'<p class="v168-checkline">'+escape(unit.mistake.check)+'</p>':'')+'</div>'+
    '<div class="v168-actions v168-next"><button type="button" data-v168-worked>See the worked example</button>'+
    (canCheck?'<button type="button" data-v168-practice>Try a checked problem</button>':'')+'</div>'+
   '</div></details>';
}
function v168TeachOpen(){
 const host=document.getElementById('v168Teachback');if(!host)return;
 host.open=true;
 host.scrollIntoView({block:'nearest'});
 host.querySelector('[data-v168-draft]')?.focus({preventScroll:true});
}
function v168AfterPractice(event){
 const form=event.target.closest?.('[data-v133-form]');if(!form)return;
 const host=form.closest('[data-v133-unit-id]');
 const result=host?.querySelector('[data-v133-result]');
 const invite=document.getElementById('v168Invite');
 if(invite){
  invite.hidden=!result||result.hidden||!['correct','misconception','unmatched','unverified'].includes(result.dataset.outcome);
 }
}
document.addEventListener('submit',v168AfterPractice);
for(const type of ['input','change'])document.addEventListener(type,event=>{
 if(event.target.closest?.('[data-v133-form]')){
  const invite=document.getElementById('v168Invite');if(invite)invite.hidden=true;
 }
});
document.addEventListener('click',event=>{
 const button=event.target.closest?.('button[data-v168-compare],button[data-v168-trap],button[data-v168-worked],button[data-v168-practice],button[data-v168-open]');
 if(!button)return;
 if(button.hasAttribute('data-v168-open')){v168TeachOpen();return}
 const host=button.closest('[data-v168-teachback]');if(!host)return;
 if(button.hasAttribute('data-v168-compare')){
  const own=(host.querySelector('[data-v168-draft]')?.value||'').trim();
  host.querySelector('[data-v168-own]').textContent=own||'No typed explanation. If you said yours aloud, compare it with the key reasoning.';
  const area=host.querySelector('[data-v168-comparison]');area.hidden=false;
  button.setAttribute('aria-expanded','true');
  area.scrollIntoView({block:'nearest'});
 }else if(button.hasAttribute('data-v168-trap')){
  const area=host.querySelector('[data-v168-trap-panel]');area.hidden=!area.hidden;
  button.setAttribute('aria-expanded',String(!area.hidden));
  button.textContent=area.hidden?'Show the common trap':'Hide the common trap';
 }else if(button.hasAttribute('data-v168-worked')){
  const example=document.getElementById('courseFirst');
  if(example){example.scrollIntoView({block:'start'});example.focus?.({preventScroll:true})}
 }else if(button.hasAttribute('data-v168-practice')){
  const id=document.getElementById('courseArticle')?.dataset.unitId;
  const checked=document.getElementById('v133Practice');
  if(checked&&id===checked.dataset.v133UnitId){v133Start(checked);checked.scrollIntoView({block:'nearest'})}
 }
});
window.studyTableTeachbackV168={version:168,coverage:COURSE.units.filter(u=>u.exercise?.[0]&&u.exercise?.[1]).map(u=>u.id),
 checked:COURSE.units.filter(u=>V133_BANK[u.id]?.subject===COURSE.subject).map(u=>u.id),open:v168TeachOpen};