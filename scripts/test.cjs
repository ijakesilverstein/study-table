const {spawn}=require('child_process'),path=require('path'),fs=require('fs');
const root=path.resolve(__dirname,'..'),port=8771;
const run=(cmd,args,env={})=>new Promise((resolve,reject)=>{const child=spawn(cmd,args,{cwd:root,stdio:'inherit',env:{...process.env,...env}});child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(Error(cmd+' exited '+code)))});
(async()=>{await run('python3',['scripts/build.py','--check']);await run('python3',['qa/check-chess-v109.py']);await run('python3',['qa/check-full-courses.py']);const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory','public'],{cwd:root,stdio:'ignore'});try{
 const url='http://127.0.0.1:'+port+'/index.html';let ready=false;for(let i=0;i<50;i++){try{if((await fetch(url)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}if(!ready)throw Error('Test server did not start');
 for(const file of ['test-v109.cjs','test-v109-audio.cjs','test-v109-spanish.cjs','test-challenges.cjs','test-curricula.cjs','test-contrast.cjs','test-full-courses.cjs','test-course-bridges.cjs','test-curriculum-edit.cjs'])await run(process.execPath,['qa/'+file],{STUDY_TEST_URL:url});
}finally{server.kill('SIGTERM')}})().catch(e=>{console.error(e);process.exitCode=1});
