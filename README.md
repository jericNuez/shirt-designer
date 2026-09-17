# 👕 3D T-Shirt Customizer Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.2.0-indigo.svg)](src/data/changelog.ts)
[![Render Deploy](https://img.shields.io/badge/Render-Live%20Demo-46E3B7?style=flat-square&logo=render&logoColor=white)](https://shirt-designer-4fe2.onrender.com)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Donate-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/jerictolibq)

An interactive 3D Web Application for designing and customizing T-shirts in real-time. Built with **React**, **Three.js / React Three Fiber**, **Tailwind CSS**, and **ag-psd**.

---

## 🚀 Live Pages & Navigation

The application is structured into 3 interactive views:

1. **🏠 Landing Page**: Hero showcase with live rotatable 3D preview, feature highlights, and creator bio.
2. **👕 3D Studio Designer**: Full-featured design customizer with 360° rotation, multi-zone artwork placement, and layered PSD/PNG export.
3. **📋 Changelog Page**: Release timeline documenting all updates, feature additions, improvements, and bug fixes.

---

## Previews
<img width="1919" height="989" alt="Screenshot 2026-09-18 at 2 18 12 AM" src="https://github.com/user-attachments/assets/04a51d06-e9c1-4a8e-b67c-937e499dac43" />
<img width="1920" height="989" alt="Screenshot 2026-09-18 at 2 19 37 AM" src="https://github.com/user-attachments/assets/8f479880-77b9-427b-a865-fe511fee66b6" />

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

- **💬 Discord Webhook Feedback System**:
  - Interactive in-app feedback modal with 5-star rating, category topics, and rich Discord Embed delivery.
  - Automatically triggered upon successful design export to capture user impressions.

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
git clone https://github.com/jericnuez/shirt-designer.git
cd shirt-designer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Linting

```bash
# Type check and build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint & code formatting checks
npm run lint
npm run format:check
```

---

## ⌨️ Keyboard Shortcuts

- `Ctrl + Z` / `Cmd + Z`: Undo
- `Ctrl + Y` / `Cmd + Shift + Z`: Redo
- `Ctrl + E` / `Cmd + E`: Open Export Modal
- `Delete` / `Backspace`: Remove selected layer

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
© 2026 [Jeric Nuez](https://github.com/jericnuez).
