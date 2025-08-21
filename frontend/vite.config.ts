import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
// Better approach for SPA deployment
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      // Keep standard HTML entry point
      input: resolve(__dirname, 'index.html'),
      output: {
        manualChunks: {
          // Split by components for better caching
          'dashboard': ['./src/components/Dashboard.tsx'],
          'forest': ['./src/components/ForestMonitor.tsx'],
          'climate': ['./src/components/ClimateAlerts.tsx'],
          'biodiversity': ['./src/components/BiodiversityTracker.tsx'],
          'pollution': ['./src/components/Pollution.tsx'],
          'ecoai': ['./src/components/EcoAI.tsx'],
          'sms': ['./src/components/SmsRegistration.tsx'],
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});