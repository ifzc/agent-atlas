import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

const fromRoot = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

// GitHub Pages uses static HTML entries and full-page navigation, without RSC requests.
export default defineConfig({
  root: fromRoot('./static'),
  base: `${process.env.PAGES_BASE_PATH ?? ''}/`,
  publicDir: fromRoot('./public'),
  resolve: {
    alias: {
      '@': fromRoot('./'),
      'next/link': fromRoot('./static/link.tsx'),
    },
  },
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
  build: {
    outDir: fromRoot('./dist/pages'),
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        course: fromRoot('./static/index.html'),
        history: fromRoot('./static/chapters/agent-history/index.html'),
      },
    },
  },
});
