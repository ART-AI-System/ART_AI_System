import re
import os

def fix_all_breadcrumbs():
    lecturer_dir = 'mockups/lecturer'
    
    # --- 1. lecturer_grading_assignments.html ---
    assignments_path = os.path.join(lecturer_dir, 'lecturer_grading_assignments.html')
    with open(assignments_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # We need to find the <header> block and replace its title area.
    # The header has: <h1 class="text-2xl font-extrabold text-[#1B2559]">...</h1>
    
    # Let's replace the whole header title div.
    header_title_pattern = re.compile(r'<div>\s*<h1 class="text-2xl font-extrabold text-\[#1B2559\]">.*?</h1>\s*<p class="text-sm font-medium text-gray-500 mt-1">.*?</p>\s*</div>', re.DOTALL)
    
    breadcrumb_assignments = '''
            <div class="flex-1">
                <div class="flex items-center text-sm font-bold text-gray-400 mb-1">
                    <a href="lecturer_grading_subjects.html" class="hover:text-[#4318FF] transition-colors cursor-pointer">Grading</a>
                    <i data-lucide="chevron-right" class="w-4 h-4 mx-2"></i>
                    <span class="text-[#4318FF]">PRJ301</span>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-extrabold text-[#1B2559]">PRJ301 - Java Web Application</h1>
                        <p class="text-sm font-medium text-gray-500 mt-1">Select an assignment to grade</p>
                    </div>
                </div>
            </div>
    '''
    
    # Also add the Return button to the right side of the header space. We can just put it next to the bell icon.
    # Actually, the user says "phía bên phải breadcrumb cần có cả nút return cho tiện".
    # Let's put it next to the h1.
    breadcrumb_assignments = '''
            <div class="flex-1 flex justify-between items-center mr-6">
                <div>
                    <div class="flex items-center text-sm font-bold text-gray-400 mb-1">
                        <a href="lecturer_grading_subjects.html" class="hover:text-[#4318FF] transition-colors cursor-pointer">Grading</a>
                        <i data-lucide="chevron-right" class="w-4 h-4 mx-2"></i>
                        <span class="text-[#4318FF]">PRJ301</span>
                    </div>
                    <h1 class="text-2xl font-extrabold text-[#1B2559]">PRJ301 - Java Web Application</h1>
                </div>
                <a href="lecturer_grading_subjects.html" class="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 hover:text-[#4318FF] transition-colors shadow-sm flex items-center">
                    <i data-lucide="corner-up-left" class="w-4 h-4 mr-2"></i> Return
                </a>
            </div>
    '''
    
    html = header_title_pattern.sub(breadcrumb_assignments, html)
    with open(assignments_path, 'w', encoding='utf-8') as f:
        f.write(html)
        

    # --- 2. lecturer_grading_list.html ---
    list_path = os.path.join(lecturer_dir, 'lecturer_grading_list.html')
    with open(list_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    breadcrumb_list = '''
            <div class="flex-1 flex justify-between items-center mr-6">
                <div>
                    <div class="flex items-center text-sm font-bold text-gray-400 mb-1">
                        <a href="lecturer_grading_subjects.html" class="hover:text-[#4318FF] transition-colors cursor-pointer">Grading</a>
                        <i data-lucide="chevron-right" class="w-4 h-4 mx-2"></i>
                        <a href="lecturer_grading_assignments.html" class="hover:text-[#4318FF] transition-colors cursor-pointer">PRJ301</a>
                        <i data-lucide="chevron-right" class="w-4 h-4 mx-2"></i>
                        <span class="text-[#4318FF]">SE18D01 (Practical Exam 1)</span>
                    </div>
                    <h1 class="text-2xl font-extrabold text-[#1B2559]">Practical Exam 1 - Submissions</h1>
                </div>
                <a href="lecturer_grading_assignments.html" class="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 hover:text-[#4318FF] transition-colors shadow-sm flex items-center">
                    <i data-lucide="corner-up-left" class="w-4 h-4 mr-2"></i> Return
                </a>
            </div>
    '''
    
    # We replace the header block again. Wait, earlier I might have replaced it already.
    # Let's just use the regex.
    html = header_title_pattern.sub(breadcrumb_list, html)
    
    # Let's also check if there is an old breadcrumb I injected in DASHBOARD CONTENT
    html = re.sub(r'<div class="flex items-center text-sm font-bold text-gray-400 mb-1">.*?<h1 class="text-2xl font-extrabold text-\[#1B2559\]">.*?</h1>', '', html, flags=re.DOTALL)

    with open(list_path, 'w', encoding='utf-8') as f:
        f.write(html)


    # --- 3. lecturer_grading_detail.html ---
    # This page has a dark header: bg-[#1B2559] text-white
    detail_path = os.path.join(lecturer_dir, 'lecturer_grading_detail.html')
    with open(detail_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # The header starts with:
    # <div class="flex items-center">
    #     <a href="lecturer_grading_list.html" class="p-2 mr-4 ..."> <i data-lucide="arrow-left" ...
    #     <div>
    #         <div class="flex items-center text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider"> ...
    
    # We will replace the left part of the header.
    header_left_pattern = re.compile(r'<div class="flex items-center">\s*<a href="lecturer_grading_list.html" class="p-2 mr-4 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white">\s*<i data-lucide="arrow-left" class="w-5 h-5"></i>\s*</a>\s*<div>.*?</div>\s*<div class="ml-6 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full flex items-center">', re.DOTALL)
    
    breadcrumb_detail = '''<div class="flex items-center">
            <a href="lecturer_grading_list.html" class="px-3 py-1.5 mr-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white font-bold text-xs flex items-center border border-white/20">
                <i data-lucide="corner-up-left" class="w-4 h-4 mr-1.5"></i> Return
            </a>
            <div>
                <div class="flex items-center text-xs font-bold text-gray-400 mb-0.5">
                    <a href="lecturer_grading_subjects.html" class="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-white">Grading</a>
                    <i data-lucide="chevron-right" class="w-3 h-3 mx-2"></i>
                    <a href="lecturer_grading_assignments.html" class="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-white">PRJ301</a>
                    <i data-lucide="chevron-right" class="w-3 h-3 mx-2"></i>
                    <a href="lecturer_grading_list.html" class="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-white">SE18D01 (PE 1)</a>
                    <i data-lucide="chevron-right" class="w-3 h-3 mx-2"></i>
                    <span class="text-white">Nguyen Van Duc</span>
                </div>
                <h1 class="text-base font-extrabold text-white">Nguyen Van Duc (HE150001)</h1>
            </div>
            
            <div class="ml-6 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full flex items-center">'''
            
    html = header_left_pattern.sub(breadcrumb_detail, html)

    with open(detail_path, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    fix_all_breadcrumbs()
