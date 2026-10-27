/* V113 explorable figures for the quantitative courses. */
const V114_FIGURES={};
const v114N=(v,d)=>{const n=Number(v);return Number.isInteger(n)?String(n):n.toFixed(d===undefined?2:d).replace(/\.?0+$/,'')};
const v114Svg=(w,h,label,body)=>'<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+escape(label)+'">'+body+'</svg>';
const v114Axes=(x0,y0,w,h)=>'<path d="M'+x0+' '+(y0-h)+'V'+y0+'H'+(x0+w)+'" fill="none" stroke="currentColor"/>';
const v114Text=(x,y,t,extra)=>'<text x="'+x+'" y="'+y+'" font-size="13"'+(extra||'')+'>'+escape(t)+'</text>';

function v114Control(c){
 const id='v114-'+c.id;
 if(c.type==='select')return '<p class="v114-control"><label for="'+id+'">'+escape(c.label)+'</label><select id="'+id+'" data-v114="'+c.id+'">'+c.options.map(o=>'<option value="'+o[0]+'">'+escape(o[1])+'</option>').join('')+'</select></p>';
 return '<p class="v114-control"><label for="'+id+'">'+escape(c.label)+' <output id="v114-out-'+c.id+'"></output></label><input type="range" id="'+id+'" data-v114="'+c.id+'" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+c.value+'"></p>';
}

function v114Figure(id){
 const spec=V114_FIGURES[id];if(!spec)return;
 const host=document.querySelector('#courseArticle .explanation');if(!host||document.getElementById('v114Canvas'))return;
 const alternate=['product-rule','physics-2','physics-5'].includes(id);
 host.insertAdjacentHTML('beforeend',(alternate?'<details class="optional v114-alternative"><summary>Another exploration: '+escape(spec.title)+'</summary>':'')+'<section class="explore-figure v114-figure" aria-labelledby="v114FigTitle"><h3 id="v114FigTitle">'+escape(spec.title)+'</h3><p>'+escape(spec.intro)+'</p><div class="v114-controls">'+spec.controls.map(v114Control).join('')+'</div><div class="quantity-figure" id="v114Canvas" tabindex="0" role="region" aria-label="Exploration diagram; scroll sideways if needed"></div><p class="calculation" id="v114Read" role="status"></p></section>'+(alternate?'</details>':''));
 const state={};spec.controls.forEach(c=>{state[c.id]=c.type==='select'?c.options[0][0]:c.value});
 const update=()=>{
  if(id==='calculus-1'){state.t2=Math.max(Number(state.t2),Number(state.t1)+1);document.getElementById('v114-t2').min=String(Number(state.t1)+1)}
  if(id==='physics-2'){state.f=Math.min(Number(state.f),20*Number(state.h));document.getElementById('v114-f').max=String(Math.min(80,20*Number(state.h)))}
  spec.controls.forEach(c=>{document.getElementById('v114-'+c.id).value=String(state[c.id]);const out=document.getElementById('v114-out-'+c.id);if(out){const value=(c.show?c.show(state[c.id]):v114N(state[c.id]))+(c.unit?' '+c.unit:'');out.textContent=value;document.getElementById('v114-'+c.id).setAttribute('aria-valuetext',value)}});
  const r=spec.draw(state)||{};
  document.getElementById('v114Canvas').innerHTML=r.html||'';
  document.getElementById('v114Read').textContent=r.read||'';
 };
 host.querySelectorAll('[data-v114]').forEach(el=>el.addEventListener('input',()=>{
  state[el.dataset.v114]=el.tagName==='SELECT'?(isNaN(Number(el.value))?el.value:Number(el.value)):Number(el.value);update();
 }));
 update();
}

/* ---------- calculus ---------- */

V114_FIGURES['algebra-for-rates']={
 title:'Shrink h and watch the fraction settle',
 intro:'This is f(x)=x² at x=3. Every step of the simplification is shown, so you can see which pieces cancel and what the fraction approaches.',
 controls:[{id:'h',type:'select',label:'Size of the input change h',options:[[1,'h = 1'],[0.5,'h = 0.5'],[0.25,'h = 0.25'],[0.1,'h = 0.1'],[0.01,'h = 0.01']]}],
 draw(s){
  const h=s.h,top=(3+h)*(3+h),q=6+h;
  const X=v=>40+(v-5.9)/1.2*380;
  const body=v114Axes(30,150,410,0)+
   [6,6.5,7].map(t=>'<path d="M'+X(t)+' 143V157" stroke="currentColor"/>'+v114Text(X(t)-10,175,v114N(t))).join('')+
   '<path d="M'+X(6)+' 95V150" stroke="currentColor" stroke-dasharray="4 4"/>'+v114Text(X(6)-20,88,'limit 6')+
   '<circle cx="'+X(Math.min(q,7.1))+'" cy="150" r="6" fill="currentColor"/>'+
   v114Text(X(Math.min(q,7.1))-16,125,v114N(q,3));
  return{html:v114Svg(470,195,'A number line from 5.9 to 7.1. The value 6 plus h sits at '+v114N(q,3)+', approaching the limit 6.',body),
   read:'f(3+h) = (3+'+v114N(h,2)+')² = '+v114N(top,4)+'. Subtract f(3)=9 to leave '+v114N(top-9,4)+', which is h(6+h). Divide by h: '+v114N(q,3)+'. As h shrinks the fraction settles on 6, and it never needs h to equal zero.'};
 }};

