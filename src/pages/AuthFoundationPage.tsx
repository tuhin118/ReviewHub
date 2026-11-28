import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CyberEarth } from '../components/auth/CyberEarth';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import '../styles/auth.css';

interface AuthFoundationPageProps {
  mode: 'login' | 'register' | 'forgot-password';
}

function BrandWingIcon() {
  return (
    <svg viewBox="0 0 64 48" fill="none" aria-hidden="true">
      <path
        d="M6 12L24 8L18 18L30 16L14 34L20 22L8 24Z"
        fill="#20ff9a"
      />
      <path
        d="M27 8H45C52 8 56 12 56 18C56 23 52 27 46 28L55 40H44L36 29H31L28 40H20L27 8ZM33 22H42C46 22 48 20 48 18C48 15.8 46 14.5 42 14.5H34.5L33 22Z"
        fill="#20ff9a"
      />
    </svg>
  );
}

function TabUserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2c-4.2 0-7.5 2.1-7.5 4.8V20h15v-1.2c0-2.7-3.3-4.8-7.5-4.8Z" />
    </svg>
  );
}

function TabEditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TabResetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <rect x="9.5" y="10.5" width="5" height="4.5" rx="1" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.2-.5 6.8 5 6.8-5H5.2Zm13.8 2.1-6.4 4.7a1 1 0 0 1-1.2 0L5 8.1v9.4c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V8.1Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 10V7.5a5 5 0 0 1 10 0V10h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7Zm2 0h6V7.5a3 3 0 0 0-6 0V10Zm3 3.5a1.5 1.5 0 0 0-.75 2.8V18h1.5v-1.7A1.5 1.5 0 0 0 12 13.5Z" />
    </svg>
  );
}

function LoginActionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.24 5.48-4.7 7.18l7.2 5.59c4.2-3.88 7.54-9.59 7.54-17.24Z" />
      <path fill="#FBBC05" d="M10.54 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.2-5.59c-2 1.35-4.56 2.15-8.71 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.69 14.62 48 24 48Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3 21 21" />
      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
      <path d="M9.88 5.09A10.9 10.9 0 0 1 12 4.9c5.5 0 9 7.1 9 7.1a14.8 14.8 0 0 1-3.05 3.75" />
      <path d="M6.61 6.61C4.1 8.23 3 12 3 12s3.5 7.1 9 7.1a9.9 9.9 0 0 0 4.39-1.02" />
    </svg>
  );
}

