/* cursor.js — Custom cursor disabled, using native pointer */
(function(){
  // Custom cursor removed — using native browser cursor
  // Magnetic buttons still work
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('.magnetic').forEach(el=>{
      el.addEventListener('mousemove',e=>{
        const r=el.getBoundingClientRect();
        const dx=e.clientX-(r.left+r.width/2);
        const dy=e.clientY-(r.top+r.height/2);
        el.style.transform=`translate(${dx*.22}px,${dy*.22}px)`;
      });
      el.addEventListener('mouseleave',()=>el.style.transform='');
    });
  });
})();