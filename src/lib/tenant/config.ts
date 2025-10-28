/**
 * Tenant Configuration Loader
 * Fetches and caches tenant configuration from the registry
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TenantConfig } from './types';
import { getTenantRegistryUrl } from './identification';

// Cache for tenant configurations
const tenantConfigCache = new Map<string, TenantConfig>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch tenant configuration from registry
 */
export async function fetchTenantConfig(tenantSlug: string): Promise<TenantConfig | null> {
  // Check cache first
  if (tenantConfigCache.has(tenantSlug)) {
    const expiry = cacheExpiry.get(tenantSlug);
    if (expiry && expiry > Date.now()) {
      return tenantConfigCache.get(tenantSlug)!;
    }
  }

  try {
    // Fetch from tenant registry
    const registryUrl = getTenantRegistryUrl();
    const response = await fetch(`${registryUrl}/api/tenants/${tenantSlug}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Tenant '${tenantSlug}' not found`);
      }
      throw new Error(`Failed to fetch tenant config: ${response.statusText}`);
    }

    const config: TenantConfig = await response.json();

    // Validate tenant is active
    if (config.status !== 'active') {
      throw new Error(`Tenant '${tenantSlug}' is not active. Status: ${config.status}`);
    }

    if (config.subscriptionStatus === 'suspended') {
      throw new Error(`Tenant '${tenantSlug}' subscription is suspended`);
    }

    if (config.subscriptionStatus === 'expired') {
      throw new Error(`Tenant '${tenantSlug}' subscription has expired`);
    }

    // Cache the configuration
    tenantConfigCache.set(tenantSlug, config);
    cacheExpiry.set(tenantSlug, Date.now() + CACHE_DURATION);

    return config;
  } catch (error) {
    console.error('Failed to fetch tenant config:', error);
    throw error;
  }
}

/**
 * Load tenant configuration
 * This is the main function to use
 */
export async function loadTenantConfig(tenantSlug: string): Promise<TenantConfig> {
  const config = await fetchTenantConfig(tenantSlug);

  if (!config) {
    throw new Error(`Tenant configuration not found for: ${tenantSlug}`);
  }

  return config;
}

/**
 * Clear tenant config cache
 */
export function clearTenantCache(tenantSlug?: string): void {
  if (tenantSlug) {
    tenantConfigCache.delete(tenantSlug);
    cacheExpiry.delete(tenantSlug);
  } else {
    tenantConfigCache.clear();
    cacheExpiry.clear();
  }
}

/**
 * Preload tenant configurations (for frequently accessed tenants)
 */
export async function preloadTenantConfigs(tenantSlugs: string[]): Promise<void> {
  await Promise.all(tenantSlugs.map(slug => fetchTenantConfig(slug)));
}

/**
 * Create Supabase client for a specific tenant
 */
export function createTenantSupabaseClient(config: TenantConfig): SupabaseClient {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Tenant-ID': config.slug,
      },
    },
  });
}

/**
 * Get Supabase client for current tenant
 */
let currentTenantClient: SupabaseClient | null = null;
let currentTenantSlug: string | null = null;

export async function getTenantSupabaseClient(tenantSlug: string): Promise<SupabaseClient> {
  // Return cached client if for same tenant
  if (currentTenantSlug === tenantSlug && currentTenantClient) {
    return currentTenantClient;
  }

  // Load config and create new client
  const config = await loadTenantConfig(tenantSlug);
  currentTenantClient = createTenantSupabaseClient(config);
  currentTenantSlug = tenantSlug;

  return currentTenantClient;
}

/**
 * Check if feature is enabled for tenant
 */
export function isFeatureEnabled(config: TenantConfig, feature: string): boolean {
  return config.enabledFeatures.includes(feature);
}

/**
 * Check if tenant has reached usage limits
 */
export interface UsageLimitCheck {
  withinLimit: boolean;
  current: number;
  limit: number;
  percentage: number;
}

export function checkUserLimit(config: TenantConfig, currentUsers: number): UsageLimitCheck {
  const percentage = (currentUsers / config.maxUsers) * 100;
  return {
    withinLimit: currentUsers < config.maxUsers,
    current: currentUsers,
    limit: config.maxUsers,
    percentage,
  };
}

export function checkStorageLimit(config: TenantConfig, currentStorageGb: number): UsageLimitCheck {
  const percentage = (currentStorageGb / config.maxStorageGb) * 100;
  return {
    withinLimit: currentStorageGb < config.maxStorageGb,
    current: currentStorageGb,
    limit: config.maxStorageGb,
    percentage,
  };
}

/**
 * Get tenant branding CSS variables
 */
export function getTenantCSSVariables(config: TenantConfig): Record<string, string> {
  return {
    '--tenant-primary-color': config.branding.primaryColor,
    '--tenant-secondary-color': config.branding.secondaryColor,
  };
}

/**
 * Apply tenant branding to document
 */
export function applyTenantBranding(config: TenantConfig): void {
  const root = document.documentElement;
  const cssVars = getTenantCSSVariables(config);

  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Update page title
  document.title = `${config.displayName} - Pulse of People`;

  // Update favicon if custom logo exists
  if (config.branding.logo) {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      favicon.href = config.branding.logo;
    }
  }
}

/**
 * Validate tenant subscription
 */
export interface SubscriptionValidation {
  isValid: boolean;
  status: string;
  daysRemaining?: number;
  message?: string;
}

export function validateSubscription(config: TenantConfig): SubscriptionValidation {
  const now = new Date();

  // Check if trial
  if (config.subscriptionStatus === 'trial') {
    if (config.trialEndDate) {
      const trialEnd = new Date(config.trialEndDate);
      const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysRemaining <= 0) {
        return {
          isValid: false,
          status: 'trial_expired',
          daysRemaining: 0,
          message: 'Your trial has expired. Please upgrade to continue.',
        };
      }

      return {
        isValid: true,
        status: 'trial_active',
        daysRemaining,
        message: daysRemaining <= 3 ? `Trial ending in ${daysRemaining} days` : undefined,
      };
    }
  }

  // Check if active subscription
  if (config.subscriptionStatus === 'active') {
    if (config.paymentStatus === 'overdue') {
      return {
        isValid: true, // Still valid but with warning
        status: 'payment_overdue',
        message: 'Payment overdue. Please update your payment method.',
      };
    }

    return {
      isValid: true,
      status: 'active',
    };
  }

  // Suspended or cancelled
  if (config.subscriptionStatus === 'suspended') {
    return {
      isValid: false,
      status: 'suspended',
      message: 'Your subscription has been suspended. Please contact support.',
    };
  }

  if (config.subscriptionStatus === 'expired') {
    return {
      isValid: false,
      status: 'expired',
      message: 'Your subscription has expired. Please renew to continue.',
    };
  }

  return {
    isValid: false,
    status: 'unknown',
    message: 'Unknown subscription status. Please contact support.',
  };
}

/**
 * Get tenant settings value
 */
export function getTenantSetting<T = any>(
  config: TenantConfig,
  key: string,
  defaultValue: T
): T {
  return (config.customSettings[key] as T) ?? defaultValue;
}

/**
 * Export tenant configuration (for debugging)
 */
export function exportTenantConfig(config: TenantConfig): string {
  const sanitized = {
    ...config,
    supabaseAnonKey: '***REDACTED***',
  };
  return JSON.stringify(sanitized, null, 2);
}
