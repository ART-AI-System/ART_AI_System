import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/layout/StudentSidebar';
import LecturerSidebar from '../components/layout/LecturerSidebar';
import Header from '../components/layout/Header';
import LecturerHeader from '../components/layout/LecturerHeader';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="h-screen flex overflow-hidden bg-[#F4F7FE] text-gray-800">
      {user?.role === 'LECTURER' ? <LecturerSidebar /> : <StudentSidebar />}
      <main className="flex-1 lg:ml-[280px] flex flex-col h-screen relative">
        {user?.role === 'LECTURER' ? <LecturerHeader /> : <Header />}
        <div className={`${user?.role === 'LECTURER' ? '' : 'p-4 md:p-6 lg:p-8'} overflow-y-auto flex-1 hide-scrollbar relative`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
