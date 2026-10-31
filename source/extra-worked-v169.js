// Fully worked examples recovered from the parallel journey; no answer-entry gate.
const V169_WORKED=__V169_WORKED__;
function v169ExampleBody(example){
 return '<h3>'+escape(example.title)+'</h3><p class="v169-setup">'+escape(example.prompt.replace(/\s*Enter a number\./g,''))+'</p><ol class="v169-working">'+example.steps.map(step=>'<li><h4>'+escape(step[0])+'</h4><p class="calculation">'+escape(step[1])+'</p><p>'+escape(step[2])+'</p></li>').join('')+'</ol><p class="v169-result">Worked result: '+escape(example.answer)+'</p><details class="v169-wrong"><summary>Compare common wrong turns</summary><dl>'+Object.entries(example.wrong).map(([attempt,why])=>'<dt>'+escape(attempt)+'</dt><dd>'+escape(why)+'</dd>').join('')+'</dl></details>';
}
function v169WorkedMarkup(unit){
 if(!Object.prototype.hasOwnProperty.call(V169_WORKED,unit.id))return '';
 const examples=V169_WORKED[unit.id];
 return '<details class="v169-examples" data-v169-unit="'+escape(unit.id)+'"><summary>Watch another worked example</summary><p>Choose either example and follow the complete solution. You can read it before trying anything yourself.</p><label for="v169Example">Choose the example</label><select id="v169Example" data-v169-example>'+examples.map((example,i)=>'<option value="'+i+'">'+escape(example.title)+'</option>').join('')+'</select><div data-v169-working>'+v169ExampleBody(examples[0])+'</div></details>';
}
document.addEventListener('change',event=>{
 const select=event.target.closest?.('[data-v169-example]');if(!select)return;
 const host=select.closest('[data-v169-unit]'),id=host?.dataset.v169Unit,index=Number(select.value);
 if(!Object.prototype.hasOwnProperty.call(V169_WORKED,id)||!Number.isInteger(index)||index<0||index>=V169_WORKED[id].length)return;
 host.querySelector('[data-v169-working]').innerHTML=v169ExampleBody(V169_WORKED[id][index]);
});
