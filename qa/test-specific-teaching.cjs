const {chromium}=require('playwright'),assert=require('assert/strict'),data=require('../source/specific-teaching-v132.json'),extra=require('../source/step-coach-v132.json');
(async()=>{const b=await chromium.launch(require('./browser-options.cjs')),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const open=async(subject,id)=>{await p.evaluate(([s,id])=>studyTableFullCourses.open(s,id),[subject,id]);await p.waitForFunction(([s,id])=>{const w=document.getElementById('frame')?.contentWindow;return w?.studyTableFullCourse?.subject===s&&w.document.querySelector('#courseArticle h1')?.textContent===w.studyTableFullCourse.units.find(u=>u.id===id)?.title},[subject,id]);return p.frames().find(f=>f.parentFrame()===p.mainFrame())};
 try{
  await p.goto(process.env.STUDY_TEST_URL||'http://127.0.0.1:8807/index.html');await p.waitForFunction(()=>READY&&studyTableFullCourses);
  for(const [id,d] of Object.entries(data)){
   const f=await open(d.subject,id),before=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
   assert(await f.locator('[data-step-coach]').isVisible(),'Specific coach must be directly discoverable');
   for(const which of ['first','second']){
    const coach=f.locator((which==='first'?'#courseFirst':'#courseSecond')+' .worked-coach');await coach.locator('summary').first().click();
    for(let i=0;i<d[which].length;i++){
     const turn=d[which][i];await coach.locator('[data-coach-step]').selectOption(String(i));assert.equal(await coach.locator('[data-mastery-question]').innerText(),turn.prompt);
     await coach.locator('[data-mastery="hint"]').click();assert.equal(await coach.locator('[data-mastery-message]').innerText(),turn.hint);
     await coach.locator('[data-mastery="stuck"]').click();assert.equal(await coach.locator('[data-mastery-message]').innerText(),turn.help);
    }
   }
   const detective=f.locator('.v132-detective');assert.equal(await detective.evaluate(d=>d.open),false,'Mistake game should remain optional after teaching');await detective.locator('summary').click();
   assert([d.comparison.correct,d.comparison.tempting].includes(await detective.locator('.v132-claim').textContent()));
   await detective.locator('[data-v130-show]').click();assert.equal(await detective.locator('[data-v130-why]').innerText(),d.comparison.why);
   assert.deepEqual(await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),before);
   await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});for(const theme of ['light','dark']){await f.evaluate(t=>studyTableTheme.set(t),theme);await p.setViewportSize({width:320,height:844});assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const a=await f.evaluate(()=>axe.run({include:['.worked-coach','.v132-detective']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],id+'/'+theme);}
  }
  for(const [id,d] of Object.entries(extra)){
   const f=await open(d.subject,id);await f.locator('[data-step-coach]').click();await p.locator('#stepCoach').waitFor({state:'visible'});
   for(let i=0;i<3;i++){
    await p.locator('#st128CoachPart').selectOption(String(i));const ref=d.steps[i].reference;
    assert(await p.locator('.st132-coach-reference').evaluate(d=>d.open),'Worked reference is visible before an answer');
    if(ref.table){assert.equal(await p.locator('.st132-coach-reference caption').innerText(),ref.table.caption);assert.deepEqual(await p.locator('.st132-coach-reference tbody tr').evaluateAll(rows=>rows.map(r=>[...r.children].map(c=>c.textContent))),ref.table.rows);if(d.subject==='spanish')assert.equal(await p.locator('#st128CoachAnswer').getAttribute('lang'),'es');}
    if(ref.board){assert.equal(await p.locator('#st132BoardTitle').textContent(),ref.board.description);assert.equal(await p.locator('.st132-board svg circle').count(),ref.board.fen.split(' ')[0].match(/[kqrnbp]/ig).length);}
    if(ref.board&&i===2)await p.locator('.st132-board').screenshot({path:'/tmp/study-v132-castling-reference.png'});
    await p.locator('#st128CoachAnswer').fill(d.steps[i].answer);await p.locator('#st128CoachCheck button').click();assert.equal(await p.locator('#st128CoachFeedback').getAttribute('data-feedback-kind'),'fits');
   }
   await p.locator('#st128CoachClose').click();
  }
  await p.context().setOffline(true);const f=await open('chess','castling');assert(await f.locator('[data-step-coach]').isVisible());assert.deepEqual(errors,[]);
  console.log('SPECIFIC_TEACHING_BROWSER_PASS: 51 actual prompts/hints/help messages in both worked cases of eight units; optional authored comparisons; directly accessible checked coaches; nine timing/dialogue/board references before attempts; 16 phone/both-theme WCAG scans; unchanged saved values; offline after load.');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
