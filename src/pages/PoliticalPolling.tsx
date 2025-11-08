import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, TrendingUp, Users, BarChart3, Vote, Target, Zap, Droplet, Briefcase, Wheat, GraduationCap, Heart, Shield, Building2, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TN_ELECTION_ISSUES } from '../config/tamilnadu-config';

// Tamil Nadu-specific poll questions
const TN_POLL_QUESTIONS = [
  {
    id: 'water',
    title: 'Cauvery Water Management',
    titleTamil: 'காவிரி நீர் மேலாண்மை',
    question: 'Should Tamil Nadu pursue legal action against Karnataka for fair water share?',
    questionTamil: 'கர்நாடகாவுக்கு எதிராக நியாயமான நீர் பங்குக்காக தமிழ்நாடு சட்டப்போராட்டம் நடத்த வேண்டுமா?',
    options: [
      { text: 'Yes, file Supreme Court case immediately', value: 'yes', votes: 6842 },
      { text: 'No, seek negotiation first', value: 'no', votes: 2156 }
    ],
    icon: Droplet,
    color: 'blue'
  },
  {
    id: 'jobs',
    title: 'IT Jobs & Start-up Ecosystem',
    titleTamil: 'தகவல் தொழில்நுட்ப வேலைகள் & தொடக்க நிறுவன சூழல்',
    question: 'Should government incentivize IT companies to set up offices outside Chennai?',
    questionTamil: 'சென்னைக்கு வெளியே தகவல் தொழில்நுட்ப நிறுவனங்கள் அலுவலகங்களை அமைக்க அரசு ஊக்குவிக்க வேண்டுமா?',
    options: [
      { text: 'Yes, promote Coimbatore, Madurai, Trichy as IT hubs', value: 'yes', votes: 5423 },
      { text: 'No, focus on Chennai infrastructure', value: 'no', votes: 1876 }
    ],
    icon: Briefcase,
    color: 'green'
  },
  {
    id: 'agriculture',
    title: 'Farmer Loan Waiver',
    titleTamil: 'விவசாயிகள் கடன் தள்ளுபடி',
    question: 'Should the government implement complete agricultural loan waiver?',
    questionTamil: 'அரசு முழுமையான விவசாய கடன் தள்ளுபடியை செயல்படுத்த வேண்டுமா?',
    options: [
      { text: 'Yes, waive all loans up to ₹2 lakhs', value: 'yes', votes: 8921 },
      { text: 'No, provide subsidies instead', value: 'no', votes: 2345 }
    ],
    icon: Wheat,
    color: 'yellow'
  },
  {
    id: 'neet',
    title: 'NEET Exam Controversy',
    titleTamil: 'நீட் தேர்வு சர்ச்சை',
    question: 'Should Tamil Nadu students be exempted from NEET exam for medical admission?',
    questionTamil: 'தமிழ்நாடு மாணவர்கள் மருத்துவ சேர்க்கைக்கு நீட் தேர்விலிருந்து விலக்கு பெற வேண்டுமா?',
    options: [
      { text: 'Yes, bring back 12th marks-based admission', value: 'yes', votes: 9234 },
      { text: 'No, NEET ensures merit', value: 'no', votes: 1567 }
    ],
    icon: GraduationCap,
    color: 'purple'
  },
  {
    id: 'prohibition',
    title: 'Prohibition Policy',
    titleTamil: 'மதுவிலக்கு கொள்கை',
    question: 'Should Tamil Nadu implement complete prohibition on liquor sales?',
    questionTamil: 'தமிழ்நாட்டில் மதுவிற்பனை முழுமையாக தடை செய்யப்பட வேண்டுமா?',
    options: [
      { text: 'Yes, ban all TASMAC shops', value: 'yes', votes: 7654 },
      { text: 'No, regulate and tax properly', value: 'no', votes: 4321 }
    ],
    icon: Shield,
    color: 'red'
  },
  {
    id: 'temple',
    title: 'Temple Administration',
    titleTamil: 'கோவில் நிர்வாகம்',
    question: 'Should Hindu temples be freed from HR&CE Department control?',
    questionTamil: 'இந்து கோவில்கள் HR&CE துறையின் கட்டுப்பாட்டிலிருந்து விடுவிக்கப்பட வேண்டுமா?',
    options: [
      { text: 'Yes, give control to devotees', value: 'yes', votes: 6543 },
      { text: 'No, government ensures proper management', value: 'no', votes: 3210 }
    ],
    icon: Building2,
    color: 'orange'
  }
];

