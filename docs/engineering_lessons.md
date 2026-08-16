# 🧠 Engineering Lessons

During the development of **Kurunegala Furnitures**, several key technical challenges were addressed, providing valuable insights into modern web and desktop integration.

## 1. Mastering the Hybrid Monolith
Orchestrating a single codebase that serves both a public Next.js web application and a secure Electron desktop terminal required strict modularity. By using Next.js App Router's directory-based routing, we successfully isolated the `/admin` context from the public storefront, ensuring that shared components remain truly reusable without introducing cross-context side effects.

## 2. WebGL Optimization & Performance
Managing complex GLTF/GLB models dynamically inside React components poses a significant risk to framerates.
- **`useMemo` & `useCallback`:** Heavily utilized to prevent expensive geometry and material recalculations on every render.
- **Concurrent Rendering:** Leveraged React 18+ concurrent features via R3F to keep the main thread responsive during asset loading.

## 3. Unified Codebase (Web & Desktop)
Architecting the app so standard web consumers and Electron desktop admins share the same Next.js core. This was achieved by:
- Decoupling logic into `src/lib` and `src/hooks`.
- Using environment-aware branching for specific Electron IPC calls where necessary.

## 5. Complex UI/UX Synchrony
Ensuring `Zustand` state perfectly matches `framer-motion` layout animations and WebGL material updates simultaneously. This "triple-sync" (State -> UI -> Canvas) is critical for a premium feeling interactive experience.

## 6. Windows MAX_PATH Limits & Bundling
Large Next.js projects with deeply nested dependencies often hit Windows path length restrictions. We documented and implemented a fallback strategy (or specific folder flattening) to ensure the build pipeline remains stable across all OS environments.
