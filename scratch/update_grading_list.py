import re

def update_grading_list():
    with open('mockups/lecturer/lecturer_grading_list.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Create the Subject -> Class -> Student list split pane layout
    # and change the table to Student Cards.
    
    new_content = '''
        <!-- DASHBOARD CONTENT with Split Layout -->
        <div class="flex-1 flex overflow-hidden bg-gray-50/50">
            
            <!-- LEFT PANEL: Navigation (Subject -> Class -> Assignment) -->
            <div class="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
                <div class="p-4 border-b border-gray-100">
                    <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Select Context</h3>
                    
                    <!-- Subject Selector -->
                    <div class="mb-3">
                        <label class="text-xs font-bold text-gray-500 mb-1 block">Subject</label>
                        <select class="w-full bg-gray-50 border border-gray-200 text-[#1B2559] text-sm font-bold rounded-lg px-3 py-2 outline-none">
                            <option>PRJ301 - Java Web</option>
                            <option>SWD392 - Software Arch</option>
                        </select>
                    </div>
                    
                    <!-- Class Selector -->
                    <div>
                        <label class="text-xs font-bold text-gray-500 mb-1 block">Class</label>
                        <select class="w-full bg-gray-50 border border-gray-200 text-[#1B2559] text-sm font-bold rounded-lg px-3 py-2 outline-none">
                            <option>SE18D01 (30 students)</option>
                            <option>SE18D02 (28 students)</option>
                        </select>
                    </div>
                </div>
                
                <div class="flex-1 overflow-y-auto p-4 hide-scrollbar">
                    <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Assignments</h4>
                    
                    <div class="space-y-2">
                        <!-- Assignment 1 -->
                        <div class="bg-blue-50 border border-[#4318FF] rounded-xl p-3 cursor-pointer">
                            <div class="flex justify-between items-start mb-1">
                                <h5 class="text-sm font-bold text-[#4318FF]">Practical Exam 1</h5>
                                <span class="text-[10px] font-bold bg-[#4318FF] text-white px-1.5 py-0.5 rounded">Active</span>
                            </div>
                            <p class="text-xs text-gray-500 font-medium mb-2">Due: Jun 20, 2026</p>
                            <div class="flex items-center justify-between text-xs font-bold text-[#1B2559]">
                                <span>Graded: 15/30</span>
                                <div class="w-16 bg-gray-200 rounded-full h-1.5 ml-2">
                                    <div class="bg-[#4318FF] h-1.5 rounded-full" style="width: 50%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Assignment 2 -->
                        <div class="bg-white border border-gray-100 hover:border-gray-300 rounded-xl p-3 cursor-pointer transition-colors">
                            <div class="flex justify-between items-start mb-1">
                                <h5 class="text-sm font-bold text-gray-700">Assignment 1 (MVC)</h5>
                            </div>
                            <p class="text-xs text-gray-500 font-medium mb-2">Due: Jun 25, 2026</p>
                            <div class="flex items-center justify-between text-xs font-bold text-gray-400">
                                <span>Graded: 0/30</span>
                                <div class="w-16 bg-gray-100 rounded-full h-1.5 ml-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT PANEL: Student Cards List -->
            <div class="flex-1 flex flex-col h-full overflow-hidden">
                <div class="p-6 border-b border-gray-100 bg-white shrink-0 flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-extrabold text-[#1B2559]">Practical Exam 1 Submissions</h2>
                        <p class="text-sm font-medium text-gray-500 mt-1">Class SE18D01 • 30 Students</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="bg-gray-50 border border-gray-200 rounded-xl flex items-center px-4 py-2 shadow-sm w-64">
                            <i data-lucide="search" class="w-4 h-4 text-gray-400 mr-2"></i>
                            <input type="text" placeholder="Search student..." class="w-full text-sm outline-none text-gray-700 bg-transparent">
                        </div>
                        <select class="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 outline-none shadow-sm cursor-pointer">
                            <option>All Status</option>
                            <option>Pending (15)</option>
                            <option>Graded (15)</option>
                        </select>
                    </div>
                </div>
                
                <div class="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        
                        <!-- Student Card: High Discrepancy -->
                        <div class="bg-white border-2 border-red-500/30 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0"></div>
                            <div class="flex justify-between items-start mb-4 relative z-10">
                                <div class="flex items-center">
                                    <img src="https://ui-avatars.com/api/?name=Nguyen+Van+Duc&background=fee2e2&color=ef4444" class="w-12 h-12 rounded-full mr-3 border-2 border-white shadow-sm">
                                    <div>
                                        <h4 class="text-sm font-bold text-[#1B2559]">Nguyen Van Duc</h4>
                                        <p class="text-xs text-gray-500 font-medium">HE150001</p>
                                    </div>
                                </div>
                                <span class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">Submitted</span>
                            </div>
                            
                            <div class="mb-4 relative z-10">
                                <a href="#" class="text-sm text-[#4318FF] font-bold hover:underline flex items-center mb-3">
                                    <i data-lucide="file-archive" class="w-4 h-4 mr-1"></i> PE_DucNV.zip
                                </a>
                                
                                <!-- AI Audit Badge -->
                                <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-xs font-bold text-[#1B2559] flex items-center">
                                            <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-red-500 mr-1"></i> AI Audit
                                        </span>
                                        <span class="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded shadow-sm">High Discrepancy</span>
                                    </div>
                                    <div class="flex items-center justify-between mt-2">
                                        <div class="flex-1 text-center border-r border-red-200/50">
                                            <span class="block text-[10px] text-gray-500 uppercase">Declared</span>
                                            <span class="text-sm font-extrabold text-gray-700">10%</span>
                                        </div>
                                        <div class="flex-1 text-center">
                                            <span class="block text-[10px] text-gray-500 uppercase">Detected</span>
                                            <span class="text-sm font-extrabold text-red-600">95%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between pt-4 border-t border-gray-100 relative z-10">
                                <span class="text-xs font-bold text-gray-400">Score: <span class="text-gray-300">-</span></span>
                                <a href="lecturer_grading_detail.html" class="bg-[#F26F21] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 hover:bg-[#D95D1A] transition-colors">
                                    Evaluate Now
                                </a>
                            </div>
                        </div>

                        <!-- Student Card: Good AI Usage -->
                        <div class="bg-white border-2 border-green-500/20 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-0"></div>
                            <div class="flex justify-between items-start mb-4 relative z-10">
                                <div class="flex items-center">
                                    <img src="https://ui-avatars.com/api/?name=Pham+Tuan+Viet&background=dcfce7&color=22c55e" class="w-12 h-12 rounded-full mr-3 border-2 border-white shadow-sm">
                                    <div>
                                        <h4 class="text-sm font-bold text-[#1B2559]">Pham Tuan Viet</h4>
                                        <p class="text-xs text-gray-500 font-medium">HE150002</p>
                                    </div>
                                </div>
                                <span class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">Submitted</span>
                            </div>
                            
                            <div class="mb-4 relative z-10">
                                <a href="#" class="text-sm text-[#4318FF] font-bold hover:underline flex items-center mb-3">
                                    <i data-lucide="github" class="w-4 h-4 mr-1"></i> Github Repo Link
                                </a>
                                
                                <!-- AI Audit Badge -->
                                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-xs font-bold text-[#1B2559] flex items-center">
                                            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-green-500 mr-1"></i> AI Audit
                                        </span>
                                        <span class="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded shadow-sm">Transparent</span>
                                    </div>
                                    <div class="flex items-center justify-between mt-2">
                                        <div class="flex-1 text-center border-r border-green-200/50">
                                            <span class="block text-[10px] text-gray-500 uppercase">Declared</span>
                                            <span class="text-sm font-extrabold text-gray-700">40%</span>
                                        </div>
                                        <div class="flex-1 text-center">
                                            <span class="block text-[10px] text-gray-500 uppercase">Detected</span>
                                            <span class="text-sm font-extrabold text-green-600">42%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between pt-4 border-t border-gray-100 relative z-10">
                                <span class="text-xs font-bold text-gray-400">Score: <span class="text-gray-300">-</span></span>
                                <a href="lecturer_grading_detail.html" class="bg-white border border-[#4318FF] text-[#4318FF] px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors">
                                    Evaluate Now
                                </a>
                            </div>
                        </div>

                        <!-- Student Card: Graded -->
                        <div class="bg-gray-50 border-2 border-gray-200 rounded-[20px] p-5 shadow-sm relative overflow-hidden opacity-70">
                            <div class="flex justify-between items-start mb-4 relative z-10">
                                <div class="flex items-center">
                                    <img src="https://ui-avatars.com/api/?name=Pham+Chau+Vinh&background=f1f5f9&color=64748b" class="w-12 h-12 rounded-full mr-3 border-2 border-white shadow-sm grayscale">
                                    <div>
                                        <h4 class="text-sm font-bold text-gray-600">Pham Chau Vinh</h4>
                                        <p class="text-xs text-gray-400 font-medium">HE150003</p>
                                    </div>
                                </div>
                                <span class="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">Graded</span>
                            </div>
                            
                            <div class="mb-4 relative z-10">
                                <a href="#" class="text-sm text-gray-500 font-bold flex items-center mb-3">
                                    <i data-lucide="file-archive" class="w-4 h-4 mr-1"></i> PE_VinhPC.zip
                                </a>
                                
                                <!-- AI Audit Badge -->
                                <div class="bg-white border border-gray-200 rounded-lg p-3">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-xs font-bold text-gray-500 flex items-center">
                                            <i data-lucide="shield" class="w-3.5 h-3.5 text-gray-400 mr-1"></i> AI Audit
                                        </span>
                                        <span class="text-[10px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded shadow-sm">No AI Used</span>
                                    </div>
                                    <div class="flex items-center justify-between mt-2">
                                        <div class="flex-1 text-center border-r border-gray-100">
                                            <span class="block text-[10px] text-gray-400 uppercase">Declared</span>
                                            <span class="text-sm font-extrabold text-gray-500">0%</span>
                                        </div>
                                        <div class="flex-1 text-center">
                                            <span class="block text-[10px] text-gray-400 uppercase">Detected</span>
                                            <span class="text-sm font-extrabold text-gray-500">0%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between pt-4 border-t border-gray-200 relative z-10">
                                <span class="text-xs font-bold text-gray-500">Score: <span class="text-xl font-extrabold text-[#1B2559]">8.5</span></span>
                                <a href="lecturer_grading_detail.html" class="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-300 transition-colors">
                                    View Details
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    '''
    
    html = re.sub(r'<!-- DASHBOARD CONTENT -->.*?</div>\s*</div>\s*</main>', new_content + '\n    </main>', html, flags=re.DOTALL)
    
    with open('mockups/lecturer/lecturer_grading_list.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    update_grading_list()