V114_FIGURES['calculus-1']={
 title:'Pick two observations and read the average',
 intro:'Position follows s(t)=t². Choose the two times you watch between. The straight line joining them is the average rate over that interval.',
 controls:[{id:'t1',label:'Start time',unit:'s',min:0,max:4,step:1,value:1},{id:'t2',label:'End time',unit:'s',min:1,max:5,step:1,value:3}],
 draw(s){
  const t1=s.t1,t2=Math.max(s.t2,t1+1),s1=t1*t1,s2=t2*t2,ds=s2-s1,dt=t2-t1,avg=ds/dt;
  const X=t=>50+t/5*370,Y=p=>230-p/25*185;
  let curve='M'+X(0)+' '+Y(0);for(let i=1;i<=50;i++){const t=i/10;curve+='L'+X(t)+' '+Y(t*t)}
  const body=v114Axes(50,230,380,195)+
   '<path d="'+curve+'" fill="none" stroke="currentColor" stroke-width="2.5"/>'+
   '<path d="M'+X(t1)+' '+Y(s1)+'L'+X(t2)+' '+Y(s2)+'" stroke="var(--study-warm)" stroke-width="3"/>'+
   '<path d="M'+X(t1)+' '+Y(s1)+'H'+X(t2)+'" stroke="currentColor" stroke-dasharray="4 4"/>'+
   '<path d="M'+X(t2)+' '+Y(s1)+'V'+Y(s2)+'" stroke="currentColor" stroke-dasharray="4 4"/>'+
   v114Text((X(t1)+X(t2))/2-16,Y(s1)+18,'Δt = '+dt)+
   v114Text(X(t2)>350?X(t2)-70:X(t2)+8,(Y(s1)+Y(s2))/2,'Δs = '+ds)+
   '<circle cx="'+X(t1)+'" cy="'+Y(s1)+'" r="5" fill="currentColor"/><circle cx="'+X(t2)+'" cy="'+Y(s2)+'" r="5" fill="currentColor"/>'+
   v114Text(55,22,'position (m)')+v114Text(330,252,'time (s)');
  return{html:v114Svg(450,265,'Position–time curve for s=t squared with a straight line joining t='+t1+' and t='+t2+'.',body),
   read:'Δs = '+s2+' − '+s1+' = '+ds+' m. Δt = '+t2+' − '+t1+' = '+dt+' s. Average = '+ds+'/'+dt+' = '+v114N(avg,2)+' m/s. Notice it always equals t₁ + t₂ here, and both changes come from the same two observations.'};
 }};

V114_FIGURES['derivative-rules']={
 title:'Differentiate one term at a time',
 intro:'Each term is handled on its own line. Watch what happens to the multiplying constant and to the term that never changes.',
 controls:[
  {id:'poly',type:'select',label:'Position rule',options:[['a','s(t) = 3t² + 2t + 5'],['b','s(t) = 10 − t²'],['c','s(t) = 2t³ − 4t + 7']]},
  {id:'t',label:'Evaluate at t =',unit:'s',min:0,max:4,step:1,value:2}],
 draw(s){
  const P={a:[[3,2],[2,1],[5,0]],b:[[10,0],[-1,2]],c:[[2,3],[-4,1],[7,0]]}[s.poly];
  const term=(c,p)=>(p===0?v114N(c):(c===1?'':c===-1?'−':v114N(c))+'t'+(p===1?'':'²³'[p-2]||('^'+p)));
  const rows=P.map(([c,p])=>{
   const d=p===0?'0':term(c*p,p-1);
   return '<tr><td>'+escape(term(c,p))+'</td><td>'+escape(d)+'</td><td>'+escape(p===0?'A fixed head start never changes, so it adds no rate.':'The exponent drops by one and multiplies the front.')+'</td></tr>';
  }).join('');
  const t=s.t,val=P.reduce((a,[c,p])=>a+c*Math.pow(t,p),0),der=P.reduce((a,[c,p])=>a+(p===0?0:c*p*Math.pow(t,p-1)),0);
  return{html:'<table class="v114-table"><thead><tr><th>Term</th><th>Its derivative</th><th>Why</th></tr></thead><tbody>'+rows+'</tbody></table>',
   read:'At t = '+t+': position s = '+v114N(val)+' m, velocity s′ = '+v114N(der)+' m/s. The two are different quantities with different units, read from the same rule.'};
 }};

