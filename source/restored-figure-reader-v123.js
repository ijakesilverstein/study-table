// Restored V120 figures use their existing control IDs and the current reader.
const V123_RESTORED_IDS=__RESTORED_IDS__;
const v123N=(value,digits=2)=>{
 const n=Number(value);if(n===0)return '0';
 return Math.abs(n)<10**(-digits)?n.toExponential(2):Number(n.toFixed(digits)).toLocaleString('en-US',{maximumFractionDigits:digits});
};
const v123Money=n=>(n<0?'−$':'$')+v123N(Math.abs(n));
const v123Text=(x,y,t,anchor='start')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+escape(t)+'</text>';
const v123Line=(x,y,x2,y2,extra='')=>'<path d="M'+x+' '+y+'L'+x2+' '+y2+'" fill="none" '+(/\bstroke=/.test(extra)?'':'stroke="currentColor" ')+extra+'/>';
const v123Svg=(label,body,height=230)=>'<svg viewBox="0 0 280 '+height+'" role="img" aria-label="'+escape(label)+'">'+body+'</svg>';
function v123Table(caption,headers,rows){return '<table class="v123-table"><caption>'+escape(caption)+'</caption><thead><tr>'+headers.map(h=>'<th scope="col">'+escape(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map((cell,i)=>i?'<td>'+escape(cell)+'</td>':'<th scope="row">'+escape(cell)+'</th>').join('')+'</tr>').join('')+'</tbody></table>'}
function v123Bars(label,rows,max,axis){
 const height=rows.length*50+55;
 const body=rows.map(([name,value],i)=>{
  const y=32+i*50,w=Math.abs(value)/max*168;
  return v123Text(8,y,name)+v123Line(8,y+23,260,y+23)+
   '<rect x="92" y="'+(y+7)+'" width="'+w+'" height="16" fill="var(--study-warm)" stroke="currentColor"/>';
 }).join('')+v123Text(8,height-7,axis);
 return v123Svg(label,body,height);
}
function v123Curve(label,points,{min=0,max=1,xmax=10,ylabel='',xlabel='Model step',marker=null}={}){
 const X=x=>80+x/xmax*180,Y=y=>185-(y-min)/(max-min)*145;
 return v123Svg(label,v123Text(8,20,ylabel)+v123Line(80,40,80,185)+v123Line(80,185,260,185)+(min<0&&max>0?v123Line(80,Y(0),260,Y(0),'stroke-dasharray="4 4"'):'')+
  '<path d="'+points.map(([x,y],i)=>(i?'L':'M')+X(x)+' '+Y(y)).join('')+'" fill="none" stroke="var(--study-warm)" stroke-width="3"/>'+
  (marker?'<circle cx="'+X(marker[0])+'" cy="'+Y(marker[1])+'" r="5" fill="currentColor"/>'+v123Line(X(marker[0]),Y(marker[1]),X(marker[0]),185,'stroke-dasharray="3 3"'):'')+v123Text(75,205,'0')+v123Text(260,205,v123N(xmax),'end')+v123Text(8,40,v123N(max))+v123Text(8,185,v123N(min))+v123Text(150,228,xlabel,'middle'),240);
}
const v123PriorFigure=v114Figure;
v114Figure=function(id){
 if(!V123_RESTORED_IDS.includes(id)){v123PriorFigure(id);return}
 const spec=V114_FIGURES[id],host=document.querySelector('#courseArticle .explanation');
 if(!spec||!host||document.getElementById('v114Canvas'))return;
 host.insertAdjacentHTML('beforeend','<section class="explore-figure v114-figure v123-figure" data-restored-figure="'+escape(id)+'" aria-labelledby="v114FigTitle"><h3 id="v114FigTitle">'+escape(spec.title)+'</h3><p>'+escape(spec.intro)+'</p><div class="v114-controls">'+spec.controls.map(v114Control).join('')+'</div><div id="v114Canvas" class="quantity-figure" tabindex="0" role="region" aria-label="Interactive diagram and numerical table"></div><p class="calculation" id="v114Read" role="status" aria-live="polite" aria-atomic="true"></p><p class="v123-assumptions">'+escape(spec.assumptions)+'</p></section>');
 const state={};for(const c of spec.controls)state[c.id]=c.type==='select'?c.options[0][0]:c.value;
 const update=()=>{
  spec.normalize?.(state);
  for(const c of spec.controls){const input=document.getElementById('v114-'+c.id);if(c.minFor)input.min=String(c.minFor(state));input.value=String(state[c.id]);const out=document.getElementById('v114-out-'+c.id);if(out){const number=v123N(state[c.id],3),value=c.unit==='$'?'$'+number:c.unit==='$/month'?'$'+number+' / month':number+(c.unit==='%'?'%':c.unit?' '+c.unit:'');out.textContent=value;input.setAttribute('aria-valuetext',value)}}
  const result=spec.draw(state),canvas=document.getElementById('v114Canvas');canvas.innerHTML=result.html;canvas.dataset.v123Values=JSON.stringify(result.values);document.getElementById('v114Read').textContent=result.read;
 };
 host.querySelectorAll('[data-v114]').forEach(input=>input.addEventListener('input',()=>{state[input.dataset.v114]=input.tagName==='SELECT'?input.value:Number(input.value);update()}));update();
};
