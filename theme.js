/* theme.js — Dark/Light mode */
(function(){
  const ROOT=document.documentElement;
  const BTN=document.getElementById('theme-toggle');
  const stored=localStorage.getItem('nexora-theme');
  const preferDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  ROOT.setAttribute('data-theme', stored||(preferDark?'dark':'light'));
  function toggle(){
    const next=ROOT.getAttribute('data-theme')==='dark'?'light':'dark';
    ROOT.setAttribute('data-theme',next);
    localStorage.setItem('nexora-theme',next);
    if(BTN){BTN.style.transform='scale(0.85) rotate(20deg)';setTimeout(()=>BTN.style.transform='',200);}
  }
  if(BTN)BTN.addEventListener('click',toggle);
  window.toggleTheme=toggle;
})();
