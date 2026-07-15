import glob
import re

def refactor_sidebar_header():
    for filepath in glob.glob('mockups/student/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        # 1. Remove desktop hamburger from header
        desktop_toggle_pattern = re.compile(r'<button id="desktopSidebarToggle".*?<i data-lucide="menu" class="w-6 h-6"></i>\s*</button>', re.DOTALL)
        html = desktop_toggle_pattern.sub('', html)

        # 2. Refactor Logo area
        # We want to replace whatever is from `<div class="h-24...` or `<a href="home.html" class="h-24...` up to `ART-AI</span>` or `ART-AI</a>`
        
        logo_pattern = re.compile(r'<(div|a)[^>]*?class="[^"]*h-24[^"]*"[^>]*>.*?<span class="sidebar-text[^"]*">ART-AI</span>', re.DOTALL)
        
        # In case it was already partially replaced:
        logo_pattern_2 = re.compile(r'<(div|a)[^>]*?class="[^"]*h-24[^"]*"[^>]*>.*?<a href="home.html" class="sidebar-text[^"]*">ART-AI</a>', re.DOTALL)
        
        new_logo = '''<div class="h-24 flex items-center px-6 lg:px-8 relative overflow-hidden shrink-0">
            <button id="desktopSidebarToggle" class="group relative w-10 h-10 rounded-xl fpt-orange-gradient flex items-center justify-center text-white mr-3 shrink-0 shadow-lg shadow-orange-200 overflow-hidden z-20 outline-none cursor-pointer border-none">
                <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:rotate-180 group-hover:opacity-0">
                    <i data-lucide="brain-circuit" class="w-6 h-6"></i>
                </div>
                <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 -rotate-180 opacity-0 group-hover:rotate-0 group-hover:opacity-100">
                    <i data-lucide="chevron-left" id="collapseIcon" class="w-6 h-6"></i>
                    <i data-lucide="chevron-right" id="expandIcon" class="w-6 h-6 hidden"></i>
                </div>
            </button>
            <a href="home.html" class="sidebar-text transition-opacity duration-300 text-2xl font-extrabold text-[#1B2559] whitespace-nowrap z-10 cursor-pointer hover:text-[#4318FF]">ART-AI</a>'''
        
        if '<button id="desktopSidebarToggle" class="group relative' not in html:
            if logo_pattern.search(html):
                html = logo_pattern.sub(new_logo, html)
            elif logo_pattern_2.search(html):
                html = logo_pattern_2.sub(new_logo, html)
        else:
            # If it's already there, replace the new_logo with the updated new_logo
            current_logo_pattern = re.compile(r'<div class="h-24 flex items-center px-6 lg:px-8 relative overflow-hidden">.*?<a href="home\.html" class="sidebar-text[^>]*>ART-AI</a>', re.DOTALL)
            html = current_logo_pattern.sub(new_logo, html)

        # 3. Update JS Logic to toggle the icons
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
