/// <reference types="vite/client" />

// Allow importing global (non-CSS-module) styles like `import './index.css'`.
declare module '*.css';

// Common static asset declarations (optional helpers)
declare module '*.png' { const src: string; export default src; }
declare module '*.jpg' { const src: string; export default src; }
declare module '*.jpeg' { const src: string; export default src; }
declare module '*.gif' { const src: string; export default src; }

declare module '*.svg' {
  const src: string;
  export default src;
}
