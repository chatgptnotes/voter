import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Star, 
  Phone, 
  MapPin, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Activity,
  Award,
  BarChart3,
  MessageCircle,
  Eye,
  Plus,
  Edit3,
  Search,
  Filter,
  Download,
  X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function FieldWorkerManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Tamil Nadu + Puducherry Districts (38 TN + 4 PY = 42)
  const tnDistricts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
    'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Thanjavur', 'Dindigul',
    'Kanchipuram', 'Cuddalore', 'Nagapattinam', 'Virudhunagar', 'Namakkal',
    'Krishnagiri', 'Karur', 'Sivagangai', 'Dharmapuri', 'Pudukkottai',
    'Ramanathapuram', 'Ariyalur', 'Perambalur', 'Nilgiris', 'Tiruvannamalai',
    'Villupuram', 'Kanyakumari', 'Theni', 'Tiruvallur', 'Tiruvarur',
    'Ranipet', 'Kallakurichi', 'Chengalpattu', 'Tenkasi', 'Tirupathur',
    'Mayiladuthurai', 'Puducherry', 'Karaikal', 'Mahe', 'Yanam'
  ];

  // Tamil Nadu Field Worker Data
  const fieldWorkers = [
    {
      id: 'FW001',
      name: 'கார்த்திக் குமார் (Karthik Kumar)',
      phone: '+91-9876543210',
      email: 'karthik.kumar@tvk.com',
      level: 'Senior',
      district: 'Chennai',
      constituency: 'Anna Nagar',
      booths: ['CHN-AN-001', 'CHN-AN-002', 'CHN-AN-003', 'CHN-AN-004'],
      joinDate: '2024-01-01',
      avatar: '👨‍💼',
      performance: {
        monthlyTarget: 500,
        achieved: 478,
        votersRegistered: 234,
        contactsMade: 1240,
        ralliesOrganized: 8,
        eventAttendance: 2340,
        rating: 4.8,
        efficiency: 96
      },
      weeklyData: [
        { week: 'Week 1', contacts: 280, registrations: 45, events: 2 },
        { week: 'Week 2', contacts: 320, registrations: 62, events: 3 },
        { week: 'Week 3', contacts: 350, registrations: 58, events: 2 },
        { week: 'Week 4', contacts: 290, registrations: 69, events: 1 }
      ],
      recentActivities: [
        { date: '2024-01-15', activity: 'Door-to-door campaign', area: 'Anna Nagar West', contacts: 45, notes: 'Strong support for TVK education policies. Youth enthusiastic about Vijay leadership.' },
        { date: '2024-01-14', activity: 'Voter registration drive', area: 'Thirumangalam', contacts: 38, notes: 'Registered 12 new first-time voters' },
        { date: '2024-01-13', activity: 'Rally organization', area: 'Anna Nagar Tower Park', contacts: 230, notes: 'Massive turnout. Anti-DMK sentiment strong.' }
      ],
      strengths: ['Excellent Tamil communication', 'Strong Chennai network', 'High youth voter registration'],
      improvements: ['Rural outreach', 'WhatsApp group management'],
      assignments: [
        { task: 'Anna Nagar booth coverage analysis', deadline: '2024-01-20', status: 'In Progress' },
        { task: 'College voter registration drive', deadline: '2024-01-25', status: 'Pending' }
      ]
    },
    {
      id: 'FW002',
      name: 'பிரியா ஸ்ரீநிவாசன் (Priya Srinivasan)',
      phone: '+91-9876543211',
      email: 'priya.srinivasan@tvk.com',
      level: 'Senior',
      district: 'Coimbatore',
      constituency: 'Coimbatore South',
      booths: ['CBE-CS-001', 'CBE-CS-002', 'CBE-CS-003'],
      joinDate: '2024-01-05',
      avatar: '👩‍💼',
      performance: {
        monthlyTarget: 400,
        achieved: 392,
        votersRegistered: 186,
        contactsMade: 980,
        ralliesOrganized: 5,
        eventAttendance: 1820,
        rating: 4.6,
        efficiency: 98
      },
      weeklyData: [
        { week: 'Week 1', contacts: 240, registrations: 38, events: 1 },
        { week: 'Week 2', contacts: 260, registrations: 52, events: 2 },
        { week: 'Week 3', contacts: 280, registrations: 46, events: 1 },
        { week: 'Week 4', contacts: 200, registrations: 50, events: 1 }
      ],
      recentActivities: [
        { date: '2024-01-15', activity: 'WhatsApp outreach', area: 'RS Puram', contacts: 120, notes: 'Strong response from business community. IT job creation message resonating well.' },
        { date: '2024-01-14', activity: 'Women meeting', area: 'Coimbatore Women College', contacts: 65, notes: 'Women safety and education - positive feedback on TVK policies' }
      ],
      strengths: ['Digital savvy', 'Women issues expert', 'Strong Kongu belt connections'],
      improvements: ['Caste balance outreach', 'Tamil fluency'],
      assignments: [
        { task: 'Women voter outreach - Industrial areas', deadline: '2024-01-22', status: 'Completed' },
        { task: 'Gounder community meeting', deadline: '2024-01-28', status: 'In Progress' }
      ]
    },
    {
      id: 'FW003',
      name: 'முருகேஷ் தேவர் (Murugesh Thevar)',
      phone: '+91-9876543212',
      email: 'murugesh.thevar@tvk.com',
      level: 'Mid-Level',
      district: 'Madurai',
      constituency: 'Madurai Central',
      booths: ['MDU-MC-001', 'MDU-MC-002'],
      joinDate: '2024-01-10',
      avatar: '👨‍🎓',
      performance: {
        monthlyTarget: 300,
        achieved: 245,
        votersRegistered: 98,
        contactsMade: 650,
        ralliesOrganized: 2,
        eventAttendance: 580,
        rating: 4.2,
        efficiency: 82
      },
      weeklyData: [
        { week: 'Week 1', contacts: 150, registrations: 20, events: 1 },
        { week: 'Week 2', contacts: 180, registrations: 28, events: 0 },
        { week: 'Week 3', contacts: 160, registrations: 25, events: 1 },
        { week: 'Week 4', contacts: 160, registrations: 25, events: 0 }
      ],
      recentActivities: [
        { date: '2024-01-15', activity: 'Market outreach', area: 'Chandni Chowk Market', contacts: 85, notes: 'Engaged with local traders' },
        { date: '2024-01-13', activity: 'House visits', area: 'Old Delhi', contacts: 42, notes: 'Mixed responses, need follow-up' }
      ],
      strengths: ['Local knowledge', 'Persistent', 'Good rapport with traders'],
      improvements: ['Time management', 'Report writing', 'Technology usage'],
      assignments: [
        { task: 'Market vendor outreach', deadline: '2024-01-24', status: 'In Progress' },
        { task: 'Basic training completion', deadline: '2024-01-30', status: 'Pending' }
      ]
    }
  ];

  // Performance metrics
  const overallStats = {
    totalWorkers: 45,
    activeWorkers: 42,
    totalTargets: 18500,
    achieved: 16780,
    averageRating: 4.5,
    topPerformers: 8
  };

  const performanceDistribution = [
    { level: 'Excellent (4.5+)', count: 15, color: '#10B981' },
    { level: 'Good (4.0-4.4)', count: 20, color: '#3B82F6' },
    { level: 'Average (3.5-3.9)', count: 8, color: '#F59E0B' },
    { level: 'Needs Improvement (<3.5)', count: 2, color: '#EF4444' }
  ];

  const monthlyTrends = [
    { month: 'Oct', contacts: 12450, registrations: 1240, events: 45 },
    { month: 'Nov', contacts: 14200, registrations: 1580, events: 52 },
    { month: 'Dec', contacts: 16800, registrations: 1920, events: 48 },
    { month: 'Jan', contacts: 18900, registrations: 2180, events: 58 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'workers', label: 'Field Workers', icon: Users },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'assignments', label: 'Assignments', icon: Target }
  ];

  const filteredWorkers = fieldWorkers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (worker.district && worker.district.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel = filterLevel === 'all' || worker.level.toLowerCase() === filterLevel.toLowerCase();

    const matchesDistrict = selectedDistrict === 'all' || worker.district === selectedDistrict;

    return matchesSearch && matchesLevel && matchesDistrict;
  });

  // Calculate district-wise stats
  const districtStats = tnDistricts.map(district => {
    const districtWorkers = fieldWorkers.filter(w => w.district === district);
    return {
      district,
      workers: districtWorkers.length,
      active: districtWorkers.filter(w => w.performance.efficiency > 85).length,
      avgPerformance: districtWorkers.length > 0
        ? Math.round(districtWorkers.reduce((sum, w) => sum + w.performance.rating, 0) / districtWorkers.length * 10) / 10
        : 0
    };
  }).filter(stat => stat.workers > 0).sort((a, b) => b.workers - a.workers);

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-100';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'bg-green-500';
    if (efficiency >= 85) return 'bg-blue-500';
    if (efficiency >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Field Worker Management
          </h2>
          <p className="text-gray-600">Performance tracking and team coordination system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Worker</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{overallStats.totalWorkers}</div>
              <div className="text-xs text-gray-600">Total Workers</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{overallStats.activeWorkers}</div>
              <div className="text-xs text-gray-600">Active Today</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{Math.round((overallStats.achieved / overallStats.totalTargets) * 100)}%</div>
              <div className="text-xs text-gray-600">Target Achievement</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{overallStats.averageRating}</div>
              <div className="text-xs text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{overallStats.topPerformers}</div>
              <div className="text-xs text-gray-600">Top Performers</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">2.4K</div>
              <div className="text-xs text-gray-600">Daily Contacts</div>
            </div>
          </div>
        </div>
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
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="contacts" stroke="#3B82F6" strokeWidth={2} name="Contacts" />
                  <Line type="monotone" dataKey="registrations" stroke="#10B981" strokeWidth={2} name="Registrations" />
                  <Line type="monotone" dataKey="events" stroke="#F59E0B" strokeWidth={2} name="Events" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ level, count }) => `${count} workers`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers This Month</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {fieldWorkers.slice(0, 3).map((worker, index) => (
                <div key={worker.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">{worker.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{worker.name}</h4>
                      <p className="text-sm text-gray-600">{worker.constituency}</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-yellow-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Achievement</span>
                      <span className="font-medium">{Math.round((worker.performance.achieved / worker.performance.monthlyTarget) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {worker.performance.rating}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contacts</span>
                      <span className="font-medium">{worker.performance.contactsMade.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workers' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search workers by name, constituency, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
              >
                <option value="all">All Districts (TN + PY)</option>
                <optgroup label="Tamil Nadu (38)">
                  {tnDistricts.slice(0, 38).map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </optgroup>
                <optgroup label="Puducherry (4)">
                  {tnDistricts.slice(38).map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </optgroup>
              </select>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="senior">Senior</option>
                <option value="mid-level">Mid-Level</option>
                <option value="junior">Junior</option>
              </select>
            </div>
          </div>

          {/* District Overview Panel */}
          {selectedDistrict === 'all' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">District-wise Coverage (Tamil Nadu + Puducherry)</h3>
                <span className="text-sm text-gray-600">{districtStats.length} districts with field workers</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {districtStats.map((stat) => (
                  <div
                    key={stat.district}
                    onClick={() => setSelectedDistrict(stat.district)}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all border border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        stat.active === stat.workers ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {stat.active}/{stat.workers}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm truncate" title={stat.district}>
                      {stat.district}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      {stat.avgPerformance > 0 ? stat.avgPerformance : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span>All Active</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span>Partial Coverage</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View Full District Report →
                </button>
              </div>
            </div>
          )}

          {/* Active District Filter Display */}
          {selectedDistrict !== 'all' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Showing: {selectedDistrict} District</div>
                    <div className="text-sm text-gray-600">
                      {filteredWorkers.length} field worker{filteredWorkers.length !== 1 ? 's' : ''} assigned
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDistrict('all')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filter</span>
                </button>
              </div>
            </div>
          )}

          {/* Worker Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div key={worker.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{worker.avatar}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                      <p className="text-sm text-gray-600">{worker.level} • {worker.constituency}</p>
                      <p className="text-xs text-gray-500">{worker.booths.length} booths assigned</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceColor(worker.performance.rating)}`}>
                    <Star className="w-3 h-3 inline mr-1" />
                    {worker.performance.rating}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Progress</span>
                    <span className="text-sm font-medium">
                      {worker.performance.achieved}/{worker.performance.monthlyTarget}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${getEfficiencyColor(worker.performance.efficiency)}`}
                      style={{ width: `${(worker.performance.achieved / worker.performance.monthlyTarget) * 100}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Contacts</div>
                      <div className="font-medium">{worker.performance.contactsMade.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Registrations</div>
                      <div className="font-medium">{worker.performance.votersRegistered}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Active today
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedWorker(worker)}
                      className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Comparison */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={[
                { metric: 'Contacts Made', amit: 1240, priya: 980, rajesh: 650 },
                { metric: 'Voters Registered', amit: 234, priya: 186, rajesh: 98 },
                { metric: 'Events Organized', amit: 8, priya: 5, rajesh: 2 },
                { metric: 'Efficiency %', amit: 96, priya: 98, rajesh: 82 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amit" fill="#3B82F6" name="Amit Singh" />
                <Bar dataKey="priya" fill="#10B981" name="Priya Sharma" />
                <Bar dataKey="rajesh" fill="#F59E0B" name="Rajesh Kumar" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Individual Performance Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {fieldWorkers.map((worker) => (
              <div key={worker.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{worker.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{worker.name}</h4>
                    <p className="text-sm text-gray-600">{worker.constituency}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Efficiency</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className={`h-2 rounded-full ${getEfficiencyColor(worker.performance.efficiency)}`}
                          style={{ width: `${worker.performance.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{worker.performance.efficiency}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contacts/Day</span>
                      <span className="font-medium">{Math.round(worker.performance.contactsMade / 30)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Rate</span>
                      <span className="font-medium">{Math.round((worker.performance.votersRegistered / worker.performance.contactsMade) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event Attendance</span>
                      <span className="font-medium">{worker.performance.eventAttendance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Strengths</h5>
                  <div className="space-y-1">
                    {worker.strengths.slice(0, 2).map((strength, index) => (
                      <div key={index} className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Assignments</h3>
            
            <div className="space-y-4">
              {fieldWorkers.map((worker) => (
                <div key={worker.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="text-xl mr-3">{worker.avatar}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{worker.name}</h4>
                        <p className="text-sm text-gray-600">{worker.constituency} • {worker.booths.join(', ')}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceColor(worker.performance.rating)}`}>
                      {worker.level}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {worker.assignments.map((assignment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{assignment.task}</h5>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            assignment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Due: {assignment.deadline}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Worker Detail Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="text-3xl mr-4">{selectedWorker.avatar}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedWorker.name}</h2>
                  <p className="text-gray-600">{selectedWorker.level} • {selectedWorker.constituency}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedWorker(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={selectedWorker.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="contacts" stroke="#3B82F6" name="Contacts" />
                    <Line type="monotone" dataKey="registrations" stroke="#10B981" name="Registrations" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Activities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedWorker.recentActivities.map((activity, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="font-medium text-gray-900">{activity.activity}</div>
                      <div className="text-sm text-gray-600">{activity.area} • {activity.date}</div>
                      <div className="text-sm text-gray-500">{activity.contacts} contacts</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
