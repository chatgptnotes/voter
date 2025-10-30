import React, { useState, useEffect } from 'react';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  DateRange as DateRangeIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  CloudDownload as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

interface AnalyticsMetric {
  label: string;
  value: number;
  previousValue: number;
  format?: 'number' | 'percent' | 'currency' | 'duration';
  icon: React.ReactNode;
  color: string;
}

interface UserActivity {
  date: string;
  activeUsers: number;
  newUsers: number;
  sessionDuration: number;
  pageViews: number;
}

interface FeatureUsage {
  feature: string;
  usage: number;
  trend: number;
}

interface ConversionMetric {
  step: string;
  users: number;
  dropoff: number;
}

type TimeRange = '7d' | '30d' | '90d' | '1y';
type ChartType = 'line' | 'bar' | 'pie';

export function AnalyticsDashboard() {
  const { supabase, user } = useAuth();
  const { currentTenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartType, setChartType] = useState<ChartType>('line');

  // Metrics state
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
  const [conversionData, setConversionData] = useState<ConversionMetric[]>([]);

  useEffect(() => {
    if (currentTenant) {
      loadAnalytics();
    }
  }, [currentTenant, timeRange]);

  async function loadAnalytics() {
    try {
      setLoading(true);

      await Promise.all([
        loadKeyMetrics(),
        loadUserActivity(),
        loadFeatureUsage(),
        loadConversionData(),
      ]);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadKeyMetrics() {
    if (!currentTenant) return;

    const days = getDaysFromTimeRange(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total Users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', currentTenant.id);

    const { count: previousTotalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', currentTenant.id)
      .lt('created_at', startDate.toISOString());

    // Active Users
    const { count: activeUsers } = await supabase
      .from('activity_logs')
      .select('user_id', { count: 'exact', head: true })
      .eq('tenant_id', currentTenant.id)
      .gte('created_at', startDate.toISOString());

    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const { count: previousActiveUsers } = await supabase
      .from('activity_logs')
      .select('user_id', { count: 'exact', head: true })
      .eq('tenant_id', currentTenant.id)
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    // Page Views
    const { count: pageViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', currentTenant.id)
      .gte('created_at', startDate.toISOString());

    const { count: previousPageViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', currentTenant.id)
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    // Engagement Rate (mock calculation)
    const engagementRate = activeUsers && totalUsers ? (activeUsers / totalUsers) * 100 : 0;
    const previousEngagementRate = previousActiveUsers && previousTotalUsers
      ? (previousActiveUsers / previousTotalUsers) * 100
      : 0;

    setMetrics([
      {
        label: 'Total Users',
        value: totalUsers || 0,
        previousValue: previousTotalUsers || 0,
        format: 'number',
        icon: <PeopleIcon className="w-6 h-6" />,
        color: 'blue',
      },
      {
        label: 'Active Users',
        value: activeUsers || 0,
        previousValue: previousActiveUsers || 0,
        format: 'number',
        icon: <TrendingUpIcon className="w-6 h-6" />,
        color: 'green',
      },
      {
        label: 'Page Views',
        value: pageViews || 0,
        previousValue: previousPageViews || 0,
        format: 'number',
        icon: <ShowChartIcon className="w-6 h-6" />,
        color: 'purple',
      },
      {
        label: 'Engagement Rate',
        value: engagementRate,
        previousValue: previousEngagementRate,
        format: 'percent',
        icon: <AssessmentIcon className="w-6 h-6" />,
        color: 'orange',
      },
    ]);
  }

  async function loadUserActivity() {
    if (!currentTenant) return;

    const days = getDaysFromTimeRange(timeRange);
    const activityData: UserActivity[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Active users for this day
      const { data: activities } = await supabase
        .from('activity_logs')
        .select('user_id, created_at')
        .eq('tenant_id', currentTenant.id)
        .gte('created_at', dateString)
        .lt('created_at', nextDate.toISOString().split('T')[0]);

      const uniqueUsers = new Set(activities?.map(a => a.user_id) || []);

      // New users for this day
      const { count: newUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', currentTenant.id)
        .gte('created_at', dateString)
        .lt('created_at', nextDate.toISOString().split('T')[0]);

      // Page views for this day
      const { count: pageViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', currentTenant.id)
        .gte('created_at', dateString)
        .lt('created_at', nextDate.toISOString().split('T')[0]);

      activityData.push({
        date: dateString,
        activeUsers: uniqueUsers.size,
        newUsers: newUsers || 0,
        sessionDuration: Math.floor(Math.random() * 120) + 60, // Mock data
        pageViews: pageViews || 0,
      });
    }

    setUserActivity(activityData);
  }

  async function loadFeatureUsage() {
    if (!currentTenant) return;

    const days = getDaysFromTimeRange(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_name')
      .eq('tenant_id', currentTenant.id)
      .gte('created_at', startDate.toISOString());

    // Group by feature
    const featureCounts: Record<string, number> = {};
    events?.forEach(event => {
      featureCounts[event.event_name] = (featureCounts[event.event_name] || 0) + 1;
    });

    const features: FeatureUsage[] = Object.entries(featureCounts)
      .map(([feature, usage]) => ({
        feature,
        usage,
        trend: Math.random() * 40 - 20, // Mock trend
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10);

    setFeatureUsage(features);
  }

  async function loadConversionData() {
    // Mock conversion funnel data
    const conversionSteps: ConversionMetric[] = [
      { step: 'Landing Page Visit', users: 1000, dropoff: 0 },
      { step: 'Sign Up Started', users: 750, dropoff: 25 },
      { step: 'Profile Completed', users: 600, dropoff: 20 },
      { step: 'First Action', users: 450, dropoff: 25 },
      { step: 'Active User', users: 350, dropoff: 22 },
    ];

    setConversionData(conversionSteps);
  }

  function getDaysFromTimeRange(range: TimeRange): number {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
    }
  }

  function formatValue(value: number, format?: string): string {
    switch (format) {
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `₹${value.toLocaleString()}`;
      case 'duration':
        return `${Math.floor(value / 60)}m ${value % 60}s`;
      default:
        return value.toLocaleString();
    }
  }

  function calculateChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  function getColorClass(color: string, variant: 'bg' | 'text' | 'border'): string {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
    };
    return colors[color]?.[variant] || colors.blue[variant];
  }

  async function exportAnalytics() {
    const data = {
      timeRange,
      metrics,
      userActivity,
      featureUsage,
      conversionData,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${timeRange}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Track usage, activity, and trends for {currentTenant?.name}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadAnalytics}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshIcon className="w-5 h-5 mr-2" />
                Refresh
              </button>
              <button
                onClick={exportAnalytics}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center mt-6 space-x-2">
            <DateRangeIcon className="w-5 h-5 text-gray-400" />
            <div className="flex bg-white border border-gray-300 rounded-lg p-1">
              {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range === '7d' && 'Last 7 Days'}
                  {range === '30d' && 'Last 30 Days'}
                  {range === '90d' && 'Last 90 Days'}
                  {range === '1y' && 'Last Year'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const change = calculateChange(metric.value, metric.previousValue);
            const isPositive = change >= 0;

            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClass(metric.color, 'bg')}`}>
                    <div className={getColorClass(metric.color, 'text')}>{metric.icon}</div>
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <TrendingUpIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDownIcon className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(change).toFixed(1)}%
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatValue(metric.value, metric.format)}
                </h3>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Activity Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Activity Trends</h3>
              <TimelineIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {userActivity.slice(-7).map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {activity.activeUsers} users
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (activity.activeUsers / Math.max(...userActivity.map(a => a.activeUsers))) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Usage */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Features</h3>
              <BarChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {featureUsage.slice(0, 5).map((feature, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{feature.feature}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-gray-900 mr-2">
                        {feature.usage.toLocaleString()}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          feature.trend >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {feature.trend >= 0 ? '+' : ''}
                        {feature.trend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (feature.usage / Math.max(...featureUsage.map(f => f.usage))) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
            <PieChartIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {conversionData.map((step, index) => {
              const conversionRate = index === 0
                ? 100
                : (step.users / conversionData[0].users) * 100;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{step.step}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {step.users.toLocaleString()} users
                      </span>
                      <span className="text-sm text-gray-600">
                        {conversionRate.toFixed(1)}%
                      </span>
                      {index > 0 && (
                        <span className="text-sm text-red-600">
                          -{step.dropoff}% dropoff
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all"
                      style={{ width: `${conversionRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Summary Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Daily Activity Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Session
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userActivity.slice(-14).reverse().map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.activeUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {activity.newUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {activity.pageViews.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatValue(activity.sessionDuration, 'duration')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
