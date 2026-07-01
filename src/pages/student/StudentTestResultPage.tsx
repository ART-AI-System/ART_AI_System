
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Check, XCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import axiosClient from '../../api/axiosClient';

const StudentTestResultPage = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(8.5);
  const [totalScore, setTotalScore] = useState(10);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res: any = await axiosClient.get('/test-attempts/attempt-demo-123/result');
        const data = res.result || res.data || res;
        if (data && typeof data.score !== 'undefined') {
          setScore(data.score);
          setTotalScore(data.totalPoints || 10);
        }
      } catch (err) {
        console.error('Failed to fetch attempt result, using mock result', err);
      }
    };
    fetchResult();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F4F7FE] absolute inset-0 z-50">
      {/* EXAM HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 shadow-sm relative z-20">
        <div className="flex items-center">
          <button onClick={() => navigate(ROUTES.SUBJECT_DETAIL)} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-[#F26F21] hover:border-[#F26F21] text-gray-500 hover:text-white flex items-center justify-center transition-all mr-5 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#1B2559] tracking-tight">Pop Quiz 1: Servlets <span className="ml-2 text-sm font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Completed</span></h1>
            <p className="text-sm text-gray-500 font-medium">PRJ301 - Java Web Application • Submitted Today at 10:45 AM</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-2 flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Final Score</span>
            <span className="text-2xl font-extrabold text-[#1B2559]">{score} <span className="text-sm text-gray-400">/ {totalScore}</span></span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* QUESTION AREA */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-10">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Question 1 (Correct) */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 relative overflow-hidden" id="q1">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
              <div className="flex justify-between items-start mb-6 pl-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1B2559]">Question 1</h2>
                  <p className="text-sm font-bold text-green-600 flex items-center mt-1"><CheckCircle2 className="w-4 h-4 mr-1" /> Correct (+10 pts)</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 font-medium mb-6 pl-4">What is the correct order of the Servlet lifecycle methods?</p>
              
              <div className="space-y-3 pl-4">
                <label className="flex items-center p-4 border border-gray-200 rounded-xl opacity-50">
                  <input type="radio" disabled className="w-5 h-5 text-gray-400" />
                  <span className="ml-4 font-medium text-gray-700">start(), run(), stop()</span>
                </label>
                {/* Correct Answer that student selected */}
                <label className="flex items-center p-4 border border-green-500 bg-green-50 rounded-xl relative">
                  <Check className="w-5 h-5 text-green-600 absolute right-4" />
                  <input type="radio" checked disabled className="w-5 h-5 text-green-600" />
                  <span className="ml-4 font-bold text-green-800">init(), service(), destroy()</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-xl opacity-50">
                  <input type="radio" disabled className="w-5 h-5 text-gray-400" />
                  <span className="ml-4 font-medium text-gray-700">load(), execute(), unload()</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-xl opacity-50">
                  <input type="radio" disabled className="w-5 h-5 text-gray-400" />
                  <span className="ml-4 font-medium text-gray-700">onCreate(), onService(), onDestroy()</span>
                </label>
              </div>
            </div>

            {/* Question 2 (Incorrect) */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 relative overflow-hidden" id="q2">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
              <div className="flex justify-between items-start mb-6 pl-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1B2559]">Question 2</h2>
                  <p className="text-sm font-bold text-red-500 flex items-center mt-1"><XCircle className="w-4 h-4 mr-1" /> Incorrect (0 pts)</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 font-medium mb-6 pl-4">Which of the following are valid JSP implicit objects? (Select all that apply)</p>
              
              <div className="space-y-3 pl-4">
                {/* Correct answer, student missed it */}
                <label className="flex items-center p-4 border border-green-500 bg-green-50 rounded-xl relative">
                  <span className="absolute right-4 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Correct Answer</span>
                  <input type="checkbox" checked disabled className="w-5 h-5 text-green-600 rounded" />
                  <span className="ml-4 font-bold text-green-800">request</span>
                </label>
                {/* Wrong answer, student selected it */}
                <label className="flex items-center p-4 border border-red-500 bg-red-50 rounded-xl relative">
                  <X className="w-5 h-5 text-red-500 absolute right-4" />
                  <input type="checkbox" checked disabled className="w-5 h-5 text-red-500 rounded" />
                  <span className="ml-4 font-bold text-red-800">responseWriter</span>
                </label>
                {/* Correct answer, student got it right but failed the overall question */}
                <label className="flex items-center p-4 border border-gray-200 rounded-xl opacity-50">
                  <input type="checkbox" checked disabled className="w-5 h-5 text-gray-400 rounded" />
                  <span className="ml-4 font-medium text-gray-700">session</span>
                </label>
              </div>
            </div>

          </div>
        </main>

        {/* RIGHT SIDEBAR: QUESTION GRID */}
        <aside className="w-[320px] bg-white border-l border-gray-200 shrink-0 p-6 flex flex-col">
          <h3 className="font-bold text-[#1B2559] mb-4">Results Overview</h3>
          
          <div className="grid grid-cols-5 gap-2 mb-8">
            <a href="#q1" className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">1</a>
            <a href="#q2" className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">2</a>
            {[3, 4, 5, 6, 7, 8, 9].map(n => (
              <a key={n} href="#" className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">{n}</a>
            ))}
            <a href="#" className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">10</a>
          </div>

          <div className="space-y-3 mt-auto border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Correct</span>
              <span className="font-bold text-green-600">8</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Incorrect</span>
              <span className="font-bold text-red-500">2</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudentTestResultPage;