V114_FIGURES['product-rule']={
 title:'Where the new area actually arrives',
 intro:'Vary the starting time as well as h. This uses exact changes for L=t+1 and W=t², including the width’s h² term.',
 controls:[{id:'t',label:'Time t =',unit:'s',min:1,max:3,step:1,value:2},{id:'h',type:'select',label:'Time increment h',options:[[0.5,'h = 0.5'],[0.25,'h = 0.25'],[0.1,'h = 0.1']]}],
 draw(s){
  const t=s.t,h=s.h,L=t+1,W=t*t,Lp=1,Wp=2*t,dL=h,dW=2*t*h+h*h;
  const sc=Math.min(230/(L+dL),150/(W+dW)),x0=60,y0=215;
  const w=L*sc,ht=W*sc,dw=dL*sc,dh=dW*sc;
  const body='<rect x="'+x0+'" y="'+(y0-ht)+'" width="'+w+'" height="'+ht+'" fill="var(--study-panel)" stroke="currentColor"/>'+
   '<rect x="'+(x0+w)+'" y="'+(y0-ht)+'" width="'+dw+'" height="'+ht+'" fill="var(--study-warm)" opacity=".55" stroke="currentColor"/>'+
   '<rect x="'+x0+'" y="'+(y0-ht-dh)+'" width="'+w+'" height="'+dh+'" fill="var(--study-warm)" opacity=".3" stroke="currentColor"/>'+
   '<rect x="'+(x0+w)+'" y="'+(y0-ht-dh)+'" width="'+dw+'" height="'+dh+'" fill="currentColor" opacity=".45" stroke="currentColor"/>'+
   v114Text(x0+w/2-22,y0+20,'L = '+v114N(L)+' m')+v114Text(5,y0-ht/2,'W = '+v114N(W)+' m')+
   v114Text(x0+w+dw+10,y0-ht/2,'W·ΔL')+v114Text(x0+w/2-20,y0-ht-dh-9,'L·ΔW')+
   v114Text(x0+w+dw+10,y0-ht-dh+4,'corner');
  const sA=W*dL,sB=L*dW,corner=dL*dW;
  return{html:v114Svg(470,240,'A rectangle of '+v114N(L)+' by '+v114N(W)+' metres with a strip added on the right, a strip added on top, and a small corner square between them.',body),
   read:'Right strip W·ΔL = '+v114N(sA,6)+' m². Top strip L·ΔW = '+v114N(sB,6)+' m². Corner = '+v114N(corner,6)+' m². Divide their total by h: '+v114N((sA+sB+corner)/h,6)+' m²/s. As h shrinks, this interval average approaches L′W + LW′ = '+v114N(Lp*W+L*Wp)+' m²/s.'};
 }};

V114_FIGURES['calculus-3']={
 title:'Two rates, two different questions',
 intro:'A circular spill grows. One rate says how much area an extra metre of radius brings; the other says how fast the radius is arriving.',
 controls:[{id:'rate',type:'select',label:'How fast the radius grows',options:[[2,'dr/dt = 2 m/s'],[1,'dr/dt = 1 m/s'],[3,'dr/dt = 3 m/s']]},{id:'t',label:'Time t =',unit:'s',min:1,max:4,step:1,value:2}],
 draw(s){
  const dr=s.rate,r=dr*s.t,dAdr=2*Math.PI*r,dAdt=dAdr*dr;
  const sc=7.5,R=r*sc,ring=dr*0.1*sc;
  const body='<circle cx="130" cy="120" r="'+R+'" fill="var(--study-panel)" stroke="currentColor" stroke-width="2"/>'+
   '<circle cx="130" cy="120" r="'+(R+ring)+'" fill="var(--study-warm)" opacity=".35" stroke="currentColor" stroke-dasharray="4 4"/>'+
   '<path d="M130 120H'+(130+R)+'" stroke="currentColor" stroke-width="2"/>'+
   v114Text(70,240,'r = '+v114N(r)+' m')+
   v114Text(250,70,'dA/dr = 2πr = '+v114N(dAdr,1))+
   v114Text(250,100,'dr/dt = '+v114N(dr))+
   v114Text(250,130,'dA/dt = '+v114N(dAdt,1)+' m²/s')+
   v114Text(250,165,'The metres cancel,')+v114Text(250,183,'leaving area per second.');
  return{html:v114Svg(470,260,'A circle of radius '+v114N(r)+' metres with a thin ring of new area around it.',body),
   read:'At t = '+s.t+' s, r = '+v114N(r)+' m. dA/dr = 2πr ≈ '+v114N(dAdr,1)+' m²/m. With dr/dt = '+v114N(dr)+' m/s, dA/dt = 2π × '+v114N(r)+' × '+v114N(dr)+' ≈ '+v114N(dAdt,1)+' m²/s.'};
 }};

