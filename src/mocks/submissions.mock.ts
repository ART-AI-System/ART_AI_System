export interface SubmissionMock {
  id: string;
  courseCode: string;
  title: string;
  type: string;
  dueDate: string;
  submittedAt: string;
  status: 'Graded' | 'Pending Review' | 'Draft';
  score: string;
  feedback: string;
  file: {
    name: string;
    size: string;
  };
  aiMatch: string;
  aiMatchColor: string;
}

export const MOCK_SUBMISSIONS: SubmissionMock[] = [
  {
    id: '1',
    courseCode: 'SWD392',
    title: 'Assignment 1: C4 Architecture Diagrams',
    type: 'Assignment',
    dueDate: '2026-06-15T23:59:00Z',
    submittedAt: 'Jun 14, 2026 • 10:45 AM',
    status: 'Graded',
    score: '9.5 / 10',
    feedback: 'Excellent component breakdown. Good use of AI for ideation.',
    file: { name: 'SE18D01_VietKhoa_C4.pdf', size: '3.4 MB' },
    aiMatch: '8% AI Match',
    aiMatchColor: 'text-green-500 bg-green-50'
  },
  {
    id: '2',
    courseCode: 'PRM392',
    title: 'Lab 2: React Native UI Challenge',
    type: 'Lab Work',
    dueDate: '2026-06-20T23:59:00Z',
    submittedAt: 'Jun 19, 2026 • 02:15 PM',
    status: 'Pending Review',
    score: 'Pending',
    feedback: 'Awaiting instructor evaluation.',
    file: { name: 'Lab2_UI_Source.zip', size: '12.8 MB' },
    aiMatch: '24% AI Match',
    aiMatchColor: 'text-orange-500 bg-orange-50'
  },
  {
    id: '3',
    courseCode: 'SWT301',
    title: 'Final Project: Automated Test Suite',
    type: 'Final Project',
    dueDate: '2026-07-10T23:59:00Z',
    submittedAt: '-',
    status: 'Draft',
    score: '-',
    feedback: '-',
    file: { name: 'Test_Suite_Draft.zip', size: '4.1 MB' },
    aiMatch: 'Processing...',
    aiMatchColor: 'text-gray-500 bg-gray-50'
  }
];
