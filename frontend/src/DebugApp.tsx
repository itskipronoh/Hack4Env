import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Test if the issue is with specific imports
function DebugApp() {
  try {
    // Step 1: Test basic routing
    return (
      <Router>
        <div className="min-h-screen bg-slate-950 text-white p-8">
          <h1 className="text-2xl mb-4">Debug App - Step 1: Basic Routing Works</h1>
          <Routes>
            <Route path="/" element={
              <div>
                <p>✅ React Router working</p>
                <p>✅ Tailwind CSS working</p>
                <p>✅ Basic app structure working</p>
                <p className="mt-4 text-yellow-300">Next: Testing component imports...</p>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    );
  } catch (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h1>Error in DebugApp:</h1>
        <pre>{error?.toString()}</pre>
      </div>
    );
  }
}

export default DebugApp;
