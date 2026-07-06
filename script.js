/* ============================================================
   MUSIC CITY WARDROBE — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav: transparent → dark on scroll ───────────────────── */
  const nav = document.getElementById('main-nav');

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run once on load


  /* ── Nav: hamburger toggle ────────────────────────────────── */
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  function closeMobileMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = this.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMobileMenu();
    } else {
      this.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      this.classList.add('open');
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close on mobile link click
  document.querySelectorAll('.nav-mobile__link').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });


  /* ── Nav: active link via IntersectionObserver ────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  const activeLinkObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) { link.classList.remove('active'); });
        var activeLink = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px' });

  sections.forEach(function (section) {
    activeLinkObserver.observe(section);
  });


  /* ── Hero: parallax background ───────────────────────────── */
  var heroBg = document.querySelector('.hero__bg');

  function updateParallax() {
    var scrolled = window.scrollY;
    // Only apply while hero is plausibly visible
    if (scrolled < window.innerHeight * 1.4) {
      heroBg.style.transform = 'translateY(' + (scrolled * 0.38) + 'px)';
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });


  /* ── Scroll reveal via IntersectionObserver ──────────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el    = entry.target;
        var index = parseInt(el.getAttribute('data-index') || '0', 10);
        el.style.transitionDelay = (index * 0.11) + 's';
        el.classList.add('visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ── Contact form: validation + Formspree submission ─────── */
  var form = document.getElementById('booking-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      var inputs = form.querySelectorAll('[required]');
      var valid  = true;

      inputs.forEach(function (field) {
        field.classList.remove('form-input--error');
        if (!field.value.trim()) {
          field.classList.add('form-input--error');
          valid = false;
        }
      });

      if (!valid) {
        var firstError = form.querySelector('.form-input--error');
        if (firstError) firstError.focus();
        return;
      }

      // Disable submit while sending
      var submitBtn  = form.querySelector('.form-submit');
      var origText   = submitBtn.textContent;
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';

      // Build FormData
      var data = new FormData(form);

      // Formspree endpoint — replace YOUR_FORM_ID with your actual Formspree form ID
      fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          showSuccess();
        } else {
          return response.json().then(function (json) {
            throw new Error(json.error || 'Submission failed');
          });
        }
      })
      .catch(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = origText;
        showNetworkError();
      });
    });
  }

  function showSuccess() {
    var formGrid = document.querySelector('.contact__form');
    formGrid.innerHTML =
      '<div class="form-success">' +
        '<p class="form-success__title">Thank you.</p>' +
        '<p class="form-success__body">We\'ll be in touch within 24 hours.</p>' +
      '</div>';
  }

  function showNetworkError() {
    var existing = form.querySelector('.form-error-msg');
    if (existing) return;
    var msg = document.createElement('p');
    msg.className   = 'form-error-msg form-disclaimer';
    msg.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-gold').trim() || '#C9A96E';
    msg.textContent = 'Something went wrong. Please email us directly at bookings@musiccitywardrobe.com';
    form.appendChild(msg);
  }


  /* ── Theme switcher ──────────────────────────────────────── */
  var THEME_KEY = 'mcw-theme';
  var themeButtons = document.querySelectorAll('.theme-btn');

  function applyTheme(name) {
    document.documentElement.setAttribute('data-theme', name);
    themeButtons.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-theme-set') === name);
    });
    try { localStorage.setItem(THEME_KEY, name); } catch (e) {}
  }

  var savedTheme = 'gold';
  try { savedTheme = localStorage.getItem(THEME_KEY) || 'gold'; } catch (e) {}
  applyTheme(savedTheme);

  themeButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      applyTheme(b.getAttribute('data-theme-set'));
    });
  });


  /* ── Footer: dynamic year ────────────────────────────────── */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
