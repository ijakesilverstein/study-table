const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict'),data=require('../source/lesson-companions-v136.json');
(async()=>{let browser,server;const errors=[],url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8866/index.html';
 try{
  if(!process.env.STUDY_TEST_URL){server=spawn('python3',['-m','http.server','8866','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});let ready=false;for(let i=0;i<60;i++){try{if((await fetch(url)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}assert(ready,'Companion QA server unavailable')}
  browser=await chromium.launch(require('./browser-options.cjs'));const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(n=>READY&&studyTableFullCourses.version===n,Number(require('../package.json').version.split('.')[0]));
  const assessed={schema:1,records:{'piano-2':{attempts:5,independent:2,last:123}}};await page.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),assessed);
  const open=async(id)=>{await page.evaluate(([subject,id])=>studyTableFullCourses.open(subject,id),[data[id].subject,id]);await page.waitForFunction(id=>document.getElementById('frame')?.contentDocument?.querySelector('#courseArticle')?.dataset.unitId===id,id);return page.frames().find(f=>f.parentFrame()===page.mainFrame())};
  const model=async(f,id)=>f.locator('#'+data[id].case+' .v136-companion');
  let states=0,scans=0;
  for(const [id,d] of Object.entries(data)){
   const f=await open(id),host=await model(f,id),caseBox=f.locator('#'+d.case),before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
   assert.equal(await f.locator('.v136-companion').count(),1,'Exactly one companion in the intended case');assert(await host.isVisible());assert(await caseBox.locator('.solution').isVisible(),'Full worked teaching is visible before interaction');
   assert.equal(await host.getAttribute('data-v136-index'),String(d.scenes[0].initial));
   if(d.kind==='sentence'){assert.equal(await host.locator('.v136-sentence').innerText(),'Estoy aburrido.');assert.equal(await host.locator('.v136-sentence').getAttribute('lang'),'es');}
   for(let sceneIndex=0;sceneIndex<d.scenes.length;sceneIndex++){
    if(d.scenes.length>1)await host.locator('[data-v136-scene]').selectOption(String(sceneIndex));
    const scene=d.scenes[sceneIndex];assert.equal(await host.getAttribute('data-v136-index'),String(scene.initial));
    for(let index=0;index<scene.frames.length;index++){
     const frame=scene.frames[index],button=host.locator('[data-v136-points] [data-v136-step="'+index+'"]');await button.click();assert(await button.evaluate(b=>document.activeElement===b),'Inspecting a model must retain the control’s focus');
     assert.equal(await host.locator('[data-v136-heading]').innerText(),frame.heading);assert.equal(await host.locator('[data-v136-explanation]').innerText(),frame.explanation);assert.equal(await button.getAttribute('aria-pressed'),'true');
     assert.equal(await host.locator('[data-v136-points] [aria-pressed=true]').count(),1);
     if(d.kind==='piano'){assert.deepEqual(await host.locator('[data-v136-key][data-v136-active=true]').evaluateAll(keys=>keys.map(k=>k.dataset.v136Key)),frame.note?[frame.note]:[]);assert.match(await host.locator('[data-v136-meta]').innerText(),new RegExp('^'+frame.at+' seconds'));}
     if(d.kind==='sentence'){assert.equal(await host.locator('.v136-word:visible').count(),frame.shown);assert.equal(await host.locator('.v136-word-focus').count(),frame.focus===null?0:1);if(index===2)assert.equal(await host.locator('.v136-sentence').innerText(),frame.heading);}
     if(d.kind==='board')assert.deepEqual((await host.locator('[data-v136-attacker]').evaluateAll(lines=>lines.map(l=>l.dataset.v136Attacker))).sort(),[...frame.attackers].sort());
     assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));states++;
    }
   }
   // The optional retrieval mode hides these authored explanations and restores their state.
   const selected=await host.getAttribute('data-v136-index');await caseBox.locator('[data-guided-start]').click();assert.equal(await host.isVisible(),false);await caseBox.locator('[data-guided-exit]').click();assert(await host.isVisible());assert.equal(await host.getAttribute('data-v136-index'),selected);
   await host.locator('[data-v136-reset]').click();assert.equal(await host.getAttribute('data-v136-index'),'0');assert(await host.locator('[data-v136-prev]').isDisabled());
   await host.locator('[data-v136-next]').focus();for(let i=1;i<d.scenes.at(-1).frames.length;i++)await host.locator('[data-v136-next]').click();assert(await host.locator('[data-v136-next]').isDisabled());assert(await host.locator('[data-v136-points] [aria-pressed=true]').evaluate(b=>b===document.activeElement),'Last Next moves focus to the selected explanation rather than losing it');
   assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),before,'Exploration must not change saved progress or drafts');
   await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   const variants=d.kind==='piano'?[[1,6],[1,7],[1,8]]:d.kind==='sentence'?[[3,0],[3,1],[3,2]]:[[0,2],[0,4]];
   for(const width of [320,390]){await page.setViewportSize({width,height:844});for(const theme of ['light','dark']){await f.evaluate(t=>studyTableTheme.set(t),theme);for(const [sceneIndex,index] of variants){
    if(d.scenes.length>1)await host.locator('[data-v136-scene]').selectOption(String(sceneIndex));await host.locator('[data-v136-points] [data-v136-step="'+index+'"]').click();
    assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' overflow '+width+'/'+theme);
    const a=await f.evaluate(()=>axe.run({include:['.v136-companion']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),[],id+'/'+width+'/'+theme+'/'+index);scans++;
   }}}
   if(d.kind==='board'){
    await host.locator('[data-v136-square="a8"]').click();await page.keyboard.press('ArrowRight');assert(await host.locator('[data-v136-square="b8"]').evaluate(b=>b===document.activeElement));await page.keyboard.press('Enter');assert.equal(await host.getAttribute('data-v136-index'),'3');await page.keyboard.press('ArrowDown');await page.keyboard.press('Space');assert.equal(await host.getAttribute('data-v136-index'),'2');assert(await host.locator('[data-v136-square="b7"]').evaluate(b=>b===document.activeElement));
    assert((await host.locator('[data-v136-square="b7"]').boundingBox()).width>=24,'Board targets must meet 24px minimum alongside larger equivalent controls');
   }
   if(d.kind==='piano')await host.locator('[data-v136-points] [data-v136-step="7"]').click();await host.scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/study-v136-'+id+'-dark.png'});await f.evaluate(()=>studyTableTheme.set('light'));await page.screenshot({path:'/tmp/study-v136-'+id+'-light.png'});
   console.log('LESSON_COMPANION_PASS',id,d.scenes.length,'models; complete explanations, native controls, keyboard/focus, guided mode and mobile themes');
  }
  // Starting a manual inspection cancels scheduled and not-yet-resumed piano playback.
  let f=await open('piano-2'),host=await model(f,'piano-2');
  await f.evaluate(()=>{window.tones=[];window.AudioContext=class{constructor(){this.currentTime=0;this.destination={}}async resume(){if(window.deferAudio)return new Promise(resolve=>window.finishResume=resolve)}createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}createOscillator(){const tone={stops:[]};tones.push(tone);return {frequency:{set value(hz){tone.hz=hz}},connect(){},disconnect(){},start(at){tone.at=at},stop(at){tone.stops.push(at===undefined?'now':at)}}}}});
  await f.locator('[data-pattern="0"]').click();await f.waitForFunction(()=>tones.length===7);await host.locator('[data-v136-next]').click();assert((await f.evaluate(()=>tones)).every(t=>t.stops.includes('now')));assert.equal(await f.locator('.v109-demo .playing').count(),0);assert.equal(await f.locator('[data-piano-time][aria-current]').count(),0);assert.equal(await f.evaluate(()=>tones.length),7,'Manual model must not generate sound');
  await f.evaluate(()=>{tones=[];deferAudio=true});await f.locator('[data-pattern="0"]').click();await f.waitForFunction(()=>finishResume);await host.locator('[data-v136-reset]').click();await f.evaluate(()=>finishResume());assert.equal(await f.evaluate(()=>tones.length),0,'Late audio resume cannot play after switching to the manual model');
  // Keep written reasoning, cancel local dictation, and ignore late transcripts.
  const coach=f.locator('#courseSecond .worked-coach');await coach.locator('summary').first().click();await coach.locator('[data-coach-input]').fill('I am practising the join.');
  await f.evaluate(()=>{window.SpeechRecognition=class{constructor(){this.processLocally=false;window.companionRecognizer=this}static async available(){if(window.deferCompanionVoice)return new Promise(resolve=>window.finishCompanionVoice=resolve);return 'available'}start(){this.started=true}abort(){this.aborted=true}}});
  await coach.locator('[data-coach-mic]').click();await f.waitForFunction(()=>companionRecognizer.started);await host.locator('[data-v136-next]').click();assert(await f.evaluate(()=>companionRecognizer.aborted));await f.evaluate(()=>companionRecognizer.onresult({resultIndex:0,results:[Object.assign([{transcript:'late words'}],{isFinal:true})]}));assert.equal(await coach.locator('[data-coach-input]').inputValue(),'I am practising the join.');assert.match(await coach.locator('[data-coach-response]').innerText(),/Microphone stopped/);assert(await coach.locator('[data-coach-response]').isVisible());
  await f.evaluate(()=>deferCompanionVoice=true);await coach.locator('[data-coach-mic]').click();await f.waitForFunction(()=>finishCompanionVoice);await host.locator('[data-v136-reset]').click();await f.evaluate(()=>finishCompanionVoice('available'));assert.equal(await f.evaluate(()=>!!companionRecognizer.started),false,'A late local-model availability result cannot restart dictation');assert.match(await coach.locator('[data-coach-response]').innerText(),/Microphone stopped/);
  // A cancelled Spanish utterance cannot advance to another line after a phrase change.
  f=await open('descriptions');host=await model(f,'descriptions');await f.evaluate(()=>{window.spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};speechSynthesis.getVoices=()=>[{lang:'es-MX'}];speechSynthesis.speak=u=>{spoken.push(u.text);window.companionUtterance=u};speechSynthesis.cancel=()=>{}});await f.locator('[data-conversation=".85"]').click();assert.equal(await f.evaluate(()=>spoken.length),1);await host.locator('[data-v136-scene]').selectOption('2');await f.evaluate(()=>companionUtterance.onend());assert.equal(await f.evaluate(()=>spoken.length),1);
  // Invalid choices are ignored without leaking exceptions or modifying learner data.
  const heading=await host.locator('[data-v136-heading]').innerText();await host.evaluate(el=>{const b=document.createElement('button');b.dataset.v136Step='constructor';el.append(b);b.click();b.remove()});assert.equal(await host.locator('[data-v136-heading]').innerText(),heading);
  await page.context().setOffline(true);f=await open('chess-2');host=await model(f,'chess-2');await host.locator('[data-v136-square="b8"]').click();assert.match(await host.locator('[data-v136-heading]').innerText(),/queen/);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('studytable_v102_learning'))),assessed);assert.deepEqual(errors,[]);
  console.log('LESSON_COMPANIONS_BROWSER_PASS:',states,'authored views;',scans,'phone/theme WCAG scans; touch/keyboard, stable focus, before-attempt teaching, guided visibility, exact saved-state preservation, playback/local-dictation/late-audio cancellation, offline after load. No real playing or arbitrary reasoning grading claimed.');
 }finally{await browser?.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
