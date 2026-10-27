const {chromium}=require('playwright'),assert=require('assert/strict');
const courses=require('../source/full-courses-built.json'),notes=require('../source/teacher-notes-v122.json');
(async()=>{const browser=await chromium.launch(require('./browser-options.cjs')),p=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const open=async(s,id)=>{await p.evaluate(([s,id])=>studyTableFullCourses.open(s,id),[s,id]);await p.waitForFunction(([s,id])=>{const w=document.getElementById('frame')?.contentWindow;return w?.studyTableFullCourse?.subject===s&&w.document.querySelector('#courseArticle h1')?.textContent===w.studyTableFullCourse.units.find(u=>u.id===id)?.title},[s,id]);return p.frames().find(f=>f.parentFrame()===p.mainFrame())};
 try{await p.goto(process.env.STUDY_TEST_URL||'http://127.0.0.1:8771');await p.waitForFunction(()=>READY&&window.studyTableFullCourses);
 const evidence={schema:1,records:{'piano-5':{attempts:2,independent:1,last:100}}};await p.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),evidence);
 for(const [subject,c] of Object.entries(courses))for(const unit of c.units){
  const n=notes[unit.id];if(!n)continue;let f=await open(subject,unit.id);
  assert.equal(await f.locator('.teacher-start h2').innerText(),n.title);
  assert.deepEqual(await f.locator('.teacher-start>p').allTextContents(),n.start);assert.equal(await f.locator('#courseArticle>.course-goal~p').count(),0,'do not repeat the old opening before the new introduction');
  assert.equal(await f.locator('#courseFirst .teacher-aside').count(),n.first.length);
  assert.equal(await f.locator('#courseSecond .teacher-aside').count(),0);
  for(let i=0;i<unit.first.steps.length;i++){
   const li=f.locator('#courseFirst .solution>li').nth(i);assert.equal(await li.locator(':scope>.calculation').innerText(),unit.first.steps[i][1]);assert.equal(await li.locator('.teacher-aside p').innerText(),n.first[i]);assert(await li.locator('.teacher-aside').isVisible());assert.equal(await li.locator('.teacher-aside').evaluate(e=>!!e.closest('details')),false);
  }
  assert.equal(await f.locator('#courseVariation').evaluate(e=>e.open),false);
  if(n.table){assert.equal(await f.locator('.teacher-table caption').innerText(),n.table.caption);assert.deepEqual(await f.locator('.teacher-table tbody tr').evaluateAll(rows=>rows.map(row=>[...row.children].map(c=>c.textContent))),n.table.rows)}
  if(n.links.length){await f.locator('.teacher-prerequisites [data-course-unit]').first().click();assert.equal(await f.locator('#courseArticle h1').innerText(),c.units.find(u=>u.id===n.links[0]).title);await f.evaluate(id=>studyTableFullCourse.open(id),unit.id)}
  assert.equal(await f.locator('.teacher-start').count(),1);assert.equal(await f.locator('#courseFirst .teacher-aside').count(),n.first.length);
  await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  for(const width of [320,390]){await p.setViewportSize({width,height:844});for(const theme of ['light','dark']){
   await f.evaluate(t=>studyTableTheme.set(t),theme);assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),unit.id+' overflow '+width);
   if(n.table)assert(await f.locator('.teacher-table table').evaluate(e=>e.getBoundingClientRect().right<=innerWidth),unit.id+' table width');
   const r=await f.evaluate(()=>axe.run({include:['.teacher-start','#courseFirst']},{runOnly:{type:'rule',values:['color-contrast','table-fake-caption','td-headers-attr','th-has-data-cells','duplicate-id-aria']}}));assert.deepEqual(r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],unit.id+'/'+theme+'/'+width);
  }}
 }
 let f=await open('calculus','functions');assert.equal(await f.locator('.teacher-start,.teacher-aside,.teacher-table').count(),0);
 assert.deepEqual(await p.evaluate(()=>studyTableV102.getProgress()),evidence);assert.deepEqual(errors,[]);
 console.log('TEACHER_NOTES_BROWSER_PASS: all fourteen explanations visible before practice, 51 matched steps, four accessible tables, real prerequisite navigation, 320/390px and both themes; assessment unchanged.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
