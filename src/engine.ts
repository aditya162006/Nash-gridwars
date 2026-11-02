export type Rect={x:number;y:number;w:number;h:number};
export type Clue={x:number;y:number;value:number};
export type Puzzle={n:number;clues:Clue[];solution:Rect[];unique:boolean};
export const area=(r:Rect)=>r.w*r.h;
export const inside=(r:Rect,x:number,y:number)=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;
export const overlap=(a:Rect,b:Rect)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function mask(r:Rect,n:number){let m=0n;for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)m|=1n<<BigInt(y*n+x);return m;}
export function solve(n:number,clues:Clue[],fixed:Rect[]=[],limit=2){
 const candidates=clues.map(c=>{const out:{r:Rect;m:bigint}[]=[];for(let w=1;w<=n;w++){if(c.value%w)continue;const h=c.value/w;if(h>n)continue;for(let y=Math.max(0,c.y-h+1);y<=Math.min(c.y,n-h);y++)for(let x=Math.max(0,c.x-w+1);x<=Math.min(c.x,n-w);x++){const r={x,y,w,h};if(clues.filter(q=>inside(r,q.x,q.y)).length===1)out.push({r,m:mask(r,n)});}}return out;});
 let occupied=0n;let remaining=clues.map((_,i)=>i);for(const r of fixed){const m=mask(r,n);if(occupied&m)return 0;occupied|=m;remaining=remaining.filter(i=>!inside(r,clues[i].x,clues[i].y));}
 let count=0;const full=(1n<<BigInt(n*n))-1n;
 function dfs(ids:number[],used:bigint){if(count>=limit)return;if(!ids.length){if(used===full)count++;return;}let best=-1,options:typeof candidates[0]=[];for(const id of ids){const available=candidates[id].filter(c=>!(c.m&used));if(!available.length)return;if(best<0||available.length<options.length){best=id;options=available;}}for(const c of options){dfs(ids.filter(i=>i!==best),used|c.m);if(count>=limit)return;}}
 dfs(remaining,occupied);return count;
}
export function generate(n:number):Puzzle{
 let fallback:Puzzle|undefined;
 for(let attempt=0;attempt<70;attempt++){
 const solution:Rect[]=[];
 function split(r:Rect){if(area(r)<=10&&(area(r)<=3||Math.random()<.62)){solution.push(r);return;}const horizontal=r.h>1&&(r.w===1||Math.random()<.5);const extent=horizontal?r.h:r.w;if(extent===1){solution.push(r);return;}const cut=1+Math.floor(Math.random()*(extent-1));if(horizontal){split({...r,h:cut});split({...r,y:r.y+cut,h:r.h-cut});}else{split({...r,w:cut});split({...r,x:r.x+cut,w:r.w-cut});}}
 split({x:0,y:0,w:n,h:n});
 const clues=solution.map(r=>({x:r.x+Math.floor(Math.random()*r.w),y:r.y+Math.floor(Math.random()*r.h),value:area(r)}));
 const values=clues.map(c=>c.value);if(new Set(values).size===values.length)continue;
 const count=solve(n,clues);if(count===0)continue;fallback={n,clues,solution,unique:count===1};if(count===1)return fallback;
 }
 if(fallback)return fallback;throw Error('Puzzle generation failed');
}
export function validate(p:Puzzle,r:Rect,claimed:Rect[]){if(r.x<0||r.y<0||r.x+r.w>p.n||r.y+r.h>p.n)return 'Stay inside the grid.';if(claimed.some(c=>overlap(c,r)))return 'That territory is already claimed.';const clues=p.clues.filter(c=>inside(r,c.x,c.y));if(clues.length!==1)return 'Include exactly one numbered clue.';if(clues[0].value!==area(r))return `Area ${area(r)} does not match clue ${clues[0].value}.`;if(!solve(p.n,p.clues,[...claimed,r],1))return 'This rectangle would leave the board unsolvable.';return '';}
