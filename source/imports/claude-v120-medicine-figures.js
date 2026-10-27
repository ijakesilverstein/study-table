/* V120 explorable figures for the medicine curriculum. Uses the V114 figure API. */

V114_FIGURES['homeostasis']={
 title:'Push the value and watch the loop push back',
 intro:'Move the disturbance and the loop responds in the opposite direction. Switch the sign of the response to see why control needs negative feedback.',
 controls:[
  {id:'dev',label:'Disturbance from the set point',unit:'°C',min:-1.5,max:1.5,step:0.25,value:0.5},
  {id:'mode',type:'select',label:'Response direction',options:[['neg','Negative feedback (opposite sign)'],['pos','Positive feedback (same sign)']]}],
 draw(s){
  const set=37,start=set+Number(s.dev),neg=s.mode==='neg';
  const pts=[];let v=start;
  for(let i=0;i<=10;i++){pts.push(v);v=neg?set+(v-set)*0.62:set+(v-set)*1.30}
  const X=i=>60+i/10*360,Y=t=>190-(t-35.5)/3*150;
  let path='';pts.forEach((p,i)=>{path+=(i?'L':'M')+X(i)+' '+Y(Math.max(35.5,Math.min(38.5,p)))});
  const body=v114Axes(60,210,370,165)+
   '<path d="M60 '+Y(set)+'H430" stroke="currentColor" stroke-dasharray="5 5"/>'+
   v114Text(2,Y(set)+4,'set point 37')+
   '<path d="'+path+'" fill="none" stroke="var(--study-warm)" stroke-width="3"/>'+
   pts.map((p,i)=>'<circle cx="'+X(i)+'" cy="'+Y(Math.max(35.5,Math.min(38.5,p)))+'" r="3.5" fill="var(--study-warm)"/>').join('')+
   v114Text(62,24,'temperature (°C)')+v114Text(330,232,'time →');
  const end=pts[pts.length-1];
  return{html:v114Svg(450,245,'Temperature starting at '+v114N(start,2)+' degrees and '+(neg?'returning toward':'running away from')+' the set point of 37.',body),
   read:neg
    ?'Error starts at '+v114N(start-set,2)+' °C. Each step the effector acts in the opposite direction, so the error shrinks and the value settles near 37 °C (now '+v114N(end,2)+'). The response is self-limiting: as the gap closes, the correction eases.'
    :'With the response in the same direction as the error, the gap grows at every step — from '+v114N(start-set,2)+' °C to '+v114N(end-set,2)+' °C. Positive feedback drives a value away from its starting point, which is why control loops cannot be built from it.'};
 }};

V114_FIGURES['blood-pressure']={
 title:'From a cuff reading to a mean',
 intro:'The mean sits nearer the diastolic value because the heart spends more of each cycle relaxed than ejecting. Move either number and compare the true mean with the midpoint.',
 controls:[
  {id:'sbp',label:'Systolic',unit:'mmHg',min:80,max:200,step:5,value:120},
  {id:'dbp',label:'Diastolic',unit:'mmHg',min:40,max:120,step:5,value:80}],
 draw(s){
  const sbp=Math.max(Number(s.sbp),Number(s.dbp)+10),dbp=Number(s.dbp);
  const pp=sbp-dbp,map=dbp+pp/3,mid=(sbp+dbp)/2;
  const Y=v=>215-(v-30)/180*170;
  let wave='M55 '+Y(dbp);
  for(let i=0;i<=360;i++){const x=55+i,ph=(i%90)/90;
   const v=ph<0.33?dbp+(sbp-dbp)*Math.sin(ph/0.33*Math.PI/2):dbp+(sbp-dbp)*Math.pow(1-(ph-0.33)/0.67,1.7);
   wave+='L'+x+' '+Y(v)}
  const body=v114Axes(55,215,365,175)+
   '<path d="'+wave+'" fill="none" stroke="currentColor" stroke-width="2"/>'+
   '<path d="M55 '+Y(map)+'H420" stroke="var(--study-warm)" stroke-width="2.5"/>'+
   v114Text(424,Y(map)+4,'MAP')+
   '<path d="M55 '+Y(mid)+'H420" stroke="currentColor" stroke-dasharray="4 4"/>'+
   v114Text(424,Y(mid)+4,'mid')+
   v114Text(8,Y(sbp)+4,v114N(sbp))+v114Text(8,Y(dbp)+4,v114N(dbp))+
   v114Text(60,26,'pressure (mmHg)');
  return{html:v114Svg(470,240,'An arterial pressure trace between '+dbp+' and '+sbp+' with the mean arterial pressure marked at '+v114N(map,1)+'.',body),
   read:'Pulse pressure = '+sbp+' − '+dbp+' = '+pp+' mmHg. MAP ≈ '+dbp+' + '+pp+'/3 = '+v114N(map,1)+' mmHg. The midpoint would have said '+v114N(mid,1)+' — higher by '+v114N(mid-map,1)+' mmHg, because it ignores how much longer diastole lasts.'};
 }};

