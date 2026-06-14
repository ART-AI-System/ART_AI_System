import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ShieldAlert, GraduationCap, User, BookOpen, ShieldAlert as HeadIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../app/App';
import {
  MOCK_ADMIN_USER,
  MOCK_LECTURER_USER,
  MOCK_SUBJECT_HEAD_USER,
  MOCK_STUDENT_USER,
} from '../../config/roles';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('khoanc@artai.edu.vn');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Simulate login verification against mock users
    setTimeout(() => {
      setIsLoading(false);
      if (email === MOCK_ADMIN_USER.email && password === 'password123') {
        login(MOCK_ADMIN_USER);
        navigate('/dashboard');
      } else if (email === MOCK_LECTURER_USER.email && password === 'password123') {
        login(MOCK_LECTURER_USER);
        navigate('/dashboard');
      } else if (email === MOCK_SUBJECT_HEAD_USER.email && password === 'password123') {
        login(MOCK_SUBJECT_HEAD_USER);
        navigate('/dashboard');
      } else if (email === MOCK_STUDENT_USER.email && password === 'password123') {
        login(MOCK_STUDENT_USER);
        navigate('/dashboard');
      } else {
        setErrorMsg('Invalid email or password. Hint: Use Dev Mode buttons below.');
      }
    }, 600);
  };

  const handleQuickLogin = (userType: 'ADMIN' | 'LECTURER' | 'SUBJECT_HEAD' | 'STUDENT') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      let targetUser = MOCK_ADMIN_USER;
      if (userType === 'LECTURER') targetUser = MOCK_LECTURER_USER;
      else if (userType === 'SUBJECT_HEAD') targetUser = MOCK_SUBJECT_HEAD_USER;
      else if (userType === 'STUDENT') targetUser = MOCK_STUDENT_USER;

      login(targetUser);
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Academic Portal Login</h2>
        <p className="text-slate-400 text-sm">Access academic audits and submission transparency metrics.</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-lg flex items-start gap-2 animate-pulse">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
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
          className="w-full justify-center mt-2 cursor-pointer"
          id="login-submit"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </form>

      {/* Dev Mode Quick Login Block */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase text-center">
          Đăng nhập nhanh (Dev Mode)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {/* Admin */}
          <button
            type="button"
            onClick={() => handleQuickLogin('ADMIN')}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white border border-indigo-500/30 hover:border-indigo-400/40 rounded-lg text-xs font-medium transition-all text-left cursor-pointer"
          >
            <User className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />
            <div className="min-w-0">
              <p className="font-semibold truncate">N.C. Khoa</p>
              <p className="opacity-60 text-[9px] truncate">Admin</p>
            </div>
          </button>

          {/* Lecturer */}
          <button
            type="button"
            onClick={() => handleQuickLogin('LECTURER')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 hover:text-white border border-blue-500/30 hover:border-blue-400/40 rounded-lg text-xs font-medium transition-all text-left cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />
            <div className="min-w-0">
              <p className="font-semibold truncate">P.M. Hoàng</p>
              <p className="opacity-60 text-[9px] truncate">Lecturer</p>
            </div>
          </button>

          {/* Subject Head */}
          <button
            type="button"
            onClick={() => handleQuickLogin('SUBJECT_HEAD')}
            className="flex items-center gap-2 px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 hover:text-white border border-amber-500/30 hover:border-amber-400/40 rounded-lg text-xs font-medium transition-all text-left cursor-pointer"
          >
            <HeadIcon className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
            <div className="min-w-0">
              <p className="font-semibold truncate">L.T.K. Vân</p>
              <p className="opacity-60 text-[9px] truncate">Head</p>
            </div>
          </button>

          {/* Student */}
          <button
            type="button"
            onClick={() => handleQuickLogin('STUDENT')}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 hover:text-white border border-emerald-500/30 hover:border-emerald-400/40 rounded-lg text-xs font-medium transition-all text-left cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
            <div className="min-w-0">
              <p className="font-semibold truncate">T.V. Tài</p>
              <p className="opacity-60 text-[9px] truncate">Student</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
