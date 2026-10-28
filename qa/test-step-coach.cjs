const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict'),data={...require('../source/step-coach-v128.json'),...require('../source/step-coach-v132.json')};
(async()=>{const browser=await chromium.launch(require('./browser-options.cjs')),p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const open=async id=>{
  const subject=data[id].subject;await p.evaluate(([subject,id])=>studyTableFullCourses.open(subject,id),[subject,id]);
  await p.waitForFunction(([subject,id])=>{const w=document.getElementById('frame')?.contentWindow;return w?.studyTableFullCourse?.subject===subject&&w.document.querySelector('#courseArticle h1')?.textContent===w.studyTableFullCourse.units.find(u=>u.id===id)?.title},[subject,id]);
  const f=p.frames().find(f=>f.parentFrame()===p.mainFrame());await f.locator('[data-step-coach]').click();await p.locator('#stepCoach').waitFor({state:'visible'});return f;
 };
 let server;try{
  const url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8843/index.html';
  if(!process.env.STUDY_TEST_URL){server=spawn('python3',['-m','http.server','8843','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});let ready=false;for(let i=0;i<60;i++){try{if((await fetch(url)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}if(!ready)throw Error('Checked-coach test server did not start')}
  await p.goto(url);await p.waitForFunction(n=>READY&&studyTableFullCourses.version===n&&studyTableStepCoach,Number(require('../package.json').version.split('.')[0]));
  const evidence={schema:1,records:{'piano-5':{attempts:2,independent:1,last:123}}};await p.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),evidence);
  for(const [id,scenario] of Object.entries(data)){
   const frame=await open(id),before=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
   assert.equal(await p.locator('#st128CoachTitle').innerText(),scenario.title);
   if(id==='count-exchanges')assert.equal(await frame.locator('#v109ChessLine').inputValue(),'1');
   // Teacher reasoning is always available before an attempt, and moving on is never gated.
   await p.locator('#st128CoachNext').click();assert.equal(await p.locator('#st128CoachPart').inputValue(),'1');await p.locator('#st128CoachPrevious').click();
   for(let i=0;i<3;i++){
    await p.locator('#st128CoachPart').selectOption(String(i));const step=scenario.steps[i];
    await p.locator('#st128CoachThinking').fill('I am unsure why this changes. <img src=x onerror=alert(1)>');
    assert.equal(await p.locator('#stepCoach img').count(),0);assert.equal(await p.locator('#st128CoachFeedback').innerText(),'');
    await p.locator('#st128CoachStuck').selectOption('0');assert.equal(await p.locator('#st128CoachHelp').innerText(),step.stuck[0][1]);
    await p.locator('#st128CoachWorked summary').click();assert.equal(await p.locator('#st128CoachWorked p').innerText(),step.reasoning);
    await p.locator('#st128CoachAnswer').fill(step.answer);await p.locator('#st128CoachCheck button').click();
    assert.equal(await p.locator('#st128CoachFeedback').getAttribute('data-feedback-kind'),'fits');assert.match(await p.locator('#st128CoachFeedback').innerText(),/That fits this step/);
    await p.locator('#st128CoachAnswer').fill('not an answer');assert.equal(await p.locator('#st128CoachFeedback').innerText(),'','Editing an answer must clear stale feedback');
   }
   assert.deepEqual(await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),before,'Coaching must not write or score any saved work');
   await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});for(const width of [320,390]){await p.setViewportSize({width,height:844});for(const theme of ['light','dark']){
    await p.evaluate(t=>studyTableTheme.set(t),theme);assert(await p.locator('#stepCoach').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
    const wrong={'piano-5':'E4','noun-phrases':'dos mesas pequeños','count-exchanges':'2','product-rule':'4','physics-2':'64','rests-and-halves':'1','spanish-5':'no','castling':'g1'};
    for(const value of [scenario.steps[2].answer,wrong[id],'another way to say it']){
     await p.locator('#st128CoachAnswer').fill(value);await p.locator('#st128CoachCheck button').click();
     const a=await p.evaluate(()=>axe.run({include:['#stepCoach']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],id+'/'+width+'/'+theme+'/'+value);
    }
   }}
   const themed=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
   for(let n=0;n<18;n++){await p.keyboard.press('Tab');const allowed=await p.evaluate(()=>!!document.activeElement.closest('#stepCoach')||(document.activeElement===document.body&&document.getElementById('stepCoach').matches(':modal')));assert(allowed,'Tab must not focus a background control')}
   await p.locator('#st128CoachClose').focus();await p.keyboard.press('Escape');assert.equal(await p.locator('#stepCoach').evaluate(e=>e.open),false);assert(await frame.locator('[data-step-coach]').evaluate(e=>e===document.activeElement));assert.deepEqual(await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),themed);
  }
  let f=await open('physics-2');await p.locator('#st128CoachPart').selectOption('2');await p.locator('#st128CoachAnswer').fill('64');await p.locator('#st128CoachCheck button').click();assert.match(await p.locator('#st128CoachFeedback').innerText(),/found v²/);
  await p.locator('#st128CoachAnswer').fill('8 J');await p.locator('#st128CoachCheck button').click();assert.equal(await p.locator('#st128CoachFeedback').getAttribute('data-feedback-kind'),'compare');assert.match(await p.locator('#st128CoachFeedback').innerText(),/metres per second/);
  // Unavailable and downloadable models never start recognition or silently use a remote service.
  await p.evaluate(()=>{window.starts=[];window.availableRequests=[];window.voiceState='downloadable';Object.defineProperty(window,'SpeechRecognition',{configurable:true,value:class{
   constructor(){this.processLocally=false;window.latestRecognition=this}
   static async available(options){availableRequests.push(options);if(window.waitForVoice)return new Promise(resolve=>window.finishAvailability=resolve);return voiceState}
   start(){starts.push({local:this.processLocally,language:this.lang})}
   abort(){this.aborted=true}
  }})});
  await p.locator('#st128CoachVoice').click();await p.waitForFunction(()=>document.getElementById('st128CoachVoiceStatus').textContent.includes('not ready'));assert.equal(await p.evaluate(()=>starts.length),0);
  await p.evaluate(()=>voiceState='available');await p.locator('#st128CoachThinking').fill('My calculation:');await p.locator('#st128CoachVoice').click();await p.waitForFunction(()=>starts.length===1);
  assert.deepEqual(await p.evaluate(()=>starts),[{local:true,language:'en-US'}]);assert((await p.evaluate(()=>availableRequests)).every(r=>r.processLocally===true));
  await p.evaluate(()=>latestRecognition.onresult({resultIndex:0,results:[Object.assign([{transcript:'I need the square root of sixty four.'}],{isFinal:true})]}));
  assert.match(await p.locator('#st128CoachThinking').inputValue(),/My calculation:\nI need the square root/);assert.equal(await p.locator('#st128CoachAnswer').inputValue(),'8 J','Dictation belongs to thinking notes, not an automatically graded answer');
  await p.locator('#st128CoachPart').selectOption('1');assert(await p.evaluate(()=>latestRecognition.aborted));
  const note=await p.locator('#st128CoachThinking').inputValue();await p.evaluate(()=>latestRecognition.onresult({resultIndex:0,results:[Object.assign([{transcript:'late words'}],{isFinal:true})]}));assert.equal(await p.locator('#st128CoachThinking').inputValue(),note,'Late voice results must not leak to another part');
  await p.locator('#st128CoachPart').selectOption('2');assert.match(await p.locator('#st128CoachThinking').inputValue(),/square root/);
  // Closing while model availability is pending cannot open the microphone later.
  await p.evaluate(()=>waitForVoice=true);await p.locator('#st128CoachVoice').click();await p.waitForFunction(()=>finishAvailability);await p.locator('#st128CoachClose').click();await p.evaluate(()=>finishAvailability('available'));assert.equal(await p.evaluate(()=>starts.length),1);
  await open('physics-2');await p.locator('#st128CoachPart').selectOption('2');assert.match(await p.locator('#st128CoachThinking').inputValue(),/square root/);await p.locator('#st128CoachAnswer').fill('8');await p.locator('#st128CoachCheck button').click();
  await p.evaluate(()=>studyTableTheme.set('light'));await p.locator('#st128CoachFeedback').scrollIntoViewIfNeeded();await p.screenshot({path:'/tmp/study-v128-coach-light.png'});await p.evaluate(()=>studyTableTheme.set('dark'));await p.screenshot({path:'/tmp/study-v128-coach-dark.png'});
  await p.locator('#st128CoachClose').click();await p.evaluate(()=>window.postMessage({type:'study-open-step-coach',subject:'physics',unit:'physics-2'},'*'));await p.waitForTimeout(50);assert.equal(await p.locator('#stepCoach').evaluate(e=>e.open),false,'Messages from the parent itself must not impersonate a course iframe');
  await p.context().setOffline(true);await open('noun-phrases');await p.locator('#st128CoachPart').selectOption('1');await p.locator('#st128CoachAnswer').fill('Quiero dos café pequeños');await p.locator('#st128CoachCheck button').click();assert.match(await p.locator('#st128CoachFeedback').innerText(),/plural cafés/);
  await p.locator('#st128CoachAnswer').fill('Quiero dos cafés pequeños, por favor.');await p.locator('#st128CoachCheck button').click();assert.equal(await p.locator('#st128CoachFeedback').getAttribute('data-feedback-kind'),'fits');
  assert.deepEqual(await p.evaluate(()=>studyTableV102.getProgress()),evidence);assert.deepEqual(errors,[]);
  console.log('STEP_COACH_BROWSER_PASS: eight actual lesson entry points, twenty-four decisions with targeted checks/help/complete teacher reasoning; no quiz gate or saved-state writes; session notes; 96 mobile/both-theme/result-state WCAG axe scans; keyboard focus/Escape; local-only speech and pending/late-result cancellation mocked; offline after load. No real microphone or arbitrary reasoning grading claimed.');
 }finally{await browser.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
