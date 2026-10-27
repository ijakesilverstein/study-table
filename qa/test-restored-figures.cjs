const {chromium}=require('playwright'),{spawn}=require('child_process'),assert=require('assert/strict');
const manifest=require('../source/restored-figures-v123.json');
(async()=>{let server,browser;const errors=[],url=process.env.STUDY_TEST_URL||'http://127.0.0.1:8796/index.html';
 try{
  if(!process.env.STUDY_TEST_URL){server=spawn('python3',['-m','http.server','8796','--bind','127.0.0.1','--directory','public'],{stdio:'ignore'});let ready=false;for(let i=0;i<50;i++){try{if((await fetch(url)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}assert(ready)}
  browser=await chromium.launch(require('./browser-options.cjs'));const p=await browser.newPage({viewport:{width:1280,height:900}});p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.waitForFunction(()=>READY&&window.studyTableFullCourses);
  const evidence={schema:1,records:{'business-1':{attempts:3,independent:1,last:100,repair:'Keep this existing work'}}};await p.evaluate(x=>localStorage.setItem('studytable_v102_learning',JSON.stringify(x)),evidence);
  const open=async(subject,id)=>{await p.evaluate(([s,id])=>studyTableFullCourses.open(s,id),[subject,id]);await p.waitForFunction(([s,id])=>{const w=document.getElementById('frame')?.contentWindow;return w?.studyTableFullCourse?.subject===s&&w.document.querySelector('[data-restored-figure="'+id+'"]')},[subject,id]);return p.frames().find(f=>f.parentFrame()===p.mainFrame())};
  const values=f=>f.locator('#v114Canvas').evaluate(e=>JSON.parse(e.dataset.v123Values));
  const set=(f,key,value)=>f.locator('[data-v114="'+key+'"]').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},value);
  for(const [subject,m] of Object.entries(manifest))for(const id of m.ids){
   let f=await open(subject,id);assert.equal(await f.locator('.v123-figure').count(),1);assert(await f.locator('.v123-figure').isVisible());assert((await f.locator('.v123-assumptions').innerText()).length>60);const before=await f.evaluate(s=>localStorage.getItem('studytable:full-course:'+s+':progress'),subject);
   const controls=await f.locator('[data-v114]').evaluateAll(es=>es.map(e=>({key:e.dataset.v114,tag:e.tagName,min:e.min,max:e.max,options:e.options?[...e.options].map(o=>o.value):null})));
   for(const c of controls)for(const value of c.options||[c.min,c.max]){await set(f,c.key,value);assert(!/NaN|Infinity|undefined/.test(await f.locator('#v114Read').innerText()),id);if(c.tag==='INPUT')assert.equal(await f.locator('[data-v114="'+c.key+'"]').getAttribute('aria-valuetext'),await f.locator('#v114-out-'+c.key).innerText());}
   const range=f.locator('input[type=range]').first();await range.focus();await p.keyboard.press('Home');const prior=await range.inputValue();await p.keyboard.press('ArrowRight');assert.notEqual(await range.inputValue(),prior,id+' keyboard value');assert(await range.evaluate(e=>document.activeElement===e),id+' focus lost during update');assert.equal(await range.getAttribute('aria-valuetext'),await f.locator('#v114-out-'+controls[0].key).innerText());
   assert.equal(await f.evaluate(s=>localStorage.getItem('studytable:full-course:'+s+':progress'),subject),before,'figure exploration must not rate a unit');
   await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   for(const width of [320,360,390]){await p.setViewportSize({width,height:844});for(const theme of ['light','dark']){
    await f.evaluate(t=>studyTableTheme.set(t),theme);
    const layout=await f.evaluate(()=>{const host=document.querySelector('.v123-figure'),canvas=document.getElementById('v114Canvas');return {page:document.documentElement.scrollWidth<=innerWidth,canvas:canvas.scrollWidth<=canvas.clientWidth+1,tables:[...host.querySelectorAll('table')].every(e=>e.getBoundingClientRect().right<=innerWidth),clippedText:[...host.querySelectorAll('svg text')].filter(e=>{const b=e.getBBox(),v=e.ownerSVGElement.viewBox.baseVal;return b.x<-.5||b.x+b.width>v.width+.5||b.y<-.5||b.y+b.height>v.height+.5}).map(e=>e.textContent)}});
    assert.deepEqual(layout,{page:true,canvas:true,tables:true,clippedText:[]},id+'/'+width+'/'+theme);
    const result=await f.evaluate(()=>axe.run({include:['.v123-figure']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),[],id+'/'+width+'/'+theme);
   }}
   console.log('RESTORED_FIGURE_BROWSER_PASS',subject,id);
  }
  let f=await open('medicine','blood-pressure');await set(f,'dbp',120);await set(f,'sbp',80);assert.equal(await f.locator('#v114-sbp').inputValue(),'130');assert.equal(await f.locator('#v114-sbp').getAttribute('min'),'130');assert.equal((await values(f)).sbp,130);
  f=await open('medicine','test-interpretation');await set(f,'prev',0);await set(f,'spec',100);assert.equal((await values(f)).ppv,null);assert.match(await f.locator('#v114Read').innerText(),/no positive results/);await set(f,'prev',100);await set(f,'sens',100);assert.equal((await values(f)).npv,null);assert.match(await f.locator('#v114Read').innerText(),/no negative results/);
  f=await open('medicine','drug-halflife');await set(f,'dose',100);await set(f,'hl',2);await set(f,'t',48);assert((await values(f)).remaining>0);assert.match(await f.locator('#v114Read').innerText(),/e-6/);const right=await f.locator('#v114Canvas circle').getAttribute('cx');await set(f,'t',0);assert.notEqual(await f.locator('#v114Canvas circle').getAttribute('cx'),right);
  f=await open('business','cash-cycle');assert(Math.abs((await values(f)).nwc-34333.33333333333)<1e-6);await set(f,'inv',5);await set(f,'rec',60);await set(f,'pay',70);const cash=await values(f);assert(cash.cycle<0&&cash.nwc>0);
  f=await open('business','growth-cash-trap');assert(Math.abs((await values(f)).bridge+29333.33333333333)<1e-6);
  f=await open('business','pricing');await set(f,'change',10);assert.match(await f.locator('#v114Read').innerText(),/fall by 22.22%/);await set(f,'change',-25);await set(f,'vc',30);assert.equal((await values(f)).volumeRatio,null);assert.match(await f.locator('#v114Read').innerText(),/covers only variable cost/);
  await f.locator('.v123-figure').screenshot({path:'/tmp/study-table-v123-pricing-phone.png'});f=await open('medicine','test-interpretation');await f.locator('.v123-figure').screenshot({path:'/tmp/study-table-v123-test-phone.png'});
  assert.deepEqual(await p.evaluate(()=>studyTableV102.getProgress()),evidence);assert.deepEqual(errors,[]);
  console.log('RESTORED_FIGURES_PASS: twelve interactive features, real keyboard controls, min/max states, zero denominators, corrected pricing/cash, 320/360/390px and both themes, full scoped axe checks; assessment unchanged.');
 }finally{if(browser)await browser.close();server?.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
