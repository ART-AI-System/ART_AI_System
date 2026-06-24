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
    for filepath in glob.glob('mockups/lecturer/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        filename = os.path.basename(filepath)
        
        # Determine the correct dashboard link HTML
        correct_link = active_dashboard if filename == 'lecturer_dashboard.html' else inactive_dashboard
        
        # We only want to replace inside the <nav> block!
        nav_pattern = re.compile(r'(<nav[^>]*>.*?)(<a href="lecturer_dashboard\.html"[^>]*>.*?layout-dashboard.*?</a>)(.*?)</nav>', re.DOTALL)
        
        match = nav_pattern.search(html)
        if match:
            # Reconstruct the nav block with the correct link
            new_nav = match.group(1) + correct_link + match.group(3) + '</nav>'
            html = html[:match.start()] + new_nav + html[match.end():]
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"Fixed {filename}")
        else:
            print(f"No match in {filename}")

if __name__ == '__main__':
    fix_dashboard_links()
