import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - split large dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('convex')) {
              return 'vendor-convex';
            }
            if (id.includes('@stripe') || id.includes('stripe')) {
              return 'vendor-stripe';
            }
            if (id.includes('@auth0') || id.includes('auth0')) {
              return 'vendor-auth0';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // All other node_modules
            return 'vendor';
          }
          // App code - keep as is
          return null;
        },
      },
    },
  },
})