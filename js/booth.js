/* booth.js - the selfie booth.
   Everything runs in the browser. No photo a visitor captures or uploads
   ever leaves their device: there is no upload endpoint in this file. */
(function(){
'use strict';
var D=document,W=window;
var cv=D.getElementById('boothCv');if(!cv)return;
var x=cv.getContext('2d');
var SZ=1080;cv.width=SZ;cv.height=SZ;

var scene='beach',myFace=null,zFace=null,zShades=null,useShades=false;
var stickers=[],armed=null,vip=false,stream=null;

function load(src,cb){var i=new Image();i.onload=function(){cb(i);};i.onerror=function(){cb(null);};i.src=src;}
load('/images/zach-face.webp',function(i){zFace=i;render();});
load('/images/zach-face-shades.webp',function(i){zShades=i;});

/* ---------- helpers ---------- */
function grad(y0,y1,st){var g=x.createLinearGradient(0,y0,0,y1);for(var i=0;i<st.length;i++)g.addColorStop(st[i][0],st[i][1]);return g;}
function rnd(i,s){var v=Math.sin((i+1)*12.9898+s)*43758.5453;return v-Math.floor(v);}
function stars(n,maxY,s){
  x.fillStyle='#fff';
  for(var i=0;i<n;i++){var a=rnd(i,s),b=rnd(i,s+9.1);
    x.globalAlpha=.3+b*.7;x.fillRect(a*SZ,b*maxY,1+a*2,1+a*2);}
  x.globalAlpha=1;
}
function cloud(cx,cy,s){
  x.fillStyle='rgba(255,255,255,.92)';
  x.beginPath();x.ellipse(cx,cy,78*s,34*s,0,0,6.2832);x.fill();
  x.beginPath();x.ellipse(cx-54*s,cy+12*s,50*s,24*s,0,0,6.2832);x.fill();
  x.beginPath();x.ellipse(cx+58*s,cy+14*s,44*s,22*s,0,0,6.2832);x.fill();
}
function palm(bx,by,s){
  x.strokeStyle='#6b4a2a';x.lineWidth=15*s;x.lineCap='round';
  x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(bx-26*s,by-150*s,bx-8*s,by-280*s);x.stroke();
  var tipX=bx-8*s,tipY=by-280*s;
  x.strokeStyle='#2f8a4a';x.lineWidth=11*s;
  for(var i=0;i<7;i++){
    var a=-2.5+i*0.52;
    x.beginPath();x.moveTo(tipX,tipY);
    x.quadraticCurveTo(tipX+Math.cos(a)*95*s,tipY+Math.sin(a)*58*s,tipX+Math.cos(a)*165*s,tipY+Math.sin(a)*95*s+34*s);
    x.stroke();
  }
}
function leaf(cx,cy,r,rot,col){
  x.save();x.translate(cx,cy);x.rotate(rot);x.fillStyle=col;
  x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(r*.55,-r*.42,r,0);x.quadraticCurveTo(r*.55,r*.42,0,0);x.fill();
  x.restore();
}

/* ---------- scenes ---------- */
var SCENES={
beach:{n:'Tropical beach',hint:'photoreal-ish',draw:function(){
  x.fillStyle=grad(0,SZ*.66,[[0,'#ffb86b'],[.35,'#ff8fa8'],[.68,'#9a7bd6'],[1,'#4a63b8']]);x.fillRect(0,0,SZ,SZ*.66);
  x.globalAlpha=.3;x.fillStyle='#ffdd8a';x.beginPath();x.arc(SZ*.72,SZ*.42,132,0,6.2832);x.fill();x.globalAlpha=1;
  x.fillStyle='#fff2c2';x.beginPath();x.arc(SZ*.72,SZ*.42,74,0,6.2832);x.fill();
  x.fillStyle=grad(SZ*.6,SZ*.84,[[0,'#2f6fa8'],[1,'#12365c']]);x.fillRect(0,SZ*.6,SZ,SZ*.25);
  x.globalAlpha=.4;x.fillStyle='#ffd9a0';
  for(var i=0;i<7;i++)x.fillRect(SZ*.66-i*10,SZ*.615+i*27,150+i*24,7);
  x.globalAlpha=1;
  x.fillStyle='#f2dcae';x.beginPath();x.moveTo(0,SZ*.83);x.quadraticCurveTo(SZ*.5,SZ*.79,SZ,SZ*.84);x.lineTo(SZ,SZ);x.lineTo(0,SZ);x.closePath();x.fill();
  x.fillStyle='#e6cb96';x.beginPath();x.moveTo(0,SZ*.91);x.quadraticCurveTo(SZ*.55,SZ*.87,SZ,SZ*.93);x.lineTo(SZ,SZ);x.lineTo(0,SZ);x.closePath();x.fill();
  palm(SZ*.11,SZ*.88,1.1);palm(SZ*.92,SZ*.9,.82);
}},
moon:{n:'The moon',hint:'photoreal-ish',draw:function(){
  x.fillStyle='#04040e';x.fillRect(0,0,SZ,SZ);stars(170,SZ*.8,0);
  var g=x.createRadialGradient(SZ*.22,SZ*.24,12,SZ*.22,SZ*.24,134);
  g.addColorStop(0,'#69b2ff');g.addColorStop(.55,'#2f6fd0');g.addColorStop(1,'#0f3570');
  x.fillStyle=g;x.beginPath();x.arc(SZ*.22,SZ*.24,128,0,6.2832);x.fill();
  x.save();x.beginPath();x.arc(SZ*.22,SZ*.24,128,0,6.2832);x.clip();
  x.globalAlpha=.6;x.fillStyle='#46c489';
  x.beginPath();x.ellipse(SZ*.18,SZ*.22,56,32,-.3,0,6.2832);x.fill();
  x.beginPath();x.ellipse(SZ*.27,SZ*.3,36,21,.5,0,6.2832);x.fill();
  x.globalAlpha=1;x.restore();
  x.fillStyle='#b9b9c4';x.beginPath();x.moveTo(0,SZ*.8);x.quadraticCurveTo(SZ*.4,SZ*.73,SZ,SZ*.81);x.lineTo(SZ,SZ);x.lineTo(0,SZ);x.closePath();x.fill();
  x.fillStyle='#9d9daa';
  var cr=[[.18,.88,48],[.52,.94,64],[.84,.86,40],[.35,.83,26],[.69,.98,52]];
  for(var i=0;i<cr.length;i++){x.beginPath();x.ellipse(SZ*cr[i][0],SZ*cr[i][1],cr[i][2],cr[i][2]*.38,0,0,6.2832);x.fill();}
}},
whitehouse:{n:'The White House',hint:'cartoon',draw:function(){
  x.fillStyle=grad(0,SZ*.72,[[0,'#8fd0ff'],[1,'#e2f1ff']]);x.fillRect(0,0,SZ,SZ*.72);
  cloud(SZ*.2,SZ*.15,1);cloud(SZ*.79,SZ*.1,.78);
  x.fillStyle='#f6f4ee';x.fillRect(SZ*.2,SZ*.36,SZ*.6,SZ*.28);
  x.fillStyle='#fffdf7';x.fillRect(SZ*.34,SZ*.3,SZ*.32,SZ*.35);
  x.fillStyle='#e8e4d8';x.beginPath();x.moveTo(SZ*.32,SZ*.31);x.lineTo(SZ*.5,SZ*.23);x.lineTo(SZ*.68,SZ*.31);x.closePath();x.fill();
  x.fillStyle='#fffdf7';
  for(var i=0;i<6;i++)x.fillRect(SZ*.355+i*SZ*.052,SZ*.33,SZ*.022,SZ*.32);
  x.fillStyle='#4a6fa5';
  for(var r=0;r<2;r++)for(var c=0;c<9;c++){
    var px=SZ*.225+c*SZ*.062;
    if(px>SZ*.33&&px<SZ*.67&&r===0)continue;
    x.fillRect(px,SZ*.41+r*SZ*.1,SZ*.032,SZ*.056);
  }
  x.fillStyle='#2d3d55';x.fillRect(SZ*.47,SZ*.53,SZ*.06,SZ*.12);
  x.fillStyle='#4e9f4a';x.fillRect(0,SZ*.64,SZ,SZ*.36);
  x.fillStyle='#63b85c';x.beginPath();x.ellipse(SZ*.5,SZ*.73,SZ*.46,SZ*.07,0,0,6.2832);x.fill();
  x.fillStyle='#3d8a3a';
  for(var b=0;b<10;b++)x.fillRect(b*SZ*.11,SZ*.79+(b%3)*15,SZ*.05,9);
}},
pyramids:{n:'The pyramids',hint:'photoreal-ish',draw:function(){
  x.fillStyle=grad(0,SZ*.74,[[0,'#f8d78f'],[.5,'#f0ad6a'],[1,'#e8bf90']]);x.fillRect(0,0,SZ,SZ*.75);
  x.globalAlpha=.25;x.fillStyle='#fff6d8';x.beginPath();x.arc(SZ*.79,SZ*.19,124,0,6.2832);x.fill();x.globalAlpha=1;
  x.fillStyle='#fff6d8';x.beginPath();x.arc(SZ*.79,SZ*.19,62,0,6.2832);x.fill();
  function pyr(cx,by,w,h,l,r){
    x.fillStyle=l;x.beginPath();x.moveTo(cx,by-h);x.lineTo(cx-w,by);x.lineTo(cx,by);x.closePath();x.fill();
    x.fillStyle=r;x.beginPath();x.moveTo(cx,by-h);x.lineTo(cx+w,by);x.lineTo(cx,by);x.closePath();x.fill();
  }
  pyr(SZ*.24,SZ*.73,SZ*.16,SZ*.26,'#dcb476','#b98c52');
  pyr(SZ*.56,SZ*.73,SZ*.23,SZ*.38,'#e7c287','#c4975c');
  pyr(SZ*.83,SZ*.73,SZ*.13,SZ*.2,'#d8ad70','#b1844c');
  x.fillStyle='#eacf9d';x.beginPath();x.moveTo(0,SZ*.75);x.quadraticCurveTo(SZ*.5,SZ*.71,SZ,SZ*.76);x.lineTo(SZ,SZ);x.lineTo(0,SZ);x.closePath();x.fill();
  x.fillStyle='#ddc089';x.beginPath();x.moveTo(0,SZ*.86);x.quadraticCurveTo(SZ*.4,SZ*.82,SZ,SZ*.88);x.lineTo(SZ,SZ);x.lineTo(0,SZ);x.closePath();x.fill();
}},
jungle:{n:'African jungle',hint:'cartoon',draw:function(){
  x.fillStyle=grad(0,SZ,[[0,'#1a5c2e'],[.55,'#22843d'],[1,'#0c3319']]);x.fillRect(0,0,SZ,SZ);
  x.globalAlpha=.30;x.fillStyle='#ffe9a8';
  for(var r=0;r<7;r++){
    x.save();x.translate(SZ*.62,-SZ*.12);x.rotate(-0.5+r*0.14);
    x.fillRect(0,0,SZ*0.035,SZ*1.5);x.restore();
  }
  x.globalAlpha=1;
  x.fillStyle='#0f3f21';
  for(var t=0;t<4;t++){
    var tx=SZ*(0.06+t*0.29);
    x.fillRect(tx,SZ*0.2,SZ*0.045,SZ*0.8);
  }
  var cols=['#2fae55','#249245','#48c46b','#177a38'];
  for(var i=0;i<30;i++){
    var a=rnd(i,3.1),b=rnd(i,7.7),c=rnd(i,11.3);
    leaf(SZ*a,SZ*(b*0.55),SZ*(0.08+c*0.09),(a-0.5)*3.1,cols[i%4]);
  }
  for(var j=0;j<16;j++){
    var a2=rnd(j,21.5),b2=rnd(j,31.9);
    leaf(SZ*a2,SZ*(0.62+b2*0.42),SZ*(0.1+b2*0.1),(b2-0.5)*2.4,'#186f34');
  }
  x.fillStyle='#0b2d17';
  x.beginPath();x.moveTo(0,SZ*0.9);x.quadraticCurveTo(SZ*0.5,SZ*0.85,SZ,SZ*0.91);x.lineTo(SZ,SZ);x.lineTo(0,SZ);x.closePath();x.fill();
}},
ocean:{n:'Under the sea',hint:'cartoon',draw:function(){
  x.fillStyle=grad(0,SZ,[[0,'#3fbde6'],[.5,'#1878b8'],[1,'#07305e']]);x.fillRect(0,0,SZ,SZ);
  x.globalAlpha=.16;x.fillStyle='#d8f6ff';
  for(var r=0;r<6;r++){
    x.save();x.translate(SZ*(0.12+r*0.16),-SZ*0.1);x.rotate(0.22);
    x.fillRect(0,0,SZ*0.06,SZ*1.3);x.restore();
  }
  x.globalAlpha=1;
  var fc=['#ffb03a','#ff6b6b','#ffe066','#7be0c8','#ff8fd0'];
  for(var i=0;i<14;i++){
    var a=rnd(i,5.5),b=rnd(i,15.2),s=SZ*(0.02+rnd(i,25.1)*0.022);
    var fx=SZ*a,fy=SZ*(0.08+b*0.66),col=fc[i%5];
    x.fillStyle=col;
    x.beginPath();x.ellipse(fx,fy,s*1.6,s,0,0,6.2832);x.fill();
    x.beginPath();x.moveTo(fx+s*1.5,fy);x.lineTo(fx+s*2.6,fy-s*0.9);x.lineTo(fx+s*2.6,fy+s*0.9);x.closePath();x.fill();
    x.fillStyle='#08283f';x.beginPath();x.arc(fx-s*0.7,fy-s*0.22,s*0.2,0,6.2832);x.fill();
  }
  x.globalAlpha=.5;x.strokeStyle='#dff6ff';x.lineWidth=3;
  for(var k=0;k<22;k++){
    var a2=rnd(k,41.3),b2=rnd(k,51.9);
    x.beginPath();x.arc(SZ*a2,SZ*b2,SZ*(0.006+b2*0.014),0,6.2832);x.stroke();
  }
  x.globalAlpha=1;
  x.fillStyle='#0a3a66';
  x.beginPath();x.moveTo(0,SZ*0.88);x.quadraticCurveTo(SZ*0.5,SZ*0.83,SZ,SZ*0.89);x.lineTo(SZ,SZ);x.lineTo(0,SZ);x.closePath();x.fill();
  var cc=['#ff7a9a','#ffb03a','#9b6bff'];
  for(var c=0;c<9;c++){
    var cx2=SZ*(0.05+c*0.11),base=SZ*0.9;
    x.strokeStyle=cc[c%3];x.lineWidth=SZ*0.018;x.lineCap='round';
    x.beginPath();x.moveTo(cx2,base);x.lineTo(cx2,base-SZ*0.07);x.stroke();
    x.beginPath();x.moveTo(cx2,base-SZ*0.04);x.lineTo(cx2-SZ*0.035,base-SZ*0.09);x.stroke();
    x.beginPath();x.moveTo(cx2,base-SZ*0.045);x.lineTo(cx2+SZ*0.035,base-SZ*0.095);x.stroke();
  }
}},
neon:{n:'Neon city',hint:'cartoon',draw:function(){
  x.fillStyle=grad(0,SZ,[[0,'#150934'],[.6,'#3a0f52'],[1,'#0f0524']]);x.fillRect(0,0,SZ,SZ);
  stars(90,SZ*0.42,4.4);
  var NC=['#00e5ff','#ff2d78','#ffd60a','#8b3dff','#00ff9d'];
  for(var i=0;i<11;i++){
    var a=rnd(i,61.7),h2=SZ*(0.2+rnd(i,71.3)*0.4),w2=SZ*(0.07+rnd(i,81.1)*0.06);
    var bx=SZ*a-w2/2,by=SZ*0.86-h2;
    x.fillStyle='#1c1038';x.fillRect(bx,by,w2,h2);
    x.fillStyle=NC[i%5];x.globalAlpha=.85;
    for(var r=0;r<Math.floor(h2/(SZ*0.045));r++)
      for(var c=0;c<3;c++){
        if(rnd(i*31+r*7+c,3.3)<0.42)continue;
        x.fillRect(bx+w2*0.16+c*w2*0.28,by+SZ*0.022+r*SZ*0.045,w2*0.16,SZ*0.022);
      }
    x.globalAlpha=1;
    x.fillStyle=NC[(i+2)%5];x.fillRect(bx+w2*0.1,by-SZ*0.012,w2*0.8,SZ*0.01);
  }
  x.fillStyle='#120826';x.fillRect(0,SZ*0.86,SZ,SZ*0.14);
  x.globalAlpha=.35;
  for(var k=0;k<5;k++){
    x.fillStyle=NC[k];
    x.fillRect(0,SZ*(0.87+k*0.024),SZ,SZ*0.006);
  }
  x.globalAlpha=1;
}},
space:{n:'Deep space',hint:'photoreal-ish',draw:function(){
  x.fillStyle='#03020c';x.fillRect(0,0,SZ,SZ);
  var neb=x.createRadialGradient(SZ*0.7,SZ*0.28,20,SZ*0.7,SZ*0.28,SZ*0.62);
  neb.addColorStop(0,'rgba(139,61,255,.42)');neb.addColorStop(.5,'rgba(255,45,120,.16)');neb.addColorStop(1,'rgba(3,2,12,0)');
  x.fillStyle=neb;x.fillRect(0,0,SZ,SZ);
  stars(240,SZ,1.7);
  var pg=x.createRadialGradient(SZ*0.28,SZ*0.7,10,SZ*0.28,SZ*0.7,190);
  pg.addColorStop(0,'#ffca7a');pg.addColorStop(.55,'#e07a3c');pg.addColorStop(1,'#8a3a1c');
  x.fillStyle=pg;x.beginPath();x.arc(SZ*0.28,SZ*0.7,182,0,6.2832);x.fill();
  x.save();x.translate(SZ*0.28,SZ*0.7);x.rotate(-0.42);
  x.strokeStyle='rgba(255,220,170,.72)';x.lineWidth=16;
  x.beginPath();x.ellipse(0,0,300,72,0,0,6.2832);x.stroke();
  x.strokeStyle='rgba(255,190,120,.42)';x.lineWidth=8;
  x.beginPath();x.ellipse(0,0,346,84,0,0,6.2832);x.stroke();
  x.restore();
}}
};

/* ---------- figures ---------- */
function figure(cx,feet,H,jacket,lapel,accent,face,wave){
  var w=H*0.30, sh=feet-H*0.72;          /* shoulder line */
  var hy=feet-H*0.845, hrx=H*0.118, hry=H*0.139;   /* head */

  x.globalAlpha=.22;x.fillStyle='#000';
  x.beginPath();x.ellipse(cx,feet,w*0.8,H*0.022,0,0,6.2832);x.fill();x.globalAlpha=1;

  /* legs */
  x.fillStyle=jacket;
  x.fillRect(cx-w*0.42,feet-H*0.42,w*0.36,H*0.405);
  x.fillRect(cx+w*0.06,feet-H*0.42,w*0.36,H*0.405);
  x.fillStyle='#0b0b11';
  x.beginPath();x.ellipse(cx-w*0.24,feet-H*0.012,w*0.3,H*0.024,0,0,6.2832);x.fill();
  x.beginPath();x.ellipse(cx+w*0.24,feet-H*0.012,w*0.3,H*0.024,0,0,6.2832);x.fill();

  /* arms drawn behind the torso so the shoulder joint is hidden */
  function arm(side,ang){
    x.save();
    x.translate(cx+side*w*0.46,sh+H*0.035);
    x.rotate(ang);
    x.fillStyle=jacket;
    if(x.roundRect){x.beginPath();x.roundRect(-w*0.11,0,w*0.22,H*0.30,w*0.09);x.fill();}
    else x.fillRect(-w*0.11,0,w*0.22,H*0.30);
    x.fillStyle='#f6cfa6';
    x.beginPath();x.arc(0,H*0.325,w*0.125,0,6.2832);x.fill();
    x.restore();
  }
  arm(-1,0.20);
  arm(1,wave?-2.62:-0.20);

  /* torso */
  x.fillStyle=jacket;
  x.beginPath();
  x.moveTo(cx-w*0.62,sh);x.lineTo(cx+w*0.62,sh);
  x.lineTo(cx+w*0.55,feet-H*0.40);x.lineTo(cx-w*0.55,feet-H*0.40);x.closePath();x.fill();

  /* shirt panel */
  x.fillStyle='#f8f8fb';
  x.beginPath();
  x.moveTo(cx-w*0.115,sh);x.lineTo(cx+w*0.115,sh);
  x.lineTo(cx+w*0.085,feet-H*0.455);x.lineTo(cx-w*0.085,feet-H*0.455);x.closePath();x.fill();

  /* satin lapels meeting in a V */
  x.fillStyle=lapel;
  x.beginPath();x.moveTo(cx-w*0.62,sh);x.lineTo(cx-w*0.10,sh);
  x.lineTo(cx-w*0.015,feet-H*0.61);x.lineTo(cx-w*0.15,feet-H*0.455);x.lineTo(cx-w*0.56,feet-H*0.55);x.closePath();x.fill();
  x.beginPath();x.moveTo(cx+w*0.62,sh);x.lineTo(cx+w*0.10,sh);
  x.lineTo(cx+w*0.015,feet-H*0.61);x.lineTo(cx+w*0.15,feet-H*0.455);x.lineTo(cx+w*0.56,feet-H*0.55);x.closePath();x.fill();

  /* pocket square */
  x.fillStyle=accent;
  x.beginPath();x.moveTo(cx-w*0.47,feet-H*0.62);x.lineTo(cx-w*0.29,feet-H*0.635);
  x.lineTo(cx-w*0.31,feet-H*0.60);x.lineTo(cx-w*0.47,feet-H*0.592);x.closePath();x.fill();

  /* neck, then collar points, then the bow tie on top of them */
  var ny=sh-H*0.055;
  x.fillStyle='#e3b68c';x.fillRect(cx-w*0.15,ny,w*0.30,H*0.075);
  x.fillStyle='#f8f8fb';
  x.beginPath();x.moveTo(cx-w*0.22,sh-H*0.03);x.lineTo(cx,sh+H*0.012);x.lineTo(cx-w*0.10,sh+H*0.028);x.closePath();x.fill();
  x.beginPath();x.moveTo(cx+w*0.22,sh-H*0.03);x.lineTo(cx,sh+H*0.012);x.lineTo(cx+w*0.10,sh+H*0.028);x.closePath();x.fill();
  var by=sh+H*0.002, bw=w*0.26, bh=H*0.030;
  x.fillStyle='#16161e';
  x.beginPath();x.moveTo(cx,by);x.lineTo(cx-bw,by-bh);x.lineTo(cx-bw,by+bh);x.closePath();x.fill();
  x.beginPath();x.moveTo(cx,by);x.lineTo(cx+bw,by-bh);x.lineTo(cx+bw,by+bh);x.closePath();x.fill();
  x.fillStyle='#3a3a52';
  x.beginPath();x.moveTo(cx,by);x.lineTo(cx-bw,by-bh);x.lineTo(cx-bw,by-bh*0.2);x.closePath();x.fill();
  x.beginPath();x.moveTo(cx,by);x.lineTo(cx+bw,by-bh);x.lineTo(cx+bw,by-bh*0.2);x.closePath();x.fill();
  x.fillStyle='#22222f';
  if(x.roundRect){x.beginPath();x.roundRect(cx-w*0.075,by-bh*0.78,w*0.15,bh*1.56,4);x.fill();}
  else x.fillRect(cx-w*0.075,by-bh*0.78,w*0.15,bh*1.56);

  /* head */
  if(face){
    /* a real photo already comes with its own hair */
    x.save();
    x.beginPath();x.ellipse(cx,hy,hrx,hry,0,0,6.2832);x.clip();
    x.drawImage(face,cx-hrx,hy-hry,hrx*2,hry*2);
    x.restore();
  }else{
    x.fillStyle='#e7bd5a';
    x.beginPath();x.ellipse(cx,hy-hry*0.14,hrx*1.16,hry*1.10,0,0,6.2832);x.fill();
    x.fillStyle='#f0c79e';
    x.beginPath();x.ellipse(cx-hrx*0.98,hy+hry*0.08,hrx*0.2,hry*0.26,0,0,6.2832);x.fill();
    x.beginPath();x.ellipse(cx+hrx*0.98,hy+hry*0.08,hrx*0.2,hry*0.26,0,0,6.2832);x.fill();
    x.fillStyle='#f9d6b0';
    x.beginPath();x.ellipse(cx,hy,hrx,hry,0,0,6.2832);x.fill();
    /* fringe sits over the top of the face */
    x.fillStyle='#e7bd5a';
    x.beginPath();
    x.moveTo(cx-hrx*1.02,hy-hry*0.22);
    x.bezierCurveTo(cx-hrx*1.1,hy-hry*1.25,cx+hrx*1.1,hy-hry*1.25,cx+hrx*1.02,hy-hry*0.22);
    x.bezierCurveTo(cx+hrx*0.72,hy-hry*0.66,cx-hrx*0.3,hy-hry*0.52,cx-hrx*1.02,hy-hry*0.22);
    x.closePath();x.fill();
    x.fillStyle='#f6e0a0';
    x.beginPath();
    x.moveTo(cx-hrx*0.82,hy-hry*0.58);
    x.bezierCurveTo(cx-hrx*0.36,hy-hry*0.96,cx+hrx*0.46,hy-hry*0.96,cx+hrx*0.86,hy-hry*0.55);
    x.bezierCurveTo(cx+hrx*0.4,hy-hry*0.78,cx-hrx*0.4,hy-hry*0.78,cx-hrx*0.82,hy-hry*0.58);
    x.closePath();x.fill();
    /* face */
    x.fillStyle='#3a3a4a';
    x.beginPath();x.arc(cx-hrx*0.36,hy+hry*0.02,hrx*0.085,0,6.2832);x.fill();
    x.beginPath();x.arc(cx+hrx*0.36,hy+hry*0.02,hrx*0.085,0,6.2832);x.fill();
    x.strokeStyle='#c49a3c';x.lineWidth=hrx*0.06;x.lineCap='round';
    x.beginPath();x.moveTo(cx-hrx*0.54,hy-hry*0.2);x.quadraticCurveTo(cx-hrx*0.34,hy-hry*0.28,cx-hrx*0.16,hy-hry*0.2);x.stroke();
    x.beginPath();x.moveTo(cx+hrx*0.54,hy-hry*0.2);x.quadraticCurveTo(cx+hrx*0.34,hy-hry*0.28,cx+hrx*0.16,hy-hry*0.2);x.stroke();
    x.strokeStyle='#b3714a';x.lineWidth=hrx*0.085;
    x.beginPath();x.arc(cx,hy+hry*0.24,hrx*0.42,0.35,Math.PI-0.35);x.stroke();
  }
}

/* ---------- stickers ---------- */
var TEXTS=["I'm amazing!","I am loved!","Zach is awesome!","Zach's the coolest!","\u2665 Zach","Best day ever","Worth every penny","I found my guy","10/10 would hire","Marketing genius","Ask me about SEO","Certified legend"];
var EMOJI=["\u2b50","\uD83D\uDD25","\uD83C\uDF89","\uD83D\uDCAF","\uD83D\uDE0E","\uD83D\uDE80","\uD83C\uDFC6","\u2764\uFE0F","\uD83D\uDC51","\uD83E\uDD84","\uD83C\uDF08","\uD83E\uDD1D"];
function drawSticker(s){
  x.save();x.translate(s.x,s.y);x.rotate(s.r);
  if(s.t==='e'){
    x.font=(SZ*0.085)+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    x.textAlign='center';x.textBaseline='middle';x.fillText(s.v,0,0);
  }else{
    x.font='800 '+(SZ*0.036)+'px "Unbounded","Space Grotesk",sans-serif';
    x.textAlign='center';x.textBaseline='middle';
    var w=x.measureText(s.v).width+SZ*0.05,h=SZ*0.078;
    x.fillStyle=s.c;
    if(x.roundRect){x.beginPath();x.roundRect(-w/2,-h/2,w,h,h/2);x.fill();}
    else{x.fillRect(-w/2,-h/2,w,h);}
    x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=SZ*0.006;
    if(x.roundRect){x.beginPath();x.roundRect(-w/2,-h/2,w,h,h/2);x.stroke();}
    x.fillStyle='#fff';x.fillText(s.v,0,SZ*0.002);
  }
  x.restore();
}

/* ---------- render ---------- */
function render(){
  var sc=SCENES[scene]||SCENES.beach;
  sc.draw();
  var feet=SZ*0.935,h=SZ*0.66;
  /* visitor on the left, me on the right */
  figure(SZ*0.33,feet,h,'#1f2a4a','#38477a','#00d9f5',myFace,false);
  figure(SZ*0.67,feet,h,'#17171f','#2f2f3f','#ff7a00',useShades?zShades:zFace,true);
  for(var i=0;i<stickers.length;i++)drawSticker(stickers[i]);
  /* caption bar */
  x.fillStyle='rgba(8,6,22,.72)';x.fillRect(0,SZ-SZ*0.072,SZ,SZ*0.072);
  x.fillStyle='#fff';x.textAlign='left';x.textBaseline='middle';
  x.font='700 '+(SZ*0.026)+'px "Space Grotesk",sans-serif';
  x.fillText(sc.n,SZ*0.035,SZ-SZ*0.036);
  x.textAlign='right';x.fillStyle='#b8b3dd';
  x.font='600 '+(SZ*0.022)+'px "Space Grotesk",sans-serif';
  x.fillText('zacharytyewennstedt.com',SZ-SZ*0.035,SZ-SZ*0.036);
}
W.__boothRender=render;

/* ---------- ui ---------- */
function el(id){return D.getElementById(id);}
function build(){
  var sw=el('bScenes');
  for(var k in SCENES)(function(key){
    var b=D.createElement('button');
    b.type='button';b.className='bsc'+(key===scene?' on':'');
    b.innerHTML='<span>'+SCENES[key].n+'</span><i>'+SCENES[key].hint+'</i>';
    b.addEventListener('click',function(){
      scene=key;
      var all=sw.querySelectorAll('.bsc');
      for(var i=0;i<all.length;i++)all[i].classList.toggle('on',all[i]===b);
      render();
    });
    sw.appendChild(b);
  })(k);

  var st=el('bStickers');
  function addBtn(label,mk,cls){
    var b=D.createElement('button');b.type='button';b.className='bst '+(cls||'');b.textContent=label;
    b.addEventListener('click',function(){
      armed=mk;
      var all=st.querySelectorAll('.bst');
      for(var i=0;i<all.length;i++)all[i].classList.toggle('armed',all[i]===b);
      el('bHint').textContent='Now tap the picture where you want it.';
    });
    st.appendChild(b);return b;
  }
  var COLS=['#ff2d78','#8b3dff','#00c489','#2b5cff','#ff7a00','#e0326b'];
  for(var i=0;i<TEXTS.length;i++)(function(t,n){addBtn(t,function(){return {t:'t',v:t,c:COLS[n%COLS.length]};});})(TEXTS[i],i);
  for(var j=0;j<EMOJI.length;j++)(function(e){addBtn(e,function(){return {t:'e',v:e};},'emoji');})(EMOJI[j]);
  W.__boothVip=function(){
    if(vip)return;vip=true;
    var b=addBtn('\uD83D\uDC51 VIP',function(){return {t:'t',v:'VIP \u2014 I found the secret',c:'#c8a02a'};},'gold');
    el('bHint').textContent='You unlocked a secret sticker. Obviously.';
    b.scrollIntoView({block:'nearest',inline:'nearest'});
  };

  cv.addEventListener('click',function(e){
    if(!armed)return;
    var r=cv.getBoundingClientRect();
    var px=(e.clientX-r.left)/r.width*SZ, py=(e.clientY-r.top)/r.height*SZ;
    var s=armed();s.x=px;s.y=py;s.r=(Math.random()-0.5)*0.26;
    stickers.push(s);render();
    el('bHint').textContent='Added. Pick another, or hit download.';
  });

  el('bUndo').addEventListener('click',function(){stickers.pop();render();});
  el('bClear').addEventListener('click',function(){
    stickers=[];armed=null;
    var all=st.querySelectorAll('.bst');for(var i=0;i<all.length;i++)all[i].classList.remove('armed');
    el('bHint').textContent='Cleared. Start again.';render();
  });
  el('bShades').addEventListener('click',function(){
    useShades=!useShades;this.textContent=useShades?'Zach: shades on':'Zach: shades off';render();
  });

  /* camera */
  var vid=el('bVideo');
  el('bCam').addEventListener('click',function(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
      el('bHint').textContent='This browser will not give me a camera. Use "Upload a photo" instead.';return;
    }
    navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:720}},audio:false})
      .then(function(s){stream=s;vid.srcObject=s;vid.play();el('bLive').classList.add('on');
        el('bHint').textContent='Line your face up in the oval, then hit capture.';})
      .catch(function(){el('bHint').textContent='No camera access. That is fine - use "Upload a photo".';});
  });
  el('bSnap').addEventListener('click',function(){
    if(!vid.videoWidth)return;
    var c=D.createElement('canvas'),s=Math.min(vid.videoWidth,vid.videoHeight);
    c.width=300;c.height=380;
    var g=c.getContext('2d');
    g.translate(300,0);g.scale(-1,1); /* un-mirror so it reads correctly */
    g.drawImage(vid,(vid.videoWidth-s)/2,(vid.videoHeight-s*1.0)/2,s,s,0,-20,300,420);
    var im=new Image();im.onload=function(){myFace=im;render();};im.src=c.toDataURL('image/png');
    stopCam();el('bHint').textContent='Got you. Now add some stickers.';
  });
  function stopCam(){
    if(stream){stream.getTracks().forEach(function(t){t.stop();});stream=null;}
    el('bLive').classList.remove('on');
  }
  el('bStop').addEventListener('click',function(){stopCam();el('bHint').textContent='Camera off.';});
  W.addEventListener('pagehide',stopCam);

  el('bFile').addEventListener('change',function(){
    var f=this.files&&this.files[0];if(!f)return;
    var fr=new FileReader();
    fr.onload=function(){var im=new Image();im.onload=function(){myFace=im;render();
      el('bHint').textContent='Loaded. It never leaves your device.';};im.src=fr.result;};
    fr.readAsDataURL(f);
  });
  el('bCartoon').addEventListener('click',function(){myFace=null;render();el('bHint').textContent='Cartoon it is.';});

  el('bDown').addEventListener('click',function(){
    try{
      var a=D.createElement('a');
      a.download='selfie-with-zach-'+scene+'.png';
      a.href=cv.toDataURL('image/png');
      D.body.appendChild(a);a.click();D.body.removeChild(a);
      el('bHint').textContent='Downloaded. Put it somewhere embarrassing.';
    }catch(e){el('bHint').textContent='Your browser blocked the download. Long-press the picture and save it instead.';}
  });
  el('bShare').addEventListener('click',function(){
    if(!cv.toBlob||!navigator.share){
      el('bHint').textContent='No share sheet here - use download instead.';return;
    }
    cv.toBlob(function(bl){
      if(!bl)return;
      var f=new File([bl],'selfie-with-zach.png',{type:'image/png'});
      if(navigator.canShare&&!navigator.canShare({files:[f]})){
        el('bHint').textContent='This browser will not share images. Use download.';return;
      }
      navigator.share({files:[f],title:'Me and Zach',text:'Made at zacharytyewennstedt.com'})
        .catch(function(){});
    },'image/png');
  });
}
build();render();
})();
