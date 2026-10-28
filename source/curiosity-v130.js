// V130: useful surprise and the almost-right argument.
// Both games rely exclusively on editor-authored questions and corrections.
const V130_TRAP_TITLE={
 spanish:'One sentence sounds right. Which one really works?',
 piano:'Two approaches. Which would you play?',
 chess:'A tempting move and a safer one. Which holds up?',
 calculus:'One line of reasoning is a trap. Spot it.',
 physics:'Which explanation survives a closer look?',
 medicine:'Which reasoning would you trust?',
 business:'Which decision survives a closer look?'
};
function v130TrapMarkup(unit){
 if(!unit.mistake?.attempt||!unit.mistake?.repair||!unit.mistake?.diagnosis)return '';
 return '<section class="v130-trap" data-v130-trap aria-label="Investigate a tempting mistake">'+
  '<p class="v130-kicker">A quick thought experiment</p>'+
  '<h2>Would this actually work?</h2>'+
  '<p>Here is a tempting first attempt. Decide what you think before reading the explanation.</p>'+
  '<blockquote class="v132-claim">'+escape(unit.mistake.attempt)+'</blockquote>'+
  '<div class="v130-options">'+
   '<button type="button" data-v130-choice="yes" aria-pressed="false">I think it works</button>'+
   '<button type="button" data-v130-choice="no" aria-pressed="false">Something is off</button>'+
  '</div>'+
  '<div data-v130-explain class="v130-explain" role="status" aria-live="polite" hidden>'+
   '<p class="v130-verdict" data-v130-verdict></p>'+
   '<p data-v130-why></p>'+
   '<p class="v130-repair" data-v130-repair></p>'+
   '<p class="mistake-check" data-v130-check></p>'+
   '<button type="button" data-v130-reset>Try that reasoning again</button>'+
  '</div>'+
 '</section>';
}
function v130ChallengeMarkup(){
 return '<section class="v130-curiosity" id="v130Curiosity" aria-label="One-minute challenge">'+
  '<div class="v130-curiosity-lead"><div><p class="v130-kicker">Play for a minute</p>'+
  '<h2>Fancy a question?</h2><p>A real question near where you are in the course. No timer. Just the fun of figuring it out.</p></div>'+
  '<button type="button" data-v130-pick>Surprise me</button></div>'+
  '<div class="v130-curiosity-question" data-v130-question hidden><p class="v130-kicker" data-v130-index></p>'+
  '<h3 tabindex="-1" data-v130-title></h3><p data-v130-prompt></p>'+
  '<div class="v130-actions"><button type="button" data-v130-answer aria-expanded="false">Show the explanation</button>'+
  '<button type="button" data-v130-learn>Explore this lesson</button><button type="button" data-v130-again>Another question</button></div>'+
  '<p data-v130-solution role="status" aria-live="polite" hidden></p></div></section>';
}
let v130LastChallenge=-1;
let v130ChosenUnit=null;
function v130PickQuestion(){
 const card=document.getElementById('v130Curiosity');
 if(!card||!COURSE.units.length)return;
 const savedIndex=COURSE.units.findIndex(unit=>unit.id===bookmark());
 const start=Math.max(0,savedIndex<0?0:savedIndex-2);
 const end=Math.min(COURSE.units.length,savedIndex<0?3:savedIndex+2);
 const count=Math.max(1,end-start);
 let index=start+Math.floor(Math.random()*count);
 if(index===v130LastChallenge&&count>1)index=start+((index-start+1)%count);
 v130LastChallenge=index;
 const unit=v126Lesson(COURSE.units[index]);
 v130ChosenUnit=unit.id;
 const q=card.querySelector('[data-v130-question]');
 q.hidden=false;
 card.querySelector('[data-v130-index]').textContent='A question from unit '+(index+1)+' of '+COURSE.units.length;
 const title=card.querySelector('[data-v130-title]');
 title.textContent=unit.title;
 card.querySelector('[data-v130-prompt]').textContent=unit.exercise[0];
 card.querySelector('[data-v130-solution]').hidden=true;
 card.querySelector('[data-v130-solution]').textContent='';
 const answer=card.querySelector('[data-v130-answer]');
 answer.textContent='Show the explanation';
 answer.setAttribute('aria-expanded','false');
 title.focus({preventScroll:true});
 q.scrollIntoView({block:'nearest'});
}
function v130ToggleAnswer(){
 const card=document.getElementById('v130Curiosity');
 if(!card||!v130ChosenUnit)return;
 const unit=v126Lesson(byId.get(v130ChosenUnit));
 const panel=card.querySelector('[data-v130-solution]'),button=card.querySelector('[data-v130-answer]');
 panel.hidden=!panel.hidden;
 if(!panel.hidden)panel.textContent=unit.exercise[1];
 button.textContent=panel.hidden?'Show the explanation':'Hide the explanation';
 button.setAttribute('aria-expanded',String(!panel.hidden));
}
function v130TrapChoice(button){
 const card=button.closest('[data-v130-trap]'),unit=v126Lesson(byId.get(card.closest('.reader-article')?.dataset.unitId));
 if(!unit?.mistake)return;
 card.querySelectorAll('[data-v130-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const spotted=button.dataset.v130Choice==='no';
 card.querySelector('[data-v130-verdict]').textContent=spotted?
  'Good instinct. There is a problem with that approach.':
  'It sounds plausible, but there is an important catch.';
 card.querySelector('[data-v130-why]').textContent=unit.mistake.diagnosis;
 card.querySelector('[data-v130-repair]').textContent='What works instead: '+unit.mistake.repair;
 card.querySelector('[data-v130-check]').textContent='See if you can explain this: '+unit.mistake.check;
 card.querySelector('[data-v130-explain]').hidden=false;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button[data-v130-pick],button[data-v130-answer],button[data-v130-learn],button[data-v130-again],button[data-v130-choice],button[data-v130-reset]');
 if(!button)return;
 if(button.hasAttribute('data-v130-pick')||button.hasAttribute('data-v130-again'))v130PickQuestion();
 else if(button.hasAttribute('data-v130-answer'))v130ToggleAnswer();
 else if(button.hasAttribute('data-v130-learn')&&v130ChosenUnit)showUnit(v130ChosenUnit);
 else if(button.hasAttribute('data-v130-choice'))v130TrapChoice(button);
 else if(button.hasAttribute('data-v130-reset')){
  const card=button.closest('[data-v130-trap]');
  card.querySelector('[data-v130-explain]').hidden=true;
  card.querySelectorAll('[data-v130-choice]').forEach(b=>b.setAttribute('aria-pressed','false'));
  card.querySelector('[data-v130-choice]').focus();
 }
});