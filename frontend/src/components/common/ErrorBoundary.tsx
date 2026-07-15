import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleDashboard = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-start justify-center p-6 overflow-auto">
          <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pt-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-red-400">Runtime Error</h1>
                <p className="text-sm text-slate-400">An unhandled exception was caught by the Error Boundary</p>
              </div>
            </div>

            {/* Error Message */}
            <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4 mb-4">
              <div className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-1">
                {error?.name ?? 'Error'}
              </div>
              <p className="text-red-100 font-mono text-sm break-words whitespace-pre-wrap">
                {error?.message ?? 'Unknown error occurred'}
              </p>
            </div>

            {/* Stack Trace */}
            {error?.stack && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Stack Trace
                </div>
                <pre className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-auto max-h-64 whitespace-pre break-words">
                  {error.stack}
                </pre>
              </div>
            )}

            {/* Component Stack */}
            {errorInfo?.componentStack && (
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Component Stack
                </div>
                <pre className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-auto max-h-48 whitespace-pre break-words">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
