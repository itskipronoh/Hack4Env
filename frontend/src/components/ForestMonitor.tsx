import React, { useState, useEffect } from 'react';
import { 
  TreePine, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Calendar, 
  Filter, 
  Eye, 
  Download, 
  Loader2,
  AlertTriangle,
  Shield,
  Users,
  Target,
  Zap,
  CheckCircle,
  Clock,
  Bell,
  ArrowRight,
  Lightbulb,
  Activity,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip
} from 'recharts';
import { getForestCoverageData, getRegionalForestData } from '../utils/forestData';
import type { ForestCoverageData, RegionForestData } from '../utils/forestData';

// Actionable Insights Interfaces
interface ActionableInsight {
  id: string;
  type: 'alert' | 'opportunity' | 'recommendation' | 'urgent';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
  timeframe: string;
  stakeholders: string[];
  location: string;
  progress?: number;
}

interface CommunityAction {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impact: 'high' | 'medium' | 'low';
  cost: 'free' | 'low' | 'medium' | 'high';
  participants: number;
  timeline: string;
  category: 'restoration' | 'monitoring' | 'education' | 'protection';
}

const ForestMonitor: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [selectedRegion, setSelectedRegion] = useState('national');
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'actions' | 'alerts'>('overview');

  // State for data from APIs
  const [forestData, setForestData] = useState<ForestCoverageData[]>([]);
  const [regionData, setRegionData] = useState<RegionForestData[]>([]);
  const [actionableInsights, setActionableInsights] = useState<ActionableInsight[]>([]);
  const [communityActions, setCommunityActions] = useState<CommunityAction[]>([]);

  // Loading states
  const [isLoadingForest, setIsLoadingForest] = useState(true);
  const [isLoadingRegions, setIsLoadingRegions] = useState(true);

  // Key metrics
  const [nationalCoverage, setNationalCoverage] = useState<number | null>(null);
  const [coverageChange, setCoverageChange] = useState<string | null>(null);
  const [forestLoss, setForestLoss] = useState<string | null>(null);
  const [forestGain, setForestGain] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  // Generate actionable insights based on forest data
  const generateActionableInsights = (forestData: ForestCoverageData[], regionData: RegionForestData[]) => {
    const insights: ActionableInsight[] = [];

    // Critical deforestation alerts
    const criticalRegions = regionData.filter(r => r.status === 'critical' || r.status === 'declining');
    criticalRegions.forEach(region => {
      insights.push({
        id: `critical-${region.region}`,
        type: 'alert',
        severity: region.status === 'critical' ? 'critical' : 'high',
        title: `Urgent Action Needed: ${region.region}`,
        description: `Forest coverage has declined to ${region.coverage}% with a ${region.change} change trend. Immediate intervention required.`,
        action: 'Deploy community forest guards and implement emergency conservation measures',
        impact: 'Prevent further 2-5% forest loss over next 6 months',
        timeframe: 'Next 30 days',
        stakeholders: ['County Government', 'Kenya Forest Service', 'Local Communities', 'NGOs'],
        location: region.region,
        progress: 0
      });
    });

    // Restoration opportunities
    const improvingRegions = regionData.filter(r => r.status === 'improving' || r.status === 'recovering');
    improvingRegions.forEach(region => {
      insights.push({
        id: `opportunity-${region.region}`,
        type: 'opportunity',
        severity: 'medium',
        title: `Scale Up Success: ${region.region}`,
        description: `Positive trend with ${region.change} improvement. Perfect opportunity to accelerate restoration efforts.`,
        action: 'Expand successful restoration programs to neighboring degraded areas',
        impact: 'Potential to restore additional 500-1000 hectares',
        timeframe: 'Next 3-6 months',
        stakeholders: ['Local Communities', 'NEMA', 'Development Partners'],
        location: region.region,
        progress: 35
      });
    });

    // Data-driven recommendations
    if (forestData.length > 2) {
      const trend = forestData[forestData.length - 1].coverage - forestData[0].coverage;
      if (trend < -1) {
        insights.push({
          id: 'national-trend',
          type: 'recommendation',
          severity: 'high',
          title: 'National Forest Protection Strategy Needed',
          description: `National coverage declining by ${Math.abs(trend).toFixed(1)}% over monitoring period. Policy intervention required.`,
          action: 'Convene multi-stakeholder forest protection summit and develop county-level action plans',
          impact: 'Stabilize national forest coverage and reverse declining trend',
          timeframe: 'Next 60 days',
          stakeholders: ['National Government', 'County Governments', 'KFS', 'Communities'],
          location: 'National',
          progress: 0
        });
      }
    }

    return insights;
  };

  // Generate community actions
  const generateCommunityActions = (): CommunityAction[] => {
    return [
      {
        id: 'tree-planting',
        title: 'Community Tree Planting Initiative',
        description: 'Organize weekly tree planting sessions targeting degraded areas identified through satellite monitoring',
        difficulty: 'easy',
        impact: 'high',
        cost: 'low',
        participants: 150,
        timeline: '3-6 months',
        category: 'restoration'
      },
      {
        id: 'forest-monitoring',
        title: 'Citizen Forest Monitoring Network',
        description: 'Train community members to use mobile apps for real-time forest monitoring and reporting',
        difficulty: 'medium',
        impact: 'high',
        cost: 'free',
        participants: 45,
        timeline: '1-2 months',
        category: 'monitoring'
      },
      {
        id: 'school-program',
        title: 'School Environmental Education Program',
        description: 'Implement forest conservation curriculum in local schools with hands-on restoration activities',
        difficulty: 'medium',
        impact: 'medium',
        cost: 'low',
        participants: 300,
        timeline: '6-12 months',
        category: 'education'
      },
      {
        id: 'illegal-logging',
        title: 'Anti-Illegal Logging Patrol',
        description: 'Establish community-based forest protection patrols using GPS tracking and reporting systems',
        difficulty: 'hard',
        impact: 'high',
        cost: 'medium',
        participants: 25,
        timeline: 'Ongoing',
        category: 'protection'
      }
    ];
  };

  // Risk assessment data for visualization
  const riskData = [
    { name: 'Deforestation Risk', value: 78, color: '#ef4444' },
    { name: 'Climate Impact', value: 85, color: '#f97316' },
    { name: 'Biodiversity Loss', value: 72, color: '#eab308' },
    { name: 'Community Vulnerability', value: 68, color: '#06b6d4' }
  ];

  // Impact potential data
  const impactData = [
    { action: 'Tree Planting', current: 65, potential: 90, participants: 150 },
    { action: 'Monitoring', current: 40, potential: 85, participants: 45 },
    { action: 'Education', current: 30, potential: 75, participants: 300 },
    { action: 'Protection', current: 55, potential: 95, participants: 25 }
  ];

  // Stakeholder engagement data
  const stakeholderData = [
    { name: 'Local Communities', engagement: 75, capacity: 85 },
    { name: 'County Government', engagement: 60, capacity: 70 },
    { name: 'NGOs', engagement: 90, capacity: 80 },
    { name: 'Private Sector', engagement: 40, capacity: 90 },
    { name: 'Schools', engagement: 65, capacity: 75 }
  ];

  // Fetch forest coverage data when time range or region changes
  useEffect(() => {
    const fetchForestData = async () => {
      setIsLoadingForest(true);
      try {
        const data = await getForestCoverageData(selectedTimeRange, selectedRegion);
        setForestData(data);

        // Calculate key metrics
        if (data.length > 0) {
          const latestCoverage = data[data.length - 1].coverage;
          setNationalCoverage(latestCoverage);

          // Risk assessment based on coverage
          if (latestCoverage < 30) setRiskLevel('critical');
          else if (latestCoverage < 50) setRiskLevel('high');
          else if (latestCoverage < 70) setRiskLevel('medium');
          else setRiskLevel('low');

          if (data.length > 1) {
            const previousCoverage = data[data.length - 2].coverage;
            const change = latestCoverage - previousCoverage;
            const changePercent = ((change / previousCoverage) * 100).toFixed(1);
            setCoverageChange(`${change >= 0 ? '+' : ''}${changePercent}%`);
          }

          if (data.length > 0) {
            const latestData = data[data.length - 1];
            setForestLoss(`${latestData.loss.toFixed(1)}K`);
            setForestGain(`${latestData.gain.toFixed(1)}K`);
          }
        }
      } catch (error) {
        console.error('Error fetching forest data:', error);
      } finally {
        setIsLoadingForest(false);
      }
    };

    fetchForestData();
  }, [selectedTimeRange, selectedRegion]);

  // Fetch regional data and generate insights
  useEffect(() => {
    const fetchRegionData = async () => {
      setIsLoadingRegions(true);
      try {
        const data = await getRegionalForestData();
        setRegionData(data);
        
        // Generate actionable insights based on the data
        const insights = generateActionableInsights(forestData, data);
        setActionableInsights(insights);
        
        // Generate community actions
        const actions = generateCommunityActions();
        setCommunityActions(actions);
        
      } catch (error) {
        console.error('Error fetching region data:', error);
      } finally {
        setIsLoadingRegions(false);
      }
    };

    fetchRegionData();
  }, [forestData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improving': return 'text-emerald-400 bg-emerald-500/20';
      case 'recovering': return 'text-blue-400 bg-blue-500/20';
      case 'stable': return 'text-slate-400 bg-slate-500/20';
      case 'declining': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5" />;
      case 'opportunity': return <Target className="h-5 w-5" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5" />;
      case 'urgent': return <Zap className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'restoration': return 'bg-emerald-500/20 text-emerald-400';
      case 'monitoring': return 'bg-blue-500/20 text-blue-400';
      case 'education': return 'bg-purple-500/20 text-purple-400';
      case 'protection': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-400 bg-emerald-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex items-center justify-center w-full h-40">
      <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">EcoSentinel Forest Intelligence</h1>
          <p className="text-slate-400 mt-1">Community-driven forest monitoring with actionable insights for Kenya's conservation</p>
          <div className="flex items-center gap-4 mt-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(riskLevel)}`}>
              Risk Level: {riskLevel.toUpperCase()}
            </div>
            <div className="text-xs text-slate-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            disabled={isLoadingForest}
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            disabled={isLoadingForest}
          >
            <option value="national">National View</option>
            <option value="central">Central Kenya</option>
            <option value="coastal">Coastal Forests</option>
            <option value="mount-kenya">Mount Kenya</option>
            <option value="aberdares">Aberdare Ranges</option>
            <option value="mau">Mau Forest Complex</option>
            <option value="kakamega">Kakamega Forest</option>
            <option value="tsavo">Tsavo Ecosystem</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700/50 pb-4">
        {[
          { id: 'overview', label: 'Forest Overview', icon: TreePine },
          { id: 'insights', label: 'Actionable Insights', icon: Lightbulb },
          { id: 'actions', label: 'Community Actions', icon: Users },
          { id: 'alerts', label: 'Risk Assessment', icon: AlertTriangle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <TreePine className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">National Coverage</p>
                  {isLoadingForest ? (
                    <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-white">{nationalCoverage?.toFixed(1)}%</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isLoadingForest ? (
                  <div className="animate-pulse h-4 w-24 bg-slate-700 rounded"></div>
                ) : coverageChange && parseFloat(coverageChange) >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">{coverageChange} vs last month</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">{coverageChange} vs last month</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <TrendingDown className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Forest Loss</p>
                  {isLoadingForest ? (
                    <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-white">{forestLoss}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm font-medium">hectares this month</span>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Forest Restoration</p>
                  {isLoadingForest ? (
                    <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-white">{forestGain}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">hectares restored</span>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Active Participants</p>
                  <p className="text-2xl font-bold text-white">
                    {communityActions.reduce((sum, action) => sum + action.participants, 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">community members</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Forest Coverage Trend */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Kenya Forest Coverage Trend</h3>
                  <p className="text-slate-400 text-sm">Monthly forest coverage percentage over time</p>
                </div>
              </div>
              {isLoadingForest ? (
                <LoadingIndicator />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forestData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '12px',
                          color: '#f1f5f9'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="coverage"
                        stroke="#10b981"
                        fill="url(#forestGradient)"
                        strokeWidth={3}
                      />
                      <defs>
                        <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Forest Loss vs Restoration */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Forest Loss vs Restoration</h3>
                  <p className="text-slate-400 text-sm">Comparison of deforestation and restoration efforts</p>
                </div>
              </div>
              {isLoadingForest ? (
                <LoadingIndicator />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forestData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '12px',
                          color: '#f1f5f9'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="loss"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="gain"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Forest Loss</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Forest Restoration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Overview */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Kenya Forest Regions Status</h3>
                <p className="text-slate-400 text-sm">Coverage and trend analysis by major forest regions in Kenya</p>
              </div>
            </div>
            {isLoadingRegions ? (
              <LoadingIndicator />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {regionData.map((region) => (
                  <div key={region.region} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white text-sm">{region.region}</h4>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(region.status)}`}>
                        {region.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Coverage</span>
                        <span className="text-white font-semibold">{region.coverage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Change</span>
                        <span className={`font-semibold ${
                          region.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {region.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Actionable Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-red-400 font-semibold text-xl">
                    {actionableInsights.filter(i => i.severity === 'critical').length}
                  </p>
                  <p className="text-red-300 text-sm">Critical Alerts</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-orange-400 font-semibold text-xl">
                    {actionableInsights.filter(i => i.severity === 'high').length}
                  </p>
                  <p className="text-orange-300 text-sm">High Priority</p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-emerald-400" />
                <div>
                  <p className="text-emerald-400 font-semibold text-xl">
                    {actionableInsights.filter(i => i.type === 'opportunity').length}
                  </p>
                  <p className="text-emerald-300 text-sm">Opportunities</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-blue-400 font-semibold text-xl">
                    {actionableInsights.filter(i => i.type === 'recommendation').length}
                  </p>
                  <p className="text-blue-300 text-sm">Recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Insights List */}
          <div className="space-y-4">
            {actionableInsights.map((insight) => (
              <div key={insight.id} className={`bg-slate-900/50 border rounded-2xl p-6 ${getSeverityColor(insight.severity)}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${getSeverityColor(insight.severity).replace('text-', 'bg-').replace('bg-', 'bg-').replace('/20', '/20')}`}>
                    {getActionIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                        {insight.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-4">{insight.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Recommended Action</p>
                        <p className="text-white">{insight.action}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Expected Impact</p>
                        <p className="text-emerald-400">{insight.impact}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{insight.timeframe}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{insight.location}</span>
                      </div>
                      {insight.progress !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${insight.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-slate-300">{insight.progress}%</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {insight.stakeholders.map((stakeholder) => (
                        <span key={stakeholder} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                          {stakeholder}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Actions Tab */}
      {activeTab === 'actions' && (
        <div className="space-y-6">
          {/* Action Impact Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Community Action Impact Potential</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="action" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        color: '#f1f5f9'
                      }}
                    />
                    <Bar dataKey="current" fill="#64748b" name="Current Impact" />
                    <Bar dataKey="potential" fill="#10b981" name="Potential Impact" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Stakeholder Engagement</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stakeholderData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="name" type="category" stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        color: '#f1f5f9'
                      }}
                    />
                    <Bar dataKey="engagement" fill="#3b82f6" name="Current Engagement" />
                    <Bar dataKey="capacity" fill="#22c55e" name="Capacity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Community Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityActions.map((action) => (
              <div key={action.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(action.category)}`}>
                      {action.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">{action.participants}</p>
                    <p className="text-slate-400 text-sm">participants</p>
                  </div>
                </div>

                <p className="text-slate-300 mb-4">{action.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Difficulty</p>
                    <p className={`font-medium ${getDifficultyColor(action.difficulty)}`}>
                      {action.difficulty}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Impact</p>
                    <p className={`font-medium ${action.impact === 'high' ? 'text-emerald-400' : action.impact === 'medium' ? 'text-yellow-400' : 'text-slate-400'}`}>
                      {action.impact}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Cost</p>
                    <p className={`font-medium ${action.cost === 'free' ? 'text-emerald-400' : action.cost === 'low' ? 'text-blue-400' : 'text-orange-400'}`}>
                      {action.cost}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">{action.timeline}</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-all">
                    Join Action
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Assessment Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Risk Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Forest Risk Assessment</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Risk Factors</h3>
              <div className="space-y-4">
                {riskData.map((risk) => (
                  <div key={risk.name} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <p className="text-white font-medium">{risk.name}</p>
                      <p className="text-slate-400 text-sm">Risk Level: {risk.value}%</p>
                    </div>
                    <div className="w-24 bg-slate-700 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full"
                        style={{ 
                          width: `${risk.value}%`,
                          backgroundColor: risk.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Early Warning System */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Early Warning System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <h4 className="text-red-400 font-semibold">Critical Alert</h4>
                </div>
                <p className="text-slate-300 text-sm mb-2">Mau Forest Complex showing rapid deforestation</p>
                <p className="text-red-300 text-xs">Action required within 48 hours</p>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-6 w-6 text-orange-400" />
                  <h4 className="text-orange-400 font-semibold">Monitoring Alert</h4>
                </div>
                <p className="text-slate-300 text-sm mb-2">Increased logging activity detected in Aberdare</p>
                <p className="text-orange-300 text-xs">Monitor closely over next week</p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  <h4 className="text-emerald-400 font-semibold">Positive Trend</h4>
                </div>
                <p className="text-slate-300 text-sm mb-2">Kakamega Forest showing recovery signs</p>
                <p className="text-emerald-300 text-xs">Continue current conservation efforts</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForestMonitor;