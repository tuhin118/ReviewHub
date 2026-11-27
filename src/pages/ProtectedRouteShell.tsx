import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { RouteGuard } from '../components/foundation/RouteGuard';

interface ProtectedRouteShellProps {
  area: 'dashboard' | 'settings' | 'publisher' | 'admin';
}

export default function ProtectedRouteShell({ area }: ProtectedRouteShellProps) {
  const requiredRole =
    area === 'publisher' ? 'publisher' : area === 'admin' ? 'admin' : 'user';

  return (
    <>
      <Navbar />
      <main className="main-content">
        <RouteGuard requiredRole={requiredRole}>
          <section className="container foundation-page">
            <div className="glass-panel foundation-card">
              <h1 className="foundation-title">{area.toUpperCase()} Workspace</h1>
            </div>
          </section>
        </RouteGuard>
      </main>
      <Footer />
    </>
  );
}
