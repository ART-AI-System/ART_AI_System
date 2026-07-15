import glob
import re

def fix_tables():
    for filepath in glob.glob('mockups/student/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        if '<table' in html and 'overflow-x-auto' not in html:
            # We want to wrap `<table...` with `<div class="overflow-x-auto w-full"><table...`
            # and `</table>` with `</table></div>`
            
            # Match `<table` up to `</table>`
            # Since there could be multiple tables, we can do re.sub
            table_pattern = re.compile(r'(<table.*?>.*?</table>)', re.DOTALL)
            html = table_pattern.sub(r'<div class="overflow-x-auto w-full">\n\1\n</div>', html)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"Fixed tables in {filepath}")

if __name__ == '__main__':
    fix_tables()
