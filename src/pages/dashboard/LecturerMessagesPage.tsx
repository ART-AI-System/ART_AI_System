
import { Search, Edit, CheckCheck, Check, Paperclip, Image as ImageIcon, Send, MoreVertical, FileText, Download } from 'lucide-react';


const LecturerMessagesPage = () => {


  return (
    <div className="flex-1 flex overflow-hidden p-6 gap-6 h-[calc(100vh-6rem)]">
      {/* CHAT LIST (LEFT COLUMN) */}
      <div className="w-80 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0">
        {/* Search & New Message */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#1B2559]">Chats</h2>
            <button className="w-8 h-8 rounded-full bg-blue-50 text-[#4318FF] hover:bg-[#4318FF] hover:text-white flex items-center justify-center transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search messages..." className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#4318FF]/20 focus:outline-none placeholder-gray-400 text-[#1B2559]" />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* Chat Item (Active) */}
          <div className="px-6 py-4 border-b border-gray-50 cursor-pointer bg-blue-50/50 hover:bg-blue-50/80 transition-colors flex items-center relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4318FF]"></div>
            <div className="relative mr-4">
              <img src="https://ui-avatars.com/api/?name=Viet+Khoa&background=F26F21&color=fff" className="w-12 h-12 rounded-full border border-gray-200" alt="Avatar" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-[#1B2559] truncate">Nguyen Viet Khoa</h3>
                <span className="text-[10px] font-bold text-[#4318FF]">10:42 AM</span>
              </div>
              <p className="text-xs text-[#4318FF] font-medium truncate">Thầy cho em hỏi về tiêu chí chấm điểm Assignment 1 ạ.</p>
            </div>
          </div>

          {/* Chat Item (Unread) */}
          <div className="px-6 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex items-center">
            <div className="relative mr-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">SE</div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-[#1B2559] truncate">SE20A09 - Class Group</h3>
                <span className="text-[10px] font-bold text-gray-400">Yesterday</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-[#1B2559] font-medium truncate">Tuan Anh: Dạ em nộp bài trễ 5 phút có bị trừ điểm không ạ?</p>
                <span className="w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center text-[9px] font-bold ml-2">2</span>
              </div>
            </div>
          </div>

          {/* Chat Item (Read) */}
          <div className="px-6 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex items-center">
            <div className="relative mr-4">
              <img src="https://ui-avatars.com/api/?name=Head+Dept&background=1B2559&color=fff" className="w-12 h-12 rounded-full border border-gray-200" alt="Avatar" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-gray-700 truncate">Hoang Thi X (HOS)</h3>
                <span className="text-[10px] font-bold text-gray-400">Monday</span>
              </div>
              <p className="text-xs text-gray-500 font-medium truncate">Đã nhận được bảng điểm lớp SE20A09. Cảm ơn thầy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT DETAIL (RIGHT COLUMN) */}
      <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center">
            <div className="relative mr-4">
              <img src="https://ui-avatars.com/api/?name=Viet+Khoa&background=F26F21&color=fff" className="w-10 h-10 rounded-full border border-gray-200" alt="Avatar" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1B2559]">Nguyen Viet Khoa</h2>
              <p className="text-xs font-medium text-green-500">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="w-9 h-9 rounded-full hover:bg-gray-50 text-gray-400 hover:text-[#1B2559] flex items-center justify-center transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-gray-50 text-gray-400 hover:text-[#1B2559] flex items-center justify-center transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
          {/* Date Divider */}
          <div className="flex justify-center">
            <span className="bg-white border border-gray-100 px-4 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-wider shadow-sm">Today</span>
          </div>

          {/* Message from other */}
          <div className="flex max-w-[70%]">
            <img src="https://ui-avatars.com/api/?name=Viet+Khoa&background=F26F21&color=fff" className="w-8 h-8 rounded-full mr-3 self-end shadow-sm" alt="Avatar" />
            <div>
              <div className="bg-white border border-gray-100 text-[#1B2559] px-5 py-3.5 rounded-[20px] rounded-bl-sm shadow-sm text-sm leading-relaxed">
                Em chào thầy ạ. Thầy cho em hỏi xíu về bài Assignment 1 sắp tới, phần tiêu chí chấm điểm có yêu cầu gì đặc biệt về Database Optimization không thầy?
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1 ml-1 block">10:40 AM</span>
            </div>
          </div>

          {/* Message from other */}
          <div className="flex max-w-[70%]">
            <img src="https://ui-avatars.com/api/?name=Viet+Khoa&background=F26F21&color=fff" className="w-8 h-8 rounded-full mr-3 self-end shadow-sm opacity-0" alt="Avatar" />
            <div>
              <div className="bg-white border border-gray-100 text-[#1B2559] px-5 py-3.5 rounded-[20px] rounded-bl-sm shadow-sm text-sm leading-relaxed">
                Thầy cho em xin cái Rubric chuẩn để bọn em bám theo với ạ.
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1 ml-1 block">10:42 AM</span>
            </div>
          </div>

          {/* Message from me */}
          <div className="flex justify-end max-w-[70%] ml-auto">
            <div className="flex flex-col items-end">
              <div className="bg-[#4318FF] text-white px-5 py-3.5 rounded-[20px] rounded-br-sm shadow-md shadow-blue-500/20 text-sm leading-relaxed">
                Chào em, phần Database Optimization chiếm 15% tổng điểm nhé. Rubric chi tiết thầy đã attach vào file thông báo trên trang lớp, em có thể tải về xem lại.
              </div>
              <div className="flex items-center mt-1 mr-1">
                <span className="text-[10px] font-bold text-gray-400 mr-1.5">10:45 AM</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>
          </div>

          {/* File attachment from me */}
          <div className="flex justify-end max-w-[70%] ml-auto">
            <div className="flex flex-col items-end">
              <div className="bg-[#4318FF] text-white p-3 rounded-[20px] rounded-br-sm shadow-md shadow-blue-500/20 flex items-center space-x-3 cursor-pointer hover:bg-[#3311CC] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="pr-4">
                  <p className="text-sm font-bold text-white">Assignment1_Rubric.pdf</p>
                  <p className="text-xs text-blue-200">2.4 MB</p>
                </div>
                <Download className="w-4 h-4 text-blue-200 mr-2" />
              </div>
              <div className="flex items-center mt-1 mr-1">
                <span className="text-[10px] font-bold text-gray-400 mr-1.5">10:46 AM</span>
                <Check className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-5 border-t border-gray-100 bg-white">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full pr-2 pl-4 py-2 focus-within:ring-2 focus-within:ring-[#4318FF]/20 focus-within:border-[#4318FF] transition-all">
            <button className="p-2 text-gray-400 hover:text-[#F26F21] transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-[#F26F21] transition-colors mr-2">
              <ImageIcon className="w-5 h-5" />
            </button>
            
            <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[#1B2559] placeholder-gray-400" />
            
            <button className="w-10 h-10 rounded-full bg-[#4318FF] text-white flex items-center justify-center shadow-md shadow-blue-500/30 hover:bg-[#3311CC] hover:scale-105 transition-all ml-2">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerMessagesPage;
