document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile Menu Toggle ──────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function (e) {
      e.preventDefault();
      const isOpen = navMenu.classList.toggle('nav-menu--open');
      hamburger.classList.toggle('hamburger--active');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('nav-menu--open');
        hamburger.classList.remove('hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('nav-menu--open')) {
        navMenu.classList.remove('nav-menu--open');
        hamburger.classList.remove('hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('nav-menu--open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navMenu.classList.remove('nav-menu--open');
        hamburger.classList.remove('hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Contact Form Validation ─────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const formStatus = document.getElementById('form-status');

    function showError(input, message) {
      const errorEl = input.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('form-error--visible');
      }
      input.classList.add('form-input--error');
    }

    function clearError(input) {
      const errorEl = input.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('form-error--visible');
      }
      input.classList.remove('form-input--error');
    }

    function validateName(value) {
      if (!value || value.trim().length < 2) {
        return 'Please enter your name (at least 2 characters).';
      }
      return '';
    }

    function validateEmail(value) {
      if (!value || !value.trim()) {
        return 'Please enter your email address.';
      }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value.trim())) {
        return 'Please enter a valid email address.';
      }
      return '';
    }

    function validateMessage(value) {
      if (!value || value.trim().length < 10) {
        return 'Please enter a message (at least 10 characters).';
      }
      return '';
    }

    function validateField(input, validator) {
      var error = validator(input.value);
      if (error) {
        showError(input, error);
        return false;
      }
      clearError(input);
      return true;
    }

    nameInput.addEventListener('blur', function () {
      validateField(nameInput, validateName);
    });

    emailInput.addEventListener('blur', function () {
      validateField(emailInput, validateEmail);
    });

    messageInput.addEventListener('blur', function () {
      validateField(messageInput, validateMessage);
    });

    nameInput.addEventListener('input', function () {
      if (nameInput.classList.contains('form-input--error')) {
        validateField(nameInput, validateName);
      }
    });

    emailInput.addEventListener('input', function () {
      if (emailInput.classList.contains('form-input--error')) {
        validateField(emailInput, validateEmail);
      }
    });

    messageInput.addEventListener('input', function () {
      if (messageInput.classList.contains('form-input--error')) {
        validateField(messageInput, validateMessage);
      }
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameValid = validateField(nameInput, validateName);
      var emailValid = validateField(emailInput, validateEmail);
      var messageValid = validateField(messageInput, validateMessage);

      if (nameValid && emailValid && messageValid) {
        var submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        setTimeout(function () {
          if (formStatus) {
            formStatus.textContent = 'Thank you! Your message has been sent. We\'ll get back to you soon.';
            formStatus.classList.add('form-status--success');
            formStatus.classList.remove('form-status--error');
          }
          contactForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
          setTimeout(function () {
            if (formStatus) {
              formStatus.textContent = '';
              formStatus.classList.remove('form-status--success');
            }
          }, 6000);
        }, 1200);
      } else {
        if (formStatus) {
          formStatus.textContent = 'Please fix the errors above and try again.';
          formStatus.classList.add('form-status--error');
          formStatus.classList.remove('form-status--success');
        }
        var firstError = contactForm.querySelector('.form-input--error');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }

  // ── Lazy Loading Images via IntersectionObserver ────────────────────
  var lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length > 0) {
    if ('IntersectionObserver' in window) {
      var imageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            var src = img.getAttribute('data-src');
            var srcset = img.getAttribute('data-srcset');
            var sizes = img.getAttribute('data-sizes');

            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            if (srcset) {
              img.srcset = srcset;
              img.removeAttribute('data-srcset');
            }
            if (sizes) {
              img.sizes = sizes;
              img.removeAttribute('data-sizes');
            }

            img.addEventListener('load', function () {
              img.classList.add('lazy-loaded');
            });

            img.addEventListener('error', function () {
              img.classList.add('lazy-error');
            });

            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.01
      });

      lazyImages.forEach(function (img) {
        imageObserver.observe(img);
      });
    } else {
      lazyImages.forEach(function (img) {
        var src = img.getAttribute('data-src');
        var srcset = img.getAttribute('data-srcset');
        var sizes = img.getAttribute('data-sizes');
        if (src) { img.src = src; }
        if (srcset) { img.srcset = srcset; }
        if (sizes) { img.sizes = sizes; }
        img.classList.add('lazy-loaded');
      });
    }
  }

  // ── Smooth Scroll for Anchor Links ──────────────────────────────────
  var smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ── Header Scroll Effect ────────────────────────────────────────────
  var header = document.querySelector('.header');
  if (header) {
    var scrollThreshold = 50;
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > scrollThreshold) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ── Product Card Hover Effect (touch devices) ───────────────────────
  var productCards = document.querySelectorAll('.product-card');
  productCards.forEach(function (card) {
    card.addEventListener('touchstart', function () {
      card.classList.add('product-card--active');
    }, { passive: true });

    card.addEventListener('touchend', function () {
      setTimeout(function () {
        card.classList.remove('product-card--active');
      }, 300);
    }, { passive: true });
  });

});
