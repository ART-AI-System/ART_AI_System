/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, GraduationCap, Users, BookOpenCheck, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import type { UserRole, UserSession } from '../../config/roles';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { setCampusBg } = useOutletContext<{ setCampusBg: (bg: string | null) => void }>();
  const [step, setStep] = useState<'campus' | 'role' | 'form'>('campus');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const [studentCode, setStudentCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCampusSelect = (campus: string) => {
    setSelectedCampus(campus);
    
    let bgName = campus;
    if (campus === 'hochiminh') bgName = 'hcm';
    
    setCampusBg(`bg_${bgName}`);
    setStep('role');
  };

  const handleBackToCampus = () => {
    setSelectedCampus('');
    setCampusBg(null);
    setStep('campus');
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep('form');
    // Pre-fill email based on role for demo purposes as in mockup
    if (role === 'lecturer') setStudentCode('lecturer@fpt.edu.vn');
    else if (role === 'headsubject') setStudentCode('headsubject@fpt.edu.vn');
    else if (role === 'admin') setStudentCode('admin@fpt.edu.vn');
    else setStudentCode('student@fpt.edu.vn');
    
    setPassword('password'); // Quick demo setup
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login(studentCode, password);
      const payload = (response as Record<string, any>).data || (response as Record<string, any>).result || response;
      const userObj = payload.user || payload;
      
      const token = payload.accessToken || payload.access_token;
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      
      const userSession: UserSession = {
        id: userObj.id || userObj._id || 'unknown-id',
        name: userObj.fullName || userObj.username || 'User',
        email: userObj.email || `${userObj.studentCode || userObj.username || 'user'}@artai.edu.vn`,
        role: ((userObj.role || selectedRole.toUpperCase() || 'STUDENT') as string).toUpperCase() as UserRole,
        code: userObj.studentCode || userObj.username || userObj._id || 'UNKNOWN'
      };

      login(userSession);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'campus') {
    return (
      <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-[#1B2559] mb-2">Select Campus</h2>
          <p className="text-gray-500 text-sm font-medium">Choose your campus to continue</p>
        </div>
        
        <div className="space-y-3">
          {['Ha Noi', 'Ho Chi Minh', 'Da Nang', 'Quy Nhon', 'Can Tho'].map((campus) => (
            <button 
              key={campus}
              onClick={() => handleCampusSelect(campus.toLowerCase().replace(/ /g, ''))} 
              className="w-full text-left bg-white/50 backdrop-blur-sm border-2 border-gray-100 p-4 rounded-xl hover:border-[#4318FF] hover:bg-white transition-all font-bold text-[#1B2559]"
            >
              {campus}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'role') {
    return (
      <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button onClick={handleBackToCampus} className="flex items-center text-sm font-bold text-gray-400 hover:text-[#1B2559] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campus
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-[#1B2559] mb-2">Choose your role</h2>
          <p className="text-gray-500 text-sm font-medium">Select how you want to access the platform</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleRoleSelect('student')} className="w-full group text-left bg-white/50 backdrop-blur-sm border-2 border-gray-100 p-4 rounded-2xl hover:border-[#4318FF] hover:bg-white hover:shadow-lg hover:shadow-blue-500/10 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4318FF] flex items-center justify-center mb-3 group-hover:bg-[#4318FF] group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1B2559]">Student</h3>
            <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight">Submit works &<br/>check grades</p>
          </button>
          
          <button onClick={() => handleRoleSelect('lecturer')} className="w-full group text-left bg-white/50 backdrop-blur-sm border-2 border-gray-100 p-4 rounded-2xl hover:border-[#F26F21] hover:bg-white hover:shadow-lg hover:shadow-orange-500/10 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F26F21] flex items-center justify-center mb-3 group-hover:bg-[#F26F21] group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1B2559]">Lecturer</h3>
            <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight">Manage classes<br/>& evaluate</p>
          </button>

          <button onClick={() => handleRoleSelect('headsubject')} className="w-full group text-left bg-white/50 backdrop-blur-sm border-2 border-gray-100 p-4 rounded-2xl hover:border-[#EAB308] hover:bg-white hover:shadow-lg hover:shadow-yellow-500/10 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 text-[#EAB308] flex items-center justify-center mb-3 group-hover:bg-[#EAB308] group-hover:text-white transition-colors">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1B2559]">Head Subject</h3>
            <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight">Manage subjects<br/>& curriculum</p>
          </button>

          <button onClick={() => handleRoleSelect('admin')} className="w-full group text-left bg-white/50 backdrop-blur-sm border-2 border-gray-100 p-4 rounded-2xl hover:border-[#16A34A] hover:bg-white hover:shadow-lg hover:shadow-green-500/10 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-[#16A34A] flex items-center justify-center mb-3 group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1B2559]">Admin</h3>
            <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight">System config<br/>& users</p>
          </button>
        </div>
      </div>
    );
  }

  // Form Step
  const getThemeColor = () => {
    switch(selectedRole) {
      case 'lecturer': return 'orange';
      case 'headsubject': return 'yellow';
      case 'admin': return 'green';
      default: return 'blue';
    }
  };
  
  const theme = getThemeColor();
  const themeClasses = {
    blue: { bg: 'bg-[#4318FF]', hover: 'hover:bg-[#3311CC]', text: 'text-[#4318FF]', shadow: 'shadow-blue-500/30', ring: 'focus:ring-[#4318FF]/20', border: 'focus:border-[#4318FF]' },
    orange: { bg: 'bg-[#F26F21]', hover: 'hover:bg-[#D95D1A]', text: 'text-[#F26F21]', shadow: 'shadow-orange-500/30', ring: 'focus:ring-[#F26F21]/20', border: 'focus:border-[#F26F21]' },
    yellow: { bg: 'bg-[#EAB308]', hover: 'hover:bg-[#CA8A04]', text: 'text-[#EAB308]', shadow: 'shadow-yellow-500/30', ring: 'focus:ring-[#EAB308]/20', border: 'focus:border-[#EAB308]' },
    green: { bg: 'bg-[#16A34A]', hover: 'hover:bg-[#15803D]', text: 'text-[#16A34A]', shadow: 'shadow-green-500/30', ring: 'focus:ring-[#16A34A]/20', border: 'focus:border-[#16A34A]' }
  };
  
  const t = themeClasses[theme as keyof typeof themeClasses];

  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button onClick={() => setStep('role')} className="flex items-center text-sm font-bold text-gray-400 hover:text-[#1B2559] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roles
      </button>
      
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-[#1B2559] mb-2 capitalize">{selectedRole} Sign In</h2>
        <p className="text-gray-500 text-sm font-medium">Enter your credentials to continue</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className={`block w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-medium text-gray-900 outline-none focus:bg-white focus:ring-2 ${t.ring} ${t.border} transition-all`} 
              placeholder="name@fpt.edu.vn"
              required
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-gray-700">Password</label>
            <a href="#" className={`text-xs font-bold ${t.text} hover:underline`}>Forgot password?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full pl-11 pr-10 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-medium text-gray-900 outline-none focus:bg-white focus:ring-2 ${t.ring} ${t.border} transition-all`} 
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
          disabled={isLoading}
          className={`w-full ${t.bg} ${t.hover} text-white py-3.5 rounded-xl font-bold shadow-lg ${t.shadow} transition-all flex items-center justify-center mt-6 disabled:opacity-70`}
        >
          {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-2" />
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-transparent text-gray-400 font-medium">Or continue with</span></div>
        </div>

        <button type="button" className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold flex items-center justify-center transition-all">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
