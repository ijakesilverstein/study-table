/* V120 explorable figures for the business curriculum. Uses the V114 figure API. */

V114_FIGURES['unit-economics']={
 title:'Where the price actually goes',
 intro:'Each bar is one sale. Change the price or a cost line and watch what is left over for everything that does not vary with volume.',
 controls:[
  {id:'price',label:'Price',unit:'$',min:25,max:60,step:1,value:40},
  {id:'mat',label:'Oats and packaging',unit:'$',min:5,max:25,step:1,value:14},
  {id:'ship',label:'Shipping',unit:'$',min:2,max:18,step:1,value:7}],
 draw(s){
  const price=Number(s.price),mat=Number(s.mat),ship=Number(s.ship),lab=5;
  const vc=mat+lab+ship,contrib=price-vc,W=380;
  const sc=W/Math.max(price,1);
  const seg=(x,w,fill,label)=>w<=0?'':'<rect x="'+x+'" y="60" width="'+w+'" height="46" fill="'+fill+'" stroke="currentColor"/>'+(w>52?v114Text(x+6,88,label):'');
  let x=40,body=v114Text(40,46,'one box sold for $'+v114N(price));
  body+=seg(x,mat*sc,'var(--study-panel)','$'+v114N(mat)+' oats');x+=mat*sc;
  body+=seg(x,lab*sc,'var(--study-panel)','$'+lab+' labour');x+=lab*sc;
  body+=seg(x,ship*sc,'var(--study-panel)','$'+v114N(ship)+' ship');x+=ship*sc;
  body+=seg(x,Math.max(contrib,0)*sc,'var(--study-warm)','$'+v114N(contrib)+' left');
  body+='<path d="M40 118H'+(40+vc*sc)+'" stroke="currentColor" stroke-width="2"/>'+v114Text(40,136,'variable cost $'+v114N(vc));
  if(contrib>0)body+='<path d="M'+(40+vc*sc)+' 118H'+(40+price*sc)+'" stroke="var(--study-warm)" stroke-width="3"/>'+v114Text(40+vc*sc,136,'contribution $'+v114N(contrib));
  body+=v114Text(40,176,'500 boxes contribute $'+v114N(contrib*500)+'; fixed costs are $9,000')+
   v114Text(40,200,contrib*500>=9000?'month result: +$'+v114N(contrib*500-9000):'month result: −$'+v114N(9000-contrib*500));
  return{html:v114Svg(450,215,'A price bar of '+v114N(price)+' dollars split into variable costs of '+v114N(vc)+' and a contribution of '+v114N(contrib)+'.',body),
   read:contrib<=0
    ?'Variable cost $'+v114N(vc)+' now meets or exceeds the $'+v114N(price)+' price, so every sale loses money before a single fixed cost is paid. No volume fixes this.'
    :'Contribution = '+v114N(price)+' − '+v114N(vc)+' = $'+v114N(contrib)+' a box, a margin of '+v114N(contrib/price*100,1)+' %. At 500 boxes that is $'+v114N(contrib*500)+' toward $9,000 of fixed costs — contribution, not profit.'};
 }};

