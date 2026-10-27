const V115_PROJECT_DEMO=__PROJECT_DEMOS__;
function projectCard(){const p=COURSE.project;return '<section class="project-card"><p class="course-eyebrow">A COMPLETE WORKED PROJECT · FOUR PARTS</p><h2>'+escape(p.title)+'</h2><p>'+escape(p.intro)+'</p><button data-course-project>Open the course project</button></section>'}
function showProject(requested){
 const project=COURSE.project,interactive=!!V116_STEPS[COURSE.subject];let index=Number(requested);
 if(requested===undefined||requested===''){try{index=Number(localStorage.getItem(PLACE+':project-part')||0)}catch{index=0}}
 index=Number.isInteger(index)?Math.max(0,Math.min(project.parts.length-1,index)):0;
 const part=project.parts[index];prepareView();saveReading(project.id);try{localStorage.setItem(PLACE+':project-part',String(index))}catch{}
 $('courseArticle').innerHTML='<button class="text-button" data-course-map>← Course map</button><p class="course-eyebrow">COURSE PROJECT · PART '+(index+1)+' OF '+project.parts.length+'</p><h1>'+escape(project.title)+'</h1><p class="course-lead">'+escape(project.intro)+'</p><p class="project-needs">'+escape(project.needs)+'</p><nav class="project-parts" aria-label="Project parts">'+project.parts.map((p,i)=>'<button data-course-project data-project-part="'+i+'"'+(index===i?' aria-current="step"':'')+'><span>'+(i+1)+'</span> '+escape(p.title)+'</button>').join('')+'</nav><section id="projectPart" data-project-part="'+index+'"><h2>'+escape(part.title)+'</h2><p class="course-goal">'+escape(part.goal)+'</p>'+part.opening.map(p=>'<p>'+escape(p)+'</p>').join('')+'<p class="project-follow-note"'+(interactive?'':' hidden')+'>Use the demonstration button beside a worked step to see or hear that exact example here.</p><div id="projectDemoHome"><div id="projectDemo" class="project-demo"></div></div><ol class="project-solution">'+part.steps.map((s,stepIndex)=>'<li><h3>'+escape(s.title)+'</h3><p class="calculation">'+escape(s.work)+'</p><p>'+escape(s.explanation)+'</p>'+v116StepTools(index,stepIndex)+'</li>').join('')+'</ol><p class="project-ending">'+escape(part.ending)+'</p></section><details class="optional"><summary>Revisit the lessons used here</summary><div class="course-actions">'+part.links.map(id=>'<button data-course-unit="'+id+'">'+escape(byId.get(id).title)+'</button>').join('')+'</div></details><footer class="course-footer">'+(index>0?'<button data-course-project data-project-part="'+(index-1)+'">← Previous part</button>':'')+(index<project.parts.length-1?'<button class="primary" data-course-project data-project-part="'+(index+1)+'">Next: '+escape(project.parts[index+1].title)+'</button>':'<button class="primary" data-course-map>Back to the course map</button>')+'</footer>';
 document.querySelectorAll('#courseContents [aria-current]').forEach(b=>b.removeAttribute('aria-current'));document.querySelector('#courseContents [data-course-project]')?.setAttribute('aria-current','page');wire();
 const host=$('projectDemo');if(COURSE.subject==='piano')v115Piano(host,part);else if(COURSE.subject==='spanish')v115Spanish(host,part);else if(COURSE.subject==='chess')v115Chess(host,part);else if(COURSE.subject==='calculus')v115Tank(host,part);else if(COURSE.subject==='physics')v115Journey(host,part);else $('projectDemoHome').hidden=true;
 if(interactive)v116WireSteps(index);$('courseArticle').focus({preventScroll:true});
}
function v115PianoScore(d){
 const diatonic=n=>Number(n.slice(-1))*7+'CDEFGAB'.indexOf(n[0]);
 let out='<svg viewBox="0 0 820 515" role="img" aria-label="Eight bars in 4/4: melody on the treble staff, one whole-note bass per bar on the bass staff. A complete note list follows the score.">';
 for(let system=0;system<2;system++){
  const y=system*250,left=90,right=800,w=(right-left)/4;
  out+='<g transform="translate(0 '+y+')">';
  for(const base of [100,200])for(let j=0;j<5;j++)out+='<path d="M25 '+(base-j*10)+'H800" stroke="currentColor"/>';
  out+='<text class="score-clef" x="26" y="103.64" font-size="45.455">𝄞</text><g aria-label="Bass clef, dots around the F3 line"><path d="M33 170C22 160 28 155 37 158C55 164 46 185 27 196C42 181 48 169 38 165C34 163 30 165 31 168" fill="currentColor"/><circle cx="33" cy="170" r="4" fill="currentColor"/><circle cx="55" cy="165" r="2" fill="currentColor"/><circle cx="55" cy="175" r="2" fill="currentColor"/></g>';
  if(!system)for(const base of [60,160])out+='<text x="66" y="'+(base+18)+'" font-size="23">4</text><text x="66" y="'+(base+37)+'" font-size="23">4</text>';
  for(let local=0;local<4;local++){
   const bar=system*4+local,x=left+local*w;
   out+='<rect class="score-bar" data-score-bar="'+bar+'" x="'+x+'" y="34" width="'+w+'" height="181" rx="4" fill="transparent"/><text x="'+(x+6)+'" y="25" font-size="16">Bar '+(bar+1)+'</text>';
   for(let beat=0;beat<4;beat++)out+='<text x="'+(x+20+beat*38)+'" y="238" font-size="16">'+(beat+1)+'</text>';
   for(const e of d.events.filter(e=>e.bar===bar)){
    const nx=x+22+(e.at%4)*38,ny=e.hand==='right'?100-(diatonic(e.note)-diatonic('E4'))*5:200-(diatonic(e.note)-diatonic('G2'))*5;
    out+='<g class="score-note" data-score-at="'+e.at+'" data-score-hand="'+e.hand+'" data-score-duration="'+e.beats+'">';
    if(e.hand==='right'&&ny>=110)for(let ly=110;ly<=ny;ly+=10)out+='<path d="M'+(nx-13)+' '+ly+'H'+(nx+13)+'" stroke="currentColor"/>';
    out+='<ellipse cx="'+nx+'" cy="'+ny+'" rx="8" ry="5" transform="rotate(-15 '+nx+' '+ny+')" fill="'+(e.beats>=2?'var(--study-surface)':'currentColor')+'" stroke="currentColor" stroke-width="2"/>';
    if(e.beats<4)out+='<path d="M'+(nx+7)+' '+ny+'V'+(ny-30)+'" stroke="currentColor" stroke-width="2"/>';
    out+='<text class="score-note-name" x="'+(nx-11)+'" y="'+(e.hand==='right'?139:222)+'" font-size="15">'+e.note+'</text></g>';
   }
   out+='<path d="M'+(x+w)+' 60V100M'+(x+w)+' 160V200" stroke="currentColor"/>';
  }
  out+='</g>';
 }
 return out+'</svg>';
}
function v115Piano(host,part){
 const d=V115_PROJECT_DEMO;
 host.innerHTML='<h3>Listen, count, then play</h3><p>Original piece: <em>'+escape(d.title)+'</em>. Four preparation beats come before the music. Each bar has four beats; the numbers below the staff show the shared pulse.</p><div class="project-controls"><label>Tempo <select id="projectTempo">'+[40,50,60,70,80,100,120].map(n=>'<option value="'+n+'"'+(n===60?' selected':'')+'>'+n+' beats/min</option>').join('')+'</select></label><label>Listen to <select id="projectHand"><option value="right">Right hand</option><option value="left">Left hand</option><option value="both">Both hands</option></select></label><label>Passage <select id="projectBars"><option value="0,8">All eight bars</option><option value="0,2">Bars 1–2</option><option value="2,4">Bars 3–4</option><option value="4,6">Bars 5–6</option><option value="6,8">Bars 7–8</option><option value="0,4">Bars 1–4</option></select></label></div><div class="project-checks"><label><input id="projectLoop" type="checkbox"> Loop with a fresh count-in</label><label><input id="projectClick" type="checkbox"> Metronome during music</label><label><input id="projectLabels" type="checkbox" checked> Show note names</label></div><div class="course-actions"><button class="primary" id="projectPlay">Play with count-in</button><button id="projectStop">Stop</button></div><p id="projectPianoStatus" role="status">Ready. The music begins after the count of four.</p><div class="project-score" role="region" aria-label="Scrollable piano score" tabindex="0">'+v115PianoScore(d)+'</div><details class="optional"><summary>Read every note and its duration</summary><ol>'+Array.from({length:8},(_,bar)=>'<li><strong>Bar '+(bar+1)+':</strong> right '+d.events.filter(e=>e.bar===bar&&e.hand==='right').map(e=>e.note+' ('+e.beats+' beat'+(e.beats>1?'s':'')+')').join(', ')+'; left '+d.events.find(e=>e.bar===bar&&e.hand==='left').note+' for 4 beats.</li>').join('')+'</ol></details>';
 $('projectHand').value=part.hand;$('projectBars').value=part.bars.join(',');
 const status=$('projectPianoStatus');
 const reset=()=>{v109StopMedia();host.querySelectorAll('.score-active').forEach(e=>e.classList.remove('score-active'))};
 const sound=(hz,start,duration,level,click=false)=>{
  const osc=v109Audio.createOscillator(),gain=v109Audio.createGain();osc.type=click?'sine':'triangle';osc.frequency.value=hz;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(level,start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+duration*.94);osc.connect(gain);gain.connect(v109Audio.destination);v109Oscillators.add(osc);osc.onended=()=>{v109Oscillators.delete(osc);osc.disconnect();gain.disconnect()};osc.start(start);osc.stop(start+duration*.97);
 };
 const pitch=note=>440*2**((12*(Number(note.slice(-1))+1)+({C:0,D:2,E:4,F:5,G:7,A:9,B:11})[note[0]]-69)/12);
 const play=async()=>{
  reset();const generation=v109Generation,Context=window.AudioContext||window.webkitAudioContext;
  if(!Context){status.textContent='Audio is unavailable. Follow the written score and note list with your own count.';return}
  const beat=60/Number($('projectTempo').value),hand=$('projectHand').value,[first,end]=$('projectBars').value.split(',').map(Number),length=(end-first)*4,click=$('projectClick').checked;
  try{
   v109Audio=v109Audio||new Context();await v109Audio.resume();if(generation!==v109Generation||!host.isConnected)return;
   const base=v109Audio.currentTime+.04;
   const schedule=(offset)=>{
    if(generation!==v109Generation||!host.isConnected)return;
    const start=base+offset;
    for(let i=0;i<4;i++){sound(i===0?990:660,start+i*beat,.08,.035,true);v109Timer(()=>{if(generation===v109Generation)status.textContent='Count in: '+(i+1)+' of 4'},(start-v109Audio.currentTime+i*beat)*1000)}
    for(const e of d.events.filter(e=>e.bar>=first&&e.bar<end&&(hand==='both'||hand===e.hand)))sound(pitch(e.note),start+(4+e.at-first*4)*beat,e.beats*beat,e.hand==='left'?.035:.055);
    for(let i=0;i<length;i++){
     const at=(start-v109Audio.currentTime+(4+i)*beat)*1000,absolute=first*4+i;
     if(click)sound(i%4===0?880:550,start+(4+i)*beat,.06,.022,true);
     v109Timer(()=>{if(generation!==v109Generation)return;status.textContent='Bar '+(Math.floor(absolute/4)+1)+' · beat '+(i%4+1)+' · '+(hand==='both'?'both hands':hand+' hand');host.querySelectorAll('[data-score-bar]').forEach(e=>e.classList.toggle('score-active',Number(e.dataset.scoreBar)===Math.floor(absolute/4)));host.querySelectorAll('[data-score-at]').forEach(e=>{const begin=Number(e.dataset.scoreAt);e.classList.toggle('score-active',absolute>=begin&&absolute<begin+Number(e.dataset.scoreDuration)&&(hand==='both'||hand===e.dataset.scoreHand))})},at);
    }
    v109Timer(()=>{if(generation!==v109Generation||!host.isConnected)return;if($('projectLoop').checked){schedule(offset+(4+length)*beat)}else{reset();status.textContent='Finished. Keep the last note through its full count, then let go.'}},(start-v109Audio.currentTime+(4+length)*beat)*1000+5);
   };schedule(0);
  }catch{reset();status.textContent='The sound could not play. Use the score and written count below.'}
 };
 $('projectPlay').onclick=play;$('projectStop').onclick=()=>{reset();status.textContent='Stopped. Choose a passage and start again when ready.'};
 for(const id of ['projectTempo','projectHand','projectBars','projectClick'])$(id).onchange=()=>{reset();status.textContent='Ready with the new settings. Press Play for a fresh count-in.'};
 $('projectLabels').onchange=()=>host.querySelector('.project-score').classList.toggle('hide-note-names',!$('projectLabels').checked);
}
function v115Spanish(host,part){
 host.innerHTML='<div id="projectDialogueControls"></div><div id="projectDialogue" class="v109-demo"></div>';
 const controls=$('projectDialogueControls'),dialogue=$('projectDialogue');
 controls.innerHTML='<div class="course-actions"><button id="projectWholeConversation">Show the whole afternoon</button><button id="projectThisExchange">Show this part</button></div><label class="project-checks"><input id="projectEnglish" type="checkbox" checked> Show English translations</label>'+(part.adapt?'<fieldset class="project-adapt"><legend>Make a version you would use</legend><div class="project-controls"><label>Meeting day <select id="projectDay"><option value="sunday">Sunday (Saturday does not work)</option><option value="saturday">Saturday (accept the invitation)</option></select></label><label>Drink <select id="projectDrink"><option value="coffee">Small coffee</option><option value="water">Water</option></select></label><label>For where? <select id="projectWhere"><option value="here">For here</option><option value="away">To go</option></select></label><label>Payment <select id="projectPayment"><option value="card">Card</option><option value="cash">Cash</option></select></label></div></fieldset>':'');
 let whole=!!part.adapt;
 const lines=()=>{const copy=V115_PROJECT_DEMO.map(l=>[...l]);if(part.adapt){if($('projectDay').value==='saturday'){copy[3]=['You','Sí, el sábado puedo.','Yes, I can on Saturday.'];copy[4]=['Friend','Perfecto. ¿A las once?','Perfect. At eleven?']}if($('projectDrink').value==='water')copy[11]=['You','Quiero agua, por favor.','I’d like water, please.'];const here=$('projectWhere').value==='here',card=$('projectPayment').value==='card';copy[13]=['You',(here?'Para aquí.':'Para llevar.')+' ¿Puedo pagar '+(card?'con tarjeta':'en efectivo')+'?',(here?'For here.':'To go.')+' Can I pay '+(card?'by card':'in cash')+'?']}return whole?copy:copy.slice(...part.dialogue)};
 const draw=()=>{v109StopMedia();v109Spanish(dialogue,{title:whole?'The complete afternoon':'Hear this part',lines:lines()});host.classList.toggle('hide-english',!$('projectEnglish').checked);$('projectWholeConversation').setAttribute('aria-pressed',String(whole));$('projectThisExchange').setAttribute('aria-pressed',String(!whole))};
 $('projectWholeConversation').onclick=()=>{whole=true;draw()};$('projectThisExchange').onclick=()=>{whole=false;draw()};$('projectEnglish').onchange=()=>host.classList.toggle('hide-english',!$('projectEnglish').checked);
 controls.querySelectorAll('select').forEach(s=>s.onchange=()=>{whole=true;draw()});draw();
}
function v115Chess(host,part){
 const d=V115_PROJECT_DEMO,frames=d.lines[0].frames;let pos=part.position,selected=null;
 host.innerHTML='<h3>Watch the game unfold</h3><label for="projectMove">Jump to a position</label><select id="projectMove">'+d.labels.map((s,i)=>'<option value="'+i+'">'+escape(s)+'</option>').join('')+'</select><div class="v109-demo"><div class="v109-board" role="group" aria-label="Morphy Opera Game, White at the bottom"></div><p id="projectChessPosition"></p><p id="projectChessCaption" class="project-move-explanation" role="status"></p><div class="course-actions"><button id="projectPreviousMove">Previous move</button><button class="primary" id="projectNextMove">Show next move</button><button id="projectResetMove">Start of this part</button></div></div><p>The next move is supplied. You can also select its piece and destination on the board. Arrow keys move square focus.</p>';
 const draw=()=>{
  const f=frames[pos],next=frames[pos+1];v109DrawBoard(host.querySelector('.v109-board'),f.pieces,[...(f.marks||[]),...(selected?[selected]:[])],square=>{
   if(next&&square===next.from){selected=square;draw();$('projectChessCaption').textContent='Selected '+square+'. The next move goes to '+next.to+'.';return}
   if(next&&selected===next.from&&square===next.to){pos++;selected=null;draw();return}
   $('projectChessCaption').textContent=next?'Next: '+next.from+' to '+next.to+'. Use Show next move to see the explanation.':f.caption;
  });$('projectMove').value=String(pos);$('projectChessPosition').textContent='Position '+(pos+1)+' of '+frames.length+' · '+f.turn+' to move';$('projectChessCaption').textContent=f.caption;$('projectPreviousMove').disabled=pos===0;$('projectNextMove').disabled=pos===frames.length-1;
 };
 $('projectMove').onchange=()=>{pos=Number($('projectMove').value);selected=null;draw()};$('projectPreviousMove').onclick=()=>{pos=Math.max(0,pos-1);selected=null;draw()};$('projectNextMove').onclick=()=>{pos=Math.min(frames.length-1,pos+1);selected=null;draw()};$('projectResetMove').onclick=()=>{pos=part.position;selected=null;draw()};draw();
}
function v115TankState(preset,t,capacity){
 const drain=preset==='drain',initial=drain?10:3,free=initial+(drain?6*t-t*t:t*t+t),rate=drain?6-2*t:2*t+1,fillTime=drain?null:(-1+Math.sqrt(4*capacity-11))/2,volume=Math.min(free,capacity),overflow=Math.max(0,free-capacity),corner=!drain&&Math.abs(t-fillTime)<1e-9;
 return {t,capacity,initial,free,rate,volume,overflow,fillTime,actualRate:corner?null:free>=capacity&&!drain?0:rate};
}
function v115Num(x){return Number(x.toFixed(3)).toString()}
function v115SvgRegion(svg,label){return '<div class="project-graph" role="region" tabindex="0" aria-label="'+escape(label)+'">'+svg+'</div>'}
function v115Tank(host,part){
 host.innerHTML='<h3>Follow the same tank through time</h3><div class="project-controls"><label>Setup <select id="projectTankPreset"><option value="fill">Filling: starts at 3 L, rate 2t + 1</option><option value="drain">Fills then drains: starts at 10 L, net rate 6 − 2t</option></select></label><label>Tank capacity <select id="projectCapacity"><option value="20">20 L</option><option value="24">24 L</option></select></label><label>Time <input id="projectTime" type="range" min="0" max="4" step="any" value="4"><output id="projectTimeLabel" for="projectTime"></output></label></div><div id="projectTankGraph"></div><div id="projectTankReading" class="project-model-reading" role="status"></div>';
 $('projectTime').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const direction=['ArrowRight','ArrowUp'].includes(event.key)?1:-1;event.currentTarget.value=String(Math.max(0,Math.min(4,Number(event.currentTarget.value)+direction*.05)));event.currentTarget.dispatchEvent(new Event('input',{bubbles:true}))});
 $('projectTankPreset').value=part.preset||'fill';if(part===COURSE.project.parts[0])$('projectTime').value='2';
 const draw=()=>{
  const preset=$('projectTankPreset').value,t=Number($('projectTime').value),capacity=Number($('projectCapacity').value),s=v115TankState(preset,t,capacity),x=v=>55+v*112.5,y=v=>185-v*6,ry=v=>305-v*8;
  $('projectTimeLabel').textContent=v115Num(t)+' min';
  const path=key=>Array.from({length:81},(_,i)=>{const tt=i/20,st=v115TankState(preset,tt,capacity);return (i?'L':'M')+x(tt)+','+y(st[key])}).join(' ');
  let svg='<svg viewBox="0 0 550 375" role="img" aria-label="Volume and rate from zero to four minutes. At '+v115Num(t)+' minutes the tank holds '+v115Num(s.volume)+' litres and the '+(preset==='fill'?'incoming':'net')+' rate is '+v115Num(s.rate)+' litres per minute."><path d="M55 30V185H510M55 220V330H510" stroke="currentColor" fill="none"/><text x="55" y="22">Volume (L)</text><text x="55" y="214">'+(preset==='fill'?'Incoming rate':'Net rate')+' (L/min)</text><path d="M55 '+y(capacity)+'H510" stroke="currentColor" stroke-dasharray="3 5"/><text x="330" y="'+(y(capacity)-8)+'">Capacity '+capacity+' L</text><path d="'+path('free')+'" fill="none" stroke="var(--study-muted)" stroke-width="2" stroke-dasharray="7 5"/><path d="'+path('volume')+'" fill="none" stroke="var(--study-warm)" stroke-width="4"/><path d="M55 '+ry(v115TankState(preset,0,capacity).rate)+'L505 '+ry(v115TankState(preset,4,capacity).rate)+'" fill="none" stroke="currentColor" stroke-width="3"/><path d="M55 '+ry(0)+'H510" stroke="currentColor" stroke-dasharray="3 5"/><path d="M'+x(t)+' 32V185M'+x(t)+' 220V330" stroke="var(--study-muted)" stroke-dasharray="2 4"/><circle cx="'+x(t)+'" cy="'+y(s.volume)+'" r="6" fill="var(--study-warm)"/><circle cx="'+x(t)+'" cy="'+ry(s.rate)+'" r="5" fill="currentColor"/>';
  for(let i=0;i<=4;i++)svg+='<text x="'+(x(i)-4)+'" y="351">'+i+'</text>';
  for(const v of [0,10,20])svg+='<text x="20" y="'+(y(v)+5)+'">'+v+'</text>';
  for(const v of [0,6])svg+='<text x="25" y="'+(ry(v)+5)+'">'+v+'</text>';
  svg+='<text x="210" y="373">Time (minutes)</text></svg>';
  $('projectTankGraph').innerHTML=v115SvgRegion(svg,'Scrollable tank graphs');
  $('projectTankReading').innerHTML='<p><strong>At '+v115Num(t)+' min:</strong> '+(preset==='fill'?'incoming':'net')+' rate = '+v115Num(s.rate)+' L/min. Water inside = '+v115Num(s.volume)+' L.</p><p>Initial water + accumulated net/incoming flow = '+v115Num(s.free)+' L. Overflow so far = '+v115Num(s.overflow)+' L.</p><p>Rate of change of water inside: '+(s.actualRate===null?'no single derivative at the filling corner':v115Num(s.actualRate)+' L/min')+'.</p><p>'+((preset==='fill'&&s.fillTime<=4)?'The tank fills at about '+v115Num(s.fillTime)+' min. Thereafter incoming and overflow rates match.':preset==='drain'?'The volume peaks at t = 3 min: 19 L. No overflow occurs in this interval.':'This tank does not fill during the four-minute interval.')+'</p><p class="project-legend">Solid purple: water inside. Dashed curve: the unrestricted amount; it may coincide with the solid curve. Dotted horizontal line: capacity. The lower graph is the stated flow rate. Displayed values are rounded to three decimal places when needed.</p>';
 };
 host.querySelectorAll('select,input').forEach(e=>e.addEventListener(e.tagName==='INPUT'?'input':'change',draw));draw();
}
function v115JourneyState(height,phase){
 const initial=2*10*height,approach=Math.sqrt(2*10*height),momentum=2*approach,shared=momentum/3,after=.5*3*shared*shared,other=initial-after,compression=Math.sqrt(2*after/48),force=48*compression;
 return {height,initial,approach,momentum,shared,after,other,compression,force,kinetic:phase==='hill'?initial:phase==='spring'||phase==='account'?0:after,elastic:phase==='spring'||phase==='account'?after:0,transferred:phase==='hill'?0:other};
}
function v115JourneyDiagram(s,phase){
 const spring=phase==='spring'||phase==='account',joined=phase!=='hill',front=spring?400+s.compression*120:355;
 let svg='<svg viewBox="0 0 550 205" role="img" aria-label="Stage sketch, not to scale: '+(phase==='hill'?'the 2 kilogram cart approaches the resting 1 kilogram cart.':spring?'the joined carts compress the wall-mounted spring.':'the carts have stuck together and move toward the spring.')+'"><path d="M20 32L145 120H525M525 58V140" fill="none" stroke="currentColor" stroke-width="3"/><path d="M38 45V120M31 45H45M31 120H45" stroke="currentColor"/><text x="48" y="88">'+v115Num(s.height)+' m</text>';
 const cart=(x,width,label)=>'<rect x="'+x+'" y="93" width="'+width+'" height="20" rx="3" fill="var(--study-panel)" stroke="currentColor"/><circle cx="'+(x+8)+'" cy="117" r="4" fill="currentColor"/><circle cx="'+(x+width-8)+'" cy="117" r="4" fill="currentColor"/><text x="'+(x+4)+'" y="86">'+label+'</text>';
 if(!joined){svg+=cart(220,50,'2 kg')+cart(280,35,'1 kg')+'<path d="M230 53H265L258 48M265 53L258 58" fill="none" stroke="currentColor" stroke-width="2"/><text x="195" y="30">'+v115Num(s.approach)+' m/s</text>'}else{svg+=cart(front-85,50,'2 kg')+cart(front-35,35,'1 kg');svg+='<text x="'+(front-95)+'" y="30">'+(spring?'Momentarily at rest':v115Num(s.shared)+' m/s →')+'</text>'}
 const springStart=spring?front:400,span=(520-springStart)/8;let path='M'+springStart+' 104';for(let i=1;i<=8;i++)path+='L'+(springStart+i*span)+' '+(i===8?104:i%2?94:114);svg+='<path d="'+path+'" fill="none" stroke="var(--study-warm)" stroke-width="2"/><text x="400" y="155">k = 48 N/m</text>';
 if(spring)svg+='<path d="M400 176H'+front+'M400 170V182M'+front+' 170V182" stroke="currentColor"/><text x="220" y="198">Compression x = '+v115Num(s.compression)+' m</text><path d="M'+front+' 58H'+(front-42)+'L'+(front-34)+' 53M'+(front-42)+' 58L'+(front-34)+' 63" fill="none" stroke="var(--study-warm)" stroke-width="2"/>';
 return svg+'</svg>';
}
function v115Journey(host,part){
 host.innerHTML='<h3>Keep the whole energy account visible</h3><div class="project-controls"><label>Starting height <select id="projectHeight"><option value="0.45">0.45 m</option><option value="0.8">0.80 m</option></select></label><label>Snapshot <select id="projectPhase"><option value="hill">At the bottom, before collision</option><option value="collision">Just after the carts stick</option><option value="spring">At maximum spring compression</option><option value="account">Final energy account</option></select></label></div><div id="projectJourneyGraph"></div><div id="projectJourneyReading" class="project-model-reading" role="status"></div><div class="project-table" role="region" tabindex="0" aria-label="Scrollable energy accounting table"><table><caption>Energy in this model (joules)</caption><thead><tr><th scope="col">Stage</th><th scope="col">Kinetic</th><th scope="col">Spring</th><th scope="col">Other</th><th scope="col">Total</th></tr></thead><tbody id="projectEnergyRows"></tbody></table></div>';
 $('projectHeight').value=String(part.height||.45);$('projectPhase').value=part.phase;
 const draw=()=>{
  const phase=$('projectPhase').value,height=Number($('projectHeight').value),s=v115JourneyState(height,phase),width=430,scale=width/s.initial;
  const stores=[['Kinetic',s.kinetic],['Spring',s.elastic],['Other',s.transferred]],colors=['var(--study-warm)','var(--study-ink)','var(--study-muted)'];
  let svg='<svg viewBox="0 0 550 255" role="img" aria-label="Energy: '+v115Num(s.kinetic)+' joules kinetic, '+v115Num(s.elastic)+' joules spring, '+v115Num(s.transferred)+' joules in other forms; total '+v115Num(s.initial)+' joules."><text x="55" y="30">Initial energy: '+v115Num(s.initial)+' J</text><rect x="55" y="45" width="430" height="15" fill="none" stroke="currentColor"/>';
  stores.forEach(([name,value],i)=>{svg+='<text x="55" y="'+(90+i*54)+'">'+name+': '+v115Num(value)+' J</text><rect class="energy-store" data-energy="'+name+'" x="55" y="'+(99+i*54)+'" width="'+value*scale+'" height="16" fill="'+colors[i]+'"/>'});svg+='</svg>';
  $('projectJourneyGraph').innerHTML=v115SvgRegion(v115JourneyDiagram(s,phase),'Scrollable cart and spring snapshot')+'<p class="project-legend">Snapshot sketch; distances are not drawn to scale. The bars below track energy. Displayed values are rounded to three decimal places when needed.</p>'+v115SvgRegion(svg,'Scrollable energy bars');
  const velocity=phase==='hill'?s.approach:phase==='collision'?s.shared:0;
  $('projectJourneyReading').innerHTML='<p><strong>'+escape($('projectPhase').selectedOptions[0].textContent)+':</strong> '+(velocity===0?'the joined 3 kg carts are momentarily at rest':(phase==='hill'?'the 2 kg cart':'the joined 3 kg carts')+' move'+(phase==='hill'?'s':'')+' at '+v115Num(velocity)+' m/s to the right')+'.</p><p>Approach speed = '+v115Num(s.approach)+' m/s. Shared speed after collision = '+v115Num(s.shared)+' m/s. Momentum before and just after the collision = +'+v115Num(s.momentum)+' kg·m/s.</p><p>Maximum spring compression = '+v115Num(s.compression)+' m. Force magnitude there = '+v115Num(s.force)+' N, directed left.</p><p>'+v115Num(s.kinetic)+' + '+v115Num(s.elastic)+' + '+v115Num(s.transferred)+' = '+v115Num(s.initial)+' J. '+(phase==='hill'?'The spring and collision have not yet taken energy.':'“Other” includes the collision’s deformation, thermal energy and sound; no split among those is specified.')+'</p><p>Momentum of the carts is conserved during the brief collision approximation. The wall-mounted spring then changes it; at maximum compression it is zero.</p>';
  $('projectEnergyRows').innerHTML=[['Before collision',s.initial,0,0],['After sticking',s.after,0,s.other],['Maximum compression',0,s.after,s.other]].map(([name,k,e,o])=>'<tr><th scope="row">'+name+'</th><td>'+v115Num(k)+'</td><td>'+v115Num(e)+'</td><td>'+v115Num(o)+'</td><td>'+v115Num(s.initial)+'</td></tr>').join('');
 };
 host.querySelectorAll('select').forEach(e=>e.onchange=draw);draw();
}
window.studyTableProjectModels={tank:v115TankState,journey:v115JourneyState};
