// A lesson-grounded practice companion. It does not judge arbitrary speech or call an AI service.
let v127ActiveRecognizer=null,v127VoiceGeneration=0;
function v127CoachData(host){
 const stored=byId.get(host.querySelector('.worked-coach')?.dataset.coachUnit),unit=stored&&v126Lesson(stored);
 const example=unit&&(host.id==='courseFirst'?unit.first:unit.second);
 const selected=host.querySelector('[data-coach-step]')?.value;const index=Math.min(Math.max(Number(selected===''||selected===undefined?(host.dataset.guidedCount||0):selected),0),(example?.steps.length||1)-1);
 return {unit,example,index,step:example?.steps[index]};
}
function v127CoachControls(unit,id){
 const example=id==='courseFirst'?unit.first:unit.second;
 return '<details class="worked-coach" data-coach-unit="'+escape(unit.id)+'"><summary>'+(id==='courseFirst'&&V128_COACH_UNITS.includes(unit.id)?'Compare your own explanation (optional)':'Talk through this example')+'</summary>'+
 '<p class="coach-intro">Explain what you would try. Type your thinking, or use on-device dictation if your browser supports it. The hints use this lesson’s worked solution; they cannot reliably grade a free-form answer.</p>'+
 v128CoachLink(unit,id)+
 '<label class="coach-label" for="coach-input-'+id+'">Your reasoning or question</label>'+
 '<textarea id="coach-input-'+id+'" data-coach-input rows="3" placeholder="I think the first move is … because …"></textarea>'+
 (COURSE.subject==='spanish'?'<label for="coach-language-'+id+'">Speech language</label><select id="coach-language-'+id+'" data-coach-language><option value="en-US">English</option><option value="es-ES">Español</option></select>':'')+'<label for="coach-step-'+id+'">Which step needs help?</label><select id="coach-step-'+id+'" data-coach-step><option value="">Current step</option>'+example.steps.map((step,i)=>'<option value="'+i+'">Step '+(i+1)+': '+escape(step[0])+'</option>').join('')+'</select>'+'<div class="coach-actions"><button type="button" data-coach-mic>Use microphone</button><button type="button" data-coach-check>Help me think this through</button></div>'+
 '<p class="coach-mic-note">Dictation uses an already available on-device speech model. Your working is kept in this open example; changing units clears it.</p>'+
 '<fieldset class="coach-choices"><legend>Where did you get stuck?</legend>'+
 '<button type="button" data-coach-topic="start">Where do I start?</button>'+
 '<button type="button" data-coach-topic="why">Why this step?</button>'+
 '<button type="button" data-coach-topic="work">Show the working</button>'+
 '<button type="button" data-coach-topic="mistake">Check a common mistake</button>'+
 '<button type="button" data-coach-topic="terms">Explain the terms</button></fieldset>'+
 '<div class="coach-response" role="status" aria-live="polite" hidden><p data-coach-response></p><button type="button" data-coach-read>Read this aloud</button></div></details>';
}
function v127CoachFeedback(host,topic){
 const {unit,example,index,step}=v127CoachData(host);
 if(!unit||!step)return 'That explanation is unavailable for this lesson.';
 const [heading,working,why]=step;
 const location='In this example, step '+(index+1)+' is “'+heading+'.” ';
 switch(topic){
 case 'start':return 'Start with the actual problem: '+example.problem+' Your first move is to think about “'+heading+'.” '+why;
 case 'why':return location+why;
 case 'work':return location+'The worked part is: '+working+' '+why;
 case 'mistake':return 'A common mistake in this lesson: '+unit.mistake.attempt+' The problem is: '+unit.mistake.diagnosis+' A better approach: '+unit.mistake.repair;
 case 'terms':{
  const terms=(unit.terms||[]).slice(0,3).map(x=>x[0]+' means '+x[1]).join(' ');
  return (terms||unit.teaching[0])+' In this example: '+why;
 }
 default:return location+why;
 }
}
function v127CoachIntent(text){
 if(/\b(why|reason|rule|method|because)\b/i.test(text))return 'why';
 if(/\b(calculate|number|algebra|formula|step|working|equation|count|where.*(value|number))\b/i.test(text))return 'work';
 if(/\b(wrong|mistake|error|incorrect|check)\b/i.test(text))return 'mistake';
 if(/\b(term|symbol|word|mean|definition|notation)\b/i.test(text))return 'terms';
 if(/\b(start|stuck|lost|confus|don't know|not sure|first)\b/i.test(text))return 'start';
 return null;
}
function v127CoachReply(details,topic,fromText=false){
 const host=details.closest('.worked-case'),input=details.querySelector('[data-coach-input]');
 const transcript=input.value.trim();
 const result=details.querySelector('.coach-response'),body=result.querySelector('[data-coach-response]');
 const inferred=topic||v127CoachIntent(transcript);
 if(fromText&&!transcript){body.textContent='Tell me what you are thinking, or choose a specific sticking point below.';result.hidden=false;return}
 if(!inferred){
  const {step}=v127CoachData(host);
  body.textContent='I have your explanation, but I cannot honestly mark free-form reasoning right or wrong in this offline edition. The next step is “'+(step?.[0]||'work through the problem')+'.” Select a sticking point above for the lesson’s specific explanation.';
 }else{
  body.textContent=(fromText?'I can help with that part. ':'')+v127CoachFeedback(host,inferred);
 }
 result.hidden=false;
}
function v127StopCoaching(){
 v127VoiceGeneration++;document.querySelectorAll('[data-coach-mic]').forEach(b=>{b.textContent='Use microphone';b.setAttribute('aria-pressed','false')});
 if(v127ActiveRecognizer){try{v127ActiveRecognizer.abort()}catch{}v127ActiveRecognizer=null}
 try{speechSynthesis?.cancel()}catch{}
}
async function v127CoachMic(button){
 const details=button.closest('.worked-coach'),input=details.querySelector('[data-coach-input]');
 if(v127ActiveRecognizer){v127StopCoaching();return}
 v109StopMedia();
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Speech){v127CoachShow(details,'On-device dictation is unavailable here. Type your thinking instead.');return}
 const generation=v127VoiceGeneration,rec=new Speech(),language=details.querySelector('[data-coach-language]')?.value||'en-US';
 v127ActiveRecognizer=rec;button.textContent='Cancel dictation setup';button.setAttribute('aria-pressed','true');
 try{
  if(!('processLocally' in rec)||typeof Speech.available!=='function')throw Error('no-local-speech');
  const ready=await Speech.available({langs:[language],processLocally:true});
  if(generation!==v127VoiceGeneration||v127ActiveRecognizer!==rec||!details.isConnected||!details.open)return;
  if(ready!=='available')throw Error('no-local-model');
  rec.lang=language;rec.processLocally=true;rec.interimResults=false;rec.continuous=false;
  rec.onresult=event=>{
   if(generation!==v127VoiceGeneration||v127ActiveRecognizer!==rec||!details.isConnected||!details.open)return;
   const text=Array.from(event.results||[]).slice(event.resultIndex||0).filter(r=>r.isFinal).map(r=>r[0]?.transcript||'').join(' ').trim();
   if(text){input.value=[input.value.trim(),text].filter(Boolean).join(' ').slice(0,2000);input.dispatchEvent(new Event('input',{bubbles:true}));input.focus()}
  };
  rec.onerror=()=>{if(generation===v127VoiceGeneration){v127StopCoaching();v127CoachShow(details,'Dictation could not continue. Your typed working is kept.')}};
  rec.onend=()=>{if(v127ActiveRecognizer===rec){v127ActiveRecognizer=null;button.textContent='Use microphone';button.setAttribute('aria-pressed','false')}};
  rec.start();button.textContent='Stop listening';v127CoachShow(details,'Listening with on-device dictation. Stop the microphone when you have finished.');
 }catch{if(generation===v127VoiceGeneration){v127StopCoaching();v127CoachShow(details,'On-device dictation is not ready in this browser. Type your thinking instead.')}}
}
document.addEventListener('toggle',event=>{if(event.target.matches?.('.worked-coach')&&!event.target.open)v127StopCoaching()},true);
document.addEventListener('change',event=>{if(event.target.matches?.('[data-coach-step],[data-coach-language]'))v127StopCoaching()});
window.addEventListener('pagehide',v127StopCoaching);
document.addEventListener('visibilitychange',()=>{if(document.hidden)v127StopCoaching()});

function v127CoachShow(details,message){
 const panel=details.querySelector('.coach-response');panel.querySelector('[data-coach-response]').textContent=message;panel.hidden=false;
}
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-coach-topic],[data-coach-check],[data-coach-mic],[data-coach-read]');
 if(!b)return;
 const details=b.closest('.worked-coach');if(!details)return;
 if(b.hasAttribute('data-coach-topic'))v127CoachReply(details,b.dataset.coachTopic);
 else if(b.hasAttribute('data-coach-check'))v127CoachReply(details,null,true);
 else if(b.hasAttribute('data-coach-mic'))v127CoachMic(b);
 else if(b.hasAttribute('data-coach-read')){
  const sentence=details.querySelector('[data-coach-response]').textContent;
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){v127CoachShow(details,'Spoken replies are not available in this browser.');return}
  v109StopMedia();v127StopCoaching();const say=new SpeechSynthesisUtterance(sentence);
  say.lang=COURSE.subject==='spanish'?'en-US':'en-US';say.rate=.94;speechSynthesis.speak(say);
 }
});
