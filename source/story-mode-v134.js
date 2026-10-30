// Seven editor-authored, local-only adventures. No AI grading, streaks or saved score.
const V134_STORIES=__V134_STORIES__;
let v134Session=null;
function v134Current(){
 return V134_STORIES.find(story=>story.subject===COURSE.subject);
}
function v134StoryMarkup(){
 const story=v134Current();if(!story)return '';
 return '<section class="v134-story" id="v134Story" aria-label="Play a story from this course">'+
  '<div class="v134-hero"><div><p class="v134-eyebrow">One little adventure</p><h2>'+escape(story.title)+'</h2>'+
  '<p>'+escape(story.setup)+'</p><p class="v134-footnote">Three decisions. No clock, no points, no pressure.</p></div>'+
  '<button type="button" data-v134-start>Play the scene</button></div>'+
  '<div class="v134-game" data-v134-game hidden><div class="v134-scenehead"><span data-v134-progress></span><button type="button" class="v134-exit" data-v134-close>Back to the course</button></div>'+
  '<p class="v134-situation" data-v134-situation></p><h3 tabindex="-1" data-v134-question></h3>'+
  '<div class="v134-options" role="group" aria-label="Choose how to respond" data-v134-options></div>'+
  '<div class="v134-consequence" data-v134-consequence role="status" aria-live="polite" hidden><p class="v134-impact" data-v134-impact></p><p data-v134-why></p></div>'+
  '<div class="v134-nextrow"><button type="button" data-v134-next hidden>Next moment</button></div></div>'+
  '<div class="v134-ending" data-v134-ending hidden><p class="v134-eyebrow">The story ends here</p><h3 tabindex="-1">What happened</h3><p data-v134-outcome></p>'+
  '<div class="v134-nextrow"><button type="button" data-v134-replay>Play again</button><button type="button" data-v134-lesson>See the real lesson</button></div></div></section>';
}
function v134Render(){
 const story=v134Current(),card=document.getElementById('v134Story');if(!story||!card||!v134Session)return;
 const n=v134Session.index;
 const game=card.querySelector('[data-v134-game]'),ending=card.querySelector('[data-v134-ending]');
 if(n>=story.beats.length){
  game.hidden=true;ending.hidden=false;
  const allWork=v134Session.chosen.every((v,i)=>story.beats[i].options[v]?.works);
  card.querySelector('[data-v134-outcome]').textContent=allWork?story.win:story.detour;
  card.querySelector('[data-v134-ending] h3').focus({preventScroll:true});
  return;
 }
 ending.hidden=true;game.hidden=false;
 const beat=story.beats[n];
 card.querySelector('[data-v134-progress]').textContent='Moment '+(n+1)+' of '+story.beats.length;
 card.querySelector('[data-v134-situation]').textContent=beat.scene;
 const q=card.querySelector('[data-v134-question]');q.textContent=beat.question;
 const choices=card.querySelector('[data-v134-options]');choices.innerHTML='';
 beat.options.forEach((option,i)=>{
  const b=document.createElement('button');
  b.type='button';b.dataset.v134Choice=String(i);b.textContent=option.label;
  b.setAttribute('aria-pressed',String(v134Session.chosen[n]===i));
  choices.append(b);
 });
 const response=card.querySelector('[data-v134-consequence]');response.hidden=true;
 card.querySelector('[data-v134-impact]').textContent='';
 card.querySelector('[data-v134-why]').textContent='';
 const next=card.querySelector('[data-v134-next]');next.hidden=true;
 next.textContent=n===story.beats.length-1?'See how the story ends':'Next moment';
 q.focus({preventScroll:true});
}
function v134Start(){
 v134Session={index:0,chosen:[]};
 const card=document.getElementById('v134Story');if(!card)return;
 card.querySelector('.v134-hero').hidden=true;
 v134Render();
}
function v134Pick(button){
 const card=button.closest('#v134Story'),story=v134Current();if(!card||!story||!v134Session)return;
 const step=v134Session.index,choice=Number(button.dataset.v134Choice),beat=story.beats[step],option=beat?.options[choice];
 if(!option)return;
 v134Session.chosen[step]=choice;
 card.querySelectorAll('[data-v134-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const feedback=card.querySelector('[data-v134-consequence]');
 card.querySelector('[data-v134-impact]').textContent=option.after;
 card.querySelector('[data-v134-why]').textContent=option.why;
 feedback.hidden=false;
 card.querySelector('[data-v134-next]').hidden=false;
}
function v134Close(){
 const card=document.getElementById('v134Story');if(!card)return;
 v134Session=null;
 card.querySelector('[data-v134-game]').hidden=true;
 card.querySelector('[data-v134-ending]').hidden=true;
 card.querySelector('.v134-hero').hidden=false;
 card.querySelector('[data-v134-start]').focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button[data-v134-start],button[data-v134-choice],button[data-v134-next],button[data-v134-close],button[data-v134-replay],button[data-v134-lesson]');
 if(!button||!document.getElementById('v134Story')?.contains(button))return;
 if(button.hasAttribute('data-v134-start')||button.hasAttribute('data-v134-replay'))v134Start();
 else if(button.hasAttribute('data-v134-choice'))v134Pick(button);
 else if(button.hasAttribute('data-v134-next')){
  if(!v134Session||v134Session.chosen[v134Session.index]===undefined)return;
  v134Session.index++;v134Render();
 }else if(button.hasAttribute('data-v134-close'))v134Close();
 else if(button.hasAttribute('data-v134-lesson')){
  const story=v134Current();if(story)showUnit(story.unit);
 }
});
