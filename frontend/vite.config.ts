import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/', // Make sure this is correct for your deployment
  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        manualChunks: {
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
  },
  // Add this for SPA routing support
  preview: {
    port: 5173,
    host: true
  }
});