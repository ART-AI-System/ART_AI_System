import glob
import re

def fix_lecturer_aside():
    for filepath in glob.glob('mockups/lecturer/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        # Fix aside missing ID and relative positioning
        # Replace <aside class="w-[280px] bg-[#1B2559] flex flex-col h-full shadow-2xl relative z-20">
        # with <aside id="sidebar" class="w-[280px] bg-[#1B2559] flex flex-col h-full shadow-2xl fixed z-30 transition-all duration-300">
        pattern = re.compile(r'<aside class="w-\[280px\] bg-\[#1B2559\] flex flex-col h-full shadow-2xl relative z-20[^"]*">')
        html = pattern.sub('<aside id="sidebar" class="w-[280px] bg-[#1B2559] flex flex-col h-full shadow-2xl fixed z-30 transition-all duration-300">', html)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Fixed aside in {filepath}")

if __name__ == '__main__':
    fix_lecturer_aside()