V114_FIGURES['calculus-5']={
 title:'Move the short side and watch the area',
 intro:'The wall supplies one side. Twenty metres of fence cover the other three, so 2x + y = 20. Slide x and watch what the trade-off does to the area.',
 controls:[{id:'x',label:'Short side x =',unit:'m',min:1,max:9,step:1,value:3}],
 draw(s){
  const x=s.x,y=20-2*x,A=x*y;
  const gx=58,gy=190,gw=Math.max(y*9,10),gh=x*13;
  const CX=v=>270/1*1+(v/10*170)+5,CY=a=>218-a/50*155;
  let curve='M'+CX(0)+' '+CY(0);for(let i=1;i<=100;i++){const v=i/10;curve+='L'+CX(v)+' '+CY(v*(20-2*v))}
  const body=v114Text(gx+gw/2-14,gy-gh-12,'wall')+
   '<path d="M'+(gx-5)+' '+(gy-gh)+'H'+(gx+gw+5)+'" stroke="currentColor" stroke-width="6"/>'+
   '<rect x="'+gx+'" y="'+(gy-gh)+'" width="'+gw+'" height="'+gh+'" fill="var(--study-panel)" stroke="currentColor"/>'+
   v114Text(gx+gw/2-30,gy+24,'y = '+v114N(y)+' m')+v114Text(gx+gw+8,gy-gh/2+4,'x = '+x)+
   v114Axes(275,218,175,160)+'<path d="'+curve+'" fill="none" stroke="currentColor" stroke-width="2.5"/>'+
   '<path d="M268 '+CY(50)+'H275" stroke="currentColor"/>'+v114Text(238,CY(50)+4,'50')+
   '<circle cx="'+CX(x)+'" cy="'+CY(A)+'" r="5.5" fill="var(--study-warm)"/>'+
   '<path d="M'+CX(5)+' '+CY(50)+'V218" stroke="currentColor" stroke-dasharray="3 4"/>'+
   v114Text(CX(5)-12,236,'x=5')+
   v114Text(280,34,'area (m\u00b2)')+v114Text(410,248,'x (m)');
  return{html:v114Svg(470,262,'A garden against a wall measuring '+v114N(y)+' by '+x+' metres, beside a curve of area against x peaking at 50 square metres when x is 5.',body),
   read:'Two short sides use 2 \u00d7 '+x+' = '+v114N(2*x)+' m, leaving y = '+v114N(y)+' m. Area = '+x+' \u00d7 '+v114N(y)+' = '+v114N(A)+' m\u00b2. The derivative of 20x \u2212 2x\u00b2 is 20 \u2212 4x, zero at x = 5, where the area reaches 50 m\u00b2.'};
 }};

V114_FIGURES['calculus-4']={
 title:'The area is the distance',
 intro:'Velocity rises steadily from rest. The shaded region under the line is the displacement — compare it with multiplying the final speed by the whole time.',
 controls:[{id:'T',label:'Duration',unit:'s',min:2,max:6,step:1,value:4},{id:'V',label:'Final speed',unit:'m/s',min:2,max:8,step:2,value:6}],
 draw(s){
  const T=s.T,V=s.V,d=T*V/2;
  const X=t=>55+t/6*350,Y=v=>215-v/8*170;
  const body=v114Axes(55,215,360,175)+
   '<path d="M'+X(0)+' '+Y(0)+'L'+X(T)+' '+Y(V)+'L'+X(T)+' '+Y(0)+'Z" fill="var(--study-warm)" opacity=".4" stroke="currentColor" stroke-width="2"/>'+
   '<path d="M'+X(0)+' '+Y(V)+'H'+X(T)+'" stroke="currentColor" stroke-dasharray="4 4"/>'+
   v114Text(X(T/2)-26,Y(V/3)+6,v114N(d)+' m')+
   v114Text(X(T)-12,232,v114N(T)+' s')+v114Text(18,Y(V)+5,v114N(V))+
   v114Text(60,26,'velocity (m/s)')+v114Text(320,237,'time (s)');
  return{html:v114Svg(450,250,'A velocity–time graph rising from zero to '+V+' metres per second over '+T+' seconds, with the triangle beneath it shaded.',body),
   read:'Displacement = ½ × '+T+' × '+V+' = '+v114N(d)+' m. Multiplying the final speed by the duration would give '+v114N(T*V)+' m, which assumes the whole trip happened at top speed. The dashed rectangle is exactly twice the triangle.'};
 }};

