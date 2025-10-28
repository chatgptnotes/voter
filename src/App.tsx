import { Routes, Route } from 'react-router-dom'
import { RealTimeProvider } from './contexts/RealTimeContext'
import { AuthProvider } from './contexts/AuthContext'
import { PermissionProvider } from './contexts/PermissionContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import LandingLayout from './components/LandingLayout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import DataCaptureKit from './pages/DataCaptureKit'
import DataSubmission from './pages/DataSubmission'
import DataTracking from './pages/DataTracking'
import PoliticalPolling from './pages/PoliticalPolling'
import PoliticalChoice from './pages/PoliticalChoice'
import VoterDatabasePage from './pages/VoterDatabase'
import FieldWorkers from './pages/FieldWorkers'
import SocialMedia from './pages/SocialMedia'
import CompetitorAnalysis from './pages/CompetitorAnalysis'
import AIInsights from './pages/AIInsights'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import PressMediaMonitoring from './pages/PressMediaMonitoring'
import TVBroadcastAnalysis from './pages/TVBroadcastAnalysis'
import SocialMediaChannels from './pages/SocialMediaChannels'
import InfluencerTracking from './pages/InfluencerTracking'
import ConversationBot from './pages/ConversationBot'
import EnhancedWardHeatmap from './components/EnhancedWardHeatmap'
import ManifestoMatch from './components/ManifestoMatch'
import FeedbackChatbot from './components/FeedbackChatbot'
import MyConstituency from './components/MyConstituencyApp'
import Subscription from './pages/Subscription'
import AgenticPlatform from './components/AgenticPlatform'
import DPDPCompliance from './components/DPDPCompliance'
import PrivataIntegration from './components/PrivataIntegration'
import WhatsAppBot from './components/WhatsAppBot'
import PulseOfPeopleDashboard from './components/PulseOfPeopleDashboard'
import VoterDatabaseComponent from './components/VoterDatabase'
import FieldWorkerManagement from './components/FieldWorkerManagement'
import AIInsightsEngine from './components/AIInsightsEngine'
import MagicSearchBar from './components/MagicSearchBar'
import AdvancedCharts from './pages/AdvancedCharts'
import SocialMediaMonitoring from './components/SocialMediaMonitoring'
import ExportManager from './components/ExportManager'
import FieldWorkerApp from './components/FieldWorkerApp'
import CompetitorTracking from './components/CompetitorTracking'
import RegionalMap from './pages/RegionalMap'
import { MobileContactBar } from './components/MobileResponsive'
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard'
import AdminManagement from './pages/SuperAdmin/AdminManagement'
import TenantRegistry from './pages/SuperAdmin/TenantRegistry'
import Unauthorized from './pages/Unauthorized'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PermissionProvider>
          <RealTimeProvider>
            <ErrorBoundary>
              <Routes>
              {/* Landing Page with minimal layout */}
              <Route path="/" element={
                <LandingLayout>
                  <LandingPage />
                </LandingLayout>
              } />

              {/* Login Page */}
              <Route path="/login" element={<Login />} />

              {/* Dashboard and other pages with full layout - All Protected */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={
                <ProtectedRoute>
                  <Layout>
                    <Alerts />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/data-kit" element={
                <ProtectedRoute>
                  <Layout>
                    <DataCaptureKit />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/submit-data" element={
                <ProtectedRoute>
                  <Layout>
                    <DataSubmission />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/data-tracking" element={
                <ProtectedRoute>
                  <Layout>
                    <DataTracking />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/political-polling" element={
                <ProtectedRoute>
                  <Layout>
                    <PoliticalPolling />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/political-choice" element={
                <ProtectedRoute>
                  <Layout>
                    <PoliticalChoice />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/voter-database" element={
                <ProtectedRoute>
                  <Layout>
                    <VoterDatabasePage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/field-workers" element={
                <ProtectedRoute>
                  <Layout>
                    <FieldWorkers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/social-media" element={
                <ProtectedRoute>
                  <Layout>
                    <SocialMedia />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/competitor-analysis" element={
                <ProtectedRoute>
                  <Layout>
                    <CompetitorAnalysis />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/ai-insights" element={
                <ProtectedRoute>
                  <Layout>
                    <AIInsights />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* New Feature Pages */}
              <Route path="/heatmap" element={
                <ProtectedRoute>
                  <Layout>
                    <EnhancedWardHeatmap />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/manifesto" element={
                <ProtectedRoute>
                  <Layout>
                    <ManifestoMatch />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/feedback" element={
                <ProtectedRoute>
                  <Layout>
                    <FeedbackChatbot />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/constituency" element={
                <ProtectedRoute>
                  <Layout>
                    <MyConstituency />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/subscription" element={
                <ProtectedRoute>
                  <Layout>
                    <Subscription />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pulse" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/agents" element={
                <ProtectedRoute>
                  <Layout>
                    <AgenticPlatform />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Data Collection Pages */}
              <Route path="/press-media-monitoring" element={
                <ProtectedRoute>
                  <Layout>
                    <PressMediaMonitoring />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tv-broadcast-analysis" element={
                <ProtectedRoute>
                  <Layout>
                    <TVBroadcastAnalysis />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/social-media-channels" element={
                <ProtectedRoute>
                  <Layout>
                    <SocialMediaChannels />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/influencer-tracking" element={
                <ProtectedRoute>
                  <Layout>
                    <InfluencerTracking />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/conversation-bot" element={
                <ProtectedRoute>
                  <Layout>
                    <ConversationBot />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Additional Feature Pages */}
              <Route path="/dpdp-compliance" element={
                <ProtectedRoute>
                  <Layout>
                    <DPDPCompliance />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/privata-integration" element={
                <ProtectedRoute>
                  <Layout>
                    <PrivataIntegration />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/whatsapp-bot" element={
                <ProtectedRoute>
                  <Layout>
                    <WhatsAppBot />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pulse-dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <PulseOfPeopleDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Advanced Component Pages */}
              <Route path="/advanced-voter-database" element={
                <ProtectedRoute>
                  <Layout>
                    <VoterDatabaseComponent />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/field-worker-management" element={
                <ProtectedRoute>
                  <Layout>
                    <FieldWorkerManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/ai-insights-engine" element={
                <ProtectedRoute>
                  <Layout>
                    <AIInsightsEngine />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/magic-search" element={
                <ProtectedRoute>
                  <Layout>
                    <MagicSearchBar />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/advanced-charts" element={
                <ProtectedRoute>
                  <Layout>
                    <AdvancedCharts />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/social-monitoring" element={
                <ProtectedRoute>
                  <Layout>
                    <SocialMediaMonitoring />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/export-manager" element={
                <ProtectedRoute>
                  <Layout>
                    <ExportManager />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/field-worker-app" element={
                <ProtectedRoute>
                  <Layout>
                    <FieldWorkerApp />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/competitor-tracking" element={
                <ProtectedRoute>
                  <Layout>
                    <CompetitorTracking />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/regional-map" element={
                <ProtectedRoute>
                  <Layout>
                    <RegionalMap />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/demo-requests" element={<AdminDashboard />} />

              {/* Super Admin Routes */}
              <Route path="/super-admin/dashboard" element={
                <ProtectedRoute requiredPermission="manage_organizations">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/super-admin/admins" element={
                <ProtectedRoute requiredPermission="manage_organizations">
                  <AdminManagement />
                </ProtectedRoute>
              } />
              <Route path="/super-admin/tenants" element={
                <ProtectedRoute requiredPermission="manage_organizations">
                  <TenantRegistry />
                </ProtectedRoute>
              } />

              {/* Unauthorized Page */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              </Routes>
              <MobileContactBar />
            </ErrorBoundary>
          </RealTimeProvider>
        </PermissionProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App