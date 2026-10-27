const V122_TEACHER_NOTES=__TEACHER_NOTES__;
function v122Opening(unit){
 const guide=V122_TEACHER_NOTES[unit.id];if(!guide)return unit.opening.map(p=>'<p>'+escape(p)+'</p>').join('');
 return '<section class="teacher-start" aria-labelledby="teacherStartTitle"><h2 id="teacherStartTitle">'+escape(guide.title)+'</h2>'+guide.start.map(p=>'<p>'+escape(p)+'</p>').join('')+(guide.links.length?'<div class="teacher-prerequisites"><p>If you want to revisit an earlier explanation:</p>'+guide.links.map(id=>'<button class="text-button" type="button" data-course-unit="'+escape(id)+'">'+escape(byId.get(id).title)+'</button>').join('')+'</div>':'')+'</section>';
}
function v122Step(unit,id,index){
 const note=id==='courseFirst'&&V122_TEACHER_NOTES[unit.id]?.first[index];
 return note?'<aside class="teacher-aside" aria-label="More explanation of this step"><p>'+escape(note)+'</p></aside>':'';
}
function v122Table(unit,id){
 const table=id==='courseFirst'&&V122_TEACHER_NOTES[unit.id]?.table;if(!table)return '';
 return '<div class="teacher-table"><table><caption>'+escape(table.caption)+'</caption><thead><tr>'+table.headers.map(h=>'<th scope="col">'+escape(h)+'</th>').join('')+'</tr></thead><tbody>'+table.rows.map(row=>'<tr>'+row.map((value,i)=>i===0?'<th scope="row">'+escape(value)+'</th>':'<td>'+escape(value)+'</td>').join('')+'</tr>').join('')+'</tbody></table><p>'+escape(table.after)+'</p></div>';
}
