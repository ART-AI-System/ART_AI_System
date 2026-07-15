import glob
import re

fouc_script = '''
    <script>
        (function() {
            const isLecturer = window.location.pathname.includes('lecturer_') || window.location.pathname.includes('lecturer/');
            const storageKey = isLecturer ? 'lecturerSidebarCollapsed' : 'sidebarCollapsed';
            if (localStorage.getItem(storageKey) === 'true' && window.innerWidth >= 1024) {
                document.write('<style id="fouc-fix">#sidebar { width: 88px !important; } #mainContent { margin-left: 88px !important; } .sidebar-text { display: none !important; } #collapseIcon { display: none !important; } #expandIcon { display: block !important; }</style>');
            }
        })();
    </script>
'''

def fix_fouc_head():
    for filepath in glob.glob('mockups/**/*.html', recursive=True):
        if 'student' in filepath or 'lecturer' in filepath:
            with open(filepath, 'r', encoding='utf-8') as f:
                html = f.read()
            
            # Inject fouc_script right before </head> if not already there
            if 'id="fouc-fix"' not in html:
                html = html.replace('</head>', fouc_script + '</head>')
            
            # Update the Init state to remove fouc-fix
            pattern = re.compile(r"document\.querySelectorAll\('\.collapsed-line'\)\.forEach\(el => el\.classList\.add\('transition-opacity', 'duration-300'\)\);\s*\}, 50\);")
            
            replacement = '''document.querySelectorAll('.collapsed-line').forEach(el => el.classList.add('transition-opacity', 'duration-300'));
                    const foucFix = document.getElementById('fouc-fix');
                    if (foucFix) foucFix.remove();
                }, 50);'''
                
            html = pattern.sub(replacement, html)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"Updated {filepath}")

if __name__ == '__main__':
    fix_fouc_head()
