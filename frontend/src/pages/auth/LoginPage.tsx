import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import CampusSelection from '../../components/auth/CampusSelection';
import RoleSelection from '../../components/auth/RoleSelection';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

type Step = 'campus' | 'role' | 'form';
type Role = 'student' | 'lecturer' | 'headsubject' | 'admin' | '';

const LoginPage = () => {
  const [step, setStep] = useState<Step>('campus');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleCampusSelect = (campus: string) => {
    setSelectedCampus(campus);
    setStep('role');
    setError('');
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep('form');
    setError('');
  };

  const handleBackToCampus = () => {
    setSelectedCampus('');
    setStep('campus');
    setError('');
  };

  const handleBackToRole = () => {
    setStep('role');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent, credentials: { username: string; password: string }) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // The backend uses studentCode or username based on role
      const payload = {
        password: credentials.password,
        ...(selectedRole === 'student' 
          ? { studentCode: credentials.username }
          : { username: credentials.username }
        )
      };

      const response: any = await axiosClient.post('/auth/login', payload);
      
      const { access_token, refresh_token, user } = response.result;
      
      // Save to context
      login(access_token, refresh_token, user);

      // Navigate based on actual role from backend
      if (user.role === 'lecturer' || user.role === 'subject_head' || user.role === 'headsubject' || user.role === 'SUBJECT_HEAD') {
        navigate('/lecturer/dashboard');
      } else if (user.role === 'admin' || user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/home');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = () => {
    if (selectedRole === 'lecturer') return 'bg-[#F26F21] hover:bg-[#D95D1A] shadow-orange-500/30';
    if (selectedRole === 'headsubject') return 'bg-[#EAB308] hover:bg-[#CA8A04] shadow-yellow-500/30';
    if (selectedRole === 'admin') return 'bg-[#16A34A] hover:bg-[#15803D] shadow-green-500/30';
    return 'bg-[#4318FF] hover:bg-[#3311CC] shadow-blue-500/30';
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden bg-[#F4F7FE] font-inter">
      {/* Dynamic Background Image Layer */}
      {selectedCampus && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 z-0" 
          style={{ backgroundImage: `url('/bg_${selectedCampus}.jpg')` }}
        />
      )}

      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-40 blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-400 opacity-40 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[0%] left-[5%] w-[450px] h-[450px] rounded-full bg-green-400 opacity-35 blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-5xl flex rounded-[32px] overflow-hidden shadow-2xl relative z-10 h-[600px] bg-white/70 backdrop-blur-md border border-white/50">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex w-1/2 bg-[#1B2559] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F26F21] to-[#F79C65] flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/30">
              <BrainCircuit className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#F26F21] to-[#F79C65]">ART-AI</span> Workspace
            </h1>
            <p className="text-blue-200 font-medium leading-relaxed">
              The AI-Assisted Assessment, Review, and Transparency system. Seamlessly connecting Students and Lecturers in the era of Generative AI.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center space-x-3">
            <p className="text-[10px] font-bold text-white uppercase tracking-widest opacity-60">Powered by</p>
            <button className="bg-white p-1 rounded-md shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <img src="/fpt_education_logo.png" alt="FPT Education Logo" className="h-6 object-contain" />
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Area */}
        <div className="w-full lg:w-1/2 bg-white/80 backdrop-blur-lg p-12 flex flex-col justify-center relative overflow-hidden">
          {step === 'campus' && <CampusSelection handleCampusSelect={handleCampusSelect} />}
          {step === 'role' && <RoleSelection handleBackToCampus={handleBackToCampus} handleRoleSelect={handleRoleSelect} />}
          {step === 'form' && <LoginForm selectedRole={selectedRole} handleBackToRole={handleBackToRole} handleLogin={handleLogin} getRoleColor={getRoleColor} error={error} loading={loading} />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
