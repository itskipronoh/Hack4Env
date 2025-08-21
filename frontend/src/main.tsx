import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

/**
 * better error handling for missing environment variables in production
 * Check for required environment variables
 */
if (!PUBLISHABLE_KEY) {
	console.error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
	// In production, show a fallback instead of throwing
	if (import.meta.env.PROD) {
		document.getElementById('root')!.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem; background: #f3f4f6; border-radius: 8px; max-width: 500px;">
          <h1 style="color: #dc2626; margin-bottom: 1rem;">Configuration Error</h1>
          <p style="color: #374151;">The application is missing required configuration. Please contact support.</p>
        </div>
      </div>
    `;
		throw new Error('Missing Publishable Key');
	}
	throw new Error('Missing Publishable Key');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

createRoot(rootElement).render(
	<StrictMode>
		<ErrorBoundary>
			<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
				<App />
			</ClerkProvider>
		</ErrorBoundary>
	</StrictMode>
);
