/* Study Table V226 — transparent UI for explicit shared-write migration and conflict reconciliation. */
(()=>{'use strict';
const api=()=>window.StudyTableLiveStore;
const $=(s,r=document)=>r.querySelector(s);
const node=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=String(txt);return el};
const button=(label,cb,cls='')=>{const el=node('button',cls,label);el.type='button';el.addEventListener('click',cb);return el};
let dialog=null,origin=null,notice='';
const err=e=>String(e?.message||e||'Unknown error').slice(0,240);
function download(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000)}
function statusText(h){switch(h.status){case 'ready':return `Unified live saves active · revision ${h.revision} · ${h.stored} of ${h.managed} teaching and practice records captured.`;case 'external-changes':return 'Changes were made outside unified live saves. Review before continuing your lessons.';case 'damaged':return 'A saved live checkpoint is damaged. Existing lesson records have not been overwritten.';default:return 'Unified live saves are not activated. Your existing study records are unchanged.'}}
function render(){if(!dialog?.open)return;const main=$('#st225Main',dialog);main.replaceChildren();const h=api().health();
 const summary=node('section','st225-card');summary.append(node('h3','','One save path for core teaching progress'),node('p','',statusText(h)));
 const names=node('p','st225-muted','Covered: '+Object.values(api().NAMES).join(' · ')+'.');summary.append(names);
 if(h.status==='ready')summary.append(node('p','st225-muted',`Last checkpoint: ${new Date(h.savedAt).toLocaleString()}. Current lessons still mirror their original keys for older components and backups.`));
 if(h.status==='external-changes'){
  const list=node('ul','st225-issues');for(const issue of h.issues)list.append(node('li','',issue.label));summary.append(node('p','st225-warning','These records differ from the saved live checkpoint. This can happen after restoring a backup, editing storage, or another older module writing directly.'),list);
  summary.append(button('Review and accept current browser records',()=>{if(!window.confirm('Adopt the CURRENT browser records into unified live saves? The previous validated live snapshot remains available for export. Download an external backup before reconciling if you need a separate copy.'))return;try{const result=api().reconcile();notice=`Reconciled ${result.changed.length} progress section(s). Version ${result.revision} saved.`}catch(e){notice='Reconciliation failed: '+err(e)}render()},'st225-mainbutton'));
 }
 if(h.status==='not-activated'){
  const old=h.predecessor;
  if(old?.status==='ready')summary.append(node('p','st225-muted',`An earlier V225 checkpoint (revision ${old.revision}) was found. Upgrading keeps the old checkpoint untouched and creates a new V226 checkpoint from your current study records.`));
  if(old?.status==='external-changes'||old?.status==='damaged')summary.append(node('p','st225-warning',old.status==='external-changes'?'Your older V225 checkpoint and live browser data disagree. Save a complete backup before deciding which version to keep.':'Your earlier V225 checkpoint has a problem. Live lesson records have not been changed. Download a backup before migration.'));
  const choose=(accept=false)=>{if(!window.confirm(accept?'Adopt CURRENT browser records for all seven supported modules, even though the previous V225 snapshot may differ? Download a complete backup first. The old checkpoint will not be removed.':'Enable shared V226 saves for chapter reviews, calendar, guided lessons, deeper workshops, diagnostic coaching, Spanish Verb Studio and guided missions? Your current lesson records and V225 checkpoints will remain.'))return;try{const result=api().activate(accept);notice='Seven-system live saves enabled · revision '+result.revision}catch(e){notice='Activation failed: '+err(e)}render()};
  if(old?.status==='external-changes'||old?.status==='damaged')summary.append(button('Adopt current browser progress after backing up',()=>choose(true),'st225-mainbutton'));
  else summary.append(button(old?.status==='ready'?'Upgrade to seven-system live saves':'Activate seven-system live saves',()=>choose(false),'st225-mainbutton'));
 }
 if(h.status==='damaged'){
  summary.append(node('p','st225-warning',h.error));summary.append(button('Repair the live checkpoint pointer',()=>{try{const x=api().repair();notice=`Recovered revision ${x.revision}. ${x.issues.length?'External changes need review.':''}`}catch(e){notice='Repair failed: '+err(e)}render()},'st225-mainbutton'));
 }
 main.append(summary);
 const recovery=node('section','st225-card');recovery.append(node('h3','','Protect and recover your work'),node('p','st225-muted','Seven modern systems now use the same versioned live store, including Spanish Verb Studio and guided lab missions. Older curriculum and notes still use their legacy storage and combined backups.'));
 const actions=node('div','st225-actions');
 const save=button('Download current live snapshot',()=>{try{download(api().exportSnapshot(),'study-table-v226-live-snapshot.json');notice='Downloaded a validated live-store snapshot. This is a recovery artifact, not a direct restore file.'}catch(e){notice=err(e)}render()},'st225-secondary');save.disabled=!['ready','external-changes'].includes(h.status);actions.append(save);
 const prev=button('Download previous saved version',()=>{try{download(api().exportSnapshot('previous'),'study-table-v226-previous-live-snapshot.json');notice='Downloaded previous version. Original lesson records were not changed.'}catch(e){notice=err(e)}render()},'st225-secondary');prev.disabled=!h.previous;actions.append(prev);
 if(h.predecessor?.status==='ready'||h.predecessor?.status==='external-changes')actions.append(button('Download earlier V225 checkpoint',()=>{try{download(api().exportPredecessor(),'study-table-v225-archived-checkpoint.json');notice='Older V225 checkpoint downloaded. This is an archive, not an import file.'}catch(e){notice=err(e)}render()},'st225-secondary'));
 actions.append(button('Open complete progress backup',()=>{close();window.StudyTableProgress?.open?.()},'st225-secondary'));
 recovery.append(actions,node('p','st225-muted','Restoration is still performed through the existing validated Restore & Undo screen. Export a combined backup before moving devices. A live snapshot is not directly importable into the legacy restore UI.'));
 main.append(recovery);
 const warning=node('section','st225-card');warning.append(node('h3','','Limits of this migration'),node('p','st225-muted','Seven modern systems save through one versioned checkpoint and continue mirroring their original progress keys. Older curriculum and notebook writers have not yet been migrated.'),node('p','st225-warning','Changes made through Restore/Undo or older writers may require explicit reconciliation before the next shared save. Real browser file:// persistence across restarts still needs device testing.'));main.append(warning);
 $('#st225Status',dialog).textContent=notice||'Your existing course records remain available in their original browser storage.';
}
function open(){origin=document.activeElement;if(!dialog){dialog=node('dialog','st225-dialog');dialog.id='st225Dialog';const wrap=node('div','st225-wrap'),head=node('div','st225-head');head.append(node('div','','Study Table · V226 live saves'),button('Close',close,'st225-close'));wrap.append(head);const main=node('div','st225-main');main.id='st225Main';wrap.append(main);const status=node('p','st225-status');status.id='st225Status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');wrap.append(status);dialog.append(wrap);document.body.append(dialog);dialog.addEventListener('close',()=>{if(origin?.isConnected)origin.focus()})}
 if(!dialog.open)dialog.showModal();render();$('#st225Dialog .st225-close')?.focus();}
function close(){if(dialog?.open)dialog.close()}
function attach(){const portal=$('#v35Content .v36-head-actions')||$('#v35Content .v35-head');if(portal&&!$('#st225Portal')){const b=button('Unified live saves',open,'st225-launch');b.id='st225Portal';portal.append(b)}
 const box=$('#st224Main');if(box&&!$('#st225Ledger')){const b=button('Open unified live saves',()=>{window.StudyTableLedger?.close?.();open()},'st225-launch');b.id='st225Ledger';box.prepend(b)}
 const p=$('#st223Dialog .st223-main');if(p&&!$('#st225Progress')){const b=button('Unified live saves',()=>{window.StudyTableProgress?.close?.();open()},'st225-launch');b.id='st225Progress';p.prepend(b)}
}
function install(){const obs=new MutationObserver(()=>{if(attach.busy)return;attach.busy=true;queueMicrotask(()=>{attach.busy=false;attach()})});obs.observe(document.body,{childList:true,subtree:true});attach();document.title='Study Table — Seven-System Live Progress (V226)'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.StudyTableLiveUI={open,close,refresh:render};
})();