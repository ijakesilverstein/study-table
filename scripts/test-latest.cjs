/* Reproduce the combined downloadable edition without changing the foundation homepage. */
const {spawn}=require('child_process'),path=require('path');
const root=path.resolve(__dirname,'..'),edition=169,port=8931,candidate=path.join(root,`public/study-table-v${edition}.html`);
const run=(command,args,extra={})=>new Promise((resolve,reject)=>{const child=spawn(command,args,{cwd:root,stdio:'inherit',env:{...process.env,...extra}});child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(Error(`${command} ${args.join(' ')} exited ${code}`)))});
(async()=>{
 await run('python3',['scripts/build.py','--check']);
 await run('python3',['scripts/build-v169.py','--all']);
 await run('python3',['scripts/build-v169.py','--check']);
 await run('python3',['scripts/build-v166-journey-preview.py']);
 for(const file of ['check-reconciled-v163.py','check-v165-archive.py','check-spanish-v166.py','check-v167.py','check-v168.py','check-v166-preservation.py','check-v169.py'])await run('python3',['qa/'+file]);
 for(const file of ['test-v168-browser.cjs','test-dialog-race-v164.cjs','test-spanish-v166.cjs'])await run(process.execPath,['qa/'+file],{STUDY_CANDIDATE_HTML:candidate});
 const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory','public'],{cwd:root,stdio:'ignore'}),url=`http://127.0.0.1:${port}/study-table-v${edition}.html`;
 try{
  let ready=false;for(let i=0;i<60;i++){try{if((await fetch(url)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}if(!ready)throw Error('Latest-edition server unavailable');
  for(const file of ['test-progress-backup.cjs','test-lesson-companions-v136.cjs'])await run(process.execPath,['qa/'+file],{STUDY_TEST_URL:url,STUDY_RELEASE_EDITION:String(edition)});
  await run(process.execPath,['qa/test-v169.cjs'],{STUDY_V169_URL:url});
 }finally{server.kill('SIGTERM')}
 await run(process.execPath,['qa/test-v166-journey.cjs']);
 console.log('LATEST PASS: reconciled V169 built and verified; foundation homepage unchanged; no deployment.');
})().catch(e=>{console.error(e);process.exitCode=1});
