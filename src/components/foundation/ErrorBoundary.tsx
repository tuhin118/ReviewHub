import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Error captured by boundary; sensitive runtime details are withheld from UI
  }

  handleReload = (): void => {
    window.location.assign('/');
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="app-shell">
          <main className="main-content container foundation-page">
            <div className="glass-panel glass-panel--elevated foundation-card">
              <div>
                <span className="cyber-badge">RUNTIME RECOVERY</span>
              </div>
              <h1 className="foundation-title">Something went wrong</h1>
              <p className="foundation-subtitle">
                পৃষ্ঠাটি রেন্ডার করার সময় একটি অপ্রত্যাশিত ত্রুটি হয়েছে। অনুগ্রহ করে হোমপেজে ফিরে যান
                অথবা পৃষ্ঠাটি রিলোড করুন।
              </p>
              <div className="foundation-actions">
                <button type="button" className="btn btn-primary" onClick={this.handleReload}>
                  Return to Home
                </button>
              </div>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
