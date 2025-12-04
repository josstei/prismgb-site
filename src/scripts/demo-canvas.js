/**
 * Demo Canvas Drawing Utilities
 * Shared canvas rendering for the GetStarted demo
 */

const staticLayerCache = new Map();

// Colorful scene palette
export const SCENE_COLORS = {
  // Sky (darker, more muted)
  sky: '#4A6FA5',
  skyLight: '#5B7DB1',

  // Ground (darker grass)
  grass: '#2D5A3D',
  grassDark: '#1E3D2A',

  // Clouds (slightly muted)
  cloud: '#D8E2EC',
  cloudShadow: '#A8B8C8',

  // Gem colors (from gem.svg)
  gemPink: '#ef2b5a',
  gemOrange: '#f77350',
  gemYellow: '#fff155',
  gemGreen: '#89d662',
  gemCyan: '#4dd08b',
  gemBlue: '#53a0ed',
  gemPurple: '#6c39cd',

  // Sparkles
  sparkle: '#FFFFFF',
  sparkleGlow: '#FFE066',
};

/**
 * Draw a pixelated gem shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Center X position
 * @param {number} y - Center Y position
 * @param {number} px - Pixel size for the gem
 */
function drawGem(ctx, x, y, px) {
  const { gemPink, gemOrange, gemYellow, gemGreen, gemCyan, gemBlue, gemPurple } = SCENE_COLORS;

  // Round pixel size and center position to avoid sub-pixel gaps between adjacent pixels
  const p = Math.round(px);
  const cx = Math.round(x);
  const cy = Math.round(y);

  // Gem is drawn as a diamond shape with colored bands
  // Top point
  ctx.fillStyle = gemYellow;
  ctx.fillRect(cx - p, cy - p * 3, p, p);

  // Second row (3 pixels wide)
  ctx.fillStyle = gemOrange;
  ctx.fillRect(cx - p * 2, cy - p * 2, p, p);
  ctx.fillStyle = gemYellow;
  ctx.fillRect(cx - p, cy - p * 2, p, p);
  ctx.fillStyle = gemGreen;
  ctx.fillRect(cx, cy - p * 2, p, p);

  // Third row (5 pixels wide)
  ctx.fillStyle = gemPink;
  ctx.fillRect(cx - p * 3, cy - p, p, p);
  ctx.fillStyle = gemOrange;
  ctx.fillRect(cx - p * 2, cy - p, p, p);
  ctx.fillStyle = gemYellow;
  ctx.fillRect(cx - p, cy - p, p, p);
  ctx.fillStyle = gemGreen;
  ctx.fillRect(cx, cy - p, p, p);
  ctx.fillStyle = gemCyan;
  ctx.fillRect(cx + p, cy - p, p, p);

  // Center row (widest - 5 pixels)
  ctx.fillStyle = gemPink;
  ctx.fillRect(cx - p * 3, cy, p, p);
  ctx.fillStyle = gemOrange;
  ctx.fillRect(cx - p * 2, cy, p, p);
  ctx.fillStyle = gemYellow;
  ctx.fillRect(cx - p, cy, p, p);
  ctx.fillStyle = gemCyan;
  ctx.fillRect(cx, cy, p, p);
  ctx.fillStyle = gemBlue;
  ctx.fillRect(cx + p, cy, p, p);

  // Fifth row (3 pixels)
  ctx.fillStyle = gemPurple;
  ctx.fillRect(cx - p * 2, cy + p, p, p);
  ctx.fillStyle = gemBlue;
  ctx.fillRect(cx - p, cy + p, p, p);
  ctx.fillStyle = gemBlue;
  ctx.fillRect(cx, cy + p, p, p);

  // Bottom point
  ctx.fillStyle = gemPurple;
  ctx.fillRect(cx - p, cy + p * 2, p, p);
}

/**
 * Draw sparkle particles around a point
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} centerX - Center X of sparkle orbit
 * @param {number} centerY - Center Y of sparkle orbit
 * @param {number} time - Animation time
 * @param {number} unit - Base unit for sizing
 */
function drawSparkles(ctx, centerX, centerY, time, unit) {
  const { sparkle, sparkleGlow } = SCENE_COLORS;
  const sparkleCount = 5;
  const orbitRadius = unit * 12; // 12% of smallest dimension

  for (let i = 0; i < sparkleCount; i++) {
    // Each sparkle orbits at a different phase
    const phase = (i / sparkleCount) * Math.PI * 2;
    const angle = (time / 500) + phase;

    // Calculate position with slight vertical offset variation
    const sparkleX = centerX + Math.cos(angle) * orbitRadius;
    const sparkleY = centerY + Math.sin(angle) * orbitRadius * 0.6;

    // Twinkle effect - size and opacity vary with time
    const twinkle = Math.sin(time / 100 + i * 1.5);
    const size = Math.max(1, unit * (1 + twinkle * 0.5));

    // Only draw when visible (twinkle > -0.5)
    if (twinkle > -0.5) {
      const alpha = 0.5 + twinkle * 0.5;

      // Draw sparkle as a small cross/star
      ctx.globalAlpha = alpha;

      // Glow
      ctx.fillStyle = sparkleGlow;
      ctx.fillRect(sparkleX - size | 0, sparkleY - size * 0.5 | 0, size * 2 | 0, size | 0);
      ctx.fillRect(sparkleX - size * 0.5 | 0, sparkleY - size | 0, size | 0, size * 2 | 0);

      // Bright center
      ctx.fillStyle = sparkle;
      ctx.fillRect(sparkleX - size * 0.5 | 0, sparkleY - size * 0.5 | 0, size | 0, size | 0);

      ctx.globalAlpha = 1;
    }
  }
}

