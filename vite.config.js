import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscator from 'vite-plugin-javascript-obfuscator'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Only obfuscate in production (not during development)
    process.env.NODE_ENV === 'production' && obfuscator({
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: true,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: true,
      renameGlobals: false,
      selfDefending: true,
      simplify: true,
      splitStrings: true,
      splitStringsChunkLength: 10,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayCallsTransformThreshold: 0.75,
      stringArrayEncoding: ['base64'],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 2,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 4,
      stringArrayWrappersType: 'function',
      stringArrayThreshold: 0.75,
      transformObjectKeys: true,
      unicodeEscapeSequence: false
    }),
  ].filter(Boolean),
  
  server: {
    port: 3000,
    open: true,
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,  // No source maps = harder to debug
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // Removes all console.log
        drop_debugger: true,     // Removes debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,                // Multiple compression passes
      },
      mangle: {
        toplevel: true,          // Mangle top-level variables
        safari10: true,          // Safari 10 compatibility
        properties: {
          regex: /^_/            // Mangle properties starting with _
        }
      },
      format: {
        comments: false,         // Remove all comments
        beautify: false,         // Don't beautify output
      }
    },
    rollupOptions: {
      output: {
        // Use hash-based filenames (harder to guess component names)
        entryFileNames: 'assets/[hash].[name].js',
        chunkFileNames: 'assets/[hash].[name].js',
        assetFileNames: 'assets/[hash].[name].[ext]',
        
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          convex: ['convex'],
          stripe: ['@stripe/stripe-js'],
        },
      },
    },
    // Additional build optimizations
    target: 'es2020',
    cssMinify: true,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'convex', '@stripe/stripe-js'],
    exclude: [],
  },
  
  // Define environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // Remove development-only code in production
    __DEV__: process.env.NODE_ENV !== 'production',
  },
})