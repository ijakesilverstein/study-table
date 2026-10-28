// A display revision keeps the original lesson record available for provenance and reuse.
const V126_REVISIONS=__LESSON_REVISIONS__;
function v126Lesson(stored){
 const revision=V126_REVISIONS[stored.id];if(!revision)return stored;
 return {...stored,opening:revision.opening,heading:revision.heading,teaching:revision.teaching,takeaway:revision.takeaway||stored.takeaway,first:{...stored.first,steps:revision.firstSteps,notice:revision.firstNotice},second:{...stored.second,steps:revision.secondSteps||stored.second.steps,notice:revision.secondNotice||stored.second.notice}};
}
function v126Reference(unit,id){
 const name=id==='courseFirst'?'first':'second',table=V126_REVISIONS[unit.id]?.tables?.[name];if(!table)return '';
 const columns=table.languageColumns||[];
 return '<div class="lesson-reference" data-lesson-revision="'+(V126_REVISIONS[unit.id].edition||126)+'"><table><caption>'+escape(table.caption)+'</caption><thead><tr>'+table.headers.map(h=>'<th scope="col">'+escape(h)+'</th>').join('')+'</tr></thead><tbody>'+table.rows.map(row=>'<tr>'+row.map((value,i)=>'<'+(i?'td':'th scope="row"')+(columns.includes(i)?' lang="es"':'')+'>'+escape(value)+'</'+(i?'td':'th')+'>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function v126Deeper(unit){const revision=V126_REVISIONS[unit.id],data=revision?.deeper,stored=byId.get(unit.id),notes=V122_TEACHER_NOTES[unit.id];
 let extra='';
 if(revision?.edition===127&&notes)extra='<details class="optional lesson-earlier-notes"><summary>Another explanation of this example</summary>'+notes.start.map(p=>'<p>'+escape(p)+'</p>').join('')+'<ol>'+notes.first.map(p=>'<li><p>'+escape(p)+'</p></li>').join('')+'</ol>'+v122Table(unit,'courseFirst',true)+'</details>';
 if(!data)return extra;
 return '<details class="optional lesson-deeper"><summary>'+escape(data.title)+'</summary>'+data.originalTeaching.map(i=>'<p>'+escape(stored.teaching[i])+'</p>').join('')+'</details>'+extra;
}
