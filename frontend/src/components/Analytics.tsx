import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Types
export type SpeciesCategoryData = { category: string; count: number };
export type ConservationStatusData = { name: string; value: number; color: string };

// Your species categories with colors (matches backend taxonKeys)
const speciesCategories = [
  { name: 'Birds', color: '#3b82f6' },
  { name: 'Mammals', color: '#10b981' },
  { name: 'Reptiles', color: '#f59e0b' },
  { name: 'Amphibians', color: '#ef4444' },
  { name: 'Fish', color: '#8b5cf6' },
  { name: 'Insects', color: '#06b6d4' },
];

// Map conservation statuses to colors
const statusColors: Record<string, string> = {
  'Least Concern': '#10b981',
  'Near Threatened': '#f59e0b',
  'Vulnerable': '#f97316',
  'Endangered': '#ef4444',
  'Critically Endangered': '#991b1b',
  'Unknown': '#64748b',
};

export const Analytics = () => {
  const [forestData, setForestData] = useState<any>(null);
  const [speciesData, setSpeciesData] = useState<SpeciesCategoryData[]>([]);
  const [conservationData, setConservationData] = useState<ConservationStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch species count
        const speciesRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/gbif-counts`);
        if (!speciesRes.ok) throw new Error(`GBIF API error: ${speciesRes.status}`);
        const speciesJson: SpeciesCategoryData[] = await speciesRes.json();

        // Fetch conservation status
        const consRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/conservation-status`);
        if (!consRes.ok) throw new Error(`Conservation API error: ${consRes.status}`);
        const consRaw = await consRes.json();

        // Convert conservation status object to array with colors
        const consData = Object.entries(consRaw).map(([name, value]) => ({
          name,
          value: Number(value),
          color: statusColors[name] || statusColors['Unknown'],
        }));

        // Fetch forest data
        const forestRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173'}/forest`);
        if (!forestRes.ok) throw new Error(`Forest API error: ${forestRes.status}`);
        const forestJson = await forestRes.json();
        setForestData(forestJson);

        setSpeciesData(speciesJson);
        setConservationData(consData);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading analytics data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="analytics-container" style={{ display: 'flex', gap: 40 }}>
      {/* Species by Category Bar Chart */}
      <div style={{ flex: 1, minWidth: 300 }}>
        <h3>Species by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={speciesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {speciesData.map((entry, index) => {
                const color = speciesCategories.find((c) => c.name === entry.category)?.color || '#8884d8';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Forest Data Display */}
      <div style={{ flex: 1, minWidth: 300 }}>
        <h3>Forest Data</h3>
        {forestData ? (
          <pre style={{ background: '#f3f4f6', padding: 16, borderRadius: 8, maxHeight: 300, overflow: 'auto' }}>
            {JSON.stringify(forestData, null, 2)}
          </pre>
        ) : (
          <div>No forest data available.</div>
        )}
      </div>

      {/* Conservation Status Pie Chart */}
      <div style={{ flex: 1, minWidth: 300 }}>
        <h3>Conservation Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={conservationData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {conservationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
