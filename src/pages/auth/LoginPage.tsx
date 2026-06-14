import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Button from '../../components/common/Button';
import { getMockRole } from '../../config/roles';

const ROLE_REDIRECT: Record<string, string> = {
  STUDENT: '/dashboard/student',
  LECTURER: '/dashboard/lecturer',
  SUBJECT_HEAD: '/dashboard/subject-head',
  ADMIN: '/dashboard/admin',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@artai.edu.vn');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  
  const currentRole = getMockRole();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Replace mock data with API integration
    setTimeout(() => {
      setIsLoading(false);
      navigate(ROLE_REDIRECT[currentRole] ?? '/dashboard');
    }, 800);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
      <p className="text-slate-400 text-sm mb-6">Sign in to your ART-AI account</p>

      {/* Mock role notice */}
      <div className="mb-5 p-3 bg-indigo-500/20 border border-indigo-400/30 rounded-lg">
        <p className="text-xs text-indigo-200">
          <span className="font-semibold">Mock mode:</span> Current role is{' '}
          <span className="font-bold">{currentRole}</span>. Change it in the Header dropdown after logging in.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1.5">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full justify-center mt-2"
          id="login-submit"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
