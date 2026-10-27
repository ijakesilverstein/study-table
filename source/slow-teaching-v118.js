const V118_SLOW_TEACHING=__SLOW_TEACHING__;
function v118N(value){return String(Number(value.toFixed(6))).replace(/^-0$/,'0')}
function v118Svg(id,label,body,height=360,width=560){return '<svg viewBox="0 0 '+width+' '+height+'" role="img" aria-label="'+escape(label)+'"><defs><marker id="'+id+'-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="currentColor"/></marker><pattern id="'+id+'-hatch" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 9L9 0" stroke="currentColor" fill="none"/></pattern><clipPath id="'+id+'-clip"><rect x="'+(width===280?35:70)+'" y="40" width="'+(width===280?220:440)+'" height="'+(width===280?180:250)+'"/></clipPath></defs>'+body+'</svg>'}
function v118Text(x,y,text,extra=''){return '<text x="'+x+'" y="'+y+'" '+extra+'>'+escape(text)+'</text>'}
function v118Path(d,extra=''){return '<path d="'+d+'" fill="none" stroke="currentColor" '+(/\bstroke-width=/.test(extra)?'':'stroke-width="2" ')+extra+'/>'}
function v118Arrow(id,x,y,x2,y2,extra=''){return v118Path('M'+x+' '+y+'L'+x2+' '+y2,'marker-end="url(#'+id+'-arrow)" '+extra)}
function v118Dot(x,y){return '<circle cx="'+x+'" cy="'+y+'" r="5" fill="currentColor"/>'}
function v118Curve(fn,x,y,a,b){return Array.from({length:81},(_,i)=>{const t=a+(b-a)*i/80;return (i?'L':'M')+x(t)+' '+y(fn(t))}).join('')}
function v118GraphAxes(x,y,xTicks,yTicks,label){return v118Path('M70 40V290H510')+v118Text(70,25,label)+v118Text(250,352,'Time (s)')+xTicks.map(t=>v118Path('M'+x(t)+' 290v6')+v118Text(x(t)-6,319,v118N(t))).join('')+yTicks.map(t=>v118Path('M64 '+y(t)+'h6')+v118Text(17,y(t)+6,v118N(t))).join('')}

