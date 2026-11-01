'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../source/st207-chapter-checks.js'),'utf8');
const bank=JSON.parse(source.split('const BANK=')[1].split(';\nconst COURSE_NAMES')[0]);
const context={window:{},document:{readyState:'loading',addEventListener(){}},localStorage:{getItem:()=>null,setItem:()=>{}},Date,JSON,console};
vm.createContext(context);vm.runInContext(source,context,{timeout:5000});
const api=context.window.StudyTableChapterChecks;let total=0;
for(const [subject,chapters] of Object.entries(bank))for(let chapter=0;chapter<chapters.length;chapter++)for(let i=0;i<chapters[chapter].length;i++){
  const item=chapters[chapter][i];assert(item.prompt&&item.hint&&item.why);
  assert(api.testAnswer(subject,chapter,i,item.answer),`${subject}:${chapter}:${i} expected answer`);total++;
}
assert.equal(total,78);assert.equal(api.count(),78);
assert.equal(api.testAnswer('piano',4,1,'C E'),false,'Do not drop A in A-minor chord');
assert.equal(api.testAnswer('piano',4,1,'A C E'),true);
assert.equal(api.testAnswer('physics',0,0,'5 m/s'),true);
assert.equal(api.testAnswer('calculus',0,0,'140'),false);
assert.equal(api.testAnswer('business',0,0,'$200'),true);
assert.equal(api.testAnswer('medicine',1,0,'the right ventricle'),true);
const today=new Date().toISOString();
assert(api.validate({version:1,chapters:{'physics:0':{last:today,due:today,independent:2,attempts:1}}}));
assert(!api.validate({version:1,chapters:{'physics:99':{last:today,due:today,independent:2,attempts:1}}}));
console.log(`V207 PASS: ${total} authored checks, answer normalization, validation`);
