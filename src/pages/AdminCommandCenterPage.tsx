import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { AnimatedCounter } from '../components/scifi/AnimatedCounter';
import { EnvBackdrop } from '../components/scifi/EnvBackdrop';

type AdminModule =
  | 'overview'
  | 'users'
  | 'publishers'
  | 'approvals'
  | 'bans'
  | 'audit'
  | 'analytics';

const ADMIN_MODULES: Array<{ id: AdminModule; code: string; label: string }> = [
  { id: 'overview', code: 'CMD-01', label: 'Command Overview' },
  { id: 'users', code: 'USR-02', label: 'User Management' },
  { id: 'publishers', code: 'PUB-03', label: 'Publisher Verify' },
  { id: 'approvals', code: 'MOD-04', label: 'Approval Center' },
  { id: 'bans', code: 'BAN-05', label: 'Ban Management' },
  { id: 'audit', code: 'AUD-06', label: 'Audit Logs' },
  { id: 'analytics', code: 'ANL-07', label: 'Platform Analytics' },
];

export default function AdminCommandCenterPage() {
  const [activeModule, setActiveModule] = useState<AdminModule>('overview');
  const [railCollapsed, setRailCollapsed] = useState(false);

  return (
    <>
      <EnvBackdrop variant="admin" />
      <Navbar />
      <main className="env-shell">
        <div className="container admin-citadel sci-reveal">
          <div className="sci-panel hud-brackets admin-ticker">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span className="hud-chip hud-chip--cyan">MILITARY INTELLIGENCE CITADEL</span>
              <span>CLEARANCE: ADMIN UI SHELL</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Link to="/admin/xelvor" className="btn btn-secondary" style={{ minHeight: '44px' }}>
                Launch XELVOR AI Console
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setRailCollapsed((prev) => !prev)}
              >
                {railCollapsed ? 'Expand Rail' : 'Compact Rail'}
              </button>
            </div>
          </div>

          <div className={`admin-layout ${railCollapsed ? 'admin-layout--collapsed' : ''}`}>
            <aside className="sci-panel hud-brackets admin-rail" aria-label="Admin Modules">
              {ADMIN_MODULES.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  className={`admin-rail__btn ${
                    activeModule === mod.id ? 'admin-rail__btn--active' : ''
                  }`}
                  aria-current={activeModule === mod.id ? 'page' : undefined}
                  onClick={() => setActiveModule(mod.id)}
                >
                  <span>{railCollapsed ? mod.code : mod.label}</span>
                  {!railCollapsed && <span>{mod.code}</span>}
                </button>
              ))}
            </aside>

            <section className="admin-workspace" aria-label="Admin Module Workspace">
              <div className="admin-kpi-grid sci-stagger">
                <article className="sci-panel sci-panel--interactive hud-brackets pub-metric-card">
                  <span className="foundation-box__label">Pending Approvals (Demo)</span>
                  <span className="pub-metric-val">
                    <AnimatedCounter target={14} />
                  </span>
                  <span className="section-desc">Listings, Revisions &amp; Reviews</span>
                </article>
                <article className="sci-panel sci-panel--interactive hud-brackets pub-metric-card">
                  <span className="foundation-box__label">Verified Publishers (Demo)</span>
                  <span className="pub-metric-val">
                    <AnimatedCounter target={28} />
                  </span>
                  <span className="section-desc">Backend Guard Enforced</span>
                </article>
                <article className="sci-panel sci-panel--interactive hud-brackets pub-metric-card">
                  <span className="foundation-box__label">Active Bans (Demo)</span>
                  <span className="pub-metric-val" style={{ color: 'var(--sci-cyan)' }}>
                    <AnimatedCounter target={3} />
                  </span>
                  <span className="section-desc">Login / Posting / IP</span>
                </article>
                <article className="sci-panel sci-panel--interactive hud-brackets pub-metric-card">
                  <span className="foundation-box__label">D1 Storage Health</span>
                  <span className="pub-metric-val">
                    <AnimatedCounter target={12} suffix="%" />
                  </span>
                  <span className="section-desc">500MB Shared Limit Monitor</span>
                </article>
              </div>

              <div className="sci-panel hud-brackets admin-table-card sci-reveal">
                <div className="foundation-card__header">
                  <div>
                    <span className="hud-chip hud-chip--cyan">
                      ACTIVE MODULE // {activeModule.toUpperCase()}
                    </span>
                    <h1 className="section-title" style={{ marginTop: '0.4rem' }}>
                      {ADMIN_MODULES.find((m) => m.id === activeModule)?.label}
                    </h1>
                  </div>
                  <span className="hud-chip hud-chip--warn">API &amp; TOTP AUTH PENDING 2B/2C</span>
                </div>

                {activeModule === 'overview' && (
                  <div className="admin-row">
                    <div>
                      <strong>System Command Readiness</strong>
                      <p className="section-desc">
                        Visual command deck ready. D1 live queues, step-up authentication, and
                        audit persistence connect in Milestones 2B–2C.
                      </p>
                    </div>
                    <span className="hud-chip">APPEND-ONLY LOGS READY</span>
                  </div>
                )}

                {activeModule === 'users' && (
                  <div className="admin-row">
                    <div>
                      <strong>Sample User: nadia.r@gmail.com</strong>
                      <p className="section-desc">Role: User • Email Verified • Status: Active</p>
                    </div>
                    <div className="admin-row__actions">
                      <span className="hud-chip">ROLE CONTROLS (2C)</span>
                      <span className="hud-chip hud-chip--cyan">SESSION REVOKE (2C)</span>
                    </div>
                  </div>
                )}

                {activeModule === 'publishers' && (
                  <div className="admin-row">
                    <div>
                      <strong>Kestrel Sec Labs (Publisher Application)</strong>
                      <p className="section-desc">
                        Admin grant &amp; instant backend revocation controls connect in Milestone 2C.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--cyan">BACKEND VERIFIED ROLE</span>
                  </div>
                )}

                {activeModule === 'approvals' && (
                  <div className="admin-row">
                    <div>
                      <strong>Pending Queue: PacketGuard DNS (Android App)</strong>
                      <p className="section-desc">
                        Supports New Listings, Post Revisions, New Reviews &amp; Review Revisions.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--warn">PENDING REVIEW</span>
                  </div>
                )}

                {activeModule === 'bans' && (
                  <div className="admin-row">
                    <div>
                      <strong>Three-Level Ban Matrix</strong>
                      <p className="section-desc">
                        Supports Login Ban (Temp/Perm), Posting Ban, and IP Security Ban with fast
                        Unban.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--danger">STEP-UP GUARD</span>
                  </div>
                )}

                {activeModule === 'audit' && (
                  <div className="admin-row">
                    <div>
                      <strong>AUDIT-2026-001 • GRANT_PUBLISHER (Demo Record)</strong>
                      <p className="section-desc">
                        Application-level append-only log • Secret redaction enabled.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--cyan">IMMUTABLE BY API</span>
                  </div>
                )}

                {activeModule === 'analytics' && (
                  <div className="admin-row">
                    <div>
                      <strong>Platform Growth &amp; Rating Telemetry</strong>
                      <p className="section-desc">
                        Aggregates approved listings, user retention, and moderation velocity from D1
                        in Milestone 2C.
                      </p>
                    </div>
                    <span className="hud-chip">ANALYTICS ENGINE</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
