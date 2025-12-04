(function() {
  function initMobileNav() {
    var toggle = document.getElementById('mobileToggle');
    var wrapper = document.getElementById('mobileNavWrapper');
    var overlay = document.getElementById('mobileNavOverlay');
    var closeBtn = document.getElementById('mobileNavClose');
    var nav = document.getElementById('mobileNav');

    if (!toggle || !wrapper) return;

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      wrapper.classList.add('is-open');
      wrapper.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      wrapper.classList.remove('is-open');
      wrapper.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
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
      var touchTriggered = false;

      function wrapped(e) {
        // Avoid duplicate fire from touchend + click
        if (e.type === 'click' && touchTriggered) {
          touchTriggered = false;
          return;
        }
        if (e.type === 'touchend') {
          touchTriggered = true;
        }
        handler();
      }

      el.addEventListener('click', wrapped);
      el.addEventListener('touchend', wrapped, { passive: true });
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