V114_FIGURES['breakeven']={
 title:'Where the two lines cross',
 intro:'Revenue rises from zero; total cost starts at the fixed costs. They cross at breakeven. Move contribution and watch the crossing point slide.',
 controls:[
  {id:'fixed',label:'Fixed costs',unit:'$/month',min:3000,max:18000,step:1000,value:9000},
  {id:'contrib',label:'Contribution per box',unit:'$',min:4,max:24,step:1,value:14}],
 draw(s){
  const F=Number(s.fixed),c=Number(s.contrib),be=F/c,maxU=Math.max(be*1.7,200);
  const X=u=>60+u/maxU*350,Y=d=>215-d/(Math.max(F*2,c*maxU))*175;
  const body=v114Axes(60,215,355,180)+
   '<path d="M'+X(0)+' '+Y(F)+'L'+X(maxU)+' '+Y(F)+'" stroke="currentColor" stroke-dasharray="5 4"/>'+
   v114Text(X(maxU)-86,Y(F)-8,'fixed $'+v114N(F))+
   '<path d="M'+X(0)+' '+Y(0)+'L'+X(maxU)+' '+Y(c*maxU)+'" stroke="var(--study-warm)" stroke-width="3"/>'+
   v114Text(X(maxU)-96,Y(c*maxU)+16,'total contribution')+
   '<circle cx="'+X(be)+'" cy="'+Y(F)+'" r="6" fill="var(--study-warm)"/>'+
   '<path d="M'+X(be)+' '+Y(F)+'V215" stroke="currentColor" stroke-dasharray="3 4"/>'+
   v114Text(X(be)-22,234,v114N(Math.ceil(be))+' boxes')+
   v114Text(64,26,'dollars per month')+v114Text(330,250,'boxes sold');
  return{html:v114Svg(450,258,'Total contribution rising to meet a flat fixed-cost line at '+v114N(Math.ceil(be))+' boxes.',body),
   read:'Breakeven = '+v114N(F)+' ÷ '+v114N(c)+' = '+v114N(be,1)+', so '+v114N(Math.ceil(be))+' boxes. Check it: '+v114N(Math.ceil(be))+' × '+v114N(c)+' = $'+v114N(Math.ceil(be)*c)+', which clears $'+v114N(F)+'. Dividing by the $40 price instead would give '+v114N(Math.ceil(F/40))+' boxes — contributing only $'+v114N(Math.ceil(F/40)*c)+'.'};
 }};

V114_FIGURES['cash-cycle']={
 title:'The days your money is somewhere else',
 intro:'Drag the three timings. The shaded stretch is how long cash is out of the account — and it moves without any change to price, cost or volume.',
 controls:[
  {id:'inv',label:'Stock held',unit:'days',min:5,max:70,step:5,value:40},
  {id:'rec',label:'Customers pay in',unit:'days',min:0,max:90,step:5,value:45},
  {id:'pay',label:'You pay suppliers in',unit:'days',min:0,max:90,step:5,value:30}],
 draw(s){
  const inv=Number(s.inv),rec=Number(s.rec),pay=Number(s.pay);
  const cycle=inv+rec-pay,span=Math.max(inv+rec,pay)+10;
  const X=d=>50+d/span*370;
  const body='<path d="M50 150H430" stroke="currentColor" stroke-width="2"/>'+
   '<path d="M'+X(0)+' 140V160" stroke="currentColor"/>'+v114Text(X(0)-6,180,'buy')+
   '<path d="M'+X(inv)+' 140V160" stroke="currentColor"/>'+v114Text(X(inv)-10,180,'sell')+
   '<path d="M'+X(pay)+' 140V160" stroke="var(--study-warm)" stroke-width="2"/>'+v114Text(X(pay)-24,202,'pay supplier')+
   '<path d="M'+X(inv+rec)+' 140V160" stroke="var(--study-warm)" stroke-width="2"/>'+v114Text(X(inv+rec)-30,202,'get paid')+
   (cycle>0?'<rect x="'+X(pay)+'" y="96" width="'+(X(inv+rec)-X(pay))+'" height="34" fill="var(--study-warm)" opacity=".45" stroke="currentColor"/>'+v114Text(X(pay)+8,118,v114N(cycle)+' days of your cash')
          :'<rect x="'+X(inv+rec)+'" y="96" width="'+(X(pay)-X(inv+rec))+'" height="34" fill="var(--study-panel)" stroke="currentColor"/>'+v114Text(X(inv+rec)+8,118,v114N(-cycle)+' days of supplier cash'))+
   v114Text(50,58,'stock held '+inv+' d · customers pay in '+rec+' d · you pay in '+pay+' d');
  const tied=20000/30*Math.max(cycle,0);
  return{html:v114Svg(450,215,'A timeline where cash is out of the account for '+v114N(cycle)+' days.',body),
   read:cycle>=0
    ?'Cash cycle = '+inv+' + '+rec+' − '+pay+' = '+v114N(cycle)+' days. At $20,000 of monthly sales that is $667 a day × '+v114N(cycle)+' = about $'+v114N(Math.round(tied/100)*100)+' permanently tied up in stock and unpaid invoices.'
    :'Cash cycle = '+inv+' + '+rec+' − '+pay+' = '+v114N(cycle)+' days — negative. You collect from customers before you have to pay suppliers, so growth generates cash instead of consuming it.'};
 }};

