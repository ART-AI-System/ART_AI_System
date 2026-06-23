import re

def update_subject_detail():
    with open('mockups/student/subject_detail.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Slot 1
    html = html.replace(
        '''<h4 class="font-bold text-[#1B2559] text-base group-hover:text-[#4318FF] transition-colors">Introduction to Design Thinking</h4>
                                            <p class="text-xs font-medium text-gray-500 mt-0.5">10 Jun 2026</p>''',
        '''<h4 class="font-bold text-[#1B2559] text-base group-hover:text-[#4318FF] transition-colors">Introduction to Design Thinking</h4>
                                            <p class="text-sm text-gray-600 mt-1 line-clamp-2 w-[400px]">Chapter 1: Understanding user needs, defining problems, and prototyping solutions in modern software engineering.</p>
                                            <p class="text-xs font-medium text-gray-400 mt-1">10 Jun 2026</p>'''
    )

    # Slot 2
    html = html.replace(
        '''<h4 class="font-bold text-[#1B2559] text-base group-hover:text-orange-500 transition-colors">Architectural Patterns (MVC vs MVVM)</h4>
                                            <p class="text-xs font-medium text-gray-500 mt-0.5">12 Jun 2026</p>''',
        '''<h4 class="font-bold text-[#1B2559] text-base group-hover:text-orange-500 transition-colors">Architectural Patterns (MVC vs MVVM)</h4>
                                            <p class="text-sm text-gray-600 mt-1 line-clamp-2 w-[400px]">Chapter 2: Deep dive into MVC, MVP, and MVVM patterns. Understand how to decouple UI from business logic.</p>
                                            <p class="text-xs font-medium text-gray-400 mt-1">12 Jun 2026</p>'''
    )

    # Slot 3
    html = html.replace(
        '''<h4 class="font-bold text-gray-500 text-base">UML & System Design</h4>
                                            <p class="text-xs font-medium text-gray-400 mt-0.5">15 Jun 2026</p>''',
        '''<h4 class="font-bold text-gray-500 text-base">UML & System Design</h4>
                                            <p class="text-sm text-gray-400 mt-1 line-clamp-2 w-[400px]">Chapter 3: Unified Modeling Language. Class diagrams, Sequence diagrams, and Use case diagrams.</p>
                                            <p class="text-xs font-medium text-gray-400 mt-1">15 Jun 2026</p>'''
    )

    # Add Slot 4 (Empty State)
    slot4_html = '''
                            <!-- Slot 4 (Empty State) -->
                            <div class="slot-item group">
                                <div class="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" onclick="this.parentElement.classList.toggle('slot-expanded')">
                                    <div class="flex items-center">
                                        <div class="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center font-bold mr-4 shadow-sm">
                                            S4
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-[#1B2559] text-base group-hover:text-[#4318FF] transition-colors">System Components (TBA)</h4>
                                            <p class="text-sm text-gray-600 mt-1 line-clamp-2 w-[400px]">Chapter 4: Pending lecturer's description.</p>
                                            <p class="text-xs font-medium text-gray-400 mt-1">18 Jun 2026</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 slot-icon transition-transform"></i>
                                    </div>
                                </div>
                                <div class="slot-content bg-gray-50/50">
                                    <div class="p-12 border-t border-gray-100 flex flex-col items-center justify-center text-center">
                                        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                            <i data-lucide="inbox" class="w-8 h-8 text-gray-300"></i>
                                        </div>
                                        <h4 class="text-[#1B2559] font-bold">No Content Yet</h4>
                                        <p class="text-sm text-gray-500 mt-2 max-w-xs">The lecturer hasn't added any materials or activities for this slot.</p>
                                    </div>
                                </div>
                            </div>
    '''
    
    html = html.replace('<!-- Slot 3 (Locked, Collapsed) -->', slot4_html + '\n                            <!-- Slot 3 (Locked, Collapsed) -->')

    pagination_html = '''
                        <!-- Pagination -->
                        <div class="p-4 border-t border-gray-100 bg-white flex justify-between items-center rounded-b-[24px]">
                            <span class="text-sm text-gray-500 font-medium">Showing 1-10 of 20 slots</span>
                            <div class="flex items-center space-x-1">
                                <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 font-medium disabled:opacity-50">First</button>
                                <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 font-medium disabled:opacity-50">Prev</button>
                                <button class="px-3 py-1.5 bg-[#4318FF] text-white rounded-lg text-sm font-bold shadow-sm">1</button>
                                <button class="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">2</button>
                                <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 font-medium">Next</button>
                                <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 font-medium">Last</button>
                            </div>
                        </div>
    '''
    
    html = html.replace('</div>\n                    </div>\n\n                    <!-- Bottom Chart Area', '</div>\n' + pagination_html + '\n                    </div>\n\n                    <!-- Bottom Chart Area')
    
    with open('mockups/student/subject_detail.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    update_subject_detail()
