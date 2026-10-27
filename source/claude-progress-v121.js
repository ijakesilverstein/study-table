/* V119: per-unit progress and self-assessed recall. Stored locally, never sent anywhere. */
const V119_KEY='studytable:full-course:'+JSON.parse(document.getElementById('full-course-data').textContent).subject+':progress';
let v119Current=null;
function v119Read(){try{const raw=JSON.parse(localStorage.getItem(V119_KEY)||'{}'),out=Object.create(null);if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;for(const u of COURSE.units){const v=Object.prototype.hasOwnProperty.call(raw,u.id)&&raw[u.id];if(v&&typeof v==='object'&&!Array.isArray(v))out[u.id]={seen:v.seen===true||['ok','review'].includes(v.recall),recall:['ok','review'].includes(v.recall)?v.recall:''}}return out}catch{return Object.create(null)}}
function v119Write(o){try{localStorage.setItem(V119_KEY,JSON.stringify(o));return true}catch{return false}}
function v119Entry(id){const o=v119Read();return Object.prototype.hasOwnProperty.call(o,id)&&o[id]&&typeof o[id]==='object'?o[id]:{}}
function v119Mark(id,patch){if(!byId.has(id))return;const o=v119Read();o[id]=Object.assign({},v119Entry(id),patch);const saved=v119Write(o);v119Paint();return saved}
function v119State(id){const e=v119Entry(id);return e.recall==='review'?'review':e.recall==='ok'?'ok':e.seen?'seen':''}
const V119_WORDS={seen:'opened',ok:'you marked this understood',review:'you marked this for another look'};
function v119Paint(){
 document.querySelectorAll('#courseContentsList [data-course-unit]').forEach(b=>{
  const st=v119State(b.dataset.courseUnit);
  if(st)b.setAttribute('data-v119',st);else b.removeAttribute('data-v119');
  let sr=b.querySelector('.v119-sr');
  if(!sr){sr=document.createElement('span');sr.className='v119-sr';b.append(sr)}
  sr.textContent=st?(' — '+V119_WORDS[st]):'';
 });
 const host=document.getElementById('v119Summary');
 if(host){host.innerHTML=v119SummaryHTML();v119WireSummary()}
}
function v119SummaryHTML(){
 const st=v119Read(),total=COURSE.units.length;
 const opened=COURSE.units.filter(u=>v119Entry(u.id).seen).length;
 const ok=COURSE.units.filter(u=>v119Entry(u.id).recall==='ok').length;
 const review=COURSE.units.filter(u=>v119Entry(u.id).recall==='review');
 if(!opened)return '<h2>Your reading and review</h2><p class="v119-empty">Nothing opened yet. As you read, this panel tracks which units you have been through and which ones you marked for another look. It is kept in this browser. Opened means visited; self-ratings are personal review notes, separate from assessed skills.</p>';
 const pct=Math.round(opened/total*100);
 let h='<h2>Your reading and review</h2><p class="v119-count"><strong>'+opened+' of '+total+'</strong> units opened'+(ok?' · '+ok+' self-marked understood':'')+(review.length?' · '+review.length+' to revisit':'')+'</p>'+
  '<div class="v119-bar"><span style="width:'+pct+'%"></span></div><p class="v119-sr-note">'+opened+' of '+total+' units opened ('+pct+' per cent).</p>';
 if(review.length)h+='<p class="v119-review-label">Worth another look</p><ul class="v119-review">'+review.map(u=>'<li><button type="button" data-course-unit="'+u.id+'">Unit '+(COURSE.units.indexOf(u)+1)+': '+escape(u.title)+'</button></li>').join('')+'</ul>';
 h+='<p class="v119-reset"><button type="button" class="text-button" id="v119Reset">Reset progress for this course</button></p>';
 return h;
}
function v119WireSummary(){
 document.querySelectorAll('#v119Summary [data-course-unit]').forEach(b=>b.onclick=()=>showUnit(b.dataset.courseUnit));
 const r=document.getElementById('v119Reset');
 if(r)r.onclick=()=>{if(confirm('Clear the progress record for this course? Your place in the course and your notes are not affected.')){v119Write({});v119Paint()}};
}
function v119SummaryBlock(){return '<section class="v119-progress" id="v119Summary" aria-label="Your reading and personal review"></section>'}
function v119SelfCheck(unit){
 const r=v119Entry(unit.id).recall||'';
 return '<div class="v119-selfcheck"><p id="v119SelfLabel">Once you have tried both, how did it go?</p>'+
  '<div class="v119-selfbuttons" role="group" aria-labelledby="v119SelfLabel">'+
  '<button type="button" data-v119-mark="ok" aria-pressed="'+(r==='ok')+'">I had it</button>'+
  '<button type="button" data-v119-mark="review" aria-pressed="'+(r==='review')+'">Needs another look</button>'+
  '</div><p class="v119-selfstate" role="status">'+(r==='ok'?'You marked this understood; this is a self-assessment, not a mastery score.':r==='review'?'Added to “worth another look” on the course map.':'Nothing recorded for this unit yet.')+'</p></div>';
}
function v119WireSelfCheck(){
 document.querySelectorAll('[data-v119-mark]').forEach(b=>b.onclick=()=>{
  const want=b.dataset.v119Mark,cur=v119Entry(v119Current).recall||'',next=cur===want?'':want;
  const saved=v119Mark(v119Current,{recall:next});
  document.querySelectorAll('[data-v119-mark]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.v119Mark===next)));
  const s=document.querySelector('.v119-selfstate');
  if(s)s.textContent=!saved?'This browser could not save your review note.':next==='ok'?'You marked this understood; this is a self-assessment, not a mastery score.':next==='review'?'Added to “worth another look” on the course map.':'Cleared — nothing recorded for this unit.';
 });
}

