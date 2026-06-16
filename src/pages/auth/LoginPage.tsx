import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../app/App';
// removed useNavigate
import { MOCK_STUDENT_USER, MOCK_LECTURER_USER, MOCK_SUBJECT_HEAD_USER, MOCK_ADMIN_USER } from '../../config/roles';

const LoginPage = () => {
  const { login } = useAuth();
  const [studentCode, setStudentCode] = useState('SE18D01');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Quick login helper for demo purposes
  const quickLogin = (roleUser: string, rolePass: string) => {
    setStudentCode(roleUser);
    setPassword(rolePass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let userSession = MOCK_STUDENT_USER;
      if (studentCode === 'lecturer') userSession = MOCK_LECTURER_USER;
      else if (studentCode === 'head') userSession = MOCK_SUBJECT_HEAD_USER;
      else if (studentCode === 'admin') userSession = MOCK_ADMIN_USER;

      login(userSession);
      // Let the DashboardRedirector handle the routing
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#1B2559] mb-2">Welcome Back</h2>
        <p className="text-gray-500 font-medium text-sm">Sign in with your ID</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* Student Code */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Student/Staff Code</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              required
              className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium"
              placeholder="e.g. SE12345"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700">Password</label>
            <a href="#" className="text-xs font-bold text-[#4318FF] hover:underline">Forgot password?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium"
              placeholder="••••••••"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </div>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 text-[#4318FF] focus:ring-[#4318FF] border-gray-300 rounded cursor-pointer"
          />
          <label className="ml-2 block text-sm font-medium text-gray-600 cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-500/30 text-sm font-bold text-white bg-gradient-to-br from-[#F26F21] to-[#F79C65] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all hover:-translate-y-0.5 disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Demo Quick Login */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wider text-center">
          Test Roles Quick Login
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => quickLogin('student', 'pass')}
            className="text-xs py-2 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors border border-slate-200"
          >
            🧑‍🎓 Student
          </button>
          <button
            type="button"
            onClick={() => quickLogin('lecturer', 'pass')}
            className="text-xs py-2 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors border border-slate-200"
          >
            👨‍🏫 Lecturer
          </button>
          <button
            type="button"
            onClick={() => quickLogin('head', 'pass')}
            className="text-xs py-2 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors border border-slate-200"
          >
            👨‍💼 Subject Head
          </button>
          <button
            type="button"
            onClick={() => quickLogin('admin', 'pass')}
            className="text-xs py-2 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors border border-slate-200"
          >
            🛡️ Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
