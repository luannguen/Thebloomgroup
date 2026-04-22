import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Load dynamically to avoid ESM/CommonJS conflict
  const lovableTagger = await import("lovable-tagger")
    .then(mod => mod.componentTagger)
    .catch(() => () => ({ name: 'lovable-tagger-noop' }));

  return {
    base: "/",
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test-setup.js',
    },
    server: {
      host: "::",
      port: 8081,
      proxy: {
        '/api': {
          target: 'http://localhost:5173',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/api/, '')
        }
      },
      hmr: {
        overlay: true,
      },
    },
    plugins: [
      react(),
      mode === 'development' && lovableTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      minify: true,
      chunkSizeWarningLimit: 1500,
    },
  };
});
