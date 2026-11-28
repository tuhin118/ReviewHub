ReviewHub — Master Architecture

Project: ReviewHub
Architecture Version: 1.0
Status: Planned Architecture
Hosting Target: Cloudflare
Budget: Zero-Cost Only

---

1. Architecture Overview

ReviewHub will use a modular full-stack architecture.

Main layers:

1. Presentation Layer
2. Application Layer
3. API Layer
4. Authentication and Authorization Layer
5. Database Layer
6. File Storage Layer
7. AI Integration Layer
8. Deployment and Monitoring Layer

Architecture flow:

Browser / PWA
|
v
React + TypeScript Frontend
|
v
Cloudflare Pages
|
v
Pages Functions API
|
+---- Authentication
|
+---- Authorization
|
+---- Business Logic
|
+---- D1 Database
|
+---- R2 File Storage
|
+---- AI Provider Integration

The frontend must never directly access private database credentials or AI secrets.

2. Technology Stack

Frontend

- React 19
- TypeScript
- Vite
- CSS
- React Router
- Progressive Web App support

Backend

- Cloudflare Pages Functions
- TypeScript
- REST API
- Cloudflare D1
- Cloudflare R2

Security

- Cloudflare Turnstile
- Secure password hashing
- HttpOnly session cookies
- CSRF protection
- Rate limiting
- Server-side authorization

Development

- GitHub
- GitHub Actions
- Cloudflare deployment
- Gemini AI Studio free quota for optional AI development

No paid service is allowed without explicit user approval.

3. Frontend Architecture

The frontend must be divided into reusable modules.

Suggested structure:

src/
app/
components/
pages/
layouts/
routes/
hooks/
contexts/
services/
lib/
styles/
types/
assets/

Responsibilities:

- app: application initialization.
- components: reusable UI elements.
- pages: route-level pages.
- layouts: shared layouts.
- routes: route configuration.
- hooks: reusable React hooks.
- contexts: shared application state.
- services: API integration.
- lib: utilities and API clients.
- styles: global and module styling.
- types: shared TypeScript types.
- assets: static assets.

Existing folders and components must be audited before moving or renaming anything.

4. Backend Architecture

Suggested structure:

functions/
api/
v1/
auth/
users/
listings/
reviews/
publishers/
admin/
notifications/
support/
nexora/
xelvor/

backend/
db/
middleware/
services/
validators/
security/
storage/
types/
utils/

Backend responsibilities:

- Validate every request.
- Authenticate users.
- Authorize every protected operation.
- Validate incoming data.
- Apply business rules.
- Execute parameterized database queries.
- Store security events.
- Return consistent API responses.

The exact structure must be reconciled with the existing repository before implementation.

5. API Architecture

Base path:

/api/v1

Authentication

POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
GET  /auth/me
POST /auth/revoke-sessions

Users

GET    /users/me
PATCH  /users/me
GET    /users/:username
GET    /users/me/notifications
PATCH  /users/me/notifications

Listings

GET    /listings
GET    /listings/:slug
GET    /listings/:slug/reviews
GET    /categories
GET    /search

Reviews

POST   /listings/:id/reviews
PATCH  /reviews/:id
POST   /reviews/:id/vote
POST   /reviews/:id/report

Publishers

GET    /publisher/dashboard
POST   /publisher/listings
PATCH  /publisher/listings/:id
GET    /publisher/listings

Administration

GET    /admin/dashboard
GET    /admin/users
GET    /admin/listings
GET    /admin/reviews
GET    /admin/reports
GET    /admin/audit-logs
GET    /admin/security-events

Administrative write endpoints must be implemented only with explicit permissions and appropriate audit logging.

AI

POST /nexora/message
POST /nexora/screenshot

GET  /admin/xelvor/events
POST /admin/xelvor/analyze

These are planned API contracts, not claims that the endpoints already exist.

6. Database Architecture

Primary database: Cloudflare D1.

