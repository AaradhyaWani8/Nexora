/* animations.js — Scroll reveals, counters, navbar, hamburger, testimonials, calendar */
document.addEventListener('DOMContentLoaded',()=>{

  /* NAVBAR */
  const navbar=document.getElementById('navbar');
  window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>40),{passive:true});

  /* HAMBURGER */
  const ham=document.getElementById('hamburger'),menu=document.getElementById('mobile-menu');
  if(ham&&menu){
    ham.addEventListener('click',()=>{ham.classList.toggle('open');menu.classList.toggle('open');});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ham.classList.remove('open');menu.classList.remove('open');}));
  }

  /* SCROLL REVEAL */
  const reveals=document.querySelectorAll('.scroll-reveal');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const d=parseInt(e.target.dataset.delay||0);
        setTimeout(()=>e.target.classList.add('visible'),d);
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  reveals.forEach(el=>obs.observe(el));

  /* STAT COUNTERS */
  function animCount(el){
    const target=parseFloat(el.dataset.count),isFloat=target%1!==0;
    const dur=1600,t0=performance.now();
    (function step(now){
      const p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,4),v=target*e;
      el.textContent=isFloat?v.toFixed(1):Math.floor(v);
      if(p<1)requestAnimationFrame(step);
      else{el.textContent=isFloat?target.toFixed(1):target;el.classList.add('counted');}
    })(performance.now());
  }
  const statObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){animCount(e.target);statObs.unobserve(e.target);}});
  },{threshold:0.5});
  document.querySelectorAll('.hstat-num').forEach(el=>statObs.observe(el));

  /* ANIME.JS feature cards stagger */
  if(window.anime){
    const fc=document.querySelectorAll('.feat-card');
    const fObs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        anime({targets:fc,translateY:[32,0],opacity:[0,1],duration:700,delay:anime.stagger(80),easing:'easeOutExpo'});
        fObs.disconnect();
      }
    },{threshold:0.08});
    if(fc.length)fObs.observe(fc[0].closest('.features-grid')||fc[0]);

    /* Steps */
    const steps=document.querySelectorAll('.step');
    const sObs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        anime({targets:steps,translateX:[-36,0],opacity:[0,1],duration:600,delay:anime.stagger(120),easing:'easeOutExpo'});
        sObs.disconnect();
      }
    },{threshold:0.1});
    if(steps.length)sObs.observe(steps[0].closest('.steps-wrap')||steps[0]);

    /* Pricing */
    const pc=document.querySelectorAll('.price-card');
    const pObs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        anime({targets:pc,scale:[0.93,1],opacity:[0,1],duration:600,delay:anime.stagger(100),easing:'easeOutBack'});
        pObs.disconnect();
      }
    },{threshold:0.1});
    if(pc.length)pObs.observe(pc[0].parentElement);
  }

  /* TESTIMONIALS SLIDER */
  const track=document.getElementById('testimonials-inner');
  const dotsW=document.getElementById('tnav-dots');
  const prevB=document.getElementById('tnav-prev');
  const nextB=document.getElementById('tnav-next');
  if(track){
    const cards=track.querySelectorAll('.tcard');
    const total=cards.length;
    let cur=0;
    const CARD_W=360;
    if(dotsW){cards.forEach((_,i)=>{const d=document.createElement('div');d.className='tnav-dot'+(i===0?' active':'');d.addEventListener('click',()=>goTo(i));dotsW.appendChild(d);});}
    function goTo(i){
      cur=i;track.style.transform=`translateX(-${cur*CARD_W}px)`;
      dotsW?.querySelectorAll('.tnav-dot').forEach((d,j)=>d.classList.toggle('active',j===cur));
    }
    if(nextB)nextB.addEventListener('click',()=>goTo((cur+1)%total));
    if(prevB)prevB.addEventListener('click',()=>goTo((cur-1+total)%total));
    let auto=setInterval(()=>goTo((cur+1)%total),4200);
    track.addEventListener('mouseenter',()=>clearInterval(auto));
    track.addEventListener('mouseleave',()=>{auto=setInterval(()=>goTo((cur+1)%total),4200);});
  }

  /* CALENDAR */
  const calGrid=document.getElementById('cal-grid');
  if(calGrid){
    const states=['empty','available','booked','available','ai','available','booked','available','booked','available','available','ai','booked','available','empty','available','booked','ai','available','booked','available','booked','available','available','ai','available','booked','empty'];
    ['M','T','W','T','F','S','S'].forEach(d=>{const h=document.createElement('div');h.className='cal-cell empty';h.style.cssText='font-weight:700;font-size:10px;opacity:.45';h.textContent=d;calGrid.appendChild(h);});
    states.forEach((s,i)=>{const c=document.createElement('div');c.className=`cal-cell ${s}`;c.textContent=s!=='empty'?i+1:'';if(i+1===19)c.classList.add('today');calGrid.appendChild(c);});
  }

  /* HERO CHAT BOT */
  const fcInput=document.getElementById('fc-input'),fcSend=document.getElementById('fc-send'),fcMsgs=document.getElementById('fc-messages');
  const REPLIES={book:"Sure! What date and time works best for you?",tomorrow:"Tomorrow has slots at 10am and 3pm. Which do you prefer?","10am":"10am confirmed! Reminder sent to WhatsApp. ✓",cancel:"Cancelled! Can I help you rebook?",hello:"Hello! 👋 I'm Nexora. How can I assist?",hi:"Hi! I'm Nexora, your AI assistant. How can I help?",invoice:"Invoice generated and emailed to you. ✓",reschedule:"Of course! What date would you prefer?"};
  function getReply(m){const l=m.toLowerCase();for(const[k,v]of Object.entries(REPLIES))if(l.includes(k))return v;return "I'd be happy to help! Would you like to book an appointment?";}
  function addMsg(t,type){const el=document.createElement('div');el.className=`fc-msg ${type}`;el.textContent=t;fcMsgs.appendChild(el);fcMsgs.scrollTop=fcMsgs.scrollHeight;if(window.anime)anime({targets:el,translateY:[10,0],opacity:[0,1],duration:320,easing:'easeOutExpo'});}
  function sendFC(){if(!fcInput)return;const v=fcInput.value.trim();if(!v)return;addMsg(v,'user');fcInput.value='';setTimeout(()=>addMsg(getReply(v),'bot'),680);}
  if(fcSend)fcSend.addEventListener('click',sendFC);
  if(fcInput)fcInput.addEventListener('keydown',e=>{if(e.key==='Enter')sendFC();});

});
