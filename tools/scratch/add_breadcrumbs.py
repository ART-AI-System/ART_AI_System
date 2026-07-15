import os

def add_breadcrumbs_to_grading():
    lecturer_dir = 'mockups/lecturer'
    
    # 1. lecturer_grading_assignments.html
    # Current header:
    # <h1 class="text-2xl font-extrabold text-[#1B2559]">PRJ301 - Java Web Application</h1>
    # <p class="text-sm font-medium text-gray-500 mt-1">Select an assignment to grade</p>
    
    assignments_path = os.path.join(lecturer_dir, 'lecturer_grading_assignments.html')
    with open(assignments_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    breadcrumb_assignments = '''
                <div class="flex items-center text-sm font-bold text-gray-400 mb-1">
                    <a href="lecturer_grading_subjects.html" class="hover:text-[#4318FF] transition-colors">Grading</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 mx-2"></i>
                    <span class="text-[#4318FF]">PRJ301</span>
                </div>
                <h1 class="text-2xl font-extrabold text-[#1B2559]">PRJ301 - Java Web Application</h1>
    '''
    
    html = html.replace('<h1 class="text-2xl font-extrabold text-[#1B2559]">PRJ301 - Java Web Application</h1>\n                <p class="text-sm font-medium text-gray-500 mt-1">Select an assignment to grade</p>', breadcrumb_assignments)
    
    # Remove the "Back to Subjects" button inside the main content since we now have breadcrumbs
    import re
    html = re.sub(r'<a href="lecturer_grading_subjects.html" class="inline-flex items-center text-sm font-bold text-gray-400 hover:text-\[#4318FF\] mb-6 transition-colors">.*?</a>', '', html, flags=re.DOTALL)
    
    with open(assignments_path, 'w', encoding='utf-8') as f:
        f.write(html)
        
        
    # 2. lecturer_grading_list.html
    # Current header:
    # <h1 class="text-2xl font-extrabold text-[#1B2559]">Lecturer Dashboard</h1>
    # <p class="text-sm font-medium text-gray-500 mt-1">Overview of your classes and pending evaluations</p>
    
    list_path = os.path.join(lecturer_dir, 'lecturer_grading_list.html')
    with open(list_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    breadcrumb_list = '''
                <div class="flex items-center text-sm font-bold text-gray-400 mb-1">
                    <a href="lecturer_grading_subjects.html" class="hover:text-[#4318FF] transition-colors">Grading</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 mx-2"></i>
                    <a href="lecturer_grading_assignments.html" class="hover:text-[#4318FF] transition-colors">PRJ301</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 mx-2"></i>
                    <span class="text-[#4318FF]">SE18D01 (Practical Exam 1)</span>
                </div>
                <h1 class="text-2xl font-extrabold text-[#1B2559]">Practical Exam 1 - Submissions</h1>
    '''
    
    html = html.replace('<h1 class="text-2xl font-extrabold text-[#1B2559]">Lecturer Dashboard</h1>\n                <p class="text-sm font-medium text-gray-500 mt-1">Overview of your classes and pending evaluations</p>', breadcrumb_list)
    html = re.sub(r'<a href="lecturer_grading_assignments.html" class="inline-flex items-center text-sm font-bold text-gray-400 hover:text-\[#4318FF\] mb-6 transition-colors">.*?</a>', '', html, flags=re.DOTALL)
    
    with open(list_path, 'w', encoding='utf-8') as f:
        f.write(html)
        
        
    # 3. lecturer_grading_detail.html
    # Current header:
    # <h1 class="text-sm font-bold">Practical Exam 1</h1>
    # <p class="text-xs text-blue-300">Student: Nguyen Van Duc (SE20A09)</p>
    
    detail_path = os.path.join(lecturer_dir, 'lecturer_grading_detail.html')
    with open(detail_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    breadcrumb_detail = '''
            <div>
                <div class="flex items-center text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
                    <a href="lecturer_grading_subjects.html" class="hover:text-white transition-colors">Grading</a>
                    <i data-lucide="chevron-right" class="w-3 h-3 mx-1"></i>
                    <a href="lecturer_grading_assignments.html" class="hover:text-white transition-colors">PRJ301</a>
                    <i data-lucide="chevron-right" class="w-3 h-3 mx-1"></i>
                    <a href="lecturer_grading_list.html" class="hover:text-white transition-colors">SE18D01 (PE 1)</a>
                </div>
                <h1 class="text-sm font-bold">Nguyen Van Duc (HE150001)</h1>
            </div>
    '''
    
    html = html.replace('''            <div>
                <h1 class="text-sm font-bold">Practical Exam 1</h1>
                <p class="text-xs text-blue-300">Student: Nguyen Van Duc (SE20A09)</p>
            </div>''', breadcrumb_detail)
            
    with open(detail_path, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    add_breadcrumbs_to_grading()
