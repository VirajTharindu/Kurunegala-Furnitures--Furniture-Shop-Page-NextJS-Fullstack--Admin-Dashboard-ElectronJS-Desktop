# Architecture & Design

This document details the architectural decisions and data flow of **Kurunegala Furnitures**.

## Architectural Paradigm
The system is built on a **Modular, Component-Based Layered Architecture**, encapsulated within a monolithic repository. It achieves high separation of concerns by isolating:
- **Presentation Layer (UI/UX):** Next.js App Router and React components. 3D rendering is abstracted into its own module (`canvas` and `models`).
- **State Management Layer:** Utilizing `Zustand` to manage complex 3D states outside the React tree, ensuring 60 FPS performance without prop-drilling or Context API re-renders.
- **Data Access Layer:** An abstracted CRUD system in `src/lib/db.ts` interacts via Next.js REST endpoints (`src/app/api`), ensuring the frontend remains completely ignorant of whether the database is a local JSON file or a remote MSSQL cluster.

## High-Level Topology

The application is a monolithic **Next.js 16** repository serving two completely distinct contexts:
1. **The Public Web App:** Rendered at `/` for consumer 3D interactions.
2. **The Private Desktop Terminal:** Rendered at `/admin/*` and executed via an **Electron.js** shell.

### Directory Structure

```text
Kurunegala-Furnitures/
├── src/                      # Main source code for Next.js application
│   ├── app/                  # Next.js App Router (Pages, API)
│   │   ├── api/              # Secure Next.js serverless endpoints layer
│   │   ├── admin/            # Admin Dashboard private routes
│   │   └── page.tsx          # Main public landing page
│   ├── components/           # Reusable React components
│   │   ├── canvas/           # Three.js / R3F core setup (Scenes, Shaders, Lighting)
│   │   ├── models/           # GLTF / GLB React components for 3D furniture
│   │   ├── sections/         # Major WebUI views (Hero, Configurator, Visualizer) 
│   │   ├── admin/            # Admin-specific layouts, forms, and dashboard widgets
│   │   └── ui/               # Reusable small UI primitives (Navbar, Cursor)
│   ├── hooks/                # Custom hooks & Zustand global state (e.g., useConfigurator)
│   └── lib/                  # Utilities and Data Access Layer (db.ts)
├── electron/                 # Electron JS desktop application files
│   └── main.js               # Main process entry point for desktop wrapper
├── public/                   # Static application assets
├── docs/                     # Comprehensive project documentation
│   ├── screenshots/          # Roles-based system screenshots
│   ├── architecture.md       # Detailed system architecture and data flow
│   ├── features.md           # Feature specifications
│   └── setup_guide.md        # Local environment setup instructions
├── data.json                 # Local JSON file acting as a mock database layer
├── next.config.ts            # Next.js configuration and scaling settings
└── package.json              # NPM scripts and workspace dependencies
```

## Data Flow Diagram (Planned MSSQL)

1. **Client Interaction:** User changes material to "Leather" via Zustand store `useConfigurator`.
2. **WebGL Render:** `ProductModel.tsx` reacts to Zustand state, updates specific Three.js mesh materials instantly.
3. **Admin Edit:** Admin modifies product specs via Electron `/admin/inventory` GUI.
4. **API Layer:** Client `fetch` hits Next.js API `/api/products`.
5. **Persistence Layer:** `lib/db.ts` parses the JSON file (or queries MSSQL via ORM in future) and returns success.
6. **Revalidation:** Client components refetch and update GUI.

## Core Dependencies
- **Three.js & React Three Fiber:** Handles the render loop and WebGL canvas mounting natively inside React's reconciler.
- **Framer Motion & GSAP:** GSAP handles scroll-linked timeline sequences where absolute precision is needed; Framer Motion handles standard layout mounts, modal toggles, and UI micro-interactions.
- **Zustand:** Provides sub-millisecond state slice updates across the canvas outsize of standard React Context providers to maintain stable 60 FPS.
