/* demo.js — WhatsApp chat demo + voice demo */
const DEMO_REPLIES={'book':['Checking available slots...','📅 Available:\n• Feb 22, 10:00 AM\n• Feb 23, 2:30 PM\n• Feb 24, 11:00 AM\nWhich works?'],'appointment':['What service do you need?'],'check':['Looking up your booking...','✅ Confirmed: Feb 22 at 10:00 AM\n📍 Consultation\nReply CANCEL to cancel.'],'cancel':['Are you sure?','✅ Cancelled! Want to rebook?'],'hello':["Hello! 👋 I'm Nexora. How can I help?"],'hi':["Hi! 😊 I'm Nexora, your AI assistant."],'invoice':['Generating...','🧾 Invoice #1042 sent!\n₹2,500 · Due Feb 28'],'reschedule':["Sure! What date works?"],'remind':['🔔 Reminder set! You\'ll get a WhatsApp alert 24h before.'],'thanks':["You're welcome! 😊 Anything else?"],'price':["Plans:\n• Starter: Free\n• Growth: ₹2,999/mo\n• Enterprise: ₹9,999/mo"]};
const DEFAULT_REPLY=["I'm here to help! Try: Book appointment, Check booking, or Get invoice."];

function demoGetReplies(m){const l=m.toLowerCase();for(const[k,v]of Object.entries(DEMO_REPLIES))if(l.includes(k))return v;return DEFAULT_REPLY;}

function demoAddMsg(text,type){
  const chat=document.getElementById('demo-chat');if(!chat)return;
  if(type==='user')chat.querySelector('.dc-suggestions')?.remove();
  const el=document.createElement('div');el.className=`dc-msg ${type}`;el.textContent=text;
  chat.appendChild(el);chat.scrollTop=chat.scrollHeight;
  if(window.anime)anime({targets:el,translateY:[12,0],opacity:[0,1],duration:320,easing:'easeOutExpo'});
}

function demoTyping(){
  const chat=document.getElementById('demo-chat');if(!chat)return null;
  const el=document.createElement('div');el.className='dc-msg bot';el.innerHTML='<span style="color:var(--text-3);letter-spacing:4px;font-size:18px">···</span>';
  chat.appendChild(el);chat.scrollTop=chat.scrollHeight;return el;
}

function sendDemo(){
  const inp=document.getElementById('demo-input');if(!inp)return;
  const v=inp.value.trim();if(!v)return;
  demoAddMsg(v,'user');inp.value='';
  const reps=demoGetReplies(v);
  const typing=demoTyping();
  let off=850;
  reps.forEach((r,i)=>{
    setTimeout(()=>{
      if(i===0&&typing)typing.remove();
      const t=i>0?demoTyping():null;
      setTimeout(()=>{t?.remove();demoAddMsg(r,'bot');},i>0?550:0);
    },off);off+=1050;
  });
}

function demoReply(text){const inp=document.getElementById('demo-input');if(inp)inp.value=text;sendDemo();}

/* VOICE DEMO */
const PHRASES=['"Hello! This is Nexora. How can I assist you today?"','"I see your appointment is tomorrow at 10 AM. Shall I send a reminder?"','"I\'ve found 3 available slots this week. Which do you prefer?"','"Your invoice has been emailed. Thank you for choosing us!"','"Rescheduled to Friday at 2 PM. See you then! 😊"'];
let voiceOn=false,voiceTimer=null,phraseIdx=0;

function toggleVoice(){
  voiceOn=!voiceOn;
  const av=document.getElementById('voice-avatar'),wv=document.getElementById('voice-waves'),tx=document.getElementById('voice-text'),btn=document.getElementById('voice-btn'),tr=document.getElementById('voice-transcript');
  if(voiceOn){
    av?.classList.add('active');wv?.classList.add('active');if(btn)btn.textContent='⏸ Pause';
    function show(){
      if(!voiceOn)return;
      const p=PHRASES[phraseIdx%PHRASES.length];
      if(tx){tx.style.opacity='0';setTimeout(()=>{tx.textContent=p;tx.style.opacity='1';tx.style.transition='opacity .4s';},280);}
      if(tr)tr.textContent='▶ Playing…';
      phraseIdx++;
    }
    show();voiceTimer=setInterval(show,3000);
  }else{
    av?.classList.remove('active');wv?.classList.remove('active');if(btn)btn.textContent='▶ Play sample';
    clearInterval(voiceTimer);if(tx)tx.textContent=PHRASES[0];if(tr)tr.textContent='';
  }
}

window.sendDemo=sendDemo;window.demoReply=demoReply;window.toggleVoice=toggleVoice;
