-- =====================================================
-- PULSE OF PEOPLE - VOTER PLATFORM CORE TABLES
-- Migration: 20251108_create_voter_platform_tables.sql
-- Description: Complete database schema for Tamil Nadu voter sentiment analysis
-- Tables: voters, field_workers, polling_data, social_media_posts,
--         competitor_campaigns, analytics_snapshots, reports, alerts,
--         ai_predictions, audit_logs
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For GPS coordinates
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- =====================================================
-- 1. VOTERS TABLE - Core voter database
-- Supports 234 TN constituencies + 30 Puducherry
-- =====================================================

CREATE TABLE IF NOT EXISTS voters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  voter_id VARCHAR(10) UNIQUE NOT NULL, -- TN format: ABC1234567
  epic_number VARCHAR(20), -- Alternative voter ID
  name VARCHAR(255) NOT NULL,
  name_tamil VARCHAR(255), -- தமிழ் பெயர்

  -- Demographics
  age INTEGER CHECK (age >= 18 AND age <= 120),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),

  -- Caste & Religion (for analytics, privacy-sensitive)
  caste_category VARCHAR(10) CHECK (caste_category IN ('FC', 'OBC', 'MBC', 'SC', 'ST')),
  caste VARCHAR(50), -- Specific caste (Vanniyar, Thevar, Gounder, etc.)
  religion VARCHAR(20),

  -- Location (Tamil Nadu specific)
  district VARCHAR(50) NOT NULL,
  constituency VARCHAR(100) NOT NULL,
  assembly_code VARCHAR(10), -- 001-234 for TN, 235-264 for PY
  booth_number VARCHAR(20),
  booth_code VARCHAR(20), -- CHN-AN-001 format

  -- Address
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  pincode VARCHAR(6),

  -- Contact (encrypted in production)
  phone VARCHAR(15),
  whatsapp VARCHAR(15),
  email VARCHAR(255),

  -- Voting Behavior
  voting_history JSONB DEFAULT '[]', -- Array of {year, voted, party}
  party_preference VARCHAR(50), -- DMK, AIADMK, BJP, TVK, etc.
  swing_voter BOOLEAN DEFAULT false,
  first_time_voter BOOLEAN DEFAULT false,

  -- TVK Campaign Data
  tvk_supporter BOOLEAN DEFAULT false,
  tvk_volunteer BOOLEAN DEFAULT false,
  contacted_by_tvk BOOLEAN DEFAULT false,
  last_contact_date DATE,
  sentiment_score DECIMAL(3,2) CHECK (sentiment_score BETWEEN -1 AND 1), -- -1 to +1

  -- Interests & Issues
  primary_issue VARCHAR(50), -- Cauvery, Jobs, NEET, etc.
  secondary_issues TEXT[], -- Array of issues
  occupation VARCHAR(100),
  income_bracket VARCHAR(20),
  education_level VARCHAR(50),

  -- Social Media
  has_facebook BOOLEAN DEFAULT false,
  has_twitter BOOLEAN DEFAULT false,
  has_whatsapp BOOLEAN DEFAULT true,
  has_instagram BOOLEAN DEFAULT false,

  -- Privacy & Consent
  consent_given BOOLEAN DEFAULT false,
  consent_date TIMESTAMP,
  data_processing_consent BOOLEAN DEFAULT false, -- DPDP Act compliance

  -- Photo Storage
  photo_url TEXT, -- Supabase Storage URL

  -- Metadata
  data_quality_score INTEGER CHECK (data_quality_score BETWEEN 0 AND 100),
  verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  verified_by UUID REFERENCES auth.users(id),

  -- Field Worker Assignment
  assigned_field_worker_id UUID REFERENCES field_workers(id),

  -- Multi-tenancy
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance (50K+ voters expected)
CREATE INDEX idx_voters_voter_id ON voters(voter_id);
CREATE INDEX idx_voters_district ON voters(district);
CREATE INDEX idx_voters_constituency ON voters(constituency);
CREATE INDEX idx_voters_booth_code ON voters(booth_code);
CREATE INDEX idx_voters_caste_category ON voters(caste_category);
CREATE INDEX idx_voters_party_preference ON voters(party_preference);
CREATE INDEX idx_voters_tenant_id ON voters(tenant_id);
CREATE INDEX idx_voters_tvk_supporter ON voters(tvk_supporter);
CREATE INDEX idx_voters_phone ON voters(phone); -- For quick lookup
CREATE INDEX idx_voters_name_trgm ON voters USING gin(name gin_trgm_ops); -- Fuzzy search

