(function() {
  function initMobileNav() {
    var toggle = document.getElementById('mobileToggle');
    var wrapper = document.getElementById('mobileNavWrapper');
    var overlay = document.getElementById('mobileNavOverlay');
    var closeBtn = document.getElementById('mobileNavClose');
    var nav = document.getElementById('mobileNav');

    if (!toggle || !wrapper) return;

    function setKofiVisible(visible) {
      var kofi = document.querySelector('.floatingchat-container-wrap, .floatingchat-container-wrap-mo498, .floatingchat-container');
      if (kofi) kofi.style.display = visible ? '' : 'none';
    }

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      wrapper.classList.add('is-open');
      wrapper.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setKofiVisible(false);
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      wrapper.classList.remove('is-open');
      wrapper.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setKofiVisible(true);
      toggle.focus();
    }

    function handleToggle() {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function handleClose() {
      closeMenu();
    }

    function addPressListener(el, handler) {
      if (!el) return;
      var touchHandled = false;

      el.addEventListener('touchstart', function(e) {
        // Mark that touch started - we'll handle this interaction via touch
        touchHandled = true;
      }, { passive: true });

      el.addEventListener('touchend', function(e) {
        if (touchHandled) {
          // Prevent the subsequent click event from firing
          e.preventDefault();
          touchHandled = false;
          handler();
        }
      }, { passive: false });

      el.addEventListener('click', function(e) {
        // Only handle click if it wasn't already handled by touch
        if (!touchHandled) {
          handler();
        }
        touchHandled = false;
      });
    }

    addPressListener(toggle, handleToggle);
    addPressListener(closeBtn, handleClose);
    addPressListener(overlay, handleClose);

    if (nav) {
      nav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && wrapper.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
