import { Users, FileCheck2, AlertTriangle, BrainCircuit, AlertCircle, FileEdit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const LecturerDashboardPage = () => {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#4318FF] mr-4">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Total Students</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">124</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#F26F21] mr-4">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Pending Grading</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">12</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">AI Discrepancies</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">3</h3>
          </div>
        </div>

        <div className="bg-[#1B2559] p-6 rounded-[24px] shadow-lg shadow-blue-900/20 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <BrainCircuit className="w-32 h-32 text-white" />
          </div>
          <p className="text-sm font-bold text-blue-200 relative z-10">System Status</p>
          <div className="flex items-center mt-1 relative z-10">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
            <span className="text-white font-bold">All Services Online</span>
          </div>
        </div>
      </div>

      {/* Classes and Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Classes List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#1B2559]">My Classes</h2>
            <Link to={ROUTES.CLASSES} className="text-sm font-bold text-[#F26F21] hover:underline">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class Card 1 */}
            <Link to={ROUTES.CLASS_DETAIL.replace(':id', '1')} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group block">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F26F21] flex items-center justify-center font-bold">PRJ</div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
              </div>
              <h3 className="text-lg font-bold text-[#1B2559] group-hover:text-[#F26F21] transition-colors">Java Web Application</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">PRJ301 • Class SE20A09</p>
              <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                <span className="text-gray-500 font-medium">35 Students</span>
                <span className="text-[#4318FF] font-bold">1 Assignment Due</span>
              </div>
            </Link>

            {/* Class Card 2 */}
            <Link to={ROUTES.CLASS_DETAIL.replace(':id', '2')} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group block">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4318FF] flex items-center justify-center font-bold">SWT</div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
              </div>
              <h3 className="text-lg font-bold text-[#1B2559] group-hover:text-[#4318FF] transition-colors">Software Testing</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">SWT301 • Class SE20A10</p>
              <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                <span className="text-gray-500 font-medium">32 Students</span>
                <span className="text-gray-400 font-bold">No pending tasks</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-[#1B2559]">Needs Attention</h2>
          
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-4">
            {/* Action Item */}
            <div className="flex items-start pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-3 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B2559]">High AI Discrepancy</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Student Nguyen Van Duc (PRJ301) submitted code with 95% AI detection vs 10% declared.
                </p>
                <Link to={ROUTES.GRADING_DETAIL.replace(':submissionId', '1')} className="inline-block mt-2 text-xs font-bold text-[#F26F21] hover:underline">
                  Review Submission
                </Link>
              </div>
            </div>

            {/* Action Item */}
            <div className="flex items-start pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#F26F21] mr-3 shrink-0">
                <FileEdit className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B2559]">Grade Practical Exam</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  12 ungraded submissions for PRJ301 Practical Exam.
                </p>
                <Link to={ROUTES.CLASS_GRADING.replace(':classId', 'PRJ301')} className="inline-block mt-2 text-xs font-bold text-[#F26F21] hover:underline">
                  Go to Grading
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboardPage;
