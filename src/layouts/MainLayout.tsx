import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const MainLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-[#F4F7FE] text-gray-800">
      <Sidebar />
      <main className="flex-1 ml-[280px] flex flex-col h-screen relative">
        <Header />
        <div className="p-8 overflow-y-auto flex-1 hide-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
