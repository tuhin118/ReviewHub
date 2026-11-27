import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { EnvBackdrop } from '../components/scifi/EnvBackdrop';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

interface ScreenshotPreview {
  name: string;
  sizeKb: number;
  objectUrl: string;
}

const QUICK_PROMPTS = [
  'How do I navigate ReviewHub?',
  'Why is my review still Pending?',
  'How do Verified Publishers submit apps?',
  'Escalate an issue to Support',
];

export default function NexoraAssistantPage() {
  const [promptInput, setPromptInput] = useState('');
  const [screenshot, setScreenshot] = useState<ScreenshotPreview | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'nx-init',
      sender: 'ai',
      text: 'NEXORA UI Shell online (Static Preview). Once Google Gemini API credentials are configured in Milestone 2C backend secrets, I will assist with ReviewHub navigation, review submission help, and screenshot troubleshooting.',
    },
  ]);

  useEffect(() => {
    return () => {
      if (screenshot?.objectUrl) {
        URL.revokeObjectURL(screenshot.objectUrl);
      }
    };
  }, [screenshot]);

  const handleScreenshotSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setScreenshot({
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      objectUrl,
    });
    event.target.value = '';
  };

  const handleSend = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed && !screenshot) return;

    const userText = screenshot
      ? `${trimmed || 'Screenshot troubleshooting query'} [Local Preview Attached: ${screenshot.name}]`
      : trimmed;

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: userText },
      {
        id: `a-${Date.now() + 1}`,
        sender: 'ai',
        text: 'AI Provider Status: Google Gemini API adapter is not configured yet (Milestone 2C pending). No file was uploaded and no simulated AI response is generated.',
      },
    ]);
    setPromptInput('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSend(promptInput);
  };

  return (
    <>
      <EnvBackdrop variant="nexora" />
      <Navbar />
      <main className="env-shell">
        <div className="container nexora-stage sci-reveal">
          <section className="sci-panel nexora-chamber" aria-label="NEXORA User Assistant">
            <div className="foundation-card__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="nexora-orb" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3z" />
                  </svg>
                </div>
                <div>
                  <span className="hud-chip">NEXORA // USER CYBER GUIDE</span>
                  <h1 className="section-title" style={{ marginTop: '0.25rem' }}>
                    NEXORA Intelligence Interface
                  </h1>
                </div>
              </div>
              <span className="hud-chip hud-chip--warn">GEMINI API: NOT CONFIGURED</span>
            </div>

            <div className="nexora-stream" role="log" aria-live="polite">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`nexora-msg ${msg.sender === 'ai' ? 'nexora-msg--ai' : 'nexora-msg--user'}`}
                >
                  <span className="foundation-box__label">
                    {msg.sender === 'ai' ? 'NEXORA UI SHELL' : 'YOU (LOCAL PREVIEW)'}
                  </span>
                  <p className="section-desc">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="foundation-box">
              <div className="foundation-card__header">
                <span className="foundation-box__label">
                  Screenshot Troubleshooting (Visual-Only Preview)
                </span>
                <span className="hud-chip hud-chip--warn">UPLOAD PENDING 2C</span>
              </div>

              <div className="foundation-actions" style={{ alignItems: 'center' }}>
                <label htmlFor="nexora-screenshot-input" className="btn btn-secondary">
                  Select Screenshot (Local Preview)
                </label>
                <input
                  id="nexora-screenshot-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handleScreenshotSelect}
                />
                {screenshot && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setScreenshot(null)}
                  >
                    Remove Preview
                  </button>
                )}
              </div>

              {screenshot ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <img
                    src={screenshot.objectUrl}
                    alt="Selected screenshot preview"
                    style={{
                      width: '64px',
                      height: '64px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid var(--sci-border)',
                    }}
                  />
                  <span className="telemetry-note">
                    {screenshot.name} ({screenshot.sizeKb} KB) — Client-side preview only; not
                    uploaded.
                  </span>
                </div>
              ) : (
                <p className="telemetry-note">
                  Visual placeholder for screenshot-based troubleshooting (max 10 MB validation and
                  backend processing activate in Milestone 2C).
                </p>
              )}
            </div>

            <div className="nexora-prompts" aria-label="Suggested ReviewHub Topics">
              {QUICK_PROMPTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="filter-pill"
                  onClick={() => handleSend(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <form className="nexora-composer" onSubmit={handleSubmit}>
              <label htmlFor="nexora-input" className="sr-only">
                Ask NEXORA about ReviewHub
              </label>
              <input
                id="nexora-input"
                className="sci-input"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask about ReviewHub navigation, reviews, or support..."
              />
              <button type="submit" className="btn btn-primary">
                Send Query
              </button>
            </form>

            <div className="foundation-card__header">
              <span className="telemetry-note">
                Scoped strictly to ReviewHub help. Unresolved issues escalate to Support Tickets in
                Milestone 2C.
              </span>
              <Link to="/support" className="btn btn-secondary">
                Support Center
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
