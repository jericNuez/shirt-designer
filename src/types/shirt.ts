export type GarmentPart = 'body' | 'collar' | 'sleeves' | 'sleeves_left' | 'sleeves_right';

export type DesignZone = 'front' | 'back' | 'sleeve_left' | 'sleeve_right';

export type FabricType = 'cotton' | 'vintage_washed' | 'athletic_poly' | 'heavyweight_fleece';

export interface ShirtColorConfig {
  body: string;
  collar: string;
  sleevesLeft: string;
  sleevesRight: string;
  isUnified: boolean; // if true, body color applies to collar & sleeves
}

export interface FabricConfig {
  type: FabricType;
  roughness: number;
  metalness: number;
  normalScale: number;
  bumpScale: number;
}

export interface PresetColor {
  name: string;
  hex: string;
  category: 'neutrals' | 'vibrant' | 'earth' | 'pastel' | 'dark';
}

export const PRESET_COLORS: PresetColor[] = [
  // Neutrals
  { name: 'Pure White', hex: '#FFFFFF', category: 'neutrals' },
  { name: 'Heather Grey', hex: '#D1D5DB', category: 'neutrals' },
  { name: 'Charcoal', hex: '#374151', category: 'neutrals' },
  { name: 'Onyx Black', hex: '#111827', category: 'neutrals' },
  { name: 'Pitch Black', hex: '#050505', category: 'neutrals' },

  // Earth / Warm
  { name: 'Sand Cream', hex: '#F3E8DC', category: 'earth' },
  { name: 'Warm Beige', hex: '#D4B996', category: 'earth' },
  { name: 'Mocha Brown', hex: '#634832', category: 'earth' },
  { name: 'Terracotta', hex: '#B85D43', category: 'earth' },
  { name: 'Forest Green', hex: '#234E3E', category: 'earth' },
  { name: 'Olive Drab', hex: '#4B5320', category: 'earth' },

  // Vibrant / Primary
  { name: 'Crimson Red', hex: '#DC2626', category: 'vibrant' },
  { name: 'Electric Coral', hex: '#F43F5E', category: 'vibrant' },
  { name: 'Sunset Orange', hex: '#F97316', category: 'vibrant' },
  { name: 'Golden Amber', hex: '#FBBF24', category: 'vibrant' },
  { name: 'Emerald Green', hex: '#10B981', category: 'vibrant' },
  { name: 'Royal Blue', hex: '#2563EB', category: 'vibrant' },
  { name: 'Navy Blue', hex: '#1E3A8A', category: 'vibrant' },
  { name: 'Deep Purple', hex: '#7C3AED', category: 'vibrant' },

  // Pastels
  { name: 'Pastel Lavender', hex: '#E9D5FF', category: 'pastel' },
  { name: 'Baby Pink', hex: '#FCE7F3', category: 'pastel' },
  { name: 'Sky Mint', hex: '#CCFBF1', category: 'pastel' },
  { name: 'Butter Soft', hex: '#FEF3C7', category: 'pastel' },
];
