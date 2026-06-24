import glob
import re

new_logo = '''<!-- Mobile Sidebar Overlay -->
    <div id="sidebarOverlay" class="fixed inset-0 bg-gray-900/50 z-20 hidden lg:hidden transition-opacity duration-300 opacity-0"></div>

    <!-- LECTURER SIDEBAR (DARK THEME) -->
    <aside id="sidebar" class="sidebar-expanded w-[280px] bg-[#1B2559] fixed h-full shadow-[4px_0_24px_rgba(0,0,0,0.2)] border-r border-white/5 relative z-30 flex flex-col transition-all duration-300 -translate-x-full lg:translate-x-0">
        <!-- Logo -->
        <div class="h-24 flex items-center px-4 lg:px-6 relative overflow-hidden shrink-0 border-b border-white/10">
            <button id="desktopSidebarToggle" class="group relative w-10 h-10 rounded-xl fpt-orange-gradient flex items-center justify-center text-white mr-3 shrink-0 shadow-lg shadow-orange-500/30 overflow-hidden z-20 outline-none cursor-pointer border-none">
                <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:rotate-180 group-hover:opacity-0">
                    <i data-lucide="brain-circuit" class="w-6 h-6"></i>
                </div>
                <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 -rotate-180 opacity-0 group-hover:rotate-0 group-hover:opacity-100">
                    <i data-lucide="chevron-left" id="collapseIcon" class="w-6 h-6"></i>
                    <i data-lucide="chevron-right" id="expandIcon" class="w-6 h-6 hidden"></i>
                </div>
            </button>
            <a href="lecturer_dashboard.html" class="sidebar-text transition-opacity duration-300 text-2xl font-extrabold text-white tracking-tight whitespace-nowrap z-10 cursor-pointer hover:text-gray-200">ART-AI<span class="text-[#F26F21] text-xs align-top ml-1">LECTURER</span></a>
            
            <!-- Mobile Close Button -->
            <button id="mobileCloseSidebar" class="lg:hidden absolute right-4 text-white/50 hover:text-white z-20">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>'''

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
                    document.getElementById('collapseIcon').classList.remove('hidden');
                    document.getElementById('expandIcon').classList.add('hidden');
                    sidebar.classList.add('w-[280px]');
                    mainContent.classList.remove('lg:ml-[88px]');
                    mainContent.classList.add('lg:ml-[280px]');
                    sidebarTexts.forEach(el => {
                        el.classList.remove('hidden');
                        setTimeout(() => el.classList.remove('opacity-0'), 50);
                    });
                    document.querySelectorAll('.collapsed-line').forEach(el => {
                        el.classList.add('opacity-0');
                        setTimeout(() => el.classList.add('hidden'), 300);
                    });
                    localStorage.setItem('lecturerSidebarCollapsed', 'false');
                } else {
                    // Collapse
                    sidebar.classList.remove('w-[280px]');
                    document.getElementById('collapseIcon').classList.add('hidden');
                    document.getElementById('expandIcon').classList.remove('hidden');
                    sidebar.classList.add('w-[88px]');
                    mainContent.classList.remove('lg:ml-[280px]');
                    mainContent.classList.add('lg:ml-[88px]');
                    sidebarTexts.forEach(el => {
                        el.classList.add('opacity-0');
                        setTimeout(() => el.classList.add('hidden'), 300);
                    });
                    document.querySelectorAll('.collapsed-line').forEach(el => {
                        el.classList.remove('hidden');
                        setTimeout(() => el.classList.remove('opacity-0'), 50);
                    });
                    localStorage.setItem('lecturerSidebarCollapsed', 'true');
                }
            };

            if (desktopSidebarToggle) desktopSidebarToggle.addEventListener('click', toggleDesktopSidebar);

            // Init state
            if (localStorage.getItem('lecturerSidebarCollapsed') === 'true' && window.innerWidth >= 1024) {
                toggleDesktopSidebar();
            }
        });
    </script>
</body>'''

def wrap_nav_text(match):
    a_tag = match.group(0)
    if 'sidebar-text' in a_tag:
        return a_tag
    # Replace text like `Dashboard` with `<span class="sidebar-text transition-opacity duration-300 whitespace-nowrap">Dashboard</span>`
    return re.sub(r'</i>\s*([A-Za-z][A-Za-z\s]+)\s*(<span|</a>)', r'</i>\n                <span class="sidebar-text transition-opacity duration-300 whitespace-nowrap">\1</span>\n                \2', a_tag)

def refactor_lecturer_sidebar():
    for filepath in glob.glob('mockups/lecturer/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        # 1. Replace logo block and aside tag
        pattern = re.compile(r'<aside[^>]*>\s*<!-- Logo -->.*?<!-- Navigation', re.DOTALL)
        if pattern.search(html):
            html = pattern.sub(new_logo + '\\n\\n        <!-- Navigation', html)

        # 2. Main content class update
        main_pattern = re.compile(r'<main class="([^"]*)">')
        html = main_pattern.sub('<main id="mainContent" class="flex-1 ml-0 lg:ml-[280px] flex flex-col h-screen overflow-hidden relative transition-all duration-300">', html)
        
        # 3. Add Hamburger to Header
        # Inject the button BEFORE the title div
        button_html = '<div class="flex items-center">\\n                <button id="sidebarToggle" class="mr-4 p-2 text-gray-500 hover:text-[#F26F21] transition-colors rounded-lg hover:bg-orange-50 lg:hidden">\\n                    <i data-lucide="menu" class="w-6 h-6"></i>\\n                </button>\\n                <div>'
        html = re.sub(
            r'(<header[^>]*px-)10([^>]*>)\s*<div>\s*(<h1[^>]*>.*?</h1>)\s*(<p[^>]*>.*?</p>)\s*</div>',
            r'\g<1>4 lg:px-10\g<2>\n            ' + button_html + r'\n                    \g<3>\n                    \g<4>\n                </div>\n            </div>',
            html,
            flags=re.DOTALL
        )

        # 4. Wrap Navigation text
        nav_pattern = re.compile(r'<nav.*?</nav>', re.DOTALL)
        if nav_pattern.search(html):
            nav_html = nav_pattern.search(html).group(0)
            new_nav_html = re.sub(r'<a\s+href="[^"]*".*?</a>', wrap_nav_text, nav_html, flags=re.DOTALL)
            html = html.replace(nav_html, new_nav_html)

        # 5. Account Line
        account_pattern = re.compile(r'<div class="pt-8 pb-2">\s*<p class="px-4 text-xs font-bold text-blue-400 uppercase tracking-wider">Account</p>\s*</div>', re.DOTALL)
        new_account = '''<div class="pt-8 pb-2 relative flex items-center px-4">
                <p class="text-xs font-bold text-blue-400 uppercase tracking-wider sidebar-text transition-opacity duration-300 w-full">Account</p>
                <div class="absolute left-4 w-5 h-[2px] bg-white/20 rounded-full transition-opacity duration-300 opacity-0 hidden collapsed-line"></div>
            </div>'''
        html = account_pattern.sub(new_account, html)

        # 6. Append JS Logic
        if "document.addEventListener('DOMContentLoaded'" not in html:
            html = html.replace('</body>', js_logic)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {filepath}")

if __name__ == '__main__':
    refactor_lecturer_sidebar()