-- Full-text search on name (Tamil + English)
CREATE INDEX idx_voters_name_search ON voters USING gin(to_tsvector('english', name));

COMMENT ON TABLE voters IS 'Tamil Nadu voter database with DPDP compliance';

-- =====================================================
-- 2. FIELD_WORKERS TABLE - Ground staff management
-- =====================================================

CREATE TABLE IF NOT EXISTS field_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  worker_id VARCHAR(20) UNIQUE NOT NULL, -- FW001, FW002, etc.
  name VARCHAR(255) NOT NULL,
  name_tamil VARCHAR(255),

  -- Contact
  phone VARCHAR(15) NOT NULL,
  whatsapp VARCHAR(15),
  email VARCHAR(255),

  -- Employment
  level VARCHAR(20) CHECK (level IN ('Junior', 'Mid-Level', 'Senior', 'Team Lead')),
  join_date DATE NOT NULL,
  employment_type VARCHAR(20) CHECK (employment_type IN ('Full-Time', 'Part-Time', 'Volunteer', 'Contract')),
  salary_bracket VARCHAR(20),

  -- Assignment (Tamil Nadu geography)
  district VARCHAR(50) NOT NULL,
  constituencies TEXT[], -- Can cover multiple constituencies
  booths_assigned TEXT[], -- Array of booth codes
  voters_assigned INTEGER DEFAULT 0,

  -- GPS Tracking (PostGIS)
  current_location GEOGRAPHY(POINT, 4326), -- Lat/Long
  last_location_update TIMESTAMP,
  location_tracking_enabled BOOLEAN DEFAULT true,

  -- Performance Metrics
  monthly_target INTEGER DEFAULT 500,
  monthly_achieved INTEGER DEFAULT 0,
  voters_registered INTEGER DEFAULT 0,
  contacts_made INTEGER DEFAULT 0,
  rallies_organized INTEGER DEFAULT 0,
  event_attendance INTEGER DEFAULT 0,
  performance_rating DECIMAL(2,1) CHECK (performance_rating BETWEEN 0 AND 5),
  efficiency_percentage INTEGER CHECK (efficiency_percentage BETWEEN 0 AND 100),

  -- Activity Tracking
  last_activity_date DATE,
  total_distance_km DECIMAL(10,2) DEFAULT 0, -- Total distance traveled
  working_hours_week DECIMAL(5,2) DEFAULT 40,

  -- Skills & Training
  languages_spoken TEXT[] DEFAULT ARRAY['Tamil', 'English'],
  skills TEXT[], -- ['Door-to-door', 'Social media', 'Event management']
  training_completed TEXT[], -- Training modules completed
  strengths TEXT[],
  areas_for_improvement TEXT[],

  -- Mobile App
  app_version VARCHAR(20),
  last_app_sync TIMESTAMP,
  offline_data_pending BOOLEAN DEFAULT false,
  device_id VARCHAR(100),

  -- Availability
  is_active BOOLEAN DEFAULT true,
  availability_status VARCHAR(20) DEFAULT 'Available', -- Available, Busy, Offline, On Leave
  leave_dates DATERANGE[],

  -- Photo
  avatar_url TEXT,

  -- Multi-tenancy
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_field_workers_district ON field_workers(district);
CREATE INDEX idx_field_workers_level ON field_workers(level);
CREATE INDEX idx_field_workers_tenant_id ON field_workers(tenant_id);
CREATE INDEX idx_field_workers_is_active ON field_workers(is_active);
CREATE INDEX idx_field_workers_location ON field_workers USING gist(current_location); -- Spatial index

COMMENT ON TABLE field_workers IS 'Field worker management with GPS tracking';

-- =====================================================
-- 3. POLLING_DATA TABLE - Political polls & surveys
-- =====================================================

