import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CyberBackground } from './components/CyberBackground';
import { ErrorBoundary } from './components/foundation/ErrorBoundary';
import { RouteFallback } from './components/foundation/RouteFallback';
import HomePage from './pages/HomePage';

const FoundationRoutePage = lazy(() => import('./pages/FoundationRoutePage'));
const AuthFoundationPage = lazy(() => import('./pages/AuthFoundationPage'));
const ProtectedRouteShell = lazy(() => import('./pages/ProtectedRouteShell'));
const NexoraAssistantPage = lazy(() => import('./pages/NexoraAssistantPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="app-shell">
        <CyberBackground />
        <ScrollManager />

        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/apps" element={<FoundationRoutePage mode="apps" />} />
            <Route path="/websites" element={<FoundationRoutePage mode="websites" />} />
            <Route path="/categories" element={<FoundationRoutePage mode="categories" />} />
            <Route path="/search" element={<FoundationRoutePage mode="search" />} />
            <Route path="/listings/:slug" element={<FoundationRoutePage mode="listing-detail" />} />
            <Route path="/profiles/:username" element={<FoundationRoutePage mode="public-profile" />} />
            <Route path="/nexora" element={<NexoraAssistantPage />} />
            <Route path="/about" element={<FoundationRoutePage mode="about" />} />
            <Route path="/support" element={<FoundationRoutePage mode="support" />} />
            <Route path="/privacy" element={<FoundationRoutePage mode="privacy" />} />
            <Route path="/terms" element={<FoundationRoutePage mode="terms" />} />

            {/* Auth Route Foundations (UI & Backend Auth Reserved) */}
            <Route path="/login" element={<AuthFoundationPage mode="login" />} />
            <Route path="/register" element={<AuthFoundationPage mode="register" />} />
            <Route path="/forgot-password" element={<AuthFoundationPage mode="forgot-password" />} />

            {/* Protected & Admin/AI Route Structures */}
            <Route path="/dashboard" element={<ProtectedRouteShell area="dashboard" />} />
            <Route path="/settings" element={<ProtectedRouteShell area="settings" />} />
            <Route path="/publisher" element={<ProtectedRouteShell area="publisher" />} />
            <Route path="/admin" element={<ProtectedRouteShell area="admin" />} />
            <Route path="/admin/xelvor" element={<ProtectedRouteShell area="xelvor" />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
