import os
import re

def fix_submission_responsive_tabs_v2():
    filepath = 'mockups/student/submission.html'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Replace the #categoryTabs div
    # It starts with: <div class="flex items-center justify-between border-b border-gray-100 p-6 w-full bg-white shrink-0 z-20" id="categoryTabs">
    # It ends before: <!-- Main Content Area (Scrollable) -->
    tabs_pattern = re.compile(r'<div class="flex items-center justify-between border-b border-gray-100 p-6 w-full bg-white shrink-0 z-20" id="categoryTabs">.*?</div>\s*<!-- Main Content Area \(Scrollable\) -->', re.DOTALL)
    
    new_tabs_html = '''<div class="flex items-center justify-between border-b border-gray-100 p-4 w-full bg-white shrink-0 z-20" id="categoryTabs">
                                    <button class="tab-btn active flex items-center justify-center bg-blue-50 border border-[#4318FF] text-[#4318FF] rounded-full font-bold text-sm shadow-sm transition-all relative z-10 w-auto px-4 py-2" data-index="0" data-title="Decomposition" data-desc="Breaking down complex problems into smaller, manageable parts." data-icon="puzzle">
                                        <span class="num-badge w-6 h-6 rounded-full bg-[#4318FF] text-white flex items-center justify-center text-xs">1</span>
                                        <span class="tab-text whitespace-nowrap ml-2 block">Decomposition</span>
                                    </button>
                                    
                                    <div class="flex-1 h-[2px] bg-gray-100 relative mx-1 md:mx-2"></div>
                                    
                                    <button class="tab-btn flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-full font-medium text-sm transition-all border border-transparent relative z-10 w-10 h-10 p-0" data-index="1" data-title="Pattern Recognition" data-desc="Finding similarities or patterns among small, decomposed problems." data-icon="scan">
                                        <span class="num-badge w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">2</span>
                                        <span class="tab-text hidden whitespace-nowrap ml-2">Pattern Recognition</span>
                                    </button>
                                    
                                    <div class="flex-1 h-[2px] bg-gray-100 relative mx-1 md:mx-2"></div>
                                    
                                    <button class="tab-btn flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-full font-medium text-sm transition-all border border-transparent relative z-10 w-10 h-10 p-0" data-index="2" data-title="Abstraction" data-desc="Focusing on the important information only, ignoring irrelevant detail." data-icon="layers">
                                        <span class="num-badge w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">3</span>
                                        <span class="tab-text hidden whitespace-nowrap ml-2">Abstraction</span>
                                    </button>
                                    
                                    <div class="flex-1 h-[2px] bg-gray-100 relative mx-1 md:mx-2"></div>
                                    
                                    <button class="tab-btn flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-full font-medium text-sm transition-all border border-transparent relative z-10 w-10 h-10 p-0" data-index="3" data-title="Algorithmic Thinking" data-desc="Developing a step-by-step solution to the problem, or the rules to follow to solve the problem." data-icon="git-merge">
                                        <span class="num-badge w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">4</span>
                                        <span class="tab-text hidden whitespace-nowrap ml-2">Algorithmic Thinking</span>
                                    </button>
                                    
                                    <div class="flex-1 h-[2px] bg-gray-100 relative mx-1 md:mx-2"></div>
                                    
                                    <button class="tab-btn flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-full font-medium text-sm transition-all border border-transparent relative z-10 w-10 h-10 p-0" data-index="4" data-title="Reflection" data-desc="Reflecting on the solution to check if it is correct and efficient." data-icon="lightbulb">
                                        <span class="num-badge w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">5</span>
                                        <span class="tab-text hidden whitespace-nowrap ml-2">Reflection</span>
                                    </button>
                                </div>
                                
                                <!-- Main Content Area (Scrollable) -->'''
    
    html, num_subs = tabs_pattern.subn(new_tabs_html, html)
    print(f"Tabs replacement count: {num_subs}")

    # 2. Update the JS function updateUI
    js_pattern = re.compile(r'tabs\.forEach\(\(tab, i\) => \{.*?// Also update the content form title', re.DOTALL)
    
    new_js = '''tabs.forEach((tab, i) => {
                                            const tabIcon = tab.getAttribute('data-icon');
                                            const tabTitle = tab.getAttribute('data-title');
                                            const numBadge = tab.querySelector('.num-badge');
                                            const tabText = tab.querySelector('.tab-text');
                                            
                                            if (i === index) {
                                                tab.classList.add('active', 'bg-blue-50', 'border-[#4318FF]', 'text-[#4318FF]', 'shadow-sm', 'w-auto', 'px-4', 'py-2');
                                                tab.classList.remove('text-gray-500', 'hover:bg-gray-50', 'border-transparent', 'w-10', 'h-10', 'p-0');
                                                
                                                if (numBadge) {
                                                    numBadge.classList.replace('w-8', 'w-6');
                                                    numBadge.classList.replace('h-8', 'h-6');
                                                    numBadge.classList.replace('bg-gray-100', 'bg-[#4318FF]');
                                                    numBadge.classList.replace('text-gray-500', 'text-white');
                                                }
                                                
                                                if (tabText) {
                                                    tabText.classList.remove('hidden');
                                                    tabText.classList.add('block');
                                                }
                                            } else {
                                                tab.classList.remove('active', 'bg-blue-50', 'border-[#4318FF]', 'text-[#4318FF]', 'shadow-sm', 'w-auto', 'px-4', 'py-2');
                                                tab.classList.add('text-gray-500', 'hover:bg-gray-50', 'border-transparent', 'w-10', 'h-10', 'p-0');
                                                
                                                if (numBadge) {
                                                    numBadge.classList.replace('w-6', 'w-8');
                                                    numBadge.classList.replace('h-6', 'h-8');
                                                    numBadge.classList.replace('bg-[#4318FF]', 'bg-gray-100');
                                                    numBadge.classList.replace('text-white', 'text-gray-500');
                                                }
                                                
                                                if (tabText) {
                                                    tabText.classList.remove('block');
                                                    tabText.classList.add('hidden');
                                                }
                                            }
                                        });
                                        
                                        // Also update the content form title'''
                                        
    html, num_subs_js = js_pattern.subn(new_js, html)
    print(f"JS replacement count: {num_subs_js}")
    
    # Also fix JS nextBtn innerHTML to make sure it exists
    # And make sure there's no syntax errors in my string
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    fix_submission_responsive_tabs_v2()
