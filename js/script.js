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
  const grid = document.getElementById('galleryGrid');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  if (!grid || !prevBtn || !nextBtn) return;

  const images = [
    'assets/IMG_5081.PNG',
    'assets/IMG_5082.PNG',
    'assets/IMG_5083.PNG',
    'assets/IMG_5084.PNG',
    'assets/IMG_5085.PNG',
    'assets/IMG_5086.PNG'
  ];

  let currentPage = 0;

  function getItemsPerPage() {
    if (window.innerWidth <= 600) {
      return 1;
    }

    if (window.innerWidth <= 900) {
      return 2;
    }

    return 3;
  }

  function renderGallery() {
    const itemsPerPage = getItemsPerPage();

    const totalPages = Math.ceil(
      images.length / itemsPerPage
    );

    if (currentPage >= totalPages) {
      currentPage = totalPages - 1;
    }

    if (currentPage < 0) {
      currentPage = 0;
    }

    const start =
      currentPage * itemsPerPage;

    const end =
      start + itemsPerPage;

    const visibleImages =
      images.slice(start, end);

    grid.innerHTML = '';

    visibleImages.forEach((src, index) => {
      const actualIndex =
        start + index;

      const item =
        document.createElement('div');

      item.className =
        'gallery-item';

      item.dataset.label =
        `Image ${actualIndex + 1}`;

      item.dataset.src =
        src;

      item.innerHTML = `
        <img
          src="${src}"
          alt="The Hunt ${actualIndex + 1}"
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

      grid.appendChild(item);
    });

    prevBtn.disabled =
      currentPage === 0;

    nextBtn.disabled =
      currentPage >= totalPages - 1;
  }


  /* NEXT */

  nextBtn.addEventListener('click', () => {
    const itemsPerPage =
      getItemsPerPage();

    const totalPages =
      Math.ceil(
        images.length / itemsPerPage
      );

    if (currentPage < totalPages - 1) {
      currentPage++;
      renderGallery();
    }
  });


  /* PREVIOUS */

  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderGallery();
    }
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

  grid.addEventListener(
    'touchstart',
    (e) => {
      touchStartX =
        e.changedTouches[0].screenX;
    },
    {
      passive: true
    }
  );

  grid.addEventListener(
    'touchend',
    (e) => {
      touchEndX =
        e.changedTouches[0].screenX;

      const distance =
        touchEndX - touchStartX;

      if (Math.abs(distance) < 50) {
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
      currentPage = 0;
      renderGallery();
    }, 150);
  });


  renderGallery();
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
    document.getElementById('galleryGrid');

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
