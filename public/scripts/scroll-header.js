(function () {
  'use strict';

  var header = document.querySelector('.header');
  if (!header) return;

  var SCROLL_THRESHOLD = 60;
  var VELOCITY_THRESHOLD = 5;
  var COMPACT_THRESHOLD = 100;

  var lastScrollY = 0;
  var ticking = false;
  var isHidden = false;
  var isCompact = false;
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  var mobileNavWrapper = document.getElementById('mobileNavWrapper');

  function isNavOpen() {
    return mobileNavWrapper && mobileNavWrapper.classList.contains('is-open');
  }

  function updateHeader() {
    var scrollY = window.scrollY;
    var delta = scrollY - lastScrollY;

    if (scrollY < 10) {
      header.classList.remove('is-hidden', 'is-compact');
      header.classList.add('is-at-top');
      isHidden = false;
      isCompact = false;
      lastScrollY = scrollY;
      ticking = false;
      return;
    }

    header.classList.remove('is-at-top');

    if (scrollY > COMPACT_THRESHOLD && !isCompact) {
      header.classList.add('is-compact');
      isCompact = true;
    } else if (scrollY <= COMPACT_THRESHOLD && isCompact) {
      header.classList.remove('is-compact');
      isCompact = false;
    }

    if (Math.abs(delta) < VELOCITY_THRESHOLD) {
      ticking = false;
      return;
    }

    if (scrollY > SCROLL_THRESHOLD) {
      if (delta > 0 && !isHidden) {
        header.classList.add('is-hidden');
        isHidden = true;
      } else if (delta < 0 && isHidden) {
        header.classList.remove('is-hidden');
        isHidden = false;
      }
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  function onScroll() {
    if (isNavOpen()) return;
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  if (!prefersReducedMotion) {
    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeader();
  }

  window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', function (e) {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        header.classList.remove('is-hidden', 'is-compact');
        window.removeEventListener('scroll', onScroll);
      } else {
        window.addEventListener('scroll', onScroll, { passive: true });
        updateHeader();
      }
    });
})();
