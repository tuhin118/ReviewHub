
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import '../styles/auth.css';

interface AuthFoundationPageProps {
  mode: 'login' | 'register' | 'forgot-password';
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

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6.01L12 16.77l-5.4 2.84 1.03-6.01-4.36-4.25 6.03-.88L12 3Z" />
    </svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3 21 21" />
      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
      <path d="M9.88 5.09A10.9 10.9 0 0 1 12 4.9c5.5 0 9 7.1 9 7.1a14.8 14.8 0 0 1-3.05 3.75" />
      <path d="M6.61 6.61C4.1 8.23 3 12 3 12s3.5 7.1 9 7.1a9.9 9.9 0 0 0 4.39-1.02" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function AuthFoundationPage({ mode }: AuthFoundationPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isForgot = mode === 'forgot-password';

  const title = isLogin
    ? 'Welcome back'
    : isRegister
      ? 'Join the community'
      : 'Reset your password';

  const description = isLogin
    ? 'Sign in to continue your journey with ReviewHub.'
    : isRegister
      ? 'Create your account and make every review count.'
      : 'Enter your email address and follow the next steps to recover access.';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <div className="auth-layout">
          <section className="auth-story">
            <div className="auth-eyebrow">
              <span className="auth-eyebrow__dot" />
              REVIEWHUB COMMUNITY NETWORK
            </div>

            <h1>
              Discover more.
              <br />
              Review with <span>confidence.</span>
            </h1>

            <p className="auth-story__copy">
              Explore apps and websites, share honest experiences,
              and help people make better digital decisions.
              Your next trusted discovery starts here.
            </p>

            <div className="auth-signal-list">
              <div className="auth-signal">
                <span className="auth-signal__icon"><ShieldIcon /></span>
                <span>Community-driven reviews and discovery</span>
              </div>
              <div className="auth-signal">
                <span className="auth-signal__icon"><StarIcon /></span>
                <span>Meaningful ratings from real experiences</span>
              </div>
            </div>

            <div className="auth-story__coordinates">
              <span>RH // COMMUNITY ACCESS</span>
              <span>NETWORK STATUS: <b>READY</b></span>
            </div>
          </section>

          <section className="auth-card" aria-labelledby="auth-title">
            <div className="auth-card__top">
              <div className="auth-card__mark">
                <ShieldIcon />
              </div>
              <span className="auth-preview">
                SECURE ACCESS GATE<br />
                REVIEWHUB / 01
              </span>
            </div>

            <h2 id="auth-title">{title}</h2>
            <p className="auth-card__intro">{description}</p>

            {!isForgot && (
              <>
                <button className="auth-google" type="button" disabled>
                  <GoogleIcon />
                  Continue with Google
                  <span className="auth-coming-soon">SOON</span>
                </button>

                <div className="auth-divider">
                  <span>OR CONTINUE WITH EMAIL</span>
                </div>
              </>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {isRegister && (
                <div className="auth-field">
                  <label htmlFor="auth-name">Full name</label>
                  <input
                    className="auth-input"
                    id="auth-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="auth-email">Email address</label>
                <input
                  className="auth-input"
                  id="auth-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              {!isForgot && (
                <div className="auth-field">
                  <label htmlFor="auth-password">Password</label>
                  <div className="auth-input-wrap">
                    <input
                      className="auth-input auth-input--password"
                      id="auth-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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
                  <label htmlFor="auth-confirm-password">Confirm password</label>
                  <div className="auth-input-wrap">
                    <input
                      className="auth-input auth-input--password"
                      id="auth-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Enter your password again"
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
                    <span>Remember me</span>
                  </label>
                  <Link className="auth-text-link" to="/forgot-password">
                    Forgot password?
                  </Link>
                </div>
              )}

              {isRegister && (
                <label className="auth-check auth-terms-check">
                  <input type="checkbox" name="terms" required />
                  <span>
                    I agree to the <Link className="auth-text-link" to="/terms">Terms</Link>
                    {' '}and <Link className="auth-text-link" to="/privacy">Privacy Policy</Link>.
                  </span>
                </label>
              )}

              <button className="auth-submit" type="submit">
                {isLogin
                  ? 'Sign in to ReviewHub'
                  : isRegister
                    ? 'Create my account'
                    : 'Continue'}
                <span aria-hidden="true">↗</span>
              </button>
            </form>

            <div className="auth-card__bottom">
              {isLogin ? (
                <>
                  New to ReviewHub?{' '}
                  <Link className="auth-text-link" to="/register">Create an account</Link>
                </>
              ) : isRegister ? (
                <>
                  Already have an account?{' '}
                  <Link className="auth-text-link" to="/login">Sign in</Link>
                </>
              ) : (
                <>
                  Remember your password?{' '}
                  <Link className="auth-text-link" to="/login">Back to login</Link>
                </>
              )}
            </div>

            <p className="auth-legal">
              By continuing, you acknowledge that this is the ReviewHub
              account interface. <Link to="/privacy">Privacy</Link> ·{' '}
              <Link to="/terms">Terms</Link>
            </p>

            <Link className="auth-back" to="/">
              <span aria-hidden="true">←</span> Back to homepage
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
