// V129 learning loop: learner-generated attempt first, authored feedback second.
// No invented grades, network calls, stored answers, or simulated AI judgment.
const V129_QUESTION={
 spanish:'What would you say next? Say it aloud, then explain why you chose those words.',
 piano:'What should your hands do next? Name the notes or beat before checking.',
 chess:'What would you play next? First check threats and captures.',
 calculus:'Which operation or relationship comes next, and what makes it valid?',
 physics:'Which physical quantity matters next? Include the direction or units.',
 medicine:'What mechanism explains the next change? State the assumption.',
 business:'What would you calculate or decide next? Explain the consequence.'
};
function v129Markup(){
 return '<section class="mastery-loop" aria-label="Learn by trying">'+
  '<div class="mastery-progress" data-mastery-progress></div>'+
  '<h3 class="mastery-title" data-mastery-title></h3>'+
  '<p class="mastery-question" data-mastery-question></p>'+
  '<p class="mastery-instruction">Say your thought aloud or put it in the box above. No automatic grading: compare with the authored answer.</p>'+
  '<div class="mastery-actions">'+
   '<button type="button" data-mastery="hide">Try without seeing the solution</button>'+
   '<button type="button" data-mastery="hint">Small hint</button>'+
   '<button type="button" data-mastery="compare">Compare my answer</button>'+
   '<button type="button" data-mastery="answer">Show the reasoning</button>'+
   '<button type="button" data-mastery="stuck">I’m stuck</button>'+
   '<button type="button" data-mastery="next">Next step</button>'+
  '</div>'+
  '<div class="mastery-answer" data-mastery-answer hidden role="status" aria-live="polite">'+
   '<p data-mastery-message></p>'+
   '<div class="mastery-side-by-side" data-mastery-pair hidden><section><strong>Your attempt</strong><p data-mastery-user></p></section><section><strong>Worked explanation</strong><p data-mastery-reference></p></section></div>'+
  '</div>'+
  '<div class="mastery-end" data-mastery-end hidden><button type="button" data-mastery="repeat">Another pass through this example</button> <button type="button" data-mastery="done">That makes sense now</button></div>'+
 '</section>';
}
function v129Get(details){
 let s=details._v129;
 if(!s){s={index:0,phase:'step',covered:false};details._v129=s}
 const host=details.closest('.worked-case'),{unit,example}=v127CoachData(host);
 return {s,host,unit,example,step:example?.steps[s.index]};
}
function v129Prompt(details){
 const {s,example,step,unit}=v129Get(details);
 if(!unit||!example)return;
 const progress=details.querySelector('[data-mastery-progress]');
 const title=details.querySelector('[data-mastery-title]');
 const q=details.querySelector('[data-mastery-question]');
 const end=details.querySelector('[data-mastery-end]');
 const section=details.querySelector('.mastery-loop');
 section.querySelector('[data-mastery-answer]').hidden=true;
 section.querySelector('[data-mastery-pair]').hidden=true;
 end.hidden=true;
 if(s.phase==='step'){
  progress.textContent='Work through the example · '+(s.index+1)+' / '+example.steps.length;
  title.textContent='Your turn: choose the next move';
  q.textContent=V129_QUESTION[COURSE.subject]||'What comes next, and why?';
 }else if(s.phase==='transfer'){
  progress.textContent='Now use it without copying';
  title.textContent='Try a fresh question';
  q.textContent=unit.exercise[0];
 }else if(s.phase==='recall'){
  progress.textContent='One last check, from memory';
  title.textContent='Explain it in your own words';
  q.textContent=unit.recall.ask;
 }else{
  progress.textContent='You worked through this example';
  title.textContent='Decide what you need next';
  q.textContent='Could you explain the method to someone else without seeing these steps?';
  end.hidden=false;
 }
 section.querySelector('[data-mastery="next"]').textContent=s.phase==='step'&&s.index<example.steps.length-1?'Next step':s.phase==='step'?'Try a new question':s.phase==='transfer'?'Recall it from memory':s.phase==='recall'?'Finish':'Next';
 section.querySelector('[data-mastery="next"]').hidden=s.phase==='end';
 for(const a of ['hide','hint','compare','answer','stuck'])section.querySelector('[data-mastery="'+a+'"]').hidden=s.phase==='end';
 section.querySelector('[data-mastery="hide"]').hidden=s.phase!=='step';
 section.querySelector('[data-mastery="hint"]').hidden=s.phase==='recall';
 const input=details.querySelector('[data-coach-input]');
 input.value='';
 input.placeholder=s.phase==='step'?'My next move is ... because ...':'I would answer ... because ...';
}
function v129Result(details,message,learner,reference){
 const view=details.querySelector('[data-mastery-answer]');
 const pair=view.querySelector('[data-mastery-pair]');
 view.querySelector('[data-mastery-message]').textContent=message;
 pair.hidden=!(learner!==undefined&&reference!==undefined);
 if(!pair.hidden){
  pair.querySelector('[data-mastery-user]').textContent=learner;
  pair.querySelector('[data-mastery-reference]').textContent=reference;
 }
 view.hidden=false;
}
function v129Reference({s,step,unit}){
 if(s.phase==='step')return 'What to do: '+step[0]+'\nWorking: '+step[1]+'\nWhy: '+step[2];
 if(s.phase==='transfer')return String(unit.exercise[1]);
 return String(unit.recall.answer);
}
function v129RevealStep(details){
 const {s,host}=v129Get(details);
 if(s.phase!=='step')return;
 const b=host.querySelector('[data-guided-reveal]');
 if(b&&host.querySelector('.guided-panel')?.hidden===false){
  while(Number(host.dataset.guidedCount||0)<=s.index&&!b.hidden)v127GuideReveal(b);
 }
}
function v129Action(details,action){
 const ctx=v129Get(details),{s,host,unit,example,step}=ctx;
 if(!unit)return;
 const input=details.querySelector('[data-coach-input]'),answer=input.value.trim();
 if(action==='hide'){
  const start=host.querySelector('[data-guided-start]');
  if(start&&!start.hidden)v127GuideStart(start);
  v129Result(details,'The worked steps are now hidden. Try describing your next move before asking for a hint.');
  return;
 }
 if(action==='hint'){
  if(s.phase==='step')v129Result(details,'Think about “'+step[0]+'.” Which part of the problem tells you to do that?');
  else v129Result(details,'Connect this question to the unit’s main idea: '+unit.takeaway+' What does the question ask you to use?');
  return;
 }
 if(action==='stuck'){
  v129Result(details,'A known wrong turn in this lesson is: '+unit.mistake.attempt+
   '\nWhy that goes wrong: '+unit.mistake.diagnosis+
   '\nA better approach: '+unit.mistake.repair+
   (unit.previous?'\nIf this is still unclear, the preceding unit is available in the course outline.':''));
  return;
 }
 if(action==='answer'){
  v129RevealStep(details);
  v129Result(details,'Read this and then try to explain the reason back without looking.\n'+v129Reference(ctx));
  return;
 }
 if(action==='compare'){
  if(!answer){v129Result(details,'Try saying or typing your own answer first. Then compare it with the authored reasoning.');return}
  v129RevealStep(details);
  v129Result(details,'Look for three things: did you choose the right action, use the right facts, and explain why? This comparison is for your judgment, not an automatic score.',answer,v129Reference(ctx));
  return;
 }
 if(action==='next'){
  if(s.phase==='step'){
   if(s.index<example.steps.length-1)s.index++;
   else s.phase='transfer';
  }else if(s.phase==='transfer')s.phase='recall';
  else if(s.phase==='recall')s.phase='end';
  v129Prompt(details);
  return;
 }
 if(action==='repeat'){
  s.index=0;s.phase='step';
  const exit=host.querySelector('[data-guided-exit]');
  if(exit&&!host.querySelector('.guided-panel').hidden)v127GuideEnd(exit);
  v129Prompt(details);
  return;
 }
 if(action==='done'){
  v129Result(details,'You have completed this optional worked-example conversation. Try the independent practice below or move to the next unit whenever you feel ready.');
  details.querySelector('[data-mastery-end]').hidden=true;
 }
}
function v129MountCoach(){
 document.querySelectorAll('.worked-case .worked-coach').forEach(details=>{
  if(details.querySelector('.mastery-loop'))return;
  const caseHost=details.closest('.worked-case');
  if(caseHost?.id==='courseFirst'&&V128_COACH_UNITS.includes(COURSE.units.find(u=>u.id===document.getElementById('courseArticle')?.dataset.unitId)?.id)){details.remove();return}
   const panel=document.createElement('div');
  panel.innerHTML=v129Markup();
  const target=details.querySelector('.coach-choices');
  if(target)target.before(panel.firstElementChild);else details.append(panel.firstElementChild);
  // Keep the earlier specific-help routes, but remove their visual dominance.
  if(target){
   const advanced=document.createElement('details');
   advanced.className='mastery-more';
   const summary=document.createElement('summary');
   summary.textContent='Other ways to ask for help';
   target.before(advanced);
   advanced.append(summary,target);
  }
  // The earlier V128 panel was redundant with this complete learning loop.
  const old=details.querySelector('.socratic-coach');
  if(old)old.remove();
  v129Prompt(details);
 });
}
document.addEventListener('click',event=>{
 const b=event.target.closest('button[data-mastery]');
 if(!b)return;
 const details=b.closest('.worked-coach');
 if(details)v129Action(details,b.dataset.mastery);
});