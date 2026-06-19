export interface User {
  id: string;
  studentCode?: string;
  fullName: string;
  role: 'student' | 'lecturer' | 'subject_head' | 'admin' | 'system';
  status: 'active' | 'inactive' | 'pending_activation';
}

export interface Semester {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
}

export interface Class {
  id: string;
  name: string;
  subjectId: string;
  semesterId: string;
  lecturerId: string;
}

export interface Session {
  id: string;
  slotNumber: number;
  title: string;
  classId: string;
  date: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string; // Wait, assignment belongs to session usually based on API spec. But user requested classId here. I will add sessionId as well to be safe, or just stick to user's fields: classId. Spec says "Assignment belongs to one session. Assignment belongs to one class through session." User asked for classId, so I'll provide classId.
  sessionId?: string; // Adding sessionId to link to Session 3
  maxScore: number;
  weight: number;
  aiDeclarationRequired: boolean;
  minAiInteractions: number;
  maxAiInteractions: number;
  dueDate: string;
  status: 'published' | 'closed' | 'draft';
}

export interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

// Add types for empty arrays as requested
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: 'draft' | 'submitted' | 'late' | 'withdrawn';
  fileUrl?: string;
  submittedAt?: string;
}

export interface AiInteraction {
  id: string;
  submissionId: string;
  aiTool: string;
  usagePurpose: string;
  promptContent: string;
  aiResponseSummary: string;
  studentDecision: string;
  reflectionText: string;
}

export interface Grade {
  id: string;
  submissionId: string;
  score: number;
  feedback: string;
}

export interface MockDatabase {
  users: User[];
  semesters: Semester[];
  subjects: Subject[];
  classes: Class[];
  sessions: Session[];
  assignments: Assignment[];
  news: News[];
  submissions: Submission[];
  aiInteractions: AiInteraction[];
  grades: Grade[];
}

export const mockDatabase: MockDatabase = {
  users: [
    {
      id: 'student-1',
      studentCode: 'student',
      fullName: 'Cong Khoa',
      role: 'student',
      status: 'active',
    },
    {
      id: 'lecturer-1',
      studentCode: 'lecturer',
      fullName: 'Phạm Minh Hoàng',
      role: 'lecturer',
      status: 'active',
    },
    {
      id: 'head-1',
      studentCode: 'head',
      fullName: 'Lê Thị Khánh Vân',
      role: 'subject_head',
      status: 'active',
    },
    {
      id: 'admin-1',
      studentCode: 'admin',
      fullName: 'ADMIN ADMIN',
      role: 'admin',
      status: 'active',
    }
  ],
  semesters: [
    {
      id: 'sem1',
      name: 'Summer 2026',
      status: 'active',
    }
  ],
  subjects: [
    {
      id: 'sub1',
      code: 'SWD392',
      name: 'Software Architecture and Design',
      department: 'Software Engineering',
    },
    {
      id: 'sub2',
      code: 'PRJ301',
      name: 'Java Web Project',
      department: 'Software Engineering',
    }
  ],
  classes: [
    {
      id: 'c1',
      name: 'SE18D01',
      subjectId: 'sub1',
      semesterId: 'sem1',
      lecturerId: 'u2',
    }
  ],
  sessions: [
    {
      id: 'sess1',
      slotNumber: 1,
      title: 'Introduction to Software Architecture',
      classId: 'c1',
      date: '2026-06-20T08:00:00Z',
    },
    {
      id: 'sess2',
      slotNumber: 2,
      title: 'Design Patterns Overview',
      classId: 'c1',
      date: '2026-06-22T08:00:00Z',
    },
    {
      id: 'sess3',
      slotNumber: 3,
      title: 'Responsible AI Usage in Architecture Design',
      classId: 'c1',
      date: '2026-06-25T08:00:00Z',
    }
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Literature Review Draft on Architecture Patterns',
      description: 'Submit your literature review draft. You must declare any AI usage.',
      classId: 'c1',
      sessionId: 'sess3',
      maxScore: 10,
      weight: 20,
      aiDeclarationRequired: true,
      minAiInteractions: 5,
      maxAiInteractions: 10,
      dueDate: '2026-06-30T23:59:00Z',
      status: 'published',
    }
  ],
  news: [
    {
      id: 'n1',
      title: 'Welcome to Summer 2026 Semester',
      content: 'We are glad to have you back for the new semester.',
      author: 'Admin',
      createdAt: '2026-06-01T10:00:00Z',
    },
    {
      id: 'n2',
      title: 'Guidelines on Responsible AI Usage',
      content: 'Please ensure you read the new guidelines on using GenAI for your assignments.',
      author: 'Subject Head',
      createdAt: '2026-06-10T14:30:00Z',
    }
  ],
  submissions: [],
  aiInteractions: [],
  grades: [],
};
