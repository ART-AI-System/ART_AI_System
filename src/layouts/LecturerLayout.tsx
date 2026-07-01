import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LecturerSidebar from '../components/layout/LecturerSidebar';
import LecturerTopbar from '../components/layout/LecturerTopbar';

const LecturerLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Basic breadcrumb generation based on route for demo purposes
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    if (paths.includes('grading')) {
      return ['Grading', 'PRJ301 (SE20A09)', 'Practical Exam 1'];
    }
    return ['Dashboard'];
  };

  const getTitle = () => {
    if (location.pathname.includes('grading')) {
      return 'Submissions: Practical Exam';
    }
    return 'Lecturer Dashboard';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FE] font-inter">
      <LecturerSidebar 
        sidebarCollapsed={sidebarCollapsed} 
        mobileSidebarOpen={mobileSidebarOpen} 
        setMobileSidebarOpen={setMobileSidebarOpen} 
      />

      <main className={`flex-1 flex flex-col h-screen relative transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'}`}>
        <LecturerTopbar 
          setMobileSidebarOpen={setMobileSidebarOpen} 
          breadcrumbs={generateBreadcrumbs()}
          title={getTitle()}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-10 scroll-smooth bg-gray-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default LecturerLayout;
