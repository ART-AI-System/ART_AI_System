import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/layout/StudentSidebar';
import LecturerSidebar from '../components/layout/LecturerSidebar';
import AdminSidebar from '../components/layout/AdminSidebar';
import Header from '../components/layout/Header';
import LecturerHeader from '../components/layout/LecturerHeader';
import AdminHeader from '../components/layout/AdminHeader';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  
  if (user?.role === 'ADMIN') {
    return (
      <div className="flex h-screen overflow-hidden bg-[#F4F7FE]">
        <AdminSidebar />
        <main className="flex-1 lg:ml-[280px] flex flex-col h-full overflow-hidden relative">
          <AdminHeader />
          <div className="flex-1 overflow-y-auto p-10">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }
  
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
