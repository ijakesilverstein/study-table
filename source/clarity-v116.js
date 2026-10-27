const V116_MATH=__MATH_DESK__;
const V116_STEPS=__WALKTHROUGH_MAP__;
const V116_UNIT_HELP={'functions':'graphs','algebra-for-rates':'fractions','calculus-1':'graphs','calculus-2':'fractions','derivative-rules':'powers','product-rule':'powers','calculus-3':'powers','calculus-5':'quadratic','calculus-4':'powers','definite-integrals':'graphs','integral-substitution':'powers','units-and-directions':'signs','physics-4':'squares','velocity-graphs':'graphs','physics-1':'equations','force-diagrams':'signs','physics-2':'squares','physics-5':'signs','physics-3':'equations','circuit-paths':'fractions','waves':'fractions','pressure':'fractions'};
function v116MathButton(topic,label='Show the algebra slowly'){return '<button type="button" data-math-help="'+escape(topic)+'">'+escape(label)+'</button>'}
function v116MathReference(id){const topic=V116_UNIT_HELP[id];return !topic?'':'<details class="optional math-reference"><summary>Need a slower maths step?</summary><p>You can follow a complete example of the calculation used here, then return to this lesson.</p>'+v116MathButton(topic,V116_MATH[topic].title)+'</details>'}
function v116MathGraphs(){
 let position='',velocity='';for(let i=0;i<=60;i++){const t=i/20;position+=(i?'L':'M')+(55+t*130)+','+(195-t*t*17);velocity+=(i?'L':'M')+(55+t*130)+','+(195-2*t*24)}
 const axes='<path d="M55 28V195H465" fill="none" stroke="currentColor"/><text x="190" y="244">Time (seconds)</text>'+[0,1,2,3].map(t=>'<text x="'+(52+t*130)+'" y="220">'+t+'</text>').join('');
 return '<div class="math-graphs">'+v115SvgRegion('<svg viewBox="0 0 500 255" role="img" aria-label="Position t squared: endpoints at one second, one metre and three seconds, nine metres. Secant rise eight metres, run two seconds."><text x="55" y="20">Position (metres)</text>'+axes+'<path d="'+position+'" fill="none" stroke="var(--study-warm)" stroke-width="3"/><path d="M185 178L445 42M185 178H445V42" stroke="currentColor" stroke-dasharray="5 4" fill="none"/><circle cx="185" cy="178" r="5" fill="currentColor"/><circle cx="445" cy="42" r="5" fill="currentColor"/><text x="270" y="171">2 s</text><text x="390" y="120">8 m</text><text x="75" y="68">Slope = 4 m/s</text></svg>','Position-graph example')+v115SvgRegion('<svg viewBox="0 0 500 255" role="img" aria-label="Velocity two t: heights two and six metres per second over a two-second interval, trapezoid area eight metres."><text x="55" y="20">Velocity (m/s)</text>'+axes+'<path d="M185 195V147L445 51V195Z" fill="var(--study-panel)" stroke="currentColor"/><path d="'+velocity+'" fill="none" stroke="var(--study-warm)" stroke-width="3"/><text x="190" y="139">2 m/s</text><text x="355" y="43">6 m/s</text><text x="260" y="179">Area = 8 m</text></svg>','Velocity-graph example')+'</div>';
}
function v116OpenMath(topic='fractions',opener=document.activeElement){
 if(!V116_MATH[topic])topic='fractions';v109StopMedia();let dialog=$('mathDesk');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='mathDesk';dialog.setAttribute('aria-labelledby','mathDeskTitle');dialog.innerHTML='<header class="math-desk-head"><strong>Work through the maths</strong><button type="button" id="mathDeskClose">Back to the lesson</button></header><div class="math-desk-body"><label for="mathDeskTopic">Choose an explanation</label><select id="mathDeskTopic">'+Object.entries(V116_MATH).map(([id,t])=>'<option value="'+id+'">'+escape(t.title)+'</option>').join('')+'</select><div id="mathDeskContent"></div></div>';document.body.append(dialog);$('mathDeskClose').onclick=()=>dialog.close();$('mathDeskTopic').onchange=()=>{v116RenderMath($('mathDeskTopic').value);$('mathDeskTitle').focus()};dialog.addEventListener('close',()=>{if(dialog.returnFocus?.isConnected)dialog.returnFocus.focus({preventScroll:true})})}
 dialog.returnFocus=opener;$('mathDeskTopic').value=topic;v116RenderMath(topic);if(!dialog.open)dialog.showModal();$('mathDeskClose').focus();
}
function v116RenderMath(topic){
 const t=V116_MATH[topic];$('mathDeskContent').innerHTML='<h1 id="mathDeskTitle" tabindex="-1">'+escape(t.title)+'</h1>'+t.opening.map(p=>'<p>'+escape(p)+'</p>').join('')+(t.figure==='graphs'?v116MathGraphs():'')+t.examples.map(e=>'<section class="math-example"><h2>'+escape(e.title)+'</h2><p class="case-problem">'+escape(e.setup)+'</p><ol>'+e.steps.map(s=>'<li><h3>'+escape(s.title)+'</h3><p class="calculation">'+escape(s.line)+'</p><p>'+escape(s.why)+'</p></li>').join('')+'</ol><p class="math-result">'+escape(e.answer)+'</p></section>').join('')+'<p class="math-remember">'+escape(t.remember)+'</p>';
 dialogScrollTop();
 function dialogScrollTop(){const d=$('mathDesk');if(d)d.scrollTop=0}
}
function v116WireMath(){document.querySelectorAll('[data-math-help]').forEach(b=>b.onclick=()=>v116OpenMath(b.dataset.mathHelp,b))}
function v116StepTools(partIndex,stepIndex){const target=V116_STEPS[COURSE.subject]?.[partIndex]?.[stepIndex];if(!target)return '';return '<div class="step-actions"><button type="button" data-follow-step="'+stepIndex+'" aria-controls="projectDemo" aria-expanded="false">'+escape(target.label)+'</button>'+(target.help?v116MathButton(target.help):'')+'</div><div class="step-demo-slot" data-step-slot="'+stepIndex+'"></div>'}
function v116WireSteps(partIndex){
 const host=$('projectDemo'),home=$('projectDemoHome');
 const set=(id,value,event='change')=>{const el=$(id);if(!el)return;el.value=String(value);el.dispatchEvent(new Event(event,{bubbles:true}))};
 const returnButton=document.createElement('button');returnButton.type='button';returnButton.className='text-button demo-return';returnButton.textContent='Return demonstration to the top';returnButton.hidden=true;returnButton.onclick=()=>{home.append(host);returnButton.hidden=true;document.querySelectorAll('[data-follow-step]').forEach(b=>b.setAttribute('aria-expanded','false'));host.scrollIntoView({block:'start'});host.focus({preventScroll:true})};host.prepend(returnButton);
 host.setAttribute('tabindex','-1');host.setAttribute('role','region');host.setAttribute('aria-label','Worked demonstration');
 document.querySelectorAll('[data-follow-step]').forEach(b=>b.onclick=()=>{
  const target=V116_STEPS[COURSE.subject][partIndex][Number(b.dataset.followStep)];v109StopMedia();document.querySelectorAll('[data-follow-step]').forEach(other=>other.setAttribute('aria-expanded',String(other===b)));
  document.querySelector('[data-step-slot="'+b.dataset.followStep+'"]').append(host);returnButton.hidden=false;
  if(COURSE.subject==='chess')set('projectMove',target.position);
  else if(COURSE.subject==='calculus'){
   set('projectTankPreset',target.preset);set('projectCapacity',target.capacity);const time=target.time==='full'?(-1+Math.sqrt(4*target.capacity-11))/2:target.time;set('projectTime',time,'input');
  }else if(COURSE.subject==='physics'){set('projectHeight',target.height);set('projectPhase',target.phase)}
  else if(COURSE.subject==='piano'){
   set('projectHand',target.hand);const select=$('projectBars'),value=target.bars.join(',');if(![...select.options].some(o=>o.value===value))select.add(new Option(target.bars[1]-target.bars[0]===1?'Bar '+(target.bars[0]+1)+' only':'Bars '+(target.bars[0]+1)+'–'+target.bars[1],value));set('projectBars',value);$('projectLoop').checked=!!target.loop;$('projectPlay').click();
  }else{
   for(const [id,value] of Object.entries({projectDay:'sunday',projectDrink:'coffee',projectWhere:'here',projectPayment:'card'}))if($(id))$(id).value=value;
   $('projectThisExchange').click();const local=target.turn-COURSE.project.parts[partIndex].dialogue[0];$('projectDialogue').querySelector('[data-line="'+local+'"]').classList.add('step-focused');$('projectDialogue').querySelector('[data-hear-line="'+local+'"]').click();
  }
  host.setAttribute('aria-label',target.label);host.scrollIntoView({block:'start'});host.focus({preventScroll:true});
 });v116WireMath();
}
window.studyTableMathDesk={open:v116OpenMath,topics:Object.keys(V116_MATH)};
