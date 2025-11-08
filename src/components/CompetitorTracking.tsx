import React from 'react';
import { TrendingUp, TrendingDown, Users, MessageCircle, Eye, Target } from 'lucide-react';

export default function CompetitorTracking() {
  const competitors = [
    {
      name: 'DMK (திமுக)',
      sentiment: 0.58,
      mentions: 8950,
      reach: 485000,
      engagement: 3.2,
      trend: 'down',
      change: -5.3,
      seats_2021: 133,
      projected_2026: 98
    },
    {
      name: 'AIADMK (அதிமுக)',
      sentiment: 0.51,
      mentions: 6230,
      reach: 372000,
      engagement: 2.8,
      trend: 'down',
      change: -4.8,
      seats_2021: 66,
      projected_2026: 52
    },
    {
      name: 'TVK (தமிழக வெற்றிக் கழகம்)',
      sentiment: 0.74,
      mentions: 12450,
      reach: 895000,
      engagement: 7.9,
      trend: 'up',
      change: 34.2,
      seats_2021: 0,
      projected_2026: 42
    },
    {
      name: 'BJP (பாஜக)',
      sentiment: 0.62,
      mentions: 4180,
      reach: 198000,
      engagement: 4.1,
      trend: 'up',
      change: 2.8,
      seats_2021: 4,
      projected_2026: 8
    }
  ];

  const competitorIssues = [
    { issue: 'Cauvery Water (காவிரி நீர்)', party: 'DMK', sentiment: 0.62, volume: 3450, constituencies: 68 },
    { issue: 'Prohibition (மதுவிலக்கு)', party: 'TVK', sentiment: 0.78, volume: 4890, constituencies: 78 },
    { issue: 'NEET Exam', party: 'DMK', sentiment: 0.58, volume: 2980, constituencies: 112 },
    { issue: 'Farm Loan Waiver', party: 'AIADMK', sentiment: 0.65, volume: 2140, constituencies: 54 },
    { issue: 'Temple Administration', party: 'BJP', sentiment: 0.71, volume: 1870, constituencies: 23 },
    { issue: 'Jobs & Unemployment', party: 'TVK', sentiment: 0.75, volume: 5620, constituencies: 142 },
  ];

  const campaigns = [
    {
      competitor: 'TVK',
      campaign: 'Vijay Youth Digital Blitz (விஜய் இளைஞர் பிரசாரம்)',
      reach: 785000,
      engagement: 8.2,
      sentiment: 0.79,
      status: 'active',
      target: '18-35 age group, 142 constituencies'
    },
    {
      competitor: 'DMK',
      campaign: 'Dravidian Model 2.0 - Social Welfare',
      reach: 412000,
      engagement: 3.8,
      sentiment: 0.61,
      status: 'active',
      target: 'Traditional base, 145 constituencies'
    },
    {
      competitor: 'AIADMK',
      campaign: 'Amma Legacy Revival (அம்மா மரபு)',
      reach: 298000,
      engagement: 4.2,
      sentiment: 0.58,
      status: 'active',
      target: 'Rural women, southern districts'
    },
    {
      competitor: 'BJP',
      campaign: 'Hindu Consolidation - South TN',
      reach: 156000,
      engagement: 5.1,
      sentiment: 0.67,
      status: 'active',
      target: 'Kanyakumari, Nagercoil, 15 seats'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Competitor Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competitors.map((competitor, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{competitor.name}</h3>
              <div className={`flex items-center ${
                competitor.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {competitor.trend === 'up' ? 
                  <TrendingUp className="w-5 h-5" /> : 
                  <TrendingDown className="w-5 h-5" />
                }
                <span className="ml-1 text-sm font-medium">
                  {competitor.change > 0 ? '+' : ''}{competitor.change}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sentiment</span>
                <span className={`font-medium ${
                  competitor.sentiment > 0.6 ? 'text-green-600' : 
                  competitor.sentiment > 0.4 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(competitor.sentiment * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mentions</span>
                <span className="font-medium">{competitor.mentions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reach</span>
                <span className="font-medium">{(competitor.reach / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Engagement</span>
                <span className="font-medium">{competitor.engagement}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Performance Comparison</h3>
          <div className="space-y-4">
            {competitorIssues.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{item.issue}</div>
                  <div className="text-sm text-gray-600">{item.party} • {item.volume} mentions</div>
                </div>
                <div className={`text-lg font-bold ${
                  item.sentiment > 0.6 ? 'text-green-600' : 
                  item.sentiment > 0.4 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(item.sentiment * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Campaigns</h3>
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{campaign.campaign}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">{campaign.competitor}</div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Reach</div>
                    <div className="font-medium">{(campaign.reach / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Engagement</div>
                    <div className="font-medium">{campaign.engagement}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Sentiment</div>
                    <div className={`font-medium ${
                      campaign.sentiment > 0.6 ? 'text-green-600' : 
                      campaign.sentiment > 0.4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round(campaign.sentiment * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitive Intelligence */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Intelligence Alerts</h3>
        <div className="space-y-3">
          {[
            {
              type: 'campaign',
              message: 'TVK Vijay Youth Rally in Chennai Marina - 85K attendance, 34% engagement spike on Instagram Reels',
              time: '3 hours ago',
              severity: 'high'
            },
            {
              type: 'sentiment',
              message: 'DMK sentiment dropped 8% in Western TN (Coimbatore, Salem, Erode) after TASMAC revenue controversy',
              time: '6 hours ago',
              severity: 'high'
            },
            {
              type: 'vulnerability',
              message: 'AIADMK showing 12% decline in 18 southern constituencies (Madurai, Virudhunagar, Ramanathapuram)',
              time: '12 hours ago',
              severity: 'high'
            },
            {
              type: 'reach',
              message: 'TVK gained 245K new followers across Tamil social media (Twitter, Instagram, YouTube) this week',
              time: '1 day ago',
              severity: 'medium'
            },
            {
              type: 'issue',
              message: 'Prohibition (மதுவிலக்கு) trending #1 in 78 rural constituencies - TVK leading the narrative',
              time: '2 days ago',
              severity: 'medium'
            },
            {
              type: 'caste',
              message: 'Vanniyar community sentiment shifting +31% toward TVK in Dharmapuri, Salem, Namakkal districts',
              time: '3 days ago',
              severity: 'high'
            },
            {
              type: 'bjp',
              message: 'BJP consolidating Hindu vote in 15 southern seats but plateauing at 8-12% ceiling',
              time: '4 days ago',
              severity: 'low'
            },
          ].map((alert, index) => (
            <div key={index} className={`flex items-start p-3 rounded-lg border-l-4 ${
              alert.severity === 'high' ? 'bg-red-50 border-red-400' :
              alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                alert.severity === 'high' ? 'bg-red-400' :
                alert.severity === 'medium' ? 'bg-yellow-400' :
                'bg-blue-400'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
