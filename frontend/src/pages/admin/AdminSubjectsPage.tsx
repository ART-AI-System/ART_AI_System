import { Plus } from 'lucide-react';

const AdminSubjectsPage = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#064E3B] text-lg">Subject Management</h3>
        <div className="flex space-x-3">
          <button className="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 text-sm flex items-center">
            <Plus className="w-4 h-4 mr-2" />Add Subject
          </button>
        </div>
      </div>
      <p className="text-gray-500">List of subjects.</p>
    </div>
  );
};

export default AdminSubjectsPage;
