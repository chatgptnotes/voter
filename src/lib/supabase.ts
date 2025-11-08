/**
 * Supabase Client Configuration
 * Tamil Nadu Voter Sentiment Analysis Platform
 * Handles authentication, database queries, storage, and realtime subscriptions
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'pulse-of-people-auth',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'pulse-of-people-voter-platform',
    },
  },
});

// =====================================================
// AUTHENTICATION HELPERS
// =====================================================

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign up new user
 */
export const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get current user session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

/**
 * Get current user
 */
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// =====================================================
// VOTERS DATABASE HELPERS
// =====================================================

/**
 * Fetch all voters for current tenant (with pagination)
 */
export const fetchVoters = async (page = 1, pageSize = 50, filters?: {
  district?: string;
  constituency?: string;
  caste_category?: string;
  party_preference?: string;
  search?: string;
}) => {
  let query = supabase
    .from('voters')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  // Apply filters
  if (filters?.district) {
    query = query.eq('district', filters.district);
  }
  if (filters?.constituency) {
    query = query.eq('constituency', filters.constituency);
  }
  if (filters?.caste_category) {
    query = query.eq('caste_category', filters.caste_category);
  }
  if (filters?.party_preference) {
    query = query.eq('party_preference', filters.party_preference);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,voter_id.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    voters: data,
    total: count || 0,
    pages: Math.ceil((count || 0) / pageSize),
  };
};

/**
 * Create new voter
 */
export const createVoter = async (voter: any) => {
  const { data, error } = await supabase
    .from('voters')
    .insert(voter)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update voter
 */
export const updateVoter = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('voters')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete voter
 */
export const deleteVoter = async (id: string) => {
  const { error } = await supabase
    .from('voters')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// FIELD WORKERS HELPERS
// =====================================================

/**
 * Fetch all field workers
 */
export const fetchFieldWorkers = async (filters?: {
  district?: string;
  level?: string;
  is_active?: boolean;
}) => {
  let query = supabase
    .from('field_workers')
    .select('*')
    .order('performance_rating', { ascending: false });

  if (filters?.district) {
    query = query.eq('district', filters.district);
  }
  if (filters?.level) {
    query = query.eq('level', filters.level);
  }
  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Update field worker location (GPS tracking)
 */
export const updateFieldWorkerLocation = async (id: string, latitude: number, longitude: number) => {
  const { error } = await supabase
    .from('field_workers')
    .update({
      current_location: `POINT(${longitude} ${latitude})`,
      last_location_update: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// POLLING DATA HELPERS
// =====================================================

/**
 * Fetch polling data
 */
export const fetchPolls = async (filters?: {
  is_active?: boolean;
  poll_category?: string;
  district?: string;
}) => {
  let query = supabase
    .from('polling_data')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }
  if (filters?.poll_category) {
    query = query.eq('poll_category', filters.poll_category);
  }
  if (filters?.district) {
    query = query.eq('district', filters.district);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Submit poll vote
 */
export const submitPollVote = async (pollId: string, optionValue: string, voterDemographics?: {
  age?: number;
  gender?: string;
  caste_category?: string;
  district?: string;
}) => {
  // Fetch current poll
  const { data: poll, error: fetchError } = await supabase
    .from('polling_data')
    .select('*')
    .eq('poll_id', pollId)
    .single();

  if (fetchError) throw fetchError;

  // Update vote count
  const updatedOptions = (poll.options as any[]).map((opt: any) => {
    if (opt.value === optionValue) {
      return { ...opt, votes: opt.votes + 1 };
    }
    return opt;
  });

  // Update demographic breakdown (simplified)
  const updatedVotesByAge = { ...(poll.votes_by_age as any) };
  if (voterDemographics?.age) {
    const ageBracket = voterDemographics.age < 26 ? '18-25' : voterDemographics.age < 36 ? '26-35' : '36+';
    updatedVotesByAge[ageBracket] = (updatedVotesByAge[ageBracket] || 0) + 1;
  }

  const { data, error } = await supabase
    .from('polling_data')
    .update({
      options: updatedOptions,
      total_votes: poll.total_votes + 1,
      total_respondents: poll.total_respondents + 1,
      votes_by_age: updatedVotesByAge,
    })
    .eq('poll_id', pollId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================================
// SOCIAL MEDIA MONITORING HELPERS
// =====================================================

/**
 * Fetch social media posts
 */
export const fetchSocialMediaPosts = async (filters?: {
  platform?: string;
  sentiment_label?: string;
  is_trending?: boolean;
  district?: string;
  limit?: number;
}) => {
  let query = supabase
    .from('social_media_posts')
    .select('*')
    .order('posted_at', { ascending: false });

  if (filters?.platform) {
    query = query.eq('platform', filters.platform);
  }
  if (filters?.sentiment_label) {
    query = query.eq('sentiment_label', filters.sentiment_label);
  }
  if (filters?.is_trending !== undefined) {
    query = query.eq('is_trending', filters.is_trending);
  }
  if (filters?.district) {
    query = query.eq('district', filters.district);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// =====================================================
// ANALYTICS HELPERS
// =====================================================

/**
 * Fetch latest analytics snapshot
 */
export const fetchLatestAnalytics = async (district?: string) => {
  let query = supabase
    .from('analytics_snapshots')
    .select('*')
    .order('snapshot_date', { ascending: false })
    .limit(1);

  if (district) {
    query = query.eq('district', district);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data?.[0] || null;
};

/**
 * Fetch analytics trend (last 30 days)
 */
export const fetchAnalyticsTrend = async (days = 30, district?: string) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let query = supabase
    .from('analytics_snapshots')
    .select('*')
    .gte('snapshot_date', startDate.toISOString().split('T')[0])
    .order('snapshot_date', { ascending: true });

  if (district) {
    query = query.eq('district', district);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// =====================================================
// STORAGE HELPERS
// =====================================================

/**
 * Upload voter photo
 */
export const uploadVoterPhoto = async (voterId: string, file: File, tenantId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${tenantId}/${voterId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('voter-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = supabase.storage
    .from('voter-photos')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

/**
 * Upload report file
 */
export const uploadReport = async (reportId: string, file: File, tenantId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${tenantId}/reports/${reportId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('reports')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('reports')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

// =====================================================
// REALTIME SUBSCRIPTIONS
// =====================================================

/**
 * Subscribe to new voters
 */
export const subscribeToVoters = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('voters-channel')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'voters',
    }, callback)
    .subscribe();

  return subscription;
};

/**
 * Subscribe to alerts
 */
export const subscribeToAlerts = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('alerts-channel')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'alerts',
    }, callback)
    .subscribe();

  return subscription;
};

/**
 * Subscribe to field worker location updates
 */
export const subscribeToFieldWorkerLocations = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('field-workers-channel')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'field_workers',
    }, callback)
    .subscribe();

  return subscription;
};

// Export default client
export default supabase;
