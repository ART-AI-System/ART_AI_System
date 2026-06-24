import glob
import re

def fix_logo_and_account():
    for filepath in glob.glob('mockups/student/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        # 1. Logo alignment
        # <div class="h-24 flex items-center px-6 lg:px-8 relative overflow-hidden shrink-0">
        logo_pattern = re.compile(r'<div class="h-24 flex items-center px-6 lg:px-8 relative overflow-hidden shrink-0">')
        html = logo_pattern.sub('<div class="h-24 flex items-center px-4 lg:px-6 relative overflow-hidden shrink-0">', html)

        # 2. Account text replacement
        # <div class="pt-8 pb-2">
        #     <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
        # </div>
        # OR
        # <div class="pt-8 pb-2">
        #     <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider sidebar-text transition-opacity duration-300">Account</p>
        # </div>
        account_pattern = re.compile(r'<div class="pt-8 pb-2">\s*<p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider[^>]*>Account</p>\s*</div>', re.DOTALL)
        
        new_account = '''<div class="pt-8 pb-2 relative flex items-center px-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider sidebar-text transition-opacity duration-300 w-full">Account</p>
                <div class="absolute left-6 w-5 h-[2px] bg-gray-300 rounded-full transition-opacity duration-300 opacity-0 hidden collapsed-line"></div>
            </div>'''
        
        html = account_pattern.sub(new_account, html)

        # 3. JS Logic for collapsed-line
        if 'collapsed-line' in html and 'document.querySelectorAll(\'.collapsed-line\')' not in html:
            # Expand
            expand_js = '''sidebarTexts.forEach(el => {
                        el.classList.remove('hidden');
                        setTimeout(() => el.classList.remove('opacity-0'), 50);
                    });
                    document.querySelectorAll('.collapsed-line').forEach(el => {
                        el.classList.add('opacity-0');
                        setTimeout(() => el.classList.add('hidden'), 300);
                    });'''
            html = html.replace('''sidebarTexts.forEach(el => {
                        el.classList.remove('hidden');
                        setTimeout(() => el.classList.remove('opacity-0'), 50);
                    });''', expand_js)

            # Collapse
            collapse_js = '''sidebarTexts.forEach(el => {
                        el.classList.add('opacity-0');
                        setTimeout(() => el.classList.add('hidden'), 300);
                    });
                    document.querySelectorAll('.collapsed-line').forEach(el => {
                        el.classList.remove('hidden');
                        setTimeout(() => el.classList.remove('opacity-0'), 50);
                    });'''
            html = html.replace('''sidebarTexts.forEach(el => {
                        el.classList.add('opacity-0');
                        setTimeout(() => el.classList.add('hidden'), 300);
                    });''', collapse_js)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {filepath}")

if __name__ == '__main__':
    fix_logo_and_account()
