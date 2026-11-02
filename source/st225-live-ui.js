/* Study Table V225 — transparent UI for explicit shared-write migration and conflict reconciliation. */
(()=>{'use strict';
const api=()=>window.StudyTableLiveStore;
const $=(s,r=document)=>r.querySelector(s);
const node=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=String(txt);return el};
const button=(label,cb,cls='')=>{const el=node('button',cls,label);el.type='button';el.addEventListener('click',cb);return el};
let dialog=null,origin=null,notice='';
const err=e=>String(e?.message||e||'Unknown error').slice(0,240);
function download(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000)}
function statusText(h){switch(h.status){case 'ready':return `Unified live saves active · revision ${h.revision} · ${h.stored} of ${h.managed} teaching records captured.`;case 'external-changes':return 'Changes were made outside unified live saves. Review before continuing your lessons.';case 'damaged':return 'A saved live checkpoint is damaged. Existing lesson records have not been overwritten.';default:return 'Unified live saves are not activated. Your existing study records are unchanged.'}}
function render(){if(!dialog?.open)return;const main=$('#st225Main',dialog);main.replaceChildren();const h=api().health();
 const summary=node('section','st225-card');summary.append(node('h3','','One save path for core teaching progress'),node('p','',statusText(h)));
 const names=node('p','st225-muted','Covered: '+Object.values(api().NAMES).join(' · ')+'.');summary.append(names);
 if(h.status==='ready')summary.append(node('p','st225-muted',`Last checkpoint: ${new Date(h.savedAt).toLocaleString()}. Current lessons still mirror their original keys for older components and backups.`));
 if(h.status==='external-changes'){
  const list=node('ul','st225-issues');for(const issue of h.issues)list.append(node('li','',issue.label));summary.append(node('p','st225-warning','These records differ from the saved live checkpoint. This can happen after restoring a backup, editing storage, or another older module writing directly.'),list);
  summary.append(button('Review and accept current browser records',()=>{if(!window.confirm('Adopt the CURRENT browser records into unified live saves? The previous validated live snapshot remains available for export. Download an external backup before reconciling if you need a separate copy.'))return;try{const result=api().reconcile();notice=`Reconciled ${result.changed.length} progress section(s). Version ${result.revision} saved.`}catch(e){notice='Reconciliation failed: '+err(e)}render()},'st225-mainbutton'));
 }
 if(h.status==='not-activated')summary.append(button('Activate unified live saves',()=>{if(!window.confirm('Start versioned live saves for chapter reviews, calendar, guided teaching, deeper workshops, and diagnostic coaching? Original lesson keys will be preserved and mirrored.'))return;try{const result=api().activate();notice='Unified live saves activated · revision '+result.revision}catch(e){notice='Activation failed: '+err(e)}render()},'st225-mainbutton'));
 if(h.status==='damaged'){
  summary.append(node('p','st225-warning',h.error));summary.append(button('Repair the live checkpoint pointer',()=>{try{const x=api().repair();notice=`Recovered revision ${x.revision}. ${x.issues.length?'External changes need review.':''}`}catch(e){notice='Repair failed: '+err(e)}render()},'st225-mainbutton'));
 }
 main.append(summary);
 const recovery=node('section','st225-card');recovery.append(node('h3','','Protect and recover your work'),node('p','st225-muted','This live store covers five modern teaching modules. Spanish Studio, guided lab missions and older curriculum continue using their original keys and V224 checkpoint/backup protections.'));
 const actions=node('div','st225-actions');
 const save=button('Download current live snapshot',()=>{try{download(api().exportSnapshot(),'study-table-v225-live-snapshot.json');notice='Downloaded a validated live-store snapshot. This is a recovery artifact, not a direct restore file.'}catch(e){notice=err(e)}render()},'st225-secondary');save.disabled=!['ready','external-changes'].includes(h.status);actions.append(save);
 const prev=button('Download previous saved version',()=>{try{download(api().exportSnapshot('previous'),'study-table-v225-previous-live-snapshot.json');notice='Downloaded previous version. Original lesson records were not changed.'}catch(e){notice=err(e)}render()},'st225-secondary');prev.disabled=!h.previous;actions.append(prev);
 actions.append(button('Open complete progress backup',()=>{close();window.StudyTableProgress?.open?.()},'st225-secondary'));
 recovery.append(actions,node('p','st225-muted','Restoration is still performed through the existing validated Restore & Undo screen. Export a combined backup before moving devices. A live snapshot is not directly importable into the legacy restore UI.'));
 main.append(recovery);
 const warning=node('section','st225-card');warning.append(node('h3','','Limits of this migration'),node('p','st225-muted','Five current modules now save through a shared versioned data store. They also write the old storage keys so earlier features keep working. This does not yet migrate every old curriculum or Spanish Studio writer.'),node('p','st225-warning','Changes made through older Restore/Undo can create a conflict until you review and accept them. This prevents silent overwriting. Real cross-browser file:// persistence remains unverified.'));main.append(warning);
 $('#st225Status',dialog).textContent=notice||'Your existing course records remain available in their original browser storage.';
}
function open(){origin=document.activeElement;if(!dialog){dialog=node('dialog','st225-dialog');dialog.id='st225Dialog';const wrap=node('div','st225-wrap'),head=node('div','st225-head');head.append(node('div','','Study Table · V225 unified live saves'),button('Close',close,'st225-close'));wrap.append(head);const main=node('div','st225-main');main.id='st225Main';wrap.append(main);const status=node('p','st225-status');status.id='st225Status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');wrap.append(status);dialog.append(wrap);document.body.append(dialog);dialog.addEventListener('close',()=>{if(origin?.isConnected)origin.focus()})}
 if(!dialog.open)dialog.showModal();render();$('#st225Dialog .st225-close')?.focus();}
function close(){if(dialog?.open)dialog.close()}
function attach(){const portal=$('#v35Content .v36-head-actions')||$('#v35Content .v35-head');if(portal&&!$('#st225Portal')){const b=button('Unified live saves',open,'st225-launch');b.id='st225Portal';portal.append(b)}
 const box=$('#st224Main');if(box&&!$('#st225Ledger')){const b=button('Open unified live saves',()=>{window.StudyTableLedger?.close?.();open()},'st225-launch');b.id='st225Ledger';box.prepend(b)}
 const p=$('#st223Dialog .st223-main');if(p&&!$('#st225Progress')){const b=button('Unified live saves',()=>{window.StudyTableProgress?.close?.();open()},'st225-launch');b.id='st225Progress';p.prepend(b)}
}
function install(){const obs=new MutationObserver(()=>{if(attach.busy)return;attach.busy=true;queueMicrotask(()=>{attach.busy=false;attach()})});obs.observe(document.body,{childList:true,subtree:true});attach();document.title='Study Table — Unified Live Progress (V225)'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.StudyTableLiveUI={open,close,refresh:render};
})();