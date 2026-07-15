import os
import re
import shutil

def fix_lecturer_grading_flow():
    lecturer_dir = 'mockups/lecturer'
    
    # --- 1. Create lecturer_grading_subjects.html ---
    # We copy lecturer_subjects.html
    shutil.copyfile(os.path.join(lecturer_dir, 'lecturer_subjects.html'), os.path.join(lecturer_dir, 'lecturer_grading_subjects.html'))
    
    with open(os.path.join(lecturer_dir, 'lecturer_grading_subjects.html'), 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Update title and breadcrumbs
    html = html.replace('My Subjects', 'Grading')
    html = html.replace('Manage your teaching courses', 'Select a subject to grade')
    
    # Change links to point to lecturer_grading_assignments.html instead of lecturer_subject_detail.html
    html = html.replace('lecturer_subject_detail.html', 'lecturer_grading_assignments.html')
    
    # Active menu
    # "My Subjects" should be inactive, "Grading" should be active.
    # Current active: My Subjects
    html = re.sub(r'<a href="lecturer_subjects.html" class="flex items-center px-4 py-3.5 bg-white/10 text-white font-bold rounded-xl transition-all relative">\s*<div.*?</div>\s*<i data-lucide="book-open" class="w-5 h-5 mr-4 text-\[#F26F21\]"></i> My Subjects\s*</a>', 
                  r'<a href="lecturer_subjects.html" class="flex items-center px-4 py-3.5 text-blue-200 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5">\n                <i data-lucide="book-open" class="w-5 h-5 mr-4 opacity-70"></i> My Subjects\n            </a>', html, flags=re.DOTALL)
    
    html = re.sub(r'<a href="lecturer_grading_list.html" class="flex items-center px-4 py-3.5 text-blue-200 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5">\s*<i data-lucide="file-check-2" class="w-5 h-5 mr-4 opacity-70"></i> Grading\s*<span class="ml-auto bg-\[#F26F21\] text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>\s*</a>',
                  r'<a href="lecturer_grading_subjects.html" class="flex items-center px-4 py-3.5 bg-white/10 text-white font-bold rounded-xl transition-all relative">\n                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>\n                <i data-lucide="file-check-2" class="w-5 h-5 mr-4 text-[#F26F21]"></i> Grading\n                <span class="ml-auto bg-[#F26F21] text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>\n            </a>', html, flags=re.DOTALL)
    
    with open(os.path.join(lecturer_dir, 'lecturer_grading_subjects.html'), 'w', encoding='utf-8') as f:
        f.write(html)


    # --- 2. Create lecturer_grading_assignments.html ---
    # This page shows a list of assignments for the selected subject (e.g. PRJ301)
    # We can use lecturer_dashboard.html or similar as a base layout
    with open(os.path.join(lecturer_dir, 'lecturer_dashboard.html'), 'r', encoding='utf-8') as f:
        html = f.read()
        
    html = html.replace('Dashboard', 'Grading')
    html = html.replace('Welcome back, Dr. Khoa', 'PRJ301 - Java Web Application')
    html = html.replace('Here is what\'s happening with your classes today.', 'Select an assignment to grade')
    
    # Remove stats and other dashboard widgets
    html = re.sub(r'<!-- Quick Stats -->.*', '', html, flags=re.DOTALL)
    
    assignments_content = '''
        <div class="mt-8 mb-4 flex justify-between items-center">
            <h2 class="text-xl font-extrabold text-[#1B2559]">Classes & Assignments</h2>
            <div class="bg-white border border-gray-200 rounded-xl flex items-center px-4 py-2 shadow-sm w-72">
                <i data-lucide="search" class="w-4 h-4 text-gray-400 mr-2"></i>
                <input type="text" placeholder="Search class or assignment..." class="w-full text-sm outline-none text-gray-700 bg-transparent">
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            <!-- Class 1 -->
            <div class="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-[#1B2559]">SE18D01</h3>
                        <p class="text-xs font-medium text-gray-500 mt-1">30 Students</p>
                    </div>
                    <span class="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-lg">12 Pending</span>
                </div>
                
                <div class="space-y-3 mt-4">
                    <a href="lecturer_grading_list.html" class="block bg-blue-50 border border-[#4318FF] rounded-xl p-4 hover:bg-blue-100 transition-colors">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="text-sm font-bold text-[#4318FF]">Practical Exam 1</h4>
                            <i data-lucide="arrow-right" class="w-4 h-4 text-[#4318FF]"></i>
                        </div>
                        <div class="flex items-center justify-between text-xs font-bold text-[#1B2559]">
                            <span>Graded: 15/30</span>
                            <div class="w-32 bg-gray-200 rounded-full h-1.5 ml-2">
                                <div class="bg-[#4318FF] h-1.5 rounded-full" style="width: 50%"></div>
                            </div>
                        </div>
                    </a>
                    
                    <a href="#" class="block bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="text-sm font-bold text-gray-600">Assignment 1 (MVC)</h4>
                            <i data-lucide="arrow-right" class="w-4 h-4 text-gray-400"></i>
                        </div>
                        <div class="flex items-center justify-between text-xs font-bold text-gray-400">
                            <span>Graded: 0/30</span>
                            <div class="w-32 bg-gray-200 rounded-full h-1.5 ml-2"></div>
                        </div>
                    </a>
                </div>
            </div>
            
            <!-- Class 2 -->
            <div class="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-[#1B2559]">SE18D02</h3>
                        <p class="text-xs font-medium text-gray-500 mt-1">28 Students</p>
                    </div>
                    <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-lg">All Graded</span>
                </div>
                
                <div class="space-y-3 mt-4">
                    <a href="#" class="block bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="text-sm font-bold text-gray-600">Practical Exam 1</h4>
                            <i data-lucide="arrow-right" class="w-4 h-4 text-gray-400"></i>
                        </div>
                        <div class="flex items-center justify-between text-xs font-bold text-gray-400">
                            <span>Graded: 28/28</span>
                            <div class="w-32 bg-gray-200 rounded-full h-1.5 ml-2">
                                <div class="bg-green-500 h-1.5 rounded-full" style="width: 100%"></div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            
        </div>
    '''
    
    # Need to properly replace the main content and active menu
    # Replace active menu:
    html = re.sub(r'<a href="lecturer_dashboard.html" class="flex items-center px-4 py-3.5 bg-white/10 text-white font-bold rounded-xl transition-all relative">\s*<div.*?</div>\s*<i data-lucide="layout-dashboard" class="w-5 h-5 mr-4 text-\[#F26F21\]"></i> Dashboard\s*</a>', 
                  r'<a href="lecturer_dashboard.html" class="flex items-center px-4 py-3.5 text-blue-200 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5">\n                <i data-lucide="layout-dashboard" class="w-5 h-5 mr-4 opacity-70"></i> Dashboard\n            </a>', html, flags=re.DOTALL)
    
    html = re.sub(r'<a href="lecturer_grading_list.html" class="flex items-center px-4 py-3.5 text-blue-200 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5">\s*<i data-lucide="file-check-2" class="w-5 h-5 mr-4 opacity-70"></i> Grading\s*<span class="ml-auto bg-\[#F26F21\] text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>\s*</a>',
                  r'<a href="lecturer_grading_subjects.html" class="flex items-center px-4 py-3.5 bg-white/10 text-white font-bold rounded-xl transition-all relative">\n                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>\n                <i data-lucide="file-check-2" class="w-5 h-5 mr-4 text-[#F26F21]"></i> Grading\n                <span class="ml-auto bg-[#F26F21] text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>\n            </a>', html, flags=re.DOTALL)
    
    # Append the assignments content to the main div
    html = html + assignments_content + '\n            </div>\n        </div>\n    </main>\n    <script>\n        lucide.createIcons();\n    </script>\n</body>\n</html>'
    
    with open(os.path.join(lecturer_dir, 'lecturer_grading_assignments.html'), 'w', encoding='utf-8') as f:
        f.write(html)
        
        
    # --- 3. Fix lecturer_grading_list.html ---
    # Revert the split layout to full width
    with open(os.path.join(lecturer_dir, 'lecturer_grading_list.html'), 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Find the RIGHT PANEL start: <!-- RIGHT PANEL: Student Cards List -->
    # We want to replace the whole DASHBOARD CONTENT
    
    new_dashboard_content = '''
        <!-- DASHBOARD CONTENT -->
        <div class="flex-1 overflow-y-auto p-10 scroll-smooth bg-gray-50/50">
            <div class="max-w-[1400px] mx-auto">
                
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-2xl font-extrabold text-[#1B2559]">Practical Exam 1</h2>
                        <p class="text-sm font-medium text-gray-500 mt-1">Class SE18D01 • 30 Students</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="bg-white border border-gray-200 rounded-xl flex items-center px-4 py-2 shadow-sm w-64">
                            <i data-lucide="search" class="w-4 h-4 text-gray-400 mr-2"></i>
                            <input type="text" placeholder="Search student..." class="w-full text-sm outline-none text-gray-700 bg-transparent">
                        </div>
                        <select class="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none shadow-sm cursor-pointer">
                            <option>All Status</option>
                            <option>Pending (15)</option>
                            <option>Graded (15)</option>
                        </select>
                    </div>
                </div>
                
                <!-- Cards Grid -->
    '''
    
    html = re.sub(r'<!-- DASHBOARD CONTENT with Split Layout -->.*<!-- RIGHT PANEL: Student Cards List -->.*?<div class="p-6 border-b border-gray-100 bg-white shrink-0 flex justify-between items-center">.*?</div>\s*<div class="flex-1 overflow-y-auto p-6 scroll-smooth">', new_dashboard_content, html, flags=re.DOTALL)
    
    # Close tags at the end
    # We need to replace the end part
    html = re.sub(r'</div>\s*</div>\s*</div>\s*</div>\s*</main>', r'</div>\n            </div>\n        </div>\n    </main>', html, flags=re.DOTALL)
    
    # Fix the active menu link to point to lecturer_grading_subjects.html
    html = html.replace('href="lecturer_grading_list.html" class="flex items-center px-4 py-3.5 bg-white/10', 'href="lecturer_grading_subjects.html" class="flex items-center px-4 py-3.5 bg-white/10')

    with open(os.path.join(lecturer_dir, 'lecturer_grading_list.html'), 'w', encoding='utf-8') as f:
        f.write(html)
        
    # Update sidebar links in all lecturer files to point to lecturer_grading_subjects.html instead of lecturer_grading_list.html
    for f in os.listdir(lecturer_dir):
        if f.endswith('.html'):
            filepath = os.path.join(lecturer_dir, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content.replace('href="lecturer_grading_list.html"', 'href="lecturer_grading_subjects.html"')
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)


if __name__ == '__main__':
    fix_lecturer_grading_flow()
