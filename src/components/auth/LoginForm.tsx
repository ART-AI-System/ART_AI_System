import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, ArrowRight, EyeOff } from 'lucide-react';

interface LoginFormProps {
  selectedRole: string;
  handleBackToRole: () => void;
  handleLogin: (e: React.FormEvent, credentials: { username: string; password: string }) => void;
  getRoleColor: () => string;
  error?: string;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ selectedRole, handleBackToRole, handleLogin, getRoleColor, error, loading }) => {
  const defaultUsername = selectedRole === 'student' ? 'DE181818' : selectedRole + '01';
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(e, { username, password });
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-fade-in">
      <button onClick={handleBackToRole} className="flex items-center text-sm font-bold text-gray-400 hover:text-[#1B2559] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roles
      </button>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-[#1B2559] mb-2 capitalize">{selectedRole} Sign In</h2>
        <p className="text-gray-500 text-sm font-medium">Enter your credentials to continue</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Username / ID</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF]" 
              placeholder="Username or ID" 
              required
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-gray-700">Password</label>
            <a href="#" className="text-xs font-bold text-[#4318FF] hover:underline">Forgot password?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-11 pr-10 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF]" 
              placeholder="••••••••" 
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${getRoleColor()}`}
        >
          {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
