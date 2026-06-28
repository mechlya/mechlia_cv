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
  document.querySelectorAll('.section-title').forEach((title) => {
    title.setAttribute('data-reveal', '');
  });

  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('visible');
          element.querySelectorAll(':scope > *').forEach((child, index) => {
            child.style.transitionDelay = `${index * 80}ms`;
          });
          observer.unobserve(element);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((item) => observer.observe(item));
};

const initHeroTitleReveal = () => {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle || heroTitle.dataset.revealed === 'true') return;
  const text = heroTitle.textContent.trim();
  if (!text) return;

  const words = text.split(/\s+/);
  heroTitle.innerHTML = '';
  const fragment = document.createDocumentFragment();

  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = word;
    span.style.transitionDelay = `${index * 120}ms`;
    fragment.appendChild(span);
    if (index < words.length - 1) {
      fragment.appendChild(document.createTextNode(' '));
    }
  });

  heroTitle.appendChild(fragment);
  heroTitle.dataset.revealed = 'true';

  window.setTimeout(() => {
    heroTitle.querySelectorAll('.word').forEach((word, index) => {
      window.setTimeout(() => {
        word.classList.add('word-visible');
      }, index * 120);
    });

    window.setTimeout(() => {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      heroTitle.appendChild(cursor);
    }, words.length * 120 + 600);
  }, 80);
};

const initActiveNav = () => {
  const links = document.querySelectorAll('.nav-links a, .mobile-links a');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (!links.length || !sections.length) return;

  const updateActiveLink = () => {
    let currentId = '';
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentId = section.id;
      }
    });

    links.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  };

  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
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
  if (!videos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.loop = true;
          video.muted = true;
          video.autoplay = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.2 }
  );

  videos.forEach((video) => {
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    observer.observe(video);
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

const initTimelineProgress = () => {
  const section = document.getElementById('experience');
  if (!section) return;
  const timelines = section.querySelectorAll('.timeline');
  if (!timelines.length) return;

  const updateProgress = () => {
    const rect = section.getBoundingClientRect();
    const totalDistance = section.offsetHeight + window.innerHeight;
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top + window.innerHeight * 0.15) / (totalDistance - window.innerHeight * 0.3)));
    timelines.forEach((timeline) => {
      timeline.style.setProperty('--line-progress', `${progress * 100}%`);
    });
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
};

const initRippleButtons = () => {
  const buttons = document.querySelectorAll('button[type="submit"]');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
};

const initImageFallbacks = () => {
  const imgs = document.querySelectorAll('img');
  if (!imgs.length) return;
  imgs.forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (/\.heic$/i.test(src)) {
      img.addEventListener('error', () => {
        const jpg = src.replace(/\.heic$/i, '.jpg');
        if (jpg !== src) {
          img.src = jpg;
        }
      }, { once: true });
    }
  });
};

window.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initNav();
  initSkills();
  initReveal();
  initHeroTitleReveal();
  initActiveNav();
  initPortfolioTabs();
  initProjectCarousel();
  initAutoplayVideos();
  initInlineYouTubeEmbeds();
  initTimelineProgress();
  initRippleButtons();
  initImageFallbacks();
});