CREATE TABLE IF NOT EXISTS polling_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Poll Metadata
  poll_id VARCHAR(50) UNIQUE NOT NULL,
  poll_title VARCHAR(255) NOT NULL,
  poll_title_tamil VARCHAR(255),
  poll_question TEXT NOT NULL,
  poll_question_tamil TEXT,

  -- Poll Configuration
  poll_type VARCHAR(20) CHECK (poll_type IN ('Survey', 'Quick Poll', 'Exit Poll', 'Opinion', 'Issue')),
  poll_category VARCHAR(50), -- Water, Jobs, NEET, Agriculture, etc.
  poll_icon VARCHAR(20), -- For UI
  poll_color VARCHAR(20), -- For UI

  -- Options (JSON array)
  options JSONB NOT NULL, -- [{text: "Yes", value: "yes", votes: 6842}, ...]

  -- Location Targeting
  district VARCHAR(50),
  constituency VARCHAR(100),
  booth_code VARCHAR(20),
  geo_scope VARCHAR(20) DEFAULT 'State-wide', -- State-wide, District, Constituency, Booth

  -- Demographics Targeting
  target_age_min INTEGER,
  target_age_max INTEGER,
  target_gender VARCHAR(10),
  target_caste_category VARCHAR(10),

  -- Results & Analytics
  total_votes INTEGER DEFAULT 0,
  total_respondents INTEGER DEFAULT 0,
  response_rate DECIMAL(5,2), -- Percentage

  -- Demographic Breakdown (JSONB for flexibility)
  votes_by_age JSONB DEFAULT '{}', -- {"18-25": 234, "26-35": 456}
  votes_by_gender JSONB DEFAULT '{}',
  votes_by_caste JSONB DEFAULT '{}',
  votes_by_region JSONB DEFAULT '{}',

  -- Sentiment Analysis
  average_sentiment DECIMAL(3,2) CHECK (average_sentiment BETWEEN -1 AND 1),
  sentiment_trend VARCHAR(20), -- Rising, Falling, Stable

  -- Status
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,

  -- Multi-tenancy
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_polling_data_poll_category ON polling_data(poll_category);
CREATE INDEX idx_polling_data_district ON polling_data(district);
CREATE INDEX idx_polling_data_is_active ON polling_data(is_active);
CREATE INDEX idx_polling_data_tenant_id ON polling_data(tenant_id);

COMMENT ON TABLE polling_data IS 'Political polling & survey data for TN';

-- =====================================================
-- 4. SOCIAL_MEDIA_POSTS TABLE - Social monitoring
-- =====================================================

CREATE TABLE IF NOT EXISTS social_media_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Post Identity
  post_id VARCHAR(100) UNIQUE NOT NULL, -- Twitter tweet ID, FB post ID, etc.
  platform VARCHAR(20) CHECK (platform IN ('Twitter', 'Facebook', 'Instagram', 'YouTube', 'WhatsApp', 'Telegram')),
  post_url TEXT,

  -- Author
  author_username VARCHAR(100),
  author_name VARCHAR(255),
  author_followers_count INTEGER,
  author_verified BOOLEAN DEFAULT false,
  author_type VARCHAR(20), -- Individual, Influencer, Media, Political, Bot

  -- Content
  content TEXT NOT NULL,
  content_language VARCHAR(10) DEFAULT 'tamil', -- tamil, english, mixed
  hashtags TEXT[], -- Array of hashtags
  mentions TEXT[], -- Array of @mentions

  -- Media
  has_image BOOLEAN DEFAULT false,
  has_video BOOLEAN DEFAULT false,
  media_urls TEXT[],

  -- Engagement Metrics
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2), -- Percentage

  -- Location
  location VARCHAR(100),
  district VARCHAR(50),
  geo_coordinates GEOGRAPHY(POINT, 4326),

  -- Sentiment Analysis (AI-powered)
  sentiment_score DECIMAL(3,2) CHECK (sentiment_score BETWEEN -1 AND 1), -- -1 (negative) to +1 (positive)
  sentiment_label VARCHAR(20) CHECK (sentiment_label IN ('Positive', 'Negative', 'Neutral', 'Mixed')),
  sentiment_confidence DECIMAL(3,2),

  -- Topic Classification
  primary_topic VARCHAR(50), -- Cauvery, NEET, Jobs, etc.
  topics TEXT[], -- Multiple topics
  mentions_tvk BOOLEAN DEFAULT false,
  mentions_dmk BOOLEAN DEFAULT false,
  mentions_aiadmk BOOLEAN DEFAULT false,
  mentions_bjp BOOLEAN DEFAULT false,

  -- Virality & Trends
  is_trending BOOLEAN DEFAULT false,
  viral_score INTEGER DEFAULT 0, -- Custom virality metric

  -- Timestamps
  posted_at TIMESTAMP NOT NULL,
  collected_at TIMESTAMP DEFAULT NOW(),

  -- Multi-tenancy
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_social_media_platform ON social_media_posts(platform);
CREATE INDEX idx_social_media_posted_at ON social_media_posts(posted_at DESC);
CREATE INDEX idx_social_media_sentiment ON social_media_posts(sentiment_label);
CREATE INDEX idx_social_media_hashtags ON social_media_posts USING gin(hashtags);
CREATE INDEX idx_social_media_mentions_tvk ON social_media_posts(mentions_tvk);
CREATE INDEX idx_social_media_is_trending ON social_media_posts(is_trending);
CREATE INDEX idx_social_media_district ON social_media_posts(district);
CREATE INDEX idx_social_media_tenant_id ON social_media_posts(tenant_id);
CREATE INDEX idx_social_media_content_search ON social_media_posts USING gin(to_tsvector('english', content));

