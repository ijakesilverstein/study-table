const vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
const manifest=require('../source/restored-figures-v123.json');
const ctx=vm.createContext({V114_FIGURES:{},v114Figure(){},escape:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))});
vm.runInContext(fs.readFileSync('source/restored-figure-reader-v123.js','utf8').replace('__RESTORED_IDS__',JSON.stringify(Object.values(manifest).flatMap(x=>x.ids))),ctx);
for(const m of Object.values(manifest))vm.runInContext(fs.readFileSync('source/'+m.corrected,'utf8'),ctx);
const close=(a,b,label)=>assert(Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(b)),`${label}: ${a} vs ${b}`);
const valid=value=>{if(value===null)return;assert.equal(typeof value,'number');assert(Number.isFinite(value))};
const check=(id,s,v)=>{
 Object.values(v).forEach(valid);
 if(id==='homeostasis'){close(v.final,s.dev*Math.pow(s.mode==='neg'?.62:1.3,10),'feedback');if(s.dev!==0)assert(s.mode==='neg'?Math.abs(v.final)<Math.abs(s.dev):Math.abs(v.final)>Math.abs(s.dev));}
 if(id==='blood-pressure'){assert(v.sbp>=v.dbp+10);close(v.map,(v.sbp+2*v.dbp)/3,'MAP');assert(v.map<v.midpoint);}
 if(id==='kidney-balance'){close(v.reabsorbed+v.urine,v.filtered,'water balance');close(v.urine/v.filtered,1-s.reab/100,'excretion fraction');}
 if(id==='drug-halflife'){close(v.remaining,v.amount/Math.pow(2,s.t/s.hl),'decay');close(v.amount/Math.pow(2,v.thresholdTime/s.hl),25,'absolute threshold');assert(v.remaining>0);}
 if(id==='test-interpretation'){close(v.tp+v.fn,v.affected,'affected column');close(v.tn+v.fp,v.unaffected,'unaffected column');close(v.positive+v.negative,10000,'population');if(v.ppv!==null)close(v.ppv,v.tp/(v.tp+v.fp),'PPV');else assert.equal(v.positive,0);if(v.npv!==null)close(v.npv,v.tn/(v.tn+v.fn),'NPV');else assert.equal(v.negative,0);}
 if(id==='gas-exchange')close(v.relative,(s.area/70)*(s.grad/60)/s.thick,'relative diffusion');
 if(id==='unit-economics'){close(v.contribution,s.price-s.mat-s.ship-5,'contribution');close(v.profit,v.contribution*500-9000,'profit');}
 if(id==='breakeven'){assert(v.atBoxes>=v.fixed);assert(v.atPrevious<v.fixed);assert.equal(v.boxes,Math.ceil(s.fixed/s.contrib));}
 if(id==='cash-cycle'||id==='growth-cash-trap'){const sales=id==='cash-cycle'?20000:s.sales;const nwc=sales*(s.rec/30+.65*(s.inv-s.pay)/30);close(v.nwc,nwc,'working capital');if(id==='cash-cycle')close(v.cycle,s.inv+s.rec-s.pay,'cycle days');else{const base=20000*(s.rec/30+.65*(s.inv-s.pay)/30);close(v.extra,nwc-base,'incremental funding');close(v.bridge,.35*sales-9000-nwc+base,'cash bridge');}}
 if(id==='pricing'){const next=40*(1+s.change/100)-s.vc;if(next>0)close(v.volumeRatio*100*next,100*(40-s.vc),'equal contribution');else assert.equal(v.volumeRatio,null);}
 if(id==='discounting'){close(v.present*Math.pow(1+s.rate/100,s.yrs),s.fv,'compound inversion');close(v.recovered,s.fv,'future recovery');}
};
let checked=0;
for(const [id,spec] of Object.entries(ctx.V114_FIGURES)){
 const combinations=spec.controls.reduce((states,c)=>states.flatMap(s=>[...new Set(c.options?c.options.map(o=>o[0]):[c.min,c.value,c.max])].map(value=>({...s,[c.id]:value}))),[{}]);
 for(const state of combinations){spec.normalize?.(state);const result=spec.draw(state);assert(!/NaN|Infinity|undefined/.test(result.html+result.read),id);assert.match(result.html,/<table/);assert.match(result.html,/<caption>/);check(id,state,result.values);
  if(id==='cash-cycle'){
   const dates=[...result.html.matchAll(/<tr><th scope="row">(Receive|Sell|Pay|Collect)<\/th><td>(\d+)<\/td><\/tr>/g)].map(m=>[m[1],Number(m[2])]);
   assert.equal(dates.length,4);const expected={Receive:0,Sell:state.inv,Pay:state.pay,Collect:state.inv+state.rec};
   dates.forEach(([name,day])=>assert.equal(day,expected[name]));assert(dates.every(([,day],i)=>i===0||day>=dates[i-1][1]));
  }
  checked++;}
}
const draw=(id,s)=>ctx.V114_FIGURES[id].draw(s);
for(const mode of ['neg','pos']){const z=draw('homeostasis',{dev:0,mode});assert.equal(z.values.final,0);assert.match(z.read,/zero/)}
let v=draw('pricing',{change:10,vc:26}).values;close(-v.volumeChange,22.22222222222222,'price rise volume loss');
v=draw('pricing',{change:-10,vc:26}).values;close(v.volumeChange,40,'discount volume increase');
for(const [vc,word] of [[30,/covers only variable cost/],[34,/loses money/]])assert.match(draw('pricing',{change:-25,vc}).read,word);
assert.match(draw('unit-economics',{price:26,mat:14,ship:7}).read,/exactly covers/);
v=draw('cash-cycle',{inv:40,rec:45,pay:30}).values;close(v.nwc,34333.33333333333,'baseline');
v=draw('cash-cycle',{inv:5,rec:60,pay:70}).values;assert(v.cycle<0&&v.nwc>0,'negative cycle does not determine the sign of working capital');
v=draw('growth-cash-trap',{sales:40000,inv:40,rec:45,pay:30}).values;close(v.bridge,-29333.33333333333,'profitable growth funding');
v=draw('test-interpretation',{prev:1,sens:99,spec:95}).values;assert.equal(v.tp,99);close(v.fp,495,'false positives');close(v.ppv,1/6,'base rate');
assert.equal(draw('test-interpretation',{prev:0,sens:100,spec:100}).values.ppv,null);
assert.equal(draw('test-interpretation',{prev:100,sens:100,spec:100}).values.npv,null);
assert(draw('gas-exchange',{area:80,grad:80,thick:1}).values.percent>100);
assert.match(draw('drug-halflife',{dose:100,hl:2,t:48}).read,/e-6/,'tiny positive amounts must not round to zero');
console.log('RESTORED_MODELS_PASS:',checked,'parameter combinations; independent balance, denominator, pricing, decay and boundary checks.');
