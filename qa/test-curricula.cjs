const {chromium}=require('playwright'),assert=require('assert/strict'),fs=require('fs');
const courses=JSON.parse(fs.readFileSync(require('path').join(__dirname,'../source/course-map-built.json'),'utf8'));
(async()=>{const b=await chromium.launch(require('./browser-options.cjs')),p=await b.newPage({viewport:{width:1280,height:950}}),errors=[];p.on('pageerror',e=>errors.push(e.message));try{
 await p.goto((process.env.STUDY_TEST_URL||'http://127.0.0.1:8771/index.html'));await p.waitForFunction(()=>window.studyTableCurricula&&READY);
 assert(await p.locator('#v108CoursesHome').isVisible());assert(await p.locator('#v108CoursesTop').isVisible());await p.locator('#v108CoursesHome').click();assert.equal(await p.locator('[data-curriculum]').count(),11);console.log('FULL_CURRICULUM_ACCESS_VISIBLE_ON_HOME_AND_TOP_NAV_PASS');
 await p.locator('#v108CurriculaClose').click();await p.evaluate(()=>studyTableV97.open('chess','chess-1'));await p.locator('#v97ToCourse').click();assert.equal(await p.locator('#v108CurriculumSubject').inputValue(),'chess');assert.equal(await p.locator('[data-curriculum]').count(),1);await p.keyboard.press('Escape');await p.waitForFunction(()=>document.getElementById('v97Study').open);assert.equal(await p.locator('#v97LessonSelect').inputValue(),'chess-1');await p.locator('#v97Close').click();console.log('LESSON_CURRICULUM_LINK_FILTERS_SUBJECT_AND_RETURNS_ON_CLOSE_PASS');
 for(const course of courses)for(let i=0;i<course.routes.length;i++){
  const route=course.routes[i];await p.evaluate(s=>studyTableCurricula.open(s),course.subject);await p.locator('[data-curriculum-route="'+course.subject+':'+i+'"]').click();assert.equal(await p.locator('#v108Curricula').isVisible(),false);
  if(route.path){assert.match(await p.locator('#frame').getAttribute('title'),new RegExp(route.path.split('?')[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));await p.frameLocator('#frame').locator('body').waitFor();assert((await p.frameLocator('#frame').locator('body').innerText()).length>40);assert(await p.locator('#v108CoursesArchive').isVisible());}
  else if(route.science==='foundation'){assert(await p.locator('#screen .v23-page').isVisible());assert.equal(await p.locator('[data-v23-index]').count(),course.subject==='calculus'?10:11)}
  else {assert.equal(await p.locator('[data-v27-index]').count(),12)}
  console.log('COURSE_ROUTE_PASS',course.subject,route.path||route.science);
 }
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>studyTableCurricula.open());assert(await p.locator('#v108Curricula').evaluate(e=>e.scrollWidth<=e.clientWidth+1));await p.screenshot({path:require('path').join(__dirname,'curricula-v108-mobile.png')});console.log('CURRICULUM_MAP_MOBILE_PASS');assert.deepEqual(errors,[]);console.log('NO_JS_ERRORS');
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
