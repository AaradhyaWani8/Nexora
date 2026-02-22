/* ═══════════════════════════════════════════════
   noise.js — Animated grain/noise canvas overlay
═══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('noise-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, imageData, data;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    imageData = ctx.createImageData(W, H);
    data = imageData.data;
  }

  function renderNoise() {
    const len = data.length;
    for (let i = 0; i < len; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i]     = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 18; // very low alpha = subtle grain
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(renderNoise);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  renderNoise();
})();
