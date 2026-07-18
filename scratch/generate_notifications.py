import shutil

def generate_notifications():
    # We copy home.html as base
    with open('mockups/student/home.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Find where to replace the main content
    # Start after the header
    import re
    header_end = r'</header>\s*<!-- Main Content -->'
    
    notifications_content = '''
        <!-- Main Content -->
        <div class="p-8 overflow-y-auto flex-1 hide-scrollbar">
            
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-extrabold text-[#1B2559]">Notifications</h1>
                    <p class="text-gray-500 font-medium mt-1">Stay updated with your courses and deadlines</p>
                </div>
                <div class="flex space-x-3">
                    <button class="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center">
                        <i data-lucide="check-check" class="w-4 h-4 mr-2"></i> Mark all as read
                    </button>
                    <button class="bg-[#4318FF] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-200 hover:bg-blue-700 flex items-center">
                        <i data-lucide="filter" class="w-4 h-4 mr-2"></i> Filter
                    </button>
                </div>
            </div>

            <div class="max-w-4xl space-y-4">
                
                <!-- Unread Notification (Feedback) -->
                <div class="bg-blue-50 border border-blue-100 rounded-[20px] p-5 shadow-sm flex items-start relative cursor-pointer hover:bg-blue-100/50 transition-colors">
                    <div class="absolute top-5 right-5 w-2.5 h-2.5 bg-[#4318FF] rounded-full"></div>
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#4318FF] shrink-0 mr-4 shadow-sm">
                        <i data-lucide="message-square" class="w-5 h-5"></i>
                    </div>
                    <div class="flex-1 pr-8">
                        <div class="flex items-center mb-1">
                            <span class="text-xs font-bold text-[#4318FF] bg-blue-100 px-2 py-0.5 rounded mr-2">Feedback Received</span>
                            <span class="text-xs font-bold text-gray-400">10 mins ago</span>
                        </div>
                        <h4 class="text-base font-bold text-[#1B2559] mb-1">Lecturer Nguyen Van A reviewed your submission for SWD392</h4>
                        <p class="text-sm text-gray-600">"Good decomposition, but you need to clarify the AI Prompt used for the Architecture selection..."</p>
                        <button class="mt-3 text-sm font-bold text-[#4318FF] hover:underline flex items-center">
                            View Feedback Details <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
                        </button>
                    </div>
                </div>

                <!-- Unread Notification (Deadline Change) -->
                <div class="bg-orange-50 border border-orange-100 rounded-[20px] p-5 shadow-sm flex items-start relative cursor-pointer hover:bg-orange-100/50 transition-colors">
                    <div class="absolute top-5 right-5 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 shrink-0 mr-4 shadow-sm">
                        <i data-lucide="calendar-clock" class="w-5 h-5"></i>
                    </div>
                    <div class="flex-1 pr-8">
                        <div class="flex items-center mb-1">
                            <span class="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded mr-2">Deadline Update</span>
                            <span class="text-xs font-bold text-gray-400">2 hours ago</span>
                        </div>
                        <h4 class="text-base font-bold text-[#1B2559] mb-1">Deadline Extended for PRJ301 Assignment 2</h4>
                        <p class="text-sm text-gray-600">The deadline has been moved from <strong>June 15</strong> to <strong class="text-red-500">June 18, 11:59 PM</strong>. Please make sure to submit on time!</p>
                    </div>
                </div>

                <!-- Date Divider -->
                <div class="flex items-center pt-4 pb-2">
                    <div class="flex-1 border-t border-gray-200"></div>
                    <span class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Yesterday</span>
                    <div class="flex-1 border-t border-gray-200"></div>
                </div>

                <!-- Read Notification (System) -->
                <div class="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm flex items-start relative cursor-pointer hover:bg-gray-50 transition-colors">
                    <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 shrink-0 mr-4">
                        <i data-lucide="bell-ring" class="w-5 h-5"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center mb-1">
                            <span class="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded mr-2">System Notice</span>
                            <span class="text-xs font-bold text-gray-400">Yesterday, 09:00 AM</span>
                        </div>
                        <h4 class="text-base font-bold text-gray-700 mb-1">Welcome to the new ART-AI Portal</h4>
                        <p class="text-sm text-gray-500">We have updated the portal with new AI declaration features. Check out the guide in the News section to get started.</p>
                    </div>
                </div>
                
                <!-- Read Notification (Assignment Graded) -->
                <div class="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm flex items-start relative cursor-pointer hover:bg-gray-50 transition-colors">
                    <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 shrink-0 mr-4">
                        <i data-lucide="check-circle" class="w-5 h-5"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center mb-1">
                            <span class="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded mr-2">Grade Available</span>
                            <span class="text-xs font-bold text-gray-400">Yesterday, 08:30 AM</span>
                        </div>
                        <h4 class="text-base font-bold text-gray-700 mb-1">Your Grade for PRF192 Midterm is available</h4>
                        <p class="text-sm text-gray-500">You scored <strong>8.5/10</strong>. AI usage was approved without deductions.</p>
                        <button class="mt-3 text-sm font-bold text-gray-500 hover:text-green-600 flex items-center transition-colors">
                            View Gradebook <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    '''
    
    html = re.sub(r'(</header>).*', r'\1\n' + notifications_content + '\n    </main>\n\n    <script>\n        lucide.createIcons();\n    </script>\n</body>\n</html>', html, flags=re.DOTALL)
    
    # Active state for notifications bell (we can't easily change the side menu since there isn't a notifications tab, but there's a bell in header)
    html = html.replace('class="relative p-2 text-gray-400 hover:text-orange-500 transition-colors"', 'class="relative p-2 text-orange-500 bg-orange-50 rounded-xl transition-colors"')
    
    with open('mockups/student/notifications.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    generate_notifications()
