-- ReviewHub Phase 1 — Platform Core, Security & 22-Module Admin Foundation
-- Compatible with 0001_foundation.sql (non-destructive, additive only)

-- 1. User Profiles & Privacy Controls
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  public_bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  is_bio_public INTEGER NOT NULL DEFAULT 1 CHECK (is_bio_public IN (0, 1)),
  is_activity_public INTEGER NOT NULL DEFAULT 1 CHECK (is_activity_public IN (0, 1)),
  is_contributions_public INTEGER NOT NULL DEFAULT 1 CHECK (is_contributions_public IN (0, 1)),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- 2. Authentication Sessions (Hashed tokens only)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  device_label TEXT,
  ip_address TEXT,
  user_agent_summary TEXT,
  last_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  revoke_reason TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON sessions (user_id, revoked_at, expires_at);

-- 3. Email Verifications (Hashed tokens only)
CREATE TABLE IF NOT EXISTS email_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL DEFAULT 'register' CHECK (purpose IN ('register', 'change_email')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  expires_at TEXT NOT NULL,
  verified_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_user ON email_verifications (user_id, purpose, expires_at);

-- 4. Password Resets (Hashed tokens only)
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets (user_id, expires_at);

-- 5. Listing Revisions (Preserves existing listings.status Pending/Approved/Rejected)
CREATE TABLE IF NOT EXISTS listing_revisions (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  submitted_by_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  official_url TEXT NOT NULL,
  download_url TEXT,
  icon_url TEXT,
  revision_status TEXT NOT NULL DEFAULT 'Pending' CHECK (revision_status IN ('Pending', 'Approved', 'Rejected')),
  review_note TEXT,
  reviewed_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_listing_revisions_status ON listing_revisions (listing_id, revision_status, created_at);

-- 6. Listing Images & Metadata (10MB per image limit enforced; R2 key optional)
CREATE TABLE IF NOT EXISTS listing_images (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  revision_id TEXT REFERENCES listing_revisions(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  r2_object_key TEXT,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 10485760),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_listing_images_listing ON listing_images (listing_id, sort_order);

-- 7. Reviews (One review per user per listing)
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  helpful_count INTEGER NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
  reviewed_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (listing_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_listing_status ON reviews (listing_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_user_status ON reviews (user_id, status);

-- 8. Review Revisions (Keeps existing Approved review live while edit is Pending)
CREATE TABLE IF NOT EXISTS review_revisions (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  screenshot_url TEXT,
  revision_status TEXT NOT NULL DEFAULT 'Pending' CHECK (revision_status IN ('Pending', 'Approved', 'Rejected')),
  review_note TEXT,
  reviewed_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_review_revisions_status ON review_revisions (review_id, revision_status, created_at);

-- 9. Review Helpful Votes (One vote per user per review)
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (review_id, user_id)
);

-- 10. Listing & Review Reports
CREATE TABLE IF NOT EXISTS review_reports (
  id TEXT PRIMARY KEY,
  reporter_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'review')),
  listing_id TEXT REFERENCES listings(id) ON DELETE CASCADE,
  review_id TEXT REFERENCES reviews(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  screenshot_url TEXT,
  risk_level TEXT NOT NULL DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'UnderReview', 'Resolved', 'Dismissed')),
  resolved_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_reports_status_risk ON review_reports (status, risk_level, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON review_reports (reporter_user_id, target_type);

-- 11. Saved Listings (Private per user)
CREATE TABLE IF NOT EXISTS saved_listings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_listings_user ON saved_listings (user_id, created_at);

-- 12. Notifications & Preferences (Security alerts enforced enabled = 1)
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications (user_id, is_read, created_at);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  review_updates INTEGER NOT NULL DEFAULT 1 CHECK (review_updates IN (0, 1)),
  publisher_updates INTEGER NOT NULL DEFAULT 1 CHECK (publisher_updates IN (0, 1)),
  support_updates INTEGER NOT NULL DEFAULT 1 CHECK (support_updates IN (0, 1)),
  platform_updates INTEGER NOT NULL DEFAULT 1 CHECK (platform_updates IN (0, 1)),
  security_alerts INTEGER NOT NULL DEFAULT 1 CHECK (security_alerts IN (1)),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- 13. Support Tickets & Messages
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'InProgress', 'Resolved', 'Closed')),
  escalated_from_nexora INTEGER NOT NULL DEFAULT 0 CHECK (escalated_from_nexora IN (0, 1)),
  assigned_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_tickets_status_priority ON support_tickets (status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets (user_id, status);

CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_internal_note INTEGER NOT NULL DEFAULT 0 CHECK (is_internal_note IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON support_ticket_messages (ticket_id, created_at);

-- 14. User Bans & IP Restrictions
CREATE TABLE IF NOT EXISTS user_bans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ban_type TEXT NOT NULL CHECK (ban_type IN ('login', 'posting')),
  is_permanent INTEGER NOT NULL DEFAULT 0 CHECK (is_permanent IN (0, 1)),
  duration_value INTEGER,
  duration_unit TEXT CHECK (duration_unit IN ('minute', 'hour', 'day', 'month', 'year')),
  expires_at TEXT,
  reason TEXT NOT NULL,
  issued_by_admin_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  revoked_at TEXT,
  revoked_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_user_bans_active ON user_bans (user_id, ban_type, revoked_at, expires_at);

CREATE TABLE IF NOT EXISTS ip_bans (
  id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  ban_mode TEXT NOT NULL CHECK (ban_mode IN ('auto_temp', 'manual')),
  reason TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  expires_at TEXT,
  created_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  unblocked_at TEXT,
  unblocked_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_ip_bans_lookup ON ip_bans (ip_address, is_active, expires_at);

-- 15. Security Events (30-day planned retention; secrets redacted before write)
CREATE TABLE IF NOT EXISTS security_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  ip_address TEXT,
  endpoint TEXT,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_security_events_created ON security_events (created_at, severity, event_type);

-- 16. Admin RBAC: Roles, Permissions & Mappings
CREATE TABLE IF NOT EXISTS admin_roles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_system INTEGER NOT NULL DEFAULT 1 CHECK (is_system IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS admin_permissions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  module_key TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS admin_role_permissions (
  role_id TEXT NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES admin_permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_admin_roles (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  assigned_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (user_id, role_id)
);

-- 17. System Settings & Backup Tracking (Admin Modules 17 & 18)
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS backup_records (
  id TEXT PRIMARY KEY,
  backup_type TEXT NOT NULL CHECK (backup_type IN ('manual', 'scheduled')),
  status TEXT NOT NULL CHECK (status IN ('recorded', 'verified', 'failed')),
  checksum TEXT,
  notes TEXT,
  created_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Seed Default Admin Roles & 22 Module Permissions
INSERT OR IGNORE INTO admin_roles (id, slug, name, description, is_system) VALUES
  ('role_super_admin', 'super_admin', 'Super Admin', 'Full access across all 22 ReviewHub Admin modules.', 1),
  ('role_moderator', 'moderator', 'Content Moderator', 'Reviews, apps, websites, approvals, and category management.', 1),
  ('role_security', 'security_officer', 'Security Officer', 'Security center, bans, IP restrictions, and audit inspection.', 1),
  ('role_support', 'support_agent', 'Support Agent', 'Support center, tickets, and notifications.', 1);

INSERT OR IGNORE INTO admin_permissions (id, code, module_key, description) VALUES
  ('perm_01', 'module.dashboard', 'dashboard', 'Access Admin Overview Dashboard'),
  ('perm_02', 'module.users', 'user_management', 'Manage users and account status'),
  ('perm_03', 'module.publishers', 'publisher_management', 'Verify and revoke publisher permissions'),
  ('perm_04', 'module.apps', 'apps_management', 'Manage Android app listings'),
  ('perm_05', 'module.websites', 'website_management', 'Manage website listings'),
  ('perm_06', 'module.reviews', 'reviews_management', 'Moderate user reviews and revisions'),
  ('perm_07', 'module.ratings', 'ratings_management', 'Inspect rating distributions and anomalies'),
  ('perm_08', 'module.approvals', 'approval_center', 'Access unified pending approval queue'),
  ('perm_09', 'module.bans', 'ban_management', 'Manage login, posting, and IP bans'),
  ('perm_10', 'module.security', 'security_center', 'View security events and lockouts'),
  ('perm_11', 'module.analytics', 'reports_analytics', 'View platform reports and analytics'),
  ('perm_12', 'module.audit_logs', 'audit_logs', 'Read application-level append-only audit logs'),
  ('perm_13', 'module.settings', 'admin_settings', 'Manage platform settings and AI controls'),
  ('perm_14', 'module.support', 'support_center', 'Manage support tickets and escalations'),
  ('perm_15', 'module.content', 'content_categories', 'Manage categories and content structure'),
  ('perm_16', 'module.notifications', 'notification_center', 'Draft and manage user notifications'),
  ('perm_17', 'module.maintenance', 'system_maintenance', 'Manage maintenance mode and health checks'),
  ('perm_18', 'module.backups', 'backup_recovery', 'Track backup history and integrity checks'),
  ('perm_19', 'module.rbac', 'role_permission_management', 'Manage admin roles and module permissions'),
  ('perm_20', 'module.search', 'global_search', 'Global admin search and command lookup'),
  ('perm_21', 'module.admin_profile', 'admin_profile', 'Manage own admin profile and security settings'),
  ('perm_22', 'module.email_domains', 'email_domain_management', 'Manage allowed registration email domains');

INSERT OR IGNORE INTO admin_role_permissions (role_id, permission_id)
SELECT 'role_super_admin', id FROM admin_permissions;

INSERT OR IGNORE INTO system_settings (key, value_json) VALUES
  ('maintenance_mode', '{"enabled":false}');
