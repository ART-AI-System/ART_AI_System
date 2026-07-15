import re

def update_lecturer_subject_detail():
    with open('mockups/lecturer/lecturer_subject_detail.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Remove "Create New Slot" button
    html = re.sub(r'<button class="bg-\[#4318FF\].*?Create New Slot.*?</button>', '', html, flags=re.DOTALL)
    
    # 2. Modify a Slot to include Description Editing, Deadline Setting, and AI Requirement
    # I'll replace the existing slot layout with a more detailed one.
    # Let's find the content inside <div class="max-w-4xl space-y-4">
    
    new_slots = '''
                <!-- Slot 1 (Fixed) -->
                <div class="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mr-4 font-extrabold shadow-sm border border-orange-100">
                                S1
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-[#1B2559]">Introduction & Environment Setup</h3>
                                <p class="text-xs font-medium text-gray-500 mt-1">Wednesday, 17 June 2026 • 09:00 AM</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-bold bg-green-100 text-green-600 px-3 py-1.5 rounded-lg border border-green-200">Active</span>
                            <button class="p-2 text-gray-400 hover:text-[#4318FF] transition-colors rounded-lg hover:bg-blue-50" title="Edit Settings">
                                <i data-lucide="settings-2" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Editable Description -->
                    <div class="mb-4">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Slot Description / Materials</label>
                        <div class="relative group">
                            <textarea rows="2" class="w-full text-sm text-gray-600 bg-gray-50 border border-transparent rounded-xl px-4 py-3 outline-none focus:border-[#4318FF] focus:bg-white group-hover:border-gray-300 transition-colors" placeholder="Enter materials, reading requirements, or notes for this slot...">Overview of the module. Setting up the Node.js and React environment. Please read Chapter 1 before class.</textarea>
                            <i data-lucide="edit-3" class="w-4 h-4 text-gray-400 absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <!-- Left: Tasks/Assignments -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Assignments / Quiz</label>
                                <button class="text-xs font-bold text-[#4318FF] hover:underline flex items-center"><i data-lucide="plus" class="w-3 h-3 mr-1"></i> Add</button>
                            </div>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm">
                                    <div class="flex items-center text-sm font-bold text-[#1B2559]">
                                        <i data-lucide="file-text" class="w-4 h-4 mr-2 text-orange-500"></i> Setup Report
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <div class="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100 cursor-pointer hover:border-[#4318FF] transition-colors flex items-center" title="Click to set deadline">
                                            <i data-lucide="clock" class="w-3 h-3 mr-1 text-gray-400"></i> Due: Jun 20
                                        </div>
                                        <div class="relative group cursor-pointer">
                                            <i data-lucide="bot" class="w-4 h-4 text-gray-400 group-hover:text-[#4318FF]"></i>
                                            <!-- Tooltip / Dropdown mock -->
                                            <div class="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 shadow-xl rounded-xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                                                <p class="text-[10px] font-bold text-gray-400 mb-1">AI Declaration Required?</p>
                                                <select class="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded p-1 text-[#1B2559] outline-none pointer-events-auto">
                                                    <option>Yes (Full Declaration)</option>
                                                    <option selected>Optional</option>
                                                    <option>No AI Allowed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Right: Attendance / Stats -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Slot Analytics</label>
                            </div>
                            <div class="flex space-x-4 h-full items-center">
                                <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex-1 flex flex-col justify-center">
                                    <span class="text-xs font-bold text-gray-400 mb-1">Attendance</span>
                                    <div class="flex items-end space-x-2">
                                        <span class="text-xl font-extrabold text-[#1B2559]">28</span>
                                        <span class="text-sm font-medium text-gray-400 mb-1">/ 30</span>
                                    </div>
                                </div>
                                <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex-1 flex flex-col justify-center">
                                    <span class="text-xs font-bold text-gray-400 mb-1">Submissions</span>
                                    <div class="flex items-end space-x-2">
                                        <span class="text-xl font-extrabold text-[#1B2559]">15</span>
                                        <span class="text-sm font-medium text-gray-400 mb-1">/ 30</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slot 2 (Fixed) -->
                <div class="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center mr-4 font-extrabold border border-gray-200">
                                S2
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-[#1B2559]">Architectural Patterns - MVC & MVVM</h3>
                                <p class="text-xs font-medium text-gray-500 mt-1">Friday, 19 June 2026 • 09:00 AM</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-200">Upcoming</span>
                            <button class="p-2 text-gray-400 hover:text-[#4318FF] transition-colors rounded-lg hover:bg-blue-50">
                                <i data-lucide="settings-2" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Editable Description -->
                    <div class="mb-4">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Slot Description / Materials</label>
                        <div class="relative group">
                            <textarea rows="2" class="w-full text-sm text-gray-600 bg-gray-50 border border-transparent rounded-xl px-4 py-3 outline-none focus:border-[#4318FF] focus:bg-white group-hover:border-gray-300 transition-colors" placeholder="Enter materials, reading requirements, or notes for this slot...">Deep dive into Model-View-Controller and Model-View-ViewModel patterns. Practical implementation in React.</textarea>
                            <i data-lucide="edit-3" class="w-4 h-4 text-gray-400 absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Assignments / Quiz</label>
                                <button class="text-xs font-bold text-[#4318FF] hover:underline flex items-center"><i data-lucide="plus" class="w-3 h-3 mr-1"></i> Add</button>
                            </div>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm">
                                    <div class="flex items-center text-sm font-bold text-[#1B2559]">
                                        <i data-lucide="check-square" class="w-4 h-4 mr-2 text-blue-500"></i> MVC Quiz
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <div class="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100 cursor-pointer hover:border-[#4318FF] transition-colors flex items-center">
                                            <i data-lucide="clock" class="w-3 h-3 mr-1 text-gray-400"></i> Due: In class
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm">
                                    <div class="flex items-center text-sm font-bold text-[#1B2559]">
                                        <i data-lucide="code" class="w-4 h-4 mr-2 text-purple-500"></i> Assignment 1 (MVC)
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <div class="text-xs text-[#4318FF] font-bold bg-blue-50 px-2 py-1 rounded border border-blue-100 cursor-pointer hover:border-[#4318FF] transition-colors flex items-center" title="Click to set deadline">
                                            <i data-lucide="clock" class="w-3 h-3 mr-1 text-[#4318FF]"></i> Due: Jun 25
                                        </div>
                                        <div class="relative group cursor-pointer">
                                            <i data-lucide="bot" class="w-4 h-4 text-[#4318FF]"></i>
                                            <!-- Tooltip / Dropdown mock -->
                                            <div class="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 shadow-xl rounded-xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                                                <p class="text-[10px] font-bold text-gray-400 mb-1">AI Declaration Required?</p>
                                                <select class="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded p-1 text-[#1B2559] outline-none pointer-events-auto">
                                                    <option selected>Yes (Full Declaration)</option>
                                                    <option>Optional</option>
                                                    <option>No AI Allowed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Slot Analytics</label>
                            </div>
                            <div class="flex space-x-4 h-full items-center opacity-50">
                                <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex-1 flex flex-col justify-center">
                                    <span class="text-xs font-bold text-gray-400 mb-1">Attendance</span>
                                    <div class="flex items-end space-x-2">
                                        <span class="text-xl font-extrabold text-[#1B2559]">-</span>
                                    </div>
                                </div>
                                <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex-1 flex flex-col justify-center">
                                    <span class="text-xs font-bold text-gray-400 mb-1">Submissions</span>
                                    <div class="flex items-end space-x-2">
                                        <span class="text-xl font-extrabold text-[#1B2559]">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    '''
    
    html = re.sub(r'<div class="max-w-4xl space-y-4">.*?<!-- Pagination -->', '<div class="max-w-4xl space-y-6">\n' + new_slots + '\n                </div>\n                \n                <!-- Pagination -->', html, flags=re.DOTALL)
    
    with open('mockups/lecturer/lecturer_subject_detail.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    update_lecturer_subject_detail()
