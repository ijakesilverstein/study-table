/* Reconciled V168 in a real browser: story -> matched practice -> self-explanation. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','public','study-table-v168.html'),'utf8');
const subjects=['spanish','piano','chess','calculus','physics','medicine','business'];
(async()=>{
 const browser=await chromium.launch(require('./browser-options.cjs'));
 try{
  const page=await browser.newPage({viewport:{width:390,height:850}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setContent(html,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>READY&&window.studyTableFullCourses&&window.studyTableFocusV163);
  let unitTotal=0,variantTotal=0;
  for(const subject of subjects){
   await page.evaluate(s=>studyTableFullCourses.open(s),subject);
   await page.waitForFunction(s=>document.getElementById('frame')?.contentWindow?.studyTableTeachbackV168?.coverage?.length>0&&document.getElementById('frame').contentWindow.studyTableFullCourse.subject===s,subject);
   const info=await page.evaluate(()=>{
    const f=document.getElementById('frame').contentWindow;
    return {route:f.studyTablePathV167.route,units:f.studyTableFullCourse.units,coverage:f.studyTableTeachbackV168.coverage.length,
     skills:f.studyTableTeachbackV168.checked.length,spanish:!!f.studyTableSpanishV166};
   });
   assert.equal(info.coverage,info.units.length,subject+' unit teachback coverage');
   assert.equal(info.route.storyUnit,info.route.practiceUnit,subject+' exact story/practice alignment');
   if(subject==='spanish')assert(info.spanish,'Preserved V166 real conversation practice');
   unitTotal+=info.units.length;
   await page.evaluate(()=>document.getElementById('frame').contentWindow.studyTablePathV167.story());
   for(let n=0;n<3;n++){
    const step=await page.evaluate(()=>{const d=document.getElementById('frame').contentDocument;
     return {options:d.querySelectorAll('[data-v134-choice]').length,next:d.querySelector('[data-v134-next]').hidden}});
    assert.equal(step.options,3,subject+' story decisions');assert(step.next);
    await page.evaluate(()=>document.getElementById('frame').contentDocument.querySelector('[data-v134-choice="0"]').click());
    await page.evaluate(()=>document.getElementById('frame').contentDocument.querySelector('[data-v134-next]').click());
   }
   assert.equal(await page.evaluate(()=>document.getElementById('frame').contentDocument.querySelector('[data-v134-ending]').hidden),false);
   await page.evaluate(()=>document.getElementById('frame').contentDocument.querySelector('#v134Story [data-v167="practice"]').click());
   const practice=await page.evaluate(()=>{const f=document.getElementById('frame').contentWindow,d=f.document;
    const id=d.querySelector('#courseArticle').dataset.unitId,host=d.querySelector('#v133Practice');
    return {id,host:host?.dataset.v133UnitId,bank:!!f.studyTableTransfer.bank[id]}});
   assert.equal(practice.id,info.route.storyUnit);
   assert.equal(practice.host,info.route.storyUnit);
   assert(practice.bank);
   const answered=await page.evaluate(()=>{
    const f=document.getElementById('frame').contentWindow,d=f.document,host=d.querySelector('#v133Practice');
    const item=f.studyTableTransfer.bank[host.dataset.v133UnitId].variants[Number(host.dataset.variant)];
    const form=host.querySelector('[data-v133-form]');
    if(item.kind==='choice')form.querySelector(`input[type=radio][value="${item.answer}"]`).click();
    else{const input=form.querySelector('[name=v133-input]');input.value=String(item.answer);input.dispatchEvent(new Event('input',{bubbles:true}));}
    form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    return {outcome:host.querySelector('[data-v133-result]').dataset.outcome,invite:d.querySelector('#v168Invite').hidden};
   });
   assert.equal(answered.outcome,'correct',subject);
   assert.equal(answered.invite,false,subject);
   await page.evaluate(()=>document.getElementById('frame').contentDocument.querySelector('#v168Invite [data-v168-open]').click());
   const think=await page.evaluate(()=>{const d=document.getElementById('frame').contentDocument;
    const field=d.querySelector('#v168Draft');field.value='I can explain this with a concrete reason.';
    d.querySelector('[data-v168-compare]').click();d.querySelector('[data-v168-trap]').click();
    return {open:d.querySelector('#v168Teachback').open,focus:d.activeElement===field,
     own:d.querySelector('[data-v168-own]').textContent,trap:d.querySelector('#v168Trap').hidden}});
   assert(think.open&&think.focus&&think.own.includes('concrete reason')&&!think.trap,subject);
   const skills=await page.evaluate(()=>{const f=document.getElementById('frame').contentWindow;
    const problems=[];
    for(const [unit,bank] of Object.entries(f.studyTableTransfer.bank))if(bank.subject===f.studyTableFullCourse.subject){
     for(const item of bank.variants){
      const right=f.studyTableTransfer.check(item,String(item.answer));
      const wrong=f.studyTableTransfer.check(item,Object.keys(item.wrong)[0]);
      const blank=f.studyTableTransfer.check(item,'');
      problems.push({right:right.kind,wrong:wrong.kind,blank:blank.kind});
     }
    }
    return problems;
   });
   variantTotal+=skills.length;
   assert(skills.every(x=>x.right==='correct'&&x.wrong==='misconception'&&x.blank==='empty'),subject+' bank check');
   // Regression: every unit renders the actual authored prompt and never duplicates the editor.
   for(const unit of info.units){
    const result=await page.evaluate(id=>{const f=document.getElementById('frame').contentWindow;f.studyTableFullCourse.open(id);
     const d=f.document,box=d.querySelector('#v168Teachback');
     return {id:d.querySelector('#courseArticle').dataset.unitId,count:d.querySelectorAll('#v168Teachback').length,
      prompt:box?.querySelector('.v168-prompt')?.textContent,answer:box?.querySelector('#v168Comparison')?.textContent,
      draft:box?.querySelector('#v168Draft')?.value};},unit.id);
    assert.equal(result.id,unit.id);
    assert.equal(result.count,1);
    assert(result.prompt?.length>10&&result.answer?.length>20);
    assert.equal(result.draft,'','Typed reflections are not persisted between lessons');
   }
   for(const theme of ['light','dark']){
    await page.evaluate(t=>document.getElementById('frame').contentWindow.studyTableTheme.set(t),theme);
    const over=await page.evaluate(()=>{const d=document.getElementById('frame').contentDocument;return d.documentElement.scrollWidth-d.documentElement.clientWidth});
    assert(over<=2,subject+'/'+theme+' reader overflow '+over);
   }
   console.log('V168_SUBJECT_PASS',subject,info.units.length,'units',skills.length,'checked variants');
  }
  assert.equal(unitTotal,87);assert.equal(variantTotal,52);
  await page.evaluate(()=>v35Home());
  for(const width of [320,360,390,768,1280]){
   await page.setViewportSize({width,height:900});
   const over=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   assert(over<=2,'home overflow at '+width+': '+over);
  }
  assert.deepEqual(errors,[]);
  console.log('V168_FULL_PASS: all 87 authored lessons, 52 correct/wrong answers, seven matched stories, dark/light, five viewport sizes, no browser errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});