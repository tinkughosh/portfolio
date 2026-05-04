/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ===== TYPED TITLE ===== */
const titles = [
  'Network Engineer',
  'Network Security Engineer',
  'AI-Driven Network Automator',
  'CCNP ENCOR Certified',
];
let tIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typedTitle');

function typeLoop() {
  const word = titles[tIdx];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
  } else {
    typedEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % titles.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 85);
}
typeLoop();

/* ===== NETWORK CANVAS ===== */
(function () {
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Node() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 1;
  }

  Node.prototype.update = function () {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init() {
    resize();
    const count = Math.floor((W * H) / 14000);
    nodes = Array.from({ length: count }, () => new Node());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 130;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168,85,247,${0.14 * (1 - d / maxDist)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168,85,247,0.5)';
      ctx.fill();
    }
    animId = requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    draw();
  });
})();

/* ===== INTERSECTION OBSERVER ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate], .timeline-item, .project-card, .edu-card, .cert-card').forEach(el => {
  observer.observe(el);
});

/* ===== SMOOTH NAV CLOSE ON CLICK ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
