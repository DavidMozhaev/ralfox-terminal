// Rally FOX ($RALF) — base site behavior
// Gallery images, signal entries, and contract/links are placeholders — swap later.

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initGallery();
  initLightbox();
  initScrollReveal();
  initTextPanels();
  initParticles();
});

function initMobileNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('is-open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('is-open'));
  });
}

function initGallery(){
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const PLACEHOLDER_COUNT = 6;

  for (let i = 1; i <= PLACEHOLDER_COUNT; i++){
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.label = `Image ${i}`;
    item.innerHTML = `
      <div class="ph-fill">Placeholder ${i}</div>
      <div class="ph-overlay">
        <span class="loupe"></span>
        <span class="caption">click to enlarge</span>
      </div>
    `;
    grid.appendChild(item);
  }
}

function initLightbox(){
  const lightbox = document.getElementById('lightbox');
  const frame = document.getElementById('lightboxFrame');
  const closeBtn = document.getElementById('lightboxClose');
  const grid = document.getElementById('galleryGrid');
  if (!lightbox || !frame || !closeBtn || !grid) return;

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    frame.textContent = item.dataset.label || 'Placeholder';
    lightbox.classList.add('is-open');
  });

  const close = () => lightbox.classList.remove('is-open');

  closeBtn.addEventListener('click', close);

  // close when clicking outside the image frame
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function initScrollReveal(){
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
}

function initTextPanels(){
  document.querySelectorAll('.text-panel').forEach(panel => {
    panel.addEventListener('click', () => panel.classList.toggle('is-active'));
  });
}

function initParticles(){
  const container = document.getElementById('particles');
  if (!container) return;

  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const PARTICLE_COUNT = 9;

  for (let i = 0; i < PARTICLE_COUNT; i++){
    const p = document.createElement('span');
    p.className = 'particle';
    const size = randomBetween(1.5, 3);
    p.style.left = `${randomBetween(0, 100)}%`;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.setProperty('--drift', `${randomBetween(-40, 40)}px`);
    p.style.animationDuration = `${randomBetween(20, 38)}s`;
    p.style.animationDelay = `-${randomBetween(0, 38)}s`;
    container.appendChild(p);
  }
}
