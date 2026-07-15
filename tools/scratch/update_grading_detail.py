import re

def update_grading_detail():
    with open('mockups/lecturer/lecturer_grading_detail.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add "Request Resubmit" Button to header
    header_buttons = '''
        <div class="flex items-center space-x-3">
            <button class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-100 transition-all flex items-center">
                <i data-lucide="refresh-ccw" class="w-4 h-4 mr-2"></i> Request Resubmit
            </button>
            <button class="px-4 py-2 bg-white/10 text-white border border-white/20 text-xs font-bold rounded-lg hover:bg-white/20 transition-all flex items-center">
                <i data-lucide="save" class="w-4 h-4 mr-2"></i> Save Draft
            </button>
            <button class="px-4 py-2 bg-[#F26F21] text-white text-xs font-bold rounded-lg hover:bg-[#D95D1A] transition-all shadow-lg shadow-orange-500/30 flex items-center">
                <i data-lucide="send" class="w-4 h-4 mr-2"></i> Publish Grade
            </button>
        </div>
    '''
    html = re.sub(r'<div class="flex items-center space-x-3">.*?</div>\s*</header>', header_buttons + '\n    </header>', html, flags=re.DOTALL)

    # 2. Add PDF View Mockup (toggleable)
    toolbar_replacement = '''
            <!-- Toolbar -->
            <div class="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 justify-between">
                <div class="flex items-center space-x-2 text-sm text-gray-600 font-medium">
                    <button class="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold shadow-sm hover:bg-gray-50" onclick="document.getElementById('code-view').classList.remove('hidden'); document.getElementById('pdf-view').classList.add('hidden');">Code View</button>
                    <button class="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold shadow-sm hover:bg-gray-50" onclick="document.getElementById('code-view').classList.add('hidden'); document.getElementById('pdf-view').classList.remove('hidden');">Document View</button>
                    <span class="mx-2 text-gray-300">|</span>
                    <i data-lucide="file-code-2" class="w-4 h-4 text-[#F26F21]"></i>
                    <span class="font-bold text-[#1B2559]">CartServlet.java</span>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="p-1.5 text-gray-500 hover:text-[#1B2559] hover:bg-gray-200 rounded transition-colors" title="Download File"><i data-lucide="download" class="w-4 h-4"></i></button>
                    <button class="p-1.5 text-gray-500 hover:text-[#1B2559] hover:bg-gray-200 rounded transition-colors" title="Toggle File Tree" onclick="document.getElementById('file-tree').classList.toggle('hidden')"><i data-lucide="sidebar" class="w-4 h-4"></i></button>
                </div>
            </div>
    '''
    html = re.sub(r'<!-- Toolbar -->.*?</div>\s*<!-- Code Editor Workspace -->', toolbar_replacement + '\n\n            <!-- Code Editor Workspace -->', html, flags=re.DOTALL)

    pdf_view = '''
                <!-- PDF Document View -->
                <div id="pdf-view" class="flex-1 overflow-auto bg-gray-200 p-8 hidden flex justify-center">
                    <div class="bg-white w-[800px] h-[1100px] shadow-2xl p-12 text-gray-800">
                        <h1 class="text-3xl font-bold mb-6 border-b pb-4">Architecture Design Report</h1>
                        <p class="mb-4">This document outlines the system architecture...</p>
                        <div class="bg-gray-100 h-64 flex items-center justify-center border border-gray-300 mb-4 text-gray-400">
                            [Diagram Image Mockup]
                        </div>
                        <p>As seen in the diagram above, the client connects to the Load Balancer...</p>
                    </div>
                </div>
    '''
    # Insert before <div class="flex-1 overflow-auto thin-scrollbar bg-white p-4">
    html = html.replace('<!-- Code View -->', '<!-- Code View -->\n                <div id="code-view" class="flex-1 flex flex-col h-full">')
    html = html.replace('</table>\n                </div>', '</table>\n                </div>\n                </div>\n' + pdf_view)


    # 3. Modify AI Tab to show the full table
    ai_table = '''
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Student's AI Declaration (5 Steps)</h3>
                
                <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
                    <table class="w-full text-left text-sm text-gray-600">
                        <thead class="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th class="px-4 py-3 w-1/5">Phase</th>
                                <th class="px-4 py-3 w-2/5">Prompt/Input</th>
                                <th class="px-4 py-3 w-2/5">AI Output/Suggestion</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr>
                                <td class="px-4 py-3 font-bold text-[#1B2559]">1. Decomposition</td>
                                <td class="px-4 py-3 text-xs italic">"Break down an e-commerce cart system."</td>
                                <td class="px-4 py-3 text-xs">Suggested 4 components: Cart, Session, DB, UI.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-bold text-[#1B2559]">2. Pattern Recognition</td>
                                <td class="px-4 py-3 text-xs italic">"MVC pattern for cart"</td>
                                <td class="px-4 py-3 text-xs">Provided MVC file structure for Java Servlet.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-bold text-[#1B2559]">3. Abstraction</td>
                                <td class="px-4 py-3 text-xs italic">"Cart Interface methods"</td>
                                <td class="px-4 py-3 text-xs">add(), remove(), checkout(), getTotal().</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-bold text-[#1B2559]">4. Algorithm Design</td>
                                <td class="px-4 py-3 text-xs italic">"Session logic for cart"</td>
                                <td class="px-4 py-3 text-xs">HttpSession.setAttribute() snippet.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-bold text-[#1B2559]">5. Self-Reflection</td>
                                <td class="px-4 py-3 text-xs italic" colspan="2">"I used AI to understand how Session works in Servlets, but I implemented the checkout calculation myself to handle edge cases."</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Lecturer Evaluation -->
                <div class="border-t border-gray-200 pt-6">
                    <label class="block text-sm font-bold text-[#1B2559] mb-2">Lecturer's Verification</label>
                    <div class="flex space-x-4 mb-3">
                        <label class="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                            <input type="radio" name="overall_verify" class="text-green-500 focus:ring-green-500"> <span>Accept</span>
                        </label>
                        <label class="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                            <input type="radio" name="overall_verify" class="text-red-500 focus:ring-red-500" checked> <span>Reject / Invalid</span>
                        </label>
                    </div>
                    <textarea rows="3" class="w-full bg-white border border-red-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 mb-6" placeholder="Add comment...">This reflection does not align with the system detection. You used AI for the core logic as well, not just the Session boilerplate.</textarea>
                </div>
    '''
    html = re.sub(r'<h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Student\'s Declaration \(1/1 Pair\)</h3>.*?<!-- Overall AI Feedback -->', ai_table + '\n                <!-- Overall AI Feedback -->', html, flags=re.DOTALL)

    # 4. JS for realtime score
    # Look at the sliders
    sliders_html = '''
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                    <span>Functionality (40%)</span>
                                    <span id="score-func-val">0 / 4.0</span>
                                </div>
                                <input type="range" id="score-func" min="0" max="4" step="0.5" value="0" class="w-full accent-[#4318FF]" oninput="updateScore()">
                            </div>
                            <div>
                                <div class="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                    <span>Code Quality (30%)</span>
                                    <span id="score-code-val">0 / 3.0</span>
                                </div>
                                <input type="range" id="score-code" min="0" max="3" step="0.5" value="0" class="w-full accent-[#4318FF]" oninput="updateScore()">
                            </div>
                            <div>
                                <div class="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                    <span>Documentation (30%)</span>
                                    <span id="score-doc-val">0 / 3.0</span>
                                </div>
                                <input type="range" id="score-doc" min="0" max="3" step="0.5" value="0" class="w-full accent-[#4318FF]" oninput="updateScore()">
                            </div>
                        </div>
    '''
    html = re.sub(r'<div class="space-y-4">.*?</div>\s*</div>\s*<!-- Overall Feedback -->', sliders_html + '\n                    </div>\n\n                    <!-- Overall Feedback -->', html, flags=re.DOTALL)
    
    html = html.replace('placeholder="-"', 'id="final-score" readonly placeholder="0.0"')
    
    js_func = '''
        function updateScore() {
            const func = parseFloat(document.getElementById('score-func').value);
            const code = parseFloat(document.getElementById('score-code').value);
            const doc = parseFloat(document.getElementById('score-doc').value);
            
            document.getElementById('score-func-val').innerText = func.toFixed(1) + ' / 4.0';
            document.getElementById('score-code-val').innerText = code.toFixed(1) + ' / 3.0';
            document.getElementById('score-doc-val').innerText = doc.toFixed(1) + ' / 3.0';
            
            const total = func + code + doc;
            document.getElementById('final-score').value = total.toFixed(1);
        }
    '''
    html = html.replace('function switchTab(tabName) {', js_func + '\n        function switchTab(tabName) {')
    
    with open('mockups/lecturer/lecturer_grading_detail.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    update_grading_detail()
