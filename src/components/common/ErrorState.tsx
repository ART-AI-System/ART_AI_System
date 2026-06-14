import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';

const ErrorState = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorTitle = 'Unexpected Error';
  let errorMessage = 'An unexpected error occurred.';
  let errorStack: string | undefined;

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = typeof error.data === 'string' ? error.data : JSON.stringify(error.data);
  } else if (error instanceof Error) {
    errorTitle = error.name;
    errorMessage = error.message;
    errorStack = error.stack;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-start justify-center p-6 overflow-auto">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-3 mb-6 pt-6">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-red-400">Route Error</h1>
            <p className="text-sm text-slate-400">An error occurred while rendering this route</p>
          </div>
        </div>

        <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4 mb-4">
          <div className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-1">
            {errorTitle}
          </div>
          <p className="text-red-100 font-mono text-sm break-words whitespace-pre-wrap">{errorMessage}</p>
        </div>

        {errorStack && (
          <div className="mb-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Stack Trace</div>
            <pre className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-auto max-h-80 whitespace-pre break-words">
              {errorStack}
            </pre>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
