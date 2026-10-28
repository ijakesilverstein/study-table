const fs=require('fs'),assert=require('assert/strict');
const stories=require('../source/story-mode-v134.json'),courses=require('../source/full-courses-built.json');
assert.equal(stories.length,7);
assert.deepEqual(new Set(stories.map(s=>s.subject)),new Set(Object.keys(courses)));
let beats=0,outcomes=0;
for(const story of stories){
 assert(story.title.length>10&&story.setup.length>45&&story.win.length>35&&story.detour.length>35,story.subject);
 assert(courses[story.subject].units.some(u=>u.id===story.unit),story.subject+' missing lesson link');
 assert.equal(story.beats.length,3,story.subject);
 for(const beat of story.beats){
  beats++;
  assert(beat.scene.length>=35&&beat.question.length>=12);
  assert.equal(beat.options.length,3);
  assert.equal(beat.options.filter(c=>c.works).length,1,story.subject+' ambiguous intended decision');
  assert.equal(new Set(beat.options.map(c=>c.label)).size,3);
  for(const c of beat.options){
   outcomes++;
   assert(c.label.length>=2&&c.after.length>=20&&c.why.length>=50,story.subject);
   assert(!/you (?:are a genius|nailed it|crushed it)/i.test(c.after+c.why),'No empty praise');
  }
 }
}
assert.equal(beats,21);assert.equal(outcomes,63);
const js=fs.readFileSync(require.resolve('../source/story-mode-v134.js'),'utf8');
assert(js.includes('v134Session={index:0,chosen:[]}'),'Story must reset transient session');
assert(!/(localStorage|sessionStorage|studytable_v102_learning)\s*\./.test(js),'Story must not write assessed progress');
assert(!/setInterval|setTimeout|Math\.random/.test(js),'No forced time, simulated urgency or random grading');
console.log('STORY_MODE_SOURCE_PASS: seven curriculum-grounded scenes, 21 decisions, 63 distinct consequences, no fake progress or timer.');