COMMENT ON TABLE social_media_posts IS 'Social media monitoring with sentiment analysis';

-- =====================================================
-- 5. COMPETITOR_CAMPAIGNS TABLE - Opponent tracking
-- =====================================================

CREATE TABLE IF NOT EXISTS competitor_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Campaign Identity
  campaign_id VARCHAR(50) UNIQUE NOT NULL,
  competitor_party VARCHAR(50) NOT NULL, -- DMK, AIADMK, BJP, PMK, DMDK

  -- Campaign Details
  campaign_name VARCHAR(255) NOT NULL,
  campaign_type VARCHAR(30) CHECK (campaign_type IN ('Rally', 'Road Show', 'Door-to-door', 'Social Media', 'TV Ad', 'Print Ad', 'Press Conference')),
  campaign_theme VARCHAR(255),

  -- Location
  district VARCHAR(50),
  constituency VARCHAR(100),
  venue VARCHAR(255),

  -- Date & Time
  event_date DATE,
  event_time TIME,
  duration_hours DECIMAL(4,2),

  -- Attendance & Reach
  estimated_attendance INTEGER,
  actual_attendance INTEGER,
  crowd_sentiment VARCHAR(20), -- Enthusiastic, Moderate, Low

  -- Key Messages
  key_promises TEXT[],
  target_demographics TEXT[], -- Youth, Women, Farmers, etc.
  issues_raised TEXT[], -- Cauvery, Jobs, NEET, etc.

  -- Media Coverage
  media_mentions INTEGER DEFAULT 0,
  tv_coverage BOOLEAN DEFAULT false,
  print_coverage BOOLEAN DEFAULT false,
  social_media_coverage BOOLEAN DEFAULT false,

  -- Analysis
  effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 0 AND 100),
  threat_level VARCHAR(20) CHECK (threat_level IN ('Low', 'Medium', 'High', 'Critical')),
  counter_strategy TEXT,

  -- Resources
  estimated_budget DECIMAL(12,2),

  -- Documentation
  photos TEXT[], -- Array of image URLs
  videos TEXT[],
  press_releases TEXT[],

  -- Multi-tenancy
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_competitor_party ON competitor_campaigns(competitor_party);
CREATE INDEX idx_competitor_district ON competitor_campaigns(district);
CREATE INDEX idx_competitor_event_date ON competitor_campaigns(event_date DESC);
CREATE INDEX idx_competitor_threat_level ON competitor_campaigns(threat_level);
CREATE INDEX idx_competitor_tenant_id ON competitor_campaigns(tenant_id);

COMMENT ON TABLE competitor_campaigns IS 'DMK/AIADMK/BJP campaign tracking';

