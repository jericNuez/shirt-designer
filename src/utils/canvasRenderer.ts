import { DesignLayer, ImageLayer, TextLayer, ShapeLayer } from '../types/editor';

/**
 * Draws curved text along an arc on a 2D canvas context
 */
function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  fontSize: number,
  letterSpacing: number,
  isStroke: boolean
) {
  ctx.save();

  // Calculate total angle based on characters
  const len = text.length;
  const chars = text.split('');

  // Measure character widths
  const charWidths = chars.map((c) => ctx.measureText(c).width + letterSpacing);
  const totalWidth = charWidths.reduce((a, b) => a + b, 0);

  const arcLength = totalWidth / Math.abs(radius);
  let currentAngle = -arcLength / 2;

  if (radius < 0) {
    currentAngle = Math.PI - currentAngle;
  }

  for (let i = 0; i < len; i++) {
    const char = chars[i];
    const charW = charWidths[i];
    const halfCharAngle = charW / 2 / Math.abs(radius);

    currentAngle += halfCharAngle * (radius > 0 ? 1 : -1);

    ctx.save();

    if (radius > 0) {
      // Arched up
      const x = centerX + Math.sin(currentAngle) * radius;
      const y = centerY + radius - Math.cos(currentAngle) * radius;
      ctx.translate(x, y);
      ctx.rotate(currentAngle);
    } else {
      // Arched down
      const r = Math.abs(radius);
      const x = centerX + Math.sin(currentAngle) * r;
      const y = centerY - r + Math.cos(currentAngle) * r;
      ctx.translate(x, y);
      ctx.rotate(currentAngle + Math.PI);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isStroke) {
      ctx.strokeText(char, 0, 0);
    } else {
      ctx.fillText(char, 0, 0);
    }

    ctx.restore();
    currentAngle += halfCharAngle * (radius > 0 ? 1 : -1);
  }

  ctx.restore();
}

/**
 * Draws a geometric shape on canvas
 */
