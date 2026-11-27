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
              <span>UI PREVIEW SHELL // SAMPLE DEMO DATA ONLY</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Link to="/admin/xelvor" className="btn btn-secondary">
                Launch XELVOR UI Preview
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
                  <span className="foundation-box__label">Pending Approvals (Sample)</span>
                  <span className="pub-metric-val">
                    <AnimatedCounter target={14} />
                  </span>
                  <span className="section-desc">Demo Listings, Revisions &amp; Reviews</span>
                </article>
                <article className="sci-panel sci-panel--interactive hud-brackets pub-metric-card">
                  <span className="foundation-box__label">Verified Publishers (Sample)</span>
                  <span className="pub-metric-val">
                    <AnimatedCounter target={28} />
                  </span>
                  <span className="section-desc">Demo Count (Guard Pending 2B)</span>
                </article>
                <article className="sci-panel sci-panel--interactive hud-brackets pub-metric-card">
                  <span className="foundation-box__label">Active Bans (Sample)</span>
                  <span className="pub-metric-val" style={{ color: 'var(--sci-cyan)' }}>
                    <AnimatedCounter target={3} />
                  </span>
                  <span className="section-desc">Demo Login / Posting / IP</span>
                </article>
                <article className="sci-panel sci-panel--interactive hud-brackets pub-metric-card">
                  <span className="foundation-box__label">Storage Gauge (Demo Sample)</span>
                  <span className="pub-metric-val">
                    <AnimatedCounter target={12} suffix="%" />
                  </span>
                  <span className="section-desc">UI Placeholder (500MB Monitor 2C)</span>
                </article>
              </div>

              <div className="sci-panel hud-brackets admin-table-card sci-reveal">
                <div className="foundation-card__header">
                  <div>
                    <span className="hud-chip hud-chip--cyan">
                      UI MODULE // {activeModule.toUpperCase()}
                    </span>
                    <h1 className="section-title" style={{ marginTop: '0.4rem' }}>
                      {ADMIN_MODULES.find((m) => m.id === activeModule)?.label}
                    </h1>
                  </div>
                  <span className="hud-chip hud-chip--warn">
                    STATIC DEMO // BACKEND PENDING 2B/2C
                  </span>
                </div>

                {activeModule === 'overview' && (
                  <div className="admin-row">
                    <div>
                      <strong>Admin Command UI Shell (Demo Preview)</strong>
                      <p className="section-desc">
                        Visual layout preview only. Live D1 queries, TOTP 2FA enforcement, and
                        append-only audit writes will be implemented in Milestones 2B–2C.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--warn">LOGS &amp; API PENDING 2B/2C</span>
                  </div>
                )}

                {activeModule === 'users' && (
                  <div className="admin-row">
                    <div>
                      <strong>Demo Record: nadia.r@example.invalid</strong>
                      <p className="section-desc">
                        Sample Role: User • Demo Status: Active (Static Placeholder)
                      </p>
                    </div>
                    <div className="admin-row__actions">
                      <span className="hud-chip hud-chip--warn">ROLE CONTROLS PENDING 2C</span>
                      <span className="hud-chip hud-chip--cyan">SESSION REVOKE PENDING 2B</span>
                    </div>
                  </div>
                )}

                {activeModule === 'publishers' && (
                  <div className="admin-row">
                    <div>
                      <strong>Demo Record: Kestrel Sec Labs (Sample Publisher)</strong>
                      <p className="section-desc">
                        Admin grant and instant backend permission revocation will be wired in
                        Milestones 2B–2C.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--warn">BACKEND GUARD PENDING 2B/2C</span>
                  </div>
                )}

                {activeModule === 'approvals' && (
                  <div className="admin-row">
                    <div>
                      <strong>Demo Queue Item: PacketGuard DNS (Sample App)</strong>
                      <p className="section-desc">
                        UI placeholder for New Listings, Post Revisions, New Reviews &amp; Review
                        Revisions.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--warn">DEMO PENDING QUEUE</span>
                  </div>
                )}

                {activeModule === 'bans' && (
                  <div className="admin-row">
                    <div>
                      <strong>Three-Level Ban Matrix (UI Placeholder)</strong>
                      <p className="section-desc">
                        Planned support for Login Ban (Temp/Perm), Posting Ban, and IP Security Ban
                        with fast Unban.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--warn">ENFORCEMENT PENDING 2B/2C</span>
                  </div>
                )}

                {activeModule === 'audit' && (
                  <div className="admin-row">
                    <div>
                      <strong>DEMO-AUDIT-001 • GRANT_PUBLISHER (Static Sample)</strong>
                      <p className="section-desc">
                        Planned application-level append-only audit log with secret redaction.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--warn">PERSISTENCE PENDING 2B/2C</span>
                  </div>
                )}

                {activeModule === 'analytics' && (
                  <div className="admin-row">
                    <div>
                      <strong>Platform Growth &amp; Rating Telemetry (Demo Preview)</strong>
                      <p className="section-desc">
                        UI placeholder. Real aggregated D1 analytics will be connected in Milestone
                        2C.
                      </p>
                    </div>
                    <span className="hud-chip hud-chip--warn">D1 INTEGRATION PENDING 2C</span>
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
