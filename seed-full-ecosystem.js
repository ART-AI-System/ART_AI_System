const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config();

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function hashPassword(password) {
  const secret = process.env.PASSWORD_SECRET || '@ART_AI_System@';
  return sha256(password + secret);
}

async function seedFullEcosystem() {
  console.log('--- STARTING FULL ECOSYSTEM SEEDING ---');
  const uri = process.env.MONGODB_URI || 
    `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME || 'admin')}:${encodeURIComponent(process.env.DB_PASSWORD || 'admin')}@art-ai-system.rpdlfxc.mongodb.net/`;
  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = process.env.DB_NAME || 'art-ai-system-dev';
  const db = client.db(dbName);
  console.log(`Connected to MongoDB Atlas database: ${dbName}`);

  // Clear existing collections
  const collectionsToClear = [
    'users', 'semesters', 'subjects', 'classes', 'sessions', 
    'assignments', 'grade_items', 'submissions', 'ai_interactions', 
    'ai_evaluations', 'tests', 'test_attempts', 'notifications', 'final_results'
  ];
  for (const col of collectionsToClear) {
    await db.collection(col).deleteMany({});
  }
  console.log('Cleared existing data across 14 collections.');

  const passwordHash = hashPassword('Password@123');
  const now = new Date();

  // 1. SEED USERS
  console.log('Seeding Users (Admin, Subject Head, Lecturers, Students)...');
  const adminId = new ObjectId();
  const headSubjectId = new ObjectId();
  const lecturerIds = [new ObjectId(), new ObjectId(), new ObjectId()];
  const studentIds = [];
  for (let i = 1; i <= 15; i++) {
    studentIds.push(new ObjectId());
  }

  const users = [
    {
      _id: adminId,
      username: 'admin01',
      passwordHash,
      fullName: 'System Administrator',
      role: 'ADMIN',
      status: 'active',
      isActive: true,
      email: 'admin01@fpt.edu.vn',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      createdAt: now
    },
    {
      _id: headSubjectId,
      username: 'subjecthead01',
      passwordHash,
      fullName: 'Dr. Tran Van Head',
      role: 'SUBJECT_HEAD',
      status: 'active',
      isActive: true,
      email: 'subjecthead01@fpt.edu.vn',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      createdAt: now
    },
    {
      _id: lecturerIds[0],
      username: 'lecturer01',
      passwordHash,
      fullName: 'Lecturer Alan Smith',
      role: 'LECTURER',
      status: 'active',
      isActive: true,
      email: 'lecturer01@fpt.edu.vn',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      createdAt: now
    },
    {
      _id: lecturerIds[1],
      username: 'lecturer02',
      passwordHash,
      fullName: 'Lecturer Sarah Jenkins',
      role: 'LECTURER',
      status: 'active',
      isActive: true,
      email: 'lecturer02@fpt.edu.vn',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      createdAt: now
    },
    {
      _id: lecturerIds[2],
      username: 'lecturer03',
      passwordHash,
      fullName: 'Lecturer Michael Chang',
      role: 'LECTURER',
      status: 'active',
      isActive: true,
      email: 'lecturer03@fpt.edu.vn',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      createdAt: now
    }
  ];

  const studentNames = [
    'Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E',
    'Vo Thi F', 'Dang Van G', 'Bui Thi H', 'Do Van I', 'Ngo Thi J',
    'Ly Van K', 'Vu Thi L', 'Truong Van M', 'Nguyen Thi N', 'Tran Van O',
    'Nguyen Van P', 'Tran Thi Q', 'Nguyen Van DE181818'
  ];

  for (let i = 0; i < 18; i++) {
    const codeNum = 181801 + i;
    const code = `DE${codeNum}`;
    users.push({
      _id: studentIds[i],
      studentCode: code,
      username: code,
      passwordHash,
      fullName: studentNames[i],
      role: 'STUDENT',
      status: 'active',
      isActive: true,
      email: `${code}@fpt.edu.vn`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${code}`,
      createdAt: now
    });
  }
  await db.collection('users').insertMany(users);
  console.log(`Inserted ${users.length} users.`);

  // 2. SEED SEMESTERS & SUBJECTS
  console.log('Seeding Semesters, Departments and Subjects...');
  const semesterIds = [new ObjectId(), new ObjectId()];
  const semesters = [
    {
      _id: semesterIds[0],
      code: 'HK1-2024',
      name: 'Fall 2024',
      year: 2024,
      term: 'Fall',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
      isCurrent: true,
      isActive: true,
      createdAt: now
    },
    {
      _id: semesterIds[1],
      code: 'HK2-2024',
      name: 'Spring 2025',
      year: 2025,
      term: 'Spring',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-04-30'),
      status: 'ACTIVE',
      isCurrent: false,
      isActive: true,
      createdAt: now
    }
  ];
  await db.collection('semesters').insertMany(semesters);

  const deptIds = [new ObjectId()];
  const departments = [
    {
      _id: deptIds[0],
      code: 'SE',
      name: 'Software Engineering',
      subjectHeadId: headSubjectId,
      isActive: true,
      createdAt: now
    }
  ];
  await db.collection('departments').insertMany(departments);

  const subjectIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
  const subjects = [
    {
      _id: subjectIds[0],
      code: 'SWD392',
      name: 'Software Architecture and Design',
      department: 'Software Engineering',
      departmentId: deptIds[0],
      credits: 3,
      description: 'Design patterns, system architecture, and clean code principles.',
      status: 'ACTIVE',
      isActive: true,
      headSubjectId: headSubjectId,
      createdAt: now
    },
    {
      _id: subjectIds[1],
      code: 'PRJ301',
      name: 'Java Web Application Development',
      department: 'Software Engineering',
      departmentId: deptIds[0],
      credits: 3,
      description: 'Servlets, JSP, Spring Boot and MVC architecture.',
      status: 'ACTIVE',
      isActive: true,
      headSubjectId: headSubjectId,
      createdAt: now
    },
    {
      _id: subjectIds[2],
      code: 'SWR302',
      name: 'Software Requirement Engineering',
      department: 'Software Engineering',
      departmentId: deptIds[0],
      credits: 3,
      description: 'Agile requirement analysis, user stories, and use case modeling.',
      status: 'ACTIVE',
      isActive: true,
      headSubjectId: headSubjectId,
      createdAt: now
    },
    {
      _id: subjectIds[3],
      code: 'SDN301',
      name: 'Fullstack Web Development with Node & React',
      department: 'Software Engineering',
      departmentId: deptIds[0],
      credits: 3,
      description: 'Modern fullstack web applications using MERN stack.',
      status: 'ACTIVE',
      isActive: true,
      headSubjectId: headSubjectId,
      createdAt: now
    }
  ];
  await db.collection('subjects').insertMany(subjects);

  // 3. SEED CLASSES & CLASS MEMBERS
  console.log('Seeding Classes & Class Members...');
  const classIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
  const classes = [
    {
      _id: classIds[0],
      classCode: 'SE18D01',
      courseCode: 'SWD392',
      subjectId: subjectIds[0],
      subjectSnapshot: { subjectId: subjectIds[0], code: 'SWD392', name: 'Software Architecture and Design' },
      semesterId: semesterIds[0],
      lecturerId: lecturerIds[0],
      lecturer: { lecturerId: lecturerIds[0], fullName: 'Lecturer 01' },
      studentIds: studentIds.slice(0, 10),
      students: studentIds.slice(0, 10).map((id, idx) => ({ studentId: id, studentCode: `DE1818${idx+1 < 10 ? '0'+(idx+1) : idx+1}`, fullName: `Student ${idx+1}` })),
      room: 'BE-301',
      status: 'ACTIVE',
      isActive: true,
      createdAt: now
    },
    {
      _id: classIds[1],
      classCode: 'SE18D02',
      courseCode: 'PRJ301',
      subjectId: subjectIds[1],
      subjectSnapshot: { subjectId: subjectIds[1], code: 'PRJ301', name: 'Java Web Application Development' },
      semesterId: semesterIds[0],
      lecturerId: lecturerIds[0],
      lecturer: { lecturerId: lecturerIds[0], fullName: 'Lecturer 01' },
      studentIds: studentIds.slice(0, 12),
      students: studentIds.slice(0, 12).map((id, idx) => ({ studentId: id, studentCode: `DE1818${idx+1 < 10 ? '0'+(idx+1) : idx+1}`, fullName: `Student ${idx+1}` })),
      room: 'BE-302',
      status: 'ACTIVE',
      isActive: true,
      createdAt: now
    },
    {
      _id: classIds[2],
      classCode: 'SE18D03',
      courseCode: 'SWR302',
      subjectId: subjectIds[2],
      subjectSnapshot: { subjectId: subjectIds[2], code: 'SWR302', name: 'Software Requirement Engineering' },
      semesterId: semesterIds[0],
      lecturerId: lecturerIds[1],
      lecturer: { lecturerId: lecturerIds[1], fullName: 'Dr. John Lecturer' },
      studentIds: studentIds.slice(5, 15),
      students: studentIds.slice(5, 15).map((id, idx) => ({ studentId: id, studentCode: `DE1818${idx+6 < 10 ? '0'+(idx+6) : idx+6}`, fullName: `Student ${idx+6}` })),
      room: 'BE-401',
      status: 'ACTIVE',
      isActive: true,
      createdAt: now
    },
    {
      _id: classIds[3],
      classCode: 'SE18D04',
      courseCode: 'SDN301',
      subjectId: subjectIds[3],
      subjectSnapshot: { subjectId: subjectIds[3], code: 'SDN301', name: 'Fullstack Web Development with Node & React' },
      semesterId: semesterIds[1],
      lecturerId: lecturerIds[2],
      lecturer: { lecturerId: lecturerIds[2], fullName: 'Lecturer Three' },
      studentIds: studentIds,
      students: studentIds.map((id, idx) => ({ studentId: id, studentCode: `DE1818${idx+1 < 10 ? '0'+(idx+1) : idx+1}`, fullName: `Student ${idx+1}` })),
      room: 'BE-405',
      status: 'ACTIVE',
      isActive: true,
      createdAt: now
    }
  ];
  await db.collection('classes').insertMany(classes);

  const classMembers = [];
  classes.forEach(c => {
    c.studentIds.forEach(sId => {
      classMembers.push({
        _id: new ObjectId(),
        classId: c._id,
        studentId: sId,
        semesterId: c.semesterId,
        status: 'active',
        createdAt: now
      });
    });
  });
  await db.collection('class_members').insertMany(classMembers);

  // 4. SEED SESSIONS, ASSIGNMENTS & GRADE ITEMS
  console.log('Seeding Assignments and Grade Items...');
  const sessionIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
  const assignmentIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
  const gradeItemIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];

  const sessions = [
    { _id: sessionIds[0], classId: classIds[0], sessionNumber: 1, title: 'Architecture Patterns' },
    { _id: sessionIds[1], classId: classIds[1], sessionNumber: 1, title: 'Spring Boot Basics' },
    { _id: sessionIds[2], classId: classIds[2], sessionNumber: 1, title: 'User Stories' },
    { _id: sessionIds[3], classId: classIds[3], sessionNumber: 1, title: 'React Hooks' }
  ];
  await db.collection('sessions').insertMany(sessions);

  const assignments = [
    {
      _id: assignmentIds[0],
      sessionId: sessionIds[0],
      classId: classIds[0],
      title: 'Assignment 1: Microservices Design',
      description: 'Design a microservices architecture for an e-commerce platform.',
      dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000),
      status: 'PUBLISHED',
      maxScore: 10,
      weight: 20,
      createdAt: now
    },
    {
      _id: assignmentIds[1],
      sessionId: sessionIds[1],
      classId: classIds[1],
      title: 'PE 1: REST API with Spring Boot',
      description: 'Build a CRUD REST API for student management.',
      dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000),
      status: 'PUBLISHED',
      maxScore: 10,
      weight: 30,
      createdAt: now
    },
    {
      _id: assignmentIds[2],
      sessionId: sessionIds[2],
      classId: classIds[2],
      title: 'Lab 2: SRS Document Drafting',
      description: 'Write functional requirements and user stories for a library system.',
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      status: 'PUBLISHED',
      maxScore: 10,
      weight: 15,
      createdAt: now
    },
    {
      _id: assignmentIds[3],
      sessionId: sessionIds[3],
      classId: classIds[3],
      title: 'Final Project: E-Learning Portal',
      description: 'Develop a fullstack MERN application with authentication.',
      dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      status: 'PUBLISHED',
      maxScore: 10,
      weight: 35,
      createdAt: now
    }
  ];
  await db.collection('assignments').insertMany(assignments);

  const gradeItems = [
    { _id: gradeItemIds[0], classId: classIds[0], assignmentId: assignmentIds[0], name: 'Assignment 1: Microservices Design', weight: 20, maxScore: 10, type: 'ASSIGNMENT' },
    { _id: gradeItemIds[1], classId: classIds[1], assignmentId: assignmentIds[1], name: 'PE 1: REST API with Spring Boot', weight: 30, maxScore: 10, type: 'PE' },
    { _id: gradeItemIds[2], classId: classIds[2], assignmentId: assignmentIds[2], name: 'Lab 2: SRS Document Drafting', weight: 15, maxScore: 10, type: 'ASSIGNMENT' },
    { _id: gradeItemIds[3], classId: classIds[3], assignmentId: assignmentIds[3], name: 'Final Project: E-Learning Portal', weight: 35, maxScore: 10, type: 'FE' }
  ];
  await db.collection('grade_items').insertMany(gradeItems);

  // 5. SEED SUBMISSIONS, AI DECLARATIONS & AI EVALUATIONS
  console.log('Seeding Submissions, AI Declarations and AI Evaluations...');
  const submissions = [];
  const aiInteractions = [];
  const aiEvaluations = [];

  // Create submissions for first 8 students in class 0 (SWD392)
  for (let i = 0; i < 8; i++) {
    const subId = new ObjectId();
    const stId = studentIds[i];
    const isSuspicious = (i >= 5); // Students 5, 6, 7 will be suspicious cases!
    const aiMatch = isSuspicious ? (85 + Math.floor(Math.random() * 12)) : (10 + Math.floor(Math.random() * 25));
    const declaredAI = isSuspicious ? 10 : aiMatch;

    submissions.push({
      _id: subId,
      uuid: `sub-swd392-st${i + 1}`,
      studentId: stId,
      gradeItemId: gradeItemIds[0],
      classId: classIds[0],
      assignmentId: assignmentIds[0],
      fileName: `SWD392_Assignment1_${studentNames[i].replace(/\s+/g, '')}.zip`,
      fileUrl: `https://storage.art-ai-system.com/submissions/swd392_st${i+1}.zip`,
      submittedAt: new Date(Date.now() - (8 - i) * 3600 * 1000),
      status: i < 3 ? 'GRADED' : 'PENDING',
      isLatest: true
    });

    aiInteractions.push({
      _id: new ObjectId(),
      submissionId: subId,
      studentId: stId,
      declaredPercentage: declaredAI,
      declarations: [
        {
          step: 'IDEA',
          aiTools: ['ChatGPT 4o'],
          purpose: 'Brainstorming microservice boundaries',
          prompt: 'How should I split user and order services in e-commerce?',
          outputSummary: 'Suggested domain-driven design bounded contexts.'
        },
        {
          step: 'CODING',
          aiTools: ['GitHub Copilot'],
          purpose: 'Boilerplate DTO creation',
          prompt: 'Generate TS interfaces for Order and User entity',
          outputSummary: 'Generated standard interfaces with validation tags.'
        }
      ],
      createdAt: now
    });

    aiEvaluations.push({
      _id: new ObjectId(),
      submissionId: subId,
      studentId: stId,
      aiMatchPercentage: aiMatch,
      status: 'COMPLETED',
      discrepancies: isSuspicious 
        ? `HIGH DISCREPANCY: Student declared only ${declaredAI}% AI usage, but AI analysis detected ${aiMatch}% synthetic code patterns.` 
        : `Normal correlation: Declared ${declaredAI}% matches analysis ${aiMatch}%.`,
      flagStatus: isSuspicious ? 'FLAGGED' : 'NORMAL',
      analyzedAt: now
    });
  }
  await db.collection('submissions').insertMany(submissions);
  await db.collection('ai_interactions').insertMany(aiInteractions);
  await db.collection('ai_evaluations').insertMany(aiEvaluations);

  // 6. SEED ONLINE TESTS & ATTEMPTS
  console.log('Seeding Online Tests & Attempts...');
  const testId = new ObjectId();
  const test = {
    _id: testId,
    classId: classIds[1],
    title: 'Midterm Quiz: Java Web Fundamentals',
    description: '45-minute multiple choice test covering Servlets and JSP.',
    durationMinutes: 45,
    maxScore: 10,
    status: 'PUBLISHED',
    questions: [
      {
        id: 1,
        text: 'Which annotation is used to declare a REST Controller in Spring Boot?',
        type: 'MULTIPLE_CHOICE',
        options: ['@Controller', '@RestController', '@Service', '@Component'],
        correctOption: 1,
        points: 5
      },
      {
        id: 2,
        text: 'What is the default HTTP method for a web browser navigating to a URL?',
        type: 'MULTIPLE_CHOICE',
        options: ['POST', 'GET', 'PUT', 'DELETE'],
        correctOption: 1,
        points: 5
      }
    ],
    createdAt: now
  };
  await db.collection('tests').insertOne(test);

  const attemptId = new ObjectId();
  await db.collection('test_attempts').insertOne({
    _id: attemptId,
    testId: testId,
    studentId: studentIds[0],
    classId: classIds[1],
    startedAt: new Date(Date.now() - 3600 * 1000),
    submittedAt: new Date(Date.now() - 1800 * 1000),
    score: 10,
    status: 'SUBMITTED',
    answers: [
      { questionId: 1, selectedOption: 1 },
      { questionId: 2, selectedOption: 1 }
    ]
  });

  // 7. SEED FINAL RESULTS & NOTIFICATIONS
  console.log('Seeding Final Results and Notifications...');
  const finalResults = [
    {
      _id: new ObjectId(),
      classId: classIds[0],
      studentId: studentIds[0],
      totalScore: 8.8,
      gpa: 3.5,
      letterGrade: 'A',
      status: 'PASSED',
      calculatedAt: now
    },
    {
      _id: new ObjectId(),
      classId: classIds[0],
      studentId: studentIds[1],
      totalScore: 7.5,
      gpa: 3.0,
      letterGrade: 'B',
      status: 'PASSED',
      calculatedAt: now
    }
  ];
  await db.collection('final_results').insertMany(finalResults);

  const notifications = [
    {
      _id: new ObjectId(),
      userId: studentIds[0],
      title: 'Assignment Published',
      content: 'Assignment 1: Microservices Design has been published in SWD392.',
      type: 'ANNOUNCEMENT',
      isRead: false,
      createdAt: now
    },
    {
      _id: new ObjectId(),
      userId: lecturerIds[0],
      title: 'High AI Usage Flagged',
      content: 'Student DE181806 submission in SWD392 showed 95% AI similarity.',
      type: 'ALERT',
      isRead: false,
      createdAt: now
    },
    {
      _id: new ObjectId(),
      userId: headSubjectId,
      title: '3 Suspicious Cases Pending',
      content: 'SWD392 has 3 submissions flagged for potential AI academic dishonesty.',
      type: 'ALERT',
      isRead: false,
      createdAt: now
    }
  ];
  await db.collection('notifications').insertMany(notifications);

  console.log('\n======================================================');
  console.log('   🎉 FULL ECOSYSTEM SEEDING COMPLETED SUCCESSFULLY   ');
  console.log('======================================================');
  console.log('Login Credentials (Password for all: Password@123):');
  console.log(`  - Admin:        admin01@fpt.edu.vn / admin01`);
  console.log(`  - Subject Head: subjecthead01@fpt.edu.vn / subjecthead01`);
  console.log(`  - Lecturer:     lecturer01@fpt.edu.vn / lecturer01`);
  console.log(`  - Student 18:   DE181818@fpt.edu.vn / DE181818`);
  console.log('======================================================\n');

  await client.close();
}

seedFullEcosystem().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
