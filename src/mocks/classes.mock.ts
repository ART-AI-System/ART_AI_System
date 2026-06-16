export interface ClassMock {
  id: string;
  code: string;
  name: string;
  classCode: string;
  slots: number;
  image: string;
  lecturerName: string;
  lecturerAvatarColor: { bg: string; text: string };
}

export const MOCK_CLASSES: ClassMock[] = [
  {
    id: '1',
    code: 'SWD392',
    name: 'Software Architecture & Design',
    classCode: 'SE18D01',
    slots: 20,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    lecturerName: 'Dr. Alan Smith',
    lecturerAvatarColor: { bg: 'EBF4FF', text: '0072BC' }
  },
  {
    id: '2',
    code: 'PRM392',
    name: 'Mobile Programming',
    classCode: 'SE18D02',
    slots: 30,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    lecturerName: 'Ms. Anna Taylor',
    lecturerAvatarColor: { bg: 'FCE7F3', text: 'BE185D' }
  },
  {
    id: '3',
    code: 'SWT301',
    name: 'Software Testing',
    classCode: 'SE18D01',
    slots: 20,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    lecturerName: 'Mr. David Chen',
    lecturerAvatarColor: { bg: 'DCFCE7', text: '15803D' }
  }
];