export default function PoliticalPolling() {
  const [voteCount, setVoteCount] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [isBumped, setIsBumped] = useState(false);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [showTamil, setShowTamil] = useState(false);
  const countRef = useRef<HTMLParagraphElement>(null);

  const currentPoll = TN_POLL_QUESTIONS[currentPollIndex];

  const handleVote = () => {
    if (!isComplete) {
      // Bump the count
      setVoteCount(prev => prev + 1);
      setIsBumped(true);
      
      // Reset bump animation after it completes
      setTimeout(() => setIsBumped(false), 300);
    }
    
    setIsComplete(!isComplete);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/app/dashboard" 
                className="flex items-center space-x-2 text-white hover:text-red-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold text-white">Political Polling Center</h1>
            </div>
            <div className="text-white/70 text-sm">
              Live Voter Sentiment & Opinion Tracking
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Voting Widget */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Tamil Nadu Political Polling
            </h2>
            <button
              onClick={() => setShowTamil(!showTamil)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/30 transition-colors"
            >
              <Languages className="w-5 h-5 text-white" />
              <span className="text-white text-sm">{showTamil ? 'English' : 'தமிழ்'}</span>
            </button>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            {showTamil
              ? 'தமிழ்நாடு குறிப்பிட்ட அரசியல் பிரச்சினைகள் குறித்து உங்கள் கருத்தை தெரிவிக்கவும்'
              : 'Cast your vote on Tamil Nadu-specific political issues and see real-time results'
            }
          </p>

          {/* Poll Navigation */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            {TN_POLL_QUESTIONS.map((poll, index) => (
              <button
                key={poll.id}
                onClick={() => setCurrentPollIndex(index)}
                className={`p-3 rounded-lg transition-all ${
                  currentPollIndex === index
                    ? `bg-${poll.color}-500/30 border-2 border-${poll.color}-400`
                    : 'bg-white/5 border border-white/20 hover:bg-white/10'
                }`}
                title={poll.title}
              >
                <poll.icon className={`w-5 h-5 ${currentPollIndex === index ? `text-${poll.color}-300` : 'text-gray-400'}`} />
              </button>
            ))}
          </div>

          {/* Voting Widget */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-12 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center mb-4">
              <currentPoll.icon className={`w-8 h-8 text-${currentPoll.color}-400 mr-3`} />
              <h3 className="text-2xl font-semibold text-white">
                {showTamil ? currentPoll.titleTamil : currentPoll.title}
              </h3>
            </div>
            <p className="text-gray-300 mb-8 text-lg">
              {showTamil ? currentPoll.questionTamil : currentPoll.question}
            </p>

            <form className="myform" onSubmit={(e) => e.preventDefault()}>
              <p 
                ref={countRef}
                className={`vote-count ${isBumped ? 'bumped' : ''}`}
                style={{
                  width: '40px',
                  height: '35px',
                  textAlign: 'center',
                  color: '#881d12',
                  font: '20px/1.5 georgia',
                  marginBottom: '10px',
                  animation: isBumped ? 'bump 0.3s' : 'none'
                }}
              >
                {voteCount}
              </p>
              
              <button
                className={`vote-btn ${isComplete ? 'complete' : ''}`}
                onClick={handleVote}
                style={{
                  appearance: 'none',
                  borderRadius: '3px',
                  border: '0',
                  background: isComplete ? '#c1c0bb' : '#fff',
                  padding: isComplete ? '15px' : '15px 12px 15px 40px',
                  font: 'bold 9px/1.2 arial',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: isComplete ? '#fff' : '#881d12',
                  boxShadow: '0 1px 1px rgba(0,0,0,.2)',
                  outline: 'none',
                  position: 'relative',
                  transition: 'all .3s ease-out',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
              >
                <span 
                  className="icon"
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    display: 'inline-block',
                    background: '#881d12 url(https://jamesmuspratt.com/codepen/img/checkmark.svg) no-repeat 2px 1px',
                    backgroundSize: '16px auto',
                    transition: 'all .3s ease-out',
                    opacity: isComplete ? 0 : 1,
                    transform: isComplete ? 'scale(0)' : 'scale(1)'
                  }}
                ></span>
                <span className="text">
                  {isComplete ? "Thanks for Voting" : "Vote on This Policy!"}
                </span>
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-400">
              Join {voteCount} others who have voted on this policy
            </div>
          </div>

          {/* Additional Context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
              <Vote className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-xl font-bold text-green-400 mb-2">Live Polling</div>
              <div className="text-green-100 text-sm">Real-time opinion capture across demographics</div>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-xl font-bold text-blue-400 mb-2">Targeted Insights</div>
              <div className="text-blue-100 text-sm">Segmented analysis by region and voter profile</div>
            </div>
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-6 border border-purple-400/30">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-xl font-bold text-purple-400 mb-2">Instant Results</div>
              <div className="text-purple-100 text-sm">Immediate sentiment analysis and reporting</div>
            </div>
          </div>
        </div>

        {/* Polling Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Poll Results */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              {showTamil ? 'தற்போதைய கருத்துக் கணிப்பு முடிவுகள்' : 'Current Poll Results'}
            </h3>
            <div className="space-y-4">
              {currentPoll.options.map((option, index) => {
                const totalVotes = currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0);
                const percentage = Math.round((option.votes / totalVotes) * 100);

                return (
                  <div key={option.value}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{option.text}</span>
                      <span className="text-white font-semibold">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          index === 0 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {option.votes.toLocaleString()} votes
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-300">
                {showTamil ? 'மொத்த வாக்குகள்' : 'Total Votes Cast'}
              </div>
              <div className="text-2xl font-bold text-white">
                {currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                {showTamil ? 'நேரலையில் புதுப்பிக்கப்பட்டது' : 'Updated in real-time'}
              </div>
            </div>
          </div>

          {/* Demographic Breakdown */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {showTamil ? 'மக்கள்தொகை பிரிவினை' : 'Demographic Breakdown (TN)'}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400 mb-3">
                  {showTamil ? 'சாதி அடிப்படையில்' : 'By Caste Category'}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">OBC/MBC Communities</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="text-white text-sm">72%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">SC/ST Communities</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-white text-sm">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Forward Castes</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                    </div>
                    <span className="text-white text-sm">58%</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="text-xs text-gray-400 mb-3">
                  {showTamil ? 'பிராந்தியம் அடிப்படையில்' : 'By Region'}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Chennai Metro</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-white text-sm">68%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Coimbatore Region</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                    <span className="text-white text-sm">71%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Southern TN Districts</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                    <span className="text-white text-sm">62%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              {showTamil ? 'பிரபல அரசியல் பிரச்சினைகள்' : 'Trending TN Political Issues'}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <Droplet className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-gray-300 text-sm">
                    {showTamil ? 'காவிரி நீர் பிரச்சினை' : 'Cauvery Water Issue'}
                  </span>
                </div>
                <span className="text-green-400 text-sm font-medium">↑ 34%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2 text-purple-400" />
                  <span className="text-gray-300 text-sm">
                    {showTamil ? 'நீட் தேர்வு எதிர்ப்பு' : 'NEET Exam Opposition'}
                  </span>
                </div>
                <span className="text-green-400 text-sm font-medium">↑ 28%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <Wheat className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="text-gray-300 text-sm">
                    {showTamil ? 'விவசாய கடன் தள்ளுபடி' : 'Farm Loan Waiver'}
                  </span>
                </div>
                <span className="text-green-400 text-sm font-medium">↑ 25%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-gray-300 text-sm">
                    {showTamil ? 'வேலை வாய்ப்புகள்' : 'Job Creation'}
                  </span>
                </div>
                <span className="text-green-400 text-sm font-medium">↑ 22%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-red-400" />
                  <span className="text-gray-300 text-sm">
                    {showTamil ? 'மதுவிலக்கு கொள்கை' : 'Prohibition Policy'}
                  </span>
                </div>
                <span className="text-red-400 text-sm font-medium">↓ 12%</span>
              </div>
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {showTamil ? 'நேரடி செயல்பாடு ஊட்டம்' : 'Live Activity Feed (TN)'}
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-400">3s ago:</span>
                <span className="text-white ml-2">
                  {showTamil
                    ? 'சென்னை அண்ணா நகர் வாக்காளர் வாக்களித்தார்'
                    : 'Voter from Chennai Anna Nagar cast ballot'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">8s ago:</span>
                <span className="text-white ml-2">
                  {showTamil
                    ? 'கோவை RS புரம் தொகுதி உணர்வு +3% உயர்வு'
                    : 'Coimbatore RS Puram constituency sentiment +3%'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">15s ago:</span>
                <span className="text-white ml-2">
                  {showTamil
                    ? 'மதுரை மேற்கு வாக்காளர் வாக்களித்தார்'
                    : 'Voter from Madurai West voted'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">22s ago:</span>
                <span className="text-white ml-2">
                  {showTamil
                    ? 'திருச்சி கான்டன்மென்ட் பகுதி போக்கு புதுப்பிப்பு'
                    : 'Trichy Cantonment regional trend updated'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">28s ago:</span>
                <span className="text-white ml-2">
                  {showTamil
                    ? 'சேலம் மேற்கு இளைஞர் வாக்காளர் பங்கேற்பு'
                    : 'Salem West youth voter participated'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles for animations */}
      <style>{`
        @keyframes bump {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        
        .vote-count.bumped {
          animation: bump 0.3s;
        }
      `}</style>
    </div>
  );
}

