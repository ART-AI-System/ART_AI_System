import { Upload, Plus } from 'lucide-react';

const AdminStudentsPage = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#064E3B] text-lg">Student Management</h3>
        <div className="flex space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 text-sm flex items-center">
            <Upload className="w-4 h-4 mr-2" />Import Students Excel
          </button>
          <button className="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 text-sm flex items-center">
            <Plus className="w-4 h-4 mr-2" />Add Student
          </button>
        </div>
      </div>
      <p className="text-gray-500">List of students.</p>
    </div>
  );
};

export default AdminStudentsPage;
