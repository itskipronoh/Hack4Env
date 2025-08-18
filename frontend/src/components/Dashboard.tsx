import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TreePine, 
  Bird, 
  AlertTriangle, 
  Leaf, 
  MapPin,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import LeafletMap from './Map/LeafletMap';
import { getForestCoverageData, getRegionalForestData } from '../utils/forestData';
import { getWeatherData, MONITORED_LOCATIONS } from '../utils/weather';
import { getKenyaWeatherData, getKenyaForestData, getKenyaAirQuality, KENYA_LOCATIONS, KENYA_FORESTS } from '../utils/kenyaApis';
import type { ForestCoverageData, RegionForestData } from '../utils/forestData';

interface WeatherAlert {
  id: number;
  type: string;
  severity: string;
  location: string;
  description: string;
  issued: string;
  expires: string;
  affectedArea: string;
  icon: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const Dashboard: React.FC = () => {
  // State for real API data
  const [forestData, setForestData] = useState<ForestCoverageData[]>([]);
  const [regionData, setRegionData] = useState<RegionForestData[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);

  // Loading states
  const [isLoadingForest, setIsLoadingForest] = useState(true);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);

  // Calculated metrics
  const [globalCoverage, setGlobalCoverage] = useState<number>(79.7);
  const [coverageChange, setCoverageChange] = useState<string>('+2.3%');
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(7);
  const [criticalAlertsCount, setCriticalAlertsCount] = useState<number>(3);

  // Fetch real forest data
  useEffect(() => {
    const fetchForestData = async () => {
      setIsLoadingForest(true);
      try {
        // Fetch forest coverage data
        const coverage = await getForestCoverageData('6months', 'global');
        setForestData(coverage);

        // Update metrics based on real data
        if (coverage.length > 0) {
          const latestCoverage = coverage[coverage.length - 1].coverage;
          setGlobalCoverage(latestCoverage);

          if (coverage.length > 1) {
            const previousCoverage = coverage[coverage.length - 2].coverage;
            const change = latestCoverage - previousCoverage;
            const changePercent = ((change / previousCoverage) * 100).toFixed(1);
            setCoverageChange(`${change >= 0 ? '+' : ''}${changePercent}%`);
          }
        }

        // Fetch regional data
        const regions = await getRegionalForestData();
        setRegionData(regions);

      } catch (error) {
        console.error('Error fetching forest data:', error);
        // Keep default values on error
      } finally {
        setIsLoadingForest(false);
      }
    };

    fetchForestData();
  }, []);