function drawClouds(ctx, width, height, time, unit) {
  const { cloud, cloudShadow } = SCENE_COLORS;
  const px = Math.max(1, unit * 2); // Pixel size for clouds

  for (let i = 0; i < 3; i++) {
    const cloudSpeed = width / 5000;
    const cloudX = ((time * cloudSpeed + i * width * 0.5) % (width + width * 0.3)) - width * 0.15 | 0;
    const cloudY = (height * (0.08 + i * 0.10)) | 0;

    ctx.fillStyle = cloudShadow;
    ctx.fillRect(cloudX + px + 1 | 0, cloudY + px * 2 + 1 | 0, px * 10 | 0, px | 0);
    ctx.fillRect(cloudX + 1 | 0, cloudY + px + 1 | 0, px * 12 | 0, px | 0);
    ctx.fillRect(cloudX + px * 2 + 1 | 0, cloudY + 1 | 0, px * 8 | 0, px | 0);

    ctx.fillStyle = cloud;
    ctx.fillRect(cloudX + px | 0, cloudY + px * 2 | 0, px * 10 | 0, px | 0);
    ctx.fillRect(cloudX | 0, cloudY + px | 0, px * 12 | 0, px | 0);
    ctx.fillRect(cloudX + px * 2 | 0, cloudY | 0, px * 8 | 0, px | 0);
  }
}

function drawStaticScene(ctx, width, height) {
  const { sky, grass, grassDark } = SCENE_COLORS;
  const unit = Math.min(width, height) / 100;

  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = grass;
  ctx.fillRect(0, height * 0.75 | 0, width, height * 0.25 | 0);

  ctx.fillStyle = grassDark;
  const stripeHeight = Math.max(1, unit * 2);
  ctx.fillRect(0, height * 0.75 | 0, width, stripeHeight | 0);

  ctx.fillStyle = grassDark;
  const bladeSpacing = Math.max(3, unit * 4);
  const bladeWidth = Math.max(1, unit);
  for (let i = 0; i < width / bladeSpacing; i++) {
    const bladeX = i * bladeSpacing + (i % 2) * (bladeSpacing / 2);
    const bladeHeight = Math.max(1, unit * (1.5 + (i % 3) * 0.5));
    ctx.fillRect(bladeX | 0, (height * 0.75 - bladeHeight) | 0, bladeWidth | 0, bladeHeight | 0);
  }
}

function getStaticLayer(width, height) {
  if (!width || !height) return null;

  const key = `${width}x${height}`;
  const cached = staticLayerCache.get(key);
  if (cached) return cached;

  if (typeof document === 'undefined') return null;

  const layer = typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(width, height)
    : document.createElement('canvas');

  layer.width = width;
  layer.height = height;

  const layerCtx = layer.getContext('2d');
  if (!layerCtx) return null;

  drawStaticScene(layerCtx, width, height);
  staticLayerCache.set(key, layer);
  return layer;
}

/**
 * Draw a game frame on a canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} time - Animation time
 * @param {{ showLabel?: boolean }} options - Render options
 */
export function drawGameFrame(ctx, width, height, time, options = {}) {
  const { showLabel = false } = options;
  const unit = Math.min(width, height) / 100;

  const staticLayer = getStaticLayer(width, height);
  if (staticLayer) {
    ctx.drawImage(staticLayer, 0, 0, width, height);
  } else {
    drawStaticScene(ctx, width, height);
  }

  drawClouds(ctx, width, height, time, unit);

  // Floating gem with bob animation - centered, 38% from top
  const gemX = width / 2;
  const bobAmount = height * 0.04; // 4% of height
  const gemY = height * 0.38 + Math.sin(time / 300) * bobAmount;
  const gemSize = Math.max(1, unit * 3); // Gem pixel size based on canvas

  // Draw sparkles behind gem
  drawSparkles(ctx, gemX, gemY, time, unit);

  // Draw the gem
  drawGem(ctx, gemX, gemY, gemSize);

  // PrismGB label (for main canvas only)
  if (showLabel) {
    ctx.fillStyle = SCENE_COLORS.grassDark;
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.max(8, unit * 7)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('PrismGB', width / 2, height * 0.94);
  }
}
