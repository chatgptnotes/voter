# Supabase Setup Guide - Tamil Nadu Voter Platform

## Overview
Complete Supabase database setup for Pulse of People voter sentiment analysis platform.

**Status**: Database schema ready to deploy  
**Tables**: 10 core tables  
**Storage**: 5 buckets configured  
**Security**: RLS policies + tenant isolation

---

## What Was Created

### 1. Migration Files (3 files in `/supabase/migrations/`)

#### 20251108_create_voter_platform_tables.sql
- **voters** table (Tamil Nadu voter database with DPDP compliance)
- **field_workers** table (GPS tracking, performance metrics)  
- **polling_data** table (Political polls & surveys for 234 constituencies)
- **social_media_posts** table (Twitter/Facebook/Instagram monitoring with AI sentiment)
- **competitor_campaigns** table (DMK/AIADMK/BJP tracking)
- **analytics_snapshots** table (Daily metrics storage for trend analysis)
- **reports** table (Generated PDF/Excel reports)
- **alerts** table (Multi-channel critical notifications)
- **ai_predictions** table (ML model outputs for election predictions)
- **audit_logs** table (Compliance-ready immutable logs)
- Indexes for performance (50K+ voters, 100K+ social posts)
- Auto-update triggers for updated_at columns

#### 20251108_rls_policies_voter_platform.sql
- Row Level Security (RLS) enabled on all 10 tables
- Tenant isolation policies (users only see their org's data)
- Role-based access control (admin/user/manager permissions)
- Helper functions: has_role_in_tenant(), is_admin(), get_user_tenant_ids()
- Realtime publication for voters, field_workers, polling_data, social_media_posts, alerts
- Security grants for authenticated users and service_role

#### 20251108_storage_buckets_setup.sql
- **voter-photos** bucket (5MB limit, JPEG/PNG/WebP, private)
- **field-worker-photos** bucket (3MB limit, private)
- **reports** bucket (50MB limit, PDF/Excel/CSV, private)
- **social-media-archive** bucket (10MB limit, screenshots/videos)
- **competitor-media** bucket (20MB limit, posters/videos/PDFs)
- RLS policies on all storage buckets (tenant-isolated)
- Helper functions: get_voter_photo_url(), cleanup_orphaned_storage_files()

### 2. Frontend Supabase Client (/src/lib/supabase.ts)

**Authentication helpers**: signIn(), signUp(), signOut(), getSession(), getUser()  
**Voters database**: fetchVoters(), createVoter(), updateVoter(), deleteVoter()  
**Field workers**: fetchFieldWorkers(), updateFieldWorkerLocation()  
**Polling data**: fetchPolls(), submitPollVote()  
**Social media**: fetchSocialMediaPosts()  
**Analytics**: fetchLatestAnalytics(), fetchAnalyticsTrend()  
**Storage**: uploadVoterPhoto(), uploadReport()  
**Realtime**: subscribeToVoters(), subscribeToAlerts(), subscribeToFieldWorkerLocations()

---

## How to Deploy to Supabase

### Prerequisites
1. Supabase project created at https://supabase.com
2. Supabase CLI installed: npm install -g supabase
3. Environment variables configured

### Step 1: Link Your Supabase Project

```bash
supabase login
supabase link --project-ref your-project-ref
```

### Step 2: Apply Migrations

```bash
cd /Users/murali/1backup/pulseofpeople6nov/voter
supabase db push
```

### Step 3: Configure Environment Variables

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Test Connection

```bash
npm run dev
```

---

**Project Status**: 10/100 tasks complete (10%)  
**Last Updated**: 2025-11-08  
**Version**: 1.0