Required tables:

Identity

- users
- sessions
- email_verifications
- password_resets

Content

- categories
- listings
- listing_revisions
- listing_images

Reviews

- reviews
- review_revisions
- review_votes
- review_reports

User Features

- saved_listings
- notifications
- notification_preferences
- support_tickets

Administration

- admin_roles
- admin_permissions
- role_permissions
- user_bans
- audit_logs
- security_events
- allowed_email_domains

Database rules:

- Use foreign keys.
- Add appropriate indexes.
- Use unique constraints.
- Use parameterized SQL.
- Use migrations for schema changes.
- Avoid destructive migrations without a verified backup.
- Keep private information inaccessible to public endpoints.

7. Authentication Architecture

Registration:

1. Validate input.
2. Check email domain policy.
3. Detect disposable email where feasible.
4. Verify Turnstile token.
5. Hash password securely.
6. Create an unprivileged user.
7. Send verification email only if a free and reliable delivery method is available.
8. Activate the account after verification.

Login:

1. Validate input.
2. Check account status.
3. Check lockout status.
4. Verify password.
5. Create a secure session.
6. Set HttpOnly, Secure and appropriate SameSite cookie attributes.
7. Record security events.

Lockout policy:

- Five failed password attempts.
- Fifteen-minute lock.
- Correct password must not bypass an active lock.
- Generic login responses.
- Server-side enforcement.

No administrator or publisher role may be assigned through public registration.

8. Authorization Architecture

Four main roles:

- Guest
- User
- Verified Publisher
- Administrator

Authorization must be enforced on the backend.

Every protected endpoint must verify:

- Session validity.
- Account status.
- Required permission.
- Resource ownership.
- Role restrictions.

Sensitive administrative actions require step-up authentication.

Frontend route guards are only a user-interface feature, never the primary security boundary.

9. Review System

Review requirements:

- Rating from 1 to 5.
- Review title.
- Review body.
- Optional screenshots.
- One review per user per listing.
- Helpful vote once per user.
- No self-voting.
- Reporting mechanism.

Review lifecycle:

Pending → Approved / Rejected

Editing an approved review must create a pending revision.

The previously approved review remains public until the new revision is approved.

Only approved reviews contribute to public rating aggregates.

10. Publisher System

Verified publishers can:

- Create application listings.
- Create website listings.
- Edit their own listings.
- Upload images.
- View listing status.
- View permitted analytics.

New listings require moderation.

Editing an approved listing must create a pending revision.

Publishers cannot edit another publisher's content.

11. Administration Architecture

The Admin Command Center will contain 22 planned modules:

1. Dashboard
2. User Management
3. Publisher Management
4. Apps Management
5. Website Management
6. Reviews Management
7. Ratings Management
8. Approval Center
9. Ban Management
10. Security Center
11. Reports and Analytics
12. Audit Logs
13. Admin Settings and Permissions
14. Support Center
15. Content and Category Management
16. Notification Center
17. System Maintenance Center
18. Database Backup and Recovery
19. Advanced Role and Permission Management
20. Global Search and Command Center
21. Admin Profile and Personalization
22. Email Domain Management

All administrative actions must be authorized and audited.

Ordinary administrators cannot modify or delete audit history.

AI cannot independently execute unrestricted production changes.

12. NEXORA Architecture

NEXORA is a user-facing ReviewHub assistant.

Responsibilities:

- Explain platform features.
- Help users navigate the website.
- Explain review submission.
- Troubleshoot screenshot-related interface problems.
- Guide users to support.
- Answer questions about ReviewHub.

Restrictions:

- Not a general unrestricted AI.
- Must not expose private account information.
- Must not reveal secrets.
- Must not perform unauthorized account actions.
- Must respect AI provider quota limits.
- Must fail gracefully when AI is unavailable.

Conversation can be multilingual while the application interface remains English.

13. XELVOR Architecture

XELVOR is an administrator-only security analysis assistant.