function v118Compact(spec,step,state,id,label){
 const v=spec.values,kind=spec.kind;let body='',height=285;
 const axes=(x,y,xt,yt,title,zero=220)=>v118Path('M35 40V230M35 '+zero+'H255')+v118Text(35,23,title)+v118Text(100,279,'Time (s)')+xt.map(t=>v118Text(x(t)-5,254,t)).join('')+yt.map(t=>v118Text(3,y(t)+5,t)).join('');
 if(kind==='average'){
  const o=Number(state.origin||0),x=t=>35+t*27.5,y=s=>220-s*3.9;
  body=axes(x,y,[0,4,8],[0,20,40],'Position (m)');
  if(o)body=v118Path('M35 40V230M35 220H255')+v118Text(35,23,'Position (m)')+v118Text(100,279,'Time (s)')+[0,4,8].map(t=>v118Text(x(t)-5,254,t)).join('')+[0,20,40].map(s=>v118Text(0,y(s)+5,s+o)).join('');
  body+=v118Path('M90 181L227.5 64','stroke-dasharray="6 4"')+v118Path('M90 181H227.5','class="slow-emphasis" stroke-width="'+(step===1?4:2)+'"')+v118Path('M227.5 181V64','class="slow-emphasis" stroke-width="'+(step===0?4:2)+'"')+v118Dot(90,181)+v118Dot(227.5,64)+v118Text(75,165,'(2, '+(10+o)+')')+v118Text(170,48,'(7, '+(40+o)+')')+v118Text(165,130,'30 m')+v118Text(120,207,'5 s');
 }else if(kind==='roundtrip'){
  const x=t=>35+t*22,y=s=>220-s*8;
  body=axes(x,y,[0,5,10],[0,10,20],'Position (m)')+v118Path('M35 220L145 60L255 220','stroke-width="3"')+v118Path('M35 220H255','class="slow-emphasis" stroke-dasharray="6 4" stroke-width="4"')+v118Dot(35,220)+v118Dot(145,60)+v118Dot(255,220)+v118Text(120,45,'20 m')+v118Text(45,115,'out')+v118Text(215,115,'back');
 }else if(kind==='derivative'){
  const h=Number(state.h),x=t=>35+(t-2)*110,y=s=>220-(s-3)*12;
  body=axes(x,y,[2,3,4],[3,9,16],'Position (m)')+'<g clip-path="url(#'+id+'-clip)">'+v118Path(v118Curve(t=>t*t,x,y,2,4),'stroke-width="3"')+v118Path(v118Curve(t=>9+6*(t-3),x,y,2,4),'stroke-dasharray="6 4"')+(h!==0?v118Path(v118Curve(t=>9+(6+h)*(t-3),x,y,2,4),'class="slow-emphasis" stroke-width="3"')+v118Dot(x(3+h),y((3+h)**2)):'')+v118Dot(x(3),y(9))+'</g>'+v118Text(153,130,'(3, 9)');
 }else if(kind==='two-curves'){
  const x=t=>35+t*55,y=s=>220-s*10;
  body=axes(x,y,[0,2,4],[0,8,16],'Position (m)')+'<g clip-path="url(#'+id+'-clip)">'+v118Path(v118Curve(t=>t*t,x,y,0,4),'stroke-width="3"')+v118Path(v118Curve(t=>3*t,x,y,0,4),'stroke-dasharray="9 5" stroke-width="3"')+(step===2?v118Path(v118Curve(t=>6*t-9,x,y,0,4),'class="slow-emphasis" stroke-dasharray="2 4" stroke-width="3"'):'')+'</g>'+v118Dot(x(3),y(9))+v118Text(155,111,'(3, 9)');
 }else if(kind==='positive-area'){
  const x=t=>35+t*55,y=v=>220-v*20;
  body=axes(x,y,[0,2,4],[0,4,8],'Velocity (m/s)')+'<path d="M90 220V180L200 100V220Z" fill="var(--study-panel)" stroke="currentColor"/>'+v118Path('M35 220L255 60','stroke-width="3"')+v118Path('M90 220V180M200 220V100','class="slow-emphasis" stroke-width="'+(step===1?4:2)+'"')+v118Text(50,165,'2 m/s')+v118Text(202,88,'6 m/s')+v118Text(115,204,'8 m');
 }else if(kind==='signed-area'){
  const x=t=>35+t*110,y=v=>145-v*40;
  body=axes(x,y,[0,1,2],[-2,0,2],'Velocity (m/s)',145)+'<path d="M35 145V225L145 145Z" fill="url(#'+id+'-hatch)" stroke="currentColor"/><path d="M145 145L255 65V145Z" fill="var(--study-panel)" stroke="currentColor"/>'+v118Path('M35 225L255 65','stroke-width="3"')+v118Text(53,240,step===2?'1 m':'−1 m')+v118Text(200,48,step===2?'1 m':'+1 m')+(step===1?v118Dot(145,145)+v118Text(131,126,'turn'):'');
 }else if(kind==='cart'||kind==='balanced-cart'){
  height=345;const balanced=kind==='balanced-cart';
  body=v118Text(35,28,'Right is positive →')+'<rect x="110" y="110" width="65" height="50" fill="var(--study-panel)" stroke="currentColor"/>'+v118Text(120,141,balanced?'cart':'4 kg')+v118Arrow(id,175,135,175+v.right*3,135,'stroke-width="3"')+v118Arrow(id,110,135,110-v.left*3,135,'stroke-width="3"')+v118Text(183,93,v.right+' N')+v118Text(47,93,v.left+' N');
  if(balanced)body+=v118Text(45,215,'Net force: 0 N')+v118Text(45,246,'a = 0 m/s²')+(step===2?v118Arrow(id,95,287,190,287,'stroke-dasharray="6 4"')+v118Text(45,327,'Motion: +2 m/s'):'');
  else if(step>=1)body+=v118Text(45,215,'Calculated net: +16 N')+v118Arrow(id,110,250,158,250,'class="slow-emphasis" stroke-width="3"')+(step>=2?v118Text(45,305,'a = +4 m/s²'):'');
 }else if(kind==='book'||kind==='pressed-book'){
  height=330;const solved=step===2,normal=v.mass*v.g+v.push;
  body=v118Text(25,28,'Up is positive ↑')+v118Text(25,45,'Table: '+(solved?normal+' N up':'N unknown'))+'<rect x="100" y="145" width="80" height="50" fill="var(--study-panel)" stroke="currentColor"/>'+v118Text(119,175,'book')+v118Arrow(id,120,145,120,145-(solved?normal*3.4:75),'stroke-width="3"'+(solved?'':' stroke-dasharray="5 4"'))+v118Arrow(id,120,195,120,263,'stroke-width="3"')+v118Text(25,302,'Earth: 20 N down')+(v.push?v118Arrow(id,172,195,172,215,'stroke-width="3"')+v118Text(157,249,'Hand: 6 N'):'');
 }else{
  height=340;const parallel=kind==='parallel',bx=parallel?35:55;
  const battery=v118Path('M'+bx+' '+(parallel?50:35)+'V140M'+bx+' 160V290')+v118Path('M'+(bx-22)+' 140H'+(bx+22)+'M'+(bx-12)+' 160H'+(bx+12),'stroke-width="3"')+v118Text(0,120,'6 V')+v118Text(bx+27,144,'+')+v118Text(bx+27,166,'−');
  const resistor=(cx,top,ohms)=>'<rect x="'+(cx-20)+'" y="'+top+'" width="40" height="55" fill="var(--study-surface)" stroke="currentColor"/>'+v118Text(cx-14,top+34,ohms+' Ω');
  if(parallel){
   body=battery+v118Path('M35 50H230V110M35 290H230V165M130 50V110M130 165V290','class="slow-emphasis"')+resistor(130,110,2)+resistor(230,110,4)+v118Arrow(id,75,50,105,50)+v118Arrow(id,130,70,130,96)+v118Arrow(id,230,70,230,96)+v118Text(65,27,step===0?'Battery: I total':'Battery: 4.5 A')+v118Text(84,94,'6 V')+v118Text(184,94,'6 V')+v118Text(138,215,step===0?'I₁ ?':'3 A')+v118Text(235,245,step===0?'I₂ ?':'1.5 A');
  }else{
   body=battery+v118Path('M55 35H220V65M220 120V180M220 235V290H55','class="slow-emphasis"')+resistor(220,65,2)+resistor(220,180,4)+v118Arrow(id,90,35,130,35)+v118Arrow(id,220,135,220,162)+v118Arrow(id,150,290,110,290)+v118Text(97,23,step===0?'Current: I':'Current: 1 A')+v118Text(108,100,step===2?'2 V drop':'Drop: V₁')+v118Text(108,216,step===2?'4 V drop':'Drop: V₂');
  }
 }
 return v118Svg(id,label,body,height,280);
}

