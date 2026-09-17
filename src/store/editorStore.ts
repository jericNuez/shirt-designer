import { create } from 'zustand';
import { DesignLayer, LayerInput, ProjectData } from '../types/editor';
import { DesignZone, FabricConfig, ShirtColorConfig } from '../types/shirt';

export type AppPage = 'landing' | 'studio' | 'changelog';

interface EditorState {
  // Navigation
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;

  // Garment Config
  colors: ShirtColorConfig;
  fabric: FabricConfig;

  // Zones & Layers
  activeZone: DesignZone;
  selectedLayerId: string | null;
  layers: DesignLayer[];

  // History for Undo/Redo
  history: {
    past: DesignLayer[][];
    future: DesignLayer[][];
  };

  // UI state
  activeTab: 'colors' | 'upload' | 'text' | 'clipart' | 'layers';
  isExportModalOpen: boolean;
  isProjectModalOpen: boolean;
  isFeedbackModalOpen: boolean;

  // Actions
  setActiveZone: (zone: DesignZone) => void;
  setSelectedLayerId: (id: string | null) => void;
  setActiveTab: (tab: 'colors' | 'upload' | 'text' | 'clipart' | 'layers') => void;
  setExportModalOpen: (open: boolean) => void;
  setProjectModalOpen: (open: boolean) => void;
  setFeedbackModalOpen: (open: boolean) => void;

  // Garment Actions
  setColor: (
    part: 'body' | 'collar' | 'sleevesLeft' | 'sleevesRight' | 'all',
    color: string
  ) => void;
  setUnifiedColor: (unified: boolean) => void;
  setFabricType: (type: FabricConfig['type']) => void;

  // Layer Actions
  addLayer: (layer: LayerInput) => string;
  updateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  clearZoneLayers: (zone?: DesignZone) => void;

  // History Actions
  undo: () => void;
  redo: () => void;

  // Project Actions
  loadProject: (project: ProjectData) => void;
  resetProject: () => void;
}

const DEFAULT_COLORS: ShirtColorConfig = {
  body: '#111827', // Onyx Black
  collar: '#111827',
  sleevesLeft: '#111827',
  sleevesRight: '#111827',
  isUnified: true,
};

const DEFAULT_FABRIC: FabricConfig = {
  type: 'cotton',
  roughness: 0.85,
  metalness: 0.05,
  normalScale: 0.4,
  bumpScale: 0.2,
};

// Initial starter layers for demonstration
const INITIAL_LAYERS: DesignLayer[] = [
  {
    id: 'starter-text-1',
    name: 'Headline',
    type: 'text',
    zone: 'front',
    text: 'TOKYO DRIFT',
    fontFamily: 'Permanent Marker',
    fontSize: 52,
    fontWeight: '700',
    fontStyle: 'normal',
    fillColor: '#F43F5E',
    strokeColor: '#FFFFFF',
    strokeWidth: 3,
    curved: true,
    curveRadius: 280,
    letterSpacing: 4,
    lineHeight: 1.1,
    textAlign: 'center',
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowBlur: 10,
    shadowOffsetX: 4,
    shadowOffsetY: 6,
    x: 0.5,
    y: 0.42,
    scale: 1.0,
    rotation: -4,
    opacity: 1,
    flipX: false,
    flipY: false,
    locked: false,
    visible: true,
  },
  {
    id: 'starter-shape-1',
    name: 'Center Star Badge',
    type: 'shape',
    shapeType: 'star',
    zone: 'front',
    fillColor: '#FBBF24',
    strokeColor: '#000000',
    strokeWidth: 2,
    x: 0.5,
    y: 0.6,
    scale: 0.8,
    rotation: 0,
    opacity: 0.9,
    flipX: false,
    flipY: false,
    locked: false,
    visible: true,
  },
  {
    id: 'starter-text-2',
    name: 'Subtext',
    type: 'text',
    zone: 'front',
    text: 'STREET WEAR • EST 2026',
    fontFamily: 'Montserrat',
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'normal',
    fillColor: '#FFFFFF',
    strokeColor: '',
    strokeWidth: 0,
    curved: false,
    curveRadius: 0,
    letterSpacing: 6,
    lineHeight: 1,
    textAlign: 'center',
    shadowBlur: 4,
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    x: 0.5,
    y: 0.74,
    scale: 1.0,
    rotation: 0,
    opacity: 1,
    flipX: false,
    flipY: false,
    locked: false,
    visible: true,
  },
];