V114_FIGURES['growth-cash-trap']={
 title:'Profit up, cash down, same month',
 intro:'Raise the growth rate and watch the two lines separate. Nothing is going wrong — working capital scales with sales while profit is only a margin on them.',
 controls:[
  {id:'sales',label:'Monthly sales',unit:'$',min:20000,max:120000,step:10000,value:40000},
  {id:'cycle',label:'Cash cycle',unit:'days',min:0,max:90,step:5,value:55}],
 draw(s){
  const sales=Number(s.sales),cyc=Number(s.cycle),base=20000;
  const profit=0.35*sales-9000;
  const tied=sales/30*cyc,tiedBase=base/30*cyc,extra=tied-tiedBase;
  const net=profit-extra,scale=Math.max(Math.abs(net),profit,extra,1);
  const bar=(y,label,val,col)=>{const w=Math.abs(val)/scale*180;
   return v114Text(8,y+5,label)+'<rect x="200" y="'+(y-14)+'" width="'+Math.max(w,1)+'" height="22" fill="'+col+'" opacity=".6" stroke="currentColor"/>'+v114Text(392,y+5,(val<0?'−$':'$')+v114N(Math.abs(Math.round(val))))};
  const body=bar(44,'month’s profit',profit,'var(--study-warm)')+
   bar(96,'extra cash the cycle needs',-extra,'currentColor')+
   '<path d="M8 128H440" stroke="currentColor"/>'+
   bar(166,'net cash movement',net,net>=0?'var(--study-warm)':'currentColor');
  return{html:v114Svg(450,190,'Profit of '+v114N(Math.round(profit))+' dollars against '+v114N(Math.round(extra))+' dollars of extra working capital.',body),
   read:'At $'+v114N(sales)+' a month: profit = 0.35 × '+v114N(sales)+' − 9,000 = $'+v114N(Math.round(profit))+'. Cash tied in a '+cyc+'-day cycle rises to $'+v114N(Math.round(tied))+', which is $'+v114N(Math.round(extra))+' more than at $20,000 of sales. Net movement: '+(net<0?'−$'+v114N(Math.round(-net))+'. A profitable month with cash going down.':'+$'+v114N(Math.round(net))+'.')};
 }};

