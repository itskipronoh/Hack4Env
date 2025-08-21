import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Changed from './' for Vercel deployment
  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/components/Dashboard.tsx'),
        insights: resolve(__dirname, 'src/components/ForestMonitor.tsx'),
        climate: resolve(__dirname, 'src/components/ClimateAlerts.tsx'),
        biodiversity: resolve(__dirname, 'src/components/BiodiversityTracker.tsx'),
        pollution: resolve(__dirname, 'src/components/Pollution.tsx'),
        ecoai: resolve(__dirname, 'src/components/EcoAI.tsx'),
        sms: resolve(__dirname, 'src/components/SmsRegistration.tsx'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(css)$/i.test(assetInfo.name || '')) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    port: 5173,
    host: true,
    historyApiFallback: {
      index: '/index.html'
    }
  }
});