V114_FIGURES['integral-substitution']={
 title:'Where the scale factor comes from',
 intro:'For ∫(ax+1)ⁿ dx the substitution u = ax+1 also converts dx into du/a. Change a and watch that factor change the answer.',
 controls:[{id:'a',type:'select',label:'Inside multiplier a',options:[[2,'a = 2'],[3,'a = 3'],[4,'a = 4']]},{id:'n',type:'select',label:'Power n',options:[[3,'n = 3'],[2,'n = 2']]}],
 draw(s){
  const a=s.a,n=s.n,right=1/(a*(n+1)),wrong=1/(n+1),sc=300*right/wrong;
  const body='<rect x="40" y="35" width="'+sc+'" height="26" fill="var(--study-warm)" opacity=".55" stroke="currentColor"/>'+
   v114Text(40,25,'correct coefficient 1/(a(n+1)) = 1/'+v114N(a*(n+1)))+
   '<rect x="40" y="95" width="300" height="26" fill="none" stroke="currentColor" stroke-dasharray="5 4"/>'+
   v114Text(40,85,'without du/a: 1/(n+1) = 1/'+v114N(n+1));
  return{html:'<ol class="v114-steps"><li>Let u = '+a+'x + 1, so du = '+a+' dx and dx = du/'+a+'.</li><li>The integral becomes ∫u<sup>'+n+'</sup> du/'+a+' = u<sup>'+(n+1)+'</sup>/('+a+'×'+(n+1)+').</li><li>Put x back: ('+a+'x+1)<sup>'+(n+1)+'</sup>/'+v114N(a*(n+1))+' + C.</li><li>Differentiate to check: '+(n+1)+'('+a+'x+1)<sup>'+n+'</sup> × '+a+' ÷ '+v114N(a*(n+1))+' = ('+a+'x+1)<sup>'+n+'</sup>. ✓</li></ol>'+v114Svg(470,160,'Two bars comparing the correct coefficient with the larger one obtained by forgetting the scale factor.',body),
   read:'With a = '+a+' and n = '+n+', the answer is ('+a+'x+1)^'+(n+1)+'/'+v114N(a*(n+1))+' + C. Dropping the du/'+a+' would leave a coefficient '+v114N(a)+' times too large — and differentiating it would return '+v114N(a)+'('+a+'x+1)^'+n+' instead of the integrand.'};
 }};

/* ---------- physics ---------- */

V114_FIGURES['units-and-directions']={
 title:'Convert the number, then give it a sign',
 intro:'The size of the motion never changes — only the units used to report it, and the sign that records which way it points. East is positive here.',
 controls:[{id:'kmh',label:'Speed',unit:'km/h',min:9,max:108,step:9,value:72},{id:'dir',type:'select',label:'Direction of travel',options:[['east','East (the positive direction)'],['west','West']]}],
 draw(s){
  const ms=s.kmh/3.6,east=s.dir==='east',signed=east?ms:-ms,len=Math.min(ms/30*170,170);
  const body='<path d="M40 110H430" stroke="currentColor"/><path d="M235 96V124" stroke="currentColor"/>'+
   v114Text(228,142,'0')+v114Text(395,142,'east +')+v114Text(45,142,'west −')+
   '<path d="M235 75H'+(east?235+len:235-len)+'" stroke="var(--study-warm)" stroke-width="7"/>'+
   '<path d="M'+(east?235+len:235-len)+' 75l'+(east?'-11 -8v16z':'11 -8v16z')+'" fill="var(--study-warm)"/>'+
   v114Text(east?245:235-len,58,v114N(signed,2)+' m/s');
  return{html:v114Svg(470,160,'A number line with zero at the centre and an arrow of length proportional to '+v114N(ms,2)+' metres per second pointing '+s.dir+'.',body),
   read:s.kmh+' km/h = '+s.kmh+',000 m in 3,600 s = '+v114N(ms,2)+' m/s. Travelling '+s.dir+', the velocity is '+v114N(signed,2)+' m/s and the speed is '+v114N(ms,2)+' m/s. Speed drops the sign; velocity keeps it.'};
 }};

