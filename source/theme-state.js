// One theme preference owns both the old reading control and the current tools control.
(function(){
 'use strict';
 const KEY='studytable:v100:theme',LEGACY='studytable_v52_night';
 const valid=value=>value==='light'||value==='dark';
 function sync(){
  const dark=document.documentElement.dataset.studyTheme==='dark';
  const portal=document.getElementById('v35Portal');
  if(portal&&portal.classList.contains('v52-night')!==dark)portal.classList.toggle('v52-night',dark);
  for(const button of document.querySelectorAll('.v52-mode')){
   const text=dark?'Light mode':'Dark mode';if(button.textContent!==text)button.textContent=text;
   if(button.getAttribute('aria-pressed')!==String(dark))button.setAttribute('aria-pressed',String(dark));
  }
  const themeButton=document.getElementById('v100Theme'),text=dark?'Light mode':'Dark mode';
  if(themeButton){if(themeButton.textContent!==text)themeButton.textContent=text;themeButton.setAttribute('aria-label','Switch to '+(dark?'light':'dark')+' mode')}
  for(const proxy of document.querySelectorAll('[data-tool="v100Theme"]'))if(proxy.textContent!==text)proxy.textContent=text;
  if(document.documentElement.style.colorScheme!==(dark?'dark':'light'))document.documentElement.style.colorScheme=dark?'dark':'light';
 }
 function set(value){
  const theme=value==='dark'?'dark':'light';
  if(document.documentElement.dataset.studyTheme!==theme)document.documentElement.dataset.studyTheme=theme;
  try{localStorage.setItem(KEY,theme);localStorage.setItem(LEGACY,theme==='dark'?'1':'0')}catch{}
  sync();
 }
 let initial=null;
 try{const saved=localStorage.getItem(KEY),old=localStorage.getItem(LEGACY);if(valid(saved))initial=saved;else if(old==='1'||old==='0')initial=old==='1'?'dark':'light'}catch{}
 if(!initial)initial=window.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light';
 window.studyTableTheme={set,sync,get:()=>document.documentElement.dataset.studyTheme};
 set(initial);
 new MutationObserver(records=>{if(records.some(r=>r.type==='attributes'))set(document.documentElement.dataset.studyTheme);else sync()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-study-theme'],childList:true,subtree:true});
 window.addEventListener('storage',event=>{if(event.key===KEY&&valid(event.newValue))set(event.newValue);else if(event.key===LEGACY&&(event.newValue==='1'||event.newValue==='0'))set(event.newValue==='1'?'dark':'light')});
})();
