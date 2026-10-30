/* V167: connect one authored story to a lesson and a verified practice problem.
 * Existing seven readers, V136 companions, V133 checking and V166 Spanish reporting are unchanged.
 * The reflection is ungraded and unsaved; we never pretend to evaluate free-form writing. */
const V167_DATA=__V167_DATA__;
const V167_ROUTE=V167_DATA[COURSE.subject];
const V167_REFLECTIONS=V167_DATA.practiceReflections;
function v167PathMarkup(){
 const x=V167_ROUTE;
 const special=COURSE.subject==='spanish'?'<p class="v167-context">For Spanish, the final step can happen with a real person. It is never marked complete just by rehearsing here.</p>':'';
 return '<section id="v167Path" class="v167-path" aria-labelledby="v167PathTitle">'+
  '<p class="v167-eyebrow">A short way in</p><h2 id="v167PathTitle">'+escape(x.hook)+'</h2>'+
  '<p>'+escape(x.caption)+' Pick any step, in any order. No timer, score, or forced sequence.</p>'+
  '<div class="v167-steps">'+
  '<button type="button" data-v167="story">1. See what happens<small>Three decisions, with consequences</small></button>'+
  '<button type="button" data-v167="lesson">2. Understand why<small>A full worked lesson</small></button>'+
  '<button type="button" data-v167="practice">3. Try a new problem<small>Checked feedback, optional review</small></button></div>'+
  '<p class="v167-context">The practice problem is '+escape(x.practiceContext.charAt(0).toLowerCase()+x.practiceContext.slice(1))+'</p>'+special+
  '</section>';
}
function v167LessonBridge(unit){
 if(unit.id!==V167_ROUTE.storyUnit)return '';
 const same=unit.id===V167_ROUTE.practiceUnit;
 return '<aside class="v167-bridge"><h3>Put this idea to work</h3><p>'+escape(V167_ROUTE.nextText)+' '+(same?'There is a fresh checked problem in this lesson.':'You can also try another checked skill from this course.')+'</p><button type="button" data-v167="practice">'+(same?'Start the new problem':'Try a different skill')+'</button></aside>';
}
function v167ReflectMarkup(unit){
 const pair=V167_REFLECTIONS[unit.id];if(!pair||!V133_BANK[unit.id])return '';
 return '<section class="v167-reflect" id="v167Reflect" hidden aria-labelledby="v167ReflectTitle">'+
  '<p class="v167-eyebrow">Think about the step that mattered</p><h3 id="v167ReflectTitle">Could you explain it without the answer?</h3>'+
  '<p>'+escape(pair[0])+'</p><label for="v167Thought">Your explanation (optional; not graded or saved)</label>'+ 
  '<textarea id="v167Thought" rows="2" maxlength="600" placeholder="Say it aloud, or write it here. The point is to reason it through."></textarea>'+ 
  '<div class="v167-reflect-actions"><button type="button" data-v167="example" aria-expanded="false">Compare with an explanation</button><button type="button" data-v167="story">Try the story again</button></div>'+ 
  '<p class="v167-example" data-v167-example hidden>'+escape(pair[1])+'</p></section>';
}
function v167OpenPractice(){
 const id=V167_ROUTE.practiceUnit;
 if(!V133_BANK[id]||V133_BANK[id].subject!==COURSE.subject)return;
 showUnit(id);
 const host=document.getElementById('v133Practice');
 if(host){v133Start(host);host.scrollIntoView({block:'nearest'})}
}
function v167OpenStory(){
 if(!document.querySelector('#courseOutline'))showMap();
 const more=document.getElementById('v167More');if(more)more.open=true;
 const story=document.querySelector('.v165-story-discovery');if(story)story.open=true;
 document.querySelector('#v134Story [data-v134-start]')?.click();
 const q=document.querySelector('#v134Story [data-v134-question]');q?.scrollIntoView({block:'nearest'});
}
// Reuse existing editor-authored V133 checking. We display reflection only AFTER an
// actual answer was submitted; a blank/unparseable input never produces a verdict.
document.addEventListener('submit',event=>{
 if(!event.target.matches('[data-v133-form]'))return;
 const host=event.target.closest('[data-v133-unit-id]');
 const output=host?.querySelector('[data-v133-result]');
 const reflection=document.getElementById('v167Reflect');
 if(!reflection||!output||output.hidden)return;
 reflection.hidden=!['correct','misconception','unmatched','unverified'].includes(output.dataset.outcome);
},false);
function v167ResetReflection(event){
 const form=event.target.closest?.('[data-v133-form]');if(!form)return;
 const reflection=document.getElementById('v167Reflect');if(reflection){reflection.hidden=true;reflection.querySelector('[data-v167-example]').hidden=true;reflection.querySelector('[data-v167="example"]')?.setAttribute('aria-expanded','false')}
}
document.addEventListener('input',v167ResetReflection);
document.addEventListener('change',v167ResetReflection);
document.addEventListener('click',event=>{
 const button=event.target.closest?.('button[data-v167]');if(!button)return;
 const action=button.dataset.v167;
 if(action==='story')v167OpenStory();
 if(action==='lesson')showUnit(V167_ROUTE.storyUnit);
 if(action==='practice')v167OpenPractice();
 if(action==='world'&&typeof v166Open==='function')v166Open();
 if(action==='example'){
  const parent=button.closest('.v167-reflect'),sample=parent?.querySelector('[data-v167-example]');
  if(sample){sample.hidden=!sample.hidden;button.textContent=sample.hidden?'Compare with an explanation':'Hide the example';button.setAttribute('aria-expanded',String(!sample.hidden))}
 }
},false);
window.studyTablePathV167={version:167,course:COURSE.subject,route:V167_ROUTE,reflectionCount:Object.keys(V167_REFLECTIONS).length,story:v167OpenStory,lesson:()=>showUnit(V167_ROUTE.storyUnit),practice:v167OpenPractice};