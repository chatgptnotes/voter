import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle, FileText, Settings, Menu, X, Home, PieChart, LogOut, User, ToggleLeft, Vote, Users, Briefcase, Share2, Target, Brain, Newspaper, Tv, MessageCircle, Crown, Bot, Shield, Zap, Phone, Activity, Database, UserCheck, Lightbulb, Search, TrendingUp, Eye, Download, Smartphone, MapPin } from 'lucide-react'
import RealTimeIndicator from './RealTimeIndicator'
import LoginModal from './LoginModal'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  // Simple logout function for localStorage-based auth
  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_email')
    navigate('/login')
  }

  // Check if user is authenticated via localStorage
  const isAuthenticated = localStorage.getItem('auth_token') === 'authenticated'
  const userEmail = localStorage.getItem('user_email')

  // Use either AuthContext user or simple localStorage user
  const currentUser = user || (isAuthenticated ? {
    name: userEmail?.split('@')[0] || 'Admin',
    email: userEmail,
    role: 'admin'
  } : null)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: location.pathname === '/' || location.pathname === '/dashboard' },
    { name: 'Analytics', href: '/analytics', icon: PieChart, current: location.pathname === '/analytics' },
    { name: 'Voter Database', href: '/voter-database', icon: Users, current: location.pathname === '/voter-database' },
    { name: 'Political Choice', href: '/political-choice', icon: ToggleLeft, current: location.pathname === '/political-choice' },
    { name: 'Political Polling', href: '/political-polling', icon: Vote, current: location.pathname === '/political-polling' },
    { name: 'Social Media', href: '/social-media', icon: Share2, current: location.pathname === '/social-media' },
    { name: 'Competitor Analysis', href: '/competitor-analysis', icon: Target, current: location.pathname === '/competitor-analysis' },
    { name: 'Field Workers', href: '/field-workers', icon: Briefcase, current: location.pathname === '/field-workers' },
    { name: 'AI Insights', href: '/ai-insights', icon: Brain, current: location.pathname === '/ai-insights' },
    { name: 'Press & Media', href: '/press-media-monitoring', icon: Newspaper, current: location.pathname === '/press-media-monitoring' },
    { name: 'TV & Broadcast', href: '/tv-broadcast-analysis', icon: Tv, current: location.pathname === '/tv-broadcast-analysis' },
    { name: 'Social Channels', href: '/social-media-channels', icon: MessageCircle, current: location.pathname === '/social-media-channels' },
    { name: 'Influencer Tracking', href: '/influencer-tracking', icon: Crown, current: location.pathname === '/influencer-tracking' },
    { name: 'Conversation Bot', href: '/conversation-bot', icon: Bot, current: location.pathname === '/conversation-bot' },
    { name: 'DPDP Compliance', href: '/dpdp-compliance', icon: Shield, current: location.pathname === '/dpdp-compliance' },
    { name: 'Privata Integration', href: '/privata-integration', icon: Zap, current: location.pathname === '/privata-integration' },
    { name: 'WhatsApp Bot', href: '/whatsapp-bot', icon: Phone, current: location.pathname === '/whatsapp-bot' },
    { name: 'Pulse Dashboard', href: '/pulse-dashboard', icon: Activity, current: location.pathname === '/pulse-dashboard' },
    { name: 'Advanced Voter DB', href: '/advanced-voter-database', icon: Database, current: location.pathname === '/advanced-voter-database' },
    { name: 'Field Management', href: '/field-worker-management', icon: UserCheck, current: location.pathname === '/field-worker-management' },
    { name: 'AI Insights Engine', href: '/ai-insights-engine', icon: Lightbulb, current: location.pathname === '/ai-insights-engine' },
    { name: 'Magic Search', href: '/magic-search', icon: Search, current: location.pathname === '/magic-search' },
    { name: 'Advanced Charts', href: '/advanced-charts', icon: TrendingUp, current: location.pathname === '/advanced-charts' },
    { name: 'Social Monitoring', href: '/social-monitoring', icon: Eye, current: location.pathname === '/social-monitoring' },
    { name: 'Export Manager', href: '/export-manager', icon: Download, current: location.pathname === '/export-manager' },
    { name: 'Field Worker App', href: '/field-worker-app', icon: Smartphone, current: location.pathname === '/field-worker-app' },
    { name: 'Competitor Tracking', href: '/competitor-tracking', icon: Target, current: location.pathname === '/competitor-tracking' },
    { name: 'Regional Map', href: '/regional-map', icon: MapPin, current: location.pathname === '/regional-map' },
    { name: 'Reports', href: '/reports', icon: FileText, current: location.pathname === '/reports' },
    { name: 'Alerts', href: '/alerts', icon: AlertCircle, current: location.pathname === '/alerts' },
    ...(currentUser?.role === 'admin' ? [
      { name: 'Data Kit', href: '/data-kit', icon: User, current: location.pathname === '/data-kit' },
      { name: 'Submit Data', href: '/submit-data', icon: PieChart, current: location.pathname === '/submit-data' }
    ] : []),
    ...(currentUser?.role === 'admin' ? [
      { name: 'Data Tracking', href: '/data-tracking', icon: FileText, current: location.pathname === '/data-tracking' }
    ] : []),
    { name: 'Settings', href: '/settings', icon: Settings, current: location.pathname === '/settings' }
  ]

  const handleNavigation = (href: string) => {
    navigate(href)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Logo size="small" variant="horizontal" />
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-4 flex-shrink-0 h-6 w-6 ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Logo size="medium" variant="horizontal" />
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 flex-shrink-0 h-6 w-6 ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-3">
            <RealTimeIndicator />
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{currentUser.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={user ? logout : handleLogout}
                  className="text-gray-400 hover:text-gray-600"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="md:hidden mb-4">
                <RealTimeIndicator />
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>
      
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  )
}