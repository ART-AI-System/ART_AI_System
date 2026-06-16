import { Clock, Calendar, HelpCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';

const MySubmissionsPage = () => {
  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">My Assignments</h1>
          <p className="text-gray-500 font-medium mt-1">Track your upcoming deadlines and past submissions</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button className="px-4 py-2 bg-[#4318FF] text-white rounded-lg text-sm font-bold shadow-sm">Upcoming</button>
          <button className="px-4 py-2 text-gray-500 hover:text-[#1B2559] hover:bg-gray-50 rounded-lg text-sm font-bold transition-colors">Past Due</button>
          <button className="px-4 py-2 text-gray-500 hover:text-[#1B2559] hover:bg-gray-50 rounded-lg text-sm font-bold transition-colors">Completed</button>
        </div>
      </div>

      {/* Subject Filter */}
      <div className="mb-6">
        <select className="bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#4318FF] shadow-sm w-full max-w-xs">
          <option value="all">All Subjects</option>
          <option value="SWD392">SWD392 - Software Architecture</option>
          <option value="PRM392">PRM392 - Mobile Programming</option>
          <option value="SWT301">SWT301 - Software Testing</option>
        </select>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        
        {/* Active/Urgent Assignment */}
        <Card className="border-orange-200 flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
          
          <div className="flex-1 flex flex-col md:flex-row md:items-center ml-2">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-lg mr-6 mb-4 md:mb-0 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">SWD392</span>
                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">Due in 2 days</span>
              </div>
              <h3 className="text-lg font-bold text-[#1B2559]">Software Architecture Diagram Proposal</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Design the C4 Model diagram for the e-commerce system module. AI declaration required.</p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-start md:items-end shrink-0">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Not Submitted</p>
            <Link to={ROUTES.SUBMISSION_DETAIL.replace(':id', '1')} className="px-6 py-2.5 bg-gradient-to-br from-[#F26F21] to-[#F79C65] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:opacity-90 transition-opacity flex items-center">
              Start Assignment <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </Card>

        {/* Upcoming Assignment */}
        <Card className="flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-400"></div>
          
          <div className="flex-1 flex flex-col md:flex-row md:items-center ml-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-lg mr-6 mb-4 md:mb-0 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">PRM392</span>
                <span className="text-xs font-bold text-gray-500">Due: 20 Jun 2026</span>
              </div>
              <h3 className="text-lg font-bold text-[#1B2559]">React Native UI Mockup</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Implement the Home Screen UI using React Native CLI.</p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-start md:items-end shrink-0">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Not Submitted</p>
            <Link to={ROUTES.SUBMISSION_DETAIL.replace(':id', 'new')} className="px-6 py-2.5 bg-[#4318FF] text-white rounded-xl text-sm font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center">
              Start Assignment <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </Card>

        {/* Upcoming Assignment (Quiz) */}
        <Card className="flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-400"></div>
          
          <div className="flex-1 flex flex-col md:flex-row md:items-center ml-2">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center font-bold text-lg mr-6 mb-4 md:mb-0 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">SWT301</span>
                <span className="text-xs font-bold text-gray-500">Due: 22 Jun 2026</span>
              </div>
              <h3 className="text-lg font-bold text-[#1B2559]">Quiz 2: Whitebox Testing</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Multiple choice quiz on EduNext platform. 30 Minutes.</p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-start md:items-end shrink-0">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Pending</p>
            <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors flex items-center">
              Go to EduNext <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default MySubmissionsPage;
