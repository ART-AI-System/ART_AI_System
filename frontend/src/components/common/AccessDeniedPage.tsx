import { ShieldX, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
        <ShieldX className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-slate-500 max-w-md mb-6">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Home className="w-4 h-4" />
        Back to Dashboard
      </button>
    </div>
  );
};

export default AccessDeniedPage;
