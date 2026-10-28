const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const bank=require('../source/transfer-bank-v133.json');
const scripts=fs.readFileSync(path.join(__dirname,'../source/verified-practice-v133.js'),'utf8');
const memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
const sandbox={window:{},document:{addEventListener(){}},localStorage:storage,Date,Intl,console};
vm.runInNewContext(scripts.replace('__TRANSFER_BANK__',JSON.stringify(bank)),sandbox);
const api=sandbox.window.studyTableTransfer;
assert.equal(api.version,133);
assert.deepEqual([...new Set(Object.values(bank).map(x=>x.subject))].sort(),['business','calculus','chess','medicine','physics','piano','spanish'].sort());
const ids=Object.keys(bank);assert.equal(ids.length,21);
let exercises=0,mistakes=0;
for(const [id,row] of Object.entries(bank)){
 assert.equal(row.variants.length,2,id);assert.ok(row.skill&&row.subject);
 for(const [n,item] of row.variants.entries()){
  exercises++;
  assert(item.prompt.length>28&&item.why.length>25&&item.hint.length>10,id+' '+n);
  assert.equal(api.check(item,String(item.answer)).kind,'correct',id+' canonical answer rejected');
  for(const alt of item.accept||[])assert.equal(api.check(item,alt).kind,'correct',id+' accepted alternative rejected');
  assert.equal(api.check(item,'').kind,'empty');
  if(item.kind==='number'){
   assert.equal(api.check(item,String(item.answer)+'!').kind,'format');
   assert.equal(api.check(item,String(Number(item.answer)+12345)).kind,'unmatched');
   assert.equal(api.check(item,String(item.answer)+'.0').kind,'correct');
  }
  if(item.kind==='choice'){
   assert(item.options.includes(item.answer),id+' correct option must be present');
   assert.equal(new Set(item.options).size,item.options.length,id+' duplicated options');
  }
  for(const [wrong,explanation] of Object.entries(item.wrong||{})){
   assert(explanation.length>15,id+' vague mistake explanation');
   assert.equal(api.check(item,wrong).kind,'misconception',id+' '+n+' wrong answer treated as correct or unknown: '+wrong);
   mistakes++;
  }
 }
}
assert.equal(exercises,42);
assert(mistakes>=55,'At least 55 authored misconception-specific answers');
assert.equal(api.check(bank['spanish-0'].variants[0],'unexpected explanation').kind,'unverified','Unknown language should not be called wrong');
assert.equal(api.check(bank['spanish-1'].variants[0],'quiero te por favor').kind,'correct','Accent differences cannot be confused with grammar mistakes');
assert.equal(api.records()['spanish-0'],undefined);
assert.equal(memory.size,0,'Browsing or checking exercises must never write local storage without explicit review request');
console.log('TRANSFER_MODEL_PASS: '+ids.length+' authored skills, '+exercises+' independent new problems, '+mistakes+' targeted wrong-answer explanations, narrow text/number/choice checks, no false freeform grades or implicit persistence.');
