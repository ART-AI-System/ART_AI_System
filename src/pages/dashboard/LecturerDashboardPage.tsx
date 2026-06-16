import { BookOpen, Users, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';
import { SubjectCard } from '../../components/common/SubjectCard';

import { MOCK_CLASSES } from '../../mocks/classes.mock';

const LecturerDashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Top Section: Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#4318FF] mr-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Classes</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">2</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Students</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">65</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 mr-4">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Assignments to Grade</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">12</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Upcoming Slots</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">4</p>
          </div>
        </Card>
      </div>

      {/* Classes Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-[#1B2559]">My Classes</h2>
          <Link 
            to={ROUTES.CLASSES} 
            className="text-sm font-bold text-[#4318FF] bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_CLASSES.map((subject) => (
            <SubjectCard key={subject.id} {...subject} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboardPage;
