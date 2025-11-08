import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Lightbulb,
  BarChart3,
  Users,
  MessageCircle,
  Eye,
  Award,
  Activity,
  ArrowRight,
  Filter,
  Download,
  Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function AIInsightsEngine() {
  const [activeTab, setActiveTab] = useState('insights');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');

  // Tamil Nadu-specific AI-generated insights
  const insights = [
    {
      id: 1,
      title: 'DMK Stronghold Vulnerability in Western Districts',
      description: 'AI analysis reveals 18 DMK strongholds showing 12-15% sentiment decline in Coimbatore, Salem, Erode zones. Vanniyar and Gounder communities showing +34% positive shift toward TVK in past 30 days.',
      category: 'competitive',
      priority: 'high',
      confidence: 91,
      impact: 'high',
      actionable: true,
      timestamp: '8 minutes ago',
      source: 'TN Constituency Analytics',
      recommendations: [
        'Intensify TVK campaigning in 18 identified DMK-vulnerable seats (Gobichettipalayam, Dharmapuri, Namakkal West)',
        'Deploy Vanniyar and Gounder community leaders for booth-level mobilization',
        'Launch targeted social media campaign highlighting DMK unfulfilled promises in Western TN'
      ],
      metrics: {
        vulnerable_seats: '18/145',
        sentiment_shift: '+34%',
        conversion_potential: '22,000 voters'
      }
    },
    {
      id: 2,
      title: 'AIADMK Vote Bank Erosion - TVK Gain Opportunity',
      description: 'AIADMK showing 28% decline in Thevar-dominated southern constituencies. AI predicts 35 AIADMK seats vulnerable to TVK swing in Madurai, Virudhunagar, Ramanathapuram, Sivaganga districts.',
      category: 'competitive',
      priority: 'high',
      confidence: 89,
      impact: 'high',
      actionable: true,
      timestamp: '22 minutes ago',
      source: 'AIADMK Weakness Tracker',
      recommendations: [
        'Target 35 vulnerable AIADMK constituencies with TVK fresh leadership narrative',
        'Emphasize anti-corruption stance contrasting AIADMK factional fights',
        'Mobilize Thevar community through local influencers and youth networks'
      ],
      metrics: {
        aiadmk_decline: '-28%',
        target_seats: '35/66',
        tvk_projected_gain: '18-22 seats'
      }
    },
    {
      id: 3,
      title: 'BJP South Tamil Nadu Entry Strategy',
      description: 'BJP consolidating Hindu vote in 15 southern constituencies (Kanyakumari, Nagercoil, Ramanathapuram). AI detects +19% BJP sentiment growth but limited to 8-12% vote share ceiling. Potential spoiler effect in 23 three-way contests.',
      category: 'competitive',
      priority: 'medium',
      confidence: 86,
      impact: 'medium',
      actionable: true,
      timestamp: '1 hour ago',
      source: 'BJP Strategy Analysis',
      recommendations: [
        'Monitor BJP Hindu consolidation attempts in South TN - could split anti-DMK vote',
        'Position TVK as secular alternative to both DMK dynasty and BJP communalism',
        'Avoid direct BJP confrontation - focus on DMK corruption and AIADMK incompetence'
      ],
      metrics: {
        bjp_target_seats: '15',
        vote_share_ceiling: '8-12%',
        spoiler_risk: '23 constituencies'
      }
    },
    {
      id: 4,
      title: 'TVK Youth Wave in Urban Centers',
      description: 'Unprecedented 47% positive sentiment among 18-35 age group in Chennai, Coimbatore, Madurai metros. Social media virality score 3.2x higher than DMK/AIADMK. AI predicts urban youth turnout +12% if momentum sustains.',
      category: 'sentiment',
      priority: 'high',
      confidence: 93,
      impact: 'high',
      actionable: true,
      timestamp: '45 minutes ago',
      source: 'Urban Youth Analytics',
      recommendations: [
        'Launch aggressive digital campaign targeting 18-35 demographic across Instagram, YouTube, Twitter',
        'Organize mega youth rallies in Chennai (Marina Beach), Coimbatore (VOC Park), Madurai (Tamukkam Ground)',
        'Amplify Vijay star power through 2-minute viral video clips on employment, education, sports policy'
      ],
      metrics: {
        youth_sentiment: '+47%',
        viral_multiplier: '3.2x',
        projected_turnout: '+12%'
      }
    },
    {
      id: 5,
      title: 'Caste Coalition Strategy - Vanniyar-Dalit Alliance',
      description: 'AI detects emerging Vanniyar (14% population) and Dalit (20% SC) coalition possibility. Historical DMK-Dalit loyalty showing 8% erosion. If TVK positions as social justice party beyond Dravidian duopoly, potential to capture 18-22% combined vote share.',
      category: 'sentiment',
      priority: 'high',
      confidence: 88,
      impact: 'high',
      actionable: true,
      timestamp: '2 hours ago',
      source: 'Caste Voting Pattern AI',
      recommendations: [
        'Appoint prominent Dalit leaders as TVK spokespersons and district presidents',
        'Announce Vanniyar-Dalit welfare schemes (education scholarships, entrepreneurship loans)',
        'Counter DMK Dravidian narrative with inclusive social justice platform'
      ],
      metrics: {
        coalition_vote_share: '18-22%',
        dalit_erosion_dmk: '-8%',
        vanniyar_swing_potential: '+31%'
      }
    },
    {
      id: 6,
      title: 'Prohibition Agenda - Rural Women Mobilization',
      description: 'Total prohibition (மதுவிலக்கு) emerging as #1 issue in 78 rural constituencies. Women voters (52% electorate) showing +41% support for TVK prohibition stance. AI predicts 15-18 seat gain if issue dominates campaign narrative.',
      category: 'media',
      priority: 'medium',
      confidence: 85,
      impact: 'high',
      actionable: true,
      timestamp: '3 hours ago',
      source: 'Issue Salience Tracker',
      recommendations: [
        'Make prohibition centerpiece of TVK manifesto - contrast with DMK TASMAC revenue dependence',
        'Organize womens rallies in 78 identified rural constituencies',
        'Deploy celebrity endorsements (actors, athletes) supporting prohibition message'
      ],
      metrics: {
        women_support: '+41%',
        rural_constituencies: '78/234',
        seat_gain_potential: '15-18'
      }
    }
  ];

  // Tamil Nadu 2026 Election Seat Predictions
  const predictions = [
    {
      metric: 'TVK Seat Projection',
      current: 0,
      predicted: 42,
      confidence: 87,
      timeframe: '2026 Election',
      factors: ['Vijay star power', 'Youth mobilization', 'Anti-incumbency wave', 'Fresh leadership appeal']
    },
    {
      metric: 'DMK Seat Projection',
      current: 133,
      predicted: 98,
      confidence: 91,
      timeframe: '2026 Election',
      factors: ['Anti-incumbency fatigue', 'Corruption allegations', 'Western TN decline', 'Youth disillusionment']
    },
    {
      metric: 'AIADMK Seat Projection',
      current: 66,
      predicted: 52,
      confidence: 89,
      timeframe: '2026 Election',
      factors: ['Leadership vacuum post-Jayalalithaa', 'Internal factionalism', 'Southern districts erosion', 'TVK vote split']
    },
    {
      metric: 'BJP Seat Projection',
      current: 4,
      predicted: 8,
      confidence: 84,
      timeframe: '2026 Election',
      factors: ['Hindu consolidation in South', 'Kanyakumari-Nagercoil strongholds', 'Limited to 8-12% vote ceiling', 'Urban middle class appeal']
    },
    {
      metric: 'TVK Vote Share %',
      current: 0,
      predicted: 18.5,
      confidence: 86,
      timeframe: '2026 Election',
      factors: ['First-time voters (22%)', 'Urban youth wave', 'Caste coalition (Vanniyar-Dalit)', 'Digital campaign virality']
    },
    {
      metric: 'Voter Turnout Prediction',
      current: 71.8,
      predicted: 76.2,
      confidence: 88,
      timeframe: '2026 Election',
      factors: ['TVK excitement factor', 'Youth engagement surge', 'Women voters mobilization', 'Prohibition agenda']
    }
  ];

  // TVK Campaign Strategic Recommendations
  const recommendations = [
    {
      id: 1,
      type: 'strategic',
      title: 'Target 53 Swing Constituencies (18 DMK + 35 AIADMK)',
      description: 'AI identifies 53 high-probability TVK gain seats. Focus 70% campaign resources on these constituencies with booth-level micro-targeting. Deploy Vijay for 2-3 rallies per swing seat in final 45 days.',
      priority: 'high',
      effort: 'high',
      impact: 'high',
      timeline: 'Next 90 days',
      confidence: 91
    },
    {
      id: 2,
      type: 'content',
      title: 'Prohibition (மதுவிலக்கு) as Flagship Issue',
      description: 'Make total liquor ban the centerpiece of TVK manifesto. AI data shows 78 rural constituencies where prohibition alone could swing 8-12% votes. Position as anti-DMK TASMAC corruption issue.',
      priority: 'high',
      effort: 'medium',
      impact: 'high',
      timeline: '1-2 weeks',
      confidence: 89
    },
    {
      id: 3,
      type: 'targeting',
      title: 'Vanniyar-Dalit Coalition Building',
      description: 'Form strategic caste alliance combining Vanniyar (14%) and Dalit (20%) communities. Announce 50:50 leadership sharing, caste-neutral welfare schemes. AI predicts 18-22% consolidated vote share if alliance sustains.',
      priority: 'high',
      effort: 'high',
      impact: 'high',
      timeline: '2-4 weeks',
      confidence: 87
    },
    {
      id: 4,
      type: 'digital',
      title: 'Urban Youth Digital Blitzkrieg',
      description: '18-35 demographic showing 47% TVK support. Launch 60-second Vijay video clips on Instagram Reels, YouTube Shorts daily. AI suggests 8 PM - 10 PM posting time yields 3.2x engagement vs DMK/AIADMK.',
      priority: 'high',
      effort: 'low',
      impact: 'high',
      timeline: 'Immediate',
      confidence: 93
    },
    {
      id: 5,
      type: 'targeting',
      title: 'Women Voters Mobilization (52% Electorate)',
      description: 'Women showing +41% support for TVK prohibition stance. Organize women-only rallies in 78 rural constituencies. Deploy female celebrity campaigners (actresses, athletes). Promise 50% women representation in TVK governance.',
      priority: 'medium',
      effort: 'medium',
      impact: 'high',
      timeline: '3-6 weeks',
      confidence: 85
    },
    {
      id: 6,
      type: 'strategic',
      title: 'Avoid Direct BJP Confrontation',
      description: 'BJP limited to 8-12% vote ceiling but could split anti-DMK votes in 23 constituencies. Position TVK as secular, inclusive alternative. Focus attacks on DMK dynasty and AIADMK corruption, not BJP.',
      priority: 'medium',
      effort: 'low',
      impact: 'medium',
      timeline: 'Ongoing',
      confidence: 82
    }
  ];

  // Tamil Nadu AI-powered metrics
  const aiMetrics = [
    { name: 'TN Model Accuracy', value: 91.3, trend: '+3.8%' },
    { name: 'DMK/AIADMK/TVK Insights', value: 234, trend: '+47%' },
    { name: 'Constituency Predictions', value: 234, trend: '100%' },
    { name: 'Caste Pattern Detection', value: 96.7, trend: '+5.2%' }
  ];

  // Tamil Nadu sentiment trend prediction (6-month timeline to 2026 election)
  const trendData = [
    { week: 'Oct 2025', predicted: 12, actual: 14, confidence: 78 },
    { week: 'Nov 2025', predicted: 15, actual: 16, confidence: 81 },
    { week: 'Dec 2025', predicted: 17, actual: 18, confidence: 84 },
    { week: 'Jan 2026', predicted: 19, actual: 19, confidence: 87 },
    { week: 'Feb 2026', predicted: 21, actual: null, confidence: 89 },
    { week: 'Mar 2026', predicted: 23, actual: null, confidence: 91 }
  ];

  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart3 }
  ];

  const filteredInsights = insights.filter(insight => {
    const priorityMatch = priorityFilter === 'all' || insight.priority === priorityFilter;
    const confidenceMatch = confidenceFilter === 'all' || 
      (confidenceFilter === 'high' && insight.confidence >= 85) ||
      (confidenceFilter === 'medium' && insight.confidence >= 70 && insight.confidence < 85) ||
      (confidenceFilter === 'low' && insight.confidence < 70);
    return priorityMatch && confidenceMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sentiment': return Users;
      case 'competitive': return Target;
      case 'media': return MessageCircle;
      case 'content': return Eye;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-600" />
            AI Insights Engine
          </h2>
          <p className="text-gray-600">Artificial intelligence-powered strategic recommendations and predictions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <div className="flex items-center space-x-2 text-green-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">AI Active</span>
          </div>
        </div>
      </div>

      {/* AI Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {aiMetrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}{metric.name.includes('Accuracy') || metric.name.includes('Detection') ? '%' : ''}</div>
                <div className="text-sm text-gray-600">{metric.name}</div>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">{metric.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
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
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select 
              value={confidenceFilter} 
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Confidence</option>
              <option value="high">High (85%+)</option>
              <option value="medium">Medium (70-84%)</option>
                              <option value="low">Low (&lt;70%)</option>
            </select>
          </div>

          {/* AI Insights */}
          <div className="space-y-4">
            {filteredInsights.map((insight) => {
              const CategoryIcon = getCategoryIcon(insight.category);
              return (
                <div key={insight.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <CategoryIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{insight.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                            {insight.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{insight.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Source: {insight.source}</span>
                          <span>•</span>
                          <span>Confidence: {insight.confidence}%</span>
                          <span>•</span>
                          <span>{insight.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ width: `${insight.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{insight.confidence}%</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {Object.entries(insight.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-gray-900">{value}</div>
                        <div className="text-xs text-gray-600 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">AI Recommendations:</h4>
                    <ul className="space-y-2">
                      {insight.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                          <ArrowRight className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  {insight.actionable && (
                    <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors">
                      Take Action on This Insight
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="space-y-6">
          {/* Trend Predictions Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">TVK Vote Share Trend Predictions (Oct 2025 - Mar 2026)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 30]} label={{ value: 'Vote Share %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={3} name="Actual %" />
                <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" name="Predicted %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Prediction Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {predictions.map((prediction, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{prediction.metric}</h4>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{prediction.confidence}%</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current</span>
                    <span className="text-xl font-bold text-gray-900">{prediction.current}{prediction.metric === 'Social Engagement' ? '' : '%'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Predicted ({prediction.timeframe})</span>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-purple-600 mr-2">{prediction.predicted}{prediction.metric === 'Social Engagement' ? '' : '%'}</span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Key Factors:</span>
                    <ul className="space-y-1">
                      {prediction.factors.map((factor, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">AI-Generated Strategic Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                      <h4 className="text-lg font-semibold text-gray-900">{rec.title}</h4>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{rec.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-purple-500 rounded-full"
                        style={{ width: `${rec.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{rec.confidence}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 capitalize">{rec.effort}</div>
                    <div className="text-xs text-gray-600">Effort</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 capitalize">{rec.impact}</div>
                    <div className="text-xs text-gray-600">Impact</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">{rec.timeline}</div>
                    <div className="text-xs text-gray-600">Timeline</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 capitalize">{rec.type}</div>
                    <div className="text-xs text-gray-600">Type</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Implement Recommendation
                  </button>
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* AI Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prediction Accuracy</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '94.2%' }}></div>
                    </div>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pattern Recognition</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '97.8%' }}></div>
                    </div>
                    <span className="text-sm font-medium">97.8%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Time</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                    <span className="text-sm font-medium">0.3s avg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insight Categories</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Sentiment Analysis', value: 35, color: '#3B82F6' },
                      { name: 'Competitive Intel', value: 28, color: '#10B981' },
                      { name: 'Content Optimization', value: 22, color: '#F59E0B' },
                      { name: 'Trend Prediction', value: 15, color: '#8B5CF6' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Sentiment Analysis', value: 35, color: '#3B82F6' },
                      { name: 'Competitive Intel', value: 28, color: '#10B981' },
                      { name: 'Content Optimization', value: 22, color: '#F59E0B' },
                      { name: 'Trend Prediction', value: 15, color: '#8B5CF6' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Processing Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Processing Statistics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2.4M</div>
                <div className="text-sm text-gray-600">Data Points/Day</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600">Insights Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-gray-600">Action Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">0.3s</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">24/7</div>
                <div className="text-sm text-gray-600">Monitoring Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">12</div>
                <div className="text-sm text-gray-600">AI Models Running</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
