/* Browser verification of a complete authored path in each of seven courses. */
const fs=require('fs'),zlib=require('zlib'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'public/study-table-v167.html'),'utf8');
const b64=html.match(/<script id="full-bundle" type="text\/plain">([\s\S]*?)<\/script>/)?.[1];
assert(b64);const bundle=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const sources={spanish:'v15/spanish-for-someone/complete-practice-v40/index.html',piano:'v15/rockjam-piano-studio/index.html',chess:'v15/chess-from-zero/index.html',calculus:'curricula/calculus.html',physics:'curricula/physics.html',medicine:'curricula/medicine.html',business:'curricula/business.html'};
(async()=>{
 const browser=await chromium.launch(require('./browser-options.cjs'));
 try{
  for(const [subject,src] of Object.entries(sources)){
   const p=await browser.newPage({viewport:{width:390,height:844}});
   const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.evaluate(()=>{const data=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{get length(){return data.size},getItem:k=>data.get(String(k))??null,setItem:(k,v)=>data.set(String(k),String(v)),removeItem:k=>data.delete(String(k)),key:i=>[...data.keys()][i]??null,clear:()=>data.clear()}})});
   await p.setContent(bundle[src].t,{waitUntil:'domcontentloaded',timeout:60000});
   await p.waitForFunction(()=>!!window.studyTablePathV167&&!!document.getElementById('v167Path'));
   const route=await p.evaluate(()=>studyTablePathV167.route);
   assert.equal((await p.locator('#v167Path [data-v167]').count()),3,subject+' should have one clear set of starting choices');
   assert.equal(await p.locator('#v167More').isVisible(),true);
   assert.equal(await p.locator('.v165-story-discovery').isVisible(),false);
   await p.locator('#v167Path [data-v167=story]').click();
   assert(await p.locator('#v134Story [data-v134-game]').isVisible());
   for(let n=0;n<3;n++){
    await p.locator('#v134Story [data-v134-choice]').first().click();
    await p.locator('#v134Story [data-v134-next]').click();
   }
   assert(await p.locator('#v134Story [data-v134-ending]').isVisible());
   await p.locator('#v134Story [data-v167=practice]').click();
   assert.equal(await p.locator('#courseArticle').getAttribute('data-unit-id'),route.practiceUnit);
   const active=await p.evaluate(()=>studyTableTransfer.bank[studyTablePathV167.route.practiceUnit]);
   assert(active.variants.length===2);
   assert(await p.locator('#v133Practice [data-v133-content]').isVisible());
   // An authored checked answer triggers the ungraded reflection, never storage writes.
   const variant=active.variants[0];
   if(variant.kind==='choice'){
    const index=variant.options.indexOf(variant.answer);
    await p.locator('#v133Practice input[type=radio]').nth(index).check();
   }else await p.locator('#v133Practice [name=v133-input]').fill(String(variant.answer));
   await p.locator('#v133Practice [data-v133-form] button[type=submit]').click();
   assert(await p.locator('#v167Reflect').isVisible(),subject);
   await p.locator('#v167Reflect [data-v167=example]').click();
   assert(await p.locator('#v167Reflect [data-v167-example]').isVisible());
   await p.locator('#v167Thought').fill('What I think the step means');
   const keys=await p.evaluate(()=>Object.keys(localStorage));
   assert(!keys.some(k=>k.includes('v167')),'Reflection must not create phantom persisted learning results');
   await p.evaluate(()=>studyTableFullCourse.overview());
   await p.locator('#v167Path [data-v167=lesson]').click();
   assert.equal(await p.locator('#courseArticle').getAttribute('data-unit-id'),route.storyUnit);
   if(subject==='spanish'){
    await p.evaluate(()=>studyTableFullCourse.overview());
    assert.equal(await p.locator('#v166Real').count(),1);
    assert.equal(await p.evaluate(()=>studyTableSpanishV166.scenes.length),8);
   }
   for(const w of [320,360,390,768,1280]){
    await p.setViewportSize({width:w,height:880});await p.evaluate(()=>studyTableFullCourse.overview());
    const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert(overflow<=2,subject+' overflows at '+w+'px by '+overflow);
   }
   assert.deepEqual(errors,[],subject+' JavaScript exceptions');
   console.log('V167_PATH_PASS',subject,'story, lesson, checked problem, reflective explanation, widths 320..1280');
   await p.close();
  }
  console.log('V167_ALL_SEVEN_SUBJECTS_PASS');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});