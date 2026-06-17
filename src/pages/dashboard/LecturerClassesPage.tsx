import LecturerSubjectCard from '../../components/common/LecturerSubjectCard';
import { MOCK_LECTURER_SUBJECTS } from '../../mocks/classes.mock';

const LecturerClassesPage = () => {
  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_LECTURER_SUBJECTS.map((subject) => (
          <LecturerSubjectCard key={subject.id} {...subject} />
        ))}
      </div>
    </div>
  );
};

export default LecturerClassesPage;
