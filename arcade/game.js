/* "Zach Gets to the Customers" — an original crossing game for zacharytyewennstedt.com.
   Real 3D coordinates drawn through a perspective camera onto a 2D canvas (no libraries,
   no downloads, runs on a phone). Five levels, collectibles that build a business, an
   old-skool 16-bit mode, keyboard + swipe + on-screen pad. Everything here is original art. */
(function(){
'use strict';
var D=document,W=window;
var cv=D.getElementById('zg');if(!cv)return;
var ctx=cv.getContext('2d');
var RM=W.matchMedia&&W.matchMedia('(prefers-reduced-motion:reduce)').matches;
var $=function(i){return D.getElementById(i);};

/* ---------- levels ---------- */
var LEVELS=[
 {name:'Denver Streets',sub:'Collect the 5-star reviews',item:'star',itemName:'5-star review',sky:['#7cc4ff','#e9f6ff'],ground:'#b9e08a',road:'#4a4f5a',dash:'#f4e2a0',rows:[
   ['road',1.9,1,'car'],['road',2.4,-1,'car'],['grass'],['road',2.8,1,'truck'],['road',2.2,-1,'car'],['grass'],['road',3.1,1,'bus'],['road',2.6,-1,'car'],['grass']]},
 {name:'The South Platte',sub:'Ride the rafts. Collect the citations',item:'pin',itemName:'citation',sky:['#5fb3e6','#dff3ff'],ground:'#a9d97a',road:'#3b8fc9',dash:null,water:true,rows:[
   ['water',1.6,1,'log'],['water',2.0,-1,'raft'],['water',1.7,1,'log'],['grass'],['water',2.3,-1,'raft'],['water',1.9,1,'log'],['water',2.5,-1,'board'],['grass']]},
 {name:'Construction Zone',sub:'Dodge the crews. Earn the BBB A+',item:'shield',itemName:'BBB A+ seal',sky:['#ffb347','#fff1d6'],ground:'#d7c39a',road:'#6d6357',dash:'#ffcc33',rows:[
   ['road',2.6,1,'cone'],['road',2.1,-1,'digger'],['road',3.2,1,'cone'],['grass'],['road',2.4,-1,'mixer'],['road',2.9,1,'cone'],['road',2.2,-1,'digger'],['grass']]},
 {name:'Parking Lot, 11 p.m.',sub:'Outrun the shared-lead salesman. Build the website',item:'laptop',itemName:'website',sky:['#0b1440','#2a2f6b'],ground:'#2a2f3d',road:'#1f2330',dash:'#5a6180',night:true,chaser:true,rows:[
   ['road',2.8,1,'car'],['road',3.1,-1,'car'],['road',2.5,1,'truck'],['grass'],['road',3.4,-1,'car'],['road',2.7,1,'car'],['road',3.0,-1,'bus'],['grass']]},
 {name:'The Art Gallery',sub:'Paint your way to the pipeline',item:'pipe',itemName:'pipeline',sky:['#ff9ecf','#fff5b8'],ground:'#ffe9f4',road:'#ffffff',dash:null,art:true,rows:[
   ['road',2.4,1,'brush'],['road',3.0,-1,'canvas'],['road',2.7,1,'roller'],['grass'],['road',3.3,-1,'brush'],['road',2.5,1,'canvas'],['road',3.6,-1,'roller'],['road',2.9,1,'brush'],['grass']]}
];
var PAL16=['#0f0f23','#1b3d6b','#2e6fd1','#63d1ff','#1f8f3a','#4ad14a','#a8ff6a','#ff4a4a','#ff9c2b','#ffd93b','#ff5fb8','#b95cff','#8a5a2b','#d2a679','#e8e8e8','#ffffff'];

/* ---------- state ---------- */
var S={lvl:0,lives:3,score:0,items:[],t:0,mode:'3d',running:false,dead:0,won:false,over:false,paused:false};
var world={rows:[],lanes:0,cols:9,player:{x:4,z:0,hx:4,hz:0,hop:0,dir:0,onLog:null},obs:[],pickups:[],chaser:null,confetti:[],msg:''};
var lastT=0,dpr=Math.min(W.devicePixelRatio||1,2),CW=0,CH=0;

/* ---------- audio (tiny synth, off until the visitor taps sound) ---------- */
var AC=null,soundOn=false;
function beep(f,d,type){if(!soundOn)return;try{AC=AC||new (W.AudioContext||W.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d);}catch(e){}}

/* ---------- build level ---------- */
function build(li){
  var L=LEVELS[li];world.rows=[];world.obs=[];world.pickups=[];world.chaser=null;world.confetti=[];
  world.rows.push({type:'grass'});
  L.rows.forEach(function(r,i){var row={type:r[0],speed:r[1]||0,dir:r[2]||1,kind:r[3]||''};world.rows.push(row);});
  world.rows.push({type:'goal'});
  world.lanes=world.rows.length;
  world.player={x:4,z:0,hx:4,hz:0,hop:0,dir:0,onLog:null};
  var spd=1+li*.12;
  world.rows.forEach(function(row,z){
    if(row.type==='road'||row.type==='water'){
      var n=row.type==='water'?3:2+(z%2);var gap=world.cols/n;
      for(var k=0;k<n;k++){var len=row.type==='water'?(row.kind==='raft'?2.2:row.kind==='board'?1.4:2.6):(row.kind==='bus'?2.4:row.kind==='truck'||row.kind==='digger'||row.kind==='mixer'?1.8:row.kind==='cone'?.6:1.2);
        world.obs.push({z:z,x:k*gap+Math.random()*1.5,len:len,speed:row.speed*spd*row.dir,kind:row.kind,water:row.type==='water',hue:Math.random()});}
    }
    if(row.type==='grass'&&z>0&&z<world.lanes-1){for(var q=0;q<2;q++)world.pickups.push({z:z,x:Math.floor(Math.random()*world.cols),got:false,spin:Math.random()*6});}
  });
  world.pickups.push({z:world.lanes-1,x:Math.floor(world.cols/2),got:false,spin:0,big:true});
  if(L.chaser)world.chaser={x:8,z:2,t:0};
  S.items=[];S.t=0;S.dead=0;world.msg='';
}

/* ---------- camera / projection ---------- */
function proj(x,y,z){
  /* world: x across (0..cols), z depth (0 = nearest to camera), y up */
  var px=world.player.hx,pz=world.player.hz;
  var camZ=pz-3.2,camY=2.6,camX=px+.5;
  var dz=z-camZ,dx=x-camX;
  var f=CH*1.1/Math.max(.6,dz+2.5);
  var sx=CW/2+dx*f*.78,sy=CH*.36+(camY-y)*f*.9;
  return {x:sx,y:sy,s:f};
}
function box(x,z,w,d,h,top,side,front,y0){
  y0=y0||0;
  var a=proj(x,y0,z),b=proj(x+w,y0,z),c=proj(x+w,y0,z+d),dd=proj(x,y0,z+d);
  var a2=proj(x,y0+h,z),b2=proj(x+w,y0+h,z),c2=proj(x+w,y0+h,z+d),d2=proj(x,y0+h,z+d);
  ctx.fillStyle=side;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(c2.x,c2.y);ctx.lineTo(b2.x,b2.y);ctx.closePath();ctx.fill();
  ctx.fillStyle=front;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(b2.x,b2.y);ctx.lineTo(a2.x,a2.y);ctx.closePath();ctx.fill();
  ctx.fillStyle=top;ctx.beginPath();ctx.moveTo(a2.x,a2.y);ctx.lineTo(b2.x,b2.y);ctx.lineTo(c2.x,c2.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.fill();
}
function shade(hex,k){var c=parseInt(hex.slice(1),16),r=(c>>16)&255,g=(c>>8)&255,b=c&255;r=Math.max(0,Math.min(255,r*k|0));g=Math.max(0,Math.min(255,g*k|0));b=Math.max(0,Math.min(255,b*k|0));return 'rgb('+r+','+g+','+b+')';}

/* ---------- drawing pieces ---------- */
function drawRow(z,row,L){
  var y=0;var a=proj(-1,y,z),b=proj(world.cols+1,y,z),c=proj(world.cols+1,y,z+1),d=proj(-1,y,z+1);
  var col=row.type==='grass'?L.ground:row.type==='water'?L.road:row.type==='goal'?(L.art?'#ffd6ea':'#ffe08a'):L.road;
  if(row.type==='water'){var w=Math.sin(S.t*2+z)*.04;col=shade(L.road,1+w);}
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();
  if(row.type==='grass'&&!L.night){ctx.fillStyle='rgba(255,255,255,.08)';for(var i=0;i<world.cols;i+=2){var p=proj(i+.2,0,z+.3),q=proj(i+.8,0,z+.3);ctx.fillRect(p.x,p.y-1,Math.max(1,q.x-p.x),1);}}
  if(row.type==='road'&&L.dash){ctx.strokeStyle=L.dash;ctx.lineWidth=Math.max(1,a.s*.03);ctx.setLineDash([a.s*.25,a.s*.2]);var m1=proj(-1,0.01,z+.5),m2=proj(world.cols+1,0.01,z+.5);ctx.beginPath();ctx.moveTo(m1.x,m1.y);ctx.lineTo(m2.x,m2.y);ctx.stroke();ctx.setLineDash([]);}
  if(row.type==='goal'){var g=proj(world.cols/2,0,z+.5);ctx.fillStyle=L.night?'#ffd93b':'#ff2d78';ctx.font='700 '+Math.max(10,g.s*.16)+'px Unbounded,sans-serif';ctx.textAlign='center';ctx.fillText(L.art?'THE PIPELINE':'THE CUSTOMERS',g.x,g.y-g.s*.05);}
}
function drawObstacle(o,L){
  var k=o.kind,x=o.x,z=o.z+.15,d=.7;
  if(k==='car'){var hue=L.night?['#ff4a4a','#4ad1ff','#ffd93b','#b95cff'][Math.floor(o.hue*4)]:['#ff3b30','#2b5cff','#00c489','#ff7a00','#8b3dff'][Math.floor(o.hue*5)];box(x,z,o.len,d,.32,shade(hue,1.15),shade(hue,.75),hue);box(x+o.len*.25,z+.1,o.len*.5,d-.2,.2,'#dfefff','#9fbbe0','#cfe4ff',.32);
    if(L.night){ctx.fillStyle='rgba(255,240,150,.18)';var h1=proj(o.speed>0?x+o.len:x,.2,z+.35);ctx.beginPath();ctx.arc(h1.x,h1.y,h1.s*.35,0,7);ctx.fill();}}
  else if(k==='bus'){box(x,z,o.len,d,.5,'#ffe27a','#c99a12','#ffd63b');box(x+.1,z+.05,o.len-.2,d-.1,.05,'#7bd3ff','#4aa0d1','#7bd3ff',.3);}
  else if(k==='truck'){box(x,z,o.len*.35,d,.4,'#ff9c2b','#b85f00','#ff7a00');box(x+o.len*.35,z,o.len*.65,d,.55,'#e8e8e8','#a8a8b0','#f4f4f4');}
  else if(k==='log'){box(x,z,o.len,d-.1,.22,'#c98b4b','#7a4c1e','#a8692c',-.1);}
  else if(k==='raft'){box(x,z,o.len,d-.05,.14,'#ffd93b','#c9a010','#ffe27a',-.1);box(x+o.len*.3,z+.2,.2,.2,.5,'#ff2d78','#b31a55','#ff5fa0',.04);}
  else if(k==='board'){box(x,z+.15,o.len,d-.35,.1,'#63d1ff','#2e8fc1','#8fe0ff',-.1);}
  else if(k==='cone'){box(x+.1,z+.15,.4,.4,.5,'#ff7a00','#b85400','#ff9c2b');box(x+.18,z+.23,.24,.24,.52,'#ffffff','#cfcfcf','#ffffff',.2);}
  else if(k==='digger'){box(x,z,o.len,d,.45,'#ffd93b','#b39000','#ffcc33');box(x+o.len*.6,z+.1,o.len*.3,d-.2,.5,'#2b2b2b','#111','#333',.45);}
  else if(k==='mixer'){box(x,z,o.len*.4,d,.4,'#63d1ff','#2e8fc1','#4ab3e6');box(x+o.len*.4,z+.05,o.len*.6,d-.1,.6,'#e8e8e8','#9a9aa0','#f2f2f2');}
  else if(k==='brush'){box(x,z+.2,o.len,d-.4,.18,'#8a5a2b','#4c2f13','#b07a3c');box(x+o.len-.35,z+.1,.35,d-.2,.3,['#ff2d78','#00d9f5','#ffd60a','#8b3dff'][Math.floor(o.hue*4)],'#333','#444');}
  else if(k==='canvas'){var cc=['#ff9ecf','#a8ff6a','#63d1ff','#ffd93b'][Math.floor(o.hue*4)];box(x,z+.25,o.len,.1,.9,'#fff',cc,'#fff');}
  else if(k==='roller'){box(x,z+.15,o.len,d-.3,.3,['#ff5fb8','#4ad14a','#2e6fd1'][Math.floor(o.hue*3)],'#333','#555');}
  else {box(x,z,o.len,d,.3,'#999','#666','#888');}
}
function drawPickup(p,L){
  if(p.got)return;var bob=Math.sin(S.t*3+p.spin)*.08;var x=p.x+.5,z=p.z+.5,y=.35+bob;
  var q=proj(x,y,z),s=q.s*(p.big?.22:.15);
  ctx.save();ctx.translate(q.x,q.y);
  if(L.item==='star'){ctx.fillStyle='#ffd60a';star(0,0,5,s,s*.45);ctx.fillStyle='#ffb000';ctx.font='700 '+Math.max(8,s*.9)+'px Space Grotesk,sans-serif';ctx.textAlign='center';ctx.fillText('5',0,s*.35);}
  else if(L.item==='pin'){ctx.fillStyle='#ff2d78';ctx.beginPath();ctx.arc(0,-s*.4,s*.7,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-s*.6,-s*.2);ctx.lineTo(s*.6,-s*.2);ctx.lineTo(0,s*.9);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,-s*.4,s*.3,0,7);ctx.fill();}
  else if(L.item==='shield'){ctx.fillStyle='#0b4d9c';ctx.beginPath();ctx.moveTo(-s*.8,-s*.9);ctx.lineTo(s*.8,-s*.9);ctx.lineTo(s*.8,s*.1);ctx.quadraticCurveTo(0,s*1.1,-s*.8,s*.1);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.font='900 '+Math.max(8,s*.9)+'px Unbounded,sans-serif';ctx.textAlign='center';ctx.fillText('A+',0,s*.25);}
  else if(L.item==='laptop'){ctx.fillStyle='#2b2b3b';ctx.fillRect(-s*.9,-s*.9,s*1.8,s*1.1);ctx.fillStyle='#63d1ff';ctx.fillRect(-s*.8,-s*.8,s*1.6,s*.9);ctx.fillStyle='#8a8aa0';ctx.fillRect(-s*1.1,s*.2,s*2.2,s*.25);}
  else {ctx.fillStyle='#8b3dff';ctx.fillRect(-s*1.1,-s*.35,s*2.2,s*.7);ctx.fillStyle='#b98cff';ctx.fillRect(-s*1.2,-s*.5,s*.4,s*1);ctx.fillRect(s*.8,-s*.5,s*.4,s*1);}
  ctx.restore();
}
function star(cx,cy,n,R,r){ctx.beginPath();for(var i=0;i<n*2;i++){var rad=i%2?r:R,a=Math.PI/n*i-Math.PI/2;ctx.lineTo(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad);}ctx.closePath();ctx.fill();}
function drawZach(L){
  var p=world.player,hop=Math.sin(Math.min(1,p.hop)*Math.PI)*.45;
  var x=p.hx+.22,z=p.hz+.2,y=hop;
  /* shadow */
  var sh=proj(p.hx+.5,0,p.hz+.5);ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(sh.x,sh.y,sh.s*.22,sh.s*.09,0,0,7);ctx.fill();
  if(S.dead){var f=Math.min(1,S.dead);ctx.globalAlpha=1-f*.8;}
  box(x+.08,z+.1,.4,.4,.45,'#2b5cff','#1a3aa8','#2f66ff',y);          /* body: blue shirt */
  box(x+.12,z+.15,.14,.3,.3,'#3a3f5a','#22263a','#2f3450',y-.3+.3);   /* legs */
  box(x+.34,z+.15,.14,.3,.3,'#3a3f5a','#22263a','#2f3450',y);
  box(x+.1,z+.1,.36,.4,.34,'#f5cba7','#c99a77','#ffd8b5',y+.45);      /* head */
  box(x+.08,z+.08,.4,.44,.14,'#ffe27a','#d1b13b','#ffd93b',y+.79);   /* blonde hair */
  box(x+.1,z+.05,.36,.1,.2,'#ffe27a','#d1b13b','#ffd93b',y+.62);     /* fringe */
  var e=proj(x+.28,y+.62,z+.1);ctx.fillStyle='#1b1f2b';ctx.fillRect(e.x-e.s*.055,e.y-e.s*.02,e.s*.03,e.s*.03);ctx.fillRect(e.x+e.s*.025,e.y-e.s*.02,e.s*.03,e.s*.03);
  ctx.fillStyle='#c0392b';ctx.fillRect(e.x-e.s*.03,e.y+e.s*.05,e.s*.06,e.s*.015); /* smile */
  ctx.globalAlpha=1;
}
function drawChaser(L){
  var c=world.chaser;if(!c)return;var x=c.x+.2,z=c.z+.2;
  box(x+.08,z+.1,.4,.4,.5,'#8a5a2b','#5a3a17','#a87441');box(x+.1,z+.1,.36,.4,.34,'#e8b9a0','#b88c74','#f2c9b2',.5);box(x+.08,z+.08,.4,.44,.1,'#222','#000','#333',.84);
  var t=proj(x+.28,1.05,z+.2);ctx.fillStyle='#fff';ctx.font='700 '+Math.max(9,t.s*.09)+'px Space Grotesk,sans-serif';ctx.textAlign='center';ctx.fillText('"Buy leads!"',t.x,t.y);
}

/* ---------- old-skool renderer (top-down, 16-bit) ---------- */
function drawRetro(L){
  var tile=Math.floor(Math.min(CW/world.cols,CH/world.lanes));var ox=(CW-tile*world.cols)/2,oy=(CH-tile*world.lanes)/2;
  ctx.fillStyle=PAL16[0];ctx.fillRect(0,0,CW,CH);ctx.save();ctx.beginPath();ctx.rect(ox,oy,tile*world.cols,tile*world.lanes);ctx.clip();
  for(var z=0;z<world.lanes;z++){var row=world.rows[z],sy=oy+(world.lanes-1-z)*tile;
    ctx.fillStyle=row.type==='grass'?PAL16[4]:row.type==='water'?PAL16[2]:row.type==='goal'?PAL16[9]:PAL16[1];ctx.fillRect(ox,sy,tile*world.cols,tile);
    if(row.type==='grass'){ctx.fillStyle=PAL16[5];for(var i=0;i<world.cols;i++)if((i+z)%2)ctx.fillRect(ox+i*tile+tile*.3,sy+tile*.3,tile*.4,tile*.4);}
    if(row.type==='goal'){ctx.fillStyle=PAL16[0];ctx.font='700 '+Math.max(8,tile*.5)+'px monospace';ctx.textAlign='center';ctx.fillText('GOAL',ox+tile*world.cols/2,sy+tile*.7);}
  }
  world.obs.forEach(function(o){var sy=oy+(world.lanes-1-o.z)*tile;var x=ox+o.x*tile;var w=o.len*tile;var col=o.water?PAL16[12]:PAL16[7+Math.floor(o.hue*4)];ctx.fillStyle=col;ctx.fillRect(x,sy+tile*.15,w,tile*.7);ctx.fillStyle=PAL16[15];if(!o.water)ctx.fillRect(x+w*.2,sy+tile*.25,w*.6,tile*.2);
    /* wrap draw */
    if(x+w>ox+tile*world.cols){ctx.fillStyle=col;ctx.fillRect(x-tile*world.cols,sy+tile*.15,w,tile*.7);}});
  world.pickups.forEach(function(p){if(p.got)return;var sy=oy+(world.lanes-1-p.z)*tile,x=ox+p.x*tile;ctx.fillStyle=PAL16[9];star(x+tile/2,sy+tile/2,5,tile*.3,tile*.14);});
  if(world.chaser){var c=world.chaser,sy=oy+(world.lanes-1-c.z)*tile;ctx.fillStyle=PAL16[12];ctx.fillRect(ox+c.x*tile+tile*.2,sy+tile*.2,tile*.6,tile*.6);}
  var p=world.player,sy2=oy+(world.lanes-1-p.hz)*tile,px=ox+p.hx*tile;var hop=Math.sin(Math.min(1,p.hop)*Math.PI)*tile*.2;
  ctx.fillStyle=PAL16[2];ctx.fillRect(px+tile*.25,sy2+tile*.35-hop,tile*.5,tile*.45);ctx.fillStyle=PAL16[13];ctx.fillRect(px+tile*.28,sy2+tile*.12-hop,tile*.44,tile*.3);ctx.fillStyle=PAL16[9];ctx.fillRect(px+tile*.25,sy2+tile*.06-hop,tile*.5,tile*.12);
  ctx.restore();
  /* scanlines */
  ctx.fillStyle='rgba(0,0,0,.18)';for(var y=0;y<CH;y+=3)ctx.fillRect(0,y,CW,1);
}

/* ---------- main render ---------- */
function render(){
  var L=LEVELS[S.lvl];
  if(S.mode==='retro'){drawRetro(L);return;}
  var g=ctx.createLinearGradient(0,0,0,CH);g.addColorStop(0,L.sky[0]);g.addColorStop(1,L.sky[1]);ctx.fillStyle=g;ctx.fillRect(0,0,CW,CH);
  if(L.night){ctx.fillStyle='#fff';for(var i=0;i<40;i++){ctx.globalAlpha=.4+.6*Math.abs(Math.sin(S.t+i));ctx.fillRect((i*97)%CW,(i*53)%(CH*.4),2,2);}ctx.globalAlpha=1;}
  if(L.art){for(var j=0;j<6;j++){ctx.fillStyle=['#ff2d78','#00d9f5','#ffd60a','#8b3dff','#00c489','#ff7a00'][j];ctx.globalAlpha=.25;ctx.beginPath();ctx.arc((j*173+S.t*20)%CW,CH*.12+Math.sin(S.t+j)*30,40,0,7);ctx.fill();}ctx.globalAlpha=1;}
  /* mountains */
  ctx.fillStyle=L.night?'#141a3f':L.art?'#e6b8ff':'#7fa8c9';ctx.beginPath();ctx.moveTo(0,CH*.42);for(var m=0;m<=8;m++){ctx.lineTo(CW*m/8,CH*(.42-.1*Math.abs(Math.sin(m*1.7))));}ctx.lineTo(CW,CH*.42);ctx.closePath();ctx.fill();
  /* ground plane under and around the rows */
  (function(){var a=proj(-30,0,world.lanes+6),b=proj(30,0,world.lanes+6),c=proj(30,0,-6),d=proj(-30,0,-6);ctx.fillStyle=L.night?'#1b2030':L.art?'#ffe9f4':shade(L.ground,.92);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();})();
  /* rows far to near */
  for(var z=world.lanes-1;z>=0;z--)drawRow(z,world.rows[z],L);
  /* objects far to near */
  var items=[];world.obs.forEach(function(o){items.push({z:o.z,f:function(){drawObstacle(o,L);}});});
  world.pickups.forEach(function(p){items.push({z:p.z,f:function(){drawPickup(p,L);}});});
  if(world.chaser)items.push({z:world.chaser.z,f:function(){drawChaser(L);}});
  items.push({z:world.player.hz,f:function(){drawZach(L);}});
  items.sort(function(a,b){return b.z-a.z;}).forEach(function(i){i.f();});
  world.confetti.forEach(function(c){ctx.fillStyle=c.c;ctx.fillRect(c.x,c.y,4,4);});
  if(L.night){ctx.fillStyle='rgba(10,12,40,.25)';ctx.fillRect(0,0,CW,CH);}
}
/* ---------- update ---------- */
function update(dt){
  if(!S.running||S.paused)return;S.t+=dt;var p=world.player,L=LEVELS[S.lvl];
  if(p.hop<1){p.hop=Math.min(1,p.hop+dt*7);p.hx+=(p.x-p.hx)*Math.min(1,dt*14);p.hz+=(p.z-p.hz)*Math.min(1,dt*14);}else{p.hx=p.x;p.hz=p.z;}
  world.obs.forEach(function(o){o.x+=o.speed*dt;if(o.x>world.cols+1)o.x=-o.len-1;if(o.x<-o.len-1)o.x=world.cols+1;});
  if(world.chaser){var c=world.chaser;c.t+=dt;if(c.t>.9){c.t=0;if(Math.abs(c.x-p.x)>Math.abs(c.z-p.z))c.x+=c.x<p.x?1:-1;else c.z+=c.z<p.z?1:-1;}}
  world.confetti.forEach(function(c){c.x+=c.vx*dt;c.y+=c.vy*dt;c.vy+=300*dt;});world.confetti=world.confetti.filter(function(c){return c.y<CH+10;});
  if(S.dead){S.dead+=dt;if(S.dead>1.1){S.dead=0;S.lives--;if(S.lives<=0){S.over=true;S.running=false;show('over');}else{world.player={x:4,z:0,hx:4,hz:0,hop:1,dir:0,onLog:null};if(world.chaser){world.chaser.x=8;world.chaser.z=2;}}}return;}
  if(p.hop>=1){
    var row=world.rows[p.z];
    if(row.type==='water'){var on=null;world.obs.forEach(function(o){if(o.z===p.z&&p.x+.5>o.x&&p.x+.5<o.x+o.len)on=o;});
      if(on){p.x+=on.speed*dt;p.hx=p.x;if(p.x<-.5||p.x>world.cols-.5)die();}else die();}
    else if(row.type==='road'){world.obs.forEach(function(o){if(o.z===p.z&&p.x+.7>o.x&&p.x+.3<o.x+o.len)die();});}
    if(world.chaser&&Math.abs(world.chaser.x-p.x)<.6&&world.chaser.z===p.z)die();
    world.pickups.forEach(function(k){if(!k.got&&k.z===p.z&&Math.abs(k.x-Math.round(p.x))<.6){k.got=true;S.score+=k.big?500:100;S.items.push(L.itemName);beep(880,.12,'triangle');pop();hud();}});
    if(row.type==='goal'){levelDone();}
  }
}
function die(){if(S.dead)return;S.dead=.001;beep(140,.4,'sawtooth');}
function pop(){for(var i=0;i<24;i++)world.confetti.push({x:CW/2,y:CH*.5,vx:(Math.random()-.5)*400,vy:-Math.random()*300,c:['#ff2d78','#ffd60a','#00d9f5','#8b3dff','#00c489'][i%5]});}
function levelDone(){S.running=false;S.score+=1000;beep(660,.15,'triangle');setTimeout(function(){beep(990,.3,'triangle');},150);
  if(S.lvl>=LEVELS.length-1){S.won=true;show('won');}else show('next');}
function move(dx,dz){if(!S.running||S.paused||S.dead)return;var p=world.player;if(p.hop<1)return;var nx=p.x+dx,nz=p.z+dz;if(nx<0||nx>world.cols-1||nz<0||nz>world.lanes-1)return;p.x=nx;p.z=nz;p.hop=0;p.dir=dx?(dx>0?1:-1):0;if(dz>0)S.score+=10;beep(dz>0?520:420,.06,'square');hud();}

/* ---------- HUD / overlays ---------- */
function hud(){var L=LEVELS[S.lvl];$('zg-lvl').textContent='Level '+(S.lvl+1)+' · '+L.name;$('zg-lives').textContent='♥'.repeat(Math.max(0,S.lives));$('zg-score').textContent=S.score.toLocaleString('en-US');
  var got=world.pickups.filter(function(p){return p.got;}).length;$('zg-items').textContent=got+'/'+world.pickups.length+' '+L.itemName+(got===1?'':'s');}
function show(which){var o=$('zg-ov');o.hidden=false;var L=LEVELS[S.lvl];var h='';
  if(which==='start')h='<h3>Zach Gets to the Customers</h3><p>Cross five worlds to reach the customers. Collect what a growing business needs on the way: reviews, citations, the BBB A+, a website, a pipeline. Arrow keys, WASD, swipe, or the pad below.</p><button type="button" data-a="start">Start — Level 1: '+LEVELS[0].name+'</button>';
  else if(which==='next')h='<h3>Level '+(S.lvl+1)+' clear!</h3><p>You collected '+world.pickups.filter(function(p){return p.got;}).length+' '+L.itemName+'s. Next: <b>'+LEVELS[S.lvl+1].name+'</b> — '+LEVELS[S.lvl+1].sub+'.</p><button type="button" data-a="next">Keep going →</button>';
  else if(which==='over')h='<h3>The customers went to whoever answered first.</h3><p>Score '+S.score.toLocaleString('en-US')+'. That is what waiting looks like in real life too — but here you get another go.</p><button type="button" data-a="restart">Try again</button> <a class="zg-lnk" href="https://eyetoad.com/free-seo-audit/" rel="noopener">Or skip the game and get the real audit →</a>';
  else if(which==='won')h='<h3>You reached the customers. 🎉</h3><p>Reviews, citations, the BBB A+, a website and a pipeline — the five things a business needs to be found and chosen. Score '+S.score.toLocaleString('en-US')+'.</p><p><b>Real life has a shortcut:</b> we build all five for actual businesses.</p><a class="zg-btn" href="https://eyetoad.com/free-seo-audit/" rel="noopener">Get the free audit at Eye To Ad Media →</a> <button type="button" data-a="restart">Play again</button>';
  o.innerHTML=h;}
function hide(){$('zg-ov').hidden=true;}
D.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.getAttribute('data-a');
  if(a==='start'){S.lvl=0;S.lives=3;S.score=0;S.over=false;S.won=false;build(0);hide();S.running=true;hud();}
  if(a==='next'){S.lvl++;build(S.lvl);hide();S.running=true;hud();}
  if(a==='restart'){S.lvl=0;S.lives=3;S.score=0;S.over=false;S.won=false;build(0);hide();S.running=true;hud();}
  if(a==='mode'){S.mode=S.mode==='3d'?'retro':'3d';b.textContent=S.mode==='3d'?'Old-skool mode':'Modern mode';D.body.classList.toggle('zg-retro',S.mode==='retro');}
  if(a==='sound'){soundOn=!soundOn;b.textContent=soundOn?'Sound: on':'Sound: off';if(soundOn)beep(660,.1,'triangle');}
  if(a==='up')move(0,1);if(a==='down')move(0,-1);if(a==='left')move(-1,0);if(a==='right')move(1,0);
});
D.addEventListener('keydown',function(e){var k=e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D',' '].indexOf(k)<0)return;if(!cv.closest('#zgame').matches(':hover')&&!S.running)return;e.preventDefault();
  if(k==='ArrowUp'||k==='w'||k==='W')move(0,1);if(k==='ArrowDown'||k==='s'||k==='S')move(0,-1);if(k==='ArrowLeft'||k==='a'||k==='A')move(-1,0);if(k==='ArrowRight'||k==='d'||k==='D')move(1,0);});
