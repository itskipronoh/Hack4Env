import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Test each component individually
function TestApp() {
  try {
    // First test: Import Layout component
    const Layout = React.lazy(() => import('./components/Layout'));
    
    return (
      <Router>
        <React.Suspense fallback={<div className="text-white p-4">Loading Layout...</div>}>
          <Layout>
            <div className="text-white p-8">
              <h1 className="text-2xl">✅ Layout component loaded successfully!</h1>
              <p>This means Layout.tsx is working.</p>
            </div>
          </Layout>
        </React.Suspense>
      </Router>
    );
  } catch (error) {
    return (
      <div className="text-red-500 p-4">
        <h1>❌ Error loading Layout:</h1>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}

export default TestApp;
