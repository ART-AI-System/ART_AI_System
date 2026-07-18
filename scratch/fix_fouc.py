import glob
import re

def fix_fouc():
    for filepath in glob.glob('mockups/**/*.html', recursive=True):
        if 'student' in filepath or 'lecturer' in filepath:
            with open(filepath, 'r', encoding='utf-8') as f:
                html = f.read()

            pattern = re.compile(r'// Init state\s+if \(localStorage\.getItem\([\'"](sidebarCollapsed|lecturerSidebarCollapsed)[\'"]\) === [\'"]true[\'"] && window\.innerWidth >= 1024\) \{\s+toggleDesktopSidebar\(\);\s+\}', re.DOTALL)
            
            replacement = '''// Init state
            const storageKey = '%s';
            if (localStorage.getItem(storageKey) === 'true' && window.innerWidth >= 1024) {
                // Synchronously collapse without animations
                sidebar.classList.remove('w-[280px]', 'transition-all', 'duration-300');
                sidebar.classList.add('w-[88px]');
                
                mainContent.classList.remove('lg:ml-[280px]', 'transition-all', 'duration-300');
                mainContent.classList.add('lg:ml-[88px]');
                
                const collapseIcon = document.getElementById('collapseIcon');
                const expandIcon = document.getElementById('expandIcon');
                if (collapseIcon) collapseIcon.classList.add('hidden');
                if (expandIcon) expandIcon.classList.remove('hidden');
                
                sidebarTexts.forEach(el => {
                    el.classList.remove('transition-opacity', 'duration-300');
                    el.classList.add('opacity-0', 'hidden');
                });
                
                document.querySelectorAll('.collapsed-line').forEach(el => {
                    el.classList.remove('transition-opacity', 'duration-300', 'hidden');
                    el.classList.remove('opacity-0');
                });
                
                // Re-enable transitions after a tiny delay
                setTimeout(() => {
                    sidebar.classList.add('transition-all', 'duration-300');
                    mainContent.classList.add('transition-all', 'duration-300');
                    sidebarTexts.forEach(el => el.classList.add('transition-opacity', 'duration-300'));
                    document.querySelectorAll('.collapsed-line').forEach(el => el.classList.add('transition-opacity', 'duration-300'));
                }, 50);
            }'''
            
            def replace_func(match):
                key = match.group(1)
                return replacement % key
            
            new_html = pattern.sub(replace_func, html)
            
            if new_html != html:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_html)
                print(f"Updated {filepath}")

if __name__ == '__main__':
    fix_fouc()
