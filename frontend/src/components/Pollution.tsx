import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Droplets, 
  Trash2, 
  Factory, 
  Wind, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Eye,
  Download,
  Loader2,
  Car,
  Recycle,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AirQualityData {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
}

interface WaterQualityData {
  location: string;
  ph: number;
  turbidity: number;
  dissolved_oxygen: number;
  pollution_level: string;
  last_updated: string;
}

interface WasteData {
  category: string;
  amount: number;
  recycled: number;
  color: string;
}

interface PollutionSource {
  source: string;
  contribution: number;
  trend: string;
  color: string;
}

const Pollution: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24hours');
  const [selectedCity, setSelectedCity] = useState('nairobi');
  const [selectedMetric, setSelectedMetric] = useState('aqi');

  // State for data
  const [airQualityData, setAirQualityData] = useState<AirQualityData[]>([]);
  const [waterQualityData, setWaterQualityData] = useState<WaterQualityData[]>([]);
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [pollutionSources, setPollutionSources] = useState<PollutionSource[]>([]);

  // Loading states
  const [isLoadingAir, setIsLoadingAir] = useState(true);
  const [isLoadingWater, setIsLoadingWater] = useState(true);
  const [isLoadingWaste, setIsLoadingWaste] = useState(true);

  // Key metrics
  const [currentAQI, setCurrentAQI] = useState<number | null>(null);
  const [aqiStatus, setAQIStatus] = useState<string>('');
  const [wasteGenerated, setWasteGenerated] = useState<string>('');
  const [recyclingRate, setRecyclingRate] = useState<string>('');

  // Fetch air quality data from API
  useEffect(() => {
    const fetchAirQualityData = async () => {
      setIsLoadingAir(true);
      try {
        const apiKey = import.meta.env.VITE_AIR_QUALITY_API_KEY;
        const baseUrl = import.meta.env.VITE_OPENWEATHER_AIR_POLLUTION_URL;
        const city = selectedCity;
        // You may need to map city to lat/lon, or use a backend endpoint
        // Example: Nairobi lat/lon
        const cityCoords: Record<string, { lat: number; lon: number }> = {
          nairobi: { lat: -1.286389, lon: 36.817223 },
          mombasa: { lat: -4.043477, lon: 39.668206 },
          kisumu: { lat: -0.1022, lon: 34.7617 },
          nakuru: { lat: -0.303099, lon: 36.080025 },
          eldoret: { lat: 0.5204, lon: 35.2698 }
        };
        const { lat, lon } = cityCoords[city] || cityCoords['nairobi'];
        const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch air quality data');
        const data = await response.json();
        // Transform API response to AirQualityData[] as needed
        const aqi = data.list[0]?.main.aqi || 0;
        setCurrentAQI(aqi);
        setAirQualityData([{ time: 'Now', aqi, pm25: data.list[0]?.components.pm2_5 || 0, pm10: data.list[0]?.components.pm10 || 0, o3: data.list[0]?.components.o3 || 0, no2: data.list[0]?.components.no2 || 0, so2: data.list[0]?.components.so2 || 0 }]);
        // Set AQI status
        if (aqi <= 50) setAQIStatus('Good');
        else if (aqi <= 100) setAQIStatus('Moderate');
        else if (aqi <= 150) setAQIStatus('Unhealthy for Sensitive');
        else if (aqi <= 200) setAQIStatus('Unhealthy');
        else setAQIStatus('Very Unhealthy');
      } catch (error) {
        console.error('Error fetching air quality data:', error);
      } finally {
        setIsLoadingAir(false);
      }
    };
    fetchAirQualityData();
  }, [selectedTimeRange, selectedCity]);

  // Fetch water quality data from API
  useEffect(() => {
    const fetchWaterQualityData = async () => {
      setIsLoadingWater(true);
      try {
        const baseUrl = import.meta.env.VITE_WATER_QUALITY_API_URL;
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch water quality data');
        const data = await response.json();
        // Transform API response to WaterQualityData[] as needed
        setWaterQualityData(data);
      } catch (error) {
        console.error('Error fetching water quality data:', error);
      } finally {
        setIsLoadingWater(false);
      }
    };
    fetchWaterQualityData();
  }, []);

  // Fetch waste and pollution sources data from API
  useEffect(() => {
    const fetchWasteData = async () => {
      setIsLoadingWaste(true);
      try {
        const baseUrl = import.meta.env.VITE_WASTE_API_URL;
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch waste data');
        const data = await response.json();
        setWasteData(data.waste || []);
        setPollutionSources(data.pollutionSources || []);
        // Calculate waste metrics
        const totalWaste = data.waste.reduce((sum: number, item: WasteData) => sum + item.amount, 0);
        const totalRecycled = data.waste.reduce((sum: number, item: WasteData) => sum + item.recycled, 0);
        setWasteGenerated(`${(totalWaste / 1000).toFixed(1)}K`);
        setRecyclingRate(`${((totalRecycled / totalWaste) * 100).toFixed(1)}%`);
      } catch (error) {
        console.error('Error fetching waste data:', error);
      } finally {
        setIsLoadingWaste(false);
      }
    };
    fetchWasteData();
  }, []);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-400 bg-emerald-500/20';
    if (aqi <= 100) return 'text-yellow-400 bg-yellow-500/20';
    if (aqi <= 150) return 'text-orange-400 bg-orange-500/20';
    if (aqi <= 200) return 'text-red-400 bg-red-500/20';
    return 'text-purple-400 bg-purple-500/20';
  };

  const getPollutionLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-400 bg-emerald-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const LoadingIndicator = () => (
    <div className="flex items-center justify-center w-full h-40">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Kenya Pollution & Waste Monitor</h1>
          <p className="text-slate-400 mt-1">Real-time monitoring of air quality, water pollution, and waste management across Kenya</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="24hours">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="nairobi">Nairobi</option>
            <option value="mombasa">Mombasa</option>
            <option value="kisumu">Kisumu</option>
            <option value="nakuru">Nakuru</option>
            <option value="eldoret">Eldoret</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Wind className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Air Quality Index</p>
              {isLoadingAir ? (
                <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-white">{currentAQI}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoadingAir ? (
              <div className="animate-pulse h-4 w-24 bg-slate-700 rounded"></div>
            ) : (
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getAQIColor(currentAQI || 0)}`}>
                {aqiStatus}
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-xl">
              <Droplets className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Water Bodies Monitored</p>
              <p className="text-2xl font-bold text-white">{waterQualityData.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">2 critical alerts</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Trash2 className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Daily Waste Generated</p>
              {isLoadingWaste ? (
                <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-white">{wasteGenerated}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">tons per day</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Recycle className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Recycling Rate</p>
              {isLoadingWaste ? (
                <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-white">{recyclingRate}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">+2.3% vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Air Quality Trend */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Air Quality Trend</h3>
              <p className="text-slate-400 text-sm">AQI levels over the last 24 hours</p>
            </div>
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-xs"
            >
              <option value="aqi">AQI</option>
              <option value="pm25">PM2.5</option>
              <option value="pm10">PM10</option>
              <option value="o3">Ozone</option>
              <option value="no2">NO2</option>
            </select>
          </div>
          {isLoadingAir ? (
            <LoadingIndicator />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={airQualityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#3b82f6"
                    fill="url(#airGradient)"
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="airGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pollution Sources */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Pollution Sources</h3>
              <p className="text-slate-400 text-sm">Main contributors to air pollution</p>
            </div>
          </div>
          {isLoadingWaste ? (
            <LoadingIndicator />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pollutionSources}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="contribution"
                    label={({ source, contribution }) => `${source}: ${contribution}%`}
                  >
                    {pollutionSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Waste Management */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Waste Management by Category</h3>
            <p className="text-slate-400 text-sm">Daily waste generation and recycling rates</p>
          </div>
        </div>
        {isLoadingWaste ? (
          <LoadingIndicator />
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Bar dataKey="amount" fill="#ef4444" name="Generated" />
                <Bar dataKey="recycled" fill="#22c55e" name="Recycled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-slate-300">Generated (tons)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-300">Recycled (tons)</span>
          </div>
        </div>
      </div>

      {/* Water Quality Monitoring */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Water Quality Monitoring</h3>
            <p className="text-slate-400 text-sm">Real-time water quality data from major water bodies</p>
          </div>
        </div>
        {isLoadingWater ? (
          <LoadingIndicator />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {waterQualityData.map((location, index) => (
              <div key={index} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white text-sm">{location.location}</h4>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPollutionLevelColor(location.pollution_level)}`}>
                    {location.pollution_level}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">pH Level</span>
                    <span className="text-white font-semibold">{location.ph}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Turbidity</span>
                    <span className="text-white font-semibold">{location.turbidity} NTU</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Dissolved O₂</span>
                    <span className="text-white font-semibold">{location.dissolved_oxygen} mg/L</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Last updated: {location.last_updated}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pollution;