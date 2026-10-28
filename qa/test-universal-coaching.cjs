const {chromium}=require('playwright'),assert=require('assert/strict'),courses=require('../source/full-courses-built.json');
(async()=>{const browser=await chromium.launch(require('./browser-options.cjs')),p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const open=async(subject,id)=>{await p.evaluate(([s,id])=>studyTableFullCourses.open(s,id),[subject,id]);await p.waitForFunction(([s,id])=>{const w=document.getElementById('frame')?.contentWindow;return w?.studyTableFullCourse?.subject===s&&w.document.querySelector('#courseArticle h1')?.textContent===w.studyTableFullCourse.units.find(u=>u.id===id)?.title},[subject,id]);return p.frames().find(f=>f.parentFrame()===p.mainFrame())};
 try{
  await p.goto(process.env.STUDY_TEST_URL||'http://127.0.0.1:8807/index.html');await p.waitForFunction(n=>READY&&studyTableFullCourses.version===n,Number(require('../package.json').version.split('.')[0]));
  for(const [subject,course] of Object.entries(courses)){
   const f=await open(subject,course.units[0].id);await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   for(const id of ['courseFirst','courseSecond']){
    const coach=f.locator('#'+id+' .worked-coach');await coach.locator('summary').first().click();
    const before=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
    await coach.locator('[data-coach-input]').fill('My first thought');await coach.locator('[data-mastery="compare"]').click();
    await coach.locator('[data-mastery="next"]').click();await coach.locator('[data-coach-step]').selectOption('0');assert.equal(await coach.locator('[data-coach-input]').inputValue(),'My first thought');
    await coach.locator('.mastery-more>summary').click();await coach.locator('[data-coach-topic="why"]').click();
    assert.deepEqual(await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),before);
    for(const width of [320,390]){await p.setViewportSize({width,height:844});for(const theme of ['light','dark']){
     await f.evaluate(t=>studyTableTheme.set(t),theme);assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),subject+'/'+id+' overflow');
     const a=await f.evaluate(async id=>axe.run({include:['#'+id+' .worked-coach']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}),id);assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],subject+'/'+id+'/'+width+'/'+theme);
    }}
   }
  }
  let f=await open('piano','piano-5'),coach=f.locator('#courseFirst .worked-coach');await coach.locator('summary').first().click();
  await f.evaluate(()=>{window.starts=[];window.availability=[];window.voiceState='downloadable';window.SpeechRecognition=class{constructor(){this.processLocally=false;window.readerRecognizer=this}static async available(options){availability.push(options);return voiceState}start(){starts.push({local:this.processLocally,lang:this.lang})}abort(){this.aborted=true}}});
  await coach.locator('[data-coach-mic]').click();await f.waitForFunction(()=>document.querySelector('#courseFirst [data-coach-response]').textContent.includes('not ready'));assert.equal(await f.evaluate(()=>starts.length),0);
  await f.evaluate(()=>voiceState='available');await coach.locator('[data-coach-input]').fill('My hands:');await coach.locator('[data-coach-mic]').click();await f.waitForFunction(()=>starts.length===1);assert.deepEqual(await f.evaluate(()=>starts),[{local:true,lang:'en-US'}]);
  await f.evaluate(()=>readerRecognizer.onresult({resultIndex:0,results:[Object.assign([{transcript:'the left hand keeps holding'}],{isFinal:true})]}));
  assert.match(await coach.locator('[data-coach-input]').inputValue(),/left hand keeps holding/);
  await coach.locator('[data-mastery="next"]').click();assert(await f.evaluate(()=>readerRecognizer.aborted));const next=await coach.locator('[data-coach-input]').inputValue();
  await f.evaluate(()=>readerRecognizer.onresult({resultIndex:0,results:[Object.assign([{transcript:'late words'}],{isFinal:true})]}));assert.equal(await coach.locator('[data-coach-input]').inputValue(),next);
  await coach.locator('[data-coach-step]').selectOption('0');assert.match(await coach.locator('[data-coach-input]').inputValue(),/left hand keeps holding/);
  await coach.locator('[data-coach-mic]').click();await f.waitForFunction(()=>starts.length===2);await f.locator('[data-step-coach]').click();await p.locator('#stepCoach').waitFor({state:'visible'});assert(await f.evaluate(()=>readerRecognizer.aborted),'Opening the specific coach must stop the reader microphone');await p.locator('#st128CoachClose').click();
  await coach.locator('[data-mastery="hint"]').click();await coach.screenshot({path:'/tmp/study-v130-universal-coach.png'});
  assert.deepEqual(errors,[]);console.log('UNIVERSAL_COACHING_PASS: fourteen cases across seven courses; 56 mobile/both-theme WCAG scans; selected-step/draft consistency; exact saved-state preservation; ready local-only speech with late-result and cross-coach cancellation. Actual microphone use is not claimed.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
