import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

interface NavbarProps {
  onFocusSearch?: () => void;
}

export function Navbar({ onFocusSearch }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const firstNavLinkRef = useRef<HTMLAnchorElement | null>(null);
  const wasDrawerOpenRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'nav-link--active' : ''}`;

  return (
    <>
      <header className="navbar-wrap">
        <div className="container navbar">
          <Link to="/" className="brand-link" aria-label="ReviewHub Home">
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
          </Link>

          <nav className="nav-links" aria-label="Primary Navigation">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/apps" className={navLinkClass}>
              Apps
            </NavLink>
            <NavLink to="/websites" className={navLinkClass}>
              Websites
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              Categories
            </NavLink>
            <NavLink to="/search" className={navLinkClass}>
              Search
            </NavLink>
            <NavLink to="/nexora" className={navLinkClass}>
              NEXORA
            </NavLink>
          </nav>

          <div className="nav-actions">
            <span className="nav-guest-pill" title="No login required to browse">
              <span className="live-dot" aria-hidden="true" />
              GUEST ACCESS
            </span>

            <div className="nav-auth-desktop">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
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
              <Link
                ref={firstNavLinkRef}
                to="/"
                className="mobile-drawer__link"
                onClick={closeAndNavigate}
              >
                Home &amp; Overview
              </Link>
              <Link to="/apps" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Android Apps
              </Link>
              <Link to="/websites" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Websites
              </Link>
              <Link to="/categories" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Categories
              </Link>
              <Link to="/search" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Search
              </Link>
              <Link to="/nexora" className="mobile-drawer__link" onClick={closeAndNavigate}>
                NEXORA Assistant
              </Link>
              <Link to="/publisher" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Publisher Deck (UI Preview)
              </Link>
              <Link to="/admin" className="mobile-drawer__link" onClick={closeAndNavigate}>
                Admin Citadel (UI Preview)
              </Link>
              <Link to="/admin/xelvor" className="mobile-drawer__link" onClick={closeAndNavigate}>
                XELVOR Sentinel (UI Preview)
              </Link>
            </div>

            <div className="mobile-drawer__footer">
              <Link to="/login" className="btn btn-secondary" onClick={closeAndNavigate}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeAndNavigate}>
                Register
              </Link>
            </div>
          </div>
        </div>
      )}

      <nav className="mobile-bottom-nav" aria-label="Mobile Quick Navigation">
        <Link to="/" className="mobile-bottom-nav__item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
          </svg>
          <span>Home</span>
        </Link>
        <Link to="/apps" className="mobile-bottom-nav__item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M17 7h4v4" />
          </svg>
          <span>Apps</span>
        </Link>
        <Link to="/nexora" className="mobile-bottom-nav__item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3z" />
          </svg>
          <span>NEXORA</span>
        </Link>
        {onFocusSearch && location.pathname === '/' ? (
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
        ) : (
          <Link to="/search" className="mobile-bottom-nav__item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span>Search</span>
          </Link>
        )}
      </nav>
    </>
  );
}