var tx=0,ty=0;cv.addEventListener('touchstart',function(e){var t=e.touches[0];tx=t.clientX;ty=t.clientY;},{passive:true});
cv.addEventListener('touchend',function(e){var t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;if(Math.abs(dx)<18&&Math.abs(dy)<18){move(0,1);return;}if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1,0);else move(0,dy<0?1:-1);},{passive:true});
cv.addEventListener('click',function(){if(!S.running)return;/* tap = hop forward on desktop click too */});

/* ---------- sizing & loop ---------- */
function size(){var r=cv.getBoundingClientRect();CW=Math.max(280,Math.round(r.width));CH=Math.max(240,Math.round(r.height));cv.width=Math.round(CW*dpr);cv.height=Math.round(CH*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
size();var rs;W.addEventListener('resize',function(){clearTimeout(rs);rs=setTimeout(size,120);});
var vis=true;if('IntersectionObserver' in W){new IntersectionObserver(function(en){vis=en[0].isIntersecting;},{threshold:.05}).observe(cv);}
D.addEventListener('visibilitychange',function(){S.paused=D.hidden;});
function loop(ts){if(!lastT)lastT=ts;var dt=Math.min(.05,(ts-lastT)/1000);lastT=ts;if(vis){update(dt);render();}requestAnimationFrame(loop);}
build(0);hud();show('start');requestAnimationFrame(loop);
W.__zg={S:S,world:world,move:move};
})();
