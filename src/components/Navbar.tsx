import { useEffect, useRef, useState } from 'react';

interface NavbarProps {
  onGuestAuthNotice: (actionLabel: string) => void;
  onFocusSearch: () => void;
}

export function Navbar({ onGuestAuthNotice, onFocusSearch }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const firstNavLinkRef = useRef<HTMLAnchorElement | null>(null);
  const wasDrawerOpenRef = useRef(false);

  useEffect(() => {
    if (!drawerOpen) {
      if (wasDrawerOpenRef.current) {
        wasDrawerOpenRef.current = false;
        menuButtonRef.current?.focus();
      }
      return;
    }

    wasDrawerOpenRef.current = true;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.requestAnimationFrame(() => {
      firstNavLinkRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setDrawerOpen(false);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const drawerElement = drawerRef.current;
      if (!drawerElement) {
        return;
      }

      const focusableElements = Array.from(
        drawerElement.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (!activeElement || !drawerElement.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
        return;
      }

      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  const closeAndNavigate = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <header className="navbar-wrap">
        <div className="container navbar">
          <a href="#top" className="brand-link" aria-label="ReviewHub Home">
            <span className="brand-mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L4 5.5v6.2c0 5 3.4 9.5 8 10.8 4.6-1.3 8-5.8 8-10.8V5.5L12 2z" />
                <path d="M9 12.2l2.1 2.1 4.2-4.3" />
              </svg>
            </span>
            <span className="brand-text">
              <span className="brand-name">
                Review<span>Hub</span>
              </span>
              <span className="brand-sub">STATIC DEMO INDEX</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary Navigation">
            <a href="#trending" className="nav-link">
              Trending
            </a>
            <a href="#categories" className="nav-link">
              Categories
            </a>
            <a href="#featured" className="nav-link">
              Featured
            </a>
            <a href="#top-rated" className="nav-link">
              Top Rated
            </a>
          </nav>

          <div className="nav-actions">
            <span className="nav-guest-pill" title="No login required to browse">
              <span className="live-dot" aria-hidden="true" />
              GUEST ACCESS
            </span>

            <div className="nav-auth-desktop">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onGuestAuthNotice('Login')}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onGuestAuthNotice('Register')}
              >
                Register
              </button>
            </div>

            <button
              ref={menuButtonRef}
              type="button"
              className="menu-toggle"
              aria-label={drawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={drawerOpen}
              aria-controls={drawerOpen ? 'mobile-navigation-drawer' : undefined}
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            id="mobile-navigation-drawer"
            ref={drawerRef}
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer__head">
              <span className="brand-name">
                Review<span>Hub</span>
              </span>
              <button
                type="button"
                className="icon-btn-sm"
                aria-label="Close Menu"
                onClick={() => setDrawerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mobile-drawer__nav">
              <a
                ref={firstNavLinkRef}
                href="#top"
                className="mobile-drawer__link"
                onClick={closeAndNavigate}
              >
                Home &amp; Search
              </a>
              <a href="#trending" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Trending Apps &amp; Websites
              </a>
              <a href="#categories" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Categories
              </a>
              <a href="#featured" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Featured Discovery
              </a>
              <a href="#top-rated" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Top Rated List
              </a>
            </div>

            <div className="mobile-drawer__footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDrawerOpen(false);
                  onGuestAuthNotice('Login');
                }}
              >
                Login (Upcoming)
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setDrawerOpen(false);
                  onGuestAuthNotice('Register');
                }}
              >
                Create Account (Upcoming)
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="mobile-bottom-nav" aria-label="Mobile Quick Navigation">
        <a href="#top" className="mobile-bottom-nav__item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
          </svg>
          <span>Home</span>
        </a>
        <a href="#trending" className="mobile-bottom-nav__item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M17 7h4v4" />
          </svg>
          <span>Trending</span>
        </a>
        <a href="#categories" className="mobile-bottom-nav__item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="8" height="8" rx="1.5" />
            <rect x="13" y="3" width="8" height="8" rx="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" />
            <rect x="13" y="13" width="8" height="8" rx="1.5" />
          </svg>
          <span>Categories</span>
        </a>
        <button
          type="button"
          className="mobile-bottom-nav__item"
          onClick={onFocusSearch}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span>Search</span>
        </button>
      </nav>
    </>
  );
}
