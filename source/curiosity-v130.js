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
 const goodFirst=[...unit.id].reduce((sum,c)=>sum+c.charCodeAt(0),0)%2===0;
 const authored=V132_SPECIFIC[unit.id]?.comparison,good=authored?.correct||unit.mistake.repair,trap=authored?.tempting||unit.mistake.attempt;
 const options=goodFirst?[['good',good],['trap',trap]]:[['trap',trap],['good',good]];
 return '<details class="v132-detective"><summary>Spot a tempting mistake (optional)</summary><section class="v130-trap" data-v130-trap aria-label="Find the better explanation">'+
  '<p class="v130-kicker">A little detective work</p>'+
  '<h2>Spot the almost-right idea</h2>'+
  '<p>'+escape(V130_TRAP_TITLE[COURSE.subject]||'Which explanation stands up?')+'</p>'+
  '<button type="button" data-v130-show>Read the worked correction</button><div class="v130-options">'+options.map(([key,copy],i)=>
   '<button type="button" data-v130-choice="'+key+'" aria-pressed="false"><span class="v130-option-letter">'+(i===0?'A':'B')+'</span> '+escape(copy)+'</button>').join('')+'</div>'+
  '<div data-v130-explain class="v130-explain" role="status" aria-live="polite" hidden>'+
   '<p class="v130-verdict" data-v130-verdict></p>'+
   '<p data-v130-why></p>'+
   '<p class="v130-repair" data-v130-repair></p>'+
   '<p class="mistake-check" data-v130-check></p>'+
   '<button type="button" data-v130-reset>See the two ideas again</button>'+
  '</div>'+
 '</section></details>';
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
 const saved=bookmark(),savedIndex=COURSE.units.findIndex(unit=>unit.id===saved);
 const count=saved===COURSE.project.id||saved===COURSE.workshop?.id?COURSE.units.length:Math.min(COURSE.units.length,Math.max(3,savedIndex+2));
 let index=Math.min(count-1,Math.floor(Math.random()*count));
 if(index===v130LastChallenge&&count>1)index=(index+1)%count;
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
 const good=button.dataset.v130Choice==='good';
 card.querySelector('[data-v130-verdict]').textContent=good?
  'Yes. That is the stronger reasoning.':'That is the tempting wrong turn. Here is what it misses.';
 card.querySelector('[data-v130-why]').textContent=V132_SPECIFIC[unit.id]?.comparison?.why||unit.mistake.diagnosis;
 card.querySelector('[data-v130-repair]').textContent='The better approach: '+unit.mistake.repair;
 card.querySelector('[data-v130-check]').textContent='One more thought: '+unit.mistake.check;
 card.querySelector('[data-v130-explain]').hidden=false;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button[data-v130-pick],button[data-v130-answer],button[data-v130-learn],button[data-v130-again],button[data-v130-choice],button[data-v130-reset],button[data-v130-show]');
 if(!button)return;
 if(button.hasAttribute('data-v130-pick')||button.hasAttribute('data-v130-again'))v130PickQuestion();
 else if(button.hasAttribute('data-v130-answer'))v130ToggleAnswer();
 else if(button.hasAttribute('data-v130-learn')&&v130ChosenUnit)showUnit(v130ChosenUnit);
 else if(button.hasAttribute('data-v130-choice'))v130TrapChoice(button);
 else if(button.hasAttribute('data-v130-show')){const card=button.closest('[data-v130-trap]');v130TrapChoice(card.querySelector('[data-v130-choice="good"]'));card.querySelectorAll('[data-v130-choice]').forEach(b=>b.setAttribute('aria-pressed','false'));card.querySelector('[data-v130-verdict]').textContent='Follow the worked correction.';}
 else if(button.hasAttribute('data-v130-reset')){
  const card=button.closest('[data-v130-trap]');
  card.querySelector('[data-v130-explain]').hidden=true;
  card.querySelectorAll('[data-v130-choice]').forEach(b=>b.setAttribute('aria-pressed','false'));
  card.querySelector('[data-v130-choice]').focus();
 }
});