
import { Download, CheckCircle, ArrowDownToLine, Calendar, Check } from 'lucide-react';

const StudentTransactionsPage = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">Transaction History</h1>
          <p className="text-gray-500 font-medium mt-1">Review your tuition payments and financial records</p>
        </div>
        <button className="bg-white text-[#4318FF] border border-blue-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm hover:bg-blue-50">
          <Download className="w-4 h-4 mr-2" /> Export Statement
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1B2559] rounded-2xl p-6 shadow-lg shadow-blue-900/20 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
          <p className="text-xs font-bold text-blue-200 uppercase mb-2 z-10">Outstanding Balance</p>
          <h3 className="text-4xl font-extrabold z-10 mb-2">0 <span className="text-lg font-medium text-blue-200">VND</span></h3>
          <p className="text-xs text-green-400 font-medium z-10 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> All fees are fully paid</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Paid (Semester 5)</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">15,400,000 <span className="text-sm font-medium text-gray-400">VND</span></h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
            <ArrowDownToLine className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Next Payment Due</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">01 Sep 2026</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#1B2559]">Recent Transactions</h3>
          <select className="bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-lg px-3 py-2 outline-none">
            <option>All Types</option>
            <option>Tuition Fee</option>
            <option>Retake Fee</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                <th className="p-4 font-bold">Transaction ID</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Description</th>
                <th className="p-4 font-bold text-right">Amount (VND)</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-[#4318FF]">TXN-2605-00123</td>
                <td className="p-4 font-medium text-gray-600">01 May 2026</td>
                <td className="p-4">
                  <p className="font-bold text-[#1B2559]">Tuition Fee - Summer 2026</p>
                  <p className="text-xs text-gray-500">Paid via FPT Edu Portal (Vietcombank)</p>
                </td>
                <td className="p-4 text-right font-extrabold text-[#1B2559]">15,400,000</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Success
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-[#4318FF]">TXN-2512-09432</td>
                <td className="p-4 font-medium text-gray-600">28 Dec 2025</td>
                <td className="p-4">
                  <p className="font-bold text-[#1B2559]">Tuition Fee - Spring 2026</p>
                  <p className="text-xs text-gray-500">Paid via FPT Edu Portal (Vietcombank)</p>
                </td>
                <td className="p-4 text-right font-extrabold text-[#1B2559]">15,400,000</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Success
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-[#4318FF]">TXN-2511-00211</td>
                <td className="p-4 font-medium text-gray-600">15 Nov 2025</td>
                <td className="p-4">
                  <p className="font-bold text-[#1B2559]">Retake Exam Fee - DBI202</p>
                  <p className="text-xs text-gray-500">Paid at Cashier Office</p>
                </td>
                <td className="p-4 text-right font-extrabold text-[#1B2559]">500,000</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Success
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTransactionsPage;