V114_FIGURES['kidney-balance']={
 title:'Filtered, reclaimed, excreted',
 intro:'Almost everything that crosses the filter comes back. Change how much is reabsorbed and watch what reaches the urine.',
 controls:[
  {id:'gfr',label:'Filtered per day',unit:'L',min:120,max:220,step:10,value:180},
  {id:'reab',label:'Reabsorbed',unit:'%',min:97,max:99.9,step:0.1,value:99.2}],
 draw(s){
  const gfr=Number(s.gfr),frac=Number(s.reab)/100,urine=gfr*(1-frac),reab=gfr-urine;
  const W=360,uw=Math.max(urine/gfr*W,2);
  const body='<rect x="50" y="48" width="'+W+'" height="34" fill="var(--study-panel)" stroke="currentColor"/>'+
   v114Text(50,40,'filtered at the glomerulus: '+v114N(gfr)+' L/day')+
   '<rect x="50" y="118" width="'+(W-uw)+'" height="34" fill="var(--study-warm)" opacity=".45" stroke="currentColor"/>'+
   v114Text(50,110,'reabsorbed by the tubule: '+v114N(reab,1)+' L/day')+
   '<rect x="'+(50+W-uw)+'" y="188" width="'+uw+'" height="34" fill="currentColor" opacity=".55" stroke="currentColor"/>'+
   v114Text(50,180,'excreted as urine: '+v114N(urine,2)+' L/day')+
   '<path d="M'+(50+W-uw)+' 82V118M'+(50+W-uw)+' 152V188" stroke="currentColor" stroke-dasharray="3 3"/>';
  return{html:v114Svg(450,240,'Three bars: '+v114N(gfr)+' litres filtered, '+v114N(reab,1)+' reabsorbed and '+v114N(urine,2)+' excreted per day.',body),
   read:v114N(gfr)+' L filtered, '+v114N(reab,1)+' L reclaimed, '+v114N(urine,2)+' L excreted — '+v114N(frac*100,1)+' % taken back. Fine control of output comes from adjusting reabsorption: a change of just one percentage point here moves urine volume by '+v114N(gfr*0.01,2)+' L a day.'};
 }};

V114_FIGURES['drug-halflife']={
 title:'Count half-lives, not hours',
 intro:'The fraction remaining depends only on how many half-lives have passed. Change the dose and watch the curve move up without changing its shape.',
 controls:[
  {id:'dose',label:'Dose',unit:'mg',min:100,max:800,step:100,value:400},
  {id:'hl',label:'Half-life',unit:'h',min:2,max:12,step:1,value:6},
  {id:'t',label:'Time elapsed',unit:'h',min:0,max:48,step:3,value:24}],
 draw(s){
  const d=Number(s.dose),hl=Number(s.hl),t=Number(s.t),n=t/hl,left=d*Math.pow(0.5,n);
  const X=h=>55+h/48*360,Y=a=>205-a/800*165;
  let path='';for(let h=0;h<=48;h+=0.5){path+=(h?'L':'M')+X(h)+' '+Y(d*Math.pow(0.5,h/hl))}
  let marks='';for(let k=1;k*hl<=48;k++){marks+='<path d="M'+X(k*hl)+' '+Y(d*Math.pow(0.5,k))+'V205" stroke="currentColor" stroke-dasharray="2 4"/>'+v114Text(X(k*hl)-4,222,String(k))}
  const body=v114Axes(55,205,365,170)+
   '<path d="'+path+'" fill="none" stroke="currentColor" stroke-width="2.5"/>'+marks+
   '<circle cx="'+X(t)+'" cy="'+Y(left)+'" r="5.5" fill="var(--study-warm)"/>'+
   v114Text(X(t)+8,Y(left)-8,v114N(left,1)+' mg')+
   v114Text(60,26,'amount in the body (mg)')+v114Text(300,238,'half-lives elapsed');
  return{html:v114Svg(450,248,'A decay curve from '+d+' milligrams, marked at '+v114N(left,1)+' milligrams after '+t+' hours.',body),
   read:t+' h ÷ '+hl+' h = '+v114N(n,2)+' half-lives, so (½)^'+v114N(n,2)+' = '+v114N(Math.pow(0.5,n)*100,1)+' % remains: '+v114N(left,1)+' mg. Doubling the dose would not double this time — it would add exactly one half-life, '+hl+' hours, however large the dose.'};
 }};

