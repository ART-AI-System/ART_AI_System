import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

interface SubjectCardProps {
  id: string;
  code: string;
  name: string;
  classCode: string;
  slots: number;
  image: string;
  lecturerName: string;
  lecturerAvatarColor: { bg: string, text: string };
}

export const SubjectCard = ({ id, code, name, classCode, slots, image, lecturerName, lecturerAvatarColor }: SubjectCardProps) => {
  return (
    <Link 
      to={ROUTES.CLASS_DETAIL.replace(':id', id)} 
      className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all hover:-translate-y-1"
    >
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/30">
            {code}
          </span>
          <span className="px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg shadow-sm">
            {slots} Slots
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-[#1B2559] text-lg mb-1 leading-tight group-hover:text-[#4318FF] transition-colors">
          {name}
        </h3>
        <p className="text-xs text-gray-400 font-medium mb-4">Class: {classCode}</p>
        
        <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(lecturerName)}&background=${lecturerAvatarColor.bg}&color=${lecturerAvatarColor.text}`} 
            alt={lecturerName}
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
          />
          <div className="ml-3">
            <p className="text-sm font-bold text-[#1B2559]">{lecturerName}</p>
            <p className="text-xs font-medium text-gray-500">Lecturer</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
