// Older studio overlays use aria-modal without the browser's native dialog behavior.
// Give those overlays background isolation and keyboard/focus handling. Native
// showModal() dialogs keep the browser's own handling, including nested dialogs.
(function(){
 'use strict';
 const focusable='button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),iframe,[tabindex]';
 const ignored=new Set(['SCRIPT','STYLE','LINK','META','TEMPLATE','DIALOG']);
 const originalInert=new Map(),records=new WeakMap();
 let active=null,lastOutside=document.activeElement,working=false,queued=false,tools=null,toolsHome=null;
 const visible=el=>el.isConnected&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'&&!el.closest('[hidden]');
 const nativeModal=()=>document.querySelector('dialog:modal');
 const buttons=modal=>[...modal.querySelectorAll(focusable)].filter(el=>el.tabIndex>=0&&visible(el)&&!el.closest('[inert]'));
 function closeButton(modal){return [...modal.querySelectorAll('button')].find(b=>visible(b)&&!b.disabled&&(/^close\b/i.test(b.getAttribute('aria-label')||'')||/^close(?:\s|[×✕]|$)/i.test(b.textContent.trim())||/(?:Close|Exit|close)$/.test(b.id)))}
 function focusInside(modal){const target=closeButton(modal)||buttons(modal)[0]||modal;if(target===modal&&!modal.hasAttribute('tabindex')){modal.tabIndex=-1;records.get(modal).addedTabindex=true}target.focus({preventScroll:true})}
 function release(){for(const [el,wasInert] of originalInert)el.inert=wasInert;originalInert.clear()}
 function placeTools(modal){
  // This floating control is part of the active screen, not its background.
  // Move the existing node so its event handlers and native dialog stay intact.
  tools=tools||document.getElementById('v101ToolsButton');if(!tools)return;
  if(!toolsHome){toolsHome=document.createComment('Learning tools original position');tools.before(toolsHome)}
  if(originalInert.has(tools)){tools.inert=originalInert.get(tools);originalInert.delete(tools)}
  if(modal){if(tools.parentElement!==modal)modal.append(tools)}
  else if(toolsHome.parentNode&&tools.previousSibling!==toolsHome)toolsHome.after(tools);
 }
 function isolate(modal){
  // Isolate siblings along the entire ancestor path, not only body children.
  for(let branch=modal;branch.parentElement&&branch!==document.body;branch=branch.parentElement){
   for(const sibling of branch.parentElement.children){
    if(sibling===branch||!(sibling instanceof HTMLElement)||ignored.has(sibling.tagName))continue;
    if(!originalInert.has(sibling))originalInert.set(sibling,sibling.inert);sibling.inert=true;
   }
  }
 }
 function topOverlay(){
  const candidates=[...document.querySelectorAll('[aria-modal="true"]')].filter(el=>el.tagName!=='DIALOG'&&!el.closest('dialog')&&visible(el));
  const z=el=>{let value=0;for(let node=el;node&&node!==document.body;node=node.parentElement){const n=Number.parseInt(getComputedStyle(node).zIndex,10);if(Number.isFinite(n))value=Math.max(value,n)}return value};
  return candidates.map((el,index)=>({el,index,z:z(el)})).sort((a,b)=>a.z-b.z||a.index-b.index).at(-1)?.el||null;
 }
 function restore(target){if(target instanceof HTMLElement&&visible(target)&&!target.closest('[inert]'))target.focus({preventScroll:true})}
 function sync(){
  if(working)return;working=true;
  try{
   const next=topOverlay();
   if(next!==active){
    const previous=active,closed=previous&&!visible(previous),record=previous&&records.get(previous);
    release();active=next;placeTools(next);
    if(next&&!records.has(next))records.set(next,{returnFocus:previous?.contains(document.activeElement)?document.activeElement:lastOutside});
    if(closed){if(record?.addedTabindex)previous.removeAttribute('tabindex');records.delete(previous)}
    if(next)isolate(next);
    if(!nativeModal()){
     if(closed&&record?.returnFocus&&(!next||next.contains(record.returnFocus)))restore(record.returnFocus);
     if(next&&!next.contains(document.activeElement))focusInside(next);
    }
   }else if(active){
    placeTools(active);
    isolate(active); // Also isolate siblings inserted while the overlay is open.
    if(!nativeModal()&&!active.contains(document.activeElement))focusInside(active);
   }
  }finally{working=false}
 }
 function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;sync()})}
 document.addEventListener('focusin',event=>{
  if(working)return;sync();if(nativeModal())return;
  if(active){if(!active.contains(event.target))focusInside(active)}
  else if(event.target instanceof HTMLElement&&!event.target.closest('[aria-modal="true"]'))lastOutside=event.target;
 },true);
 document.addEventListener('keydown',event=>{
  sync();
  if(nativeModal()){
   // Keep the browser's default Tab/cancel behavior, while preventing old
   // document handlers from also closing or trapping the background studio.
   if(event.key==='Escape'||event.key==='Tab')event.stopImmediatePropagation();
   return;
  }
  if(!active)return;
  if(event.key==='Escape'){
   const close=closeButton(active);if(close){event.preventDefault();event.stopImmediatePropagation();close.click();sync()}
  }else if(event.key==='Tab'){
   const list=buttons(active),first=list[0],last=list.at(-1),focused=document.activeElement;
   if(!first){event.preventDefault();focusInside(active)}
   else if(!active.contains(focused)||focused===active||(event.shiftKey&&focused===first)||(!event.shiftKey&&focused===last)){
    event.preventDefault();(event.shiftKey?last:first).focus();
   }
  }
 },true);
 new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class','style','open','aria-modal']});
 sync();
})();
