<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Electron.js-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/Platform-Web%20App-004D40?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Platform Web" />
  <img src="https://img.shields.io/badge/Platform-Desktop%20App-4B32C3?style=for-the-badge&logo=windows&logoColor=white" alt="Platform Desktop" />
  <img src="https://img.shields.io/badge/License-All%20Rights%20Reserved-E11D48?style=for-the-badge&logo=security&logoColor=white" alt="License" />
</p>

# 🧩 Kurunegala Furnitures 

> **Immersive 3D Experience for Modern Furniture******

Kurunegala Furnitures is a **Fullstack Web Application and Desktop Admin Portal** designed to **revolutionize how customers visualize and purchase luxury furniture**.

The system focuses on **real-time 3D rendering and high-performance WebGL integrations** and aims to **provide an unparalleled, true-to-life pre-purchase visualization experience for users**.

---

# ✨ Key Features

| Feature | Description |
|---|---|
| 🛋️ **Immersive 3D Configurator** | Customize real-time WebGL product models (colors, materials) via `react-three/fiber` |
| 🖼️ **Room Visualizer** | Place furniture in various room environments and presets with high-performance shaders |
| 📊 **Desktop Admin Terminal** | Dedicated ElectronJS desktop application for secure, real-time inventory and sales management |
| ⚡ **Fluid Animations** | High-fidelity scrolling and interactive states powered by `framer-motion` and `gsap` |
| 🎨 **Dashboard & charts** | D3-powered analytics, recent sales activity, and live 3D asset previews for administrators & users |

---

# 🎬 Project Demonstration

The following resources demonstrate the system's behavior:

