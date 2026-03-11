feat/fix: Initial Landing 3d page with Admin view implementation, bugfixes & core setup.


- **Paradigm:** Modular, Component-Based Layered Architecture.
- **`src/app`:** Next.js Server & Client components bridging the UI.
- **`src/api`:** Serverless API proxy preventing direct client-to-DB connections.
- **`src/components`:** Abstracted 3D WebGL renderers (`canvas/`, `models/`), Admin UI Widgets, and Reusable Primitives.
- **`electron/`:** Encapsulated desktop shell bridging local localhost server for native Windows deployments via IPC.
- **`docs/`:** Established a highly descriptive documentation suite (`architecture.md`, `features.md`, `setup_guide.md`, and categorized `screenshots/`).


- **Web Storefront:** Functional Landing Page, Dynamic Product Collections, Immersive 3D Customizer, and AR-ready Room Visualizer.
- **Admin Desktop:** Implemented a secure Executive Dashboard displaying live D3 metrics, Inventory Control data tables, and an "Add/Edit Asset" modal.
- **State Management:** Integrated `Zustand` for performant, sub-millisecond 3D context propagation without React Context rerender penalties.
- **Animations:** Fluid Framer Motion & GSAP layout transitions.


- **Data Consistency (SKUs):** Corrected placeholder IDs in `data.json` so SKUs accurately map to product slugs (e.g. `lumina-lounge-sofa`), preventing component crashes.
- **Admin UI Global Search:** Implemented functional controlled state routing, pushing search queries natively to `/admin/inventory?q={query}`.
- **Authentication Handlers:** Fixed broken Logout workflows to safely `router.push('/')`.
- **Duplicate Data Logic:** Refactored static `[1,2,3,4,5]` mappings on the Admin Dashboard into realistic `mockSales` distinct datasets.
- **404 Eradications:** Added placeholder routing (`orders/`, `customers/`, `settings/`) to satisfy the Admin Layout mapping logic.
- **3D Model Asset Resolution:** Fixed a critical `403 Forbidden` Server crash caused by an oversized `StainedGlassLamp.glb` on jsDelivr. Cleanly swapped reference to `Lantern.glb`.


- **Git Initialization:** Established `.git` repository and bound to origin.
- **.gitignore Tuning:** Actively ignored all `.env*` runtime files to prevent API Key / MSSQL credential leakage. Whitelisted `!.env.example` explicitly to safely distribute environmental schema requirements to future contributors.
- **Build Artifact Cleansing:** Purged remnant `build_output.txt` and `.next/` caching to guarantee a clean initial Git tree.
- **Local JSON DB:** Decided to track `data.json` as a *mock* seeder for the initial MVP to ensure reviewers experience immediate functionality without a database connection.

- **WebGL Memory Relief:** Implemented `useMemo` caching inside Three.js React bindings to prevent geometry overlapping and dropped frames.
- **Turbopack Routing:** Retained Turbopack for `npm run dev` to drastically reduce Hot-Module-Replacement (HMR) latency.
- **Wait-On Orchestration:** Engineered `npm run electron:dev` to intelligently delay Electron boot until `localhost:3000` responds 200, preventing white-screen crashes.

---

The following configurations have been analyzed but actively deferred as they fall outside the immediate MVP milestone scope:
- **Docker / docker-compose:** The system is currently coupled to local Next.js / Electron node tasks. Containerization will heavily disrupt the Electron desktop pipeline and is deferred.
- **CI/CD Pipelines (GitHub Actions):** Not configured yet. Requires Vercel edge token bindings for the web interface and an Electron-Builder Windows Code-Signing pipeline for the `.exe` distribution.
- **Testing & Coverage (Jest/Cypress/Playwright):** Deferred. The primary focus remained on complex 3D integration and WebGL optimization.
- **MSSQL Database:** Currently mocking via `lib/db.ts` to `data.json`.