V114_FIGURES['physics-4']={
 title:'Three quantities, three different answers',
 intro:'An object falls from rest with g = 10 m/s². Move the clock and compare how far it has fallen, how fast it is going, and its acceleration. The bars use separate scales; compare each quantity with itself over time.',
 controls:[{id:'t',label:'Time since release',unit:'s',min:0,max:4,step:0.5,value:2}],
 draw(s){
  const t=s.t,v=10*t,d=5*t*t;
  const bar=(y,label,val,frac,unit)=>v114Text(150,y+5,label)+'<rect x="230" y="'+(y-11)+'" width="'+Math.max(frac*170,0)+'" height="17" fill="var(--study-warm)" opacity=".55" stroke="currentColor"/>'+v114Text(408,y+5,v114N(val,1)+' '+unit);
  const body='<path d="M70 25V215" stroke="currentColor" stroke-dasharray="4 5"/>'+
   '<circle cx="70" cy="'+(28+Math.min(d/80,1)*175)+'" r="11" fill="currentColor"/>'+
   v114Text(28,20,'release')+
   bar(70,'fallen',d,d/80,'m')+bar(125,'speed',v,v/40,'m/s')+bar(180,'acceleration',10,0.25,'m/s²');
  return{html:v114Svg(470,235,'A falling object with bars showing distance fallen '+v114N(d,1)+' metres, speed '+v114N(v,1)+' metres per second, and a constant acceleration of 10.',body),
   read:'After '+v114N(t,1)+' s: fallen ½gt² = '+v114N(d,1)+' m, moving at gt = '+v114N(v,1)+' m/s, with the acceleration still 10 m/s². Doubling the time doubles the speed but quadruples the distance — which is why the later seconds cover more ground.'};
 }};

V114_FIGURES['physics-1']={
 title:'Add the forces first, then divide by mass',
 intro:'Only the forces left over after cancelling produce acceleration. Change the push, the friction and the mass and watch which one each number responds to.',
 controls:[{id:'push',label:'Push to the right',unit:'N',min:0,max:40,step:2,value:22},{id:'fric',label:'Friction to the left',unit:'N',min:0,max:20,step:2,value:6},{id:'m',label:'Mass',unit:'kg',min:1,max:10,step:1,value:4}],
 draw(s){
  const net=s.push-s.fric,a=net/s.m,sc=3.4;
  const arrow=(x,len,up,col)=>Math.abs(len)<1?'':'<path d="M'+x+' '+up+'H'+(x+len)+'" stroke="'+col+'" stroke-width="6"/><path d="M'+(x+len)+' '+up+'l'+(len>0?'-10 -7v14z':'10 -7v14z')+'" fill="'+col+'"/>';
  const body='<rect x="200" y="105" width="70" height="46" fill="var(--study-panel)" stroke="currentColor"/>'+
   '<circle cx="216" cy="156" r="7" fill="currentColor"/><circle cx="254" cy="156" r="7" fill="currentColor"/>'+
   v114Text(205,133,s.m+' kg')+
   arrow(270,s.push*sc,128,'currentColor')+v114Text(275,118,s.push+' N push')+
   arrow(200,-s.fric*sc,90,'var(--study-warm)')+v114Text(Math.max(200-s.fric*sc,8),80,s.fric+' N friction')+
   '<path d="M60 205H420" stroke="currentColor"/>'+
   v114Text(60,196,'net force '+v114N(net)+' N')+
   (Math.abs(net)>0?arrow(200,net*sc,180,'currentColor'):v114Text(200,185,'forces cancel'));
  return{html:v114Svg(470,220,'A cart of '+s.m+' kilograms with a push of '+s.push+' newtons right and friction of '+s.fric+' newtons left.',body),
   read:'Net force = '+s.push+' − '+s.fric+' = '+v114N(net)+' N. a = '+v114N(net)+'/'+s.m+' = '+v114N(a,2)+' m/s²'+(net===0?'. Balanced forces mean no change in velocity — not that the cart must be still.':'. Changing the mass changes the acceleration but not the net force.')};
 }};

