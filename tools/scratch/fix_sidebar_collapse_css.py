import glob
import re

css_to_add = '''
        /* Collapsed Sidebar styles */
        #sidebar.w-\\[88px\\] nav a {
            justify-content: center;
            padding-left: 0;
            padding-right: 0;
        }
        #sidebar.w-\\[88px\\] nav a i {
            margin-right: 0;
        }
'''

def fix_css():
    for filepath in glob.glob('mockups/**/*.html', recursive=True):
        if 'student' in filepath or 'lecturer' in filepath:
            with open(filepath, 'r', encoding='utf-8') as f:
                html = f.read()
            
            if '/* Collapsed Sidebar styles */' not in html:
                # Add before </style>
                html = html.replace('</style>', css_to_add + '    </style>')
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(html)
                print(f"Updated {filepath}")

if __name__ == '__main__':
    fix_css()
