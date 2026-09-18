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
    version: 'v1.4.2',
    date: 'September 18, 2026',
    title: 'Zero-Lag 2D Drag Engine & GPU Texture Optimization',
    isLatest: true,
    tag: 'improvement',
    summary:
      'Overhauled the 2D canvas drag-and-drop pipeline with local transform bypass and selective 3D texture hashing, eliminating input delay and delivering instant 60fps/120fps touch tracking on mobile.',
    highlights: [
      {
        type: 'improvement',
        description:
          'Zero-Lag Move & Scale: Direct hardware-accelerated transform tracking during active drag, eliminating synchronous 800x1000 canvas redraws while moving.',
      },
      {
        type: 'improvement',
        description:
          'Selective 3D Texture Hashing: Reduced WebGL decal texture updates by 75% by rendering only the single modified zone.',
      },
      {
        type: 'improvement',
        description:
          'Pointer capture and willChange hardware acceleration for seamless, fluid touch drag response on all mobile devices.',
      },
    ],
  },
  {
    version: 'v1.4.1',
    date: 'September 18, 2026',
    title: 'Mobile Zone Selector, Viewport Overlay & Layout Polish',
    tag: 'fix',
    summary:
      'Fixed mobile Front/Back/Left/Right zone selection with synchronized 3D camera transitions, uncluttered the mobile top navbar, resolved viewport overlay squishing, and repositioned the 2D layer action bar.',
    highlights: [
      {
        type: 'fix',
        description:
          'Fixed Front, Back, Left, and Right zone switching on mobile with a dedicated floating top zone bar and instant 3D camera auto-alignment.',
      },
      {
        type: 'fix',
        description:
          'Resolved top Navbar squishing on mobile by decluttering secondary actions and providing ample breathing room for 3D/2D toggle and Export.',
      },
      {
        type: 'fix',
        description:
          'Fixed Viewport Overlay button congestion on mobile with responsive lighting controls and full-width 3D angle button visibility.',
      },
      {
        type: 'fix',
        description:
          'Repositioned 2D canvas layer action toolbar on mobile so it floats cleanly above the bottom dock without overlapping the shirt graphics.',
      },
    ],
  },
  {
    version: 'v1.4.0',
    date: 'September 18, 2026',
    title: 'Immersive Full-Screen Mobile Studio & Touch Engine Overhaul',
    tag: 'major',
    summary:
      'Transformed the mobile design studio into an edge-to-edge 100% full-screen 2D/3D viewport, introduced a sleek floating bottom dock & slide-up tool sheet, and overhauled the 2D canvas touch interaction engine for buttery-smooth 60fps manipulation.',
    highlights: [
      {
        type: 'feature',
        description:
          '100% Full-Screen Canvas on mobile: 2D and 3D viewports now span the full display height and width without letterboxing or squashing.',
      },
      {
        type: 'feature',
        description:
          'Sleek Floating Bottom Dock & Slide-Up Sheet: Quick one-tap tool access and zone switching that minimizes cleanly so your garment is never obstructed.',
      },
      {
        type: 'improvement',
        description:
          'Buttery-Smooth Touch Engine: Pointer capture, touch-action: none, requestAnimationFrame throttled updates, and enlarged touch handles for effortless dragging, scaling, and rotating.',
      },
      {
        type: 'improvement',
        description:
          'Enhanced Center-Snap Guides: Real-time visual alignment lines with smooth magnetic snapping for precise layer placement.',
      },
    ],
  },
  {
    version: 'v1.3.1',
    date: 'September 18, 2026',
    title: 'Mobile 2D Canvas Display & View Switcher Fix',
    tag: 'fix',
    summary:
      'Resolved mobile viewport 2D canvas visibility issues, added responsive 3D/2D segmented mode switcher controls to the mobile Navbar, and perfected responsive canvas scaling.',
    highlights: [
      {
        type: 'fix',
        description:
          'Fixed 2D canvas height collapse on mobile screens by implementing dynamic aspect ratio (4:5) constraints and responsive max-height viewport bounds.',
      },
      {
        type: 'feature',
        description:
          'Added a compact 3D View / 2D Canvas segmented toggle to the mobile and tablet Navbar for instant one-tap mode switching.',
      },
      {
        type: 'improvement',
        description:
          'Optimized mobile Navbar spacing and touch controls to maintain full access to undo/redo and export actions without layout overflow.',
      },
    ],
  },
  {
    version: 'v1.3.0',
    date: 'September 18, 2026',
    title: 'Terms of Service, Privacy Policy & Legal Documentation',
    tag: 'feature',
    summary:
      'Introduced comprehensive Terms of Service and Privacy Policy documentation pages with structured data modules and integrated app navigation.',
    highlights: [
      {
        type: 'feature',
        description:
          'Dedicated Terms of Service page outlining user-uploaded artwork copyright warranties, MIT license boundaries, and physical manufacturing disclaimers.',
      },
      {
        type: 'feature',
        description:
          'Privacy-first Privacy Policy page detailing local browser storage usage, client-side WebGL processing, and feedback webhook practices.',
      },
      {
        type: 'improvement',
        description:
          'Integrated footer legal links in the Landing Page and added privacy disclosures within the Feedback submission modal.',
      },
    ],
  },
  {
    version: 'v1.2.0',
    date: 'September 17, 2026',
    title: 'Interactive Landing Page, User Feedback & Canvas Refinements',
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