function drawShape(ctx: CanvasRenderingContext2D, shape: ShapeLayer, size: number) {
  const half = size / 2;
  ctx.beginPath();

  switch (shape.shapeType) {
    case 'circle':
      ctx.arc(0, 0, half, 0, Math.PI * 2);
      break;

    case 'square':
      ctx.rect(-half, -half, size, size);
      break;

    case 'star': {
      const spikes = 5;
      const outerRadius = half;
      const innerRadius = half * 0.45;
      let rot = (Math.PI / 2) * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
      break;
    }

    case 'heart': {
      const w = size;
      const h = size;
      ctx.moveTo(0, h * 0.35);
      ctx.bezierCurveTo(w * 0.5, -h * 0.2, w * 0.7, h * 0.25, 0, h * 0.5);
      ctx.bezierCurveTo(-w * 0.7, h * 0.25, -w * 0.5, -h * 0.2, 0, h * 0.35);
      break;
    }

    case 'shield': {
      ctx.moveTo(0, -half);
      ctx.lineTo(half, -half * 0.6);
      ctx.quadraticCurveTo(half, half * 0.4, 0, half);
      ctx.quadraticCurveTo(-half, half * 0.4, -half, -half * 0.6);
      ctx.closePath();
      break;
    }

    case 'polygon': {
      const sides = 6;
      for (let i = 0; i < sides; i++) {
        const a = (i * 2 * Math.PI) / sides;
        const x = half * Math.cos(a);
        const y = half * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    }

    case 'banner': {
      ctx.moveTo(-half, -half * 0.4);
      ctx.lineTo(half, -half * 0.4);
      ctx.lineTo(half * 0.8, 0);
      ctx.lineTo(half, half * 0.4);
      ctx.lineTo(-half, half * 0.4);
      ctx.lineTo(-half * 0.8, 0);
      ctx.closePath();
      break;
    }

    default:
      ctx.arc(0, 0, half, 0, Math.PI * 2);
  }

  if (shape.fillColor) {
    ctx.fillStyle = shape.fillColor;
    ctx.fill();
  }
  if (shape.strokeColor && shape.strokeWidth > 0) {
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = shape.strokeWidth;
    ctx.stroke();
  }
}

let measurementCanvas: HTMLCanvasElement | null = null;
let measurementCtx: CanvasRenderingContext2D | null = null;

/**
 * Accurately measures text dimensions for bounding box calculations
 */
export function measureTextLayer(
  textLayer: TextLayer,
  canvasWidth: number = 800
): { width: number; height: number } {
  if (typeof document === 'undefined') {
    return { width: 120, height: 40 };
  }
  if (!measurementCanvas) {
    measurementCanvas = document.createElement('canvas');
    measurementCtx = measurementCanvas.getContext('2d');
  }
  if (!measurementCtx) {
    return { width: 120, height: 40 };
  }

  const baseFontSize = textLayer.fontSize * (canvasWidth / 800);
  measurementCtx.font = `${textLayer.fontStyle} ${textLayer.fontWeight} ${baseFontSize}px "${textLayer.fontFamily}", sans-serif`;

  const lines = (textLayer.text || '').split('\n');
  let maxWidth = 0;
  for (const line of lines) {
    const metrics = measurementCtx.measureText(line);
    const extraSpacing = (line.length - 1) * (textLayer.letterSpacing || 0);
    const w = metrics.width + extraSpacing;
    if (w > maxWidth) maxWidth = w;
  }
  const lineHeight = baseFontSize * (textLayer.lineHeight || 1.2);
  const totalHeight = lines.length * lineHeight;

  if (textLayer.curved && Math.abs(textLayer.curveRadius) > 10) {
    const arcHeight = Math.min(Math.abs(textLayer.curveRadius) * 0.45, maxWidth * 0.35);
    return {
      width: Math.max(maxWidth + 20, 50),
      height: Math.max(totalHeight + arcHeight + 16, 40),
    };
  }

  return {
    width: Math.max(maxWidth + 16, 50),
    height: Math.max(totalHeight + 12, 36),
  };
}

// Cache loaded images
const imageCache = new Map<string, HTMLImageElement>();

export function getCachedImage(src: string): HTMLImageElement | null {
  const img = imageCache.get(src);
  if (img && img.complete && img.naturalWidth > 0) {
    return img;
  }
  return null;
}

export function preloadImage(src: string): Promise<HTMLImageElement> {
  const cached = getCachedImage(src);
  if (cached) {
    return Promise.resolve(cached);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Synchronously renders an array of layers onto a canvas context (instantaneous 60/120fps redraw)
 */
export function renderLayersToCanvasSync(
  ctx: CanvasRenderingContext2D,
  layers: DesignLayer[],
  width: number,
  height: number,
  onImageLoaded?: () => void
) {
  ctx.clearRect(0, 0, width, height);

  for (const layer of layers) {
    if (!layer.visible) continue;

    ctx.save();

    // Position layer
    const posX = layer.x * width;
    const posY = layer.y * height;

    ctx.translate(posX, posY);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.scale(layer.flipX ? -layer.scale : layer.scale, layer.flipY ? -layer.scale : layer.scale);
    ctx.globalAlpha = layer.opacity;

    if (layer.blendMode) {
      ctx.globalCompositeOperation = layer.blendMode;
    }

    if (layer.type === 'text') {
      const textLayer = layer as TextLayer;
      const baseFontSize = textLayer.fontSize * (width / 800);
      ctx.font = `${textLayer.fontStyle} ${textLayer.fontWeight} ${baseFontSize}px "${textLayer.fontFamily}", sans-serif`;

      // Shadow
      if (textLayer.shadowColor && textLayer.shadowBlur > 0) {
        ctx.shadowColor = textLayer.shadowColor;
        ctx.shadowBlur = textLayer.shadowBlur * (width / 800);
        ctx.shadowOffsetX = textLayer.shadowOffsetX * (width / 800);
        ctx.shadowOffsetY = textLayer.shadowOffsetY * (width / 800);
      }

      if (textLayer.curved && Math.abs(textLayer.curveRadius) > 10) {
        const radius = textLayer.curveRadius * (width / 800);
        if (textLayer.strokeColor && textLayer.strokeWidth > 0) {
          ctx.strokeStyle = textLayer.strokeColor;
          ctx.lineWidth = textLayer.strokeWidth * (width / 800);
          drawCurvedText(
            ctx,
            textLayer.text,
            0,
            0,
            radius,
            baseFontSize,
            textLayer.letterSpacing,
            true
          );
        }
        ctx.fillStyle = textLayer.fillColor;
        drawCurvedText(
          ctx,
          textLayer.text,
          0,
          0,
          radius,
          baseFontSize,
          textLayer.letterSpacing,
          false
        );
      } else {
        ctx.textAlign = textLayer.textAlign || 'center';
        ctx.textBaseline = 'middle';

        const lines = textLayer.text.split('\n');
        const lineHeight = baseFontSize * (textLayer.lineHeight || 1.2);
        const startY = -((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight;
          if (textLayer.strokeColor && textLayer.strokeWidth > 0) {
            ctx.strokeStyle = textLayer.strokeColor;
            ctx.lineWidth = textLayer.strokeWidth * (width / 800);
            ctx.strokeText(line, 0, y);
          }
          ctx.fillStyle = textLayer.fillColor;
          ctx.fillText(line, 0, y);
        });
      }
    } else if (layer.type === 'image') {
      const imgLayer = layer as ImageLayer;
      const img = getCachedImage(imgLayer.src);
      const baseSize = 350 * (width / 800);
      const w = baseSize;
      const h = baseSize / (imgLayer.aspectRatio || 1);

      if (img) {
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      } else {
        // Preload in background and trigger redraw on arrival
        preloadImage(imgLayer.src)
          .then(() => {
            if (onImageLoaded) onImageLoaded();
          })
          .catch((err) => console.warn('Failed to load layer image:', err));
      }
    } else if (layer.type === 'shape') {
      const shapeLayer = layer as ShapeLayer;
      const baseSize = 250 * (width / 800);
      drawShape(ctx, shapeLayer, baseSize);
    }

    ctx.restore();
  }
}

/**
 * Renders an array of layers onto a canvas context (async wrapper)
 */
export async function renderLayersToCanvas(
  ctx: CanvasRenderingContext2D,
  layers: DesignLayer[],
  width: number,
  height: number
) {
  // Preload any uncached images first
  const imagePromises = layers
    .filter((l) => l.visible && l.type === 'image')
    .map((l) => preloadImage((l as ImageLayer).src).catch(() => null));

  await Promise.all(imagePromises);
  renderLayersToCanvasSync(ctx, layers, width, height);
}
