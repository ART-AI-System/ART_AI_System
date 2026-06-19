
import { Search, Edit, Phone, Video, MoreVertical, CheckCheck, Paperclip, Smile, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentMessagesPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-hidden p-6 h-[calc(100vh-6rem)]">
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex h-full overflow-hidden">
        
        {/* Chat List (Left) */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-[#1B2559]">Messages</h2>
            <button className="w-8 h-8 rounded-full bg-blue-50 text-[#4318FF] flex items-center justify-center hover:bg-[#4318FF] hover:text-white transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search contacts..." className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#4318FF] focus:bg-white transition-colors" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {/* Active Chat */}
            <div className="flex items-center p-4 bg-blue-50/50 border-l-4 border-[#4318FF] cursor-pointer">
              <div className="relative">
                <img src="https://ui-avatars.com/api/?name=Dr.+Smith&background=EBF4FF&color=0072BC" className="w-12 h-12 rounded-full" alt="Avatar" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-sm font-bold text-[#1B2559]">Dr. Alan Smith</h4>
                  <span className="text-xs font-bold text-[#4318FF]">10:42 AM</span>
                </div>
                <p className="text-xs text-gray-600 font-medium truncate w-40">Yes, the architecture diagram is perfect.</p>
              </div>
            </div>

            {/* Unread Group Chat */}
            <div className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-transparent">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold text-lg">SE</div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-sm font-bold text-[#1B2559]">Class SE18D01</h4>
                  <span className="text-xs font-bold text-gray-400">Yesterday</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 font-medium truncate w-36"><span className="font-bold text-gray-700">Anna:</span> Did anyone finish Lab 2?</p>
                  <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                </div>
              </div>
            </div>

            {/* Read Chat */}
            <div className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-transparent">
              <div className="relative">
                <img src="https://ui-avatars.com/api/?name=Mike+Ross&background=FCE7F3&color=BE185D" className="w-12 h-12 rounded-full opacity-80" alt="Avatar" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-sm font-bold text-gray-600">Mike Ross</h4>
                  <span className="text-xs font-medium text-gray-400">Tuesday</span>
                </div>
                <p className="text-xs text-gray-400 font-medium truncate w-40">Thanks for sharing the notes!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window (Right) */}
        <div className="flex-1 flex flex-col bg-white relative">
          {/* Chat Header */}
          <div className="h-20 border-b border-gray-100 flex justify-between items-center px-6">
            <div className="flex items-center">
              <div className="relative">
                <img src="https://ui-avatars.com/api/?name=Dr.+Smith&background=EBF4FF&color=0072BC" className="w-10 h-10 rounded-full shadow-sm" alt="Avatar" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-[#1B2559]">Dr. Alan Smith</h3>
                <p className="text-xs font-medium text-green-500">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Phone className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Video className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar bg-gray-50/30">
            <div className="flex justify-center">
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span>
            </div>

            {/* Received Message */}
            <div className="flex items-end">
              <img src="https://ui-avatars.com/api/?name=Dr.+Smith&background=EBF4FF&color=0072BC" className="w-8 h-8 rounded-full mb-1" alt="Avatar" />
              <div className="ml-3 max-w-[70%]">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm">
                  <p className="text-sm font-medium text-gray-700">Hello Khoa, have you reviewed the requirements for Assignment 1?</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 ml-1 mt-1 block">10:30 AM</span>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex items-end justify-end">
              <div className="mr-3 max-w-[70%]">
                <div className="bg-[#4318FF] p-4 rounded-2xl rounded-br-none shadow-sm text-white">
                  <p className="text-sm font-medium">Yes professor! I have drawn the MVC architecture diagram as requested. Is it okay if I use React for the frontend component?</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 mr-1 mt-1 block text-right">
                  10:40 AM <CheckCheck className="w-3 h-3 inline text-blue-500" />
                </span>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=F26F21&color=fff`} className="w-8 h-8 rounded-full mb-1" alt="Avatar" />
            </div>

            {/* Received Message */}
            <div className="flex items-end">
              <img src="https://ui-avatars.com/api/?name=Dr.+Smith&background=EBF4FF&color=0072BC" className="w-8 h-8 rounded-full mb-1" alt="Avatar" />
              <div className="ml-3 max-w-[70%]">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm">
                  <p className="text-sm font-medium text-gray-700">Yes, the architecture diagram is perfect. React is fine. Just make sure to declare any AI tools you use in the submission form.</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 ml-1 mt-1 block">10:42 AM</span>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="h-20 border-t border-gray-100 flex items-center px-4 bg-white">
            <button className="p-2 text-gray-400 hover:text-[#4318FF] transition-colors"><Paperclip className="w-5 h-5" /></button>
            <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors mr-2"><Smile className="w-5 h-5" /></button>
            
            <input type="text" placeholder="Type your message..." className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4318FF] focus:bg-white transition-colors font-medium" />
            
            <button className="ml-4 w-10 h-10 rounded-xl bg-[#4318FF] text-white flex items-center justify-center shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMessagesPage;
