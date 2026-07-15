import { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { authApi } from '../../api/authApi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentCode: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would call authApi.register(formData)
      // Since it's not defined in the snippet, we'll simulate it:
      await new Promise(resolve => setTimeout(resolve, 1000));
      // redirect to login after successful register
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Link to={ROUTES.LOGIN} className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#4318FF] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-[#1B2559] mb-2">Create Account</h2>
        <p className="text-gray-500 font-medium text-sm">Join the ART-AI academic platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* Full Name & Student Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Code <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="studentCode"
              value={formData.studentCode}
              onChange={handleChange}
              required 
              className="block w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium outline-none" 
              placeholder="SE12345" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required 
              className="block w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium outline-none" 
              placeholder="John Doe" 
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">FPT Email <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              className="block w-full pl-9 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium outline-none" 
              placeholder="student@fpt.edu.vn" 
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
              className="block w-full pl-9 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium outline-none" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Confirm <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShieldCheck className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
              className="block w-full pl-9 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium outline-none" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start pt-2">
          <input 
            type="checkbox" 
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            required 
            className="mt-1 h-4 w-4 text-[#4318FF] focus:ring-[#4318FF] border-gray-300 rounded cursor-pointer" 
          />
          <label className="ml-2 block text-xs font-medium text-gray-600">
            I agree to the <a href="#" className="text-[#4318FF] hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-[#4318FF] hover:underline font-bold">Privacy Policy</a>, including the rules on AI declaration.
          </label>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-[#4318FF] hover:bg-blue-700 focus:outline-none transition-all hover:-translate-y-0.5 mt-6 disabled:opacity-70"
        >
          {isLoading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
