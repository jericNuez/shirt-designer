import { create } from 'zustand';

export type CameraPreset = 'front' | 'back' | 'sleeve_left' | 'sleeve_right' | 'isometric' | 'hero';

export type LightingPreset = 'studio_clean' | 'warm_sunset' | 'cyber_neon' | 'daylight' | 'dramatic';

export type ViewportBackground = 'studio_dark' | 'transparent' | 'gradient' | 'clean_white';

interface SceneState {
  cameraPreset: CameraPreset;
  lightingPreset: LightingPreset;
  background: ViewportBackground;
  isTurntableActive: boolean;
  turntableSpeed: number;
  wireframe: boolean;
  fov: number;
  zoomLevel: number;
  
  // Actions
  setCameraPreset: (preset: CameraPreset) => void;
  setLightingPreset: (preset: LightingPreset) => void;
  setBackground: (bg: ViewportBackground) => void;
  toggleTurntable: () => void;
  setTurntableSpeed: (speed: number) => void;
  toggleWireframe: () => void;
  setZoomLevel: (zoom: number) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  cameraPreset: 'front',
  lightingPreset: 'studio_clean',
  background: 'studio_dark',
  isTurntableActive: false,
  turntableSpeed: 1.5,
  wireframe: false,
  fov: 45,
  zoomLevel: 1.0,

  setCameraPreset: (preset) => set({ cameraPreset: preset, isTurntableActive: false }),
  setLightingPreset: (preset) => set({ lightingPreset: preset }),
  setBackground: (bg) => set({ background: bg }),
  toggleTurntable: () => set((state) => ({ isTurntableActive: !state.isTurntableActive })),
  setTurntableSpeed: (speed) => set({ turntableSpeed: speed }),
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
}));
