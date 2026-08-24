// Rally FOX ($RALF) — base site behavior

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initGallery();
  initLightbox();
  initScrollReveal();
  initTextPanels();
  initParticles();
});


/* ========================================
   MOBILE NAV
   ======================================== */

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('is-open');
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
    });
  });
}


/* ========================================
   THE HUNT GALLERY
   ======================================== */

function initGallery() {
  const viewport = document.getElementById('galleryViewport');
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  if (!viewport || !track || !prevBtn || !nextBtn) return;

  const images = [
    'assets/IMG_5081.PNG',
    'assets/IMG_5082.PNG',
    'assets/IMG_5083.PNG',
    'assets/IMG_5084.PNG',
    'assets/IMG_5085.PNG',
    'assets/IMG_5086.PNG'
  ];

  let index = 0;
  let itemsPerPage = 3;

  function getItemsPerPage() {
    if (window.innerWidth <= 600) {
      return 1;
    }

    if (window.innerWidth <= 900) {
      return 2;
    }

    return 3;
  }

  function getGap() {
    if (window.innerWidth <= 600) {
      return 10;
    }

    if (window.innerWidth <= 900) {
      return 14;
    }

    return 20;
  }

  function buildTrack() {
    track.innerHTML = '';

    images.forEach((src, i) => {
      const item =
        document.createElement('div');

      item.className =
        'gallery-item';

      item.dataset.label =
        `Image ${i + 1}`;

      item.dataset.src =
        src;

      item.innerHTML = `
        <img
          src="${src}"
          alt="The Hunt ${i + 1}"
          class="gallery-image"
          draggable="false"
        >

        <div class="ph-overlay">
          <span class="loupe"></span>
          <span class="caption">
            click to enlarge
          </span>
        </div>
      `;

      track.appendChild(item);
    });
  }

  function applyLayoutVars() {
    itemsPerPage = getItemsPerPage();

    const gap = getGap();

    track.style.setProperty(
      '--gallery-items',
      itemsPerPage
    );

    track.style.setProperty(
      '--gallery-gap',
      `${gap}px`
    );
  }

  function maxIndex() {
    return Math.max(
      0,
      images.length - itemsPerPage
    );
  }

  function updateArrows() {
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= maxIndex();
  }

  function slideTo(newIndex, animate = true) {
    index = Math.min(
      Math.max(newIndex, 0),
      maxIndex()
    );

    const firstItem = track.children[0];

    if (!firstItem) return;

    const step =
      firstItem.getBoundingClientRect().width +
      getGap();

    if (!animate) {
      track.classList.add('no-transition');
    }

    track.style.transform =
      `translateX(-${index * step}px)`;

    if (!animate) {
      void track.offsetHeight;
      track.classList.remove('no-transition');
    }

    updateArrows();
  }


  /* NEXT / PREVIOUS */

  nextBtn.addEventListener('click', () => {
    slideTo(index + 1);
  });

  prevBtn.addEventListener('click', () => {
    slideTo(index - 1);
  });


  /* KEYBOARD ARROWS */

  document.addEventListener('keydown', (e) => {
    const gallery =
      document.getElementById('gallery');

    if (!gallery) return;

    const rect =
      gallery.getBoundingClientRect();

    const galleryVisible =
      rect.top < window.innerHeight &&
      rect.bottom > 0;

    if (!galleryVisible) return;

    if (e.key === 'ArrowRight') {
      nextBtn.click();
    }

    if (e.key === 'ArrowLeft') {
      prevBtn.click();
    }
  });


  /* SWIPE FOR MOBILE */

  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener(
    'touchstart',
    (e) => {
      touchStartX =
        e.changedTouches[0].screenX;
    },
    {
      passive: true
    }
  );

  viewport.addEventListener(
    'touchend',
    (e) => {
      touchEndX =
        e.changedTouches[0].screenX;

      const distance =
        touchEndX - touchStartX;

      if (Math.abs(distance) < 40) {
        return;
      }

      if (distance < 0) {
        nextBtn.click();
      } else {
        prevBtn.click();
      }
    },
    {
      passive: true
    }
  );


  /* RESPONSIVE RECALCULATION */

  let resizeTimer;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      applyLayoutVars();
      slideTo(0, false);
    }, 150);
  });


  buildTrack();
  applyLayoutVars();
  slideTo(0, false);
}


