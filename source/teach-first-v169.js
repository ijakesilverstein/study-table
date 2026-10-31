(function(){
 function sync(){
  const home=document.getElementById('home');
  if(home&&home.textContent!=='Home'){home.textContent='Home';home.setAttribute('aria-label','Learning home')}
  const button=document.getElementById('st169-lesson'),select=document.getElementById('st163-subject');if(!button||!select)return;
  button.hidden=!window.studyTableFullCourses?.courses?.some(course=>course.subject===select.value);
 }
 document.addEventListener('change',event=>{if(event.target.id==='st163-subject')sync()});
 document.addEventListener('click',event=>{
  const home=event.target.closest?.('#home');if(!home)return;
  event.preventDefault();event.stopImmediatePropagation();
  // Keep the original route/unload cleanup, then open the learning home visibly.
  home.onclick?.call(home,event);
  if(typeof v35Open==='function')v35Open();
  window.studyTableV90?.enhanceHome?.();
  queueMicrotask(()=>{const button=document.getElementById('st169-lesson');(button&&!button.hidden?button:document.getElementById('st163-subject'))?.focus({preventScroll:true})});
 },true);
 document.addEventListener('click',event=>{
  if(!event.target.closest?.('#st169-lesson'))return;
  const subject=document.getElementById('st163-subject')?.value,item=window.studyTableFocusV163?.content?.[subject];
  if(item&&window.studyTableFullCourses?.courses?.some(course=>course.subject===subject))window.studyTableFullCourses.open(subject,item.unit);
 });
 new MutationObserver(sync).observe(document.body,{childList:true,subtree:true});sync();
})();
