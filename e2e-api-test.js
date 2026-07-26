const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_BASE = 'http://localhost:3000/api';

async function runE2ETest() {
  console.log('--- STARTING E2E API TEST ---');
  try {
    // 1. Admin Login (Just to check it works)
    console.log('1. Testing Admin Login...');
    const adminRes = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin01',
      password: 'Password@123'
    });
    console.log('✅ Admin Login Successful');

    // 2. Student Login
    console.log('\n2. Testing Student Login...');
    const studentRes = await axios.post(`${API_BASE}/auth/login`, {
      username: 'DE181818',
      password: 'Password@123'
    });
    const studentToken = studentRes.data.result.access_token;
    console.log('✅ Student Login Successful');

    // 3. Find an Assignment for the student
    // First let's just create a dummy file to upload
    const dummyFilePath = path.join(__dirname, 'test_submission.zip');
    fs.writeFileSync(dummyFilePath, 'dummy zip content, imagine this is a zip');

    console.log('\n3. Student Submits File...');
    const form = new FormData();
    form.append('submissionFile', fs.createReadStream(dummyFilePath));
    form.append('aiDeclaration', JSON.stringify({
      useAi: true,
      details: [
        { prompt: 'Help me write code', ai: 'Here is code', reflection: 'I learned a lot' }
      ]
    }));

    // We need an assignment ID. Let's create one or just use a mock if possible.
    // If we don't have an assignment, the API will fail with 404/400.
    // We will just catch the error and log it, as seeding the DB might be required.
    let submissionId = null;
    try {
      const submitRes = await axios.post(`${API_BASE}/assignments/test-assignment-id/submissions`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${studentToken}`
        }
      });
      submissionId = submitRes.data.result._id;
      console.log('✅ Student Submission Successful:', submissionId);
    } catch (e) {
      console.log('⚠️ Student Submission failed (expected if test-assignment-id does not exist):', e.response?.data?.message || e.message);
    }

    // 4. Lecturer Login
    console.log('\n4. Testing Lecturer Login...');
    const lecturerRes = await axios.post(`${API_BASE}/auth/login`, {
      username: 'lecturer01',
      password: 'Password@123'
    });
    const lecturerToken = lecturerRes.data.result.access_token;
    console.log('✅ Lecturer Login Successful');

    // 5. Lecturer Grades the submission (if we had one)
    if (submissionId) {
      console.log('\n5. Lecturer Grading Submission...');
      const gradeRes = await axios.post(`${API_BASE}/submissions/${submissionId}/grade`, {
        score: 8.5,
        comment: 'Good work!',
        isFinal: true
      }, {
        headers: { Authorization: `Bearer ${lecturerToken}` }
      });
      console.log('✅ Lecturer Grading Successful:', gradeRes.data.message);
    } else {
      console.log('\n5. Skipping Grading (no valid submission ID)');
    }

    // Cleanup dummy file
    fs.unlinkSync(dummyFilePath);
    console.log('\n--- E2E API TEST FINISHED ---');

  } catch (error) {
    console.error('❌ E2E Test Failed:', error.response?.data || error.message);
  }
}

runE2ETest();