V114_FIGURES['pricing']={
 title:'What a discount really costs',
 intro:'The price change lands entirely on contribution, which is much smaller than the price. Move the slider and compare the two percentages.',
 controls:[
  {id:'change',label:'Price change',unit:'%',min:-25,max:25,step:1,value:-10},
  {id:'vc',label:'Variable cost',unit:'$',min:14,max:34,step:1,value:26}],
 draw(s){
  const pct=Number(s.change),vc=Number(s.vc),p0=40,c0=p0-vc;
  const p1=p0*(1+pct/100),c1=p1-vc;
  const need=c1>0?c0/c1:Infinity,volPct=(need-1)*100;
  const W=300,sc=W/Math.max(c0,c1,1);
  const body=v114Text(8,34,'contribution before: $'+v114N(c0))+
   '<rect x="130" y="42" width="'+Math.max(c0*sc,1)+'" height="26" fill="var(--study-panel)" stroke="currentColor"/>'+
   v114Text(8,96,'contribution after: $'+v114N(c1,2))+
   (c1>0?'<rect x="130" y="104" width="'+Math.max(c1*sc,1)+'" height="26" fill="var(--study-warm)" opacity=".6" stroke="currentColor"/>':v114Text(132,122,'below zero — every sale loses money'))+
   '<path d="M8 150H440" stroke="currentColor"/>'+
   v114Text(8,180,'price moved '+(pct>=0?'+':'')+pct+' %')+
   v114Text(8,206,'contribution moved '+(c0?v114N((c1-c0)/c0*100,1):'0')+' %');
  return{html:v114Svg(450,220,'Contribution falling from '+v114N(c0)+' to '+v114N(c1,2)+' dollars after a '+pct+' per cent price change.',body),
   read:c1<=0
    ?'At this price the box sells for less than its $'+v114N(vc)+' variable cost. No volume can recover that.'
    :(pct<0
      ?'A '+Math.abs(pct)+' % discount is '+v114N(Math.abs(p0*pct/100)/c0*100,1)+' % of contribution, not '+Math.abs(pct)+' %. Contribution falls $'+v114N(c0)+' → $'+v114N(c1,2)+', so holding total contribution needs '+v114N(volPct,0)+' % more volume.'
      :'A '+pct+' % rise lifts contribution $'+v114N(c0)+' → $'+v114N(c1,2)+'. You can lose up to '+v114N((1-1/need)*100,0)+' % of volume and still be level — and selling fewer boxes also frees working capital.')};
 }};

V114_FIGURES['discounting']={
 title:'Why distance costs so much',
 intro:'Present value divides by compound growth. Push the years out or the rate up and watch how fast a future amount shrinks.',
 controls:[
  {id:'fv',label:'Amount received later',unit:'$',min:2000,max:20000,step:1000,value:10000},
  {id:'rate',label:'Discount rate',unit:'%',min:2,max:25,step:1,value:8},
  {id:'yrs',label:'Years away',unit:'y',min:1,max:12,step:1,value:3}],
 draw(s){
  const fv=Number(s.fv),r=Number(s.rate)/100,n=Number(s.yrs);
  const pv=fv/Math.pow(1+r,n),naive=fv*(1-r*n);
  const X=y=>55+y/12*360,Y=v=>205-v/fv*165;
  let path='';for(let y=0;y<=12;y+=0.25){path+=(y?'L':'M')+X(y)+' '+Y(fv/Math.pow(1+r,y))}
  const body=v114Axes(55,205,365,170)+
   '<path d="'+path+'" fill="none" stroke="currentColor" stroke-width="2.5"/>'+
   '<circle cx="'+X(n)+'" cy="'+Y(pv)+'" r="5.5" fill="var(--study-warm)"/>'+
   '<path d="M'+X(n)+' '+Y(pv)+'V205" stroke="currentColor" stroke-dasharray="3 4"/>'+
   v114Text(X(n)+8,Y(pv)-8,'$'+v114N(Math.round(pv)))+
   v114Text(60,26,'value today ($)')+v114Text(320,232,'years until received');
  return{html:v114Svg(450,242,'A present-value curve showing '+v114N(fv)+' dollars in '+n+' years being worth '+v114N(Math.round(pv))+' today.',body),
   read:'PV = '+v114N(fv)+' ÷ '+v114N(1+r,2)+'^'+n+' = '+v114N(fv)+' ÷ '+v114N(Math.pow(1+r,n),4)+' = $'+v114N(Math.round(pv))+'. Check by growing it forward: '+v114N(Math.round(pv))+' × '+v114N(Math.pow(1+r,n),4)+' = $'+v114N(Math.round(pv*Math.pow(1+r,n)))+'. Subtracting simple interest instead would have given $'+v114N(Math.round(naive))+'.'};
 }};

