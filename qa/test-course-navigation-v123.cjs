// Keep unfinished work from an older iframe from routing its replacement.
const {chromium}=require('playwright'),assert=require('assert/strict');
(async()=>{const b=await chromium.launch(require('./browser-options.cjs')),p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));try{
 await p.goto(process.env.STUDY_TEST_URL||'http://127.0.0.1:8796');await p.waitForFunction(()=>READY&&window.studyTableFullCourses);
 await p.evaluate(()=>{
  const native=window.setTimeout;window.v123HeldNavigation=[];
  window.setTimeout=function(fn,ms,...args){if(ms===250){v123HeldNavigation.push(()=>fn(...args));return -1000-v123HeldNavigation.length}return native(fn,ms,...args)};
  try{studyTableFullCourses.open('medicine','homeostasis');window.v123OldFrame=document.getElementById('frame');studyTableFullCourses.open('business','pricing')}finally{window.setTimeout=native}
 });
 await p.waitForFunction(()=>document.getElementById('frame')?.contentWindow.studyTableFullCourse?.subject==='business');
 // On the legacy timer implementation, release the current route first.
 await p.evaluate(()=>v123HeldNavigation.at(-1)?.());
 await p.waitForFunction(()=>document.getElementById('frame')?.contentWindow.document.querySelector('[data-restored-figure="pricing"]')||document.getElementById('frame')?.contentWindow.document.querySelector('#courseArticle h1')?.textContent==='A price change is a bet on volume');
 await p.evaluate(async()=>{v123OldFrame.dispatchEvent(new Event('load'));if(v123HeldNavigation.length>1)v123HeldNavigation[0]();await new Promise(r=>setTimeout(r,30))});
 let frame=p.frames().find(f=>f.parentFrame()===p.mainFrame());assert.equal(await frame.locator('#courseArticle h1').innerText(),'A price change is a bet on volume','a stale route changed the replacement lesson');
 for(const [subject,id] of [['piano','project'],['spanish','workshop'],['chess','project'],['calculus','integral-substitution'],['medicine','drug-halflife'],['business','workshop']]){
  await p.evaluate(([s,id])=>studyTableFullCourses.open(s,id),[subject,id]);await p.waitForFunction(([s,id])=>{const w=document.getElementById('frame')?.contentWindow;return w?.studyTableFullCourse?.subject===s&&(id==='project'?w.document.querySelector('#projectPart'):id==='workshop'?w.document.querySelector('#workshopChapter'):w.document.querySelector('#courseArticle h1')?.textContent===w.studyTableFullCourse.units.find(u=>u.id===id)?.title)},[subject,id]);
 }
 await p.reload();await p.waitForFunction(()=>READY&&window.studyTableFullCourses);await p.locator('#v90Continue').click();await p.waitForFunction(()=>document.getElementById('frame')?.contentWindow.studyTableFullCourse?.subject==='business'&&document.getElementById('frame').contentWindow.document.querySelector('#workshopChapter'));
 assert.deepEqual(errors,[]);console.log('COURSE_NAVIGATION_PASS: older iframe work cannot change the current route; loaded-frame unit/project/workshop routing and reload resume verified.');
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
