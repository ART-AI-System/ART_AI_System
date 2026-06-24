import LecturerSubjectCard from '../../components/common/LecturerSubjectCard';
import { MOCK_LECTURER_SUBJECTS } from '../../mocks/classes.mock';
import { ROUTES } from '../../config/routes';

const LecturerGradingSubjectsPage = () => {
  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_LECTURER_SUBJECTS.map((subject) => (
          <LecturerSubjectCard 
            key={subject.id} 
            {...subject} 
            linkTo={ROUTES.GRADING_ASSIGNMENTS.replace(':subjectId', subject.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default LecturerGradingSubjectsPage;
