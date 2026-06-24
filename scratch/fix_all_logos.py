import glob
import re

new_logo = '''<!-- Logo -->
        <div class="h-24 flex items-center px-4 lg:px-6 relative overflow-hidden shrink-0">
            <button id="desktopSidebarToggle" class="group relative w-10 h-10 rounded-xl fpt-orange-gradient flex items-center justify-center text-white mr-3 shrink-0 shadow-lg shadow-orange-200 overflow-hidden z-20 outline-none cursor-pointer border-none">
                <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:rotate-180 group-hover:opacity-0">
                    <i data-lucide="brain-circuit" class="w-6 h-6"></i>
                </div>
                <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 -rotate-180 opacity-0 group-hover:rotate-0 group-hover:opacity-100">
                    <i data-lucide="chevron-left" id="collapseIcon" class="w-6 h-6"></i>
                    <i data-lucide="chevron-right" id="expandIcon" class="w-6 h-6 hidden"></i>
                </div>
            </button>
            <a href="home.html" class="sidebar-text transition-opacity duration-300 text-2xl font-extrabold text-[#1B2559] whitespace-nowrap z-10 cursor-pointer hover:text-[#4318FF]">ART-AI</a>
            
            <!-- Mobile Close Button -->
            <button id="mobileCloseSidebar" class="lg:hidden absolute right-4 text-gray-400 hover:text-gray-600 z-20">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>'''

def fix_all_logos():
    for filepath in glob.glob('mockups/student/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # 1. Force replace Logo block in all files using HTML comments boundary
        pattern = re.compile(r'<!-- Logo -->.*?<!-- Navigation -->', re.DOTALL)
        html = pattern.sub(new_logo + '\n        \n        <!-- Navigation -->', html)
        
        # 2. Fix the account line alignment (left-6 -> left-4)
        account_line_pattern = re.compile(r'<div class="absolute left-6 w-5 h-\[2px\] bg-gray-300 rounded-full')
        html = account_line_pattern.sub('<div class="absolute left-4 w-5 h-[2px] bg-gray-300 rounded-full', html)

        # 3. Ensure the old header toggle is removed
        header_pattern = re.compile(r'(<header.*?</header>)', re.DOTALL)
        def remove_header_toggle(match):
            header_html = match.group(1)
            header_toggle = re.compile(r'<button id="desktopSidebarToggle"[^>]*>.*?</button>', re.DOTALL)
            return header_toggle.sub('', header_html)
        html = header_pattern.sub(remove_header_toggle, html)
        
        # 4. Ensure the JS icon toggle logic exists (some files might not have it if they were skipped)
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
    fix_all_logos()
