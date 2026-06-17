import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

interface ClassData {
  id: string;
  name: string;
}

export interface LecturerSubjectProps {
  id: string;
  code: string;
  name: string;
  imageUrl: string;
  classesCount: number;
  studentsCount: number;
  classes: ClassData[];
}

export const LecturerSubjectCard = ({
  id,
  code,
  name,
  imageUrl,
  classesCount,
  studentsCount,
  classes,
}: LecturerSubjectProps) => {
  return (
    <Link
      to={ROUTES.SUBJECT_DETAIL.replace(':id', id)}
      className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer block"
    >
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2559]/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <span className="px-2.5 py-1 bg-[#F26F21] text-white text-xs font-bold rounded-lg shadow-sm mb-2 inline-block">
              {code}
            </span>
            <h3 className="font-bold text-white text-lg leading-tight">{name}</h3>
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs font-medium text-gray-400 mb-1">Classes</p>
            <p className="text-lg font-bold text-[#1B2559]">{classesCount}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs font-medium text-gray-400 mb-1">Students</p>
            <p className="text-lg font-bold text-[#1B2559]">{studentsCount}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-sm font-bold text-[#4318FF] flex items-center">
            Manage Subject <ArrowRight className="w-4 h-4 ml-1" />
          </span>
          <div className="flex -space-x-2">
            {classes.slice(0, 3).map((cls, idx) => (
              <span
                key={cls.id}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white z-${10 - idx} ${
                  idx % 2 === 0 ? 'bg-orange-100 text-[#F26F21]' : 'bg-blue-100 text-[#4318FF]'
                }`}
                title={cls.name}
              >
                {cls.name.slice(-2)}
              </span>
            ))}
            {classes.length > 3 && (
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold ring-2 ring-white z-0">
                +{classes.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LecturerSubjectCard;
