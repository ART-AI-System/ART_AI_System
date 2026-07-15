import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminStudentsPage = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#064E3B] text-lg">Students Information</h3>
        <div className="flex space-x-3">
          <div className="relative">
            <input type="text" placeholder="Search by name or roll" className="border border-gray-200 rounded-xl px-4 py-2 pr-10 w-64 text-sm focus:outline-none focus:border-green-500" />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none">
            <option>Last 30 days</option>
          </select>
          <button className="bg-[#16A34A] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />Add Students
          </button>
        </div>
      </div>
      
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-100 uppercase text-xs tracking-wider">
            <th className="py-3 px-4 w-10"><input type="checkbox" className="rounded text-green-500" /></th>
            <th className="py-3">Students Name</th>
            <th className="py-3">Roll</th>
            <th className="py-3">Email</th>
            <th className="py-3">Date Of Birth</th>
            <th className="py-3">Phone</th>
            <th className="py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4"><input type="checkbox" className="rounded text-green-500" /></td>
            <td className="py-4 font-bold text-[#064E3B] flex items-center">
              <img src="https://ui-avatars.com/api/?name=Eleanor+Pena&background=F3F4F6" className="w-8 h-8 rounded-full mr-3" alt="Eleanor Pena" />
              Eleanor Pena
            </td>
            <td className="py-4 text-gray-500">#01</td>
            <td className="py-4 text-gray-500">eleanor@fpt.edu.vn</td>
            <td className="py-4 text-gray-500">02/05/2001</td>
            <td className="py-4 text-gray-500">+123 6988567</td>
            <td className="py-4 text-right">
              <div className="flex justify-end space-x-2">
                <button className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          <tr className="border-b border-gray-50 bg-green-50/50">
            <td className="py-4 px-4"><input type="checkbox" className="rounded text-green-500" defaultChecked /></td>
            <td className="py-4 font-bold text-[#064E3B] flex items-center">
              <img src="https://ui-avatars.com/api/?name=Jessia+Rose&background=F3F4F6" className="w-8 h-8 rounded-full mr-3" alt="Jessia Rose" />
              Jessia Rose
            </td>
            <td className="py-4 text-gray-500">#10</td>
            <td className="py-4 text-gray-500">jessia@fpt.edu.vn</td>
            <td className="py-4 text-gray-500">03/04/2000</td>
            <td className="py-4 text-gray-500">+123 8988569</td>
            <td className="py-4 text-right">
              <div className="flex justify-end space-x-2">
                <button className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="mt-6 flex justify-center">
        <div className="flex items-center space-x-1 text-sm">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#064E3B] text-white font-bold">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">3</button>
          <span className="px-2 text-gray-400">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentsPage;