-- =====================================================
-- 6. ANALYTICS_SNAPSHOTS TABLE - Daily metrics storage
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Snapshot Metadata
  snapshot_date DATE NOT NULL,
  snapshot_type VARCHAR(30) CHECK (snapshot_type IN ('Daily', 'Weekly', 'Monthly', 'Real-time')),

  -- Voter Metrics
  total_voters INTEGER DEFAULT 0,
  new_voters_today INTEGER DEFAULT 0,
  tvk_supporters INTEGER DEFAULT 0,
  swing_voters INTEGER DEFAULT 0,

  -- Geographic Breakdown
  district VARCHAR(50),
  constituency VARCHAR(100),
  voters_by_district JSONB DEFAULT '{}',
  voters_by_constituency JSONB DEFAULT '{}',

  -- Demographic Breakdown
  voters_by_age JSONB DEFAULT '{}',
  voters_by_gender JSONB DEFAULT '{}',
  voters_by_caste JSONB DEFAULT '{}',

  -- Party Preference
  party_preference_breakdown JSONB DEFAULT '{}', -- {DMK: 35%, AIADMK: 30%, TVK: 20%}

  -- Sentiment Analysis
  average_sentiment DECIMAL(3,2),
  sentiment_distribution JSONB DEFAULT '{}', -- {positive: 45%, neutral: 35%, negative: 20%}

  -- Social Media Metrics
  total_social_mentions INTEGER DEFAULT 0,
  twitter_mentions INTEGER DEFAULT 0,
  facebook_mentions INTEGER DEFAULT 0,
  instagram_mentions INTEGER DEFAULT 0,

  -- Field Operations
  active_field_workers INTEGER DEFAULT 0,
  contacts_made_today INTEGER DEFAULT 0,
  events_organized_today INTEGER DEFAULT 0,

  -- Competitor Activity
  competitor_events_today INTEGER DEFAULT 0,

  -- Multi-tenancy
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analytics_snapshot_date ON analytics_snapshots(snapshot_date DESC);
CREATE INDEX idx_analytics_district ON analytics_snapshots(district);
CREATE INDEX idx_analytics_tenant_id ON analytics_snapshots(tenant_id);
CREATE UNIQUE INDEX idx_analytics_unique_daily ON analytics_snapshots(tenant_id, snapshot_date, district, snapshot_type);

COMMENT ON TABLE analytics_snapshots IS 'Daily metrics snapshots for trend analysis';

-- =====================================================
-- 7. REPORTS TABLE - Generated reports storage
-- =====================================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Report Identity
  report_id VARCHAR(50) UNIQUE NOT NULL,
  report_name VARCHAR(255) NOT NULL,

  -- Report Configuration
  report_type VARCHAR(30) CHECK (report_type IN ('Daily', 'Weekly', 'Monthly', 'Custom', 'Constituency', 'District', 'Field Worker')),
  report_format VARCHAR(10) CHECK (report_format IN ('PDF', 'Excel', 'CSV', 'JSON')),

  -- Scope
  district VARCHAR(50),
  constituency VARCHAR(100),
  date_from DATE,
  date_to DATE,

  -- Content
  report_sections TEXT[], -- ['Demographics', 'Sentiment', 'Social Media', 'Field Operations']
  include_charts BOOLEAN DEFAULT true,
  include_tamil BOOLEAN DEFAULT false,

  -- File Storage (Supabase Storage)
  file_url TEXT NOT NULL, -- Public URL
  file_size_kb INTEGER,

  -- Status
  generation_status VARCHAR(20) CHECK (generation_status IN ('Pending', 'Processing', 'Completed', 'Failed')),
  generated_at TIMESTAMP,

  -- Distribution
  email_recipients TEXT[],
  whatsapp_recipients TEXT[],
  auto_send BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,

  -- Multi-tenancy
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_status ON reports(generation_status);
CREATE INDEX idx_reports_generated_at ON reports(generated_at DESC);
CREATE INDEX idx_reports_tenant_id ON reports(tenant_id);

COMMENT ON TABLE reports IS 'Generated PDF/Excel reports with Tamil support';

-- =====================================================
-- 8. ALERTS TABLE - Critical notifications
-- =====================================================

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Alert Identity
  alert_id VARCHAR(50) UNIQUE NOT NULL,
  alert_type VARCHAR(30) CHECK (alert_type IN ('Booth Issue', 'Competitor Activity', 'Social Media Crisis', 'Field Worker', 'Data Quality', 'Security')),

  -- Severity
  severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  priority INTEGER CHECK (priority BETWEEN 1 AND 5), -- 1 = highest

  -- Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  -- Location
  district VARCHAR(50),
  constituency VARCHAR(100),
  booth_code VARCHAR(20),

  -- Related Entities
  voter_id UUID REFERENCES voters(id),
  field_worker_id UUID REFERENCES field_workers(id),
  post_id UUID REFERENCES social_media_posts(id),

  -- Status
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,

  -- Notification Channels
  sent_via_email BOOLEAN DEFAULT false,
  sent_via_sms BOOLEAN DEFAULT false,
  sent_via_whatsapp BOOLEAN DEFAULT false,
  sent_via_push BOOLEAN DEFAULT false,

  -- Multi-tenancy
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_is_resolved ON alerts(is_resolved);
CREATE INDEX idx_alerts_district ON alerts(district);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_tenant_id ON alerts(tenant_id);

