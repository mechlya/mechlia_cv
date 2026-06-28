const initStarfield = () => {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stars = [];
  let width = 0;
  let height = 0;
  const starCount = 180;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.1 + 0.4,
        alpha: 0.2 + Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      if (!prefersReducedMotion) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      }
    }
    if (!prefersReducedMotion) {
      window.requestAnimationFrame(draw);
    }
  };

  resize();
  draw();
  window.addEventListener('resize', resize);
};

const initNav = () => {
  const nav = document.getElementById('nav');
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobile = document.getElementById('closeMobile');

  const setScrolled = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };

  setScrolled();
  window.addEventListener('scroll', setScrolled);

  if (menuButton && mobileMenu && closeMobile) {
    menuButton.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    closeMobile.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }
};

const initSkills = () => {
  const skillItems = document.querySelectorAll('.skill-item');
  if (!skillItems.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const fill = item.dataset.fill || '0';
          item.classList.add('visible');
          item.style.setProperty('--fill', `${fill}%`);
          item.querySelector('.skill-fill').style.width = `${fill}%`;
        }
      });
    },
    { threshold: 0.35 }
  );
  skillItems.forEach((item) => observer.observe(item));
};

const initReveal = () => {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  reveals.forEach((item) => observer.observe(item));
};

const initPortfolioTabs = () => {
  const buttons = document.querySelectorAll('[data-tab-target]');
  const panels = document.querySelectorAll('[data-tab-panel]');
  const indicator = document.querySelector('.tab-indicator');
  if (!buttons.length || !panels.length || !indicator) return;

  const updateIndicator = (button) => {
    const rect = button.getBoundingClientRect();
    const parentRect = button.parentElement.getBoundingClientRect();
    indicator.style.left = `${rect.left - parentRect.left}px`;
    indicator.style.width = `${rect.width}px`;
  };

  const activateTab = (button) => {
    buttons.forEach((btn) => {
      const isActive = btn === button;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.tabPanel === button.dataset.tabTarget);
    });
    updateIndicator(button);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => activateTab(button));
  });

  activateTab(buttons[0]);
  window.addEventListener('resize', () => {
    const active = document.querySelector('.portfolio-tab.active');
    if (active) updateIndicator(active);
  });
};

const initAutoplayVideos = () => {
  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.play().catch(() => {});
  });
};

const initInlineYouTubeEmbeds = () => {
  const placeholders = document.querySelectorAll('[data-youtube-id]');
  if (!placeholders.length) return;

  const loadVideo = (placeholder) => {
    if (placeholder.dataset.loaded === 'true') return;

    const videoId = placeholder.dataset.youtubeId;
    const title = placeholder.dataset.youtubeTitle || 'YouTube video';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    placeholder.innerHTML = '';
    placeholder.appendChild(iframe);
    placeholder.dataset.loaded = 'true';
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px 150px 0px', threshold: 0.2 }
  );

  placeholders.forEach((placeholder) => {
    const button = placeholder.querySelector('.video-play-button');

    if (button) {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        loadVideo(placeholder);
      });
    }

    placeholder.addEventListener('click', (event) => {
      if (event.target !== button) {
        loadVideo(placeholder);
      }
    });

    observer.observe(placeholder);
  });
};

const initProjectCarousel = () => {
  const carouselCard = document.querySelector('[data-carousel]');
  if (!carouselCard) return;
  const video = carouselCard.querySelector('video');
  const toggle = carouselCard.querySelector('[data-carousel-next]');
  const sources = carouselCard.dataset.sources.split('|');
  let index = 0;

  const updateSource = () => {
    const sourceEl = video.querySelector('source');
    sourceEl.src = sources[index];
    video.loop = true;
    video.muted = true;
    sourceEl.parentElement.load();
    video.play().catch(() => {});
  };

  toggle.addEventListener('click', () => {
    index = (index + 1) % sources.length;
    updateSource();
  });
};

window.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initNav();
  initSkills();
  initReveal();
  initPortfolioTabs();
  initProjectCarousel();
  initAutoplayVideos();
  initInlineYouTubeEmbeds();
});
