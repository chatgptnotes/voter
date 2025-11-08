import React, { useState } from 'react';
import { MessageCircle, Users, TrendingUp, Eye, Heart, Share2, Languages, Tv, Youtube, Twitter as TwitterIcon, MessageSquare, Globe } from 'lucide-react';

export default function SocialMediaMonitoring() {
  const [languageFilter, setLanguageFilter] = useState<'all' | 'tamil' | 'english'>('all');

  // Tamil Nadu-specific social media data
  const platforms = [
    { name: 'Twitter (Tamil)', followers: '245K', engagement: '6.8%', mentions: 2450, sentiment: 0.72, language: 'tamil' },
    { name: 'Twitter (English)', followers: '125K', engagement: '4.2%', mentions: 1250, sentiment: 0.68, language: 'english' },
    { name: 'Facebook (Tamil)', followers: '189K', engagement: '5.3%', mentions: 1890, sentiment: 0.64, language: 'tamil' },
    { name: 'Instagram', followers: '156K', engagement: '6.1%', mentions: 850, sentiment: 0.72, language: 'all' },
    { name: 'YouTube (Tamil)', followers: '234K', engagement: '7.9%', mentions: 1180, sentiment: 0.76, language: 'tamil' },
    { name: 'WhatsApp Groups', followers: '45K', engagement: '8.5%', mentions: 2250, sentiment: 0.71, language: 'tamil' },
  ];

  const recentMentions = [
    { platform: 'Twitter', user: '@TNVoice2026', content: 'காவிரி நீர் பிரச்சினைக்கு உடனடி தீர்வு வேண்டும் #CauveryWater', sentiment: 'negative', time: '2 min ago', language: 'tamil', location: 'Chennai' },
    { platform: 'Twitter', user: '@ChennaiYouth', content: 'TVK will bring change to Tamil Nadu! Vijay for CM! #TVK2026', sentiment: 'positive', time: '4 min ago', language: 'english', location: 'Chennai' },
    { platform: 'Facebook', user: 'மதுரை முருகன்', content: 'நீட் தேர்வு ரத்து செய்யப்பட வேண்டும். மாணவர்களின் எதிர்காலம் முக்கியம் #NoToNEET', sentiment: 'negative', time: '5 min ago', language: 'tamil', location: 'Madurai' },
    { platform: 'WhatsApp', user: 'Coimbatore TVK Group', content: 'TVK IT policy will create 1 lakh jobs in Coimbatore. Great vision! 👏', sentiment: 'positive', time: '7 min ago', language: 'english', location: 'Coimbatore' },
    { platform: 'Instagram', user: '@TamilCulture', content: 'கோவில் நிர்வாகம் பக்தர்களிடம் ஒப்படைக்கப்பட வேண்டும் #TempleAdministration', sentiment: 'neutral', time: '8 min ago', language: 'tamil', location: 'Trichy' },
    { platform: 'YouTube', user: 'Salem Politics Today', content: 'விவசாயிகள் கடன் தள்ளுபடி உடனடியாக தேவை. DMK பொய் வாக்குறுதிகள் போதும்!', sentiment: 'negative', time: '10 min ago', language: 'tamil', location: 'Salem' },
    { platform: 'Twitter', user: '@TNStudentUnion', content: 'Free education for all! Support TVK education reforms #EducationForAll', sentiment: 'positive', time: '12 min ago', language: 'english', location: 'Vellore' },
    { platform: 'Facebook', user: 'தஞ்சை விவசாயிகள்', content: 'மழை நீர் சேமிப்பு திட்டங்கள் அவசியம். AIADMK கால நிர்வாகம் போதாது!', sentiment: 'negative', time: '15 min ago', language: 'tamil', location: 'Thanjavur' },
  ];

  // Tamil news channels monitoring
  const tamilNewsChannels = [
    { name: 'Sun News', reach: '45M', sentiment: 0.65, coverage: 'Neutral to Pro-DMK' },
    { name: 'Puthiya Thalaimurai', reach: '32M', sentiment: 0.72, coverage: 'Independent' },
    { name: 'News7 Tamil', reach: '28M', sentiment: 0.68, coverage: 'Independent' },
    { name: 'Polimer News', reach: '25M', sentiment: 0.61, coverage: 'Neutral' },
    { name: 'Thanthi TV', reach: '38M', sentiment: 0.59, coverage: 'Pro-AIADMK lean' },
    { name: 'News18 Tamil Nadu', reach: '22M', sentiment: 0.67, coverage: 'Balanced' },
  ];

  // Tamil influencers and YouTubers
  const tamilInfluencers = [
    { name: 'Sattai Dude Vicky', platform: 'YouTube', followers: '1.2M', engagement: '8.2%', sentiment: 0.78 },
    { name: 'Maridhas', platform: 'YouTube', followers: '850K', engagement: '9.1%', sentiment: 0.65 },
    { name: 'Rangaraj Pandey', platform: 'Twitter', followers: '640K', engagement: '7.5%', sentiment: 0.71 },
    { name: 'Savukku Shankar', platform: 'YouTube', followers: '920K', engagement: '10.2%', sentiment: 0.62 },
    { name: 'Tamil Pokkisham', platform: 'Twitter', followers: '580K', engagement: '6.8%', sentiment: 0.74 },
  ];

  const filteredPlatforms = languageFilter === 'all'
    ? platforms
    : platforms.filter(p => p.language === languageFilter || p.language === 'all');

  const filteredMentions = languageFilter === 'all'
    ? recentMentions
    : recentMentions.filter(m => m.language === languageFilter);

  return (
    <div className="space-y-6">
      {/* Language Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Tamil Nadu Social Media Monitoring</h2>
        <div className="flex items-center space-x-2">
          <Languages className="w-5 h-5 text-gray-500" />
          <button
            onClick={() => setLanguageFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              languageFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setLanguageFilter('tamil')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              languageFilter === 'tamil'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            தமிழ் (Tamil)
          </button>
          <button
            onClick={() => setLanguageFilter('english')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              languageFilter === 'english'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlatforms.map((platform, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Followers</span>
                <span className="font-medium">{platform.followers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Engagement</span>
                <span className="font-medium">{platform.engagement}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mentions</span>
                <span className="font-medium">{platform.mentions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sentiment</span>
                <span className={`font-medium ${
                  platform.sentiment > 0.6 ? 'text-green-600' :
                  platform.sentiment > 0.4 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(platform.sentiment * 100)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Mentions & Trending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Mentions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Mentions ({languageFilter === 'tamil' ? 'தமிழ்' : languageFilter === 'english' ? 'English' : 'All'})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredMentions.map((mention, index) => (
              <div key={index} className="border-l-4 border-gray-200 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{mention.platform}</span>
                    <span className="text-sm text-gray-600">• {mention.user}</span>
                  </div>
                  <span className="text-xs text-gray-500">{mention.time}</span>
                </div>
                <p className={`text-sm text-gray-700 mb-2 ${mention.language === 'tamil' ? 'font-tamil' : ''}`}>
                  {mention.content}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    mention.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    mention.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {mention.sentiment}
                  </span>
                  <span className="text-xs text-gray-500">📍 {mention.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Tamil Hashtags */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Tamil Nadu Hashtags</h3>
          <div className="space-y-3">
            {[
              { topic: '#TVK2026', mentions: 25800, trend: 'up', language: 'tamil' },
              { topic: '#காவிரி_நீர்', mentions: 18950, trend: 'up', language: 'tamil' },
              { topic: '#NoToNEET', mentions: 15600, trend: 'up', language: 'both' },
              { topic: '#விவசாயி_கடன்_தள்ளுபடி', mentions: 12400, trend: 'up', language: 'tamil' },
              { topic: '#JobsForTNYouth', mentions: 10850, trend: 'up', language: 'english' },
              { topic: '#மதுவிலக்கு', mentions: 8640, trend: 'down', language: 'tamil' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className={`font-medium text-gray-900 ${item.language === 'tamil' || item.language === 'both' ? 'font-tamil' : ''}`}>
                    {item.topic}
                  </div>
                  <div className="text-sm text-gray-600">{item.mentions.toLocaleString()} mentions</div>
                </div>
                <div className={`flex items-center ${
                  item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    item.trend === 'down' ? 'transform rotate-180' : ''
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tamil News Channels & Influencers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tamil News Channels */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tamil News Channels Coverage</h3>
            <Tv className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-3">
            {tamilNewsChannels.map((channel, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{channel.name}</span>
                  <span className={`text-sm font-medium ${
                    channel.sentiment > 0.65 ? 'text-green-600' :
                    channel.sentiment > 0.55 ? 'text-yellow-600' : 'text-orange-600'
                  }`}>
                    {Math.round(channel.sentiment * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Reach: {channel.reach}</span>
                  <span className="text-gray-600 text-xs">{channel.coverage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tamil Influencers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tamil Political Influencers</h3>
            <Youtube className="w-5 h-5 text-red-600" />
          </div>
          <div className="space-y-3">
            {tamilInfluencers.map((influencer, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{influencer.name}</div>
                    <div className="text-xs text-gray-500">{influencer.platform}</div>
                  </div>
                  <span className={`text-sm font-medium ${
                    influencer.sentiment > 0.7 ? 'text-green-600' :
                    influencer.sentiment > 0.6 ? 'text-yellow-600' : 'text-orange-600'
                  }`}>
                    {Math.round(influencer.sentiment * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{influencer.followers} followers</span>
                  <span className="text-gray-600">{influencer.engagement} engagement</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
