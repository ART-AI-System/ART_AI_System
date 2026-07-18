import re

def replace_popovers():
    with open('mockups/lecturer/lecturer_grading_list.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # The 5-step table HTML
    table_html = '''
                                        <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden mt-3">
                                            <table class="w-full text-left text-[11px] text-gray-600">
                                                <thead class="bg-gray-100/50 border-b border-gray-200 font-bold text-gray-500 uppercase">
                                                    <tr>
                                                        <th class="px-3 py-2 w-1/4">Phase</th>
                                                        <th class="px-3 py-2 w-1/4">Prompt/Input</th>
                                                        <th class="px-3 py-2 w-2/4">AI Output</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-gray-100 bg-white">
                                                    <tr>
                                                        <td class="px-3 py-2 font-bold text-[#1B2559]">1. Decomposition</td>
                                                        <td class="px-3 py-2 italic text-gray-500">"Break down an e-commerce cart system."</td>
                                                        <td class="px-3 py-2">Suggested 4 components: Cart, Session, DB, UI.</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="px-3 py-2 font-bold text-[#1B2559]">2. Pattern Recognition</td>
                                                        <td class="px-3 py-2 italic text-gray-500">"MVC pattern for cart"</td>
                                                        <td class="px-3 py-2">Provided MVC file structure for Java Servlet.</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="px-3 py-2 font-bold text-[#1B2559]">3. Abstraction</td>
                                                        <td class="px-3 py-2 italic text-gray-500">"Cart Interface methods"</td>
                                                        <td class="px-3 py-2">add(), remove(), checkout(), getTotal().</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="px-3 py-2 font-bold text-[#1B2559]">4. Algorithm Design</td>
                                                        <td class="px-3 py-2 italic text-gray-500">"Session logic for cart"</td>
                                                        <td class="px-3 py-2">HttpSession.setAttribute() snippet.</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="px-3 py-2 font-bold text-[#1B2559]">5. Self-Reflection</td>
                                                        <td class="px-3 py-2 italic text-gray-500" colspan="2">"I used AI to understand how Session works in Servlets, but I implemented the checkout calculation myself to handle edge cases."</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>'''

    def sub_func(match):
        pre = match.group(1) # width class, e.g. w-[350px]
        return 'w-[550px]'
        
    # Replace the w-[350px] with w-[550px]
    html = re.sub(r'(w-\[350px\])', r'w-[550px]', html)
    
    # Replace AI Breakdown title with Student's AI Declaration
    html = html.replace('AI Breakdown', 'Student\'s AI Declaration (5 Steps)')
    
    # Now replace the inner <div class="space-y-3"> with our table
    pattern = re.compile(r'<div class="space-y-3">.*?<!-- Row 5 -->.*?</div>\s*</div>\s*</div>', re.DOTALL)
    html = pattern.sub(table_html + '\n                                    </div>', html)

    with open('mockups/lecturer/lecturer_grading_list.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Replaced popovers successfully.")

if __name__ == '__main__':
    replace_popovers()
