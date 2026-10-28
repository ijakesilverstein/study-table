// Read the same event schedule that playback uses. No microphone or performance grading.
function v127PianoRows(pattern){
 const epsilon=1e-7,step=pattern.subdivide===2?.5:1,meter=pattern.meter||4;
 const times=new Set([pattern.beats]);
 for(let t=0;t<pattern.beats;t+=step)times.add(t);
 for(const event of pattern.events){times.add(event.at);times.add(event.at+event.beats)}
 return [...times].filter(t=>t<=pattern.beats).sort((a,b)=>a-b).map(at=>{
  const start=pattern.events.filter(e=>Math.abs(e.at-at)<epsilon).map(e=>e.note);
  const keep=pattern.events.filter(e=>e.at<at-epsilon&&e.at+e.beats>at+epsilon).map(e=>e.note);
  const release=pattern.events.filter(e=>Math.abs(e.at+e.beats-at)<epsilon&&!start.includes(e.note)).map(e=>e.note);
  const beat=at%meter,whole=Math.floor(beat),fraction=beat-whole;
  const count=at===pattern.beats?'End':('Bar '+(Math.floor(at/meter)+1)+', '+(whole+1)+(fraction===.5?' and':fraction?' + '+fraction:''));
  const action=[release.length?'Release '+release.join(', ')+'.':'',start.length?'Press '+start.join(' + ')+'.':'',keep.length?'Keep '+keep.join(' + ')+' down.':'',!start.length&&!keep.length&&at<pattern.beats?'Silence; keep counting.':''].filter(Boolean).join(' ');
  return {at,count,action};
 });
}
function v127PianoTiming(host,pattern){
 const target=host.querySelector('[data-piano-timing]');if(!target)return;
 target.innerHTML='<details'+(pattern.beats<=4?' open':'')+'><summary>Follow the timing: '+escape(pattern.label)+'</summary><p>Press starts a note. Keep means leave that key down. Release ends it. The count continues through silence. C4 is middle C; the numbers in note names locate keys, not fingers.</p><table><caption>'+escape(pattern.label)+' · '+pattern.beats+' beats. Each numbered beat is one pulse; “and” is halfway to the next pulse.</caption><thead><tr><th scope="col">Count</th><th scope="col">What the fingers do</th></tr></thead><tbody>'+v127PianoRows(pattern).map(r=>'<tr data-piano-time="'+r.at+'"><th scope="row">'+escape(r.count)+'</th><td>'+escape(r.action)+'</td></tr>').join('')+'</tbody></table></details>';
}
function v127PianoMark(host,at){
 host.querySelectorAll('[data-piano-time]').forEach(row=>{if(Number(row.dataset.pianoTime)===at)row.setAttribute('aria-current','step');else row.removeAttribute('aria-current')});
}
