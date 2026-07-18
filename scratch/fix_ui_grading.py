import re
import os

def fix_ui_grading():
    lecturer_dir = 'mockups/lecturer'
    
    # 1. Add Back Button to lecturer_grading_assignments.html
    assignments_path = os.path.join(lecturer_dir, 'lecturer_grading_assignments.html')
    with open(assignments_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    back_button_subjects = '''
                <a href="lecturer_grading_subjects.html" class="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#4318FF] mb-6 transition-colors">
                    <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i> Back to Subjects
                </a>
                <div class="mb-6 flex justify-between items-center">'''
                
    html = html.replace('<div class="mb-6 flex justify-between items-center">', back_button_subjects)
    
    with open(assignments_path, 'w', encoding='utf-8') as f:
        f.write(html)
        
    
    # 2. Add Back Button and Convert Grid to List in lecturer_grading_list.html
    list_path = os.path.join(lecturer_dir, 'lecturer_grading_list.html')
    with open(list_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    back_button_classes = '''
                <a href="lecturer_grading_assignments.html" class="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#4318FF] mb-6 transition-colors">
                    <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i> Back to Classes
                </a>
                <div class="flex justify-between items-center mb-6">'''
                
    html = html.replace('<div class="flex justify-between items-center mb-6">', back_button_classes)
    
    # Now convert the grid to a list. We need to replace the entire <div class="grid...">...</div>
    # Find the <!-- Cards Grid --> marker
    
    list_view_html = '''
                <!-- List View -->
                <div class="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden">
                    <table class="w-full text-left text-sm text-gray-600">
                        <thead class="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th class="px-6 py-4">Student</th>
                                <th class="px-6 py-4">Submission</th>
                                <th class="px-6 py-4 w-64 text-center">AI Audit</th>
                                <th class="px-6 py-4">Score</th>
                                <th class="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            
                            <!-- Student 1: High Discrepancy -->
                            <tr class="hover:bg-gray-50 transition-colors group">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <img src="https://ui-avatars.com/api/?name=Viet+Khoa&background=F26F21&color=fff" class="w-10 h-10 rounded-full mr-3 border border-gray-200">
                                        <div>
                                            <div class="font-extrabold text-[#1B2559]">Nguyen Van Duc</div>
                                            <div class="text-xs font-medium text-gray-400">HE150001</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit mb-1">Submitted</span>
                                        <a href="#" class="text-sm font-bold text-[#4318FF] hover:underline flex items-center"><i data-lucide="file-archive" class="w-4 h-4 mr-1"></i> PE_DucNV.zip</a>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="bg-red-50 border border-red-100 rounded-xl p-2 relative overflow-hidden">
                                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-[10px] font-bold text-red-600 flex items-center uppercase"><i data-lucide="shield-alert" class="w-3 h-3 mr-1"></i> High Discrepancy</span>
                                        </div>
                                        <div class="flex justify-between text-xs mt-1">
                                            <div class="text-center w-1/2 border-r border-red-200/50">
                                                <div class="font-medium text-gray-500 text-[10px]">Declared</div>
                                                <div class="font-extrabold text-[#1B2559]">10%</div>
                                            </div>
                                            <div class="text-center w-1/2">
                                                <div class="font-medium text-gray-500 text-[10px]">Detected</div>
                                                <div class="font-extrabold text-red-600">95%</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-gray-400 font-bold">-</span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="lecturer_grading_detail.html" class="inline-flex px-4 py-2 bg-[#F26F21] text-white text-xs font-bold rounded-lg hover:bg-[#D95D1A] transition-all shadow-md shadow-orange-500/20">Evaluate Now</a>
                                </td>
                            </tr>

                            <!-- Student 2: Transparent -->
                            <tr class="hover:bg-gray-50 transition-colors group">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <img src="https://ui-avatars.com/api/?name=User&background=4318FF&color=fff" class="w-10 h-10 rounded-full mr-3 border border-gray-200">
                                        <div>
                                            <div class="font-extrabold text-[#1B2559]">Pham Tuan Viet</div>
                                            <div class="text-xs font-medium text-gray-400">HE150002</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit mb-1">Submitted</span>
                                        <a href="#" class="text-sm font-bold text-[#4318FF] hover:underline flex items-center"><i data-lucide="github" class="w-4 h-4 mr-1"></i> Github Repo Link</a>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="bg-green-50 border border-green-100 rounded-xl p-2 relative overflow-hidden">
                                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-[10px] font-bold text-green-600 flex items-center uppercase"><i data-lucide="shield-check" class="w-3 h-3 mr-1"></i> Transparent</span>
                                        </div>
                                        <div class="flex justify-between text-xs mt-1">
                                            <div class="text-center w-1/2 border-r border-green-200/50">
                                                <div class="font-medium text-gray-500 text-[10px]">Declared</div>
                                                <div class="font-extrabold text-[#1B2559]">40%</div>
                                            </div>
                                            <div class="text-center w-1/2">
                                                <div class="font-medium text-gray-500 text-[10px]">Detected</div>
                                                <div class="font-extrabold text-green-600">42%</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-gray-400 font-bold">-</span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="lecturer_grading_detail.html" class="inline-flex px-4 py-2 border-2 border-[#4318FF] text-[#4318FF] text-xs font-bold rounded-lg hover:bg-[#4318FF] hover:text-white transition-all">Evaluate Now</a>
                                </td>
                            </tr>

                            <!-- Student 3: Graded -->
                            <tr class="hover:bg-gray-50 transition-colors group opacity-70">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <img src="https://ui-avatars.com/api/?name=User&background=4318FF&color=fff" class="w-10 h-10 rounded-full mr-3 border border-gray-200 grayscale">
                                        <div>
                                            <div class="font-extrabold text-[#1B2559]">Pham Chau Vinh</div>
                                            <div class="text-xs font-medium text-gray-400">HE150003</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <span class="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit mb-1">Graded</span>
                                        <a href="#" class="text-sm font-bold text-gray-500 flex items-center"><i data-lucide="file-archive" class="w-4 h-4 mr-1"></i> PE_VinhPC.zip</a>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-2 relative overflow-hidden">
                                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-[10px] font-bold text-gray-500 flex items-center uppercase"><i data-lucide="shield" class="w-3 h-3 mr-1"></i> No AI Used</span>
                                        </div>
                                        <div class="flex justify-between text-xs mt-1">
                                            <div class="text-center w-1/2 border-r border-gray-200/50">
                                                <div class="font-medium text-gray-400 text-[10px]">Declared</div>
                                                <div class="font-extrabold text-gray-500">0%</div>
                                            </div>
                                            <div class="text-center w-1/2">
                                                <div class="font-medium text-gray-400 text-[10px]">Detected</div>
                                                <div class="font-extrabold text-gray-500">0%</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-lg font-extrabold text-[#1B2559]">8.5</span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="lecturer_grading_detail.html" class="inline-flex px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all">View Details</a>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
    '''
    
    # Use re.sub to replace everything after <!-- Cards Grid --> until the end of the container
    html = re.sub(r'<!-- Cards Grid -->.*</div>\s*</div>\s*</div>\s*</main>', list_view_html + '\n            </div>\n        </div>\n    </main>', html, flags=re.DOTALL)
    
    with open(list_path, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    fix_ui_grading()
