// ── NAV SCROLL EFFECT
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── MOBILE NAV TOGGLE
const toggle = document.getElementById('nav-toggle');
const mobileNav = document.getElementById('nav-mobile');
toggle.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// ── SCROLL REVEAL for project cards
const cards = document.querySelectorAll('.project-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, i * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
cards.forEach(card => observer.observe(card));

// ── SMOOTH ANCHOR SCROLL (offset for fixed nav)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
