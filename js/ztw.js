/* ztw.js - shared runtime for zacharytyewennstedt.com
   nav / equalizer / reveal / runtime email / hardened forms / site bot.
   One file, injected markup. Do not inline per page. */
(function(){
'use strict';
var D=document,W=window;
var RM=W.matchMedia&&W.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- 1. runtime address assembly ---------- */
function at(){return String.fromCharCode(64);}
function dec(s){try{return W.atob(s);}catch(e){return '';}}
function addr(){return dec('aW5mbw==')+at()+dec('ZXlldG9hZC5jb20=');}
W.ZTW={addr:addr};
function paintMail(){
  var n=D.querySelectorAll('[data-mail]');
  for(var i=0;i<n.length;i++){
    var el=n[i];if(el.getAttribute('data-done'))continue;
    var a=addr();el.setAttribute('data-done','1');
    if(el.tagName==='A'){el.setAttribute('href','mail'+'to:'+a);if(!el.textContent.trim()||el.getAttribute('data-mail')==='text')el.textContent=a;}
    else el.textContent=a;
  }
}

/* ---------- 2. mobile nav ---------- */
function nav(){
  var b=D.getElementById('burger'),m=D.getElementById('mnav'),s=D.getElementById('scrim');
  if(!b||!m)return;
  function set(o){m.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');
    if(s)s.classList.toggle('on',o);D.body.style.overflow=o?'hidden':'';}
  b.addEventListener('click',function(){set(!m.classList.contains('open'));});
  var x=m.querySelector('button.x');if(x)x.addEventListener('click',function(){set(false);});
  if(s)s.addEventListener('click',function(){set(false);});
  var ls=m.querySelectorAll('a');
  for(var i=0;i<ls.length;i++)ls[i].addEventListener('click',function(){set(false);});
  D.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
}

/* ---------- 3. reveal on scroll ---------- */
function reveal(){
  var els=D.querySelectorAll('.rise');if(!els.length)return;
  if(RM||!W.IntersectionObserver){for(var i=0;i<els.length;i++)els[i].classList.add('in');return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{rootMargin:'0px 0px -9% 0px',threshold:.06});
  for(var j=0;j<els.length;j++)io.observe(els[j]);
}

/* ---------- 4. music strip + beat visualizer ----------
   NOTE: a YouTube iframe's audio cannot be read by the page (cross-origin),
   so the bars are a tempo-locked visualizer, not an FFT of the track. */
function music(){
  var cv=D.getElementById('eq');if(!cv)return;
  var ctx=cv.getContext('2d'),btn=D.getElementById('mplay'),vol=D.getElementById('mvol');
  var N=64,playing=false,yt=null,ready=false,t=0,dpr=Math.min(W.devicePixelRatio||1,2);
  var h=new Float32Array(N),tg=new Float32Array(N),pk=new Float32Array(N),pv=new Float32Array(N);
  var CW=0,CH=0;
  var STOPS=[[0.00,'#ff3b30'],[0.16,'#ff7a00'],[0.32,'#ffd60a'],[0.50,'#00c489'],[0.66,'#00d9f5'],[0.82,'#2b5cff'],[1.00,'#b23dff']];
  function grad(){var g=ctx.createLinearGradient(0,0,CW,0);for(var i=0;i<STOPS.length;i++)g.addColorStop(STOPS[i][0],STOPS[i][1]);return g;}
  var G=null;
  function size(){
    var r=cv.getBoundingClientRect();
    CW=Math.max(80,Math.round(r.width));CH=Math.max(34,Math.round(r.height));
    cv.width=Math.round(CW*dpr);cv.height=Math.round(CH*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);G=grad();
  }
  size();
  var rs;W.addEventListener('resize',function(){clearTimeout(rs);rs=setTimeout(size,140);});

  var BPM=124,SPB=60/BPM,beat=0,last=0;
  function env(x){return x<=0?0:Math.exp(-x*7.2);}
  function frame(ts){
    if(!last)last=ts;var dt=Math.min(.05,(ts-last)/1000);last=ts;
    t+=dt;
    beat=(t%SPB)/SPB;
    var bar=(t/(SPB*4))%1;
    var kick=env(beat),snare=env(((t+SPB*2)%(SPB*4))/SPB),hat=env((t%(SPB/2))/(SPB/2))*.5;
    for(var i=0;i<N;i++){
      var z=i/(N-1),v;
      if(!playing){v=.30+.26*Math.sin(t*1.25-z*7.2)+.07*Math.sin(t*2.7+z*14.5);}
      else{
        var low=Math.pow(1-z,2.1)*(.55+kick*.85);
        var mid=Math.exp(-Math.pow((z-.42)/.20,2))*(.30+snare*.62);
        var hi=Math.pow(z,1.5)*(.16+hat*.46)*(.62+.38*Math.sin(t*9.3+i*.85));
        var wob=.055*Math.sin(t*2.3+i*.37)+.05*Math.random();
        v=Math.min(1,low+mid+hi+wob)*(.30+.70*Math.pow(1-Math.abs(z-.5)*.75,1.2));
      }
      tg[i]=v;
      var up=tg[i]>h[i];
      h[i]+=(tg[i]-h[i])*(up?.55:.14);
      if(h[i]>pk[i]){pk[i]=h[i];pv[i]=0;}else{pv[i]+=dt*.62;pk[i]=Math.max(h[i],pk[i]-pv[i]*dt*3.4);}
    }
    draw();
    if(!RM)requestAnimationFrame(frame);
  }
  function draw(){
    ctx.clearRect(0,0,CW,CH);
    var mid=CH*0.60,maxUp=mid-2,maxDn=CH-mid-1,bw=CW/N,w=Math.max(1.6,bw*0.62);
    ctx.fillStyle=G;
    for(var i=0;i<N;i++){
      var x=i*bw+(bw-w)/2,up=Math.max(1.5,h[i]*maxUp);
      ctx.globalAlpha=1;ctx.fillRect(x,mid-up,w,up);
      ctx.globalAlpha=.24;ctx.fillRect(x,mid+1,w,Math.max(1,h[i]*maxDn*.55));
      ctx.globalAlpha=.85;
      var py=mid-Math.max(2,pk[i]*maxUp)-2.5;ctx.fillRect(x,py,w,1.8);
    }
    ctx.globalAlpha=1;
  }
  if(RM){draw();}else{requestAnimationFrame(frame);}

  function toggle(){
    if(!ready||!yt)return;
    if(playing){try{yt.pauseVideo();}catch(e){}playing=false;btn.innerHTML='&#9654;';btn.setAttribute('aria-label','Play background music');}
    else{try{yt.playVideo();}catch(e){}playing=true;btn.innerHTML='&#9646;&#9646;';btn.setAttribute('aria-label','Pause background music');}
  }
  function want(){
    if(ready){toggle();return;}
    btn.innerHTML='&#8230;';loadYT();
    var tries=0,iv=setInterval(function(){tries++;if(ready){clearInterval(iv);toggle();}else if(tries>40){clearInterval(iv);btn.innerHTML='&#9654;';}},250);
  }
  var loading=false;
  function loadYT(){
    if(loading)return;loading=true;
    W.onYouTubeIframeAPIReady=function(){
      try{
        yt=new YT.Player('ytp',{videoId:'8CQ_QHosBSA',playerVars:{autoplay:0,controls:0,playsinline:1},
          events:{onReady:function(){ready=true;if(vol)yt.setVolume(parseInt(vol.value,10)||70);},
                  onStateChange:function(e){if(e.data===0){playing=false;btn.innerHTML='&#9654;';}}}});
      }catch(e){}
    };
    var s=D.createElement('script');s.src='https://www.youtube.com/iframe_api';s.async=true;D.head.appendChild(s);
  }
  if(btn)btn.addEventListener('click',want);
  cv.addEventListener('click',want);
  if(vol)vol.addEventListener('input',function(){
    var v=parseInt(this.value,10);if(ready&&yt)try{yt.setVolume(v);}catch(e){}
    this.style.background='linear-gradient(90deg,#fff '+v+'%,rgba(255,255,255,.2) '+v+'%)';
  });
}

/* ---------- 5. hardened forms ---------- */
var touched=false;
['keydown','pointerdown','touchstart'].forEach(function(ev){
  D.addEventListener(ev,function(){touched=true;},{once:true,passive:true});
});
var T0=Date.now();
function forms(){
  var fs=D.querySelectorAll('form[data-guard]');
  for(var i=0;i<fs.length;i++)wire(fs[i]);
}
function wire(f){
  if(!f.querySelector('input[name="_honey"]')){
    var d=D.createElement('div');d.className='hp';d.setAttribute('aria-hidden','true');
    d.innerHTML='<label>Leave blank</label><input type="text" name="_honey" tabindex="-1" autocomplete="off">';
    f.appendChild(d);
  }
  f.setAttribute('method','POST');f.setAttribute('novalidate','');
  var msg=f.querySelector('.fmsg')||(function(){var m=D.createElement('div');m.className='fmsg';m.setAttribute('role','status');f.appendChild(m);return m;})();
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var btn=f.querySelector('[type=submit]');
    function say(cls,txt){msg.className='fmsg show '+cls;msg.textContent=txt;}
    var hp=f.querySelector('input[name="_honey"]');
    if(hp&&hp.value){say('ok','Thank you. Your message has been received.');return;}
    if(!touched||Date.now()-T0<4000){say('bad','Give the page a moment to finish loading, then send again.');return;}
    var bad=[];
    var req=f.querySelectorAll('[required]');
    for(var i=0;i<req.length;i++){
      var el=req[i];
      var ok=el.type==='checkbox'?el.checked:String(el.value||'').trim().length>0;
      if(ok&&el.type==='email')ok=/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(el.value.trim());
      el.style.borderColor=ok?'':'#ff3b30';
      if(!ok)bad.push(el);
    }
    if(bad.length){say('bad','Please fill in the highlighted fields so I can reply.');bad[0].focus();return;}
    var fd=new FormData(f);
    fd.delete('_honey');
    fd.set('_captcha','false');
    fd.set('_template','table');
    if(!fd.get('_subject'))fd.set('_subject',f.getAttribute('data-subject')||'zacharytyewennstedt.com enquiry');
    fd.set('Sent from','zacharytyewennstedt.com'+location.pathname);
    if(btn){btn.disabled=true;btn.dataset.t=btn.textContent;btn.textContent='Sending...';}
    say('ok','Sending...');
    var url='https://form'+'submit.co/'+addr();
    fetch(url,{method:'POST',body:fd,headers:{'Accept':'application/json'}})
      .then(function(r){return r.ok?r.json().catch(function(){return{success:'true'};}):Promise.reject(r.status);})
      .then(function(){
        say('ok','Got it. Your message is on its way to me and I answer everything personally, usually same day. If it is urgent, call 1-800-481-8638.');
        f.reset();if(btn){btn.disabled=false;btn.textContent=btn.dataset.t;}
        if(W.ZTWsent)W.ZTWsent(f);
      })
      .catch(function(){
        say('bad','That did not go through. Please call 1-800-481-8638 or email me directly and I will pick it up.');
        if(btn){btn.disabled=false;btn.textContent=btn.dataset.t;}
        paintMail();
      });
  });
}

/* ---------- 7. boot ---------- */
function boot(){paintMail();nav();reveal();music();forms();}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot);else boot();
})();
