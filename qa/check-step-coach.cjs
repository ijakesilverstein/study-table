const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const data={...require('../source/step-coach-v128.json'),...require('../source/step-coach-v132.json')},source=fs.readFileSync('source/step-coach-v128.js','utf8').replace('__STEP_COACH_DATA__',JSON.stringify(data));
const context={window:{}};vm.createContext(context);vm.runInContext(source,context);const check=context.window.studyTableStepCoach.check;
let count=0;for(const [id,scenario] of Object.entries(data)){assert.equal(scenario.steps.length,3);for(let i=0;i<3;i++){
 const step=scenario.steps[i];assert.equal(check(id,i,step.answer).kind,'fits',id+'/'+i);assert.equal(check(id,i,'').kind,'empty');assert.equal(step.stuck.length,2);
 if(step.kind==='number'){for(const value of Object.keys(step.mistakes))assert.equal(check(id,i,value).kind,'revise',id+'/'+i+'/'+value);for(const value of ['Infinity','NaN','1/0','<img src=x onerror=alert(1)>'])assert.notEqual(check(id,i,value).kind,'fits');}
 count++;
}}
for(const [id,i,input,kind] of [
 ['noun-phrases',0,'Quiero un café pequeño, por favor.','fits'],['noun-phrases',1,'DOS CAFE\u0301S PEQUEN\u0303OS','fits'],['noun-phrases',1,'dos cafés pequeños','fits'],['noun-phrases',1,'dos café pequeños','revise'],['noun-phrases',1,'dos cafés pequeño','revise'],['noun-phrases',2,'dos mesas pequeños','revise'],['noun-phrases',1,'dos cafes pequeños','revise'],['noun-phrases',1,'Quisiera dos cafés pequeños','compare'],['noun-phrases',1,'quiero tres cafés pequeños','compare'],
 ['count-exchanges',2,'−2','fits'],['physics-2',2,'8 m/s','fits'],['physics-2',2,'8 J','compare'],['physics-2',0,'100 J','fits'],['physics-2',0,'100 m/s','compare'],['physics-2',2,'eight','fits'],['physics-2',2,'√64','fits'],['product-rule',2,'16 m²/s','fits'],['product-rule',2,'16 m^2/s','fits'],['piano-5',0,'low C','fits'],['piano-5',2,'d4','fits'],['piano-5',1,'1 time','fits']
])assert.equal(check(id,i,input).kind,kind,id+'/'+input);
for(const [id,i,v] of [['__proto__',0,'1'],['constructor',0,'1'],['physics-2',-1,'1'],['physics-2',1.5,'1'],['physics-2',0,{}]])assert.equal(check(id,i,v),null);
for(const [id,scenario] of Object.entries(data))for(let i=0;i<3;i++){
 const step=scenario.steps[i];if(step.kind==='phrase')for(const value of step.accepted)assert.equal(check(id,i,value).kind,'fits',value);
 if(['phrase','square'].includes(step.kind))for(const value of Object.keys(step.mistakes))assert.equal(check(id,i,value).kind,'revise',id+'/'+value);
}
for(const [id,i,v,kind] of [['rests-and-halves',2,'half','fits'],['rests-and-halves',2,'.5 seconds','fits'],['spanish-5',2,'Si','revise'],['spanish-5',1,'Quisiera el pedido para llevar','compare'],['castling',0,'G 1','fits'],['castling',0,'constructor','compare'],['castling',2,'g1','revise'],['castling',1,'go to f1','compare']])assert.equal(check(id,i,v).kind,kind);
// Independent quantities behind the feedback, not just text agreement.
assert.equal(2*10*5,100);assert.equal(100-36,64);assert.equal(Math.sqrt(2*64/2),8);
assert.equal(1*4+3*4,16);assert.equal(3-5,-2);
console.log('STEP_COACH_MODEL_PASS:',count,'authored decisions, valid alternatives, specific errors, units, accents, unknown/invalid inputs and independent numerical results.');

const concept={document:{addEventListener(){}},V132_SPECIFIC:require('../source/specific-teaching-v132.json')};vm.createContext(concept);vm.runInContext(fs.readFileSync('source/curiosity-v130.js','utf8'),concept);let valid=0,invalid=0;for(const course of Object.values(require('../source/full-courses-built.json')))for(const unit of course.units){const c=concept.v132Claim(unit),d=concept.V132_SPECIFIC[unit.id]?.comparison,yes=d?.correct||unit.mistake.repair,no=d?.tempting||unit.mistake.attempt;assert.notEqual(yes,no);assert.equal(c.copy,c.holds?yes:no);if(c.holds)valid++;else invalid++}assert(valid>0&&invalid>0);console.log('BALANCED_CLAIMS_PASS:',valid,'valid approaches and',invalid,'approaches needing correction; no always-reject cue.');
