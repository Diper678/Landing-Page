/**
 * Sisteco Interactive Globe — vanilla JS canvas
 * Ported from interactive-globe.tsx, adapted for Sisteco brand
 * LATAM-focused markers · lime-green (#c5ed36) accent
 */

(function () {
  // ── Sisteco markers (LATAM + global reach) ──────────────────────
  const MARKERS = [
    { lat: -33.45, lng: -70.67, label: 'Santiago' },
    { lat: -34.61, lng: -58.37, label: 'Buenos Aires' },
    { lat: -12.05, lng: -77.04, label: 'Lima' },
    { lat: 4.71,   lng: -74.07, label: 'Bogotá' },
    { lat: 19.43,  lng: -99.13, label: 'México' },
    { lat: 25.77,  lng: -80.19, label: 'Miami' },
    { lat: -23.55, lng: -46.63, label: 'São Paulo' },
    { lat: 40.71,  lng: -74.01, label: 'New York' },
    { lat: 1.35,   lng: 103.82, label: 'Singapore' },
  ];

  const CONNECTIONS = [
    { from: [-33.45, -70.67], to: [-34.61, -58.37] },
    { from: [-33.45, -70.67], to: [-12.05, -77.04] },
    { from: [-33.45, -70.67], to: [4.71,   -74.07] },
    { from: [-33.45, -70.67], to: [19.43,  -99.13] },
    { from: [-33.45, -70.67], to: [25.77,  -80.19] },
    { from: [-23.55, -46.63], to: [25.77,  -80.19] },
    { from: [25.77,  -80.19], to: [40.71,  -74.01] },
    { from: [40.71,  -74.01], to: [1.35,   103.82] },
    { from: [-12.05, -77.04], to: [4.71,   -74.07] },
  ];

  // ── Math helpers ─────────────────────────────────────────────────
  function latLngToXYZ(lat, lng, r) {
    const phi   = ((90 - lat) * Math.PI) / 180;
    const theta = ((lng + 180) * Math.PI) / 180;
    return [
      -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
    ];
  }

  function rotateY(x, y, z, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [x * c + z * s, y, -x * s + z * c];
  }

  function rotateX(x, y, z, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [x, y * c - z * s, y * s + z * c];
  }

  function project(x, y, z, cx, cy, fov) {
    const scale = fov / (fov + z);
    return [x * scale + cx, y * scale + cy, z];
  }

  // ── Main init ────────────────────────────────────────────────────
  function initGlobe(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Colour palette — Sisteco lime green
    const DOT_COLOR    = 'rgba(17, 17, 17, ALPHA)';
    const ARC_COLOR    = 'rgba(197, 237, 54, 0.55)';
    const MARKER_COLOR = 'rgba(17, 17, 17, 0.9)';
    const AUTO_SPEED   = 0.0018;

    // Start rotation centred on South America
    let rotY = -1.2;
    let rotX =  0.28;
    let drag = { active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 };
    let animId = null;
    let time = 0;

    // Fibonacci sphere dots
    const dots = [];
    const N = 1200;
    const PHI = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < N; i++) {
      const theta = (2 * Math.PI * i) / PHI;
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / N);
      dots.push([
        Math.cos(theta) * Math.sin(phi),
        Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
      ]);
    }

    // Track last canvas size to avoid constant re-allocation
    let lastW = 0, lastH = 0;

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const w   = canvas.clientWidth;
      const h   = canvas.clientHeight;

      if (w !== lastW || h !== lastH) {
        canvas.width  = w * dpr;
        canvas.height = h * dpr;
        lastW = w; lastH = h;
      }

      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.40;
      const fov    = 600;

      if (!drag.active) rotY += AUTO_SPEED;
      time += 0.015;

      ctx.clearRect(0, 0, w, h);

      // Subtle lime glow behind globe
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.6);
      glow.addColorStop(0, 'rgba(197, 237, 54, 0.08)');
      glow.addColorStop(1, 'rgba(197, 237, 54, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Globe outline ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(197, 237, 54, 0.10)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const ry = rotY;
      const rx = rotX;

      // ── Dots ────────────────────────────────────────────────────
      for (let i = 0; i < dots.length; i++) {
        let [x, y, z] = dots[i];
        x *= radius; y *= radius; z *= radius;
        [x, y, z] = rotateX(x, y, z, rx);
        [x, y, z] = rotateY(x, y, z, ry);
        if (z > 0) continue; // back-face cull

        const [sx, sy] = project(x, y, z, cx, cy, fov);
        const alpha    = Math.max(0.07, 1 - (z + radius) / (2 * radius));
        const dotSize  = 1 + alpha * 0.9;

        ctx.beginPath();
        ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = DOT_COLOR.replace('ALPHA', alpha.toFixed(2));
        ctx.fill();
      }

      // ── Arcs + travelling dots ───────────────────────────────────
      for (const conn of CONNECTIONS) {
        let [x1, y1, z1] = latLngToXYZ(conn.from[0], conn.from[1], radius);
        let [x2, y2, z2] = latLngToXYZ(conn.to[0],   conn.to[1],   radius);

        [x1, y1, z1] = rotateX(x1, y1, z1, rx);
        [x1, y1, z1] = rotateY(x1, y1, z1, ry);
        [x2, y2, z2] = rotateX(x2, y2, z2, rx);
        [x2, y2, z2] = rotateY(x2, y2, z2, ry);

        if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;

        const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
        const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

        // Elevated control point for the arc
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, mz = (z1 + z2) / 2;
        const ml = Math.sqrt(mx * mx + my * my + mz * mz) || 1;
        const ah = radius * 1.28;
        const [scx, scy] = project(mx / ml * ah, my / ml * ah, mz / ml * ah, cx, cy, fov);

        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.quadraticCurveTo(scx, scy, sx2, sy2);
        ctx.strokeStyle = ARC_COLOR;
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Travelling dot along Bézier
        const t  = (Math.sin(time * 1.1 + conn.from[0] * 0.08) + 1) / 2;
        const tx = (1-t)*(1-t)*sx1 + 2*(1-t)*t*scx + t*t*sx2;
        const ty = (1-t)*(1-t)*sy1 + 2*(1-t)*t*scy + t*t*sy2;
        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = MARKER_COLOR;
        ctx.fill();
      }

      // ── Markers ─────────────────────────────────────────────────
      for (const m of MARKERS) {
        let [x, y, z] = latLngToXYZ(m.lat, m.lng, radius);
        [x, y, z] = rotateX(x, y, z, rx);
        [x, y, z] = rotateY(x, y, z, ry);
        if (z > radius * 0.12) continue;

        const [sx, sy] = project(x, y, z, cx, cy, fov);
        const pulse = (Math.sin(time * 2 + m.lat * 0.5) + 1) / 2;

        // Pulse ring
        ctx.beginPath();
        ctx.arc(sx, sy, 4 + pulse * 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(197, 237, 54, ${0.25 + pulse * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = MARKER_COLOR;
        ctx.fill();

        // Label
        if (m.label) {
          ctx.font = '500 10px system-ui, sans-serif';
          ctx.fillStyle = 'rgba(17, 17, 17, 0.50)';
          ctx.fillText(m.label, sx + 9, sy + 3);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    // ── Pointer / drag ─────────────────────────────────────────────
    canvas.addEventListener('pointerdown', (e) => {
      drag = { active: true, startX: e.clientX, startY: e.clientY, startRotY: rotY, startRotX: rotX };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!drag.active) return;
      rotY = drag.startRotY + (e.clientX - drag.startX) * 0.005;
      rotX = Math.max(-1, Math.min(1, drag.startRotX + (e.clientY - drag.startY) * 0.005));
    });

    canvas.addEventListener('pointerup', () => {
      drag.active = false;
      canvas.style.cursor = 'grab';
    });

    canvas.style.cursor = 'grab';

    // Start loop
    animId = requestAnimationFrame(draw);

    // Pause when off-screen (IntersectionObserver)
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!animId) animId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }, { threshold: 0.1 });
      obs.observe(canvas);
    }
  }

  // ── Auto-init on DOMContentLoaded ─────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initGlobe('sisteco-globe'));
  } else {
    initGlobe('sisteco-globe');
  }

  // Expose globally for optional manual init
  window.SistecoGlobe = { init: initGlobe };
})();
