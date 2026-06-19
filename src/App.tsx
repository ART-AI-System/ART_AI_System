import { useState, useEffect } from 'react'
import './App.css'
import { login, getStudentHome, getClassSessions, getAssignmentDetail, getNews } from './mocks/cluster1'

function App() {
  const [loginMsg, setLoginMsg] = useState("");
  const [testResults, setTestResults] = useState<any>(null);

  const handleTestLogin = async () => {
    try {
      const res = await login('SE182345', 'Password@123');
      setLoginMsg(`✅ Đăng nhập thành công! User: ${res.data.user.fullName}`);
    } catch (err: any) {
      setLoginMsg(`❌ Lỗi Login: ${err.message || 'Sai thông tin'}`);
    }
  };

  const handleTestFailLogin = async () => {
    try {
      const res = await login('SE182345', 'WrongPassword');
      setLoginMsg(`✅ Đăng nhập thành công! User: ${res.data.user.fullName}`);
    } catch (err: any) {
      setLoginMsg(`❌ Lỗi Login: ${err.message} - ${err.errors?.[0]?.message}`);
    }
  };

  const handleFetchData = async () => {
    try {
      setTestResults("Đang tải dữ liệu...");
      const homeRes = await getStudentHome();
      const newsRes = await getNews();
      
      let sessionsRes = null;
      let assignmentRes = null;

      const firstClassId = homeRes.data.enrolledClasses[0]?.id;
      if (firstClassId) {
        sessionsRes = await getClassSessions(firstClassId);
      }

      // 'a1' là ID của Assignment trong mockDatabase
      assignmentRes = await getAssignmentDetail('a1');

      setTestResults({
        home: homeRes.data,
        news: newsRes.data,
        sessions: sessionsRes?.data,
        assignmentDetail: assignmentRes?.data
      });

    } catch (err: any) {
      setTestResults(`❌ Lỗi khi fetch data: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <h1>ART-AI System - Cluster 1 Test</h1>
      
      <div style={{ padding: '1rem', border: '1px solid #444', borderRadius: '8px', marginBottom: '1rem', background: '#222' }}>
        <h2>1. Test Authentication</h2>
        <button onClick={handleTestLogin} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>
          Test Login Đúng
        </button>
        <button onClick={handleTestFailLogin} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Test Login Sai
        </button>
        <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{loginMsg}</p>
      </div>

      <div style={{ padding: '1rem', border: '1px solid #444', borderRadius: '8px', background: '#222' }}>
        <h2>2. Test API Fetch (Academic, Session, Assignment, News)</h2>
        <button onClick={handleFetchData} style={{ padding: '8px 16px', cursor: 'pointer', marginBottom: '1rem' }}>
          Tải toàn bộ dữ liệu Cụm 1
        </button>
        
        {testResults && (
          <div style={{ background: '#111', padding: '1rem', borderRadius: '4px', overflowX: 'auto' }}>
            <pre style={{ fontSize: '14px', margin: 0 }}>
              {typeof testResults === 'string' ? testResults : JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