V114_FIGURES['physics-2']={
 title:'Follow the energy from top to bottom',
 intro:'A 2 kg sled starts from rest and slides down. The gravitational energy it loses has to end up somewhere — as motion, or as heat.',
 controls:[{id:'h',label:'Drop height',unit:'m',min:1,max:10,step:1,value:5},{id:'f',label:'Energy lost to friction',unit:'J',min:0,max:80,step:4,value:0}],
 draw(s){
  const pe=20*s.h,f=Math.min(s.f,pe),ke=pe-f,v=Math.sqrt(ke);
  const W=330,kw=pe?ke/pe*W:0;
  const body='<path d="M40 40L250 185H40Z" fill="var(--study-panel)" stroke="currentColor"/>'+
   '<circle cx="'+(46+(1-s.h/10)*190)+'" cy="'+(46+(1-s.h/10)*133)+'" r="9" fill="currentColor"/>'+
   v114Text(258,60,'drop '+s.h+' m')+v114Text(258,82,'loses '+v114N(pe)+' J')+
   '<rect x="40" y="215" width="'+W+'" height="24" fill="none" stroke="currentColor"/>'+
   '<rect x="40" y="215" width="'+kw+'" height="24" fill="var(--study-warm)" opacity=".55"/>'+
   v114Text(44,209,'kinetic '+v114N(ke)+' J')+(f>0?v114Text(Math.min(44+kw,250),255,'heat '+v114N(f)+' J'):'');
  return{html:v114Svg(470,265,'A sled on a slope with an energy bar split between kinetic energy '+v114N(ke)+' joules and heat '+v114N(f)+' joules.',body),
   read:'A 2 kg sled dropping '+s.h+' m loses mgh = 2 × 10 × '+s.h+' = '+v114N(pe)+' J. Friction removes '+v114N(f)+' J, leaving '+v114N(ke)+' J of kinetic energy. ½mv² = '+v114N(ke)+' gives v = '+v114N(v,2)+' m/s. Comparing the two ends is enough — nothing in between had to be tracked.'};
 }};

V114_FIGURES['physics-5']={
 title:'Give each cart its share of the momentum',
 intro:'One cart moves, the other waits, and they stick. Change the masses and see why averaging the two velocities only works when the masses match.',
 controls:[{id:'m1',label:'Moving cart mass',unit:'kg',min:1,max:4,step:1,value:2},{id:'v1',label:'Its velocity',unit:'m/s',min:1,max:6,step:1,value:3},{id:'m2',label:'Waiting cart mass',unit:'kg',min:1,max:4,step:1,value:1}],
 draw(s){
  const p=s.m1*s.v1,vf=p/(s.m1+s.m2),avg=s.v1/2;
  const box=(x,y,m,label)=>'<rect x="'+x+'" y="'+(y-m*11)+'" width="'+(28+m*11)+'" height="'+(m*11+18)+'" fill="var(--study-panel)" stroke="currentColor"/>'+v114Text(x+5,y+12,label);
  const body=v114Text(30,28,'before')+box(60,70,s.m1,s.m1+' kg')+box(210,70,s.m2,s.m2+' kg')+
   '<path d="M'+(100+s.m1*11)+' 55H'+(100+s.m1*11+s.v1*11)+'" stroke="var(--study-warm)" stroke-width="5"/>'+
   v114Text(102+s.m1*11,44,s.v1+' m/s')+
   v114Text(30,140,'after')+box(120,185,s.m1+s.m2,(s.m1+s.m2)+' kg')+
   '<path d="M'+(160+(s.m1+s.m2)*11)+' 170H'+(160+(s.m1+s.m2)*11+vf*11)+'" stroke="var(--study-warm)" stroke-width="5"/>'+
   v114Text(162+(s.m1+s.m2)*11,159,v114N(vf,2)+' m/s');
  return{html:v114Svg(470,215,'Two carts before a collision and one joined cart afterwards moving at '+v114N(vf,2)+' metres per second.',body),
   read:'Momentum before = '+s.m1+' × '+s.v1+' = '+v114N(p)+' kg·m/s. Afterwards '+(s.m1+s.m2)+' kg share it: '+v114N(p)+'/'+(s.m1+s.m2)+' = '+v114N(vf,2)+' m/s. Averaging the velocities would give '+v114N(avg,2)+' m/s, which is only right when the two masses are equal.'};
 }};

V114_FIGURES['physics-3']={
 title:'Hold the voltage and change the resistance',
 intro:'The curve shows current against resistance at a fixed voltage. Move either control and watch which quantity responds.',
 controls:[{id:'V',label:'Source voltage',unit:'V',min:3,max:24,step:3,value:12},{id:'R',label:'Resistance',unit:'Ω',min:1,max:12,step:1,value:4}],
 draw(s){
  const I=s.V/s.R;
  const X=r=>60+r/12*350,Y=i=>210-i/s.V*170;
  let curve='';for(let r=1;r<=12;r+=0.25){const i=s.V/r;curve+=(curve?'L':'M')+X(r)+' '+Y(i)}
  const body=v114Axes(60,210,355,175)+'<path d="'+curve+'" fill="none" stroke="currentColor" stroke-width="2.5"/>'+
   '<circle cx="'+X(s.R)+'" cy="'+Y(I)+'" r="5" fill="var(--study-warm)"/>'+
   '<path d="M'+X(s.R)+' '+Y(I)+'V210" stroke="currentColor" stroke-dasharray="3 4"/>'+
   v114Text(65,26,'current (A)')+v114Text(330,232,'resistance (Ω)')+
   v114Text(X(s.R)>340?X(s.R)-70:X(s.R)+8,Math.max(45,Y(I)-12),v114N(I,2)+' A');
  return{html:v114Svg(450,245,'A curve of current against resistance at '+s.V+' volts, marked at '+s.R+' ohms where the current is '+v114N(I,2)+' amps.',body),
   read:'I = V/R = '+s.V+'/'+s.R+' = '+v114N(I,2)+' A. At a fixed voltage, doubling the resistance halves the current — the curve falls away rather than dropping in a straight line. Raising the voltage lifts the whole curve.'};
 }};

