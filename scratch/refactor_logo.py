import glob
import re

def refactor_sidebar_header():
    for filepath in glob.glob('mockups/student/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        # 1. Remove desktop hamburger from header
        # <button id="desktopSidebarToggle" class="mr-4 p-2 text-gray-500 hover:text-[#4318FF] transition-colors rounded-lg hover:bg-white hidden lg:block">
        #     <i data-lucide="menu" class="w-6 h-6"></i>
        # </button>
        desktop_toggle_pattern = re.compile(r'<button id="desktopSidebarToggle".*?<i data-lucide="menu" class="w-6 h-6"></i>\s*</button>', re.DOTALL)
        html = desktop_toggle_pattern.sub('', html)

        # 2. Refactor Logo area
        # Original Logo Area:
        # <a href="home.html" class="h-24 flex items-center px-6 lg:px-8 relative">
        #     <div class="w-10 h-10 rounded-xl fpt-orange-gradient flex items-center justify-center text-white mr-3 shrink-0 shadow-lg shadow-orange-200">
        #         <i data-lucide="brain-circuit" class="w-6 h-6"></i>
        #     </div>
        #     <span class="sidebar-text transition-opacity duration-300 text-2xl font-extrabold text-[#1B2559]">ART-AI</span>
        
        logo_pattern = re.compile(r'<a href="home\.html" class="h-24 flex items-center px-6 lg:px-8 cursor-pointer relative">.*?<span class="sidebar-text transition-opacity duration-300 text-2xl font-extrabold text-\[#1B2559\]">ART-AI</span>', re.DOTALL)
        
        new_logo = '''<div class="h-24 flex items-center px-6 lg:px-8 relative overflow-hidden">
            <button id="desktopSidebarToggle" class="group relative w-10 h-10 rounded-xl fpt-orange-gradient flex items-center justify-center text-white mr-3 shrink-0 shadow-lg shadow-orange-200 overflow-hidden z-10">
                <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:rotate-180 group-hover:opacity-0">
                    <i data-lucide="brain-circuit" class="w-6 h-6"></i>
                </div>
                <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 -rotate-180 opacity-0 group-hover:rotate-0 group-hover:opacity-100">
                    <i data-lucide="chevron-left" id="collapseIcon" class="w-6 h-6"></i>
                    <i data-lucide="chevron-right" id="expandIcon" class="w-6 h-6 hidden"></i>
                </div>
            </button>
            <a href="home.html" class="sidebar-text transition-opacity duration-300 text-2xl font-extrabold text-[#1B2559] whitespace-nowrap z-10">ART-AI</a>'''
        
        if '<button id="desktopSidebarToggle" class="group relative' not in html:
            html = logo_pattern.sub(new_logo, html)
            
            # Since some files might have <div class="h-24 instead of <a href="home.html"
            logo_pattern_2 = re.compile(r'<div class="h-24 flex items-center px-6 lg:px-8 relative">.*?<span class="sidebar-text transition-opacity duration-300 text-2xl font-extrabold text-\[#1B2559\]">ART-AI</span>', re.DOTALL)
            html = logo_pattern_2.sub(new_logo, html)

        # 3. Update JS Logic to toggle the icons
        # Find: toggleDesktopSidebar = () => {
        js_find = r'toggleDesktopSidebar = \(\) => \{'
        
        # We need to insert icon toggle logic
        # Inside Expand block:
        # document.getElementById('collapseIcon').classList.remove('hidden');
        # document.getElementById('expandIcon').classList.add('hidden');
        
        # Inside Collapse block:
        # document.getElementById('collapseIcon').classList.add('hidden');
        # document.getElementById('expandIcon').classList.remove('hidden');
        
        if 'document.getElementById(\'collapseIcon\')' not in html:
            html = html.replace('''sidebar.classList.remove('w-[88px]');''', '''sidebar.classList.remove('w-[88px]');
                    document.getElementById('collapseIcon').classList.remove('hidden');
                    document.getElementById('expandIcon').classList.add('hidden');''')
                    
            html = html.replace('''sidebar.classList.remove('w-[280px]');''', '''sidebar.classList.remove('w-[280px]');
                    document.getElementById('collapseIcon').classList.add('hidden');
                    document.getElementById('expandIcon').classList.remove('hidden');''')

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {filepath}")

if __name__ == '__main__':
    refactor_sidebar_header()
