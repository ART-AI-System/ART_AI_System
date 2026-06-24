import { useState } from 'react';
import { ChevronDown, UploadCloud, Download, Send, Info, Edit3, X, AlertCircle, Save } from 'lucide-react';

const LecturerReportsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ studentName: '', component: '', currentGrade: '' });
  const [newGrade, setNewGrade] = useState('');
  const [note, setNote] = useState('');

  const openModal = (studentName: string, component: string, currentGrade: string) => {
    setModalData({ studentName, component, currentGrade });
    setNewGrade(currentGrade);
    setNote('');
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const isValid = note.trim().length > 0 && newGrade !== '';

  return (
    <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Filter Controls & Actions */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-4">
            {/* Subject Selector */}
            <div className="w-48">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
              <div className="relative">
                <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-[#1B2559] text-sm font-bold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] cursor-pointer">
                  <option value="PRJ301">PRJ301</option>
                  <option value="SWE201c">SWE201c</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Class Selector */}
            <div className="w-48">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class</label>
              <div className="relative">
                <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-[#1B2559] text-sm font-bold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] cursor-pointer">
                  <option value="SE20A09">SE20A09</option>
                  <option value="SE20A10">SE20A10</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-200 text-gray-600 hover:text-[#4318FF] hover:border-[#4318FF] px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center shadow-sm">
              <UploadCloud className="w-4 h-4 mr-2" /> Import CSV
            </button>
            <button className="bg-white border border-gray-200 text-gray-600 hover:text-green-600 hover:border-green-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center shadow-sm">
              <Download className="w-4 h-4 mr-2" /> Export Excel
            </button>
            <button className="bg-[#F26F21] hover:bg-[#E86115] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center ml-2">
              <Send className="w-4 h-4 mr-2" /> Send to Head of Subject
            </button>
          </div>
        </div>

        {/* Report Status Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900">Draft Status</p>
            <p className="text-xs text-blue-700 mt-0.5">This gradebook has not been submitted yet. Any manual grade edits require a justification note.</p>
          </div>
        </div>

        {/* Gradebook Table */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-100 w-64">Student</th>
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Progress Test 1<br/><span className="text-[10px] text-gray-400 font-medium">10%</span></th>
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Progress Test 2<br/><span className="text-[10px] text-gray-400 font-medium">10%</span></th>
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Assignment 1<br/><span className="text-[10px] text-gray-400 font-medium">20%</span></th>
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Final Exam<br/><span className="text-[10px] text-gray-400 font-medium">60%</span></th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1B2559] uppercase tracking-wider text-center bg-blue-50/50">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 sticky left-0 bg-white group-hover:bg-gray-50/50 border-r border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">VK</div>
                      <div>
                        <p className="text-sm font-bold text-[#1B2559]">Nguyen Viet Khoa</p>
                        <p className="text-xs text-gray-400">HE170001</p>
                      </div>
                    </div>
                  </td>
                  {/* Grade Cells */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center group/cell">
                      <span className="text-sm font-bold text-gray-700">8.5</span>
                      <button onClick={() => openModal('Nguyen Viet Khoa', 'Progress Test 1', '8.5')} className="ml-2 text-gray-300 hover:text-[#F26F21] opacity-0 group-hover/cell:opacity-100 transition-opacity">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center group/cell">
                      <span className="text-sm font-bold text-gray-700">9.0</span>
                      <button onClick={() => openModal('Nguyen Viet Khoa', 'Progress Test 2', '9.0')} className="ml-2 text-gray-300 hover:text-[#F26F21] opacity-0 group-hover/cell:opacity-100 transition-opacity">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center group/cell relative group/tooltip">
                      <span className="text-sm font-bold text-[#4318FF]">9.5*</span>
                      <button onClick={() => openModal('Nguyen Viet Khoa', 'Assignment 1', '9.5')} className="ml-2 text-gray-300 hover:text-[#F26F21] opacity-0 group-hover/cell:opacity-100 transition-opacity">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <span className="invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-opacity absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1B2559] text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap">Edited: Added +1 bonus for outstanding presentation</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center group/cell">
                      <span className="text-sm font-bold text-gray-700">8.0</span>
                      <button onClick={() => openModal('Nguyen Viet Khoa', 'Final Exam', '8.0')} className="ml-2 text-gray-300 hover:text-[#F26F21] opacity-0 group-hover/cell:opacity-100 transition-opacity">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center bg-blue-50/30">
                    <span className="text-base font-extrabold text-[#1B2559]">8.45</span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 sticky left-0 bg-white group-hover:bg-gray-50/50 border-r border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs mr-3">TA</div>
                      <div>
                        <p className="text-sm font-bold text-[#1B2559]">Tran Tuan Anh</p>
                        <p className="text-xs text-gray-400">HE170002</p>
                      </div>
                    </div>
                  </td>
                  {/* Grade Cells */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center group/cell">
                      <span className="text-sm font-bold text-gray-700">6.0</span>
                      <button onClick={() => openModal('Tran Tuan Anh', 'Progress Test 1', '6.0')} className="ml-2 text-gray-300 hover:text-[#F26F21] opacity-0 group-hover/cell:opacity-100 transition-opacity">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center group/cell relative group/tooltip">
                      <span className="text-sm font-bold text-[#4318FF]">7.0*</span>
                      <button onClick={() => openModal('Tran Tuan Anh', 'Progress Test 2', '7.0')} className="ml-2 text-gray-300 hover:text-[#F26F21] opacity-0 group-hover/cell:opacity-100 transition-opacity">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <span className="invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-opacity absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1B2559] text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap">Edited: System bug on question 5, recalculated</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center group/cell">
                      <span className="text-sm font-bold text-red-500">4.5</span>
                      <button onClick={() => openModal('Tran Tuan Anh', 'Assignment 1', '4.5')} className="ml-2 text-gray-300 hover:text-[#F26F21] opacity-0 group-hover/cell:opacity-100 transition-opacity">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center group/cell">
                      <span className="text-sm font-bold text-gray-400 italic">Not taken</span>
                      <button onClick={() => openModal('Tran Tuan Anh', 'Final Exam', '')} className="ml-2 text-gray-300 hover:text-[#F26F21] opacity-0 group-hover/cell:opacity-100 transition-opacity">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center bg-blue-50/30">
                    <span className="text-base font-extrabold text-red-500">2.20</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT GRADE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1B2559]/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl w-[480px] max-w-[90%] shadow-2xl overflow-hidden transform transition-all">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-[#1B2559]">Edit Grade</h3>
                <p className="text-sm text-gray-500 mt-1">{modalData.studentName}</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-[#F26F21] transition-colors p-2 hover:bg-white rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-8 space-y-6">
              {/* Grade Item Info */}
              <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Component</p>
                  <p className="text-sm font-bold text-blue-900">{modalData.component}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Current</p>
                  <p className="text-sm font-bold text-blue-900">{modalData.currentGrade || 'N/A'}</p>
                </div>
              </div>

              {/* Input New Grade */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Grade <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="10" 
                  placeholder="e.g. 9.5" 
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F26F21] focus:border-transparent transition-all font-medium"
                />
              </div>

              {/* Mandatory Note */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Reason / Note <span className="text-red-500">*</span></label>
                <textarea 
                  rows={3} 
                  placeholder="You must provide a justification for this grade change..." 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F26F21] focus:border-transparent transition-all text-sm resize-none"
                />
                {!isValid && (
                  <p className="text-xs text-red-500 mt-2 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> 
                    A justification note is required to save changes.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all">Cancel</button>
              <button 
                disabled={!isValid} 
                className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center ${isValid ? 'bg-[#4318FF] hover:bg-[#3311CC] shadow-md shadow-blue-500/20' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerReportsPage;