V114_FIGURES['waves']={
 title:'Change the frequency, not the speed',
 intro:'In this fixed-speed rope model, raising frequency packs the crests closer together. Changing the stated medium conditions changes the speed.',
 controls:[{id:'v',type:'select',label:'Medium',options:[[12,'Rope model — 12 m/s'],[24,'Rope model — 24 m/s']]},{id:'f',label:'Frequency',unit:'Hz',min:1,max:6,step:1,value:2}],
 draw(s){
  const lam=s.v/s.f,span=24,px=390/span;
  let path='M40 110';for(let x=0;x<=390;x+=3){const m=x/px;path+='L'+(40+x)+' '+(110-38*Math.sin(2*Math.PI*m/lam))}
  const w=lam*px;
  const body='<path d="'+path+'" fill="none" stroke="currentColor" stroke-width="2.5"/>'+
   (w<=390?'<path d="M40 180H'+(40+w)+'" stroke="var(--study-warm)" stroke-width="3"/>'+v114Text(44,200,'λ = '+v114N(lam,2)+' m'):'')+
   v114Text(40,228,'24 metres of rope shown')+
   '<path d="M40 60H120" stroke="var(--study-warm)" stroke-width="3"/><path d="M120 60l-10 -7v14z" fill="var(--study-warm)"/>'+
   v114Text(126,65,'pattern travels at '+s.v+' m/s either way');
  return{html:v114Svg(450,240,'A wave along 24 metres of rope with wavelength '+v114N(lam,2)+' metres.',body),
   read:'λ = v/f = '+s.v+'/'+s.f+' = '+v114N(lam,2)+' m. Raising the frequency packs more crests into the same 24 metres; the speed stays '+s.v+' m/s because the rope, not the shaking, sets it. Switching rope changes the speed — and the wavelength with it.'};
 }};

V114_FIGURES['pressure']={
 title:'Same force, different contact area',
 intro:'The load does not get heavier when it rests on less. Only the amount of force carried by each square metre changes.',
 controls:[{id:'F',label:'Force pressing down',unit:'N',min:20,max:200,step:20,value:100},{id:'A',type:'select',label:'Contact area',options:[[0.02,'0.02 m²'],[0.01,'0.01 m²'],[0.005,'0.005 m²'],[0.05,'0.05 m²']]}],
 draw(s){
  const P=s.F/s.A,w=Math.max(s.A/0.05*260,18),x0=235-w/2;
  const n=6,head=Math.min(5,w/(n*3));
  let arrows='';for(let i=0;i<n;i++){const x=x0+w*(i+0.5)/n;arrows+='<path d="M'+x+' 128V158" stroke="var(--study-warm)" stroke-width="2.5"/><path d="M'+x+' 162l'+(-head)+' -9h'+(2*head)+'z" fill="var(--study-warm)"/>'}
  const body='<rect x="'+(235-70)+'" y="55" width="140" height="70" fill="var(--study-panel)" stroke="currentColor"/>'+
   v114Text(235-46,96,s.F+' N load')+arrows+
   '<rect x="'+x0+'" y="165" width="'+w+'" height="12" fill="currentColor" opacity=".5" stroke="currentColor"/>'+
   '<path d="M30 190H440" stroke="currentColor" stroke-width="2"/>'+
   v114Text(x0,208,'contact area '+v114N(s.A,3)+' m²');
  return{html:v114Svg(470,225,'A load of '+s.F+' newtons resting on a contact strip of '+v114N(s.A,3)+' square metres, with six downward arrows illustrating how the force is spread over the contact area.',body),
   read:'P = F/A = '+s.F+'/'+v114N(s.A,3)+' = '+v114N(P,0)+' Pa. Multiplying back, '+v114N(P,0)+' × '+v114N(s.A,3)+' = '+v114N(P*s.A,0)+' N — the force you started with. Narrowing the contact raises the pressure while the load is unchanged.'};
 }};

