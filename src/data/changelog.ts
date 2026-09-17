export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  isLatest?: boolean;
  tag: 'major' | 'feature' | 'improvement' | 'fix';
  summary: string;
  highlights: {
    type: 'feature' | 'improvement' | 'fix';
    description: string;
  }[];
}

export const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    version: 'v1.2.0',
    date: 'September 17, 2026',
    title: 'Interactive Landing Page, User Feedback & Canvas Refinements',
    isLatest: true,
    tag: 'feature',
    summary:
      'Introduced an interactive 3D landing showcase, in-app user feedback system, enhanced 2D canvas manipulation, and perfected vector shape PSD exports.',
    highlights: [
      {
        type: 'feature',
        description:
          'Interactive Landing Page featuring a live 3D garment that smoothly animates with cursor movement and page scrolling.',
      },
      {
        type: 'feature',
        description:
          'In-app User Feedback popup with 5-star ratings, feedback categories, and smart post-export prompts.',
      },
      {
        type: 'improvement',
        description:
          'Direct 1:1 window pointer tracking for ultra-smooth moving, scaling, and rotating on the 2D design canvas.',
      },
      {
        type: 'fix',
        description:
          'Fixed PSD export so custom vector shapes (stars, shields, hearts) and curved text render accurately into isolated Photoshop layers.',
      },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'September 17, 2026',
    title: 'Photorealistic 3D Model & Mobile Responsive Layout',
    tag: 'feature',
    summary:
      'Upgraded to a high-fidelity 3D garment model with realistic cloth simulation and responsive mobile interface.',
    highlights: [
      {
        type: 'feature',
        description:
          'High-fidelity photorealistic 3D garment model with realistic cloth drape, ribbed collar, and sleeve contours.',
      },
      {
        type: 'feature',
        description:
          'Responsive mobile bottom drawer interface for designing seamlessly on smartphones and tablets.',
      },
      {
        type: 'improvement',
        description:
          'Streamlined 3D viewport controls and automatic camera alignment when switching garment zones.',
      },
      {
        type: 'fix',
        description: 'Resolved mobile screen height clipping and touch scrolling issues.',
      },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'September 17, 2026',
    title: 'Initial 3D T-Shirt Studio Release',
    tag: 'major',
    summary:
      'Official launch of the 3D T-Shirt Designer web app featuring 360° rotation, multi-zone customization, rich typography, and multi-format exports.',
    highlights: [
      {
        type: 'feature',
        description:
          '360° interactive 3D Garment Studio with orbit rotation, pan, zoom, and 5 studio lighting environments.',
      },
      {
        type: 'feature',
        description:
          'Multi-zone design customization for Front Chest, Back Print, Left Sleeve, and Right Sleeve.',
      },
      {
        type: 'feature',
        description:
          'Rich typography engine with Google Fonts, curved/arched text, outline strokes, and drop shadows.',
      },
      {
        type: 'feature',
        description:
          'Multi-format export engine supporting high-resolution PNG/JPG snapshots and layered Adobe Photoshop (.psd) files.',
      },
      {
        type: 'feature',
        description:
          'Project state management with full Undo/Redo history and browser local storage persistence.',
      },
    ],
  },
];