/* ========================================
   LIGHTBOX
   ======================================== */

function initLightbox() {
  const lightbox =
    document.getElementById('lightbox');

  const frame =
    document.getElementById('lightboxFrame');

  const closeBtn =
    document.getElementById('lightboxClose');

  const grid =
    document.getElementById('galleryTrack');

  if (
    !lightbox ||
    !frame ||
    !closeBtn ||
    !grid
  ) {
    return;
  }


  /* OPEN IMAGE */

  grid.addEventListener('click', (e) => {
    const item =
      e.target.closest('.gallery-item');

    if (!item) return;

    const src =
      item.dataset.src;

    if (!src) return;

    const label =
      item.dataset.label || 'The Hunt';

    frame.innerHTML = `
      <img
        src="${src}"
        alt="${label}"
        class="lightbox-image"
        draggable="false"
      >
    `;

    lightbox.classList.add('is-open');

    document.body.style.overflow =
      'hidden';
  });


  /* CLOSE */

  const close = () => {
    lightbox.classList.remove(
      'is-open'
    );

    frame.innerHTML = '';

    document.body.style.overflow =
      '';
  };


  closeBtn.addEventListener(
    'click',
    close
  );


  /* CLICK OUTSIDE */

  lightbox.addEventListener(
    'click',
    (e) => {
      if (e.target === lightbox) {
        close();
      }
    }
  );


  /* ESC */

  document.addEventListener(
    'keydown',
    (e) => {
      if (
        e.key === 'Escape' &&
        lightbox.classList.contains(
          'is-open'
        )
      ) {
        close();
      }
    }
  );
}


/* ========================================
   SCROLL REVEAL
   ======================================== */

function initScrollReveal() {
  const targets =
    document.querySelectorAll('.reveal');

  if (!targets.length) return;

  if (
    !('IntersectionObserver' in window)
  ) {
    targets.forEach((target) => {
      target.classList.add('is-visible');
    });

    return;
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              'is-visible'
            );

            observer.unobserve(
              entry.target
            );
          }
        });
      },
      {
        threshold: 0.15
      }
    );

  targets.forEach((el) => {
    observer.observe(el);
  });
}


/* ========================================
   TEXT PANELS
   ======================================== */

function initTextPanels() {
  const panels =
    document.querySelectorAll(
      '.text-panel'
    );

  panels.forEach((panel) => {
    panel.addEventListener(
      'click',
      () => {
        panel.classList.toggle(
          'is-active'
        );
      }
    );
  });
}


/* ========================================
   PARTICLES
   ======================================== */

function initParticles() {
  const container =
    document.getElementById(
      'particles'
    );

  if (!container) return;

  const randomBetween =
    (min, max) => {
      return (
        min +
        Math.random() * (max - min)
      );
    };

  const PARTICLE_COUNT = 9;

  for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
  ) {
    const p =
      document.createElement('span');

    p.className = 'particle';

    const size =
      randomBetween(1.5, 3);

    p.style.left =
      `${randomBetween(0, 100)}%`;

    p.style.width =
      `${size}px`;

    p.style.height =
      `${size}px`;

    p.style.setProperty(
      '--drift',
      `${randomBetween(-40, 40)}px`
    );

    p.style.animationDuration =
      `${randomBetween(20, 38)}s`;

    p.style.animationDelay =
      `-${randomBetween(0, 38)}s`;

    container.appendChild(p);
  }
}
