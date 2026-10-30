/* V166: one story → real lesson → relevant transfer problem. No scores or artificial AI. */
const V166_PRACTICE={
 spanish:'spanish-1', piano:'piano-0', chess:'castling', calculus:'product-rule',
 physics:'physics-2', medicine:'test-interpretation', business:'unit-economics'
};
function v166PracticeStart(){
 const id=V166_PRACTICE[COURSE.subject];
 if(!id || !V133_BANK[id])return false;
 showUnit(id);
 const host=document.getElementById('v133Practice');
 if(!host)return false;
 v133Start(host);host.scrollIntoView({block:'start',behavior:'instant'});
 return true;
}
function v166UnitNext(unit){
 const story=V134_STORIES.find(s=>s.subject===COURSE.subject);
 if(!story||story.unit!==unit.id||!V133_BANK[V166_PRACTICE[COURSE.subject]])return '';
 const practice=V133_BANK[V166_PRACTICE[COURSE.subject]];
 return '<aside class="v166-lesson-next" aria-label="Practice what you learned">'+
 '<p class="v166-label">Next, use the idea</p><h2>Try it somewhere new.</h2>'+
 '<p>'+escape(practice.skill)+'. An independently written problem, with a hint if you need one.</p>'+
 '<button type="button" data-v166-try>Try the fresh problem →</button></aside>';
}
function v166SpanishRealMarkup(){
 if(COURSE.subject!=='spanish')return '';
 return '<section id="v166SpanishReal" class="v166-real" hidden aria-label="Practice an actual Spanish conversation">'+
 '<h3>A tiny plan for a real conversation</h3>'+
 '<p>When someone speaks too quickly, you can try <span lang="es">“¿Puede repetirlo más despacio, por favor?”</span> (Could you repeat that more slowly, please?). If you have not spoken to anyone yet, this is just a plan.</p>'+
 '<label for="v166SpanishReport">What actually happened?</label><select id="v166SpanishReport"><option value="plan">I am preparing, but have not tried yet</option><option value="tried">I spoke with a real person</option><option value="notyet">I had a chance, but could not start</option></select>'+
 '<label for="v166SpanishWhat">What did you hear or say? (Optional)</label><textarea id="v166SpanishWhat" rows="3" maxlength="900" placeholder="Record what you remember, or leave this blank."></textarea>'+
 '<button type="button" data-v166-report>Reflect on this</button><p id="v166SpanishStatus" role="status" aria-live="polite"></p>'+
 '<p class="v166-muted">This is your self-report, not verified conversation evidence. Nothing here is graded or saved.</p></section>';
}
function v166StoryOpen(){
 showMap();
 const disclosure=document.querySelector('.v165-story-discovery');
 if(!disclosure)return false;
 disclosure.open=true;
 disclosure.querySelector('[data-v134-start]')?.click();
 disclosure.scrollIntoView({block:'start',behavior:'instant'});
 return true;
}
document.addEventListener('click',event=>{
 const button=event.target.closest?.('button[data-v166-try],button[data-v166-real],button[data-v166-report]');
 if(!button)return;
 if(button.hasAttribute('data-v166-try')){v166PracticeStart();return;}
 if(button.hasAttribute('data-v166-real')){
  const panel=document.getElementById('v166SpanishReal');if(!panel)return;
  panel.hidden=false;panel.scrollIntoView({block:'start',behavior:'instant'});
  panel.querySelector('select')?.focus({preventScroll:true});return;
 }
 const mode=document.getElementById('v166SpanishReport')?.value;
 const details=document.getElementById('v166SpanishWhat')?.value.trim();
 const status=document.getElementById('v166SpanishStatus');if(!status)return;
 if(mode==='tried'){
  status.textContent=details?'You reported a real exchange. Compare the words you remember with the lesson, and decide one phrase to try next. This report is not verified.':'You reported speaking with someone. If you can, jot down one thing they said or how you responded. Reporting it here does not verify the exchange.';
 }else if(mode==='notyet'){
  status.textContent='No conversation recorded. Start smaller next time: ask one short question or request a slower repeat. Preparing and trying are different steps.';
 }else status.textContent='You have a plan, but no real-person conversation is recorded. Practice the phrase, then try it in a genuine exchange when you are ready.';
});
window.studyTableJourneyV166={version:166,practice:V166_PRACTICE,start:v166PracticeStart,story:v166StoryOpen};
