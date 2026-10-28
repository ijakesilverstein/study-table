const {chromium}=require('playwright'),assert=require('assert/strict'),courses=require('../source/full-courses-built.json');
const fs=require('fs'),vm=require('vm');
const model={};vm.createContext(model);vm.runInContext(fs.readFileSync('source/piano-coach-v127.js','utf8'),model);
const rows=pattern=>JSON.parse(JSON.stringify(model.v127PianoRows(pattern)));
// Expected finger actions are specified independently of the row renderer.
assert.deepEqual(rows({beats:4,events:[{note:'C3',at:0,beats:4},{note:'E4',at:0,beats:1},{note:'D4',at:1,beats:1},{note:'C4',at:2,beats:1},{note:'D4',at:3,beats:1}]}).map(r=>r.action),[
 'Press C3 + E4.','Release E4. Press D4. Keep C3 down.','Release D4. Press C4. Keep C3 down.','Release C4. Press D4. Keep C3 down.','Release C3, D4.'
]);
assert.deepEqual(rows({beats:2,events:[{note:'C4',at:0,beats:1},{note:'C4',at:1,beats:1}]}).map(r=>r.action),['Press C4.','Press C4.','Release C4.']);
(async()=>{const browser=await chromium.launch(require('./browser-options.cjs')),p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const open=async(id)=>{await p.evaluate(id=>studyTableFullCourses.open('piano',id),id);await p.waitForFunction(id=>{const w=document.getElementById('frame')?.contentWindow;return w?.studyTableFullCourse?.subject==='piano'&&w.document.querySelector('#courseArticle h1')?.textContent===w.studyTableFullCourse.units.find(u=>u.id===id)?.title},id);return p.frames().find(f=>f.parentFrame()===p.mainFrame())};
 const mock=async f=>f.evaluate(()=>{window.notes=[];window.AudioContext=class{constructor(){this.currentTime=0;this.destination={}}async resume(){}createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}createOscillator(){const record={stops:[]};notes.push(record);return {frequency:{set value(value){record.hz=value}},connect(){},disconnect(){},start(at){record.at=at},stop(at){record.stops.push(at===undefined?'immediate':at)}}}}});
 const clear=async f=>f.evaluate(()=>notes=[]);
 try{
  await p.goto(process.env.STUDY_TEST_URL||'http://127.0.0.1:8771/index.html');await p.waitForFunction(()=>READY&&studyTableFullCourses);
  const evidence={schema:1,records:{'piano-5':{attempts:3,independent:1,last:321}}};await p.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),evidence);
  let f=await open('piano-5');await mock(f);
  assert.equal(await f.locator('#v109Tempo').inputValue(),'60');assert(await f.locator('#v109Tempo option[value="40"]').count());
  await f.locator('[data-pattern="2"]').click();await f.waitForFunction(()=>notes.length===5);
  assert.deepEqual(await f.evaluate(()=>notes.map(n=>n.at)),[.04,.04,1.04,2.04,3.04]);
  assert.equal(await f.locator('[data-piano-time="1"] td').textContent(),'Release E4. Press D4. Keep C3 down.');
  await f.waitForFunction(()=>document.querySelector('[data-piano-time="1"]')?.getAttribute('aria-current')==='step');
  assert(await f.locator('[data-v109-note="C3"]').evaluate(e=>e.classList.contains('playing')));
  await f.locator('[data-stop]').click();assert.equal(await f.locator('[data-piano-time][aria-current]').count(),0);
  assert((await f.evaluate(()=>notes)).every(n=>n.stops.includes('immediate')));
  // Explicit count-in and pulse: eight clicks and five notes. 40 BPM means 1.5 s per beat.
  await f.locator('#v109Tempo').selectOption('40');await f.locator('[data-piano-lead]').selectOption('bar');await f.locator('[data-piano-pulse]').selectOption('on');await clear(f);await f.locator('[data-pattern="2"]').click();
  await f.waitForFunction(()=>notes.length===13);let events=await f.evaluate(()=>notes);
  assert.deepEqual(events.slice(0,8).map(n=>n.at),[.04,1.54,3.04,4.54,6.04,7.54,9.04,10.54]);
  assert.deepEqual(events.slice(8).map(n=>n.at),[6.04,6.04,7.54,9.04,10.54]);
  assert(Math.abs(events[8].stops[0]-11.86)<1e-9,'The low C must last four beats at 40 BPM');
  assert(Math.abs(events[9].stops[0]-7.495)<1e-9,'The right E lasts one beat at 40 BPM');
  await f.locator('[data-piano-pulse]').selectOption('off');assert((await f.evaluate(()=>notes)).every(n=>n.stops.includes('immediate')));
  // Individual keys remain immediate, with no count-in or pulse and no replacement of the score.
  await clear(f);await f.locator('[data-v109-note="C3"]').click();await f.waitForFunction(()=>notes.length===1);assert.equal(await f.evaluate(()=>notes[0].at),.04);
  assert.match(await f.locator('[data-piano-timing] caption').textContent(),/Both hands together/);
  f=await open('three-beats');await mock(f);await f.locator('[data-piano-lead]').selectOption('bar');await f.locator('[data-piano-pulse]').selectOption('on');await f.locator('[data-pattern="0"]').click();
  await f.waitForFunction(()=>notes.length>9);events=await f.evaluate(()=>notes);const clicks=events.filter(n=>[660,880].includes(n.hz)),tones=events.filter(n=>![660,880].includes(n.hz));
  assert.deepEqual(clicks.map(n=>n.hz),[880,660,660,880,660,660,880,660,660]);assert.equal(tones[0].at,3.04);
  await f.locator('[data-stop]').click();
  f=await open('rests-and-halves');await mock(f);await f.locator('[data-pattern="1"]').click();await f.waitForFunction(()=>notes.length>=4);
  events=(await f.evaluate(()=>notes)).filter(n=>![660,880].includes(n.hz));assert.deepEqual(events.map(n=>n.at),[.04,.54,1.04,3.04]);
  assert.match(await f.locator('[data-piano-time="2"] td').textContent(),/Release E4\. Silence; keep counting\./);
  assert.equal(await f.locator('[data-piano-time="0.5"] th').textContent(),'Bar 1, 1 and');
  await f.locator('[data-stop]').click();await f.evaluate(()=>{AudioContext.prototype.resume=()=>new Promise(resolve=>window.finishResume=resolve);notes=[]});await f.locator('[data-pattern="1"]').click();await f.waitForFunction(()=>window.finishResume);
  await f.locator('[data-piano-lead]').selectOption('bar');await f.evaluate(()=>finishResume());assert.equal(await f.evaluate(()=>notes.length),0);
  // Missing Web Audio still leaves the selected, complete timing available.
  f=await open('rests-and-halves');await f.evaluate(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined});await f.locator('[data-pattern="1"]').click();assert.match(await f.locator('#v109PianoStatus').innerText(),/unavailable/);assert.equal(await f.locator('[data-piano-time]').count(),9);
  await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});for(const width of [320,390]){await p.setViewportSize({width,height:844});for(const theme of ['light','dark']){await f.evaluate(t=>studyTableTheme.set(t),theme);assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const a=await f.evaluate(()=>axe.run({include:['#courseDemo']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);}}
  await f.locator('#courseDemo').screenshot({path:'/tmp/study-v127-piano-coach.png'});
  await p.context().setOffline(true);f=await open('piano-5');assert(await f.locator('[data-piano-timing] table').isVisible());
  assert.deepEqual(await p.evaluate(()=>studyTableV102.getProgress()),evidence);assert.deepEqual(errors,[]);
  console.log('PIANO_COACH_PASS: exact two-hand and subdivision timing; slower playback; four- and three-beat count-ins and pulse accents; individual keys immediate; held-note highlights; stops/settings/delayed-resume cancellation; audio fallback; mobile/both-theme axe; offline after load; assessment unchanged.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