function v118Draw(spec,step,state,id){
 const v=spec.values,kind=spec.kind;let body='',read='',label='';const n=v118N;
 if(kind==='average'){
  const origin=Number(state.origin||0),x=t=>70+t*55,y=s=>290-s*5.5,ds=v.s2-v.s1,dt=v.t2-v.t1;
  body=v118GraphAxes(x,y,[0,2,4,6,8],[0,10,20,30,40],'Position (m)');
  // Relabel the position origin without changing either separation or the slope.
  if(origin)body=v118Path('M70 40V290H510')+v118Text(70,25,'Position (m) · axis starts at 100 m')+v118Text(250,352,'Time (s)')+[0,2,4,6,8].map(t=>v118Text(x(t)-6,319,t)).join('')+[0,10,20,30,40].map(s=>v118Text(12,y(s)+6,s+origin)).join('');
  body+=v118Path('M'+x(v.t1)+' '+y(v.s1)+'L'+x(v.t2)+' '+y(v.s2),'stroke-dasharray="8 5"')+v118Path('M'+x(v.t1)+' '+y(v.s1)+'H'+x(v.t2),'class="slow-emphasis" stroke-width="'+(step===1?5:2)+'"')+v118Path('M'+x(v.t2)+' '+y(v.s1)+'V'+y(v.s2),'class="slow-emphasis" stroke-width="'+(step===0?5:2)+'"')+v118Dot(x(v.t1),y(v.s1))+v118Dot(x(v.t2),y(v.s2))+v118Text(x(v.t1)-25,y(v.s1)-15,'(2, '+(v.s1+origin)+')')+v118Text(x(v.t2)-55,y(v.s2)-17,'(7, '+(v.s2+origin)+')')+v118Text(245,264,'Δt = 5 s')+v118Text(405,172,'Δs = 30 m');
  read='Position change: '+(v.s2+origin)+' − '+(v.s1+origin)+' = '+ds+' m. Time change: 7 − 2 = '+dt+' s. Average velocity: '+ds+'/'+dt+' = '+n(ds/dt)+' m/s.';
  label=read+' The dashed line joins the two observations; intervening motion was not supplied.';
 }else if(kind==='roundtrip'){
  const x=t=>70+t*44,y=s=>290-s*10;
  body=v118GraphAxes(x,y,[0,5,10],[0,10,20],'Position (m)')+v118Path('M70 290L290 90L510 290','stroke-width="3"')+v118Path('M70 290H510','stroke-dasharray="7 5" class="slow-emphasis" stroke-width="4"')+v118Dot(70,290)+v118Dot(290,90)+v118Dot(510,290)+v118Text(245,70,'turn: 20 m')+v118Text(104,166,'20 m out')+v118Text(357,166,'20 m back')+v118Text(135,247,step===2?'Distance: 20 + 20 = 40 m':'Same start and finish: 0 m');
  read='One illustrated timing: turn at 5 s. Displacement = 0 m; distance = 40 m. Over 10 s: average velocity = 0 m/s; average speed = 4 m/s.';label=read;
 }else if(kind==='derivative'){
  const h=Number(state.h),t=v.time,s=t*t,x=t=>70+(t-2)*220,y=s=>290-(s-3)*17.5,rate=2*t+h;
  body=v118GraphAxes(x,y,[2,3,4],[4,9,16],'Position (m)')+'<g clip-path="url(#'+id+'-clip)">'+v118Path(v118Curve(t=>t*t,x,y,2,4),'stroke-width="3"')+v118Path(v118Curve(z=>s+2*t*(z-t),x,y,2,4),'stroke-dasharray="6 5"')+(h!==0?v118Path(v118Curve(z=>s+rate*(z-t),x,y,2,4),'class="slow-emphasis" stroke-width="3"')+v118Dot(x(t+h),y((t+h)*(t+h))):'')+v118Dot(x(t),y(s))+'</g>'+v118Text(300,y(s)-16,'(3, 9)');
  read=h===0?'Limit view: tangent slope = 6 m/s. There is no interval quotient at h = 0; no division by zero is performed.':'h = '+n(h)+' s. Nearby position = '+n((t+h)*(t+h))+' m. ['+n((t+h)*(t+h))+' − 9] / ('+n(h)+') = '+n(rate)+' m/s. The limiting rate is 6 m/s.';
  label=read+' Close-up: 2–4 s; position axis begins at 3 m. Solid curve: position t squared. Dashed line: limiting tangent.'+(h!==0?' The other straight line is the nonzero-interval secant.':'');
 }else if(kind==='two-curves'){
  const x=t=>70+t*110,y=s=>290-s*15;
  body=v118GraphAxes(x,y,[0,1,2,3,4],[0,4,8,12,16],'Position (m)')+'<g clip-path="url(#'+id+'-clip)">'+v118Path(v118Curve(t=>t*t,x,y,0,4),'stroke-width="3"')+v118Path(v118Curve(t=>3*t,x,y,0,4),'stroke-dasharray="10 5" stroke-width="3"')+(step===2?v118Path(v118Curve(t=>6*t-9,x,y,0,4),'class="slow-emphasis" stroke-dasharray="3 4" stroke-width="3"'):'')+'</g>'+v118Dot(x(3),y(9))+v118Text(x(3)-5,y(9)-18,'(3, 9)');
  read='Solid curve: s₁ = t². Long-dashed line: s₂ = 3t. At t = 3 s both positions are 9 m; velocities are 6 m/s and 3 m/s.'+(step===2?' Short-dashed line: tangent to the curve at their meeting.':'');label=read;
 }else if(kind==='positive-area'){
  const x=t=>70+t*110,y=velocity=>290-velocity*28;
  body=v118GraphAxes(x,y,[0,1,2,3,4],[0,2,4,6,8],'Velocity (m/s)')+'<path d="M'+x(1)+' 290V'+y(2)+'L'+x(3)+' '+y(6)+'V290Z" fill="var(--study-panel)" stroke="currentColor" stroke-width="2"/>'+v118Path(v118Curve(t=>2*t,x,y,0,4),'stroke-width="3"')+v118Path('M'+x(1)+' 290V'+y(2)+'M'+x(3)+' 290V'+y(6),'class="slow-emphasis" stroke-width="'+(step===1?5:2)+'"')+v118Text(x(1)-5,y(2)-15,'2 m/s')+v118Text(x(3)-18,y(6)-15,'6 m/s')+v118Text(230,250,'Area = 8 m');
  read='From 1 to 3 s: F(3) − F(1) = 9 − 1 = 8 m. Geometry check: width 2 s × average height 4 m/s = 8 m.';label=read+' The shaded trapezoid sits under the velocity graph between the two bounds.';
 }else if(kind==='signed-area'){
  const x=t=>70+t*220,y=velocity=>180-velocity*50;
  body=v118Path('M70 40V290M70 180H510')+v118Text(70,25,'Velocity (m/s)')+v118Text(250,352,'Time (s)')+[0,1,2].map(t=>v118Text(x(t)-4,319,t)).join('')+[-2,0,2].map(v=>v118Text(20,y(v)+6,v)).join('')+'<path d="M70 180V280L290 180Z" fill="url(#'+id+'-hatch)" stroke="currentColor"/>'+'<path d="M290 180L510 80V180Z" fill="var(--study-panel)" stroke="currentColor"/>'+v118Path('M70 280L510 80','stroke-width="3"')+v118Text(95,210,step===2?'Length: 1 m':'−1 m')+v118Text(370,157,step===2?'Length: 1 m':'+1 m')+(step===1?v118Dot(290,180)+v118Text(275,150,'v = 0'):'');
  read='The turn is at 1 s. Striped triangle: −1 m displacement. Other triangle: +1 m. Signed total = 0 m; sum of lengths = 2 m.';label=read;
 }else if(kind==='cart'||kind==='balanced-cart'){
  const balanced=kind==='balanced-cart',net=v.right-v.left,scale=6,center=280;
  body=v118Text(70,30,'Horizontal forces on the cart · right is positive')+'<rect x="235" y="105" width="90" height="60" fill="var(--study-panel)" stroke="currentColor"/>'+v118Text(248,143,balanced?'cart':'4 kg')+v118Arrow(id,325,133,325+v.right*scale,133,'stroke-width="3"')+v118Arrow(id,235,133,235-v.left*scale,133,'stroke-width="3"')+v118Text(342,108,'push: '+v.right+' N')+v118Text(balanced?104:108,194,'friction: '+v.left+' N');
  if(step>=1&&!balanced)body+=v118Text(70,245,'Calculated net (not another force):')+v118Arrow(id,center,285,center+net*scale,285,'class="slow-emphasis" stroke-width="3"')+v118Text(282,324,'+16 N');
  if(balanced)body+=v118Text(70,253,'Net force = 0 N; acceleration = 0 m/s²')+(step===2?v118Arrow(id,280,292,375,292,'stroke-dasharray="6 4"')+v118Text(70,329,'Motion information: velocity remains +2 m/s'):'');
  read=balanced?'Net force = +10 − 10 = 0 N. Acceleration = 0 m/s². The supplied velocity remains +2 m/s.':step<2?'Net force = +22 − 6 = +16 N. Only horizontal force components are shown.':'a = Fnet/m = (+16 N)/(4 kg) = +4 m/s². Current velocity is not supplied.';
  label=read+' Solid arrows on the box are forces. Any separate net or motion arrow is labeled separately.';
 }else if(kind==='book'||kind==='pressed-book'){
  const weight=v.mass*v.g,normal=weight+v.push,solved=step===2,up=solved?normal*3.4:75;
  body=v118Text(70,30,'Forces acting on the book · up is positive')+'<rect x="220" y="155" width="120" height="50" fill="var(--study-panel)" stroke="currentColor"/>'+v118Text(252,187,'book')+v118Arrow(id,245,155,245,155-up,'stroke-width="3"'+(solved?'':' stroke-dasharray="5 4"'))+v118Text(42,60,'table on book: '+(solved?normal+' N up':'N unknown'))+v118Arrow(id,270,205,270,205+weight*3.4,'stroke-width="3"')+v118Text(281,286,'Earth on book: 20 N down')+(v.push?v118Arrow(id,322,158,322,158+v.push*3.4,'stroke-width="3"')+v118Text(350,144,'hand on book:')+v118Text(350,171,'6 N down'):'')+v118Text(70,334,solved?'N = '+normal+' N; weight remains 20 N':'Unknown-arrow length is schematic');
  read='Vertical balance: N − 20'+(v.push?' − 6':'')+' = 0. '+(solved?'Table force = '+normal+' N upward.':'N is the unknown table force; solve it from zero acceleration.');label=read+' Only interactions acting on the book are included.';
 }else if(kind==='series'||kind==='parallel'){
  const parallel=kind==='parallel',current=v.voltage/(v.r1+v.r2),i1=v.voltage/v.r1,i2=v.voltage/v.r2;
  const battery=v118Path('M75 65V142M75 162V265')+v118Path('M47 142H103M58 162H92','stroke-width="3"')+v118Text(20,125,'6 V')+v118Text(112,146,'+')+v118Text(112,172,'−');
  const resistor=(x,y,w,h,text)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="var(--study-surface)" stroke="currentColor" stroke-width="2"/>'+v118Text(x+9,y+h/2+6,text);
  if(parallel){
   body=battery+v118Path('M75 65H465V115M75 265H465V185M270 65V115M270 185V265','class="slow-emphasis"')+resistor(242,115,56,70,'2 Ω')+resistor(437,115,56,70,'4 Ω')+v118Arrow(id,120,65,190,65)+v118Arrow(id,270,80,270,104)+v118Arrow(id,465,80,465,104)+v118Text(170,39,step===0?'battery current: I total':'battery current: 4.5 A')+v118Text(213,214,step===0?'I₁ unknown':'I₁ = 3 A')+v118Text(400,214,step===0?'I₂ unknown':'I₂ = 1.5 A')+v118Text(225,242,'6 V')+v118Text(425,242,'6 V')+v118Text(70,321,step===2?'Equivalent resistance: 4/3 Ω ≈ 1.33 Ω':'Two branches across the same terminals');
   read=step===0?'Both resistors have the full 6 V across them. The branch currents are calculated separately.':'I₁ = 6/2 = '+n(i1)+' A; I₂ = 6/4 = '+n(i2)+' A. Battery total = '+n(i1+i2)+' A. R equivalent = 6/4.5 = 4/3 Ω.';
  }else{
   body=battery+v118Path('M75 65H170M245 65H355M430 65H500V265H75','class="slow-emphasis"')+resistor(170,45,75,40,'2 Ω')+resistor(355,45,75,40,'4 Ω')+v118Arrow(id,110,65,150,65)+v118Arrow(id,315,265,265,265)+v118Text(160,128,step===2?'drop: 2 V':'drop: V₁')+v118Text(350,128,step===2?'drop: 4 V':'drop: V₂')+v118Text(165,213,step===0?'One current I through both':'Same 1 A through both')+v118Text(70,321,step===2?'Voltage check: 2 V + 4 V = 6 V':'One continuous path; no branch junction');
   read=step===0?'One common current: 2I + 4I = 6 V, so equivalent resistance is 6 Ω.':'I = 6/6 = '+n(current)+' A through each resistor. Drops: '+n(current*v.r1)+' V and '+n(current*v.r2)+' V; total = 6 V.';
  }label=read+' Conventional current arrows leave the positive battery terminal. Ideal source, wires and ohmic resistors.';
 }
 return {html:'<div class="slow-wide">'+v118Svg(id,label,body)+'</div><div class="slow-compact">'+v118Compact(spec,step,state,id+'-compact',label)+'</div>',read};
}

