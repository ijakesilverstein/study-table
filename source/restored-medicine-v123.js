/* Restored from Claude V120; corrected models and text are documented in V123. */
V114_FIGURES['homeostasis']={
 title:'Push the value and watch the loop push back',
 intro:'Start with a disturbance from a fixed target. Compare a response that reduces the error with one that amplifies it.',
 assumptions:'This is a toy feedback rule, not a forecast of body temperature. Each step is one model update, not a minute. The target stays fixed; the vertical scale adjusts to show every value.',
 controls:[{id:'dev',label:'Initial deviation from the target',unit:'°C (model)',min:-1.5,max:1.5,step:.25,value:.5},{id:'mode',type:'select',label:'Response direction',options:[['neg','Negative: reduce error'],['pos','Positive: amplify error']]}],
 draw(s){const dev=Number(s.dev),factor=s.mode==='neg'?.62:1.3,points=Array.from({length:11},(_,i)=>[i,dev*factor**i]),end=points[10][1],extent=Math.max(1,...points.map(p=>Math.abs(p[1])));
  return {values:{initial:dev,factor,final:end},html:v123Curve('Deviation from the fixed target over ten model steps.',points,{min:-extent,max:extent,ylabel:'Deviation (°C)',xlabel:'Model step'})+v123Table('The error after each update',['Step','Deviation'],[0,1,2,5,10].map(i=>[String(i),v123N(points[i][1],4)+' °C'])),
   read:dev===0?'The initial error is zero. Multiplying zero by either factor leaves zero in this model.':s.mode==='neg'?'Each update keeps 62% of the previous error: '+v123N(dev)+' × 0.62¹⁰ = '+v123N(end,4)+' °C. The deviation shrinks toward zero.':'Each update multiplies the error by 1.30: '+v123N(dev)+' × 1.30¹⁰ = '+v123N(end,4)+' °C. This rule amplifies an existing deviation instead of stabilizing the fixed target.'};
 }
};
V114_FIGURES['blood-pressure']={
 title:'From a cuff reading to an approximate mean',
 intro:'Estimate mean arterial pressure (MAP) using one third of pulse pressure, then compare with the midpoint. In this model systolic pressure must be at least 10 mmHg above diastolic pressure; moving diastolic higher also raises the systolic minimum.',
 assumptions:'MAP ≈ diastolic + one third of pulse pressure is an approximation, most useful at ordinary resting heart rates. A measured mean depends on the pressure waveform and timing. These readings alone do not establish blood flow or oxygen delivery.',
 controls:[{id:'sbp',label:'Systolic',unit:'mmHg',min:80,max:200,step:5,value:120,minFor:s=>Math.max(80,Number(s.dbp)+10)},{id:'dbp',label:'Diastolic',unit:'mmHg',min:40,max:120,step:5,value:80}],
 normalize(s){s.sbp=Math.max(Number(s.sbp),Number(s.dbp)+10)},
 draw(s){const sbp=Number(s.sbp),dbp=Number(s.dbp),pp=sbp-dbp,map=dbp+pp/3,mid=(sbp+dbp)/2;
  return {values:{sbp,dbp,pulsePressure:pp,map,midpoint:mid},html:v123Bars('Four pressure values, on a common zero-to-200 scale.',[['Diastolic',dbp],['MAP ≈',map],['Midpoint',mid],['Systolic',sbp]],200,'Bar scale: 0–200 mmHg')+v123Table('Readings and estimates',['Quantity','mmHg'],[['Diastolic',v123N(dbp)],['Systolic',v123N(sbp)],['Pulse pressure',v123N(pp)],['Approximate MAP',v123N(map)],['Midpoint',v123N(mid)]]),
   read:'Pulse pressure = '+sbp+' − '+dbp+' = '+pp+' mmHg. Approximate MAP = '+dbp+' + '+pp+'/3 = '+v123N(map)+' mmHg. The midpoint is '+v123N(mid)+' mmHg. The approximation weights diastolic pressure more heavily rather than treating the two readings equally.'};
 }
};
V114_FIGURES['kidney-balance']={
 title:'Filtered water, reclaimed water, urine',
 intro:'Keep track of water volume. A small change in the fraction reabsorbed can make a large change to the much smaller urine output.',
 assumptions:'This simplified water balance holds filtration and the selected reabsorption fraction constant over a day. It is not a model of every solute: solute excretion also depends on secretion and selective transport. Litres per day is a volume rate.',
 controls:[{id:'gfr',label:'Filtered water per day',unit:'L/day',min:120,max:220,step:10,value:180},{id:'reab',label:'Water reabsorbed',unit:'%',min:97,max:99.9,step:.1,value:99.2}],
 draw(s){const filtered=Number(s.gfr),fraction=Number(s.reab)/100,urine=filtered*(1-fraction),reabsorbed=filtered-urine;
  return {values:{filtered,fraction,reabsorbed,urine},html:v123Bars('Daily water volumes on one common scale. Urine is small relative to filtered water.',[['Filtered',filtered],['Reclaimed',reabsorbed],['Urine',urine]],filtered,'Common volume scale (L/day)')+v123Table('Daily water balance',['Water','L/day'],[['Filtered',v123N(filtered)],['Reabsorbed',v123N(reabsorbed)],['Excreted',v123N(urine)]]),
   read:'Reabsorbed = '+v123N(filtered)+' × '+v123N(fraction,3)+' = '+v123N(reabsorbed)+' L/day. Urine = '+v123N(filtered)+' − '+v123N(reabsorbed)+' = '+v123N(urine)+' L/day. A one percentage-point change in reabsorption changes output by '+v123N(filtered*.01)+' L/day if filtration stays fixed.'};
 }
};
V114_FIGURES['drug-halflife']={
 title:'Count half-lives, not just hours',
 intro:'Change the starting amount, the half-life or the elapsed time. The fraction left depends on how many half-lives have passed.',
 assumptions:'A single starting amount, constant first-order elimination and no additional doses are assumed. The 25 mg threshold is a mathematical comparison, not a therapeutic or safe level. log₂(start/25) counts the halvings needed to reach it. Doubling the starting amount adds one half-life to reaching the same absolute threshold, while time to the same fraction is unchanged.',
 controls:[{id:'dose',label:'Starting amount',unit:'mg',min:100,max:800,step:100,value:400},{id:'hl',label:'Constant half-life',unit:'h',min:2,max:12,step:1,value:6},{id:'t',label:'Time elapsed',unit:'h',min:0,max:48,step:1,value:24}],
 draw(s){const amount=Number(s.dose),halfLife=Number(s.hl),time=Number(s.t),n=time/halfLife,fraction=.5**n,remaining=amount*fraction,thresholdTime=halfLife*Math.log2(amount/25),points=Array.from({length:97},(_,i)=>[i/2,amount*.5**(i/2/halfLife)]);
  return {values:{amount,halfLife,time,halfLives:n,fraction,remaining,thresholdTime},html:v123Curve('Amount remaining over 48 hours under constant first-order elimination.',points,{max:amount,xmax:48,ylabel:'Amount (mg)',xlabel:'Time (hours)',marker:[time,remaining]})+v123Table('Current calculation',['Quantity','Value'],[['Half-lives elapsed',v123N(n)],['Fraction remaining',v123N(fraction,4)],['Amount remaining',v123N(remaining,4)+' mg'],['Time to 25 mg',v123N(thresholdTime)+' h']]),
   read:v123N(time)+' h ÷ '+v123N(halfLife)+' h = '+v123N(n)+' half-lives. Amount left = '+v123N(amount)+' × (½)^'+v123N(n)+' = '+v123N(remaining,4)+' mg ('+v123N(fraction*100,4)+'% of the start). Time to the same 25 mg threshold = '+v123N(halfLife)+' × log₂('+v123N(amount)+'/25) = '+v123N(thresholdTime)+' h.'};
 }
};
V114_FIGURES['test-interpretation']={
 title:'Count people, not just percentages',
 intro:'Positive predictive value (PPV) asks what fraction of positive results are true; negative predictive value (NPV) asks what fraction of negative results are true. First change prevalence with sensitivity and specificity fixed. Then change a test property.',
 assumptions:'These are expected counts in a hypothetical population of 10,000, so fractional counts can appear. Predictive values depend on the selected population and test properties. With no positive results, positive predictive value has no denominator and is not defined.',
 controls:[{id:'prev',label:'Prevalence',unit:'%',min:0,max:100,step:.5,value:1},{id:'sens',label:'Sensitivity',unit:'%',min:80,max:100,step:.1,value:99},{id:'spec',label:'Specificity',unit:'%',min:80,max:100,step:.1,value:95}],
 draw(s){const N=10000,p=Number(s.prev)/100,se=Number(s.sens)/100,sp=Number(s.spec)/100,affected=N*p,unaffected=N-affected,tp=affected*se,fn=affected-tp,fp=unaffected*(1-sp),tn=unaffected-fp,positive=tp+fp,negative=fn+tn,ppv=positive>0?tp/positive:null,npv=negative>0?tn/negative:null;
  const chart=positive>0?v123Svg('Of the positive results, '+v123N(tp)+' are true positives and '+v123N(fp)+' are false positives.',v123Text(8,25,'Positive results')+'<rect x="20" y="45" width="240" height="40" fill="var(--study-panel)" stroke="currentColor"/><rect x="20" y="45" width="'+(240*ppv)+'" height="40" fill="var(--study-warm)" stroke="currentColor"/>'+v123Line(20+240*ppv,40,20+240*ppv,90,'stroke-width="3"')+v123Text(20,115,'True +: '+v123N(tp))+v123Text(20,145,'False +: '+v123N(fp)),165):'<p>No positive results occur under these settings. A positive-result proportion cannot be calculated.</p>';
  return {values:{affected,unaffected,tp,fn,fp,tn,positive,negative,ppv,npv},html:chart+v123Table('Expected counts: condition present or absent',['Result','Present','Absent','Total'],[['Positive',v123N(tp),v123N(fp),v123N(positive)],['Negative',v123N(fn),v123N(tn),v123N(negative)],['Total',v123N(affected),v123N(unaffected),'10,000']]),
   read:'Sensitivity applies to '+v123N(affected)+' people with the condition; specificity applies to '+v123N(unaffected)+' without it. '+(ppv===null?'There are no positive results, so PPV is not defined.':'PPV = '+v123N(tp)+' / ('+v123N(tp)+' + '+v123N(fp)+') = '+v123N(ppv*100)+'%.')+' '+(npv===null?'There are no negative results, so NPV is not defined.':'NPV = '+v123N(tn)+' / ('+v123N(tn)+' + '+v123N(fn)+') = '+v123N(npv*100)+'%.')};
 }
};
V114_FIGURES['gas-exchange']={
 title:'Area, gradient and thickness do different jobs',
 intro:'Hold two terms constant and change the third. Compare the resulting diffusion rate with one stated reference model.',
 assumptions:'Reference: area 70 m², partial-pressure difference 60 mmHg and relative thickness 1. This relative diffusion calculation is not a percentage of health or oxygen saturation. Ventilation can affect alveolar partial pressures; actual oxygen transfer also depends on blood flow and other factors.',
 controls:[{id:'area',label:'Usable surface area',unit:'m²',min:10,max:80,step:5,value:70},{id:'grad',label:'Partial-pressure difference',unit:'mmHg',min:10,max:80,step:5,value:60},{id:'thick',label:'Barrier thickness / reference',unit:'×',min:1,max:5,step:.5,value:1}],
 draw(s){const area=Number(s.area),gradient=Number(s.grad),thickness=Number(s.thick),relative=(area*gradient/thickness)/(70*60),percent=relative*100;
  return {values:{area,gradient,thickness,relative,percent},html:v123Bars('Selected diffusion rate versus a reference of 100 percent, on a shared scale up to 160 percent.',[['Reference',100],['Selected',percent]],160,'Bar scale: 0–160% of reference')+v123Table('Terms in the diffusion model',['Term','Selected'],[['Area',v123N(area)+' m²'],['Pressure difference',v123N(gradient)+' mmHg'],['Relative thickness',v123N(thickness)+'×'],['Relative transfer',v123N(percent)+'%']]),
   read:'Relative rate = ('+v123N(area)+' × '+v123N(gradient)+' ÷ '+v123N(thickness)+') / (70 × 60) = '+v123N(relative,4)+', or '+v123N(percent)+'% of the reference. Halving usable area halves this model’s rate; doubling thickness also halves it, with other terms fixed. Increasing the pressure difference does not restore lost surface area.'};
 }
};
