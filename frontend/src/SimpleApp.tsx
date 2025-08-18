import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple test components
function TestDashboard() {
  return <div style={{ color: 'white', padding: '20px' }}>Dashboard Test</div>;
}

function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#1e293b', minHeight: '100vh', color: 'white' }}>
      <nav style={{ padding: '20px', borderBottom: '1px solid #334155' }}>
        <h1>EcoSphere Test</h1>
      </nav>
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}

function SimpleApp() {
  return (
    <Router>
      <TestLayout>
        <Routes>
          <Route path="/" element={<TestDashboard />} />
        </Routes>
      </TestLayout>
    </Router>
  );
}

export default SimpleApp;