Responsibilities:

- Analyze real security events.
- Summarize audit records.
- Identify suspicious patterns.
- Explain evidence.
- Recommend defensive actions.
- Assist with authorized IP management.

Restrictions:

- No unrestricted database access.
- No autonomous permanent bans.
- No autonomous deletion.
- No unrestricted production writes.
- Sensitive actions require administrator authorization and step-up authentication.
- Every administrative action must be audited.

XELVOR must distinguish observed evidence from predictions.

14. File Storage Architecture

Preferred storage: Cloudflare R2.

Upload requirements:

- Maximum 10 MB per image.
- Maximum 5 images per listing.
- Maximum 50 MB per listing.
- Server-side content validation.
- Safe file naming.
- Authorization checks.
- Upload size enforcement.
- Controlled public/private access.

Do not trust file extensions alone.

15. PWA Architecture

ReviewHub should support installation as a Progressive Web App.

Features:

- Installable application.
- Offline application shell.
- Offline fallback page.
- Static asset caching.
- Update notifications.
- Responsive mobile interface.

Never cache private authenticated API responses in a public service-worker cache.

16. Design Architecture

Design direction:

Premium Hybrid Sci-Fi Cinematic Interface.

Visual system:

- Black and dark emerald foundation.
- Neon green primary highlights.
- Restrained cyan secondary highlights.
- Glass panels.
- Angular frames.
- 3D holographic layers.
- Cinematic background effects.
- Smooth transitions.
- Subtle parallax.
- Data streams.
- Carefully controlled lighting.

Design requirements:

- Mobile-first.
- Accessible contrast.
- Reduced-motion support.
- Low-power fallback.
- Avoid excessive animation.
- Preserve existing visual components until audited.

17. Deployment Architecture

Primary deployment:

GitHub → Cloudflare Pages → Production

Build output:

dist

Backend:

Cloudflare Pages Functions

Database:

Cloudflare D1

Storage:

Cloudflare R2

GitHub Actions:

- Build verification.
- Type checking.
- Automated checks.
- Optional fallback workflow.

Avoid duplicate production deployments from both GitHub Actions and Cloudflare Pages.

Production secrets must remain in server-side environment configuration.

18. Backup and Recovery

Backup architecture must be designed around available free-tier capabilities.

Requirements:

- Document backup procedures.
- Verify backup integrity.
- Test restoration in a safe environment.
- Record backup timestamps.
- Restrict restore permissions.
- Audit restore operations.

Never claim that recovery is guaranteed until restoration has been tested successfully.

19. Privacy Architecture

- Public profiles expose only intended public information.
- Email addresses remain private.
- Passwords are never returned by APIs.
- Session tokens are never exposed.
- AI providers must not receive passwords, OTPs or session secrets.
- Sensitive logs must be redacted.
- Data collection must be limited to platform needs.

20. Performance Architecture

- Lazy-load large pages and components.
- Optimize images.
- Minimize unnecessary API requests.
- Use pagination.
- Avoid expensive animation on low-power devices.
- Use efficient database indexes.
- Respect reduced-motion settings.
- Keep mobile loading performance a priority.

21. Zero-Cost Policy

All infrastructure must remain within available free tiers.

Before adopting a service:

1. Check current pricing.
2. Check usage limits.
3. Check commercial-use restrictions if applicable.
4. Check storage and bandwidth limits.
5. Document quota exhaustion behavior.

No paid fallback or automatic billing.

22. Architecture Change Policy

This document describes the target architecture.

It does not authorize automatic changes to the repository.

Before implementation:

- Inspect existing files.
- Reuse working components.
- Avoid unnecessary rewrites.
- Preserve existing design foundations.
- Use complete and documented migrations.
- Require explicit user approval for repository changes.

---

Document: MASTER_ARCHITECTURE.md
Status: Planned Architecture
Next: DEVELOPMENT_ROADMAP.md
