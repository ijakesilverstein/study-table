// These helpers run inside the existing, transaction-safe backup closure.
const V169_EXTRA_KEYS=['studytable:transfer-review:v133','studytable:spanish:real-life:v166'];
const V169_REVIEW_UNITS=new Set(__V169_REVIEW_UNITS__);
const V169_SPANISH_SCENES=new Set(__V169_SPANISH_SCENES__);
function v169Fields(value,fields){return object(value)&&Object.keys(value).every(key=>fields.includes(key))&&fields.every(key=>own(value,key))}
function v169Day(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+'T12:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value}
function v169Instant(value){if(typeof value!=='string')return false;const date=new Date(value);return Number.isFinite(date.getTime())&&date.toISOString()===value}
function v169ValidateExtra(key,value){
 if(key===V169_EXTRA_KEYS[0]){
  if(!v169Fields(value,['schema','records'])||value.schema!==1||!object(value.records)||Object.keys(value.records).length>V169_REVIEW_UNITS.size)throw Error('Optional review plans have an invalid format.');
  for(const [id,record] of Object.entries(value.records))if(!V169_REVIEW_UNITS.has(id)||!v169Fields(record,['due','level','tries'])||!Number.isFinite(record.due)||record.due<0||record.due>8640000000000000||!Number.isInteger(record.level)||record.level<0||record.level>5||!Number.isSafeInteger(record.tries)||record.tries<0)throw Error('An optional review plan has an invalid unit, date or count.');
 }else{
  if(!v169Fields(value,['version','entries'])||value.version!==1||!Array.isArray(value.entries)||value.entries.length>25)throw Error('The Spanish conversation journal has an invalid format.');
  for(const entry of value.entries){
   if(!v169Fields(entry,['scene','day','plannedAt','when','report'])||!V169_SPANISH_SCENES.has(entry.scene)||!v169Day(entry.day)||!['today','tomorrow','unknown'].includes(entry.when)||!(entry.plannedAt===null||v169Instant(entry.plannedAt)))throw Error('A Spanish conversation plan is invalid.');
   if(entry.report!==null){const report=entry.report;
    if(!v169Fields(report,['outcome','day','realDay','after','note','reportedAt','reportedDay'])||!['used','tried','no-chance'].includes(report.outcome)||!['today','yesterday','earlier','unknown'].includes(report.day)||!(report.realDay===null||v169Day(report.realDay))||!['yes','no','unknown'].includes(report.after)||typeof report.note!=='string'||report.note.length>300||!v169Instant(report.reportedAt)||!v169Day(report.reportedDay))throw Error('A Spanish conversation report is invalid.');
   }
  }
 }
 return value;
}
function v169CombineExtra(key,a,b,fileWins){
 if(key===V169_EXTRA_KEYS[1])return fileWins?b:a; // A report correction is never synthesized by merging fields.
 const records=Object.assign(Object.create(null),a.records);
 for(const [id,record] of Object.entries(b.records))if(!own(records,id)||fileWins)records[id]=record;
 return {schema:1,records}; // Keep whole review records; never add tries or promote levels.
}
function v169GatherExtras(out){
 for(const c of courseList()){
  const fk='study-table-v19:course-store:'+c.path;if(!own(out,fk))continue;
  const fallback=decode(fk,out[fk]);
  for(const key of V169_EXTRA_KEYS){
   if(key===V169_EXTRA_KEYS[1]&&c.subject!=='spanish'||!own(fallback,key))continue;
   const candidate=decode(key,fallback[key]);
   out[key]=rawValue(key,own(out,key)?v169CombineExtra(key,decode(key,out[key]),candidate,false):candidate);
  }
 }
 for(const key of V169_EXTRA_KEYS)if(own(out,key))decode(key,out[key]);
}
function v169MirrorExtras(out){
 for(const c of courseList()){
  const keys=V169_EXTRA_KEYS.filter(key=>own(out,key)&&(key!==V169_EXTRA_KEYS[1]||c.subject==='spanish'));if(!keys.length)continue;
  const fk='study-table-v19:course-store:'+c.path,fallback=own(out,fk)?decode(fk,out[fk]):{};
  out[fk]=JSON.stringify({...fallback,...Object.fromEntries(keys.map(key=>[key,out[key]]))});
 }
 return out;
}
function v169ResolveExtraPlan(updates,before,logicalBefore,currentRecords,incoming){
 const relevant=V169_EXTRA_KEYS.filter(key=>own(incoming,key));if(!relevant.length)return;
 const map=Object.fromEntries(updates);
 for(const c of courseList()){
  const keys=relevant.filter(key=>key!==V169_EXTRA_KEYS[1]||c.subject==='spanish');if(!keys.length)continue;
  const fk='study-table-v19:course-store:'+c.path;
  const raw=own(map,fk)?map[fk]:own(currentRecords,fk)?currentRecords[fk]:null;
  const fallback=raw===null?{}:decode(fk,raw);
  for(const key of keys){const value=own(map,key)?map[key]:currentRecords[key];if(value!==undefined)fallback[key]=value}
  const value=JSON.stringify(fallback),old=localStorage.getItem(fk),at=updates.findIndex(pair=>pair[0]===fk);decode(fk,value);
  if(!own(before,fk))before[fk]=old;
  if(!own(logicalBefore,fk))logicalBefore[fk]=own(currentRecords,fk)?currentRecords[fk]:null;
  if(old!==null&&canon(decode(fk,old))===canon(fallback)){if(at>=0)updates.splice(at,1);continue}
  if(at>=0)updates[at]=[fk,value];else updates.push([fk,value]);
 }
}
