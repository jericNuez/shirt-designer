import { writePsd } from 'ag-psd';
import { DesignLayer } from '../types/editor';
import { ShirtColorConfig, DesignZone } from '../types/shirt';
import { renderLayersToCanvas } from './canvasRenderer';

/**
 * Creates a layered Photoshop (.psd) file from current garment colors and artwork layers
 */
export async function exportToPSD(
  layers: DesignLayer[],
  colors: ShirtColorConfig,
  zone: DesignZone,
  width: number = 2000,
  height: number = 2000
): Promise<Blob> {
  const zoneLayers = layers.filter((l) => l.zone === zone && l.visible);
  
  // 1. Garment Base Color Layer
  const baseCanvas = document.createElement('canvas');
  baseCanvas.width = width;
  baseCanvas.height = height;
  const baseCtx = baseCanvas.getContext('2d')!;
  
  // Fill background with T-shirt base color
  baseCtx.fillStyle = colors.body;
  baseCtx.fillRect(0, 0, width, height);

  // 2. Build PSD layers array starting with T-shirt base
  const psdLayers: any[] = [
    {
      name: `T-Shirt Base (${zone.toUpperCase()})`,
      canvas: baseCanvas,
      opacity: 1,
      visible: true,
    },
  ];

  // 3. Render each active artwork element into its own separate PSD layer using the full canvas compositor
  for (let i = 0; i < zoneLayers.length; i++) {
    const layer = zoneLayers[i];
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = width;
    layerCanvas.height = height;
    const ctx = layerCanvas.getContext('2d')!;

    // Render this specific layer onto its isolated canvas with all transforms and shapes (star, heart, text, etc.)
    await renderLayersToCanvas(ctx, [layer], width, height);

    psdLayers.push({
      name: `${layer.name || layer.type} (Layer ${i + 1})`,
      canvas: layerCanvas,
      opacity: layer.opacity,
      visible: layer.visible,
    });
  }

  // 4. Create PSD document structure
  const psd = {
    width,
    height,
    channels: 4,
    bitsPerChannel: 8,
    colorMode: 3, // RGB
    children: psdLayers,
    canvas: baseCanvas,
  };

  const buffer = writePsd(psd as any);
  return new Blob([buffer], { type: 'image/vnd.adobe.photoshop' });
}
