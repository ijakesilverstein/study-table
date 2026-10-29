// Authored, manual visual explanations. No timers, sound generation, grading or storage.
const V136_COMPANIONS=__LESSON_COMPANIONS__;
function v136Record(id){return Object.prototype.hasOwnProperty.call(V136_COMPANIONS,id)?V136_COMPANIONS[id]:null}
function v136Prefix(id,caseId){return 'v136-'+id+'-'+caseId}
function v136PianoPicture(frame,prefix){
 const notes=['C4','D4','E4'];let keys='';
 notes.forEach((note,i)=>{const active=frame.note===note;keys+='<rect x="'+(i*100)+'" y="2" width="99" height="153" rx="3" fill="'+(active?'#e0d5fa':'#fff')+'" stroke="'+(active?'#6d45ae':'#74747e')+'" stroke-width="'+(active?'3':'1')+'"'+(active&&frame.action==='hold'?' stroke-dasharray="7 4"':'')+' data-v136-key="'+note+'" data-v136-active="'+active+'"/><text x="'+(i*100+50)+'" y="137" text-anchor="middle" fill="#222228" font-size="23">'+note+'</text>'});
 keys+='<rect x="70" y="2" width="59" height="91" rx="3" fill="#222228"/><rect x="170" y="2" width="59" height="91" rx="3" fill="#222228"/>';
 const description=frame.note?frame.heading+' '+(frame.finger?'Right-hand finger: '+frame.finger+'.':''):'All three keys are released.';
 return '<svg class="v136-keyboard" viewBox="-2 0 304 160" role="img" aria-labelledby="'+prefix+'-image-title"><title id="'+prefix+'-image-title">'+escape(description)+'</title><g font-family="system-ui">'+keys+'</g></svg>';
}
function v136BoardPicture(record,frame,prefix){
 const rows=record.fen.split(' ')[0].split('/');let cells='',pieces='';
 const marks=frame.target?[frame.target]:(frame.marks||[]);
 for(let row=0;row<8;row++){
  for(let col=0;col<8;col++){const square='abcdefgh'[col]+(8-row),x=24+col*40,y=8+row*40;cells+='<rect x="'+x+'" y="'+y+'" width="40" height="40" fill="'+((row+col)%2?'#bcbcc7':'#f0f0f4')+'"/>'+(marks.includes(square)?'<rect x="'+(x+2)+'" y="'+(y+2)+'" width="36" height="36" fill="none" stroke="#6d45ae" stroke-width="3" stroke-dasharray="5 3"/>':'')}
  let col=0;for(const char of rows[row]){if(/[1-8]/.test(char)){col+=Number(char);continue}const white=char===char.toUpperCase(),x=44+col*40,y=28+row*40;pieces+='<circle cx="'+x+'" cy="'+y+'" r="15" fill="'+(white?'#fff':'#242428')+'" stroke="'+(white?'#242428':'#fff')+'" stroke-width="1.5"/><text x="'+x+'" y="'+(y+7)+'" text-anchor="middle" font-size="23" font-family="system-ui" fill="'+(white?'#242428':'#fff')+'">'+escape(char.toUpperCase())+'</text>';col++}
 }
 const center=s=>[44+'abcdefgh'.indexOf(s[0])*40,28+(8-Number(s[1]))*40];
 const arrows=(frame.attackers||[]).map(s=>{const [x1,y1]=center(s),[x2,y2]=center(frame.target);return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#6d45ae" stroke-width="3" marker-end="url(#'+prefix+'-arrow)" data-v136-attacker="'+s+'"/>'}).join('');
 const labels=Array.from({length:8},(_,i)=>'<text x="'+(44+i*40)+'" y="351" text-anchor="middle">'+'abcdefgh'[i]+'</text><text x="12" y="'+(34+i*40)+'" text-anchor="middle">'+(8-i)+'</text>').join('');
 return '<svg viewBox="0 0 360 360" role="img" aria-labelledby="'+prefix+'-image-title"><title id="'+prefix+'-image-title">'+escape(record.position+' '+frame.heading)+'</title><defs><marker id="'+prefix+'-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#6d45ae"/></marker></defs>'+cells+arrows+pieces+'<g font-family="system-ui" font-size="15" fill="currentColor">'+labels+'</g></svg>';
}
function v136SentencePicture(scene,frame){
 return '<p class="v136-sentence" lang="es">'+scene.parts.map((part,i)=>'<span'+(i>=frame.shown?' hidden':'')+' class="v136-word'+(frame.focus===i?' v136-word-focus':'')+'">'+escape(part.word)+'</span>').join(' ')+(frame.shown===scene.parts.length?'.':'…')+'</p><dl class="v136-word-jobs">'+scene.parts.map((part,i)=>'<div'+(i>=frame.shown?' hidden':'')+'><dt lang="es">'+escape(part.word)+'</dt><dd>'+escape(part.job)+'</dd></div>').join('')+'</dl>';
}
function v136Picture(record,scene,frame,prefix){return record.kind==='piano'?v136PianoPicture(frame,prefix):record.kind==='board'?v136BoardPicture(record,frame,prefix):v136SentencePicture(scene,frame)}
function v136BoardTargets(record){return '<div class="v136-board-targets" role="group" aria-label="Inspect the king’s square and three neighboring squares">'+Object.entries(record.targets).map(([square,index])=>{const x=24+'abcdefgh'.indexOf(square[0])*40,y=8+(8-Number(square[1]))*40;return '<button type="button" class="v136-board-hit" style="left:'+x/3.6+'%;top:'+y/3.6+'%" data-v136-square="'+square+'" data-v136-step="'+index+'" aria-label="Inspect '+square+'" aria-pressed="'+(index===0)+'" title="Inspect '+square+'"></button>'}).join('')+'</div>'}
function v136Points(scene,index){return scene.frames.map((frame,i)=>'<button type="button" data-v136-step="'+i+'" aria-pressed="'+(index===i)+'">'+escape(frame.label)+'</button>').join('')}
function v136Meta(record,frame){return record.kind==='piano'?frame.at+' seconds from this model’s first note at 60 BPM.'+(frame.finger?' Finger: '+frame.finger+'.':''):record.kind==='board'?record.position:''}
function v136Companion(unit,caseId){
 const record=v136Record(unit.id);if(!record||record.case!==caseId)return '';
 const scene=record.scenes[0],index=scene.initial,frame=scene.frames[index],prefix=v136Prefix(unit.id,caseId);
 const selector=record.scenes.length>1?'<label for="'+prefix+'-scene">'+escape(record.sceneLabel)+'</label><select id="'+prefix+'-scene" data-v136-scene>'+record.scenes.map((s,i)=>'<option value="'+i+'">'+escape(s.label)+'</option>').join('')+'</select>':'';
 const image='<div data-v136-picture>'+v136Picture(record,scene,frame,prefix)+'</div>';
 const graphic=record.kind==='board'?'<div class="v136-board-scroll" tabindex="0" role="region" aria-label="Stalemate diagram"><div class="v136-board">'+image+v136BoardTargets(record)+'</div></div>':image;
 return '<section class="v136-companion" data-v136-unit="'+unit.id+'" data-v136-case="'+caseId+'" data-v136-scene-index="0" data-v136-index="'+index+'" aria-labelledby="'+prefix+'-title"><h3 id="'+prefix+'-title">'+escape(record.title)+'</h3><p>'+escape(record.intro)+'</p>'+selector+'<p data-v136-intro>'+escape(scene.intro)+'</p>'+graphic+'<div class="v136-points" role="group" aria-label="Choose an explanation" data-v136-points>'+v136Points(scene,index)+'</div><div class="v136-narration" role="status" aria-live="polite" aria-atomic="true"><h4 data-v136-heading'+(record.kind==='sentence'&&index===scene.frames.length-1?' lang="es"':'')+'>'+escape(frame.heading)+'</h4><p data-v136-explanation>'+escape(frame.explanation)+'</p><p class="v136-meta" data-v136-meta'+(record.kind==='sentence'?' hidden':'')+'>'+escape(v136Meta(record,frame))+'</p></div><div class="v136-navigation"><button type="button" data-v136-prev'+(index===0?' disabled':'')+'>Previous</button><button type="button" data-v136-next'+(index===scene.frames.length-1?' disabled':'')+'>Next</button><button type="button" data-v136-reset>'+escape(record.resetLabel)+'</button></div></section>';
}
function v136Select(host,index,sceneIndex=Number(host.dataset.v136SceneIndex)){
 const record=v136Record(host.dataset.v136Unit),scene=record?.scenes[sceneIndex];
 if(!host.isConnected||!record||record.case!==host.dataset.v136Case||!Number.isInteger(sceneIndex)||sceneIndex<0||!scene||!Number.isInteger(index)||index<0||index>=scene.frames.length)return false;
 const frame=scene.frames[index],prefix=v136Prefix(host.dataset.v136Unit,host.dataset.v136Case),changedScene=sceneIndex!==Number(host.dataset.v136SceneIndex);
 v127StopCoaching();v109StopMedia();
 if($('v109PianoStatus'))$('v109PianoStatus').textContent='Written model selected. Use the playback controls above to hear the tune again.';
 if($('v109SpeechStatus'))$('v109SpeechStatus').textContent='Written model selected. Use the lesson’s audio controls when you want to listen.';
 host.dataset.v136Index=String(index);host.dataset.v136SceneIndex=String(sceneIndex);
 if(changedScene)host.querySelector('[data-v136-points]').innerHTML=v136Points(scene,index);
 host.querySelectorAll('[data-v136-step]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.v136Step)===index)));
 host.querySelector('[data-v136-picture]').innerHTML=v136Picture(record,scene,frame,prefix);
 host.querySelector('[data-v136-intro]').textContent=scene.intro;
 const heading=host.querySelector('[data-v136-heading]');heading.textContent=frame.heading;
 if(record.kind==='sentence'&&index===scene.frames.length-1)heading.lang='es';else heading.removeAttribute('lang');
 host.querySelector('[data-v136-explanation]').textContent=frame.explanation;
 host.querySelector('[data-v136-meta]').textContent=v136Meta(record,frame);
 host.querySelector('[data-v136-prev]').disabled=index===0;
 host.querySelector('[data-v136-next]').disabled=index===scene.frames.length-1;
 const focused=document.activeElement;if(host.contains(focused)&&focused.disabled)host.querySelector('[data-v136-points] [data-v136-step="'+index+'"]').focus({preventScroll:true});
 return true;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button[data-v136-step],button[data-v136-prev],button[data-v136-next],button[data-v136-reset]');if(!button||button.disabled)return;
 const host=button.closest('.v136-companion');if(!host)return;const record=v136Record(host.dataset.v136Unit),scene=record?.scenes[Number(host.dataset.v136SceneIndex)];if(!scene)return;
 const at=Number(host.dataset.v136Index),index=button.hasAttribute('data-v136-step')?Number(button.dataset.v136Step):button.hasAttribute('data-v136-prev')?at-1:button.hasAttribute('data-v136-next')?at+1:0;v136Select(host,index);
});
document.addEventListener('change',event=>{
 const select=event.target.closest('select[data-v136-scene]');if(!select)return;const host=select.closest('.v136-companion'),record=host&&v136Record(host.dataset.v136Unit),index=Number(select.value);const scene=record?.scenes[index];if(scene)v136Select(host,scene.initial,index);
});
document.addEventListener('keydown',event=>{
 const button=event.target.closest('button[data-v136-square]'),delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[event.key];if(!button||!delta)return;
 event.preventDefault();const square=button.dataset.v136Square,file='abcdefgh'.indexOf(square[0])+delta[0],rank=Number(square[1])+delta[1];if(file<0||file>7||rank<1||rank>8)return;
 button.closest('.v136-board-targets').querySelector('[data-v136-square="'+'abcdefgh'[file]+rank+'"]')?.focus({preventScroll:true});
});
