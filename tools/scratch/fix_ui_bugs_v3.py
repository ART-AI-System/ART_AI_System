import glob
import re

css_to_add = '''
        /* Collapsed Sidebar styles */
        #sidebar.w-\\[88px\\] nav a {
            justify-content: center !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
        }
        #sidebar.w-\\[88px\\] nav a svg {
            margin-right: 0 !important;
            margin-left: 0 !important;
        }
        #sidebar.w-\\[88px\\] nav a .sidebar-text {
            display: none !important;
        }
'''

def fix_sidebar_css():
    for filepath in glob.glob('mockups/**/*.html', recursive=True):
        if 'student' in filepath or 'lecturer' in filepath:
            with open(filepath, 'r', encoding='utf-8') as f:
                html = f.read()
            
            # Remove old css
            html = re.sub(r'/\* Collapsed Sidebar styles \*/.*?(?=</style>)', '', html, flags=re.DOTALL)
            
            # Add new css
            html = html.replace('</style>', css_to_add + '    </style>')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"Updated CSS in {filepath}")

def fix_ai_audit_overflow():
    filepath = 'mockups/lecturer/lecturer_grading_list.html'
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace overflow-hidden with overflow-visible in the AI Audit boxes
    # The boxes have classes like:
    # bg-red-50 border border-red-100 rounded-xl p-2 relative overflow-hidden pr-8 cursor-pointer
    html = html.replace('relative overflow-hidden pr-8 cursor-pointer', 'relative overflow-visible pr-8 cursor-pointer')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Fixed overflow in {filepath}")

if __name__ == '__main__':
    fix_sidebar_css()
    fix_ai_audit_overflow()
