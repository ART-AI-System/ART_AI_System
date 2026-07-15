import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/layout/StudentSidebar';
import StudentTopbar from '../components/layout/StudentTopbar';

const StudentLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden text-gray-800 bg-[#F4F7FE] font-inter">
      <StudentSidebar 
        sidebarCollapsed={sidebarCollapsed} 
        mobileSidebarOpen={mobileSidebarOpen} 
        setSidebarCollapsed={setSidebarCollapsed} 
        setMobileSidebarOpen={setMobileSidebarOpen} 
      />

      <main className={`flex-1 flex flex-col h-screen relative transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'}`}>
        <StudentTopbar setMobileSidebarOpen={setMobileSidebarOpen} />

        {/* Main Content Area */}
        <div className="p-8 overflow-y-auto flex-1" style={{ scrollbarWidth: 'none' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
