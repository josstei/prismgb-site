/**
 * Shared Canvas Animator
 * Manages a single RAF loop for all demo canvases with visibility/reduced-motion handling
 */

const renderers = new Set();

let animationId = null;
let startTime = 0;
let pausedByVisibility = typeof document !== 'undefined' ? document.hidden : false;
let pausedByPreference = false;

const hasWindow = typeof window !== 'undefined';
const prefersReducedMotion = hasWindow && 'matchMedia' in window
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;

if (prefersReducedMotion) {
  pausedByPreference = prefersReducedMotion.matches;
  prefersReducedMotion.addEventListener('change', (event) => {
    pausedByPreference = event.matches;
    refreshLoop();
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    pausedByVisibility = document.hidden;
    refreshLoop();
  });
}

function shouldRun() {
  return (
    renderers.size > 0 &&
    !pausedByVisibility &&
    !pausedByPreference &&
    typeof requestAnimationFrame !== 'undefined'
  );
}

function tick(timestamp) {
  if (!shouldRun()) {
    animationId = null;
    return;
  }

  if (!startTime) startTime = timestamp;
  const time = timestamp - startTime;

  renderers.forEach(({ ctx, canvas, render }) => {
    if (!canvas || !ctx) return;
    render(ctx, canvas.width, canvas.height, time);
  });

  animationId = requestAnimationFrame(tick);
}

function stopLoop() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function startLoop() {
  if (animationId === null && shouldRun()) {
    startTime = 0;
    animationId = requestAnimationFrame(tick);
  }
}

function refreshLoop() {
  if (shouldRun()) {
    startLoop();
  } else {
    stopLoop();
  }
}

/**
 * Register a renderer to the shared RAF loop
 * @param {CanvasRenderingContext2D | null} ctx
 * @param {HTMLCanvasElement | null} canvas
 * @param {(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => void} renderFn
 * @returns {() => void} cleanup function to remove the renderer
 */
export function registerRenderer(ctx, canvas, renderFn) {
  if (!ctx || !canvas) {
    return () => {};
  }

  const renderer = { ctx, canvas, render: renderFn };
  renderers.add(renderer);
  refreshLoop();

  return () => {
    renderers.delete(renderer);
    refreshLoop();
  };
}
