import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { EnvBackdrop } from '../components/scifi/EnvBackdrop';

const DEMO_THREAT_SIGNALS = [
  {
    id: 'sig-01',
    severity: 'HIGH',
    meter: 78,
    color: 'var(--sci-warn)',
    event: 'Repeated 401 Lockout Burst (Demo Signal)',
    evidence: 'Source: 198.51.100.x • [TOKEN REDACTED] • 5 failures / 15m',
  },
  {
    id: 'sig-02',
    severity: 'LOW',
    meter: 26,
    color: 'var(--sci-neon)',
    event: 'Shared CGNAT Burst Observed (Demo Signal)',
    evidence: 'No permanent auto-ban triggered • Admin review advised',
  },
];

export default function XelvorConsolePage() {
  const [commandInput, setCommandInput] = useState('');
  const [consoleLog, setConsoleLog] = useState<string[]>([
    '[XELVOR-CORE] Sentinel UI initialized. Admin-only access.',
    '[ADAPTER] Google Gemini API credentials not configured (Milestone 2C pending).',
    '[POLICY] AI cannot execute irreversible actions without Admin confirmation.',
  ]);

  const handleCommand = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = commandInput.trim();
    if (!trimmed) return;

    setConsoleLog((prev) => [
      ...prev,
      `> admin@sentinel:~$ ${trimmed}`,
      '[STATUS] Provider not configured: live AI analysis and D1 security log queries activate in Milestone 2C.',
    ]);
    setCommandInput('');
  };

  return (
    <>
      <EnvBackdrop variant="xelvor" />
      <Navbar />
      <main className="env-shell">
        <div className="container xelvor-stage sci-reveal">
          <header className="sci-panel hud-brackets pub-flightbar">
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <span className="hud-chip hud-chip--cyan">XELVOR // ADMIN SENTINEL CORE</span>
                <span className="hud-chip hud-chip--warn">GEMINI PROVIDER: NOT CONFIGURED</span>
              </div>
              <h1 className="foundation-title">XELVOR Threat Intelligence Lab</h1>
            </div>
            <Link to="/admin" className="btn btn-secondary">
              Back to Admin Citadel
            </Link>
          </header>

          <div className="xelvor-grid">
            <section className="sci-panel hud-brackets xelvor-card" aria-label="Security Telemetry Feed">
              <div className="foundation-card__header">
                <h2 className="section-title">Real-Time Threat Signals (Demo Shell)</h2>
                <span className="hud-chip">SECRET REDACTION ON</span>
              </div>

              {DEMO_THREAT_SIGNALS.map((sig) => (
                <div key={sig.id} className="foundation-box">
                  <div className="foundation-card__header">
                    <strong>{sig.event}</strong>
                    <span className={`hud-chip ${sig.severity === 'HIGH' ? 'hud-chip--warn' : ''}`}>
                      {sig.severity}
                    </span>
                  </div>
                  <div className="risk-meter" aria-hidden="true">
                    <div
                      className="risk-meter__fill"
                      style={{ width: `${sig.meter}%`, background: sig.color }}
                    />
                  </div>
                  <span className="telemetry-note">{sig.evidence}</span>
                </div>
              ))}
            </section>

            <section className="sci-panel hud-brackets xelvor-card" aria-label="XELVOR Command Console">
              <div className="foundation-card__header">
                <h2 className="section-title">Natural-Language Security Console</h2>
                <span className="hud-chip hud-chip--danger">STEP-UP GUARDED</span>
              </div>

              <div className="terminal-console" role="log" aria-live="polite">
                {consoleLog.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>

              <form className="nexora-composer" onSubmit={handleCommand}>
                <label htmlFor="xelvor-cmd" className="sr-only">
                  Enter XELVOR security command
                </label>
                <input
                  id="xelvor-cmd"
                  className="sci-input"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="e.g., Inspect suspicious IP activity or review D1 alerts..."
                />
                <button type="submit" className="btn btn-primary">
                  Execute Query
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
