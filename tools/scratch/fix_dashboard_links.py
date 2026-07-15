import glob
import re
import os

active_dashboard = '''<a href="lecturer_dashboard.html" class="flex items-center px-4 py-3.5 bg-white/10 text-white font-bold rounded-xl transition-all relative">
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>
                <i data-lucide="layout-dashboard" class="w-5 h-5 mr-4 text-[#F26F21]"></i>
                <span class="sidebar-text transition-opacity duration-300 whitespace-nowrap">Dashboard
            </span>
                </a>'''

inactive_dashboard = '''<a href="lecturer_dashboard.html" class="flex items-center px-4 py-3.5 text-blue-200 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5">
                <i data-lucide="layout-dashboard" class="w-5 h-5 mr-4 opacity-70"></i>
                <span class="sidebar-text transition-opacity duration-300 whitespace-nowrap">Dashboard
            </span>
                </a>'''

def fix_dashboard_links():
    pattern = re.compile(r'<a href="lecturer_dashboard\.html".*?</a>', re.DOTALL)
    
    for filepath in glob.glob('mockups/lecturer/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        filename = os.path.basename(filepath)
        
        # Determine the correct dashboard link HTML
        correct_link = active_dashboard if filename == 'lecturer_dashboard.html' else inactive_dashboard
        
        # We need to only replace the FIRST occurrence in the sidebar <nav>
        # Wait, there's another "lecturer_dashboard.html" link in the Logo at the top!
        # The Logo link does not have <i data-lucide="layout-dashboard"> inside it.
        # Let's adjust the regex to match only the navigation link which contains layout-dashboard
        
        nav_link_pattern = re.compile(r'<a href="lecturer_dashboard\.html"[^>]*>.*?layout-dashboard.*?</a>', re.DOTALL)
        
        html = nav_link_pattern.sub(correct_link, html)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
            
        print(f"Fixed {filename}")

if __name__ == '__main__':
    fix_dashboard_links()
