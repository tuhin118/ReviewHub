import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { RouteGuard } from '../components/foundation/RouteGuard';
import AdminCommandCenterPage from './AdminCommandCenterPage';
import PublisherDashboardPage from './PublisherDashboardPage';
import UserDashboardPage from './UserDashboardPage';
import XelvorConsolePage from './XelvorConsolePage';

interface ProtectedRouteShellProps {
  area: 'dashboard' | 'settings' | 'publisher' | 'admin' | 'xelvor';
}

export default function ProtectedRouteShell({ area }: ProtectedRouteShellProps) {
  const requiredRole =
    area === 'publisher' ? 'publisher' : area === 'admin' || area === 'xelvor' ? 'admin' : 'user';

  if (area === 'dashboard' || area === 'settings') {
    return (
      <RouteGuard requiredRole={requiredRole} allowUiPreview>
        <UserDashboardPage area={area} />
      </RouteGuard>
    );
  }

  if (area === 'publisher') {
    return (
      <RouteGuard requiredRole={requiredRole} allowUiPreview>
        <PublisherDashboardPage />
      </RouteGuard>
    );
  }

  if (area === 'admin') {
    return (
      <RouteGuard requiredRole={requiredRole} allowUiPreview>
        <AdminCommandCenterPage />
      </RouteGuard>
    );
  }

  if (area === 'xelvor') {
    return (
      <RouteGuard requiredRole={requiredRole} allowUiPreview>
        <XelvorConsolePage />
      </RouteGuard>
    );
  }

  return (
    <>
      <Navbar />
      <main className="main-content">
        <RouteGuard requiredRole={requiredRole}>
          <section className="container foundation-page">
            <div className="glass-panel foundation-card">
              <h1 className="foundation-title">Workspace</h1>
            </div>
          </section>
        </RouteGuard>
      </main>
      <Footer />
    </>
  );
}