COMMENT ON TABLE alerts IS 'Multi-channel critical alerts system';

-- =====================================================
-- 9. AI_PREDICTIONS TABLE - Machine learning outputs
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Prediction Identity
  prediction_id VARCHAR(50) UNIQUE NOT NULL,
  model_name VARCHAR(100) NOT NULL, -- 'DMK_Swing_Predictor', 'Tamil_Sentiment_Analyzer'
  model_version VARCHAR(20),

  -- Prediction Type
  prediction_type VARCHAR(30) CHECK (prediction_type IN ('Voter Swing', 'Sentiment', 'Election Outcome', 'Rally Attendance', 'Issue Priority')),

  -- Scope
  district VARCHAR(50),
  constituency VARCHAR(100),
  booth_code VARCHAR(20),

  -- Input Data
  input_features JSONB NOT NULL, -- Model input features

  -- Prediction Results
  predicted_value VARCHAR(100), -- Party name, sentiment label, etc.
  predicted_value_numeric DECIMAL(10,4), -- Vote share, probability, etc.
  confidence_score DECIMAL(5,2) CHECK (confidence_score BETWEEN 0 AND 100),

  -- Classification (for multi-class predictions)
  prediction_classes JSONB, -- {DMK: 0.45, AIADMK: 0.30, TVK: 0.15, BJP: 0.10}

  -- Recommendation
  recommendation TEXT,
  action_items TEXT[],

  -- Validation
  actual_outcome VARCHAR(100), -- For model accuracy tracking
  prediction_accuracy DECIMAL(5,2),

  -- Model Performance
  mae DECIMAL(10,4), -- Mean Absolute Error
  rmse DECIMAL(10,4), -- Root Mean Square Error
  f1_score DECIMAL(4,3),

  -- Timestamps
  predicted_at TIMESTAMP DEFAULT NOW(),
  prediction_date DATE, -- Date being predicted for

  -- Multi-tenancy
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_model_name ON ai_predictions(model_name);
CREATE INDEX idx_ai_prediction_type ON ai_predictions(prediction_type);
CREATE INDEX idx_ai_district ON ai_predictions(district);
CREATE INDEX idx_ai_predicted_at ON ai_predictions(predicted_at DESC);
CREATE INDEX idx_ai_tenant_id ON ai_predictions(tenant_id);

COMMENT ON TABLE ai_predictions IS 'ML model predictions for voter behavior & election outcomes';

-- =====================================================
-- 10. AUDIT_LOGS TABLE - Complete activity tracking
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User & Action
  user_id UUID REFERENCES auth.users(id),
  user_email VARCHAR(255),
  user_role VARCHAR(50),

  -- Action Details
  action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, EXPORT, etc.
  resource_type VARCHAR(50), -- voters, field_workers, reports, etc.
  resource_id UUID,

  -- Changes (for UPDATE actions)
  old_values JSONB,
  new_values JSONB,

  -- Context
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(20), -- Web, Mobile, API

  -- Location
  geo_location GEOGRAPHY(POINT, 4326),
  district VARCHAR(50),

  -- Metadata
  description TEXT,
  status VARCHAR(20), -- Success, Failed, Unauthorized
  error_message TEXT,

  -- Multi-tenancy
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_tenant_id ON audit_logs(tenant_id);

COMMENT ON TABLE audit_logs IS 'Complete audit trail for compliance (DPDP Act)';

-- =====================================================
-- TRIGGER FUNCTIONS FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_voters_timestamp BEFORE UPDATE ON voters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_field_workers_timestamp BEFORE UPDATE ON field_workers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polling_data_timestamp BEFORE UPDATE ON polling_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_media_posts_timestamp BEFORE UPDATE ON social_media_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_campaigns_timestamp BEFORE UPDATE ON competitor_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_timestamp BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ VOTER PLATFORM TABLES CREATED SUCCESSFULLY!';
  RAISE NOTICE '📊 10 core tables: voters, field_workers, polling_data, social_media_posts, competitor_campaigns, analytics_snapshots, reports, alerts, ai_predictions, audit_logs';
  RAISE NOTICE '🔍 Indexes created for performance (50K+ voters, 100K+ social posts)';
  RAISE NOTICE '⏰ Auto-update triggers configured';
  RAISE NOTICE '🔒 Ready for RLS policies (next migration)';
END $$;
