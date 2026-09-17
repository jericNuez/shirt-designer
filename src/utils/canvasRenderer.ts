import { DesignLayer, ImageLayer, TextLayer, ShapeLayer, BadgeLayer } from '../types/editor';

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
  const charWidths = chars.map(c => ctx.measureText(c).width + letterSpacing);
  const totalWidth = charWidths.reduce((a, b) => a + b, 0);
  
  const arcLength = totalWidth / Math.abs(radius);
  let currentAngle = -arcLength / 2;
  
  if (radius < 0) {
    currentAngle = Math.PI - currentAngle;
  }

  for (let i = 0; i < len; i++) {
    const char = chars[i];
    const charW = charWidths[i];
    const halfCharAngle = (charW / 2) / Math.abs(radius);
    
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

// Cache loaded images
const imageCache = new Map<string, HTMLImageElement>();

export function preloadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
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
 * Renders an array of layers onto a canvas context
 */
export async function renderLayersToCanvas(
  ctx: CanvasRenderingContext2D,
  layers: DesignLayer[],
  width: number,
  height: number
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
          drawCurvedText(ctx, textLayer.text, 0, 0, radius, baseFontSize, textLayer.letterSpacing, true);
        }
        ctx.fillStyle = textLayer.fillColor;
        drawCurvedText(ctx, textLayer.text, 0, 0, radius, baseFontSize, textLayer.letterSpacing, false);
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
      try {
        const img = await preloadImage(imgLayer.src);
        const baseSize = 350 * (width / 800);
        const w = baseSize;
        const h = baseSize / (imgLayer.aspectRatio || 1);

        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      } catch (err) {
        console.warn('Failed to render image layer:', err);
      }
    } else if (layer.type === 'shape') {
      const shapeLayer = layer as ShapeLayer;
      const baseSize = 250 * (width / 800);
      drawShape(ctx, shapeLayer, baseSize);
    }

    ctx.restore();
  }
}
