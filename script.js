/* ============================================================
   BLANC AGENCY — Script
   ============================================================ */

/* ---- Canvas Particle System ---- */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, animId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    const hue = [265, 340, 155][Math.floor(Math.random() * 3)];
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.5, 2.2),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.25, -0.05),
      opacity: rand(0.2, 0.6),
      hue,
      life: 0,
      maxLife: rand(200, 600),
    };
  }

  function initParticles() {
    particles = Array.from({ length: 120 }, createParticle);
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.life++;
      if (p.life > p.maxLife) { particles[i] = createParticle(); return; }
      const progress = p.life / p.maxLife;
      const fade = progress < 0.1 ? progress * 10 : progress > 0.85 ? (1 - progress) / 0.15 : 1;
      ctx.save();
      ctx.globalAlpha = p.opacity * fade;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue}, 80%, 70%)`;
      ctx.fill();

      // glow
      ctx.globalAlpha = p.opacity * fade * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      grd.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 1)`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
    });

    // Draw connecting lines for nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.06;
          ctx.strokeStyle = `hsl(265, 70%, 70%)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    animId = requestAnimationFrame(drawParticles);
  }

  resize();
  initParticles();
  drawParticles();
  window.addEventListener('resize', () => { resize(); });
}());

/* ---- Custom Cursor ---- */
(function () {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function followMouse() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(followMouse);
  }
  followMouse();
}());

/* ---- Scroll-based Nav style ---- */
(function () {
  const nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}());

/* ---- Mobile Menu ---- */
(function () {
  const toggle = document.getElementById('menuToggle');
  const mobile = document.getElementById('navMobile');
  if (!toggle || !mobile) return;
  toggle.addEventListener('click', () => {
    mobile.classList.toggle('open');
  });
  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobile.classList.remove('open'));
  });
}());

/* ---- Intersection Observer Reveal ---- */
(function () {
  const targets = document.querySelectorAll('.reveal-up, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => observer.observe(el));
}());

/* ---- Counter Animation ---- */
(function () {
  const statNums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => observer.observe(el));
}());

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
