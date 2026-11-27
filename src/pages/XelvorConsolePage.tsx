import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { EnvBackdrop } from '../components/scifi/EnvBackdrop';

interface ImageAttachmentPreview {
  name: string;
  sizeKb: number;
  objectUrl: string;
}

const DEMO_THREAT_SIGNALS = [
  {
    id: 'sig-01',
    severity: 'HIGH (DEMO)',
    meter: 78,
    color: 'var(--sci-warn)',
    event: 'Sample 401 Lockout Burst (Static Demo)',
    evidence: 'Demo Example: 198.51.100.x • [DEMO PLACEHOLDER] • 5 failures / 15m',
  },
  {
    id: 'sig-02',
    severity: 'LOW (DEMO)',
    meter: 26,
    color: 'var(--sci-neon)',
    event: 'Sample Shared CGNAT Burst (Static Demo)',
    evidence: 'Illustrative demo only • No live IP telemetry connected',
  },
];

export default function XelvorConsolePage() {
  const [commandInput, setCommandInput] = useState('');
  const [imagePreview, setImagePreview] = useState<ImageAttachmentPreview | null>(null);
  const [consoleLog, setConsoleLog] = useState<string[]>([
    '[XELVOR-UI] Visual preview shell initialized (Backend Admin auth pending 2B).',
    '[ADAPTER] Google Gemini API credentials not configured (Milestone 2C pending).',
    '[POLICY] UI preview only — no real security logs, D1 queries, or irreversible actions are active.',
  ]);

  useEffect(() => {
    return () => {
      if (imagePreview?.objectUrl) {
        URL.revokeObjectURL(imagePreview.objectUrl);
      }
    };
  }, [imagePreview]);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImagePreview({
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      objectUrl,
    });
    event.target.value = '';
  };

  const handleCommand = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = commandInput.trim();
    if (!trimmed && !imagePreview) return;

    const promptLine = imagePreview
      ? `> admin@preview:~$ ${trimmed || 'inspect-attached-image'} [Image Preview: ${imagePreview.name}]`
      : `> admin@preview:~$ ${trimmed}`;

    setConsoleLog((prev) => [
      ...prev,
      promptLine,
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
                <span className="hud-chip hud-chip--cyan">XELVOR // ADMIN SENTINEL UI PREVIEW</span>
                <span className="hud-chip hud-chip--warn">GEMINI PROVIDER: NOT CONFIGURED</span>
              </div>
              <h1 className="foundation-title">XELVOR Threat Intelligence Lab</h1>
            </div>
            <Link to="/admin" className="btn btn-secondary">
              Back to Admin Citadel
            </Link>
          </header>

          <div className="xelvor-grid">
            <section className="sci-panel hud-brackets xelvor-card" aria-label="Demo Security Feed">
              <div className="foundation-card__header">
                <h2 className="section-title">Sample Threat Signals (Static Demo)</h2>
                <span className="hud-chip hud-chip--warn">REDACTION: PENDING 2B</span>
              </div>

              {DEMO_THREAT_SIGNALS.map((sig) => (
                <div key={sig.id} className="foundation-box">
                  <div className="foundation-card__header">
                    <strong>{sig.event}</strong>
                    <span
                      className={`hud-chip ${sig.severity.includes('HIGH') ? 'hud-chip--warn' : ''}`}
                    >
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
                <h2 className="section-title">Security Command Console (UI Preview)</h2>
                <span className="hud-chip hud-chip--warn">STEP-UP GUARD: PENDING 2B</span>
              </div>

              <div className="terminal-console" role="log" aria-live="polite">
                {consoleLog.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>

              <div className="foundation-box">
                <div className="foundation-card__header">
                  <span className="foundation-box__label">
                    Evidence Image Interface (Visual-Only Preview)
                  </span>
                  <span className="hud-chip hud-chip--warn">UPLOAD PENDING 2C</span>
                </div>

                <div className="foundation-actions" style={{ alignItems: 'center' }}>
                  <label htmlFor="xelvor-image-input" className="btn btn-secondary">
                    Attach Image (Local Preview)
                  </label>
                  <input
                    id="xelvor-image-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleImageSelect}
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setImagePreview(null)}
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                {imagePreview ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <img
                      src={imagePreview.objectUrl}
                      alt="Selected security evidence preview"
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid var(--sci-border-cyan)',
                      }}
                    />
                    <span className="telemetry-note">
                      {imagePreview.name} ({imagePreview.sizeKb} KB) — Client-side preview only; no
                      server upload or AI scan active.
                    </span>
                  </div>
                ) : (
                  <p className="telemetry-note">
                    Visual placeholder for XELVOR image inspection interface (no audio/voice
                    playback; backend validation pending Milestone 2C).
                  </p>
                )}
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