- 📹 [Product walkthrough video](#-product-video)
- 📸 [Screenshots of key features](#-screenshots)
- 📄 [System architecture overview](#-architecture-overview)
- 🧠 [Engineering lessons](#-engineering-lessons)
- 🔧 [Design decisions](#-key-design-decisions)
- 🗺️ [Roadmap](#-roadmap)
- 🚀 [Future improvements](#-future-improvements)
- 📄 [Documentation](#-documentations)
- 📝 [License](#-license)
- 📩 [Contact](#-contact)

If deeper technical access is required, it can be provided upon request.

---

# 📹 Product Video

> **[DEMONSTRATION PENDING]**

*A comprehensive video or GIF of the system's walkthrough demonstrating the Architecture, 3D engines, and core workflows is available soon!*

---

# 📸 Screenshots

### User Storefront
**Hero & 3D Model:**
<img src="docs/screenshots/1_User_Home.png" width="800" />

**Collections:**
<img src="docs/screenshots/2_User_Collections.png" width="800" />

**3D Configurator:**
<img src="docs/screenshots/3_User_Configurator.png" width="800" />

**Room Visualizer:**
<img src="docs/screenshots/4_User_VisualizeInRoom.png" width="800" />

---

### Admin Terminal
**Executive Dashboard:**
<img src="docs/screenshots/1_Admin_Dashboard.png" width="800" />

**Inventory Manager:**
<img src="docs/screenshots/2_Admin_Inventory.png" width="800" />

---

# ⚙️ Architecture Overview

Kurunegala Furnitures is implemented using a **Hybrid Next.js Web App / Electron Application Architecture**. 
The system follows a **Modular, Component-Based layered pattern**:
1. **Presentation Layer:** 
2. **State Layer:** 
3. **Data Access & API Layer:** 
4. **Desktop Containerization Layer:** 
5. **Logic Layer:** 

### Frontend (Storefront & Admin Views)
- **Next.js 16 (App Router)** - Server-side rendering and routing
- **React Three Fiber / Drei** - WebGL 3D rendering pipeline
- **Tailwind CSS & Framer Motion** - Utility styling and animation micro-interactions
- **Zustand** - Global state management for 3D configurators

### Backend
- **Next.js API Routes** - Dedicated serverless endpoints (`/api/products`)
- **JSON Data Layer (Mocking future MSSQL)** - Real-time file system CRUD via `fs/promises`
- **Node.js**
- **MSSQL** - Future database integration

### Desktop App Container
- **Electron.js** - Wraps the Next.js local server for dedicated admin desktop usage
- **Concurrently & Wait-on** - Start sequence orchestration

### Local Persistence
- **Local File System / `data.json`** - Handled server-side to prevent client tampering

---

# 🧠 Engineering Lessons

During development of Kurunegala Furnitures the focus areas included:

- **WebGL Optimization Context:** Managing complex GLTF/GLB models dynamically inside React components without tanking FPS. Heavily utilized `useMemo` for materials and scene objects.
- **Unified Codebase (Web & Desktop):** Architecting the app so standard web consumers and Electron desktop admins share the same Next.js core, decoupled by route segments.
- **Complex UI/UX Synchrony:** Ensuring Zustand state perfectly matches `framer-motion` layout animations and WebGL material updates simultaneously.
- **Windows MAX_PATH Limits:** Learning how modern bundlers interact with OS-level path restrictions, resulting in a fallback Webpack strategy for deep bundle structures.

If you need any further information or clarifications, go to the [Engineering Lessons](docs/engineering_lessons.md).

---

# 🔧 Key Design Decisions

1. **Next.js App Router API over External Node Server**
   Kept the architecture monolithic for the MVP. The Next.js API folders inherently act as a secure proxy to the data layer, reducing infrastructure overhead and latency to zero.

2. **Electron for Admin Terminal**
   Instead of exposing the global inventory system on the public internet, wrapping the Next.js output in Electron provides a secure, "kiosk-like" desktop terminal for shop owners.

3. **Zustand Over Context API**
   Given the high frame rate requirements of the 3D canvas, Zustand was chosen to prevent unnecessary re-renders when the `useConfigurator` state updates material values.

4. **JSON File System as Initial DB**
   Opted to construct a robust abstraction layer `lib/db.ts` utilizing `data.json` so the entire frontend could be verified immediately. (MSSQL integration planned on the Roadmap).

5. **Modular, Layered Folder Architecture**
   Strict separation of Presentation, State, Logic, and Data.

If you need any further information or clarifications, go to the [Design Decisions](docs/design_decisions.md).

---

# 🗺️ Roadmap

Key upcoming features planned for Kurunegala Furnitures:

- ✅ **DONE** — Core 3D engine integration and GLB loaders
- ✅ **DONE** — Other elements and theme integrations
- 🔄 **IN PROGRESS** — MSSQL Database integration replacing local JSON
- ⏳ **NOT STARTED** — Stripe Payment Gateway Checkout
- ⏳ **NOT STARTED** — Admin Order Fulfilment Workflows

---

# 🚀 Future Improvements

Planned enhancements include:

- Role Based Access Control (RBAC) securely locked inside the Electron IPC bridge.
- Web and Desktop App synchronization - This will allow you to make changes in the web app and see them in the desktop app.
- Webhooks for order fulfilment - This will allow you to get notified when an order is placed.

---

## 📄 Documentations

Additional documentation is available in the `docs/` folder:

| File | Description |
|---|---|
| ["Architecture & Design"](docs/architecture.md) | Granular breakdown of the system components and data flow. |
| ["Feature Specifications"](docs/features.md) | Details on WebGL tools, configurators, and admin terminal functionalities. |
| ["Engineering Lessons"](docs/engineering_lessons.md) | Detailed technical challenges and performance optimization strategies. |
| ["Design Decisions"](docs/design_decisions.md) | In-depth rationale for architectural and technical choices. |

---

# 📝 License

This repository is published for **portfolio and educational review purposes**.

The source code may not be accessed, copied, modified, distributed, or used without explicit permission from the author.

© 2025 Viraj Tharindu — All Rights Reserved.

---

# 📩 Contact

If you are reviewing this project as part of a hiring process or are interested in the technical approach behind it, feel free to reach out.

I would be happy to discuss the architecture, design decisions, or provide a private walkthrough of the project.

**Opportunities for collaboration or professional roles are always welcome.**

📧 Email: [virajtharindu1997@gmail.com](mailto:virajtharindu1997@gmail.com)  
💼 LinkedIn: [viraj-tharindu](https://www.linkedin.com/in/viraj-tharindu/)  
🌐 Portfolio: [vjstyles.com](https://vjstyles.com/)  
🐙 GitHub: [VirajTharindu](https://github.com/VirajTharindu)  

---

<p align="center">
  <em>Visualizing the Future of Furniture E-commerce</em>
</p>
