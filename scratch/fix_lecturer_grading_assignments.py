import os

def fix_lecturer_grading_assignments():
    lecturer_dir = 'mockups/lecturer'
    dashboard_path = os.path.join(lecturer_dir, 'lecturer_dashboard.html')
    target_path = os.path.join(lecturer_dir, 'lecturer_grading_assignments.html')
    
    with open(dashboard_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Find where DASHBOARD CONTENT starts
    marker = '<!-- DASHBOARD CONTENT -->'
    header_end_idx = html.find(marker)
    
    if header_end_idx == -1:
        print("Could not find DASHBOARD CONTENT marker")
        return
        
    # We keep everything up to DASHBOARD CONTENT
    html_top = html[:header_end_idx]
    
    # Update title and text in top part
    html_top = html_top.replace('Dashboard', 'Grading')
    html_top = html_top.replace('Lecturer Dashboard', 'PRJ301 - Java Web Application')
    html_top = html_top.replace('Overview of your classes and pending evaluations', 'Select an assignment to grade')
    
    # Update active menu
    html_top = html_top.replace(
        '<a href="lecturer_dashboard.html" class="flex items-center px-4 py-3.5 bg-white/10 text-white font-bold rounded-xl transition-all relative">\n                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>\n                <i data-lucide="layout-dashboard" class="w-5 h-5 mr-4 text-[#F26F21]"></i>\n                Dashboard\n            </a>',
        '<a href="lecturer_dashboard.html" class="flex items-center px-4 py-3.5 text-blue-200 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5">\n                <i data-lucide="layout-dashboard" class="w-5 h-5 mr-4 opacity-70"></i>\n                Dashboard\n            </a>'
    )
    # Also update Grading link to be active
    html_top = html_top.replace(
        '<a href="lecturer_grading_subjects.html" class="flex items-center px-4 py-3.5 text-blue-200 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5">\n                <i data-lucide="file-check-2" class="w-5 h-5 mr-4 opacity-70"></i>\n                Grading\n                <span class="ml-auto bg-[#F26F21] text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>\n            </a>',
        '<a href="lecturer_grading_subjects.html" class="flex items-center px-4 py-3.5 bg-white/10 text-white font-bold rounded-xl transition-all relative">\n                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>\n                <i data-lucide="file-check-2" class="w-5 h-5 mr-4 text-[#F26F21]"></i>\n                Grading\n                <span class="ml-auto bg-[#F26F21] text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>\n            </a>'
    )
    
    # Now append our new dashboard content
    assignments_content = '''
        <!-- DASHBOARD CONTENT -->
        <div class="flex-1 overflow-y-auto p-10 scroll-smooth bg-gray-50/50">
            <div class="max-w-[1400px] mx-auto">
                <div class="mb-6 flex justify-between items-center">
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
            </div>
        </div>
    </main>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
    '''
    
    final_html = html_top + assignments_content
    
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(final_html)

if __name__ == '__main__':
    fix_lecturer_grading_assignments()
