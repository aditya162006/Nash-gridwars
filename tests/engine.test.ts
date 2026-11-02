import assert from 'node:assert/strict';
import {generate,solve,area,validate,overlap} from '../src/engine.ts';
const start=performance.now();let unique=0;
for(const n of [4,6,8,10])for(let run=0;run<15;run++){
 const p=generate(n);assert(solve(n,p.clues)>0);if(p.unique)unique++;
 assert.equal(p.solution.reduce((a,r)=>a+area(r),0),n*n);
 const claims=[];for(const r of p.solution){assert.equal(validate(p,r,claims),'');assert(!claims.some(c=>overlap(c,r)));claims.push(r);}
 assert(validate(p,p.solution[0],claims).includes('claimed'));
 assert(new Set(p.clues.map(c=>c.value)).size<p.clues.length);
}
console.log(`60 puzzles verified; ${unique} unique; ${Math.round(performance.now()-start)} ms`);
const memory=new Map();Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>memory.get(k)||null,setItem:(k:string,v:string)=>memory.set(k,v)}});
const {useGame}=await import('../src/store.ts');const g=useGame;g.getState().updateSettings({sound:false,timer:45});g.getState().start();g.setState({countdown:0});
const solution=g.getState().puzzle.solution;g.getState().claim(solution[0]);assert.equal(g.getState().scores[0],area(solution[0]));assert.equal(g.getState().turn,1);
const previous=g.getState().captures.length;g.getState().claim(solution[0]);assert.equal(g.getState().captures.length,previous);assert.equal(g.getState().invalid[1],1);
g.getState().snap(0);assert.equal(g.getState().scores[0],area(solution[0])-2);
const same=solution.find((r,i)=>i>0&&area(r)===area(solution[0]));if(same){g.getState().claim(same);assert(g.getState().snapUntil>0);const before=g.getState().scores[0];g.getState().snap(0);assert.equal(g.getState().scores[0],before+3);assert.equal(g.getState().snaps[0],1);g.getState().snap(1);assert.equal(g.getState().snaps[1],0);}
for(const r of solution){if(g.getState().captures.some(c=>overlap(c,r)))continue;g.getState().claim(r);if(g.getState().snapUntil)g.getState().snap(0);}
assert.equal(g.getState().phase,'result');assert.equal(g.getState().territory.reduce((a,b)=>a+b,0),36);
g.getState().next();assert.equal(g.getState().phase,'play');assert.equal(g.getState().captures.length,0);
g.setState({countdown:0,deadline:performance.now()-10,snapUntil:0});const turn=g.getState().turn;g.getState().tick();assert.equal(g.getState().turn,1-turn);
g.setState({scores:[20,20],winner:null,phase:'result'});g.getState().next();assert.equal(g.getState().puzzle.n,4);assert.deepEqual(g.getState().scores,[20,20]);
g.getState().start();assert.deepEqual(g.getState().wins,[0,0]);assert.deepEqual(g.getState().scores,[0,0]);
console.log('State tests passed: captures, overlap, penalties, SNAP, round completion, timeout, sudden death, rematch.');
// Invalid rectangle penalties must affect only the current player's score.
const p={n:4,unique:true,clues:[{x:0,y:0,value:4},{x:2,y:0,value:4},{x:0,y:2,value:4},{x:2,y:2,value:4}],solution:[{x:0,y:0,w:2,h:2},{x:2,y:0,w:2,h:2},{x:0,y:2,w:2,h:2},{x:2,y:2,w:2,h:2}]};
for(const player of [0,1])for(const r of [{x:0,y:0,w:1,h:1},{x:1,y:1,w:1,h:1},{x:0,y:0,w:4,h:1}]){
 g.setState({phase:'play',puzzle:p,captures:[],scores:[0,0],invalid:[0,0],territory:[0,0],turn:player,countdown:0,snapUntil:0,deadline:performance.now()+10000});
 const deadline=g.getState().deadline;g.getState().claim(r);const s=g.getState();assert.equal(s.scores[player],-2);assert.equal(s.scores[1-player],0);assert.equal(s.turn,player);assert.equal(s.captures.length,0);assert.deepEqual(s.territory,[0,0]);assert.equal(s.invalid[player],1);assert.equal(s.deadline,deadline);assert(s.rejection);assert(s.message.includes('−2 points'));
 g.getState().claim(r);assert.equal(g.getState().scores[player],-4);
 g.getState().claim(p.solution[0]);assert.equal(g.getState().scores[player],0);assert.equal(g.getState().rejection,null);assert.equal(g.getState().turn,1-player);
 g.getState().claim(p.solution[0]);assert.equal(g.getState().scores[1-player],-2);assert.equal(g.getState().captures.length,1);
}
g.setState({snapUntil:performance.now()+2000});const frozen=[...g.getState().scores];g.getState().claim(p.solution[0]);assert.deepEqual(g.getState().scores,frozen);
console.log('Penalty regression passed: both players, wrong area, no clue, multiple clues, repeat attempts, overlap, unchanged timer/turn/territory, and locked SNAP window.');
