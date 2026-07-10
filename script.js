/**
 * Vehicle Valuation System — Presentation Scripts
 * Vanilla JavaScript — no frameworks or libraries
 */

(function () {
  'use strict';

  /* ==========================================================================
     DOM References
     ========================================================================== */
  const html = document.documentElement;
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const themeToggle = document.getElementById('themeToggle');
  const scrollProgress = document.getElementById('scrollProgress');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('.counter');
  const rippleButtons = document.querySelectorAll('.ripple-btn');
  const imagePlaceholders = document.querySelectorAll('.image-placeholder');

  /* ==========================================================================
     Theme Management
     ========================================================================== */
  const THEME_KEY = 'vvs-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return 'dark';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    setTheme(getPreferredTheme());
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ==========================================================================
     Navbar — Scroll Behavior & Active Links
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    let currentSection = 'home';

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  function closeMobileNav() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function initNavbar() {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    allNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileNav();
      });
    });

    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  /* ==========================================================================
     Smooth Scroll
     ========================================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const offset = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ==========================================================================
     Scroll Progress Bar
     ========================================================================== */
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  /* ==========================================================================
     Intersection Observer — Reveal Animations
     ========================================================================== */
  function initRevealAnimations() {
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================================================
     Counter Animation
     ========================================================================== */
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    if (!('IntersectionObserver' in window)) return;

    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ==========================================================================
     Typing Effect
     ========================================================================== */
  function initTypingEffect() {
    const typingEl = document.querySelector('.typing-text');
    if (!typingEl) return;

    const fullText = typingEl.getAttribute('data-text') || typingEl.textContent;
    let index = 0;
    typingEl.textContent = '';

    function type() {
      if (index < fullText.length) {
        typingEl.textContent += fullText.charAt(index);
        index++;
        setTimeout(type, 60 + Math.random() * 40);
      }
    }

    setTimeout(type, 800);
  }

  /* ==========================================================================
     Button Ripple Effect
     ========================================================================== */
  function initRippleEffect() {
    rippleButtons.forEach(function (button) {
      button.addEventListener('click', function (e) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        button.appendChild(ripple);

        ripple.addEventListener('animationend', function () {
          ripple.remove();
        });
      });
    });
  }

  /* ==========================================================================
     Image Placeholder — Error Detection & Fallback
     ========================================================================== */
  function createPlaceholderFallback(container) {
    const label = container.getAttribute('data-label') || 'Image';
    const src = container.getAttribute('data-src') || '';

    container.classList.add('is-placeholder');

    const fallback = document.createElement('div');
    fallback.classList.add('placeholder-fallback');
    fallback.innerHTML =
      '<div class="placeholder-fallback__icon" aria-hidden="true">🖼</div>' +
      '<span class="placeholder-fallback__label">' + label + '</span>' +
      '<span class="placeholder-fallback__path">' + src + '</span>';

    const shimmer = document.createElement('div');
    shimmer.classList.add('placeholder-shimmer');
    shimmer.setAttribute('aria-hidden', 'true');

    container.appendChild(shimmer);
    container.appendChild(fallback);
  }

  function initImagePlaceholders() {
    imagePlaceholders.forEach(function (container) {
      const img = container.querySelector('.placeholder-img');
      if (!img) {
        createPlaceholderFallback(container);
        return;
      }

      img.style.opacity = '0';

      function showPlaceholder() {
        img.style.display = 'none';
        if (!container.classList.contains('is-placeholder')) {
          createPlaceholderFallback(container);
        }
      }

      img.addEventListener('load', function () {
        if (img.naturalWidth > 0) {
          img.style.opacity = '1';
          img.style.transition = 'opacity 0.5s ease';
        } else {
          showPlaceholder();
        }
      });

      img.addEventListener('error', showPlaceholder);

      if (img.complete) {
        if (img.naturalWidth > 0) {
          img.style.opacity = '1';
        } else {
          showPlaceholder();
        }
      }
    });
  }

  /* ==========================================================================
     Parallax Effect — Hero Blobs
     ========================================================================== */
  function initParallax() {
    const blobs = document.querySelectorAll('.hero__blob');
    if (!blobs.length) return;

    let ticking = false;

    window.addEventListener('mousemove', function (e) {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        blobs.forEach(function (blob, i) {
          const speed = (i + 1) * 15;
          blob.style.transform =
            'translate(' + (x * speed) + 'px, ' + (y * speed) + 'px)';
        });

        ticking = false;
      });
    });
  }

  /* ==========================================================================
     Scroll Handler — Combined
     ========================================================================== */
  let scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        handleNavbarScroll();
        updateActiveNavLink();
        updateScrollProgress();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  /* ==========================================================================
     Initialize
     ========================================================================== */
  function init() {
    initTheme();
    initNavbar();
    initSmoothScroll();
    initRevealAnimations();
    initCounters();
    initTypingEffect();
    initRippleEffect();
    initImagePlaceholders();
    initParallax();

    themeToggle.addEventListener('click', toggleTheme);
    window.addEventListener('scroll', onScroll, { passive: true });

    handleNavbarScroll();
    updateActiveNavLink();
    updateScrollProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
