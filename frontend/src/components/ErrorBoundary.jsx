import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '../services/logger';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Real-time production telemetry logging
    logger.critical(`UI Exception caught by ErrorBoundary: ${error?.message || 'Unknown render error'}`, {
      source: 'react_error_boundary',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          role="alert"
          style={{
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            background: '#F8FAFC'
          }}
        >
          <div 
            style={{
              maxWidth: '560px',
              width: '100%',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderTop: '4px solid #DC2626',
              borderRadius: '4px',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ background: '#FEE2E2', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                <AlertTriangle size={24} color="#DC2626" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0A3161', fontWeight: 800 }}>
                  सिस्टम त्रुटि / Portal Notice
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  An unexpected UI exception occurred. It has been logged to monitoring.
                </span>
              </div>
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '4px', padding: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#991B1B' }}>
              <strong>Error:</strong> {this.state.error?.message || 'Component failed to render'}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReset}
                className="gov-btn gov-btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
              >
                <RefreshCw size={14} />
                <span>पुनः प्रयास करें / Reload Component</span>
              </button>

              <button
                type="button"
                onClick={() => { window.location.href = '/dashboard'; }}
                className="gov-btn gov-btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
              >
                <Home size={14} />
                <span>डैशबोर्ड / Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