V114_FIGURES['test-interpretation']={
 title:'Count people, not percentages',
 intro:'Keep the test fixed and move the prevalence. The four cells are counted out of 10,000 people, so you can see where the false positives come from.',
 controls:[
  {id:'prev',label:'Prevalence',unit:'%',min:0.5,max:50,step:0.5,value:1},
  {id:'sens',label:'Sensitivity',unit:'%',min:80,max:99.9,step:0.5,value:99},
  {id:'spec',label:'Specificity',unit:'%',min:80,max:99.9,step:0.5,value:95}],
 draw(s){
  const N=10000,p=Number(s.prev)/100,se=Number(s.sens)/100,sp=Number(s.spec)/100;
  const dis=N*p,well=N-dis,tp=dis*se,fn=dis-tp,fp=well*(1-sp),tn=well-fp;
  const ppv=tp+fp>0?tp/(tp+fp)*100:0;
  const total=tp+fp,W=330;
  const tw=total>0?tp/total*W:0;
  const cell=(x,y,lab,val,fill)=>'<rect x="'+x+'" y="'+y+'" width="150" height="52" fill="'+fill+'" stroke="currentColor"/>'+v114Text(x+9,y+21,lab)+v114Text(x+9,y+41,v114N(Math.round(val)));
  const body=v114Text(100,22,'has it')+v114Text(265,22,'does not')+
   v114Text(6,62,'test +')+v114Text(6,128,'test −')+
   cell(70,34,'true positive',tp,'var(--study-warm)')+
   cell(235,34,'FALSE positive',fp,'var(--study-panel)')+
   cell(70,100,'false negative',fn,'var(--study-panel)')+
   cell(235,100,'true negative',tn,'var(--study-panel)')+
   v114Text(6,185,'of everyone who tests positive, '+v114N(ppv,1)+' % really have it:')+
   '<rect x="70" y="196" width="'+W+'" height="26" fill="var(--study-panel)" stroke="currentColor"/>'+
   '<rect x="70" y="196" width="'+tw+'" height="26" fill="var(--study-warm)" opacity=".7"/>'+
   '<path d="M'+(70+tw)+' 192V230" stroke="currentColor" stroke-width="2"/>'+
   v114Text(70,250,'← '+v114N(Math.round(tp))+' true')+
   v114Text(70+W-110,250,v114N(Math.round(fp))+' false →');
  return{html:v114Svg(450,262,'A two-by-two table of 10,000 people with '+v114N(Math.round(tp))+' true positives and '+v114N(Math.round(fp))+' false positives, giving a predictive value of '+v114N(ppv,1)+' per cent.',body),
   read:'Out of 10,000: '+v114N(Math.round(dis))+' have it and '+v114N(Math.round(well))+' do not. True positives '+v114N(Math.round(tp))+'; false positives '+v114N(Math.round(fp))+'. A positive result is right '+v114N(ppv,1)+' % of the time. The test never changed — only how many people the false-positive rate is applied to.'};
 }};

V114_FIGURES['gas-exchange']={
 title:'Three terms, and only one is breathing',
 intro:'Transfer rises with surface area and with the pressure gradient, and falls as the barrier thickens. Change one at a time and see which ones breathing can actually fix.',
 controls:[
  {id:'area',label:'Surface area',unit:'m²',min:10,max:80,step:5,value:70},
  {id:'grad',label:'Pressure gradient',unit:'mmHg',min:10,max:80,step:5,value:60},
  {id:'thick',label:'Barrier thickness',unit:'× normal',min:1,max:5,step:0.5,value:1}],
 draw(s){
  const a=Number(s.area),g=Number(s.grad),th=Number(s.thick);
  const base=70*60/1,rate=a*g/th,pct=rate/base*100;
  const bar=(y,label,frac,text)=>v114Text(8,y+5,label)+'<rect x="150" y="'+(y-13)+'" width="'+Math.max(frac*230,1)+'" height="20" fill="var(--study-warm)" opacity=".55" stroke="currentColor"/>'+v114Text(390,y+5,text);
  const body=bar(40,'surface area',a/80,v114N(a)+' m²')+
   bar(90,'gradient',g/80,v114N(g)+' mmHg')+
   bar(140,'thickness',th/5,v114N(th,1)+'×')+
   '<path d="M8 168H440" stroke="currentColor"/>'+
   v114Text(8,196,'relative transfer rate')+
   '<rect x="150" y="183" width="'+Math.max(Math.min(pct/100,1)*230,1)+'" height="20" fill="currentColor" opacity=".5" stroke="currentColor"/>'+
   v114Text(390,196,v114N(pct,0)+' %');
  return{html:v114Svg(450,215,'Bars for surface area, gradient and thickness, with a relative transfer rate of '+v114N(pct,0)+' per cent of normal.',body),
   read:'Rate ∝ area × gradient ÷ thickness = '+v114N(a)+' × '+v114N(g)+' ÷ '+v114N(th,1)+', which is '+v114N(pct,0)+' % of a healthy lung. Breathing harder raises only the gradient; it cannot restore lost area or undo a thickened barrier, which is why more ventilation does not fix every cause of a low oxygen level.'};
 }};

