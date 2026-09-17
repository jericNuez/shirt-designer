import { DesignLayer } from '../types/editor';
import { ShirtColorConfig, DesignZone } from '../types/shirt';
import { renderLayersToCanvas } from './canvasRenderer';
import { exportToPSD } from './psdExporter';
import { ExportOptions } from '../types/export';

/**
 * Triggers a browser download for a Blob or Data URL
 */
export function downloadFile(data: Blob | string, filename: string) {
  const link = document.createElement('a');
  if (typeof data === 'string') {
    link.href = data;
  } else {
    link.href = URL.createObjectURL(data);
  }
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (typeof data !== 'string') {
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
}

/**
 * Captures the WebGL 3D canvas snapshot
 */
export async function capture3DMockup(
  canvas: HTMLCanvasElement,
  options: ExportOptions
): Promise<Blob | string> {
  const { format, background } = options;

  if (format === 'psd') {
    // For 3D PSD, embed the rendered WebGL snapshot into a PSD document
    const { writePsd } = await import('ag-psd');
    const width = canvas.width;
    const height = canvas.height;
    
    const psd = {
      width,
      height,
      channels: 4,
      bitsPerChannel: 8,
      colorMode: 3,
      children: [
        {
          name: '3D Mockup Render',
          canvas: canvas,
          opacity: 1,
          visible: true,
        },
      ],
      canvas: canvas,
    };
    const buffer = writePsd(psd as any);
    return new Blob([buffer], { type: 'image/vnd.adobe.photoshop' });
  }

  // Handle PNG / JPEG
  if (background === 'transparent' && (format === 'png')) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
  }

  // For solid background or JPEG
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const ctx = tempCanvas.getContext('2d')!;

  if (background === 'white') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  } else if (background === 'black') {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  } else if (background === 'gradient') {
    const grad = ctx.createRadialGradient(
      tempCanvas.width / 2,
      tempCanvas.height / 2,
      50,
      tempCanvas.width / 2,
      tempCanvas.height / 2,
      tempCanvas.width / 1.2
    );
    grad.addColorStop(0, '#334155');
    grad.addColorStop(1, '#090D16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  } else if (background === 'studio') {
    const grad = ctx.createLinearGradient(0, 0, 0, tempCanvas.height);
    grad.addColorStop(0, '#1E293B');
    grad.addColorStop(1, '#0B0F19');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  }

  ctx.drawImage(canvas, 0, 0);

  const mime = (format === 'jpg' || format === 'jpeg') ? 'image/jpeg' : 'image/png';
  return new Promise((resolve) => {
    tempCanvas.toBlob((blob) => resolve(blob!), mime, 0.95);
  });
}

/**
 * Generates high-DPI Print Ready flat artwork for production
 */
export async function generatePrintArtwork(
  layers: DesignLayer[],
  colors: ShirtColorConfig,
  zone: DesignZone,
  options: ExportOptions
): Promise<Blob | string> {
  const size = options.resolution === 'print_300dpi' ? 3000 : 2000;
  
  if (options.format === 'psd') {
    return await exportToPSD(layers, colors, zone, size, size);
  }

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const zoneLayers = layers.filter((l) => l.zone === zone && l.visible);

  // If background is not transparent, fill shirt base color
  if (options.background !== 'transparent') {
    ctx.fillStyle = colors.body;
    ctx.fillRect(0, 0, size, size);
  }

  await renderLayersToCanvas(ctx, zoneLayers, size, size);

  // Optional print guides/dimensions overlay
  if (options.includeMeasurements) {
    ctx.save();
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 8]);
    ctx.strokeRect(size * 0.15, size * 0.15, size * 0.7, size * 0.7);

    ctx.fillStyle = 'rgba(99, 102, 241, 0.8)';
    ctx.font = `bold ${size * 0.02}px sans-serif`;
    ctx.fillText(`Print Area Bounds: 12" x 16" (300 DPI) - ${zone.toUpperCase()}`, size * 0.16, size * 0.14);
    ctx.restore();
  }

  const mime = (options.format === 'jpg' || options.format === 'jpeg') ? 'image/jpeg' : 'image/png';
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), mime, 0.95);
  });
}
