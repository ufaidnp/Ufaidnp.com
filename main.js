/* =============================================
   PORTFOLIO — MAIN JS
   Custom cursor · Canvas particles · Terminal
   Scroll animations · Skill bars · Counter
   ============================================= */

// ── CUSTOM CURSOR ──────────────────────────────
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower
(function followCursor() {
  const speed = 0.13;
  followerX += (mouseX - followerX) * speed;
  followerY += (mouseY - followerY) * speed;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(followCursor);
})();

// Hover states
document.querySelectorAll('a, button, [data-tilt], .badge, .highlight-item, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '16px';
    cursor.style.height = '16px';
    cursor.style.background = 'rgba(0,200,255,0.6)';
    cursorFollower.style.width  = '50px';
    cursorFollower.style.height = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '8px';
    cursor.style.height = '8px';
    cursor.style.background = 'var(--accent)';
    cursorFollower.style.width  = '32px';
    cursorFollower.style.height = '32px';
  });
});

// ── NAVBAR ─────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── HERO CANVAS — PARTICLE NETWORK ─────────────
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

const PARTICLE_COUNT = 80;
const MAX_DIST = 130;

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : -10;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.8 + 0.6;
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,200,255,${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}
initParticles();

// Mouse influence
let mx = W / 2, my = H / 2;
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mx = e.clientX - rect.left;
  my = e.clientY - rect.top;
});

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MAX_DIST) {
        const a = 1 - d / MAX_DIST;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,200,255,${a * 0.2})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
    // Mouse lines
    const dx = particles[i].x - mx;
    const dy = particles[i].y - my;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 180) {
      const a = 1 - d / 180;
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mx, my);
      ctx.strokeStyle = `rgba(0,200,255,${a * 0.4})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ── TERMINAL TYPEWRITER ─────────────────────────
const terminalEl = document.getElementById('terminal-text');
const lines = [
  { type: 'prompt', text: '$ whoami' },
  { type: 'out',    text: 'cybersecurity_student && hardware_hacker' },
  { type: 'prompt', text: '$ cat skills.txt' },
  { type: 'string', text: '[ pentesting, CTF, exploit_dev, OSINT ]' },
  { type: 'string', text: '[ JTAG, UART, PCB_design, firmware ]' },
  { type: 'string', text: '[ python, C, rust, bash ]' },
  { type: 'prompt', text: '$ cat status.txt' },
  { type: 'out',    text: 'open_to_work: true' },
  { type: 'out',    text: 'looking_for: internships, collabs' },
  { type: 'comment', text: '# ready to ship something great' },
];

let lineIdx = 0, charIdx = 0;
let terminalStarted = false;

function typeNextChar() {
  if (lineIdx >= lines.length) {
    terminalEl.innerHTML += '<span class="t-cursor"></span>';
    return;
  }
  const line = lines[lineIdx];
  if (charIdx === 0) {
    const span = document.createElement('div');
    span.className = 't-line';
    if (line.type === 'prompt') {
      span.innerHTML = `<span class="t-prompt">$ </span><span class="t-cmd"></span>`;
    } else {
      span.innerHTML = `<span class="t-${line.type}"></span>`;
    }
    terminalEl.appendChild(span);
  }

  const target = line.type === 'prompt'
    ? terminalEl.lastChild.querySelector('.t-cmd')
    : terminalEl.lastChild.querySelector(`:last-child`);

  if (target && charIdx < line.text.replace(/^\$ /, '').length) {
    const raw = line.text.replace(/^\$ /, '');
    target.textContent = raw.slice(0, charIdx + 1);
    charIdx++;
    const delay = line.type === 'prompt' ? 60 : 20;
    setTimeout(typeNextChar, delay);
  } else {
    charIdx = 0; lineIdx++;
    setTimeout(typeNextChar, lineIdx % 2 === 0 ? 300 : 100);
  }
}

// ── INTERSECTION OBSERVER ───────────────────────
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Terminal start
      if (entry.target.classList.contains('about-visual') && !terminalStarted) {
        terminalStarted = true;
        setTimeout(typeNextChar, 400);
      }

      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── SKILL BARS ──────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.dataset.width;
        setTimeout(() => { fill.style.width = w + '%'; }, 100);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(c => skillObserver.observe(c));

// ── COUNTER ANIMATION ───────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const target = +el.dataset.target;
        let current = 0;
        const step = target / 40;
        const t = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.round(current) + '+';
          if (current >= target) clearInterval(t);
        }, 30);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ── 3D TILT ─────────────────────────────────────
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px) scale(1.02)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.5s cubic-bezier(.2,.8,.2,1)';
    setTimeout(() => { el.style.transition = ''; }, 500);
  });
});

// ── CONTACT FORM ────────────────────────────────
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';

  // Simulate send (replace with real endpoint)
  setTimeout(() => {
    formSuccess.style.display = 'block';
    form.reset();
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    setTimeout(() => { formSuccess.style.display = 'none'; }, 4000);
  }, 1200);
});

// ── SMOOTH ACTIVE NAV LINK ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
}, { passive: true });
