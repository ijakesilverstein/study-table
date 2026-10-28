const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
const bank=require('../source/transfer-bank-v133.json'),version=Number(require('../package.json').version.split('.')[0]),STORE='studytable:transfer-review:v133',PROGRESS='studytable_v102_learning';
(async()=>{let browser,server;const url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8833/index.html';
try{
 if(!process.env.STUDY_TEST_URL){server=spawn('python3',['-m','http.server','8833','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});for(let i=0;i<80;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}}
 browser=await chromium.launch(require('./browser-options.cjs'));
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForFunction(n=>READY&&studyTableFullCourses.version===n,version);
 const progress={schema:1,records:{'spanish-0':{attempts:1,independent:1,last:120}}};
 await page.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[PROGRESS,progress]);
 const open=async(subject,id)=>{await page.evaluate(([s,u])=>studyTableFullCourses.open(s,u),[subject,id]);await page.waitForFunction(([s,u])=>{const w=document.getElementById('frame')?.contentWindow;return w?.studyTableFullCourse?.subject===s&&w.document.querySelector('#courseArticle')?.dataset.unitId===u},[subject,id]);return page.frames().find(f=>f.parentFrame()===page.mainFrame())};
 const subjects=new Set();
 for(const [id,row] of Object.entries(bank)){
  if(subjects.has(row.subject))continue;subjects.add(row.subject);
  const f=await open(row.subject,id),card=f.locator('#v133Practice'),p=row.variants[0];
  assert.equal(await card.count(),1,row.subject+' practice card absent');
  assert.equal(await card.locator('[data-v133-form]').count(),0,'No forced quiz');
  await card.locator('[data-v133-start]').click();
  assert((await card.innerText()).includes(p.prompt.slice(0,15)),id+' wrong transfer question');
  if(p.kind==='choice')await card.locator('input[name=v133-choice]').nth(p.options.indexOf(p.answer)).check();
  else await card.locator('input[name=v133-input]').fill(String(p.answer));
  await card.locator('[data-v133-form] button[type=submit]').click();
  assert.equal(await card.locator('[data-v133-result]').getAttribute('data-outcome'),'correct');
  assert.equal(await card.locator('[data-v133-reason]').isVisible(),true);
  if(subjects.size===1)assert.equal(await page.evaluate(k=>localStorage.getItem(k),STORE),null,'Do not save without opt-in');
  await card.locator('[data-v133-save]').click();
  const saved=await page.evaluate(([key,u])=>JSON.parse(localStorage.getItem(key)).records[u],[STORE,id]);
  assert.equal(saved.level,1,'Correct independent work should schedule 3 days');
  assert(saved.due>Date.now()+2*86400000&&saved.due<Date.now()+4*86400000);
  await card.locator('[data-v133-another]').click();
  assert.equal(await card.locator('[data-v133-content]').isVisible(),true);
  await page.setViewportSize({width:320,height:844});
  assert(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),row.subject+' page overflows at 320px');
  await page.setViewportSize({width:390,height:844});
  if(row.subject==='spanish'){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const a=await f.evaluate(()=>axe.run({include:['#v133Practice']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(a.violations.map(v=>v.id),[])}
  console.log('V133_TRANSFER_BROWSER_PASS',row.subject);
 }
 const id='spanish-0',f=await open('spanish',id);
 await page.evaluate(([k,u])=>{let obj=JSON.parse(localStorage.getItem(k));obj.records[u].due=Date.now()-1000;localStorage.setItem(k,JSON.stringify(obj))},[STORE,id]);
 await f.locator('[data-course-map]').first().click();
 assert.match(await f.locator('#v133Map summary').innerText(),/ready to revisit/i);
 await f.locator('[data-v133-unit="spanish-0"]').click();
 assert.equal(await f.locator('#v133Practice [data-v133-content]').isVisible(),true);
 await f.locator('#v133Practice [data-v133-reveal]').click();
 await f.locator('#v133Practice [data-v133-save]').click();
 const result=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).records['spanish-0'],STORE);
 assert.equal(result.level,0,'Seeing explanation does not count as independent mastery');
 assert(result.due>Date.now()+.8*86400000&&result.due<Date.now()+1.2*86400000);
 await f.locator('#v133Practice [data-v133-remove]').click();
 assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).records['spanish-0'],STORE),undefined);
 await page.context().setOffline(true);
 const offline=await open('calculus','functions');
 await offline.locator('#v133Practice [data-v133-start]').click();
 assert.equal(await offline.locator('#v133Practice [data-v133-content]').isVisible(),true);
 assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),PROGRESS),progress);
 assert.deepEqual(errors,[]);
 console.log('V133_TRANSFER_COMPLETE: seven real course readers, on-device checked answers, opt-in delayed review, removal, offline and mobile.');
}finally{await browser?.close();server?.kill('SIGTERM')}})().catch(e=>{console.error(e);process.exit(1)});
