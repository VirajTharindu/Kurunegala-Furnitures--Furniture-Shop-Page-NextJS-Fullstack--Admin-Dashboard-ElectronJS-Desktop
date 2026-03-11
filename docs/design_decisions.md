# 🔧 Key Design Decisions

The following architectural and design choices were made to ensure **Kurunegala Furnitures** is scalable, performant, and secure.

## 1. Next.js App Router vs. External Node Server
We kept the architecture monolithic for the initial phase. The Next.js API routes (`src/app/api/`) inherently act as a secure proxy to the data layer. This:
- Reduces infrastructure overhead.
- Minimizes latency between the frontend and the data access layer.
- Simplifies deployment and maintenance.

## 2. Electron for Admin Terminal
Instead of exposing the global inventory system as a public web URL, we wrapped the admin routes in an Electron shell.
- **Security:** Limits access to the management terminal to a local desktop environment.
- **User Experience:** Provides a dedicated "kiosk-like" experience for shop owners, distinct from general web browsing.
- **Native Integration:** Allows for future integration with local hardware (printers, scanners) if required.

## 3. Zustand Over React Context API
Given the high frame rate requirements of the 3D canvas, Zustand was chosen over Context for global state management.
- **Performance:** Zustand allows components to subscribe to small slices of state, preventing unnecessary re-renders of the entire 3D scene when only a single material value changes.
- **Boilerplate:** Significantly less boilerplate compared to Redux or complex Context providers.

## 4. JSON File System as Initial Data Layer
We opted to construct a robust abstraction layer in `src/lib/db.ts` utilizing `data.json`.
- **Portability:** The entire system is verification-ready immediately upon cloning without complex DB setup.
- **Future-Proofing:** The `db.ts` utility is designed to be easily swapped with a Prisma/MSSQL client in the future with minimal changes to the API routes.

## 5. Modular, Layered Folder Architecture
The folder structure strictly separates **Presentation**, **State**, **Logic**, and **Data**.
- **`src/components` (Presentation):** UI and 3D view layers.
- **`src/hooks` (State):** Zustand stores.
- **`src/lib` (Logic/Data):** DB utilities and helper functions.
This ensures the UI remains completely decoupled from backend processing, enabling the system to scale easily between Web and Desktop contexts.
