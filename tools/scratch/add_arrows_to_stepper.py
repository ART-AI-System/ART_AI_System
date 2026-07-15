import os
import re

def add_arrows_to_stepper():
    filepath = 'mockups/student/submission.html'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Add the tab-separator class to separators
    html = html.replace(
        '<div class="flex-1 h-[2px] bg-gray-100 relative mx-1 md:mx-2"></div>',
        '<div class="flex-1 h-[2px] bg-gray-100 relative mx-1 md:mx-2 flex items-center justify-center tab-separator"></div>'
    )

    # Update the JS updateUI function
    js_to_find = '''const tabText = tab.querySelector('.tab-text');'''
    js_to_add = '''const tabText = tab.querySelector('.tab-text');
                                            
                                            // Handle arrow visibility
                                            const separators = document.querySelectorAll('.tab-separator');
                                            separators.forEach((sep, sepIndex) => {
                                                if (sepIndex === currentIndex) {
                                                    sep.innerHTML = '<i data-lucide="chevron-right" class="w-4 h-4 text-[#4318FF] bg-white px-0.5"></i>';
                                                } else if (sepIndex === currentIndex - 1) {
                                                    sep.innerHTML = '<i data-lucide="chevron-left" class="w-4 h-4 text-[#4318FF] bg-white px-0.5"></i>';
                                                } else {
                                                    sep.innerHTML = '';
                                                }
                                            });'''
                                            
    if js_to_find in html and js_to_add not in html:
        html = html.replace(js_to_find, js_to_add)

    # Make sure we re-render lucide icons after adding the html dynamically
    # Wait, the lucide.createIcons(); is already at the end of updateUI!
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    add_arrows_to_stepper()
