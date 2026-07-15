import os
import re

def refactor_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update <aside> and add overlay
    aside_pattern = re.compile(r'<aside class="w-\[280px\] bg-white fixed h-full z-20 flex flex-col shadow-\[4px_0_24px_rgba\(0,0,0,0\.02\)\] border-r border-gray-100">')
    
    new_aside = '''<!-- Mobile Sidebar Overlay -->
    <div id="sidebarOverlay" class="fixed inset-0 bg-gray-900/50 z-20 hidden lg:hidden transition-opacity duration-300 opacity-0"></div>

    <!-- Sidebar -->
    <aside id="sidebar" class="sidebar-expanded w-[280px] bg-white fixed h-full z-30 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100 transition-all duration-300 -translate-x-full lg:translate-x-0">'''
    html = aside_pattern.sub(new_aside, html)

    # 2. Update Logo area
    logo_pattern = re.compile(r'(<div class="h-24 flex items-center px-8 cursor-pointer">)(.*?)(<span class="text-2xl font-extrabold text-\[#1B2559\]">ART-AI</span>)(.*?)</div>', re.DOTALL)
    
    def replace_logo(match):
        pre = match.group(1).replace('px-8', 'px-6 lg:px-8')
        icon_div = match.group(2).replace('mr-3', 'mr-3 shrink-0')
        text = match.group(3).replace('class="', 'class="sidebar-text ')
        post = match.group(4)
        return pre + icon_div + text + post + '''
            <!-- Mobile Close Button -->
            <button id="mobileCloseSidebar" class="lg:hidden absolute right-4 text-gray-400 hover:text-gray-600">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>'''
    html = logo_pattern.sub(replace_logo, html)

    # 3. Update Sidebar links text
    link_pattern = re.compile(r'(<i data-lucide="[^"]+" class="w-5 h-5 mr-4[^"]*"></i>\s*)([A-Z][A-Za-z0-9 &]+)(?=\s*</a|\s*</div)')
    def replace_link(match):
        return match.group(1).replace('mr-4', 'mr-4 shrink-0') + f'<span class="sidebar-text whitespace-nowrap transition-opacity duration-300">{match.group(2).strip()}</span>'
    html = link_pattern.sub(replace_link, html)
    
    # 4. Update Main Wrapper
    main_pattern = re.compile(r'<main class="flex-1 ml-\[280px\] flex flex-col h-screen relative">')
    html = main_pattern.sub('<main id="mainContent" class="flex-1 ml-0 lg:ml-[280px] flex flex-col h-screen relative transition-all duration-300">', html)

    # 5. Update Header for Hamburger button
    header_pattern = re.compile(r'(<header class="h-24 bg-\[#F4F7FE\] flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">\s*<!-- Search & Semester -->\s*<div class="flex items-center space-x-6 w-full max-w-2xl">)')
    hamburger = '''<button id="sidebarToggle" class="mr-4 p-2 text-gray-500 hover:text-[#4318FF] transition-colors rounded-lg hover:bg-white lg:hidden">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>
                <button id="desktopSidebarToggle" class="mr-4 p-2 text-gray-500 hover:text-[#4318FF] transition-colors rounded-lg hover:bg-white hidden lg:block">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>'''
    
    def insert_hamburger(match):
        return match.group(1).replace('<div class="flex items-center space-x-6 w-full max-w-2xl">', f'<div class="flex items-center space-x-4 w-full max-w-2xl">\n                {hamburger}')
    html = header_pattern.sub(insert_hamburger, html)

    # 6. Add JS for sidebar logic before </body>
    js_logic = '''
    <script>
        // Sidebar Toggle Logic
        document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            const mobileCloseSidebar = document.getElementById('mobileCloseSidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            const desktopSidebarToggle = document.getElementById('desktopSidebarToggle');
            const sidebarTexts = document.querySelectorAll('.sidebar-text');
            const chevronIcons = document.querySelectorAll('.chevron-icon');

            // Mobile Sidebar
            const openMobileSidebar = () => {
                sidebar.classList.remove('-translate-x-full');
                sidebarOverlay.classList.remove('hidden');
                setTimeout(() => sidebarOverlay.classList.remove('opacity-0'), 10);
            };

            const closeMobileSidebar = () => {
                sidebar.classList.add('-translate-x-full');
                sidebarOverlay.classList.add('opacity-0');
                setTimeout(() => sidebarOverlay.classList.add('hidden'), 300);
            };

            if (sidebarToggle) sidebarToggle.addEventListener('click', openMobileSidebar);
            if (mobileCloseSidebar) mobileCloseSidebar.addEventListener('click', closeMobileSidebar);
            if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileSidebar);

            // Desktop Sidebar Collapse
            const toggleDesktopSidebar = () => {
                const isCollapsed = sidebar.classList.contains('w-[88px]');
                if (isCollapsed) {
                    // Expand
                    sidebar.classList.remove('w-[88px]');
                    sidebar.classList.add('w-[280px]');
                    mainContent.classList.remove('lg:ml-[88px]');
                    mainContent.classList.add('lg:ml-[280px]');
                    sidebarTexts.forEach(el => {
                        el.classList.remove('hidden');
                        setTimeout(() => el.classList.remove('opacity-0'), 50);
                    });
                    chevronIcons.forEach(el => el.classList.remove('hidden'));
                    localStorage.setItem('sidebarCollapsed', 'false');
                } else {
                    // Collapse
                    sidebar.classList.remove('w-[280px]');
                    sidebar.classList.add('w-[88px]');
                    mainContent.classList.remove('lg:ml-[280px]');
                    mainContent.classList.add('lg:ml-[88px]');
                    sidebarTexts.forEach(el => {
                        el.classList.add('opacity-0');
                        setTimeout(() => el.classList.add('hidden'), 300);
                    });
                    chevronIcons.forEach(el => el.classList.add('hidden'));
                    localStorage.setItem('sidebarCollapsed', 'true');
                }
            };

            if (desktopSidebarToggle) desktopSidebarToggle.addEventListener('click', toggleDesktopSidebar);

            // Init state
            if (localStorage.getItem('sidebarCollapsed') === 'true' && window.innerWidth >= 1024) {
                toggleDesktopSidebar();
            }
        });
    </script>
</body>'''
    if 'Sidebar Toggle Logic' not in html:
        html = html.replace('</body>', js_logic)

    with open('test_home.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    refactor_file('mockups/student/home.html')
