(function(){
 'use strict';
 const scenarios=__STEP_COACH_DATA__;
 const own=(object,key)=>typeof key==='string'&&Object.prototype.hasOwnProperty.call(object,key);
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normal=value=>value.normalize('NFC').trim().toLowerCase().replace(/[−–]/g,'-').replace(/\s+/g,' ');
 const words={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,twelve:12,sixteen:16,'one hundred':100,'sixty four':64};
 function result(kind,message){return {kind,message}}
 function check(unit,index,value){
  if(!own(scenarios,unit)||!Number.isInteger(index)||!scenarios[unit].steps[index]||typeof value!=='string')return null;
  const step=scenarios[unit].steps[index],input=normal(value.slice(0,2000));
  if(!input)return result('empty','Enter an answer for this step, or choose “See the teacher work this step”. Your working notes can stay in your own words.');
  const fits=()=>result('fits','That fits this step. '+step.reasoning);
  if(step.kind==='number'){
   let text=input;if(own(words,text))text=String(words[text]);else if(text.startsWith('minus ')&&own(words,text.slice(6)))text=String(-words[text.slice(6)]);
   let match=/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*(.*)$/.exec(text),value;
   if(match){
    const suffix=match[2].trim().replace(/\s+/g,'').replace(/²/g,'^2');
    if(suffix&&!(step.units||[]).includes(suffix))return result('compare','Check the units as well as the number. '+(step.unitLabel?'This step asks for '+step.unitLabel+'. ':'Enter just the value requested here. ')+step.reasoning);
    value=Number(match[1]);
   }else{
    match=/^(?:√\s*(\d+(?:\.\d+)?)|sqrt\((\d+(?:\.\d+)?)\))$/.exec(text);
    if(match)value=Math.sqrt(Number(match[1]||match[2]));
   }
   if(!Number.isFinite(value))return result('compare','I can check a single number here. Keep your calculation in the working notes, then enter its result. You can also compare with the teacher’s reasoning below.');
   if(Math.abs(value-Number(step.answer))<1e-8)return fits();
   return result('revise',own(step.mistakes,String(value))?step.mistakes[String(value)]:'Compare your result with this account: '+step.reasoning);
  }
  if(step.kind==='note'){
   const pitch=input.replace(/^middle c$/,'c4').replace(/^low c$/,'c3').replace(/\s+/g,'').toUpperCase();
   if(pitch===step.answer)return fits();
   return own(step.mistakes,pitch)?result('revise',step.mistakes[pitch]):result('compare','Use the note name and register, such as C3 or D4. '+step.reasoning);
  }
  const phrase=input.replace(/[¿?¡!.,;:]/g,'').replace(/^quiero\s+/,'').replace(/\s+por favor$/,'').trim().replace(/\s+/g,' ');
  if(phrase===step.answer)return fits();
  if(phrase.normalize('NFD').replace(/[\u0300-\u036f]/g,'')===step.answer.normalize('NFD').replace(/[\u0300-\u036f]/g,''))return result('revise','The wording fits this model. Keep the spelling shown here, including accents and ñ: '+step.answer+'.');
  const tokens=phrase.split(' ');
  for(const [token,message] of Object.entries(step.mistakes))if(tokens.includes(token))return result('revise',message);
  return result('compare','I cannot reliably check that wording against this small phrase model. It may express something different. Compare the article, noun and description with: '+step.answer+'. Other ways to make a request can also be valid.');
 }
 let dialog=null,current=null,part=0,opener=null,recognition=null,voiceGeneration=0;
 const drafts=new Map();
 const el=id=>dialog.querySelector('#'+id);
 const state=()=>{const key=current+':'+part;if(!drafts.has(key))drafts.set(key,{thinking:'',answer:'',help:'',feedback:null});return drafts.get(key)};
 function stopVoice(message=''){
  voiceGeneration++;if(recognition){const old=recognition;recognition=null;try{old.abort()}catch{}}
  if(dialog){el('st128CoachStopVoice').hidden=true;el('st128CoachVoice').disabled=false;if(message)el('st128CoachVoiceStatus').textContent=message}
 }
 function ensure(){
  if(dialog)return;
  dialog=document.createElement('dialog');dialog.id='stepCoach';dialog.setAttribute('aria-labelledby','st128CoachTitle');
  dialog.innerHTML='<div class="step-coach-body"><header><p class="step-coach-eyebrow">Talk it through</p><button type="button" id="st128CoachClose">Close</button></header><h2 id="st128CoachTitle"></h2><p id="st128CoachContext"></p><label for="st128CoachPart">Which part do you want to work on?</label><select id="st128CoachPart"></select><h3 id="st128CoachPartTitle" tabindex="-1"></h3><p id="st128CoachPrompt"></p><label for="st128CoachThinking">Your thinking, in your own words</label><textarea id="st128CoachThinking" rows="3" maxlength="2000" aria-describedby="st128CoachNotesHelp"></textarea><p id="st128CoachNotesHelp" class="step-coach-note">These are your working notes. The answer check below does not grade this explanation. Notes stay available while this tab remains open.</p><div class="step-coach-voice"><label for="st128CoachVoiceLanguage">Dictation language<select id="st128CoachVoiceLanguage"><option value="en-US">English</option><option value="es-ES">Spanish</option></select></label><button type="button" id="st128CoachVoice">Speak your thinking</button><button type="button" id="st128CoachStopVoice" hidden>Stop microphone</button></div><p id="st128CoachVoiceStatus" class="step-coach-note" role="status">Typing always works. Dictation is available only when this browser has a ready local speech model.</p><form id="st128CoachCheck" novalidate><label for="st128CoachAnswer">Your answer for this step</label><input id="st128CoachAnswer" type="text" autocomplete="off" maxlength="200" spellcheck="false" aria-describedby="st128CoachPrompt"><button type="submit">Check this answer</button><p id="st128CoachFeedback" role="status"></p></form><label for="st128CoachStuck">Where did this get confusing?</label><select id="st128CoachStuck"></select><p id="st128CoachHelp"></p><details id="st128CoachWorked"><summary>See the teacher work this step</summary><p></p></details><footer><button type="button" id="st128CoachPrevious">Previous part</button><button type="button" id="st128CoachNext">Next part</button><button type="button" id="st128CoachReturn">Back to the lesson</button></footer></div>';
  document.body.append(dialog);
  el('st128CoachThinking').oninput=()=>state().thinking=el('st128CoachThinking').value;
  el('st128CoachAnswer').oninput=()=>{state().answer=el('st128CoachAnswer').value;state().feedback=null;el('st128CoachFeedback').textContent='';el('st128CoachFeedback').removeAttribute('data-feedback-kind')};
  el('st128CoachCheck').onsubmit=event=>{event.preventDefault();const feedback=check(current,part,el('st128CoachAnswer').value);state().feedback=feedback;showFeedback(feedback)};
  el('st128CoachStuck').onchange=()=>{state().help=el('st128CoachStuck').value;showHelp()};
  el('st128CoachPart').onchange=()=>{part=Number(el('st128CoachPart').value);render()};
  el('st128CoachPrevious').onclick=()=>{if(part>0){part--;render()}};
  el('st128CoachNext').onclick=()=>{if(part<scenarios[current].steps.length-1){part++;render()}};
  el('st128CoachClose').onclick=el('st128CoachReturn').onclick=()=>dialog.close();
  el('st128CoachVoice').onclick=startVoice;
  el('st128CoachStopVoice').onclick=()=>stopVoice('Microphone stopped. Your existing notes are kept.');
  el('st128CoachVoiceLanguage').onchange=()=>stopVoice('Language changed. Choose Speak your thinking to start again.');
  dialog.addEventListener('close',()=>{stopVoice();if(opener?.isConnected)opener.focus({preventScroll:true})});
  dialog.addEventListener('cancel',()=>stopVoice());
 }
 function showFeedback(feedback){el('st128CoachFeedback').textContent=feedback?.message||'';if(feedback)el('st128CoachFeedback').dataset.feedbackKind=feedback.kind;else el('st128CoachFeedback').removeAttribute('data-feedback-kind')}
 function showHelp(){const choice=state().help;el('st128CoachHelp').textContent=choice===''?'':scenarios[current].steps[part].stuck[Number(choice)]?.[1]||''}
 function render(){
  stopVoice('Typing always works. Dictation requires a ready local speech model.');
  const scenario=scenarios[current],step=scenario.steps[part],draft=state();
  el('st128CoachPart').value=String(part);el('st128CoachPartTitle').textContent=step.title;el('st128CoachPrompt').textContent=step.prompt;
  el('st128CoachThinking').value=draft.thinking;el('st128CoachAnswer').value=draft.answer;showFeedback(draft.feedback);
  el('st128CoachStuck').innerHTML='<option value="">Choose a sticking point</option>'+step.stuck.map(([label],i)=>'<option value="'+i+'">'+esc(label)+'</option>').join('');
  el('st128CoachStuck').value=draft.help;showHelp();el('st128CoachWorked').open=false;el('st128CoachWorked').querySelector('p').textContent=step.reasoning;
  el('st128CoachPrevious').disabled=part===0;el('st128CoachNext').disabled=part===scenario.steps.length-1;
  if(dialog.open)el('st128CoachPartTitle').focus({preventScroll:true});
 }
 function open(subject,unit,returnFocus){
  if(!own(scenarios,unit)||scenarios[unit].subject!==subject)return false;
  ensure();stopVoice();current=unit;part=0;opener=returnFocus||document.activeElement;
  const scenario=scenarios[unit];el('st128CoachTitle').textContent=scenario.title;el('st128CoachContext').textContent=scenario.context;
  el('st128CoachPart').innerHTML=scenario.steps.map((s,i)=>'<option value="'+i+'">'+(i+1)+'. '+esc(s.title)+'</option>').join('');
  render();if(!dialog.open)dialog.showModal();el('st128CoachPartTitle').focus({preventScroll:true});dialog.scrollTop=0;return true;
 }
 async function startVoice(){
  stopVoice();const generation=voiceGeneration,unit=current,index=part,language=el('st128CoachVoiceLanguage').value;
  const Engine=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Engine){el('st128CoachVoiceStatus').textContent='Local dictation is unavailable in this browser. You can type your thinking instead.';return}
  el('st128CoachVoice').disabled=true;el('st128CoachVoiceStatus').textContent='Checking whether local dictation is ready…';
  try{
   const instance=new Engine();
   if(!('processLocally' in instance)||typeof Engine.available!=='function')throw Error('local-unavailable');
   const ready=await Engine.available({langs:[language],processLocally:true});
   if(generation!==voiceGeneration||!dialog.open||current!==unit||part!==index)return;
   if(ready!=='available')throw Error('local-unavailable');
   instance.processLocally=true;instance.lang=language;instance.continuous=false;instance.interimResults=false;recognition=instance;
   instance.onresult=event=>{
    if(generation!==voiceGeneration||!dialog.open||current!==unit||part!==index)return;
    const text=Array.from(event.results).slice(event.resultIndex||0).filter(r=>r.isFinal).map(r=>r[0].transcript).join(' ');
    if(text){const draft=state();draft.thinking=(draft.thinking+(draft.thinking?'\n':'')+text).slice(0,2000);el('st128CoachThinking').value=draft.thinking;el('st128CoachVoiceStatus').textContent='Added to your working notes. Enter your answer separately when you want to check it.'}
   };
   instance.onerror=()=>{if(generation===voiceGeneration)stopVoice('Dictation could not continue. Your notes are kept; you can type instead.')};
   instance.onend=()=>{if(generation===voiceGeneration){recognition=null;el('st128CoachVoice').disabled=false;el('st128CoachStopVoice').hidden=true;if(el('st128CoachVoiceStatus').textContent.startsWith('Listening'))el('st128CoachVoiceStatus').textContent='Microphone stopped. You can type or try local dictation again.'}};
   el('st128CoachStopVoice').hidden=false;el('st128CoachVoiceStatus').textContent='Listening locally. Say your thinking, then stop the microphone.';instance.start();
  }catch{if(generation===voiceGeneration)stopVoice('Local dictation is not ready in this browser. You can type your thinking instead. No cloud dictation was started.')}
 }
 window.studyTableStepCoach={version:128,check,open,close(){if(dialog?.open)dialog.close()}};
})();
