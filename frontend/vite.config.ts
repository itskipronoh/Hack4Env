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
					'vendor-react': ['react', 'react-dom'],
					'vendor-router': ['react-router-dom'],
					'vendor-clerk': ['@clerk/clerk-react'],
					'vendor-ui': ['lucide-react', 'react-icons'],
					'vendor-charts': ['recharts'],
					'vendor-utils': ['axios', 'leaflet'],
				},
			},
		},
	},
	// Add this for SPA routing support
	preview: {
		port: 5173,
		host: true,
	},
	// Add resolve configuration to prevent React context issues
	resolve: {
		dedupe: ['react', 'react-dom'],
	},
	// Ensure proper externalization
	optimizeDeps: {
		include: ['react', 'react-dom', 'react-router-dom'],
	},
});
