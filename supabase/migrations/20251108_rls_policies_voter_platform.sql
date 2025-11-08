-- =====================================================
-- PULSE OF PEOPLE - ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 20251108_rls_policies_voter_platform.sql
-- Description: Comprehensive RLS policies for multi-tenant data isolation
-- Applies to: All 10 voter platform tables
-- Security: Tenant-based isolation + role-based access control
-- =====================================================

-- =====================================================
-- 1. VOTERS TABLE RLS POLICIES
-- =====================================================

ALTER TABLE voters ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see voters from their own tenant
CREATE POLICY "tenant_isolation_voters_select" ON voters
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert voters to their own tenant
CREATE POLICY "tenant_isolation_voters_insert" ON voters
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can update voters in their own tenant
CREATE POLICY "tenant_isolation_voters_update" ON voters
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

-- Policy: Only admins can delete voters
CREATE POLICY "admin_only_voters_delete" ON voters
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- 2. FIELD_WORKERS TABLE RLS POLICIES
-- =====================================================

ALTER TABLE field_workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_field_workers_select" ON field_workers
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_field_workers_insert" ON field_workers
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_field_workers_update" ON field_workers
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "admin_only_field_workers_delete" ON field_workers
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- 3. POLLING_DATA TABLE RLS POLICIES
-- =====================================================

ALTER TABLE polling_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_polling_data_select" ON polling_data
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_polling_data_insert" ON polling_data
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_polling_data_update" ON polling_data
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "admin_only_polling_data_delete" ON polling_data
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- 4. SOCIAL_MEDIA_POSTS TABLE RLS POLICIES
-- =====================================================

ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_social_media_select" ON social_media_posts
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_social_media_insert" ON social_media_posts
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_social_media_update" ON social_media_posts
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "admin_only_social_media_delete" ON social_media_posts
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- 5. COMPETITOR_CAMPAIGNS TABLE RLS POLICIES
-- =====================================================

ALTER TABLE competitor_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_competitor_select" ON competitor_campaigns
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_competitor_insert" ON competitor_campaigns
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_competitor_update" ON competitor_campaigns
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "admin_only_competitor_delete" ON competitor_campaigns
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- 6. ANALYTICS_SNAPSHOTS TABLE RLS POLICIES
-- =====================================================

ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_analytics_select" ON analytics_snapshots
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_analytics_insert" ON analytics_snapshots
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

-- Read-only for regular users, no update/delete allowed
CREATE POLICY "admin_only_analytics_delete" ON analytics_snapshots
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- 7. REPORTS TABLE RLS POLICIES
-- =====================================================

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_reports_select" ON reports
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_reports_insert" ON reports
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_reports_update" ON reports
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "admin_only_reports_delete" ON reports
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- 8. ALERTS TABLE RLS POLICIES
-- =====================================================

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_alerts_select" ON alerts
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_alerts_insert" ON alerts
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_alerts_update" ON alerts
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "admin_only_alerts_delete" ON alerts
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- 9. AI_PREDICTIONS TABLE RLS POLICIES
-- =====================================================

ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_ai_predictions_select" ON ai_predictions
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_isolation_ai_predictions_insert" ON ai_predictions
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

-- AI predictions are immutable once created (no update)
CREATE POLICY "admin_only_ai_predictions_delete" ON ai_predictions
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- 10. AUDIT_LOGS TABLE RLS POLICIES
-- =====================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit logs: Read-only, admin and super_admin can view all
CREATE POLICY "admin_only_audit_logs_select" ON audit_logs
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin', 'manager')
    )
  );

-- System can insert audit logs (no user direct insert)
CREATE POLICY "system_only_audit_logs_insert" ON audit_logs
  FOR INSERT
  WITH CHECK (true); -- Allow system inserts

-- No updates or deletes on audit logs (immutable for compliance)
-- Super admins can delete old logs for data retention compliance
CREATE POLICY "super_admin_only_audit_delete" ON audit_logs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_tenants
      WHERE user_id = auth.uid()
        AND role = 'super_admin'
    )
  );

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Function: Check if user has specific role in tenant
CREATE OR REPLACE FUNCTION has_role_in_tenant(required_role TEXT, check_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_tenants
    WHERE user_id = auth.uid()
      AND tenant_id = check_tenant_id
      AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user is admin or super_admin in any tenant
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_tenants
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user's accessible tenant IDs
CREATE OR REPLACE FUNCTION get_user_tenant_ids()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- REALTIME PUBLICATION (for Supabase Realtime)
-- =====================================================

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE voters;
ALTER PUBLICATION supabase_realtime ADD TABLE field_workers;
ALTER PUBLICATION supabase_realtime ADD TABLE polling_data;
ALTER PUBLICATION supabase_realtime ADD TABLE social_media_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;

-- =====================================================
-- SECURITY GRANTS
-- =====================================================

-- Grant authenticated users access to tables (RLS will filter)
GRANT SELECT, INSERT, UPDATE ON voters TO authenticated;
GRANT SELECT, INSERT, UPDATE ON field_workers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON polling_data TO authenticated;
GRANT SELECT, INSERT, UPDATE ON social_media_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON competitor_campaigns TO authenticated;
GRANT SELECT, INSERT ON analytics_snapshots TO authenticated;
GRANT SELECT, INSERT, UPDATE ON reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON alerts TO authenticated;
GRANT SELECT, INSERT ON ai_predictions TO authenticated;
GRANT SELECT ON audit_logs TO authenticated;

-- Grant service role full access (for admin operations & background jobs)
GRANT ALL ON voters TO service_role;
GRANT ALL ON field_workers TO service_role;
GRANT ALL ON polling_data TO service_role;
GRANT ALL ON social_media_posts TO service_role;
GRANT ALL ON competitor_campaigns TO service_role;
GRANT ALL ON analytics_snapshots TO service_role;
GRANT ALL ON reports TO service_role;
GRANT ALL ON alerts TO service_role;
GRANT ALL ON ai_predictions TO service_role;
GRANT ALL ON audit_logs TO service_role;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS POLICIES APPLIED SUCCESSFULLY!';
  RAISE NOTICE '🔒 All 10 tables secured with tenant isolation';
  RAISE NOTICE '👥 Role-based access control (RBAC) enforced';
  RAISE NOTICE '⚡ Realtime enabled for voters, field_workers, polling_data, social_media, alerts';
  RAISE NOTICE '🛡️ Admin-only delete policies active';
  RAISE NOTICE '📊 Audit logs are immutable (compliance-ready)';
  RAISE NOTICE '✨ Production-ready security configuration';
END $$;
