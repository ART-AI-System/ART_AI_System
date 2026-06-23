import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

const AuthLayout = () => {
  const [campusBg, setCampusBg] = useState<string | null>(null);

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden bg-[#F4F7FE]">
      {campusBg ? (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500 opacity-100"
          style={{ backgroundImage: `url('/${campusBg}.jpg')` }}
        />
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-40 blur-[100px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-400 opacity-40 blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[0%] left-[5%] w-[450px] h-[450px] rounded-full bg-green-400 opacity-35 blur-[120px] pointer-events-none z-0"></div>
        </>
      )}
      <div className="absolute inset-0 bg-black/10 z-0"></div>

      <div className="w-full max-w-5xl flex rounded-[32px] overflow-hidden shadow-2xl bg-white/70 backdrop-blur-md border border-white/50 relative z-10 min-h-[600px]">
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
            <div className="bg-white p-1 rounded-md shadow-sm flex items-center justify-center">
              <img src="/fpt_education_logo.png" alt="FPT Education Logo" className="h-6 object-contain" />
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Area */}
        <div className="w-full lg:w-1/2 bg-white/80 backdrop-blur-lg p-12 flex flex-col justify-center relative">
          <Outlet context={{ setCampusBg }} />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
