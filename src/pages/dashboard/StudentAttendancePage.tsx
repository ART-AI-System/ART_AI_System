
import { AlertCircle, Check, X as XIcon } from 'lucide-react';

const StudentAttendancePage = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">Attendance Report</h1>
          <p className="text-gray-500 font-medium mt-1">Track your presence across all enrolled subjects</p>
        </div>
        <div className="flex space-x-3">
          <select className="bg-white border border-gray-200 text-sm font-bold text-[#1B2559] rounded-xl px-4 py-2 outline-none shadow-sm cursor-pointer min-w-[200px]">
            <option>PRJ301 - Java Web</option>
            <option>SWD392 - Software Arch</option>
          </select>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total Slots</p>
          <h3 className="text-3xl font-extrabold text-[#1B2559]">30</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Present</p>
          <h3 className="text-3xl font-extrabold text-green-500">22</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Absent</p>
          <h3 className="text-3xl font-extrabold text-red-500">3</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 bg-orange-50/50 border-orange-100">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-orange-600 uppercase mb-2">Absence Rate</p>
            <AlertCircle className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline">
            <h3 className="text-3xl font-extrabold text-orange-600">10%</h3>
            <span className="text-xs font-bold text-orange-400 ml-2">Limit: 20%</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-1.5 mt-3">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                <th className="p-4 font-bold w-16 text-center">Slot</th>
                <th className="p-4 font-bold">Date & Time</th>
                <th className="p-4 font-bold">Room</th>
                <th className="p-4 font-bold">Lecturer</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Note</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center font-bold text-gray-500">1</td>
                <td className="p-4">
                  <p className="font-bold text-[#1B2559]">Mon, 10 Jun 2026</p>
                  <p className="text-xs text-gray-500">07:30 - 09:50</p>
                </td>
                <td className="p-4 font-medium text-gray-600">BE-205</td>
                <td className="p-4 font-medium text-gray-600">Dr. Nguyen Van A</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Present
                  </span>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">-</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center font-bold text-gray-500">2</td>
                <td className="p-4">
                  <p className="font-bold text-[#1B2559]">Wed, 12 Jun 2026</p>
                  <p className="text-xs text-gray-500">07:30 - 09:50</p>
                </td>
                <td className="p-4 font-medium text-gray-600">BE-205</td>
                <td className="p-4 font-medium text-gray-600">Dr. Nguyen Van A</td>
                <td className="p-4 text-center">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center">
                    <XIcon className="w-3 h-3 mr-1" /> Absent
                  </span>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">Late 30 mins</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center font-bold text-gray-500">3</td>
                <td className="p-4">
                  <p className="font-bold text-[#1B2559]">Fri, 14 Jun 2026</p>
                  <p className="text-xs text-gray-500">07:30 - 09:50</p>
                </td>
                <td className="p-4 font-medium text-gray-600">BE-205</td>
                <td className="p-4 font-medium text-gray-600">Dr. Nguyen Van A</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Present
                  </span>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">-</td>
              </tr>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <td className="p-4 text-center font-bold text-gray-400">4</td>
                <td className="p-4 opacity-50">
                  <p className="font-bold text-[#1B2559]">Mon, 17 Jun 2026</p>
                  <p className="text-xs text-gray-500">07:30 - 09:50</p>
                </td>
                <td className="p-4 font-medium text-gray-400">BE-205</td>
                <td className="p-4 font-medium text-gray-400">Dr. Nguyen Van A</td>
                <td className="p-4 text-center">
                  <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Future</span>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendancePage;