export default function AuthFoundationPage({ mode }: AuthFoundationPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isForgot = mode === 'forgot-password';

  const headingFirst = isLogin ? 'Welcome' : isRegister ? 'Create' : 'Reset';
  const headingAccent = isLogin ? 'Back!' : isRegister ? 'Account!' : 'Password!';
  const subtitle = isLogin
    ? 'Login to continue your journey'
    : isRegister
      ? 'Join ReviewHub to share trusted ratings & reviews'
      : 'Enter your email address to recover account access';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        {/* Spaceship Control Room Layered Architecture */}
        <div className="auth-room-bg" aria-hidden="true">
          <div className="auth-room-bg__ceiling" />
          <div className="auth-room-bg__walls" />
          <div className="auth-room-bg__floor" />
          <div className="auth-room-bg__streams" />
          <div className="auth-room-bg__particles" />
        </div>

        <div className="auth-layout">
          {/* Left (Desktop) / Top (Mobile): Command Room Hero + Rotating Earth */}
          <section className="auth-hero-stage" aria-label="ReviewHub Control Room Visual">
            <div className="auth-hero-brand">
              <span className="auth-hero-brand__mark">
                <BrandWingIcon />
              </span>
              <div>
                <div className="auth-hero-brand__title">
                  Review<span>Hub</span>
                </div>
                <div className="auth-hero-brand__sub">REVIEW • DISCOVER • SHARE</div>
              </div>
            </div>

            <div className="auth-command-bay">
              {/* Left Angled Hologram Display */}
              <div className="holo-screen holo-screen--left" aria-hidden="true">
                <span className="holo-screen__kicker">INTEL FEED</span>
                <p className="holo-screen__headline">
                  EXPLORE
                  <br />
                  THE BEST APPS
                  <br />
                  <span>&amp; REVIEWS</span>
                </p>
                <span className="holo-screen__chevrons">&gt;&gt;&gt;</span>
              </div>

              {/* Center Hero: 3D Rotating Holographic Earth */}
              <div className="auth-earth-center">
                <CyberEarth mode={mode} />
              </div>

              {/* Right Angled Hologram World Map & Chart Display */}
              <div className="holo-screen holo-screen--right" aria-hidden="true">
                <svg className="holo-world-svg" viewBox="0 0 180 90">
                  <path
                    d="M16 24 L42 18 L52 34 L34 46 L18 40 Z
                       M38 52 L54 56 L48 80 L34 74 Z
                       M76 20 L102 16 L108 32 L84 36 Z
                       M80 42 L106 42 L102 72 L84 68 Z
                       M112 18 L156 16 L164 40 L132 48 L112 38 Z
                       M138 56 L162 54 L164 72 L144 74 Z"
                    fill="rgba(32, 255, 154, 0.35)"
                    stroke="#20ff9a"
                    strokeWidth="0.9"
                  />
                </svg>
                <div className="holo-bars">
                  <span style={{ height: '38%' }} />
                  <span style={{ height: '65%' }} />
                  <span style={{ height: '52%' }} />
                  <span style={{ height: '84%' }} />
                  <span style={{ height: '94%' }} />
                  <span style={{ height: '72%' }} />
                  <span style={{ height: '88%' }} />
                </div>
              </div>
            </div>
          </section>

          {/* Right (Desktop) / Bottom (Mobile): Chamfered Sci-Fi Auth Console */}
          <div className="auth-console-wrap">
            <div className="auth-frame">
              <section className="auth-card" aria-labelledby="auth-title">
                {/* Integrated Top Mode Switcher Tabs */}
                <nav className="auth-tabs" aria-label="Authentication Mode">
                  <Link
                    to="/login"
                    className={`auth-tab ${isLogin ? 'auth-tab--active' : ''}`}
                    aria-current={isLogin ? 'page' : undefined}
                  >
                    <TabUserIcon />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className={`auth-tab ${isRegister ? 'auth-tab--active' : ''}`}
                    aria-current={isRegister ? 'page' : undefined}
                  >
                    <TabEditIcon />
                    <span>Register</span>
                  </Link>
                  <Link
                    to="/forgot-password"
                    className={`auth-tab ${isForgot ? 'auth-tab--active' : ''}`}
                    aria-current={isForgot ? 'page' : undefined}
                  >
                    <TabResetIcon />
                    <span>Forgot Password</span>
                  </Link>
                </nav>

                <div className="auth-card__body">
                  <header className="auth-card__header">
                    <h1 id="auth-title">
                      {headingFirst} <span>{headingAccent}</span>
                    </h1>
                    <p className="auth-card__intro">{subtitle}</p>
                  </header>

                  <form className="auth-form" onSubmit={handleSubmit}>
                    {isRegister && (
                      <div className="auth-field">
                        <label htmlFor="auth-name" className="sr-only">
                          Full Name
                        </label>
                        <div className="auth-input-shell">
                          <span className="auth-input-icon" aria-hidden="true">
                            <TabUserIcon />
                          </span>
                          <input
                            className="auth-input"
                            id="auth-name"
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            autoComplete="name"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="auth-field">
                      <label htmlFor="auth-email" className="sr-only">
                        Email Address
                      </label>
                      <div className="auth-input-shell">
                        <span className="auth-input-icon" aria-hidden="true">
                          <MailIcon />
                        </span>
                        <input
                          className="auth-input"
                          id="auth-email"
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    {!isForgot && (
                      <div className="auth-field">
                        <label htmlFor="auth-password" className="sr-only">
                          Password
                        </label>
                        <div className="auth-input-shell">
                          <span className="auth-input-icon" aria-hidden="true">
                            <LockIcon />
                          </span>
                          <input
                            className="auth-input auth-input--password"
                            id="auth-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                            minLength={8}
                            required
                          />
                          <button
                            className="auth-password-toggle"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            <EyeIcon visible={showPassword} />
                          </button>
                        </div>
                      </div>
                    )}

                    {isRegister && (
                      <div className="auth-field">
                        <label htmlFor="auth-confirm-password" className="sr-only">
                          Confirm Password
                        </label>
                        <div className="auth-input-shell">
                          <span className="auth-input-icon" aria-hidden="true">
                            <LockIcon />
                          </span>
                          <input
                            className="auth-input auth-input--password"
                            id="auth-confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            minLength={8}
                            required
                          />
                          <button
                            className="auth-password-toggle"
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            <EyeIcon visible={showConfirmPassword} />
                          </button>
                        </div>
                      </div>
                    )}

                    {isLogin && (
                      <div className="auth-form-row">
                        <label className="auth-check">
                          <input type="checkbox" name="remember" />
                          <span>Remember Me</span>
                        </label>
                        <Link className="auth-text-link" to="/forgot-password">
                          Forgot Password? <span aria-hidden="true">&gt;</span>
                        </Link>
                      </div>
                    )}

                    {isRegister && (
                      <label className="auth-check auth-terms-check">
                        <input type="checkbox" name="terms" required />
                        <span>
                          I agree to the <Link className="auth-text-link" to="/terms">Terms</Link>{' '}
                          and <Link className="auth-text-link" to="/privacy">Privacy Policy</Link>.
                        </span>
                      </label>
                    )}

                    <button className="auth-submit" type="submit">
                      <span className="auth-submit__content">
                        <LoginActionIcon />
                        <span>
                          {isLogin ? 'Login' : isRegister ? 'Register' : 'Continue'}
                        </span>
                      </span>
                      <span className="auth-submit__stripes" aria-hidden="true" />
                    </button>
                  </form>

                  {!isForgot && (
                    <>
                      <div className="auth-divider">
                        <span>OR</span>
                      </div>

                      <div className="auth-social-row">
                        <button
                          className="auth-social-btn"
                          type="button"
                          disabled
                          title="Google Login coming in Part 02"
                        >
                          <GoogleIcon />
                          <span>Continue with Google</span>
                        </button>
                        <button
                          className="auth-social-btn"
                          type="button"
                          disabled
                          title="GitHub Login coming soon"
                        >
                          <GitHubIcon />
                          <span>Continue with GitHub</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </section>
            </div>

            {/* Bottom Beveled Trust Pill */}
            <div className="auth-trust-pill">
              <span className="auth-trust-pill__item">
                <ShieldCheckIcon />
                <span>Secure &amp; Trusted</span>
              </span>
              <span className="auth-trust-pill__sep" aria-hidden="true">|</span>
              <span className="auth-trust-pill__item">
                Powered by <b>ReviewHub</b>
              </span>
            </div>

            <div className="auth-footer-links">
              <Link className="auth-back" to="/">
                <span aria-hidden="true">←</span> Back to homepage
              </Link>
              <span className="auth-legal">
                <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link>
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