export const useEditorStore = create<EditorState>((set, get) => ({
  activePage: 'landing',
  setActivePage: (page) => set({ activePage: page }),

  colors: DEFAULT_COLORS,
  fabric: DEFAULT_FABRIC,
  activeZone: 'front',
  selectedLayerId: 'starter-text-1',
  layers: INITIAL_LAYERS,
  history: {
    past: [],
    future: [],
  },
  activeTab: 'text',
  isExportModalOpen: false,
  isProjectModalOpen: false,
  isFeedbackModalOpen: false,

  setActiveZone: (zone) => set({ activeZone: zone, selectedLayerId: null }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setExportModalOpen: (open) => set({ isExportModalOpen: open }),
  setProjectModalOpen: (open) => set({ isProjectModalOpen: open }),
  setFeedbackModalOpen: (open) => set({ isFeedbackModalOpen: open }),

  setColor: (part, color) => {
    set((state) => {
      if (part === 'all' || (part === 'body' && state.colors.isUnified)) {
        return {
          colors: {
            ...state.colors,
            body: color,
            collar: color,
            sleevesLeft: color,
            sleevesRight: color,
          },
        };
      }
      return {
        colors: {
          ...state.colors,
          [part]: color,
        },
      };
    });
  },

  setUnifiedColor: (unified) => {
    set((state) => ({
      colors: {
        ...state.colors,
        isUnified: unified,
        collar: unified ? state.colors.body : state.colors.collar,
        sleevesLeft: unified ? state.colors.body : state.colors.sleevesLeft,
        sleevesRight: unified ? state.colors.body : state.colors.sleevesRight,
      },
    }));
  },

  setFabricType: (type) => {
    set((state) => ({
      fabric: {
        ...state.fabric,
        type,
      },
    }));
  },

  addLayer: (layerData) => {
    const id = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newLayer = { ...layerData, id } as DesignLayer;

    set((state) => ({
      layers: [...state.layers, newLayer],
      selectedLayerId: id,
      history: {
        past: [...state.history.past, state.layers],
        future: [],
      },
    }));
    return id;
  },

  updateLayer: (id, updates) => {
    set((state) => {
      const newLayers = state.layers.map((l) =>
        l.id === id ? ({ ...l, ...updates } as DesignLayer) : l
      );
      return {
        layers: newLayers,
      };
    });
  },

  deleteLayer: (id) => {
    set((state) => {
      const newLayers = state.layers.filter((l) => l.id !== id);
      return {
        layers: newLayers,
        selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
        history: {
          past: [...state.history.past, state.layers],
          future: [],
        },
      };
    });
  },

  duplicateLayer: (id) => {
    const layer = get().layers.find((l) => l.id === id);
    if (!layer) return;

    const newId = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newLayer: DesignLayer = {
      ...layer,
      id: newId,
      name: `${layer.name} (Copy)`,
      x: Math.min(0.9, layer.x + 0.05),
      y: Math.min(0.9, layer.y + 0.05),
    };

    set((state) => ({
      layers: [...state.layers, newLayer],
      selectedLayerId: newId,
      history: {
        past: [...state.history.past, state.layers],
        future: [],
      },
    }));
  },

  reorderLayers: (fromIndex, toIndex) => {
    set((state) => {
      const updated = [...state.layers];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        layers: updated,
        history: {
          past: [...state.history.past, state.layers],
          future: [],
        },
      };
    });
  },

  bringToFront: (id) => {
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx === -1 || idx === state.layers.length - 1) return state;
      const updated = [...state.layers];
      const [layer] = updated.splice(idx, 1);
      updated.push(layer);
      return {
        layers: updated,
        history: {
          past: [...state.history.past, state.layers],
          future: [],
        },
      };
    });
  },

  sendToBack: (id) => {
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx <= 0) return state;
      const updated = [...state.layers];
      const [layer] = updated.splice(idx, 1);
      updated.unshift(layer);
      return {
        layers: updated,
        history: {
          past: [...state.history.past, state.layers],
          future: [],
        },
      };
    });
  },

  clearZoneLayers: (zone) => {
    set((state) => {
      const newLayers = zone ? state.layers.filter((l) => l.zone === zone) : [];
      return {
        layers: newLayers,
        selectedLayerId: null,
        history: {
          past: [...state.history.past, state.layers],
          future: [],
        },
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, state.history.past.length - 1);
      return {
        layers: previous,
        history: {
          past: newPast,
          future: [state.layers, ...state.history.future],
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        layers: next,
        history: {
          past: [...state.history.past, state.layers],
          future: newFuture,
        },
      };
    });
  },

  loadProject: (project) => {
    set({
      colors: project.colors,
      layers: project.layers,
      selectedLayerId: null,
      history: { past: [], future: [] },
    });
  },

  resetProject: () => {
    set({
      colors: DEFAULT_COLORS,
      fabric: DEFAULT_FABRIC,
      layers: [],
      selectedLayerId: null,
      history: { past: [], future: [] },
    });
  },
}));
