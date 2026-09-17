# 👕 3D T-Shirt Customizer Studio

An interactive 3D Web Application for designing and customizing T-shirts in real-time. Built with **React**, **Three.js / React Three Fiber**, **Tailwind CSS**, and **ag-psd**.

---

## 🚀 Live Pages & Navigation

The application is structured into 3 interactive views:

1. **🏠 Landing Page**: Hero showcase with live rotatable 3D preview, feature highlights, and creator bio.
2. **👕 3D Studio Designer**: Full-featured design customizer with 360° rotation, multi-zone artwork placement, and layered PSD/PNG export.
3. **📋 Changelog Page**: Release timeline documenting all updates, feature additions, improvements, and bug fixes.

---

## ☕ Author & Creator

- **Author**: **Jeric Nuez**
- **GitHub**: [https://github.com/jericnuez](https://github.com/jericnuez)
- **Support**: [Buy Me a Coffee](https://buymeacoffee.com/jerictolibq)

---

## ✨ Features

- **🎮 360° Interactive 3D Garment Studio**:
  - Photorealistic 3D T-shirt model (`shirt_model.glb`) with authentic cloth folds, collar ribbing, and sleeve drapery.
  - Free 360° rotation, orbit zoom, and panning with smooth damping.
  - Studio Lighting Presets (Studio Clean, Warm Sunset, Cyber Neon, Daylight, Dramatic Dark).
  - Turntable showcase mode (auto-spin animation).
  - Wireframe inspection toggle.

- **✨ 2D Design Suite & Live 3D Synchronization**:
  - **Multi-Zone Support**: Seamlessly design on **Front Chest**, **Back**, **Left Sleeve**, and **Right Sleeve**.
  - **Custom Image Upload**: PNG, JPG, SVG, WebP with drag-and-drop, opacity, flip horizontal/vertical, scale, and blend modes.
  - **Rich Typography Engine**: Google Fonts library, curved/arched text engine, outline stroke, drop shadow, and letter spacing.
  - **Badges & Vector Cliparts**: Geometric shapes and vector crests with on-canvas interactive transform gizmo (drag to move, rotate handle, resize handle).
  - **Layer Management**: Reorder, duplicate, lock/unlock, toggle visibility, and align center.
  - **Undo / Redo History**: Full state history support (`Ctrl+Z` / `Ctrl+Y`).

- **💬 User Feedback System**:
  - Interactive feedback modal with 5-star rating, category tags, and local storage persistence.
  - Automatically triggered upon successful design export to capture fresh user impressions.

- **📱 Fully Mobile Responsive**:
  - Touch-friendly 3D rotation, pinch-to-zoom, and 2D stage interaction.
  - Collapsible bottom tool drawer for phones and tablets.

- **💾 Dual Export Engine (PNG, JPG, PSD)**:
  - **3D Mockup Snapshot**: High-resolution photorealistic snapshot of the current 3D view with transparent, solid white, studio dark, or spotlight background.
  - **Print-Ready Flat Artwork**: 300 DPI production layout with layered **Adobe PSD** (preserving individual artwork layers using `ag-psd`), PNG, and JPG.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd shirt-designer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

- `Ctrl + Z` / `Cmd + Z`: Undo
- `Ctrl + Y` / `Cmd + Shift + Z`: Redo
- `Ctrl + E` / `Cmd + E`: Open Export Modal
- `Delete` / `Backspace`: Remove selected layer
