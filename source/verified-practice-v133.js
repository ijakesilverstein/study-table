// V133: authored transfer exercises and optional, on-device revisit scheduling.
// Only exact/normalized authored answers are checked; this is not freeform AI grading.
const V133_BANK=__TRANSFER_BANK__;
const V133_STORE='studytable:transfer-review:v133';
const V133_DAY=24*60*60*1000;
const V133_SESSION={};
function v133Normalize(value){
 return String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
 .replace(/[\u2212\u2013\u2014]/g,'-').replace(/[¿¡.,;:!?'"“”‘’]/g,' ')
 .replace(/[-–]/g,' ').replace(/\s+/g,' ').trim();
}
function v133Numeric(value){
 const s=String(value??'').trim().replace(/\u2212/g,'-').replace(/%$/,'').trim();
 return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)?Number(s):null;
}
function v133Equivalent(a,b){
 const n=typeof b==='number'?v133Numeric(a):null;
 return typeof b==='number'?n!==null&&Number.isFinite(n)&&Math.abs(n-b)<=Math.max(.005,Math.abs(b)*.00001):v133Normalize(a)===v133Normalize(b);
}
function v133Check(problem,value){
 if(!problem||typeof problem!=='object')return {kind:'unsupported',message:'This item cannot be checked.'};
 if(!String(value??'').trim())return {kind:'empty',message:'Give it a try, or ask for a hint. The worked explanation is always available.'};
 if(problem.kind==='number'&&v133Numeric(value)===null)return {kind:'format',message:'Enter a number only. The question tells you which unit to use.'};
 if((problem.kind==='choice')&&!problem.options?.some(opt=>v133Equivalent(value,opt)))return {kind:'format',message:'Choose one of the listed options.'};
 const valid=[problem.answer,...(problem.accept||[])];
 if(valid.some(answer=>v133Equivalent(value,answer)))return {kind:'correct',message:'That fits the checked answer.',why:problem.why};
 const mistake=Object.entries(problem.wrong||{}).find(([wrong])=>v133Equivalent(value,problem.kind==='number'?Number(wrong):wrong));
 if(mistake)return {kind:'misconception',message:mistake[1],why:problem.why};
 if(problem.kind==='number')return {kind:'unmatched',message:'That number does not match the worked result. I cannot tell which step led you there.',why:problem.why};
 return {kind:'unverified',message:"I can't verify that wording from this limited answer bank. It may be reasonable; compare it with the worked answer.",why:problem.why};
}
function v133Records(){
 try{
  const stored=JSON.parse(localStorage.getItem(V133_STORE)||'null');
  if(stored?.schema!==1||!stored.records||typeof stored.records!=='object')return {};
  return Object.fromEntries(Object.entries(stored.records).filter(([unit,r])=>V133_BANK[unit]&&r&&Number.isFinite(r.due)&&Number.isInteger(r.level)&&r.level>=0&&r.level<=5&&Number.isInteger(r.tries)&&r.tries>=0));
 }catch{return {}}
}
function v133Write(records){
 try{localStorage.setItem(V133_STORE,JSON.stringify({schema:1,records}));return true}catch{return false}
}
function v133Date(timestamp){
 return new Date(timestamp).toLocaleDateString(undefined,{month:'short',day:'numeric'});
}
function v133MapMarkup(){
 const units=COURSE.units.filter(u=>V133_BANK[u.id]&&V133_BANK[u.id].subject===COURSE.subject);
 if(!units.length)return '';
 const entries=v133Records(),now=Date.now(),due=units.filter(u=>entries[u.id]&&entries[u.id].due<=now);
 const next=units.filter(u=>entries[u.id]&&entries[u.id].due>now).sort((a,b)=>entries[a.id].due-entries[b.id].due)[0];
 return '<details class="v133-map" id="v133Map"'+(due.length?' open':'')+'><summary>Practice a new problem'+(due.length?' · '+due.length+' ready to revisit':'')+'</summary>'+
 '<p>Different questions, same underlying skill. I can check the answer, show the reasoning, and help with a familiar wrong turn. There is no timer or score.</p>'+
 (due.length?'<p class="v133-review-head">Ready for a gentle revisit</p>':'')+
 '<div class="v133-map-list">'+units.map(u=>'<button type="button" data-v133-unit="'+escape(u.id)+'">'+escape(V133_BANK[u.id].skill)+
 (entries[u.id]?(entries[u.id].due<=now?' · Ready to revisit':' · Revisit '+v133Date(entries[u.id].due)):' · New')+'</button>').join('')+'</div>'+
 (next&&!due.length?'<p class="v133-date">Next optional revisit: '+v133Date(entries[next.id].due)+'. You can practise sooner whenever you like.</p>':'')+
 '<p class="v133-privacy">Review choices are saved only in this browser. They are separate from your course progress and are not included in the existing progress-backup export.</p></details>';
}
function v133LessonMarkup(unit){
 const row=V133_BANK[unit.id];
 if(!row||row.subject!==COURSE.subject)return '';
 const saved=v133Records()[unit.id],ready=saved?.due<=Date.now();
 return '<section class="v133-practice" id="v133Practice" data-v133-unit-id="'+escape(unit.id)+'">'+
 '<p class="v133-eyebrow">Try it yourself</p><h2>A different problem, same idea</h2>'+
 '<p>'+escape(row.skill)+'. This is new material to work through, not a test you must pass. I can only check the answers this lesson actually covers.</p>'+
 '<button type="button" class="v133-launch" data-v133-start>'+(ready?'Review a fresh version':'Try a fresh problem')+'</button>'+
 (saved?'<span class="v133-date"> '+(ready?'Ready to revisit':"Optional revisit "+v133Date(saved.due))+'</span>':'')+
 '<div class="v133-content" data-v133-content hidden></div></section>';
}
function v133Start(host){
 const id=host?.dataset.v133UnitId,row=V133_BANK[id];if(!row)return;
 const count=V133_SESSION[id]||0,saved=v133Records()[id],index=(count+(saved?.tries||0))%row.variants.length;
 V133_SESSION[id]=count+1;
 host.dataset.variant=String(index);
 const problem=row.variants[index],panel=host.querySelector('[data-v133-content]');if(!panel)return;
 const control=problem.kind==='choice'?
  '<fieldset class="v133-options"><legend>Your answer</legend>'+problem.options.map((o,i)=>'<label><input type="radio" name="v133-choice" value="'+escape(o)+'"'+(i===0?'':'')+'> '+escape(o)+'</label>').join('')+'</fieldset>':
  '<label for="v133Input">Your answer</label><input id="v133Input" name="v133-input" type="text" autocomplete="off" spellcheck="false" placeholder="'+(problem.kind==='number'?'Enter a number':'Type a short answer')+'">';
 panel.innerHTML='<p class="v133-prompt">'+escape(problem.prompt)+'</p>'+
 '<form data-v133-form>'+control+'<div class="v133-actions"><button type="submit" class="primary">Check my answer</button><button type="button" data-v133-hint>Give me a hint</button><button type="button" data-v133-reveal>See the full reasoning</button></div></form>'+
 '<p class="v133-hint" data-v133-hint-text hidden></p>'+
 '<div class="v133-result" data-v133-result role="status" aria-live="polite" hidden></div>'+
 '<div class="v133-reason" data-v133-reason hidden></div>'+
 '<div class="v133-actions v133-next" data-v133-next hidden><button type="button" data-v133-save>Add to gentle review</button><button type="button" data-v133-another>Try the other version</button><button type="button" data-v133-remove hidden>Remove from review</button></div>';
 panel.hidden=false;
 const open=host.querySelector('[data-v133-start]');if(open)open.textContent='Start over with another version';
 (panel.querySelector('input')||panel.querySelector('button'))?.focus({preventScroll:true});
}
function v133Reveal(host,fromCorrect=false){
 const row=V133_BANK[host.dataset.v133UnitId],item=row?.variants[Number(host.dataset.variant)];if(!item)return;
 const panel=host.querySelector('[data-v133-content]');
 const reason=panel.querySelector('[data-v133-reason]');
 reason.textContent='Worked answer: '+item.answer+'. '+item.why;
 reason.hidden=false;
 panel.querySelector('[data-v133-next]').hidden=false;
 if(!fromCorrect)host.dataset.lastOutcome='reveal';
}
function v133Feedback(host,result){
 const panel=host.querySelector('[data-v133-content]'),output=panel.querySelector('[data-v133-result]');if(!output)return;
 output.textContent=result.message;output.dataset.outcome=result.kind;output.hidden=false;
 if(['correct','misconception','unmatched','unverified'].includes(result.kind)){
  host.dataset.lastOutcome=result.kind;
  panel.querySelector('[data-v133-next]').hidden=false;
  if(result.kind==='correct')v133Reveal(host,true);
 }
}
function v133Save(host){
 const unit=host.dataset.v133UnitId,outcome=host.dataset.lastOutcome;
 if(!V133_BANK[unit]||!outcome)return;
 const records=v133Records(),old=records[unit],right=outcome==='correct';
 const level=right?Math.min(5,(old?.level||0)+1):0;
 const days=right?(level===1?3:level===2?7:14):1;
 const due=Date.now()+days*V133_DAY;
 records[unit]={due,level,tries:(old?.tries||0)+1};
 const panel=host.querySelector('[data-v133-content]'),save=panel.querySelector('[data-v133-save]');if(!save)return;
 if(v133Write(records)){
  save.textContent='Review saved · '+v133Date(due);save.disabled=true;
  const rem=panel.querySelector('[data-v133-remove]');rem.hidden=false;
  const launch=host.querySelector('[data-v133-start]');if(launch)launch.textContent='Try another problem now';
 }else save.textContent='Could not save in this browser. You can still practise.';
}
function v133Remove(host){
 const unit=host.dataset.v133UnitId,records=v133Records();
 if(!records[unit])return;
 delete records[unit];
 if(v133Write(records)){
  const panel=host.querySelector('[data-v133-content]');
  panel.querySelector('[data-v133-save]').disabled=false;
  panel.querySelector('[data-v133-save]').textContent='Add to gentle review';
  panel.querySelector('[data-v133-remove]').hidden=true;
 }
}
document.addEventListener('submit',event=>{
 const form=event.target.closest('[data-v133-form]');if(!form)return;
 event.preventDefault();
 const host=form.closest('[data-v133-unit-id]'),item=V133_BANK[host?.dataset.v133UnitId]?.variants[Number(host?.dataset.variant)];
 if(!item)return;
 const value=item.kind==='choice'?form.querySelector('input[name="v133-choice"]:checked')?.value:form.querySelector('input[name="v133-input"]')?.value;
 const result=v133Check(item,value);
 v133Feedback(host,result);
});
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-v133-start],[data-v133-unit],[data-v133-hint],[data-v133-reveal],[data-v133-save],[data-v133-another],[data-v133-remove]');if(!b)return;
 if(b.hasAttribute('data-v133-unit')){
  const id=b.dataset.v133Unit;if(!V133_BANK[id])return;
  showUnit(id);const host=document.getElementById('v133Practice');if(host){v133Start(host);host.scrollIntoView({block:'start'})}return;
 }
 const host=b.closest('[data-v133-unit-id]');if(!host)return;
 const panel=host.querySelector('[data-v133-content]'),item=V133_BANK[host.dataset.v133UnitId]?.variants[Number(host.dataset.variant)];
 if(b.hasAttribute('data-v133-start')||b.hasAttribute('data-v133-another'))v133Start(host);
 if(b.hasAttribute('data-v133-hint')&&item){const p=panel.querySelector('[data-v133-hint-text]');p.textContent=item.hint;p.hidden=false}
 if(b.hasAttribute('data-v133-reveal'))v133Reveal(host);
 if(b.hasAttribute('data-v133-save'))v133Save(host);
 if(b.hasAttribute('data-v133-remove'))v133Remove(host);
});
window.studyTableTransfer={version:133,check:v133Check,normalize:v133Normalize,records:v133Records,bank:V133_BANK};
