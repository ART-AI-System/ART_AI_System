import re

def add_ai_popovers():
    with open('mockups/lecturer/lecturer_grading_list.html', 'r', encoding='utf-8') as f:
        html = f.read()

    popover_html = '''
                                    <!-- POPOVER -->
                                    <div class="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-[350px] bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none before:absolute before:right-[-8px] before:top-1/2 before:-translate-y-1/2 before:border-l-8 before:border-l-white before:border-y-8 before:border-y-transparent">
                                        <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-50">
                                            <h4 class="text-sm font-extrabold text-[#1B2559] flex items-center"><i data-lucide="scan-eye" class="w-4 h-4 mr-2 text-[#F26F21]"></i> AI Breakdown</h4>
                                            <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase">Quick View</span>
                                        </div>
                                        <div class="space-y-3">
                                            <!-- Row 1 -->
                                            <div class="flex items-center justify-between text-xs">
                                                <span class="text-gray-500 font-medium w-1/2">Logic & Structure</span>
                                                <div class="flex items-center space-x-2 w-1/2 justify-end">
                                                    <span class="text-gray-400">Dec: <strong class="text-gray-800">Low</strong></span>
                                                    <span class="text-gray-300">|</span>
                                                    <span class="text-gray-400">Det: <strong class="{det_color}">High</strong></span>
                                                </div>
                                            </div>
                                            <!-- Row 2 -->
                                            <div class="flex items-center justify-between text-xs">
                                                <span class="text-gray-500 font-medium w-1/2">Vocab & Syntax</span>
                                                <div class="flex items-center space-x-2 w-1/2 justify-end">
                                                    <span class="text-gray-400">Dec: <strong class="text-gray-800">None</strong></span>
                                                    <span class="text-gray-300">|</span>
                                                    <span class="text-gray-400">Det: <strong class="{det_color}">High</strong></span>
                                                </div>
                                            </div>
                                            <!-- Row 3 -->
                                            <div class="flex items-center justify-between text-xs">
                                                <span class="text-gray-500 font-medium w-1/2">Code Formatting</span>
                                                <div class="flex items-center space-x-2 w-1/2 justify-end">
                                                    <span class="text-gray-400">Dec: <strong class="text-gray-800">High</strong></span>
                                                    <span class="text-gray-300">|</span>
                                                    <span class="text-gray-400">Det: <strong class="{det_color}">High</strong></span>
                                                </div>
                                            </div>
                                            <!-- Row 4 -->
                                            <div class="flex items-center justify-between text-xs">
                                                <span class="text-gray-500 font-medium w-1/2">Commit Patterns</span>
                                                <div class="flex items-center space-x-2 w-1/2 justify-end">
                                                    <span class="text-gray-400">Dec: <strong class="text-gray-800">None</strong></span>
                                                    <span class="text-gray-300">|</span>
                                                    <span class="text-gray-400">Det: <strong class="{det_color}">Med</strong></span>
                                                </div>
                                            </div>
                                            <!-- Row 5 -->
                                            <div class="flex items-center justify-between text-xs">
                                                <span class="text-gray-500 font-medium w-1/2">Problem Solving</span>
                                                <div class="flex items-center space-x-2 w-1/2 justify-end">
                                                    <span class="text-gray-400">Dec: <strong class="text-gray-800">Low</strong></span>
                                                    <span class="text-gray-300">|</span>
                                                    <span class="text-gray-400">Det: <strong class="{det_color}">High</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>'''

    def replace_block(match):
        bg_class = match.group(1) # e.g. bg-red-50, bg-green-50
        border_class = match.group(2)
        inner_content = match.group(3)

        color_prefix = "red" if "red" in bg_class else "green" if "green" in bg_class else "gray"
        det_color = f"text-{color_prefix}-600"
        icon_color = f"text-{color_prefix}-400 group-hover:text-{color_prefix}-600"
        
        # Determine values for the specific case
        if "red" in color_prefix:
            popover = popover_html.format(det_color=det_color)
        elif "green" in color_prefix:
            popover = popover_html.format(det_color=det_color).replace('High', 'Med').replace('Med', 'Low')
        else:
            popover = popover_html.format(det_color=det_color).replace('High', 'None').replace('Med', 'None')

        return f'''<div class="group relative">
                                    <div class="{bg_class} {border_class} rounded-xl p-2 relative overflow-hidden pr-8 cursor-pointer hover:shadow-md transition-all border border-transparent group-hover:border-{color_prefix}-300">
                                        <!-- Eye Icon -->
                                        <div class="absolute right-2 top-1/2 -translate-y-1/2 {icon_color} transition-colors opacity-50 group-hover:opacity-100">
                                            <i data-lucide="eye" class="w-4 h-4"></i>
                                        </div>
{inner_content}
                                    </div>
{popover}
                                </div>'''

    # Pattern to match the existing block:
    # <div class="(bg-[a-z]+-50) (border border-[a-z]+-100) rounded-xl p-2 relative overflow-hidden">(.*?)</div>
    # But inner content might contain other divs.
    pattern = re.compile(r'<div class="(bg-[a-z]+-50) (border border-[a-z]+-(?:100|200)) rounded-xl p-2 relative overflow-hidden">\s*(<div class="absolute left-0 top-0 bottom-0 w-1.*?\s*</div>\s*</div>\s*</div>\s*</div>)', re.DOTALL)
    
    html = pattern.sub(replace_block, html)

    with open('mockups/lecturer/lecturer_grading_list.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated popover!")

if __name__ == '__main__':
    add_ai_popovers()
