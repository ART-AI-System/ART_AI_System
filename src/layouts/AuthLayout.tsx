import { Outlet } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Left Column (Branding & Graphic) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0072BC] to-[#122A5E] relative flex-col justify-between p-16 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80')] mix-blend-overlay opacity-20 object-cover"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F26F21] to-[#F79C65] flex items-center justify-center text-white mr-4 shadow-xl shadow-orange-500/30">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">ART-AI System</span>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Empowering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
              Academic Transparency
            </span>
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            Join FPT University's next-generation Learning Management System. Engage with AI responsibly and track your academic progress in real-time.
          </p>
        </div>

        <div className="relative z-10 text-sm font-medium text-blue-200">
          &copy; 2026 FPT University. All rights reserved.
        </div>
      </div>

      {/* Right Column (Form container) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 bg-[#F8F9FA]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
