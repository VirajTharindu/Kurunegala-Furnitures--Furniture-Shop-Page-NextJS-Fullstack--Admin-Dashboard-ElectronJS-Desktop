# Feature Specifications

## 1. Storefront 3D Configurator
The core product hook. Users can spin, zoom, and modify premium furniture models straight in the browser.
- **Controls:** OrbitControls mapped to pointer and touch drag.
- **Variants:** Toggles available for material surface textures (Fabric vs Leather) and color palettes.
- **Stats UI:** Embedded D3 chart showing exact dimensional requirements in real space dynamically.

## 2. Room Visualizer Engine
Provides environmental context for standard models.
- **Pre-baked HDRI:** Swaps environment lightmaps dynamically.
- **Shadow Callbacks:** Real-time projected WebGL shadows that adapt when models move or rotate.

## 3. Executive Admin Dashboard (Electron)
A restricted-access GUI designed to look like a high-tech terminal.
- **KPI Metrics:** Revenue, Orders, and conversion statistics.
- **Live Assets:** Loads actual heavy `.glb` assets into the admin frame so managers know exactly what is rendering live.
- **Inventory CRUD:** Add, delete, and modify properties instantly synced with Next.js API endpoints.

## 4. Performance & Styling
- **Custom Cursor:** Inverse kinematics blending cursor for desktop. Disabled natively on touch devices to block ghosting.
- **Glassmorphic UI:** Deep `backdrop-blur` integration layered on top of the `<Scene>` canvas.
