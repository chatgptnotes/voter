import { useState } from 'react';
import { FileText, Download, Calendar, Filter, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useSentimentData, useTrendData, useCompetitorData } from '../hooks/useSentimentData';
import { exportToCSV } from '../utils/dataProcessing';
import { apiService } from '../services/api';
import { TIME_RANGES, EXPORT_FORMATS } from '../utils/constants';

interface ReportFilters {
  timeRange: string;
  issues: string[];
  regions: string[];
  format: 'pdf' | 'excel' | 'csv';
}

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilters>({
    timeRange: '30d',
    issues: [],
    regions: [],
    format: 'pdf'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState('sentiment');

  const { data: sentimentData } = useSentimentData();
  const { data: trendData } = useTrendData(filters.timeRange);
  const { data: competitorData } = useCompetitorData();

  const reportTypes = [
    {
      id: 'constituency',
      title: 'Constituency-wise Report',
      description: 'Detailed analysis for all 234 TN constituencies with voter breakdowns',
      icon: BarChart3,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'district',
      title: 'District Analysis Report',
      description: 'Performance breakdown for 42 districts (38 TN + 4 Puducherry)',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      id: 'caste',
      title: 'Caste Demographics Report',
      description: 'Caste-wise voting patterns (OBC, MBC, SC, ST, FC) across regions',
      icon: PieChart,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'party',
      title: 'Party Comparison Report',
      description: 'DMK vs AIADMK vs TVK vs BJP performance comparison',
      icon: FileText,
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      id: 'booth',
      title: 'Booth-Level Report',
      description: 'Micro-level analysis for 50,000+ polling booths across Tamil Nadu',
      icon: FileText,
      color: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      id: 'tamil',
      title: 'Tamil Language Report (தமிழ்)',
      description: 'Complete report in Tamil for regional distribution and media coverage',
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      if (filters.format === 'csv') {
        let data: any[];
        switch (activeReport) {
          case 'sentiment':
            data = sentimentData || [];
            break;
          case 'trends':
            data = trendData || [];
            break;
          case 'competitor':
            data = competitorData || [];
            break;
          default:
            data = [] as any[];
        }
        exportToCSV(data, `${activeReport}-report-${new Date().toISOString().split('T')[0]}`);
      } else {
        const blob = await apiService.exportReport(filters.format, {
          reportType: activeReport,
          timeRange: filters.timeRange,
          issues: filters.issues,
          regions: filters.regions
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${activeReport}-report.${filters.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateFilter = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate detailed reports and export data</p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map(report => (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                    activeReport === report.id
                      ? report.color + ' border-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <report.icon className={`w-6 h-6 mr-3 mt-1 ${
                      activeReport === report.id ? '' : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{report.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Report Preview</h4>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                {activeReport === 'constituency' && (
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900">Constituency-wise Analysis (234 Total)</h5>
                    <div className="text-sm text-gray-600">Sample constituencies with TVK vote projections</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>Chennai Central: <span className="text-blue-600">22.4%</span></div>
                      <div>Coimbatore South: <span className="text-blue-600">19.8%</span></div>
                      <div>Madurai North: <span className="text-blue-600">16.2%</span></div>
                      <div>Salem West: <span className="text-blue-600">21.5%</span></div>
                      <div>Trichy East: <span className="text-blue-600">18.9%</span></div>
                      <div>Tirunelveli: <span className="text-blue-600">15.3%</span></div>
                    </div>
                  </div>
                )}

                {activeReport === 'district' && (
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900">District Performance (42 Districts)</h5>
                    <div className="text-sm text-gray-600">Top performing districts for TVK</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Strong Districts:</span>
                        <div className="text-green-600">Chennai (24%), Coimbatore (21%), Salem (19%)</div>
                      </div>
                      <div>
                        <span className="font-medium">Growth Potential:</span>
                        <div className="text-orange-600">Madurai (16%), Trichy (18%), Erode (17%)</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeReport === 'caste' && (
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900">Caste Demographics Analysis</h5>
                    <div className="text-sm text-gray-600">TVK support by caste category</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>OBC (34%): <span className="text-blue-600">19.2% TVK</span></div>
                      <div>MBC (20%): <span className="text-blue-600">22.5% TVK</span></div>
                      <div>SC (20%): <span className="text-blue-600">14.8% TVK</span></div>
                      <div>ST (3%): <span className="text-blue-600">11.3% TVK</span></div>
                      <div>FC (23%): <span className="text-blue-600">21.7% TVK</span></div>
                      <div>Vanniyar: <span className="text-green-600">31.4% TVK</span></div>
                    </div>
                  </div>
                )}

                {activeReport === 'party' && (
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900">Party Comparison (2026 Projections)</h5>
                    <div className="text-sm text-gray-600">Seat and vote share predictions</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Seat Projections:</span>
                        <div>DMK: <span className="text-orange-600">98 (-35)</span></div>
                        <div>AIADMK: <span className="text-orange-600">52 (-14)</span></div>
                        <div>TVK: <span className="text-green-600">42 (+42)</span></div>
                        <div>BJP: <span className="text-blue-600">8 (+4)</span></div>
                      </div>
                      <div>
                        <span className="font-medium">Vote Share %:</span>
                        <div>DMK: 37.8% (-5.2%)</div>
                        <div>AIADMK: 28.3% (-4.8%)</div>
                        <div>TVK: 18.5% (+18.5%)</div>
                        <div>BJP: 9.2% (+2.8%)</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeReport === 'booth' && (
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900">Booth-Level Analysis</h5>
                    <div className="text-sm text-gray-600">Micro-targeting for 50,000+ booths</div>
                    <div className="text-sm">
                      <div className="mb-2"><span className="font-medium">High Priority Booths:</span> 8,234 (potential TVK gain)</div>
                      <div className="mb-2"><span className="font-medium">Strong Booths:</span> 12,567 (TVK 25%+ support)</div>
                      <div><span className="font-medium">Growth Booths:</span> 18,345 (TVK 15-25% support)</div>
                    </div>
                  </div>
                )}

                {activeReport === 'tamil' && (
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900">தமிழ் அறிக்கை (Tamil Report)</h5>
                    <div className="text-sm text-gray-600">முழு விபரங்களும் தமிழில்</div>
                    <div className="text-sm space-y-2">
                      <div>தொகுதி எண்ணிக்கை: 234</div>
                      <div>மாவட்ட எண்ணிக்கை: 42 (38 TN + 4 புதுச்சேரி)</div>
                      <div>TVK ஆதரவு: 18.5%</div>
                      <div>இலக்கு இடங்கள்: 42-48 தொகுதிகள்</div>
                      <div className="text-blue-600 font-medium">முக்கிய பிரச்சினைகள்: காவிரி நீர், மதுவிலக்கு, வேலை வாய்ப்பு</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Time Range
                </label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => updateFilter('timeRange', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(TIME_RANGES).map(([key, range]) => (
                    <option key={key} value={key}>{range.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="space-y-2">
                  {EXPORT_FORMATS.map(format => (
                    <label key={format} className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={filters.format === format}
                        onChange={(e) => updateFilter('format', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TN Issues (தமிழக பிரச்சினைகள்)
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {['Cauvery Water (காவிரி நீர்)', 'NEET Exam', 'Farm Loan Waiver', 'Prohibition (மதுவிலக்கு)', 'Temple Administration', 'Jobs & Unemployment'].map(issue => (
                    <label key={issue} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.issues.includes(issue)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter('issues', [...filters.issues, issue]);
                          } else {
                            updateFilter('issues', filters.issues.filter(i => i !== issue));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{issue}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Districts (மாவட்டங்கள்)
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Vellore', 'Erode', 'Thanjavur', 'Kanyakumari'].map(region => (
                    <label key={region} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.regions.includes(region)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter('regions', [...filters.regions, region]);
                          } else {
                            updateFilter('regions', filters.regions.filter(r => r !== region));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{region}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Recent TN Reports</h4>
            <div className="space-y-3">
              {[
                { name: 'Chennai Zone Constituency Analysis', date: '2025-11-07', size: '4.8 MB' },
                { name: 'Western TN Caste Demographics', date: '2025-11-06', size: '3.2 MB' },
                { name: 'DMK vs AIADMK vs TVK Comparison', date: '2025-11-05', size: '5.1 MB' },
                { name: 'Tamil Report - முழு அறிக்கை', date: '2025-11-04', size: '6.4 MB' }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                    <div className="text-xs text-gray-500">{report.date} • {report.size}</div>
                  </div>
                  <Download className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}