function v118EnhanceWorked(unit){
 const lesson=V118_SLOW_TEACHING[unit.id];if(!lesson)return;
 for(const [which,sectionId] of [['first','courseFirst'],['second','courseSecond']]){
  const spec=lesson[which],section=$(sectionId),key='slow-'+which,steps=[...section.querySelectorAll('.solution>li')];
  section.querySelector('.case-problem').insertAdjacentHTML('afterend','<p class="slow-opening">'+escape(spec.intro)+'</p><div id="'+key+'-home" class="slow-home"><section id="'+key+'" class="slow-model" tabindex="-1" aria-labelledby="'+key+'-title"><h3 id="'+key+'-title">Follow this on the diagram</h3><p class="slow-directions">Select a step below to bring the diagram beside its explanation.</p>'+(spec.kind==='derivative'?'<label for="'+key+'-interval">Compare another interval</label><select id="'+key+'-interval">'+[[1,'h = 1 s'],[0.1,'h = 0.1 s'],[0.01,'h = 0.01 s'],[-0.1,'h = −0.1 s (look left)'],[-0.01,'h = −0.01 s (look left)'],[0,'Limit as h approaches 0']].map(([value,label])=>'<option value="'+value+'">'+escape(label)+'</option>').join('')+'</select>':spec.kind==='average'?'<label for="'+key+'-origin">Where is position zero?</label><select id="'+key+'-origin"><option value="0">Use the given readings: 10 m and 40 m</option><option value="100">Add 100 m to both: 110 m and 140 m</option></select>':'')+'<div id="'+key+'-view" class="slow-view" tabindex="0" role="region" aria-label="Worked diagram; scroll sideways if needed"></div><p id="'+key+'-reading" class="calculation" role="status"></p><p id="'+key+'-caption" class="slow-caption"></p><button type="button" class="text-button" id="'+key+'-return" hidden>Return diagram to the start of this example</button></section></div>');
  const model=$(key),home=$(key+'-home'),state={h:1,origin:0};let current=0;
  const draw=(caption)=>{const result=v118Draw(spec,current,state,key);$(key+'-view').innerHTML=result.html;$(key+'-reading').textContent=result.read;$(key+'-caption').textContent=caption};
  steps.forEach((li,index)=>{
   const s=spec.steps[index],slot=document.createElement('div');slot.className='slow-slot';slot.dataset.slowSlot=which+'-'+index;
   li.insertAdjacentHTML('beforeend','<p class="slow-note">'+escape(s.note)+'</p><button type="button" class="slow-step-button" data-slow-step="'+which+'-'+index+'" aria-controls="'+key+'" aria-expanded="false">'+escape(s.button)+'</button>');li.append(slot);
   const button=li.querySelector('[data-slow-step]');button.onclick=()=>{
    current=index;state.h=s.h??1;state.origin=0;if($(key+'-interval'))$(key+'-interval').value=String(state.h);if($(key+'-origin'))$(key+'-origin').value='0';
    section.querySelectorAll('[data-slow-step]').forEach(b=>b.setAttribute('aria-expanded',String(b===button)));slot.append(model);model.querySelector('.slow-directions').textContent='Use another step’s button to follow that part of the calculation.';$(key+'-return').hidden=false;draw(s.caption);model.scrollIntoView({block:'start'});model.focus({preventScroll:true});
   };
  });
  const clearSelection=()=>section.querySelectorAll('[data-slow-step]').forEach(b=>b.setAttribute('aria-expanded','false'));
  if($(key+'-interval'))$(key+'-interval').onchange=e=>{state.h=Number(e.target.value);clearSelection();draw(state.h===0?'The limit view shows a tangent, not a quotient with a zero denominator.':'This is a nonzero interval average. Compare its value with the limiting 6 m/s; try an interval on either side of 3 s.')};
  if($(key+'-origin'))$(key+'-origin').onchange=e=>{state.origin=Number(e.target.value);clearSelection();draw(state.origin?'Both position labels increased by 100 m. Their difference, time interval and average velocity are unchanged.':'These are the original observations. Select a step below to follow its calculation.')};
  $(key+'-return').onclick=()=>{home.append(model);model.querySelector('.slow-directions').textContent='Select a step below to bring the diagram beside its explanation.';$(key+'-return').hidden=true;clearSelection();model.scrollIntoView({block:'start'});model.focus({preventScroll:true})};draw(spec.steps[0].caption);
 }
 // Keep earlier explorers available without repeating several large diagrams in the reading flow.
 const older=[...document.querySelectorAll('#courseArticle .explore-figure, #courseFirst > .quantity-figure')];
 if(older.length){const details=document.createElement('details');details.className='optional slow-older';details.innerHTML='<summary>More ways to explore this lesson (optional)</summary><p>The earlier adjustable diagrams are kept here. The worked examples above use the values in their stated problems.</p>';$('courseSecond').after(details);older.forEach(el=>{const wrapper=el.closest('.v114-alternative');details.append(wrapper||el)})}
}
