import { useState, useEffect } from 'react';
import { HelpCircle, Clock, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import axiosClient from '../../api/axiosClient';

const StudentTakeTestPage = () => {
  const navigate = useNavigate();
  const [showAntiCheat, setShowAntiCheat] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  useEffect(() => {
    if (!showAntiCheat && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showAntiCheat, timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !showAntiCheat) {
        alert("WARNING: You left the exam tab. This has been recorded.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [showAntiCheat]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [attemptId, setAttemptId] = useState('attempt-demo-123');

  const handleStartExam = async () => {
    try {
      const res: any = await axiosClient.post('/tests/661122334455667788990001/start');
      if (res && (res._id || res.result?._id)) {
        setAttemptId(res._id || res.result._id);
      }
    } catch (err) {
      console.error('Start attempt API call failed, using mock attempt ID', err);
    }
    setShowAntiCheat(false);
  };

  const submitTest = async () => {
    if(window.confirm("Are you sure you want to submit? You cannot change your answers after submitting.")) {
      try {
        await axiosClient.post(`/test-attempts/${attemptId}/submit`, {
          answers: [
            { questionId: 'q1', selectedOptionId: 'opt-1' },
            { questionId: 'q2', selectedOptionId: 'opt-2' }
          ]
        });
      } catch (err) {
        console.error('Submit attempt API call failed, continuing to result page', err);
      }
      navigate(ROUTES.STUDENT_TEST_RESULT);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none bg-[#F4F7FE] absolute inset-0 z-50">
      {/* EXAM HEADER */}
      <header className="h-20 bg-[#1B2559] flex items-center justify-between px-8 shrink-0 shadow-md relative z-20">
        <div className="flex items-center text-white">
          <div className="w-10 h-10 rounded-xl bg-[#F26F21] flex items-center justify-center font-bold mr-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Pop Quiz 1: Servlets</h1>
            <p className="text-sm text-blue-200">PRJ301 - Java Web Application</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Timer */}
          <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-2 flex items-center">
            <Clock className="w-5 h-5 text-[#F26F21] mr-3" />
            <span className="text-2xl font-extrabold text-white tracking-widest font-mono">{formatTime(timeLeft)}</span>
          </div>
          
          <button onClick={submitTest} className="bg-[#F26F21] hover:bg-[#E86115] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all">
            Submit Test
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* QUESTION AREA */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-10">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Question 1 */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100" id="q1">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-extrabold text-[#1B2559]">Question 1</h2>
                <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">10 Points</span>
              </div>
              
              <p className="text-lg text-gray-700 font-medium mb-6">What is the correct order of the Servlet lifecycle methods?</p>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-[#F26F21] transition-all group">
                  <input type="radio" name="q1" className="w-5 h-5 text-[#F26F21] focus:ring-[#F26F21]" />
                  <span className="ml-4 font-medium text-gray-700 group-hover:text-[#1B2559]">start(), run(), stop()</span>
                </label>
                <label className="flex items-center p-4 border border-[#F26F21] bg-orange-50 rounded-xl cursor-pointer transition-all group">
                  <input type="radio" name="q1" className="w-5 h-5 text-[#F26F21] focus:ring-[#F26F21]" defaultChecked />
                  <span className="ml-4 font-bold text-[#1B2559]">init(), service(), destroy()</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-[#F26F21] transition-all group">
                  <input type="radio" name="q1" className="w-5 h-5 text-[#F26F21] focus:ring-[#F26F21]" />
                  <span className="ml-4 font-medium text-gray-700 group-hover:text-[#1B2559]">load(), execute(), unload()</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-[#F26F21] transition-all group">
                  <input type="radio" name="q1" className="w-5 h-5 text-[#F26F21] focus:ring-[#F26F21]" />
                  <span className="ml-4 font-medium text-gray-700 group-hover:text-[#1B2559]">onCreate(), onService(), onDestroy()</span>
                </label>
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100" id="q2">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-extrabold text-[#1B2559]">Question 2</h2>
                <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">10 Points</span>
              </div>
              
              <p className="text-lg text-gray-700 font-medium mb-6">Which of the following are valid JSP implicit objects? (Select all that apply)</p>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-[#F26F21] bg-orange-50 rounded-xl cursor-pointer transition-all group">
                  <input type="checkbox" name="q2" className="w-5 h-5 text-[#F26F21] focus:ring-[#F26F21] rounded" defaultChecked />
                  <span className="ml-4 font-bold text-[#1B2559]">request</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-[#F26F21] transition-all group">
                  <input type="checkbox" name="q2" className="w-5 h-5 text-[#F26F21] focus:ring-[#F26F21] rounded" />
                  <span className="ml-4 font-medium text-gray-700 group-hover:text-[#1B2559]">responseWriter</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-[#F26F21] transition-all group">
                  <input type="checkbox" name="q2" className="w-5 h-5 text-[#F26F21] focus:ring-[#F26F21] rounded" />
                  <span className="ml-4 font-medium text-gray-700 group-hover:text-[#1B2559]">session</span>
                </label>
              </div>
            </div>

            {/* Pagination/Nav */}
            <div className="flex justify-between items-center py-6">
              <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors flex items-center opacity-50 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5 mr-2" /> Previous
              </button>
              <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-[#1B2559] hover:border-[#F26F21] hover:text-[#F26F21] transition-colors flex items-center">
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: QUESTION GRID */}
        <aside className="w-[320px] bg-white border-l border-gray-200 shrink-0 p-6 flex flex-col">
          <h3 className="font-bold text-[#1B2559] mb-4">Question Navigator</h3>
          
          <div className="grid grid-cols-5 gap-2 mb-8">
            <a href="#q1" className="w-10 h-10 rounded-lg bg-[#1B2559] text-white flex items-center justify-center font-bold shadow-sm">1</a>
            <a href="#q2" className="w-10 h-10 rounded-lg bg-[#F26F21] text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-orange-200 ring-offset-2">2</a>
            {[3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <a key={n} href="#" className="w-10 h-10 rounded-lg border border-gray-200 text-gray-400 hover:border-gray-400 flex items-center justify-center font-bold">{n}</a>
            ))}
          </div>

          <div className="space-y-3 mt-auto">
            <div className="flex items-center text-sm">
              <div className="w-4 h-4 rounded bg-[#1B2559] mr-3"></div>
              <span className="text-gray-600 font-medium">Answered (1)</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-4 h-4 rounded border border-gray-200 mr-3"></div>
              <span className="text-gray-600 font-medium">Not Answered (8)</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-4 h-4 rounded bg-[#F26F21] mr-3"></div>
              <span className="text-gray-600 font-medium">Current (1)</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Anti-Cheat Modal */}
      {showAntiCheat && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-[24px] shadow-2xl p-8 max-w-md w-full text-center border-t-4 border-red-500">
            <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1B2559] mb-2">Exam Mode Active</h2>
            <p className="text-gray-500 mb-6">You are about to start a timed exam. Do not switch tabs, minimize the browser, or open other applications. Doing so will be recorded as a violation.</p>
            <button onClick={handleStartExam} className="w-full bg-[#F26F21] hover:bg-[#E86115] text-white py-3.5 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all">
              I Understand, Start Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTakeTestPage;
