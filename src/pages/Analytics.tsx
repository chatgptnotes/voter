import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TrendingUp, BarChart3, Activity, Calendar, Users, MessageCircle, Eye, Brain, Target, Zap, Database, UserCheck, MapPin, Vote, TrendingDown, AlertCircle } from 'lucide-react';
import SocialMediaMonitoring from '../components/SocialMediaMonitoring';
import CompetitorTracking from '../components/CompetitorTracking';
import AIInsightsEngine from '../components/AIInsightsEngine';
import VoterDatabase from '../components/VoterDatabase';
import FieldWorkerManagement from '../components/FieldWorkerManagement';
import { useSentimentData, useTrendData } from '../hooks/useSentimentData';
import { calculateSentimentTrend, getTopIssues, formatNumber } from '../utils/dataProcessing';
import { CHART_COLORS } from '../utils/constants';
import { TN_POLITICAL_PARTIES, TN_CASTE_DEMOGRAPHICS, TN_ELECTION_ISSUES, TN_2021_ELECTION_RESULTS } from '../config/tamilnadu-config';
import { tamilNaduDistricts, allDistricts } from '../data/tamilnadu-data';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeChart, setActiveChart] = useState('sentiment-overview');
  const [activeTab, setActiveTab] = useState('tn-demographics');

  const { data: sentimentData } = useSentimentData();
  const { data: trendData } = useTrendData(timeRange);
  // const { data: influencerData } = useInfluencerData();

  const sentimentTrends = trendData ? calculateSentimentTrend(trendData) : [];
  const topIssues = sentimentData ? getTopIssues(sentimentData) : [];

  const engagementData = [
    { platform: 'Twitter', engagement: 85, reach: 25000, sentiment: 0.68 },
    { platform: 'Facebook', engagement: 72, reach: 32000, sentiment: 0.54 },
    { platform: 'Instagram', engagement: 78, reach: 18000, sentiment: 0.72 },
    { platform: 'YouTube', engagement: 65, reach: 22000, sentiment: 0.58 },
    { platform: 'LinkedIn', engagement: 68, reach: 15000, sentiment: 0.71 }
  ];

  const demographicData = [
    { age: '18-25', sentiment: 0.62, count: 1200 },
    { age: '26-35', sentiment: 0.58, count: 1800 },
    { age: '36-45', sentiment: 0.65, count: 2100 },
    { age: '46-55', sentiment: 0.71, count: 1600 },
    { age: '55+', sentiment: 0.68, count: 1400 }
  ];

  const correlationData = [
    { issue: 'Jobs', sentiment: 0.65, importance: 0.85, volume: 1200 },
    { issue: 'Health', sentiment: 0.72, importance: 0.78, volume: 980 },
    { issue: 'Infrastructure', sentiment: 0.52, importance: 0.65, volume: 856 },
    { issue: 'Education', sentiment: 0.58, importance: 0.72, volume: 1100 },
    { issue: 'Law & Order', sentiment: 0.54, importance: 0.58, volume: 642 }
  ];

  const chartTypes = [
    { id: 'sentiment-overview', label: 'Sentiment Overview', icon: BarChart3 },
    { id: 'trend-analysis', label: 'Trend Analysis', icon: TrendingUp },
    { id: 'engagement-metrics', label: 'Engagement Metrics', icon: Activity },
    { id: 'demographic-breakdown', label: 'Demographics', icon: Users },
    { id: 'correlation-analysis', label: 'Correlation Analysis', icon: Eye }
  ];

  const kpis = [
    { 
      label: 'Avg Sentiment', 
      value: sentimentData ? `${Math.round(sentimentData.reduce((sum, item) => sum + item.sentiment, 0) / sentimentData.length * 100)}%` : '0%',
      change: '+3.2%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    { 
      label: 'Total Mentions', 
      value: formatNumber(8450),
      change: '+12%',
      icon: MessageCircle,
      color: 'text-blue-600'
    },
    { 
      label: 'Reach', 
      value: formatNumber(125000),
      change: '+8%',
      icon: Users,
      color: 'text-purple-600'
    },
    { 
      label: 'Engagement Rate', 
      value: '4.2%',
      change: '+0.8%',
      icon: Activity,
      color: 'text-orange-600'
    }
  ];

  const tabs = [
    { id: 'tn-demographics', label: 'TN Demographics', icon: MapPin },
    { id: 'traditional', label: 'Traditional Analytics', icon: BarChart3 },
    { id: 'social-media', label: 'Social Media Monitoring', icon: MessageCircle },
    { id: 'competitor', label: 'Competitor Tracking', icon: Target },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'voter-database', label: 'Voter Database', icon: Database },
    { id: 'field-workers', label: 'Field Workers', icon: UserCheck }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics Suite</h1>
          <p className="text-gray-600">Comprehensive political intelligence and competitive analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tn-demographics' && (
        <div className="space-y-6">
          {/* TN Overview KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Voters (TN)</p>
                  <p className="text-2xl font-bold text-gray-900">6.28 Cr</p>
                  <p className="text-sm text-green-600">+2.3% from 2021</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Districts</p>
                  <p className="text-2xl font-bold text-gray-900">38 TN + 4 PY</p>
                  <p className="text-sm text-blue-600">42 Districts</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Constituencies</p>
                  <p className="text-2xl font-bold text-gray-900">234 + 30</p>
                  <p className="text-sm text-orange-600">264 Total</p>
                </div>
                <Vote className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">TVK Priority Voters</p>
                  <p className="text-2xl font-bold text-gray-900">45.5 Cr</p>
                  <p className="text-sm text-green-600">72% of electorate</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Caste Demographics & 2021 Election Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Caste Demographics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Caste Demographics (Tamil Nadu)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'OBC (பிற்படுத்தப்பட்டோர்)', value: TN_CASTE_DEMOGRAPHICS.OBC.percentage, color: '#3b82f6' },
                      { name: 'MBC (மிகப் பிற்படுத்தப்பட்டோர்)', value: TN_CASTE_DEMOGRAPHICS.MBC.percentage, color: '#8b5cf6' },
                      { name: 'SC (தாழ்த்தப்பட்டோர்)', value: TN_CASTE_DEMOGRAPHICS.SC.percentage, color: '#ec4899' },
                      { name: 'FC (முன்னோர்)', value: TN_CASTE_DEMOGRAPHICS.FC.percentage, color: '#f59e0b' },
                      { name: 'ST (பழங்குடியினர்)', value: TN_CASTE_DEMOGRAPHICS.ST.percentage, color: '#10b981' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.split('(')[0].trim()}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { color: '#3b82f6' },
                      { color: '#8b5cf6' },
                      { color: '#ec4899' },
                      { color: '#f59e0b' },
                      { color: '#10b981' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">OBC (Other Backward Classes)</span>
                  <span className="font-medium text-gray-900">54% • 3.39 Cr voters</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">MBC (Most Backward Classes)</span>
                  <span className="font-medium text-gray-900">20% • 1.26 Cr voters</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">SC (Scheduled Castes)</span>
                  <span className="font-medium text-gray-900">20% • 1.26 Cr voters</span>
                </div>
              </div>
            </div>

            {/* 2021 Election Results */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2021 Assembly Election Results</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { party: 'DMK', seats: TN_2021_ELECTION_RESULTS.DMK.seats, voteShare: TN_2021_ELECTION_RESULTS.DMK.voteShare, color: '#FF0000' },
                  { party: 'AIADMK', seats: TN_2021_ELECTION_RESULTS.AIADMK.seats, voteShare: TN_2021_ELECTION_RESULTS.AIADMK.voteShare, color: '#006400' },
                  { party: 'BJP', seats: TN_2021_ELECTION_RESULTS.BJP.seats, voteShare: TN_2021_ELECTION_RESULTS.BJP.voteShare, color: '#FF9933' },
                  { party: 'Congress', seats: TN_2021_ELECTION_RESULTS.Congress.seats, voteShare: TN_2021_ELECTION_RESULTS.Congress.voteShare, color: '#00BFFF' },
                  { party: 'PMK', seats: TN_2021_ELECTION_RESULTS.PMK.seats, voteShare: TN_2021_ELECTION_RESULTS.PMK.voteShare, color: '#FFFF00' },
                  { party: 'Others', seats: TN_2021_ELECTION_RESULTS.Others.seats, voteShare: TN_2021_ELECTION_RESULTS.Others.voteShare, color: '#808080' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="party" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Seats Won', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Vote Share %', angle: 90, position: 'insideRight' }} />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      name === 'seats' ? value : `${value}%`,
                      name === 'seats' ? 'Seats Won' : 'Vote Share'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="seats" fill="#8884d8" name="Seats" />
                  <Bar yAxisId="right" dataKey="voteShare" fill="#82ca9d" name="Vote Share %" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-2">Key Insights:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>DMK alliance won with 159 seats (67.9% seats)</li>
                  <li>AIADMK alliance got 75 seats (32.1% seats)</li>
                  <li>Vote share gap was only 5.5% (DMK+ 47.4% vs AIADMK+ 41.9%)</li>
                  <li>TVK can target swing voters and young first-time voters</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Political Parties & TN-Specific Issues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Political Party Landscape */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Political Party Landscape</h3>
              <div className="space-y-3">
                {Object.entries(TN_POLITICAL_PARTIES).map(([key, party]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: party.color }}
                      ></div>
                      <div>
                        <div className="font-medium text-gray-900">{party.shortName} ({party.name})</div>
                        <div className="text-xs text-gray-600">{party.leader}</div>
                      </div>
                    </div>
                    {key === 'TVK' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Our Party
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* TN-Specific Issues (Dravidian Politics Context) */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tamil Nadu Priority Issues (தமிழக முக்கிய பிரச்சினைகள்)</h3>
              <div className="space-y-3">
                {Object.entries(TN_ELECTION_ISSUES).map(([key, issue]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-gray-900">{issue.name}</div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        issue.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        issue.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {issue.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{issue.nameInTamil}</div>
                    <div className="text-xs text-gray-500 mt-1">{issue.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* District-wise Voter Distribution & TVK Target Segments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 10 Districts by Voters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Districts by Voter Population</h3>
              <div className="space-y-2">
                {Object.values(tamilNaduDistricts)
                  .sort((a, b) => b.totalVoters - a.totalVoters)
                  .slice(0, 10)
                  .map((district, index) => (
                    <div key={district.code} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center">
                        <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold rounded mr-3">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">{district.name}</div>
                          <div className="text-xs text-gray-500">{district.constituencies.length} constituencies</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{(district.totalVoters / 100000).toFixed(2)}L</div>
                        <div className="text-xs text-gray-500">{district.area} km²</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* TVK Priority Voter Segments */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">TVK Priority Voter Segments</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">CRITICAL Priority</div>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Youth (18-25): <span className="font-medium">8.5 Cr voters • 75% win probability</span></li>
                    <li>• Private Sector: <span className="font-medium">10 Cr • 70% win probability</span></li>
                    <li>• Students: <span className="font-medium">5 Cr • 80% win probability</span></li>
                    <li>• Unemployed Youth: <span className="font-medium">6 Cr • 75% win probability</span></li>
                    <li>• Urban Voters: <span className="font-medium">25 Cr • 70% win probability</span></li>
                  </ul>
                </div>

                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">HIGH Priority</div>
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• OBC Communities: <span className="font-medium">25 Cr • 60% win probability</span></li>
                    <li>• Farmers: <span className="font-medium">8 Cr • 55% win probability</span></li>
                    <li>• SC Communities: <span className="font-medium">10 Cr • 55% win probability</span></li>
                    <li>• Laborers: <span className="font-medium">12 Cr • 60% win probability</span></li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-1">Strategic Insight:</div>
                  <p className="text-xs text-blue-700">
                    Vijay's cinema popularity gives TVK a natural advantage among youth (18-35) and urban voters.
                    Focus on social justice messaging to win OBC/MBC/SC votes from DMK. Target first-time voters
                    who haven't developed party loyalty yet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dravidian Politics Context Alert */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Brain className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dravidian Politics Context (திராவிட அரசியல் சூழல்)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Historical Dominance:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>DMK & AIADMK dominate since 1967</li>
                      <li>Anti-Brahmin, social justice foundation</li>
                      <li>Strong caste-based voting patterns</li>
                      <li>Cinema-politics nexus (MGR, Jayalalithaa, Vijayakanth)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-2">TVK Opportunity:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Vijay = Cinema icon (like MGR/Rajinikanth)</li>
                      <li>Young, aspirational image appeals to youth</li>
                      <li>No corruption baggage (fresh alternative)</li>
                      <li>Can break DMK-AIADMK duopoly with right messaging</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-900">Key Strategy:</span> Position TVK as the "Third Front" -
                    pro-Tamil, pro-social justice (like DMK) but without corruption (unlike both DMK & AIADMK).
                    Target first-time voters who haven't inherited family party loyalties. Use Vijay's mass appeal
                    to cut across caste lines while maintaining Dravidian ideology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'traditional' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className={`text-sm ${kpi.color}`}>{kpi.change}</p>
              </div>
              <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Types</h3>
            <div className="space-y-2">
              {chartTypes.map(chart => (
                <button
                  key={chart.id}
                  onClick={() => setActiveChart(chart.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeChart === chart.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <chart.icon className="w-4 h-4 mr-3" />
                  {chart.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {activeChart === 'sentiment-overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment by Issue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sentimentData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="issue" />
                    <YAxis domain={[0, 1]} tickFormatter={(value) => `${Math.round(value * 100)}%`} />
                    <Tooltip formatter={(value: any) => [`${Math.round(value * 100)}%`, 'Sentiment']} />
                    <Bar dataKey="sentiment" fill={CHART_COLORS.PRIMARY} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeChart === 'trend-analysis' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trends Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} tickFormatter={(value) => `${Math.round(value * 100)}%`} />
                    <Tooltip formatter={(value: any, name: string) => [`${Math.round(value * 100)}%`, name]} />
                    <Line type="monotone" dataKey="jobs" stroke={CHART_COLORS.PRIMARY} strokeWidth={2} />
                    <Line type="monotone" dataKey="health" stroke={CHART_COLORS.SUCCESS} strokeWidth={2} />
                    <Line type="monotone" dataKey="infrastructure" stroke={CHART_COLORS.WARNING} strokeWidth={2} />
                    <Line type="monotone" dataKey="education" stroke={CHART_COLORS.INFO} strokeWidth={2} />
                    <Line type="monotone" dataKey="lawOrder" stroke={CHART_COLORS.DANGER} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeChart === 'engagement-metrics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Engagement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill={CHART_COLORS.PRIMARY} />
                    <Bar dataKey="reach" fill={CHART_COLORS.SUCCESS} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeChart === 'demographic-breakdown' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment by Age Group</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={demographicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis domain={[0, 1]} tickFormatter={(value) => `${Math.round(value * 100)}%`} />
                    <Tooltip formatter={(value: any) => [`${Math.round(value * 100)}%`, 'Sentiment']} />
                    <Bar dataKey="sentiment" fill={CHART_COLORS.INFO} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeChart === 'correlation-analysis' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment vs Importance Correlation</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="sentiment" 
                      domain={[0, 1]} 
                      tickFormatter={(value) => `${Math.round(value * 100)}%`}
                      label={{ value: 'Sentiment', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      dataKey="importance" 
                      domain={[0, 1]} 
                      tickFormatter={(value) => `${Math.round(value * 100)}%`}
                      label={{ value: 'Importance', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'volume' ? value : `${Math.round(value * 100)}%`, 
                        name
                      ]}
                      labelFormatter={(value, payload) => payload?.[0]?.payload?.issue || value}
                    />
                    <Scatter dataKey="volume" fill={CHART_COLORS.PRIMARY} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Issues</h3>
          <div className="space-y-3">
            {topIssues.slice(0, 5).map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{issue.issue}</div>
                  <div className="text-sm text-gray-600 capitalize">{issue.polarity} • {issue.emotion}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{Math.round(issue.sentiment * 100)}%</div>
                  <div className="text-sm text-gray-600">Sentiment</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trends</h3>
          <div className="space-y-3">
            {sentimentTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    trend.trend === 'up' ? 'bg-green-500' : 
                    trend.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="font-medium text-gray-900">{trend.issue}</div>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    trend.trend === 'up' ? 'text-green-600' : 
                    trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {trend.trend === 'up' ? '↑' : trend.trend === 'down' ? '↓' : '→'} {Math.abs(trend.change)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
      )}

      {activeTab === 'social-media' && <SocialMediaMonitoring />}
      
      {activeTab === 'competitor' && <CompetitorTracking />}
      
      {activeTab === 'ai-insights' && <AIInsightsEngine />}
      
      {activeTab === 'voter-database' && <VoterDatabase />}
      
      {activeTab === 'field-workers' && <FieldWorkerManagement />}
    </div>
  );
}