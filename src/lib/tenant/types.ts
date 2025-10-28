/**
 * Multi-Tenant System Types
 * Defines all TypeScript interfaces for tenant management
 */

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  displayName: string;

  // Supabase connection
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseRegion: string;

  // Contact info
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  organizationName?: string;

  // Subscription
  subscriptionStatus: 'trial' | 'active' | 'suspended' | 'cancelled' | 'expired';
  subscriptionTier: 'basic' | 'standard' | 'premium' | 'enterprise';
  subscriptionStart: string;
  subscriptionEnd?: string;
  trialEndDate?: string;

  // Billing
  monthlyFee: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'failed';
  nextBillingDate?: string;

  // Coverage
  coverageArea: string;
  state: string;
  districts: string[];
  wardCount: number;
  expectedUsers: number;

  // Configuration
  enabledFeatures: string[];
  customSettings: Record<string, any>;
  dataResidency: 'india' | 'singapore' | 'us' | 'eu';

  // Branding
  branding: TenantBranding;
  customDomain?: string;

  // Limits
  maxUsers: number;
  maxWards: number;
  maxStorageGb: number;
  maxApiCallsPerHour: number;

  // Status
  status: 'active' | 'inactive' | 'suspended' | 'deleted';
  isDemo: boolean;

  // Metadata
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TenantBranding {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain?: string;
}

export interface TenantUsage {
  tenantId: string;
  date: string;

  // API usage
  apiCalls: number;
  apiCallsPeakHour: number;

  // Storage
  storageUsedGb: number;
  storageMediaGb: number;
  storageDatabaseGb: number;

  // Users
  activeUsers: number;
  totalUsers: number;
  newUsers: number;

  // Data records
  sentimentRecordsCreated: number;
  socialPostsCreated: number;
  fieldReportsCreated: number;
  surveyResponsesCreated: number;

  // Performance
  avgResponseTimeMs: number;
  errorCount: number;
  errorRate: number;
}

export interface TenantEvent {
  id: string;
  tenantId: string;
  eventType: string;
  eventCategory: 'lifecycle' | 'billing' | 'configuration' | 'security' | 'performance';
  description: string;
  metadata: Record<string, any>;
  triggeredBy: string;
  ipAddress?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
}

export interface TenantHealthCheck {
  id: string;
  tenantId: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  healthScore: number;
  databaseAccessible: boolean;
  databaseResponseTimeMs: number;
  apiAccessible: boolean;
  apiResponseTimeMs: number;
  storageAccessible: boolean;
  authAccessible: boolean;
  issues: string[];
  warnings: string[];
  checkedAt: string;
}

export interface TenantOnboardingRequest {
  name: string;
  displayName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  organizationName?: string;
  region: string;
  state: string;
  coverageArea: string;
  estimatedWards: number;
  expectedUsers: number;
  subscriptionTier: 'basic' | 'standard' | 'premium' | 'enterprise';
  customDomain?: string;
}

export interface TenantProvisioningResult {
  success: boolean;
  tenant?: TenantConfig;
  error?: string;
  supabaseProjectId?: string;
  adminCredentials?: {
    email: string;
    temporaryPassword: string;
  };
}

export interface TenantIdentification {
  method: 'subdomain' | 'path' | 'header' | 'token';
  value: string;
  tenantId: string;
  tenantSlug: string;
}

export interface TenantContext {
  tenant: TenantConfig;
  user?: any;
  permissions: string[];
  features: string[];
}

export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'deleted';
export type SubscriptionStatus = 'trial' | 'active' | 'suspended' | 'cancelled' | 'expired';
export type SubscriptionTier = 'basic' | 'standard' | 'premium' | 'enterprise';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'failed';
