import { DesignZone, ShirtColorConfig } from './shirt';

export type LayerType = 'image' | 'text' | 'shape' | 'badge';

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  zone: DesignZone;
  x: number; // Normalized center [0..1] on the zone area (0.5 = center)
  y: number; // Normalized center [0..1] on the zone area (0.5 = center)
  scale: number; // Scale factor (1.0 = normal)
  rotation: number; // In degrees (-180 to 180)
  opacity: number; // 0..1
  flipX: boolean;
  flipY: boolean;
  locked: boolean;
  visible: boolean;
  blendMode?: 'source-over' | 'multiply' | 'screen' | 'overlay';
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string; // Data URL or URL
  aspectRatio: number; // width / height
  originalWidth: number;
  originalHeight: number;
  tintColor?: string; // Optional tint
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number; // Base point size
  fontWeight: string; // '400', '700', '900', etc.
  fontStyle: 'normal' | 'italic';
  fillColor: string;
  strokeColor?: string;
  strokeWidth: number; // 0 = no stroke
  curved: boolean;
  curveRadius: number; // positive = arch up, negative = arch down
  letterSpacing: number; // px
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
  shadowColor?: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: 'star' | 'circle' | 'square' | 'shield' | 'heart' | 'ribbon' | 'polygon' | 'banner';
  fillColor: string;
  strokeColor?: string;
  strokeWidth: number;
}

export interface BadgeLayer extends BaseLayer {
  type: 'badge';
  svgData: string;
  fillColor: string;
}

export type DesignLayer = ImageLayer | TextLayer | ShapeLayer | BadgeLayer;

export type LayerInput =
  | Omit<ImageLayer, 'id'>
  | Omit<TextLayer, 'id'>
  | Omit<ShapeLayer, 'id'>
  | Omit<BadgeLayer, 'id'>;

export interface ProjectData {
  version: string;
  timestamp: number;
  title: string;
  colors: ShirtColorConfig;
  layers: DesignLayer[];
}
