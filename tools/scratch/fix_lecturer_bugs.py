import glob
import re

def fix_lecturer_bugs():
    for filepath in glob.glob('mockups/lecturer/*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        # 1. Remove 'relative' from <aside id="sidebar" ... relative ...>
        # Let's find the aside tag and remove 'relative' class.
        aside_pattern = re.compile(r'(<aside id="sidebar"[^>]*?)relative\s*([^>]*>)')
        html = aside_pattern.sub(r'\1\2', html)

        # 2. Hide badges when collapsed
        # Find badges: <span class="ml-auto ... rounded-full">12</span>
        # We just need to add 'sidebar-text transition-opacity duration-300' to the badge.
        # But wait, some badges don't have 'rounded-full' maybe?
        # Actually, let's just find `<span class="ml-auto bg-[#F26F21]` and inject `sidebar-text transition-opacity duration-300 `
        badge_pattern = re.compile(r'(<span class=")(ml-auto\s+bg-\[#F26F21\][^"]*)(">)')
        def add_sidebar_text_to_badge(match):
            if 'sidebar-text' not in match.group(2):
                return f'{match.group(1)}sidebar-text transition-opacity duration-300 {match.group(2)}{match.group(3)}'
            return match.group(0)
        html = badge_pattern.sub(add_sidebar_text_to_badge, html)

        # 3. Fix the overflow-hidden on the table wrapper
        # The wrapper is `<div class="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden">`
        # We need to change `overflow-hidden` to `overflow-visible`.
        # However, if the wrapper has overflow-visible, the rounded corners might not clip the table headers perfectly, but the table headers are rounded-t-[24px] or something.
        # Wait, if we just remove `overflow-hidden`, let's see.
        table_wrapper_pattern = re.compile(r'(<div class="[^"]*rounded-\[24px\][^"]*)overflow-hidden([^"]*">)')
        html = table_wrapper_pattern.sub(r'\1overflow-visible\2', html)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {filepath}")

if __name__ == '__main__':
    fix_lecturer_bugs()
