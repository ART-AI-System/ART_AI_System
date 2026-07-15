import re

def update_schedule():
    with open('mockups/student/schedule.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Update 3 Days UI in the Strip
    strip_new = '''<!-- Active Day 1 -->
                            <div class="flex flex-col items-center cursor-pointer group">
                                <span class="text-xs font-bold text-[#4318FF] mb-2">Wed</span>
                                <div class="w-10 h-10 rounded-full bg-[#4318FF] text-white shadow-lg shadow-blue-200 flex items-center justify-center text-sm font-bold">17</div>
                            </div>
                            <!-- Active Day 2 -->
                            <div class="flex flex-col items-center cursor-pointer group">
                                <span class="text-xs font-bold text-[#4318FF] mb-2">Thu</span>
                                <div class="w-10 h-10 rounded-full bg-[#4318FF] text-white shadow-lg shadow-blue-200 flex items-center justify-center text-sm font-bold">18</div>
                            </div>
                            <!-- Active Day 3 -->
                            <div class="flex flex-col items-center cursor-pointer group">
                                <span class="text-xs font-bold text-[#4318FF] mb-2">Fri</span>
                                <div class="w-10 h-10 rounded-full bg-[#4318FF] text-white shadow-lg shadow-blue-200 flex items-center justify-center text-sm font-bold">19</div>
                            </div>'''
    
    # We replace the old active day and the inactive Thu, Fri with the new strip
    # Instead of regex DOTALL spanning the whole file, let's just do a string replace or a safer regex
    old_active_strip = '''<!-- Active Day -->
                            <div class="flex flex-col items-center cursor-pointer group">
                                <span class="text-xs font-bold text-[#4318FF] mb-2">Wed</span>
                                <div class="w-10 h-10 rounded-full bg-[#4318FF] text-white shadow-lg shadow-blue-200 flex items-center justify-center text-sm font-bold">17</div>
                            </div>
                            <div class="flex flex-col items-center cursor-pointer group">
                                <span class="text-xs font-bold text-gray-400 mb-2 group-hover:text-[#1B2559]">Thu</span>
                                <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-gray-100 transition-colors">18</div>
                            </div>
                            <div class="flex flex-col items-center cursor-pointer group">
                                <span class="text-xs font-bold text-gray-400 mb-2 group-hover:text-[#1B2559]">Fri</span>
                                <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-gray-100 transition-colors">19</div>
                            </div>'''
    
    html = html.replace(old_active_strip, strip_new)

    # Timeline section replacement
    new_timeline = '''
                    <!-- Vertical Timeline -->
                    <div class="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 relative min-h-[600px] timeline-grid overflow-x-auto">
                        
                        <!-- Header row for 3 days -->
                        <div class="flex absolute top-4 w-full items-start pr-8 z-10">
                            <span class="w-20 shrink-0"></span>
                            <div class="ml-4 flex-1 grid grid-cols-3 gap-6 text-center">
                                <div class="font-bold text-sm text-[#4318FF]">Wednesday</div>
                                <div class="font-bold text-sm text-[#4318FF]">Thursday</div>
                                <div class="font-bold text-sm text-[#4318FF]">Friday</div>
                            </div>
                        </div>

                        <!-- 08:00 AM -->
                        <div class="flex absolute top-[60px] w-full items-start pr-8">
                            <span class="w-20 text-xs font-bold text-gray-400 mt-2 shrink-0">08.00 AM</span>
                            <!-- Class Block -->
                            <div class="ml-4 flex-1 grid grid-cols-3 gap-6 mt-6">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>

                        <!-- 09:00 AM -->
                        <div class="flex absolute top-[160px] w-full items-start pr-8">
                            <span class="w-20 text-xs font-bold text-gray-900 mt-2 shrink-0">09.00 AM</span>
                            
                            <!-- Class Block (3 columns) -->
                            <div class="ml-4 flex-1 grid grid-cols-3 gap-6 relative group z-10">
                                <!-- Day 1: SWD392 -->
                                <div class="cursor-pointer relative group/item">
                                    <div class="bg-[#34d399] rounded-xl p-3 flex flex-col justify-center shadow-md text-white border border-[#10b981] h-16">
                                        <div class="flex items-center justify-between">
                                            <span class="font-bold text-xs truncate mr-2"><i data-lucide="book" class="w-3 h-3 inline mr-1 opacity-80"></i>SWD392</span>
                                            <span class="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">SE18D01</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Hover Popup -->
                                    <div class="absolute left-0 -bottom-40 w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 opacity-0 group-hover/item:opacity-100 transition-opacity z-20 pointer-events-none">
                                        <div class="flex items-center mb-2">
                                            <div class="w-1 h-3 bg-[#34d399] rounded-full mr-2"></div>
                                            <h4 class="font-bold text-sm text-[#1B2559]">SWD392</h4>
                                        </div>
                                        <p class="text-xs text-gray-600 mb-3">Room 302, Gamma Building</p>
                                    </div>
                                </div>

                                <!-- Day 2: Empty -->
                                <div></div>

                                <!-- Day 3: EXAM (Highlight Red) -->
                                <div class="cursor-pointer relative group/item row-span-2">
                                    <div class="bg-red-500 rounded-xl p-3 flex flex-col justify-between shadow-md text-white border border-red-600 h-28 relative overflow-hidden">
                                        <div class="absolute -right-2 -top-2 bg-red-600/30 w-12 h-12 rounded-full blur-md"></div>
                                        <div class="flex items-center justify-between relative z-10">
                                            <span class="font-extrabold text-sm"><i data-lucide="alert-circle" class="w-4 h-4 inline mr-1"></i> FINAL EXAM</span>
                                        </div>
                                        <div class="relative z-10 mt-1">
                                            <span class="font-bold text-xs truncate block">PRJ301 - Java Web</span>
                                            <span class="text-[10px] font-bold mt-1 bg-white/20 px-2 py-1 rounded inline-block backdrop-blur-sm shadow-sm"><i data-lucide="map-pin" class="w-2.5 h-2.5 inline mr-1"></i> Hall A</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Hover Popup -->
                                    <div class="absolute left-1/2 transform -translate-x-1/2 -bottom-[210px] w-[320px] bg-white rounded-2xl shadow-2xl border border-red-100 p-5 opacity-0 group-hover/item:opacity-100 transition-opacity z-20 pointer-events-none">
                                        <div class="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                            <div class="flex items-center text-red-500 font-bold text-sm">
                                                <i data-lucide="alert-triangle" class="w-4 h-4 mr-2"></i> FINAL EXAM
                                            </div>
                                            <span class="text-xs font-bold bg-red-50 text-red-500 px-2 py-1 rounded-lg">90 Minutes</span>
                                        </div>
                                        <h4 class="font-bold text-[#1B2559] mb-1">PRJ301 - Java Web Application</h4>
                                        <div class="flex flex-col space-y-2 mb-4 text-xs font-bold text-gray-500">
                                            <div class="flex items-center"><i data-lucide="clock" class="w-3.5 h-3.5 mr-2 text-gray-400"></i> 09.00 AM - 10.30 AM (Fri, Jun 19)</div>
                                            <div class="flex items-center"><i data-lucide="map-pin" class="w-3.5 h-3.5 mr-2 text-gray-400"></i> Exam Hall A, 3rd Floor</div>
                                        </div>
                                        <div class="bg-red-50 rounded-lg p-3 border border-red-100">
                                            <p class="text-[11px] font-bold text-red-600 mb-1 flex items-center"><i data-lucide="info" class="w-3 h-3 mr-1"></i> Exam Notes & Rules:</p>
                                            <ul class="text-[10px] font-medium text-red-500 list-disc pl-4 space-y-1">
                                                <li>Bring your Student ID Card.</li>
                                                <li>Bring your own Laptop and Charger.</li>
                                                <li>No internet connection allowed during practical exam.</li>
                                                <li>Arrive 15 minutes early.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- 11:00 AM -->
                        <div class="flex absolute top-[360px] w-full items-start pr-8">
                            <span class="w-20 text-xs font-bold text-gray-400 mt-2 shrink-0">11.00 AM</span>
                            
                            <!-- Class Block -->
                            <div class="ml-4 flex-1 grid grid-cols-3 gap-6 relative z-10">
                                <!-- Day 1: PRM392 -->
                                <div class="cursor-pointer relative group/item">
                                    <div class="bg-orange-400 rounded-xl p-3 flex flex-col justify-center shadow-md text-white border border-orange-500 h-16">
                                        <div class="flex items-center justify-between">
                                            <span class="font-bold text-xs truncate mr-2"><i data-lucide="smartphone" class="w-3 h-3 inline mr-1 opacity-80"></i>PRM392</span>
                                            <span class="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">SE18D01</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- Day 2: SWT301 -->
                                <div class="cursor-pointer relative group/item">
                                    <div class="bg-[#4318FF] rounded-xl p-3 flex flex-col justify-center shadow-md text-white border border-indigo-600 h-16">
                                        <div class="flex items-center justify-between">
                                            <span class="font-bold text-xs truncate mr-2"><i data-lucide="shield-check" class="w-3 h-3 inline mr-1 opacity-80"></i>SWT301</span>
                                            <span class="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">SE18D01</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- Day 3: Empty (Exam is above) -->
                                <div></div>
                            </div>
                        </div>

                    </div>
    '''
    
    # We replace the old vertical timeline section
    html = re.sub(r'<!-- Vertical Timeline -->.*?</div>\s*</div>\s*<!-- Right Column \(Stats & Upcoming\) -->', new_timeline + '\n                </div>\n\n                <!-- Right Column (Stats & Upcoming) -->', html, flags=re.DOTALL)

    # Now let's update the Upcoming Deadlines to include Exam Reminder
    exam_reminder = '''
                            <!-- Exam Reminder -->
                            <div class="flex flex-col p-4 bg-red-50 rounded-xl border border-red-100">
                                <div class="flex justify-between items-start mb-1">
                                    <h4 class="text-sm font-bold text-red-600 flex items-center"><i data-lucide="alert-circle" class="w-4 h-4 mr-1"></i> FINAL EXAM</h4>
                                    <span class="text-[10px] font-bold text-red-500 bg-red-100 px-2 py-1 rounded-md animate-pulse">In 2 Days</span>
                                </div>
                                <p class="text-xs font-bold text-gray-800 mb-1">PRJ301 - Java Web</p>
                                <p class="text-[11px] font-medium text-gray-500 mb-2">Please prepare your laptop and student ID.</p>
                                <div class="flex items-center text-[11px] font-bold text-red-400">
                                    <i data-lucide="calendar" class="w-3 h-3 mr-1"></i> Fri, 19 June • 09:00 AM
                                </div>
                            </div>
    '''
    
    html = re.sub(r'<div class="space-y-5">', '<div class="space-y-5">\n' + exam_reminder, html)

    with open('mockups/student/schedule.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    update_schedule()
