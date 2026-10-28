// V128: a small, grounded conversation around the exact authored example.
// No remote AI calls, claims of free-form grading, or progress writes.
const V128_PROMPTS={
 spanish:"What would you say here? Which word carries the meaning you need?",
 piano:"What should your hands play or hold next? Where does the beat fall?",
 chess:"Before moving, what can the other player threaten or capture?",
 calculus:"Which quantity is changing, and what must your next calculation establish?",
 physics:"What is happening physically? Name the quantity and its units.",
 medicine:"Which mechanism matters here? What assumption are you making?",
 business:"Which cost, customer action, or timing assumption matters in this decision?"
};
function v128Say(text){
 if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return false;
 try{
  speechSynthesis.cancel();
  const line=new SpeechSynthesisUtterance(String(text).slice(0,1500));
  line.lang='en-US';line.rate=.92;
  speechSynthesis.speak(line);
  return true;
 }catch{return false}
}
function v128MountCoach(){
 document.querySelectorAll('.worked-case .worked-coach').forEach((details)=>{
  if(details.querySelector('.socratic-coach'))return;
  const section=document.createElement('section');
  section.className='socratic-coach';
  section.setAttribute('aria-label','Practice one step at a time');
  section.innerHTML='<h3>Work it out with a guide</h3>'+
   '<p class="socratic-question" data-socratic-question></p>'+
   '<div class="socratic-buttons">'+
   '<button type="button" data-socratic="voice" aria-pressed="false">Read guidance aloud: Off</button>'+ 
   '<button type="button" data-socratic="hint">Give me a nudge</button>'+
   '<button type="button" data-socratic="compare">Compare my idea</button>'+
   '<button type="button" data-socratic="work">Show why it works</button>'+
   '<button type="button" data-socratic="previous">Previous step</button>'+
   '<button type="button" data-socratic="next">Next step</button>'+
   '</div>'+
   '<div class="socratic-feedback" data-socratic-feedback role="status" aria-live="polite" hidden>'+
   '<p data-socratic-message></p><div class="socratic-comparison" data-socratic-comparison hidden>'+
   '<p><strong>What you said</strong></p><p data-socratic-learner></p>'+
   '<p><strong>How the lesson explains it</strong></p><p data-socratic-reference></p></div></div>';
  const choices=details.querySelector('.coach-choices');
  if(choices)choices.before(section);else details.append(section);
  v128CoachQuestion(details);
  const select=details.querySelector('[data-coach-step]');
  if(select)select.addEventListener('change',()=>v128CoachQuestion(details));
 });
}
function v128CoachQuestion(details){
 const host=details.closest('.worked-case'),{unit,example,index,step}=v127CoachData(host);
 if(!step)return;
 const focus=V128_PROMPTS[COURSE.subject]||'What would you try next, and why?';
 details.querySelector('[data-socratic-question]').textContent=
  'Step '+(index+1)+' of '+example.steps.length+': '+focus+
  ' Think it through aloud or type it above. The current task is “'+step[0]+'.”';
 const feedback=details.querySelector('[data-socratic-feedback]');
 feedback.hidden=true;
 feedback.querySelector('[data-socratic-comparison]').hidden=true;
 details.querySelector('[data-socratic="previous"]').disabled=index===0;
 details.querySelector('[data-socratic="next"]').textContent=index===example.steps.length-1?'Finish this example':'Next step';
 const voice=details.querySelector('[data-socratic="voice"]');if(voice?.getAttribute('aria-pressed')==='true')v128Say(details.querySelector('[data-socratic-question]').textContent);
}
function v128CoachAction(button){
 const details=button.closest('.worked-coach'),host=details?.closest('.worked-case');
 if(!host)return;
 const {unit,example,index,step}=v127CoachData(host);
 if(!unit||!step)return;
 const action=button.dataset.socratic,select=details.querySelector('[data-coach-step]');
 const feedback=details.querySelector('[data-socratic-feedback]');
 const msg=feedback.querySelector('[data-socratic-message]');
 const comparison=feedback.querySelector('[data-socratic-comparison]');
 const input=details.querySelector('[data-coach-input]'),learner=input.value.trim();
 comparison.hidden=true;
 if(action==='voice'){
  const enable=button.getAttribute('aria-pressed')!=='true';
  if(enable&&!v128Say(details.querySelector('[data-socratic-question]').textContent)){
   msg.textContent='Spoken guidance is unavailable here. The written coaching still works.';feedback.hidden=false;return;
  }
  if(!enable&&window.speechSynthesis)window.speechSynthesis.cancel();
  button.setAttribute('aria-pressed',String(enable));
  button.textContent=enable?'Read guidance aloud: On':'Read guidance aloud: Off';
  return;
 }

 if(action==='previous'||action==='next'){
  if(action==='previous'){select.value=String(Math.max(0,index-1));v128CoachQuestion(details);}
  else if(index+1<example.steps.length){select.value=String(index+1);v128CoachQuestion(details);}
  else{
   msg.textContent='You reached the conclusion. '+example.notice+' If you want a harder variation, the optional practice at the end of this unit is available.';
   feedback.hidden=false;
  }
  return;
 }
 if(action==='hint'){
  msg.textContent='A nudge, without giving away the calculation: focus on “'+step[0]+'.” '+
   (V128_PROMPTS[COURSE.subject]||'What would you try first?')+
   ' Say which fact from the problem you would use.';
 }else if(action==='compare'){
  if(!learner){
   msg.textContent='Say or type your idea in the box above first. Then I’ll place it alongside the lesson’s reasoning. I won’t pretend to grade what you say.';
  }else{
   msg.textContent='Compare the choice you made, the evidence you used, and your reason. What differs between your explanation and the worked one?';
   comparison.querySelector('[data-socratic-learner]').textContent=learner;
   comparison.querySelector('[data-socratic-reference]').textContent=step[2];
   comparison.hidden=false;
  }
 }else if(action==='work'){
  msg.textContent='Here is the worked step: '+step[1]+' The reason: '+step[2]+
   ' Can you now explain why that step comes before the next one?';
 }
 feedback.hidden=false;
 if(details.querySelector('[data-socratic="voice"]')?.getAttribute('aria-pressed')==='true')v128Say(msg.textContent);
}
document.addEventListener('click',event=>{
 const b=event.target.closest('button[data-socratic]');
 if(b)v128CoachAction(b);
});
