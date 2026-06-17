import { LayoutGrid, List } from 'lucide-react';
import { SubjectCard } from '../../components/common/SubjectCard';
import { MOCK_CLASSES } from '../../mocks/classes.mock';

const ClassesPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">My Subjects</h1>
          <p className="text-gray-500 font-medium mt-1">All enrolled subjects for the selected semester</p>
        </div>
        
        <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-100">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-bold">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-gray-700 rounded-md text-sm font-bold">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_CLASSES.map(subject => (
          <SubjectCard key={subject.id} {...subject} />
        ))}
      </div>
    </div>
  );
};

export default ClassesPage;