  // Fetch real climate alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoadingAlerts(true);
      try {
        // Fetch alerts from a few key locations for dashboard summary
        const alertPromises = MONITORED_LOCATIONS.slice(0, 5).map(location =>
          getWeatherData(location.name)
        );

        const allAlerts = await Promise.all(alertPromises);
        const flatAlerts = allAlerts.flat();

        // Take the most recent/severe alerts for dashboard
        const recentAlerts = flatAlerts
          .sort((a, b) => {
            // Sort by severity first, then by issued date
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] || 0;
            const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] || 0;

            if (aSeverity !== bSeverity) return bSeverity - aSeverity;
            return new Date(b.issued).getTime() - new Date(a.issued).getTime();
          })
          .slice(0, 3); // Take top 3 for dashboard

        setWeatherAlerts(recentAlerts);
        setActiveAlertsCount(flatAlerts.length);
        setCriticalAlertsCount(flatAlerts.filter(alert => alert.severity === 'critical').length);

      } catch (error) {
        console.error('Error fetching alerts:', error);
        // Keep default values on error
      } finally {
        setIsLoadingAlerts(false);
      }
    };

    fetchAlerts();
  }, []);

  const speciesData = [
    { category: 'Birds', count: 1134, trend: 'up' }, // Kenya has over 1,000 bird species
    { category: 'Mammals', count: 359, trend: 'down' }, // Including big five and endemic species
    { category: 'Plants', count: 6506, trend: 'down' }, // Kenya's flora diversity
    { category: 'Reptiles', count: 191, trend: 'up' },
  ];

  const projects = [
    { id: 1, name: 'Mau Forest Restoration', progress: 65, location: 'Rift Valley, Kenya', trees: 25000 },
    { id: 2, name: 'Green Belt Movement', progress: 82, location: 'Central Kenya', trees: 51000 },
    { id: 3, name: 'Coastal Forest Recovery', progress: 38, location: 'Coastal Kenya', trees: 12500 },
  ];

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const alertDate = new Date(dateString);
    const diffMs = now.getTime() - alertDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white"> EcoSentinel: Kenya Triple Crisis Intelligence</h1>
          <p className="text-slate-400 mt-1">
            Tackling <span className="text-emerald-400 font-bold">Climate Change</span>, <span className="text-blue-400 font-bold">Biodiversity Loss</span>, and <span className="text-yellow-400 font-bold">Pollution & Waste</span> with real-time, hyperlocal insights for local decision-makers.
          </p>
          <p className="text-xs text-slate-500 mt-2">Empowering communities in Kenya to act faster and smarter.</p>
        </div>
      </div>

      {/* Hyperlocal Insights */}
      <HyperlocalInsights />

      {/* Key Metrics - Responsive Full Width */}
      <div className="grid grid-cols-2 gap-6 w-full">
        {/* Forest Coverage */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-emerald-700/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Forest Coverage</p>
            {isLoadingForest ? (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
              </div>
            ) : (
              <p className="text-3xl font-extrabold text-white mt-2">{globalCoverage.toFixed(1)}%</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              {isLoadingForest ? (
                <div className="animate-pulse h-4 w-24 bg-slate-700 rounded"></div>
              ) : coverageChange.startsWith('+') ? (
                <>
                  <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-300 text-base font-semibold">{coverageChange}</span>
                  <span className="text-slate-500 text-xs">vs last month</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-5 w-5 text-red-400" />
                  <span className="text-red-300 text-base font-semibold">{coverageChange}</span>
                  <span className="text-slate-500 text-xs">vs last month</span>
                </>
              )}
            </div>
          </div>
          <div className="p-5 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
            <TreePine className="h-12 w-12 text-emerald-400" />
          </div>
        </div>

        {/* Species Tracked */}
        {/* <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-700/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Species Tracked</p>
            <p className="text-3xl font-extrabold text-white mt-2">1,457</p>
            <div className="flex items-center gap-2 mt-3">
              <ArrowUpRight className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300 text-base font-semibold">+156</span>
              <span className="text-slate-500 text-xs">this week</span>
            </div>
          </div>
          <div className="p-5 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <Bird className="h-12 w-12 text-blue-400" />
          </div>
        </div> */}

        {/* Active Alerts */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-red-700/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Active Alerts</p>
            {isLoadingAlerts ? (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="h-6 w-6 text-red-400 animate-spin" />
                <div className="animate-pulse h-8 w-8 bg-slate-700 rounded"></div>
              </div>
            ) : (
              <p className="text-3xl font-extrabold text-white mt-2">{activeAlertsCount}</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <ArrowDownRight className="h-5 w-5 text-red-400" />
              {isLoadingAlerts ? (
                <div className="animate-pulse h-4 w-20 bg-slate-700 rounded"></div>
              ) : (
                <>
                  <span className="text-red-300 text-base font-semibold">{criticalAlertsCount} critical</span>
                  <span className="text-slate-500 text-xs">require action</span>
                </>
              )}
            </div>
          </div>
          <div className="p-5 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
        </div>
      </div>

      {/* Forest Coverage Trend - Full Width */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Kenya Forest Coverage Trend</h3>
            <p className="text-slate-400 text-sm">Monthly forest coverage percentage for Kenya's key forests including Mau, Mount Kenya, and Aberdare ranges</p>
          </div>
          <Link to="/forest" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
            View Details
            <Eye className="h-4 w-4" />
          </Link>
        </div>
        {isLoadingForest ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={['dataMin - 1', 'dataMax + 1']} />
                <Area
                  type="monotone"
                  dataKey="coverage"
                  stroke="#10b981"
                  fill="url(#forestGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Climate Alerts */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Climate Alerts</h3>
            <Link to="/climate" className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
              View All
            </Link>
          </div>
          {isLoadingAlerts ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 text-red-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {weatherAlerts.length > 0 ? weatherAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className={`p-1.5 rounded-lg ${
                    alert.severity === 'critical' ? 'bg-red-500/20' :
                    alert.severity === 'high' ? 'bg-orange-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.severity === 'critical' ? 'text-red-400' :
                      alert.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{alert.type}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location} · {formatTimeAgo(alert.issued)}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>No active alerts</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Species Tracking */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Biodiversity Status</h3>
            <Link to="/biodiversity" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              Track Species
            </Link>
          </div>
          <div className="space-y-4">
            {speciesData.map((species) => (
              <div key={species.category} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Bird className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{species.category}</p>
                    <p className="text-xs text-slate-400">{species.count} documented</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${
                  species.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {species.trend === 'up' ? 
                    <ArrowUpRight className="h-4 w-4" /> : 
                    <ArrowDownRight className="h-4 w-4" />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section - Kenya Environmental Map */}
      <div id="dashboard-map-section" className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Kenya Environmental Intelligence Map</h3>
          <p className="text-slate-400 text-sm">Monitor Kenya's key ecosystems: Mau Forest, Mount Kenya, Maasai Mara, Tsavo, and coastal regions</p>
        </div>
        <div className="h-80">
          <LeafletMap
            center={[-0.7893, 36.8219]}
            zoom={6}
          />
        </div>
      </div>
    </div>
  );
};

// --- Hyperlocal Insights Component ---
const HyperlocalInsights: React.FC = () => {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kenyaData, setKenyaData] = useState<any>(null);
  const [nearestKenyaLocation, setNearestKenyaLocation] = useState<string>('Nairobi');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLocation = {lat: pos.coords.latitude, lon: pos.coords.longitude};
          setLocation(userLocation);
          
          // Find nearest Kenya location
          const nearest = KENYA_LOCATIONS.reduce((prev, curr) => {
            const prevDistance = Math.sqrt(
              Math.pow(prev.coordinates.lat - userLocation.lat, 2) + 
              Math.pow(prev.coordinates.lng - userLocation.lon, 2)
            );
            const currDistance = Math.sqrt(
              Math.pow(curr.coordinates.lat - userLocation.lat, 2) + 
              Math.pow(curr.coordinates.lng - userLocation.lon, 2)
            );
            return currDistance < prevDistance ? curr : prev;
          });
          
          setNearestKenyaLocation(nearest.name);
        },
        (err) => setError('Location access denied. Showing data for Nairobi, Kenya.')
      );
    } else {
      setError('Geolocation not supported. Showing data for Nairobi, Kenya.');
    }
  }, []);

  useEffect(() => {
    const fetchKenyaData = async () => {
      setLoading(true);
      try {
        const [weatherData, airQualityData, forestData] = await Promise.all([
          getKenyaWeatherData(nearestKenyaLocation),
          getKenyaAirQuality(nearestKenyaLocation),
          getKenyaForestData()
        ]);

        setKenyaData({
          weather: weatherData,
          airQuality: airQualityData,
          forests: forestData,
          location: KENYA_LOCATIONS.find(loc => loc.name === nearestKenyaLocation)
        });
      } catch (error) {
        console.error('Error fetching Kenya data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKenyaData();
  }, [nearestKenyaLocation]);

  return (
    <div className="bg-slate-900/70 border border-emerald-700/30 rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold text-emerald-400 mb-2">🇰🇪 Kenya Hyperlocal Insights</h2>
      
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 text-emerald-400 animate-spin" />
          <p className="text-slate-400">Fetching real-time Kenya environmental data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">📍 Your Location</h3>
              {location ? (
                <div>
                  <p className="text-emerald-300">Nearest Kenya City: <span className="font-bold">{nearestKenyaLocation}</span></p>
                  <p className="text-slate-400 text-sm">Lat: {location.lat.toFixed(3)}, Lon: {location.lon.toFixed(3)}</p>
                  {kenyaData?.location && (
                    <p className="text-slate-400 text-sm">Region: {kenyaData.location.region}</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-400">{error || 'Detecting location...'}</p>
              )}
            </div>

            {/* Weather Data */}
            {kenyaData?.weather && (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">🌤️ Current Weather</h3>
                <p className="text-blue-300">{kenyaData.weather.temperature}°C, {kenyaData.weather.description}</p>
                <p className="text-slate-400 text-sm">Humidity: {kenyaData.weather.humidity}% | Wind: {kenyaData.weather.windSpeed} m/s</p>
              </div>
            )}
          </div>

          {/* Environmental Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Air Quality */}
            {kenyaData?.airQuality && (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">💨 Air Quality</h3>
                <p className={`font-bold ${kenyaData.airQuality.status === 'Good' ? 'text-green-400' : 
                  kenyaData.airQuality.status === 'Moderate' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {kenyaData.airQuality.status} (AQI: {kenyaData.airQuality.aqi})
                </p>
                <p className="text-slate-400 text-sm">PM2.5: {kenyaData.airQuality.pm25} μg/m³</p>
              </div>
            )}

            {/* Forest Data */}
            {kenyaData?.forests && kenyaData.forests.length > 0 && (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">🌲 Nearest Forest</h3>
                <p className="text-emerald-300 font-bold">{kenyaData.forests[0].region}</p>
                <p className="text-slate-400 text-sm">Coverage: {kenyaData.forests[0].coverage}%</p>
                <p className="text-slate-400 text-sm">Status: {kenyaData.forests[0].status}</p>
              </div>
            )}

            {/* Local Challenges */}
            {kenyaData?.location?.mainChallenges && (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">⚠️ Local Challenges</h3>
                {kenyaData.location.mainChallenges.slice(0, 2).map((challenge: string, index: number) => (
                  <p key={index} className="text-red-300 text-sm">• {challenge}</p>
                ))}
              </div>
            )}
          </div>

          {/* Action Suggestions */}
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
            <h3 className="text-emerald-300 font-semibold mb-2">💡 Recommended Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p className="text-slate-300">• Monitor local air quality via NEMA alerts</p>
              <p className="text-slate-300">• Support {nearestKenyaLocation} community conservation</p>
              <p className="text-slate-300">• Join local reforestation initiatives</p>
              <p className="text-slate-300">• Report environmental issues to authorities</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
