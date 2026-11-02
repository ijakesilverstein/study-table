/* Study Table V220 — inspect storage without trusting file-origin persistence; all backup writes remain user-triggered. */
(()=>{'use strict';
 const LABEL='Storage & backups',TEST_KEY='studytable:v220:temporary-write-test';
 let dialog=null,from=null,latest=null;
 const el=(tag,cls,content)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(content!==undefined)node.textContent=content;return node};
 const button=(label,handler,cls='')=>{const b=el('button',cls,label);b.type='button';b.addEventListener('click',handler);return b};
 function check(){
  const tests=[];let keyCount=0,bytes=0,saved=false,backup=null;
  let keyWas=null,previous=null,writable=false,cleaned=true;
  try{
   previous=localStorage.getItem(TEST_KEY);keyWas=previous!==null;
   const probe=`${new Date().toISOString()}-${Math.random().toString(36).slice(2)}`;
   localStorage.setItem(TEST_KEY,probe);
   writable=localStorage.getItem(TEST_KEY)===probe;
  }catch(e){tests.push({ok:false,label:`Browser storage cannot be written or read (${e?.name||'error'}).`});}
  finally{
   try{if(keyWas)localStorage.setItem(TEST_KEY,previous);else localStorage.removeItem(TEST_KEY);
    if(localStorage.getItem(TEST_KEY)!==previous)cleaned=false;
   }catch{cleaned=false}
  }
  if(writable)tests.push({ok:true,label:'Browser storage accepted a write and returned the same value.'});
  if(!cleaned)tests.push({ok:false,label:'The temporary storage test could not be cleaned up. Avoid restoring until storage works.'});
  try{
   for(let i=0;i<localStorage.length;i++){
    const name=localStorage.key(i);
    if(typeof name==='string'&&(/^(study-table|studytable|spanish-verb-studio)/i).test(name)){
     keyCount++;bytes+=name.length+(localStorage.getItem(name)||'').length;
    }
   }
   tests.push({ok:true,label:`Found ${keyCount} Study Table-related storage records (approximately ${(bytes/1024).toFixed(1)} KiB).`});
  }catch(e){tests.push({ok:false,label:'Could not inspect saved course records: '+(e?.name||'storage error')});}
  try{
   const api=window.StudyTablePath;
   if(typeof api?.completeBackup!=='function')throw Error('Combined progress exporter has not loaded.');
   backup=api.completeBackup();
   if(backup?.format!=='study-table-complete'||backup?.schemaVersion!==1)throw Error('Unknown backup schema.');
   for(const name of ['core','guided','spanishStudio','calendar','teaching','deepTeaching','coaching'])if(!(name in backup))throw Error(name+' is missing from the combined backup.');
   const raw=JSON.stringify(backup);if(raw.length>20*1024*1024)throw Error('The complete backup is larger than the 20 MB limit.');
   const copy=JSON.parse(raw);
   if(copy.format!==backup.format||copy.schemaVersion!==backup.schemaVersion)throw Error('The backup did not survive JSON serialization.');
   saved=true;tests.push({ok:true,label:'A combined backup can be assembled and serialized, including Spanish, calendar, guided work and diagnostic practice.'});
   const covered=new Set([...Object.keys(backup.core.records||{}),'studytable:v212:guided-missions','studytable:v210:last-subject','spanish-verb-studio-v1','studytable:v214:learning-calendar','studytable:v214:teaching-room','studytable:v216:deep-lessons','studytable:v219:coaching']);
   const excluded=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&/^(study-table|studytable|spanish-verb-studio)/i.test(key)&&key!==TEST_KEY&&!covered.has(key))excluded.push(key)}
   if(excluded.length)tests.push({ok:false,label:`${excluded.length} older stored settings or records are not included by the existing backup system. Examples: ${excluded.slice(0,3).join(', ')}. Keep the original browser/profile until you verify your work after restoring.`});
  }catch(e){tests.push({ok:false,label:'Complete backup needs attention: '+(e?.message||'unknown error')});}
  const fileOrigin=location.protocol==='file:';
  tests.push({ok:!fileOrigin,label:fileOrigin?'This HTML is opened as a file. Browsers may isolate storage between file paths; saving a backup before moving or renaming the file is important.':'Study Table is in a browser page. Progress remains tied to this browser and site origin; downloads do not automatically transfer it.'});
  latest={tests,canDownload:saved,canWrite:writable&&cleaned,records:keyCount,bytes,origin:location.protocol};return latest;
 }
 function render(){if(!dialog)return;
  const r=latest||check();const content=dialog.querySelector('.st220-result');content.replaceChildren();
  const bad=r.tests.filter(t=>!t.ok);const lead=el('p','st220-lead',!r.canWrite?'Your browser failed the storage write test. Learning is still available, but progress may not save.':!r.canDownload?'The full backup is not ready. Inspect the issue below before changing browsers.':'Storage currently responds, and Study Table can prepare a combined learning-progress backup.');content.append(lead);
  const list=el('ul','st220-checks');r.tests.forEach(t=>{const li=el('li',t.ok?'st220-good':'st220-warning',t.label);li.prepend(el('span','st220-indicator',t.ok?'✓':'!'));list.append(li)});content.append(list);
  const warning=el('p','st220-note','A successful write test does NOT prove that progress survives closing the browser, changing the HTML filename, or switching browsers. Keep a separate downloaded backup.');content.append(warning);
  const exportButton=dialog.querySelector('#st220Export');exportButton.disabled=!r.canDownload;
  const note=dialog.querySelector('#st220Message');if(!note.textContent)note.textContent=bad.length?'Some checks need attention.':'Checks completed. No backup has been downloaded yet.';
 }
 function saveBackup(){
  const status=dialog?.querySelector('#st220Message');
  try{
   // Always regenerate the backup on the click, so the file includes the newest work.
   const backup=window.StudyTablePath?.completeBackup?.();
   if(!backup||backup.format!=='study-table-complete')throw Error('Combined backup is not available.');
   const text=JSON.stringify(backup,null,2);
   if(text.length>20*1024*1024)throw Error('Progress exceeds the 20 MB backup limit.');
   const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
   const a=el('a');a.href=url;a.download='study-table-supported-progress-v220.json';a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
   if(status)status.textContent='Combined backup download requested. Check your Downloads folder, and keep the original browser until the restored progress is verified.';
   return true;
  }catch(e){if(status)status.textContent='Backup download failed: '+(e?.message||'unknown error');return false}
 }
 function openRestore(){dialog?.close();if(typeof window.StudyTablePath?.open==='function')window.StudyTablePath.open();else window.alert('Combined restore is unavailable in this build.')}
 function ensure(){if(dialog)return;
  dialog=el('dialog','st220-dialog');dialog.id='st220SafetyDialog';dialog.setAttribute('aria-labelledby','st220Title');
  const box=el('div','st220-panel'),head=el('header','st220-header');const heading=el('div');heading.append(el('span','st220-eyebrow','STUDY TABLE · DATA SAFETY'),el('h2','','Storage & backups'));heading.querySelector('h2').id='st220Title';head.append(heading,button('Close',()=>dialog.close(),'st220-close'));box.append(head);
  box.append(el('p','st220-intro','Your lessons work without an account. Progress is stored in this browser, not automatically synced between devices. Combined backups include supported learning records, but some old settings may not transfer.'));
  box.append(el('div','st220-result'));
  const actions=el('div','st220-actions');actions.append(button('Run storage check',()=>{latest=check();dialog.querySelector('#st220Message').textContent='';render()},'st220-secondary'));
  const download=button('Save combined backup',saveBackup,'st220-primary');download.id='st220Export';actions.append(download,button('Restore or undo',openRestore,'st220-secondary'));box.append(actions);
  const message=el('p','st220-status','');message.id='st220Message';message.setAttribute('role','status');message.setAttribute('aria-live','polite');box.append(message);
  dialog.append(box);dialog.addEventListener('close',()=>{if(from?.isConnected)from.focus()});document.body.append(dialog);
 }
 function open(){from=document.activeElement;ensure();latest=check();dialog.querySelector('#st220Message').textContent='';render();if(!dialog.open)dialog.showModal();dialog.querySelector('.st220-close')?.focus()}
 function attach(){
  const portal=document.querySelector('#v35Portal .v36-head-actions');
  if(portal&&!portal.querySelector('#st220Portal')){const b=button(LABEL,open,'st220-launch');b.id='st220Portal';portal.append(b)}
  const quick=document.querySelector('#v35Quick')?.parentElement;
  if(quick&&!quick.querySelector('#st220Quick')){const b=button(LABEL,open,'st220-launch');b.id='st220Quick';quick.append(b)}
  const path=document.querySelector('#st213Dialog .st213-tools .st213-tool-buttons');
  if(path&&!path.querySelector('#st220Path')){const b=button(LABEL,open,'st213-secondary');b.id='st220Path';path.append(b)}
  const hero=document.querySelector('#v90Hero .v90-actions');
  if(hero&&!hero.querySelector('#st220Home')){const b=button(LABEL,open,'st220-launch');b.id='st220Home';hero.append(b)}
  const hub=document.querySelector('#st205Top');
  if(hub&&!hub.querySelector('#st220Hub')){const b=button(LABEL,open,'st220-launch');b.id='st220Hub';hub.append(b)}
 }
 function install(){let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;attach()})}).observe(document.body,{childList:true,subtree:true});attach()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.StudyTableSafety={open,check,saveBackup,latest:()=>latest};
})();