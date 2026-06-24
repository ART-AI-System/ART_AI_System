import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, AlertTriangle, Save, Send, Folder, ChevronRight, 
  FileCode2, Download, Sidebar as SidebarIcon, ChevronDown, FileCode,
  AlertOctagon, RefreshCcw
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

type Tab = 'ai' | 'grade';

const LecturerGradingDetailPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ai');
  const [showFileTree, setShowFileTree] = useState(true);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* TOP HEADER (Compact) */}
      <header className="h-16 bg-[#1B2559] text-white flex items-center justify-between px-6 shrink-0 shadow-md relative z-20">
        <div className="flex items-center">
          <Link to={ROUTES.CLASS_GRADING.replace(':classId', '1')} className="p-2 mr-4 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div>
            <div className="flex items-center text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
              <Link to={ROUTES.CLASSES} className="hover:text-white transition-colors">Grading</Link>
              <ChevronRight className="w-3 h-3 mx-1" />
              <Link to="#" className="hover:text-white transition-colors">PRJ301</Link>
              <ChevronRight className="w-3 h-3 mx-1" />
              <Link to="#" className="hover:text-white transition-colors">SE18D01 (PE 1)</Link>
            </div>
            <h1 className="text-sm font-bold">Nguyen Van Duc (HE150001)</h1>
          </div>
          
          <div className="hidden md:flex ml-6 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full items-center">
            <AlertTriangle className="w-3 h-3 text-red-400 mr-2" />
            <span className="text-xs font-bold text-red-200">High Discrepancy Detected (95% AI vs 10% Declared)</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-100 transition-all flex items-center hidden sm:flex">
            <RefreshCcw className="w-4 h-4 mr-2" /> Request Resubmit
          </button>
          <button className="px-4 py-2 bg-white/10 text-white border border-white/20 text-xs font-bold rounded-lg hover:bg-white/20 transition-all flex items-center hidden sm:flex">
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </button>
          <button className="px-4 py-2 bg-[#F26F21] text-white text-xs font-bold rounded-lg hover:bg-[#D95D1A] transition-all shadow-lg shadow-orange-500/30 flex items-center">
            <Send className="w-4 h-4 mr-2" /> Publish Grade
          </button>
        </div>
      </header>

      {/* SPLIT VIEW CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: CODE REVIEWER */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-white min-w-0">
          
          {/* Toolbar */}
          <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium overflow-hidden whitespace-nowrap">
              <Folder className="w-4 h-4 text-blue-400 shrink-0" />
              <span>src</span>
              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
              <span>java</span>
              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
              <FileCode2 className="w-4 h-4 text-[#F26F21] shrink-0" />
              <span className="font-bold text-[#1B2559] truncate">CartServlet.java</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0 ml-4">
              <button className="p-1.5 text-gray-500 hover:text-[#1B2559] hover:bg-gray-200 rounded transition-colors" title="Download File"><Download className="w-4 h-4" /></button>
              <button className={`p-1.5 rounded transition-colors ${showFileTree ? 'text-[#1B2559] bg-gray-200' : 'text-gray-500 hover:text-[#1B2559] hover:bg-gray-200'}`} title="Toggle File Tree" onClick={() => setShowFileTree(!showFileTree)}>
                <SidebarIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code Editor Workspace */}
          <div className="flex-1 flex overflow-hidden">
            {/* File Tree Sidebar */}
            {showFileTree && (
              <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto hide-scrollbar shrink-0 p-2 hidden md:block">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-2">Files</div>
                <ul className="space-y-0.5 text-sm font-medium text-gray-700">
                  <li>
                    <button className="w-full flex items-center px-2 py-1.5 hover:bg-gray-200 rounded text-left">
                      <ChevronDown className="w-3 h-3 mr-1 text-gray-400" />
                      <Folder className="w-4 h-4 mr-2 text-blue-400" />src
                    </button>
                    <ul className="pl-4 border-l border-gray-200 ml-3">
                      <li>
                        <button className="w-full flex items-center px-2 py-1.5 bg-[#4318FF]/10 text-[#4318FF] rounded text-left">
                          <FileCode2 className="w-4 h-4 mr-2 text-[#F26F21]" />CartServlet.java
                        </button>
                      </li>
                      <li>
                        <button className="w-full flex items-center px-2 py-1.5 hover:bg-gray-200 rounded text-left">
                          <FileCode2 className="w-4 h-4 mr-2 text-gray-500" />LoginServlet.java
                        </button>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <button className="w-full flex items-center px-2 py-1.5 hover:bg-gray-200 rounded text-left">
                      <ChevronRight className="w-3 h-3 mr-1 text-gray-400" />
                      <Folder className="w-4 h-4 mr-2 text-gray-400" />web
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center px-2 py-1.5 hover:bg-gray-200 rounded text-left pl-6">
                      <FileCode className="w-4 h-4 mr-2 text-orange-400" />index.jsp
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* Code View */}
            <div className="flex-1 min-w-0 overflow-auto hide-scrollbar bg-white p-4">
              <table className="w-full text-sm font-mono leading-relaxed">
                <tbody>
                  <tr className="hover:bg-gray-50 group">
                    <td className="w-12 text-right pr-4 text-gray-300 select-none group-hover:text-gray-500 cursor-pointer">1</td>
                    <td><span className="text-[#d73a49]">package</span> controllers;</td>
                  </tr>
                  <tr className="hover:bg-gray-50 group">
                    <td className="w-12 text-right pr-4 text-gray-300 select-none group-hover:text-gray-500 cursor-pointer">2</td>
                    <td></td>
                  </tr>
                  <tr className="hover:bg-gray-50 group">
                    <td className="w-12 text-right pr-4 text-gray-300 select-none group-hover:text-gray-500 cursor-pointer">3</td>
                    <td><span className="text-[#d73a49]">import</span> java.io.IOException;</td>
                  </tr>
                  <tr className="hover:bg-gray-50 group">
                    <td className="w-12 text-right pr-4 text-gray-300 select-none group-hover:text-gray-500 cursor-pointer">4</td>
                    <td><span className="text-[#d73a49]">import</span> javax.servlet.ServletException;</td>
                  </tr>
                  <tr className="hover:bg-gray-50 group">
                    <td className="w-12 text-right pr-4 text-gray-300 select-none group-hover:text-gray-500 cursor-pointer">5</td>
                    <td><span className="text-[#d73a49]">import</span> javax.servlet.http.HttpServlet;</td>
                  </tr>
                  <tr className="hover:bg-gray-50 group">
                    <td className="w-12 text-right pr-4 text-gray-300 select-none group-hover:text-gray-500 cursor-pointer">6</td>
                    <td></td>
                  </tr>
                  {/* Highlighted section (AI detected) */}
                  <tr className="bg-red-50/50 group">
                    <td className="w-12 text-right pr-4 text-red-300 select-none font-bold">7</td>
                    <td className="border-l-2 border-red-400 pl-2">
                      <span className="text-[#6a737d]">{"// System generated AI Risk Highlight"}</span>
                    </td>
                  </tr>
                  <tr className="bg-red-50/50 group">
                    <td className="w-12 text-right pr-4 text-red-300 select-none cursor-pointer hover:text-red-500">8</td>
                    <td className="border-l-2 border-red-400 pl-2">
                      <span className="text-[#d73a49]">public class</span> <span className="text-[#6f42c1]">CartServlet</span> <span className="text-[#d73a49]">extends</span> HttpServlet {"{"}
                    </td>
                  </tr>
                  <tr className="bg-red-50/50 group">
                    <td className="w-12 text-right pr-4 text-red-300 select-none cursor-pointer">9</td>
                    <td className="border-l-2 border-red-400 pl-2 whitespace-pre">
                      {"    "}<span className="text-[#d73a49]">protected void</span> <span className="text-[#6f42c1]">doGet</span>(HttpServletRequest request, HttpServletResponse response) {"{"}
                    </td>
                  </tr>
                  {/* Inline Comment Mockup */}
                  <tr>
                    <td className="w-12"></td>
                    <td className="py-2 pr-4 font-sans">
                      <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-xl p-4 relative z-10 before:content-[''] before:absolute before:-top-2 before:left-4 before:w-4 before:h-4 before:bg-white before:border-l before:border-t before:border-gray-200 before:rotate-45">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-[#1B2559]">Lecturer Comment</span>
                          <span className="text-[10px] text-gray-400">Just now</span>
                        </div>
                        <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-sans outline-none focus:border-[#F26F21] resize-none" rows={2} defaultValue="Đoạn code này sinh viên không khai báo dùng AI nhưng cấu trúc rất giống code do ChatGPT sinh ra. Giải thích logic chỗ này giúp thầy."></textarea>
                        <div className="flex justify-end space-x-2 mt-2">
                          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md hover:bg-gray-200">Cancel</button>
                          <button className="px-3 py-1 bg-[#4318FF] text-white text-xs font-bold rounded-md hover:bg-[#3311CC]">Save Comment</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-red-50/50 group">
                    <td className="w-12 text-right pr-4 text-red-300 select-none cursor-pointer">10</td>
                    <td className="border-l-2 border-red-400 pl-2 whitespace-pre">
                      {"        "}<span className="text-[#6a737d]">{"// Implementation details..."}</span>
                    </td>
                  </tr>
                  <tr className="bg-red-50/50 group">
                    <td className="w-12 text-right pr-4 text-red-300 select-none cursor-pointer">11</td>
                    <td className="border-l-2 border-red-400 pl-2 whitespace-pre">
                      {"    "}{"}"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 group">
                    <td className="w-12 text-right pr-4 text-gray-300 select-none group-hover:text-gray-500 cursor-pointer">12</td>
                    <td>{"}"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: EVALUATION PANEL */}
        <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 bg-white flex flex-col shadow-xl z-10 relative border-l border-gray-200 hidden md:flex">
          
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200 shrink-0">
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors relative ${activeTab === 'ai' ? 'border-[#F26F21] text-[#F26F21]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              {activeTab !== 'ai' && <span className="absolute top-3 right-4 lg:right-8 w-2 h-2 rounded-full bg-red-500"></span>}
              AI Declaration Review
            </button>
            <button 
              onClick={() => setActiveTab('grade')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'grade' ? 'border-[#4318FF] text-[#4318FF]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Academic Grading
            </button>
          </div>

          {/* Tab Content: AI Declaration */}
          {activeTab === 'ai' && (
            <div className="flex-1 overflow-y-auto hide-scrollbar p-6 bg-gray-50/30">
              {/* Discrepancy Alert Banner */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex items-start">
                  <AlertOctagon className="w-6 h-6 text-red-500 mr-3 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-red-800">High Discrepancy Found!</h3>
                    <p className="text-xs text-red-600 mt-1">Student declared only 1 pair of AI interaction (est. 10% usage), but system detected AI signatures in 95% of the codebase.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Student's AI Declaration (5 Steps)</h3>
              
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3 w-1/5">Phase</th>
                      <th className="px-4 py-3 w-2/5">Prompt/Input</th>
                      <th className="px-4 py-3 w-2/5">AI Output/Suggestion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#1B2559]">1. Decomposition</td>
                      <td className="px-4 py-3 text-xs italic">"Break down an e-commerce cart system."</td>
                      <td className="px-4 py-3 text-xs">Suggested 4 components: Cart, Session, DB, UI.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#1B2559]">2. Pattern Recognition</td>
                      <td className="px-4 py-3 text-xs italic">"MVC pattern for cart"</td>
                      <td className="px-4 py-3 text-xs">Provided MVC file structure for Java Servlet.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#1B2559]">3. Abstraction</td>
                      <td className="px-4 py-3 text-xs italic">"Cart Interface methods"</td>
                      <td className="px-4 py-3 text-xs">add(), remove(), checkout(), getTotal().</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#1B2559]">4. Algorithm Design</td>
                      <td className="px-4 py-3 text-xs italic">"Session logic for cart"</td>
                      <td className="px-4 py-3 text-xs">HttpSession.setAttribute() snippet.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#1B2559]">5. Self-Reflection</td>
                      <td className="px-4 py-3 text-xs italic" colSpan={2}>"I used AI to understand how Session works in Servlets, but I implemented the checkout calculation myself to handle edge cases."</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Lecturer Evaluation */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <label className="block text-sm font-bold text-[#1B2559] mb-2">Lecturer's Verification</label>
                <div className="flex space-x-4 mb-3">
                  <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                    <input type="radio" name="overall_verify" className="text-green-500 focus:ring-green-500" /> <span>Accept</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                    <input type="radio" name="overall_verify" className="text-red-500 focus:ring-red-500" defaultChecked /> <span>Reject / Invalid</span>
                  </label>
                </div>
                <textarea rows={3} className="w-full bg-white border border-red-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="Add comment..." defaultValue="This reflection does not align with the system detection. You used AI for the core logic as well, not just the Session boilerplate."></textarea>
              </div>

              {/* Overall AI Feedback */}
              <div>
                <label className="block text-sm font-bold text-[#1B2559] mb-2">Overall Transparency Assessment</label>
                <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-red-600 mb-4 outline-none">
                  <option>Fail (Severe Plagiarism / Dishonesty)</option>
                  <option>Warning (Inaccurate Declaration)</option>
                  <option>Pass (Transparent)</option>
                </select>
              </div>
            </div>
          )}

          {/* Tab Content: Grading */}
          {activeTab === 'grade' && (
            <div className="flex-1 overflow-y-auto hide-scrollbar p-6 bg-gray-50/30">
              <div className="space-y-6">
                
                {/* Score Input */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
                  <label className="block text-sm font-bold text-gray-500 mb-4">Final Score (0 - 10)</label>
                  <div className="flex justify-center items-center">
                    <input type="number" step="0.5" min="0" max="10" className="w-32 text-center text-4xl font-extrabold text-[#1B2559] bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 focus:border-[#4318FF] focus:bg-white outline-none transition-all" placeholder="-" />
                  </div>
                </div>

                {/* Grading Rubric Mockup */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-[#1B2559] mb-4">Grading Rubric</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                        <span>Functionality (40%)</span>
                        <span>0 / 4.0</span>
                      </div>
                      <input type="range" className="w-full accent-[#4318FF]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                        <span>Code Quality (30%)</span>
                        <span>0 / 3.0</span>
                      </div>
                      <input type="range" className="w-full accent-[#4318FF]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                        <span>Documentation (30%)</span>
                        <span>0 / 3.0</span>
                      </div>
                      <input type="range" className="w-full accent-[#4318FF]" />
                    </div>
                  </div>
                </div>

                {/* Overall Feedback */}
                <div>
                  <label className="block text-sm font-bold text-[#1B2559] mb-2">Academic Feedback</label>
                  <textarea rows={6} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4318FF]" placeholder="Write overall feedback for the student..."></textarea>
                </div>

              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default LecturerGradingDetailPage;
