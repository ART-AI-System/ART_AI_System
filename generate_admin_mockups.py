import os

os.makedirs('mockups/admin', exist_ok=True)

base_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ART-AI Admin - {page_title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {{ font-family: 'Inter', sans-serif; background-color: #F4F7FE; }}
        .admin-green-gradient {{ background: linear-gradient(135deg, #16A34A 0%, #4ADE80 100%); }}
        /* Scrollbar styles */
        ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
        ::-webkit-scrollbar-track {{ background: transparent; }}
        ::-webkit-scrollbar-thumb {{ background: #CBD5E1; border-radius: 10px; }}
        ::-webkit-scrollbar-thumb:hover {{ background: #94A3B8; }}
    </style>
</head>
<body class="flex h-screen overflow-hidden">

    <!-- ADMIN SIDEBAR (DARK THEME) -->
    <aside class="w-[280px] bg-[#064E3B] flex flex-col h-full shadow-2xl relative z-20 shrink-0">
        <!-- Logo -->
        <a href="admin_dashboard.html" class="h-24 flex items-center px-8 cursor-pointer border-b border-white/10 shrink-0">
            <div class="w-10 h-10 rounded-xl admin-green-gradient flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-green-500/30">
                <i data-lucide="brain-circuit" class="w-6 h-6"></i>
            </div>
            <span class="text-2xl font-extrabold text-white tracking-tight">ART-AI<span class="text-[#4ADE80] text-xs align-top ml-1">ADMIN</span></span>
        </a>

        <!-- Navigation Links -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <a href="admin_dashboard.html" class="{dash_class}">
                {dash_indicator}
                <i data-lucide="layout-dashboard" class="w-5 h-5 mr-4 {dash_icon_class}"></i>
                Dashboard
            </a>
            
            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">Users</p>
            </div>

            <a href="admin_students.html" class="{students_class}">
                {students_indicator}
                <i data-lucide="graduation-cap" class="w-5 h-5 mr-4 {students_icon_class}"></i>
                Students
            </a>

            <!-- Employees Dropdown -->
            <div class="relative group">
                <button class="{employees_class} w-full justify-between">
                    <div class="flex items-center">
                        {employees_indicator}
                        <i data-lucide="briefcase" class="w-5 h-5 mr-4 {employees_icon_class}"></i>
                        Employees
                    </div>
                    <i data-lucide="chevron-down" class="w-4 h-4 opacity-70"></i>
                </button>
                <div class="pl-12 pr-4 py-2 space-y-1 hidden group-hover:block">
                    <a href="admin_teachers.html" class="block py-2 text-sm text-green-200 hover:text-white transition-colors">Lecturers</a>
                    <a href="#" class="block py-2 text-sm text-green-200 hover:text-white transition-colors">Head Subjects</a>
                </div>
            </div>

            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">Academic</p>
            </div>

            <a href="admin_semesters.html" class="{sems_class}">
                {sems_indicator}
                <i data-lucide="calendar-days" class="w-5 h-5 mr-4 {sems_icon_class}"></i>
                Semesters
            </a>

            <a href="admin_subjects.html" class="{subjects_class}">
                {subjects_indicator}
                <i data-lucide="library" class="w-5 h-5 mr-4 {subjects_icon_class}"></i>
                Subjects
            </a>

            <a href="admin_classes.html" class="{classes_class}">
                {classes_indicator}
                <i data-lucide="book-open" class="w-5 h-5 mr-4 {classes_icon_class}"></i>
                Classes
            </a>
            
            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">Communication</p>
            </div>

            <a href="admin_messages.html" class="{messages_class}">
                {messages_indicator}
                <i data-lucide="message-circle" class="w-5 h-5 mr-4 {messages_icon_class}"></i>
                Messages
            </a>

            <a href="admin_feedback.html" class="{feedback_class}">
                {feedback_indicator}
                <i data-lucide="clipboard-list" class="w-5 h-5 mr-4 {feedback_icon_class}"></i>
                Feedback & Reports
            </a>

            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">System</p>
            </div>

            <a href="admin_settings.html" class="{settings_class}">
                {settings_indicator}
                <i data-lucide="settings" class="w-5 h-5 mr-4 {settings_icon_class}"></i>
                Settings
            </a>
        </nav>
        
        <!-- Logout Section -->
        <div class="p-4 border-t border-white/10 shrink-0">
            <a href="../auth/login.html" class="flex items-center px-4 py-3.5 text-red-300 hover:text-white hover:bg-red-500/20 font-medium rounded-xl transition-all">
                <i data-lucide="log-out" class="w-5 h-5 mr-4 opacity-90"></i>
                Log Out
            </a>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
        <!-- TOP HEADER -->
        <header class="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
            <div>
                <h1 class="text-2xl font-extrabold text-[#064E3B]">{page_title}</h1>
                <p class="text-sm font-medium text-gray-500 mt-1">{page_subtitle}</p>
            </div>
            
            <div class="flex items-center space-x-6">
                <div class="relative">
                    <input type="text" placeholder="What do you want to find?" class="bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm w-64 text-[#064E3B] font-medium">
                    <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
                </div>

                <button class="relative p-2.5 text-gray-400 hover:text-[#16A34A] hover:bg-green-50 rounded-xl transition-all">
                    <i data-lucide="bell" class="w-6 h-6"></i>
                    <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div class="flex items-center pl-6 border-l border-gray-200 gap-3 cursor-pointer">
                    <div class="text-right">
                        <p class="text-sm font-bold text-[#064E3B]">Priscilla Lily</p>
                        <p class="text-xs font-medium text-gray-500">Admin</p>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Admin&background=16A34A&color=fff" alt="User" class="w-10 h-10 rounded-full border-2 border-white shadow-sm">
                    <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400"></i>
                </div>
            </div>
        </header>

        <!-- PAGE CONTENT -->
        <div class="flex-1 overflow-y-auto p-10">
            {page_content}
        </div>
    </main>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>'''

active_class = 'flex items-center px-4 py-3.5 bg-white/10 text-white font-bold rounded-xl transition-all relative'
inactive_class = 'flex items-center px-4 py-3.5 text-green-100 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5'
active_indicator = '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>'
inactive_indicator = ''
active_icon = 'text-[#4ADE80]'
inactive_icon = 'opacity-70'

pages = [
    ('admin_dashboard.html', 'Admin Dashboard', 'Home / Dashboard', '''
    <div class="space-y-6">
        <!-- Top Cards -->
        <div class="grid grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-gray-500 font-semibold text-sm mb-1">Students</h3>
                    <p class="text-2xl font-extrabold text-[#064E3B]">3,450</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                    <i data-lucide="graduation-cap" class="w-6 h-6"></i>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-gray-500 font-semibold text-sm mb-1">Lecturers</h3>
                    <p class="text-2xl font-extrabold text-[#064E3B]">120</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <i data-lucide="users" class="w-6 h-6"></i>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-gray-500 font-semibold text-sm mb-1">Active Classes</h3>
                    <p class="text-2xl font-extrabold text-[#064E3B]">84</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                    <i data-lucide="book-open" class="w-6 h-6"></i>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-gray-500 font-semibold text-sm mb-1">Subjects</h3>
                    <p class="text-2xl font-extrabold text-[#064E3B]">45</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                    <i data-lucide="library" class="w-6 h-6"></i>
                </div>
            </div>
        </div>

        <!-- Middle Charts -->
        <div class="grid grid-cols-3 gap-6">
            <div class="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h3 class="font-bold text-[#064E3B] text-lg">System Activity</h3>
                        <p class="text-sm text-gray-500">Logins & Test Attempts</p>
                    </div>
                    <div class="flex space-x-3 text-sm">
                        <span class="flex items-center"><div class="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>Students</span>
                        <span class="flex items-center"><div class="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>Lecturers</span>
                    </div>
                </div>
                <div class="h-64 flex items-end justify-between px-4 pb-2 space-x-2 border-b border-gray-100 relative">
                    <!-- Grid lines -->
                    <div class="absolute w-full h-px bg-gray-100 bottom-[25%]"></div>
                    <div class="absolute w-full h-px bg-gray-100 bottom-[50%]"></div>
                    <div class="absolute w-full h-px bg-gray-100 bottom-[75%]"></div>
                    <div class="absolute w-full h-px bg-gray-100 top-0"></div>
                    <!-- Bars -->
                    <div class="w-full flex justify-around items-end z-10 h-full pt-4">
                        <div class="flex space-x-1 items-end h-full"><div class="w-4 bg-purple-500 rounded-t-sm" style="height: 60%"></div><div class="w-4 bg-orange-500 rounded-t-sm" style="height: 40%"></div></div>
                        <div class="flex space-x-1 items-end h-full"><div class="w-4 bg-purple-500 rounded-t-sm" style="height: 80%"></div><div class="w-4 bg-orange-500 rounded-t-sm" style="height: 50%"></div></div>
                        <div class="flex space-x-1 items-end h-full"><div class="w-4 bg-purple-500 rounded-t-sm" style="height: 45%"></div><div class="w-4 bg-orange-500 rounded-t-sm" style="height: 30%"></div></div>
                        <div class="flex space-x-1 items-end h-full"><div class="w-4 bg-purple-500 rounded-t-sm" style="height: 90%"></div><div class="w-4 bg-orange-500 rounded-t-sm" style="height: 60%"></div></div>
                        <div class="flex space-x-1 items-end h-full"><div class="w-4 bg-purple-500 rounded-t-sm" style="height: 70%"></div><div class="w-4 bg-orange-500 rounded-t-sm" style="height: 40%"></div></div>
                        <div class="flex space-x-1 items-end h-full"><div class="w-4 bg-purple-500 rounded-t-sm" style="height: 55%"></div><div class="w-4 bg-orange-500 rounded-t-sm" style="height: 35%"></div></div>
                        <div class="flex space-x-1 items-end h-full"><div class="w-4 bg-purple-500 rounded-t-sm" style="height: 85%"></div><div class="w-4 bg-orange-500 rounded-t-sm" style="height: 65%"></div></div>
                    </div>
                </div>
                <div class="flex justify-around text-xs text-gray-400 mt-3">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-[#064E3B] text-lg">Students</h3>
                    <i data-lucide="more-vertical" class="w-5 h-5 text-gray-400"></i>
                </div>
                <div class="flex-1 flex flex-col items-center justify-center relative">
                    <!-- CSS Conic Gradient Donut -->
                    <div class="w-48 h-48 rounded-full" style="background: conic-gradient(#8B5CF6 0% 65%, #F97316 65% 100%);"></div>
                    <div class="absolute inset-0 m-auto w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center">
                        <span class="text-sm text-gray-500 font-bold">Total</span>
                        <span class="text-2xl font-extrabold text-[#064E3B]">3,450</span>
                    </div>
                </div>
                <div class="flex justify-center space-x-6 mt-4 text-sm font-bold">
                    <div class="flex items-center"><div class="w-3 h-3 rounded-full bg-[#8B5CF6] mr-2"></div>Male</div>
                    <div class="flex items-center"><div class="w-3 h-3 rounded-full bg-[#F97316] mr-2"></div>Female</div>
                </div>
            </div>
        </div>

        <!-- Bottom Lists -->
        <div class="grid grid-cols-3 gap-6">
            <div class="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-[#064E3B] text-lg">Top Performers</h3>
                    <i data-lucide="more-vertical" class="w-5 h-5 text-gray-400"></i>
                </div>
                <table class="w-full text-left text-sm">
                    <tr class="text-gray-400 border-b border-gray-100 text-xs">
                        <th class="py-2 w-8"><input type="checkbox" class="rounded"></th>
                        <th class="py-2">Name</th>
                        <th class="py-2">ID</th>
                        <th class="py-2">Marks</th>
                        <th class="py-2">Percent</th>
                        <th class="py-2">Year</th>
                    </tr>
                    <tr class="border-b border-gray-50 hover:bg-gray-50">
                        <td class="py-3"><input type="checkbox" class="rounded"></td>
                        <td class="py-3 font-bold text-[#064E3B] flex items-center"><img src="https://ui-avatars.com/api/?name=Evelyn+Harper&background=F3F4F6" class="w-6 h-6 rounded-full mr-2">Evelyn Harper</td>
                        <td class="py-3 text-gray-500">HE150123</td>
                        <td class="py-3 text-gray-500">1185</td>
                        <td class="py-3 text-gray-500">98%</td>
                        <td class="py-3 text-gray-500">2026</td>
                    </tr>
                    <tr class="border-b border-gray-50 bg-green-50/30">
                        <td class="py-3"><input type="checkbox" class="rounded" checked></td>
                        <td class="py-3 font-bold text-[#064E3B] flex items-center"><img src="https://ui-avatars.com/api/?name=Diana+Plenty&background=F3F4F6" class="w-6 h-6 rounded-full mr-2">Diana Plenty</td>
                        <td class="py-3 text-gray-500">HE150124</td>
                        <td class="py-3 text-gray-500">1165</td>
                        <td class="py-3 text-gray-500">91%</td>
                        <td class="py-3 text-gray-500">2026</td>
                    </tr>
                    <tr class="border-b border-gray-50 hover:bg-gray-50">
                        <td class="py-3"><input type="checkbox" class="rounded"></td>
                        <td class="py-3 font-bold text-[#064E3B] flex items-center"><img src="https://ui-avatars.com/api/?name=John+Millar&background=F3F4F6" class="w-6 h-6 rounded-full mr-2">John Millar</td>
                        <td class="py-3 text-gray-500">SE150125</td>
                        <td class="py-3 text-gray-500">1175</td>
                        <td class="py-3 text-gray-500">92%</td>
                        <td class="py-3 text-gray-500">2026</td>
                    </tr>
                </table>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-[#064E3B] text-lg">System Notices</h3>
                    <i data-lucide="more-vertical" class="w-5 h-5 text-gray-400"></i>
                </div>
                <div class="space-y-4 flex-1">
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mr-3 mt-1">
                            <i data-lucide="user-plus" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-[#064E3B]">New Lecturer Added</h4>
                            <p class="text-xs text-gray-500 mt-1 line-clamp-1">Dr. Khue was added to IT Dept</p>
                            <span class="text-[10px] text-gray-400 mt-1 block">Just now</span>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 mr-3 mt-1">
                            <i data-lucide="server-crash" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-[#064E3B]">Server Maintenance</h4>
                            <p class="text-xs text-gray-500 mt-1 line-clamp-1">Scheduled for tonight at 2AM</p>
                            <span class="text-[10px] text-gray-400 mt-1 block">Today</span>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-lg bg-green-50 text-green-500 flex items-center justify-center shrink-0 mr-3 mt-1">
                            <i data-lucide="book-open" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-[#064E3B]">New Course Uploaded</h4>
                            <p class="text-xs text-gray-500 mt-1 line-clamp-1">Machine Learning Basics SP26</p>
                            <span class="text-[10px] text-gray-400 mt-1 block">Yesterday</span>
                        </div>
                    </div>
                </div>
                <button class="w-full py-2.5 mt-4 bg-gray-50 hover:bg-green-50 text-[#16A34A] font-bold rounded-xl text-sm transition-colors border border-gray-100 hover:border-green-200">
                    View All
                </button>
            </div>
        </div>
    </div>
    '''),
    ('admin_messages.html', 'Messages', 'Communication / Messages', '<div class="h-[calc(100vh-140px)] flex border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden"><div class="w-80 border-r border-gray-100 flex flex-col"><div class="p-4 border-b border-gray-100"><div class="relative"><input type="text" placeholder="Search messages..." class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-green-500 focus:outline-none"><i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"></i></div></div><div class="flex-1 overflow-y-auto"><div class="p-4 border-l-4 border-[#16A34A] bg-green-50/50 cursor-pointer flex items-center"><div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-bold text-sm">H</div><div class="flex-1 min-w-0"><div class="flex justify-between items-baseline"><h4 class="text-sm font-bold text-gray-900 truncate">Head of IT Dept</h4><span class="text-xs text-gray-400">10:42 AM</span></div><p class="text-xs text-gray-500 truncate">Please approve the new syllabus.</p></div></div><div class="p-4 border-l-4 border-transparent hover:bg-gray-50 cursor-pointer flex items-center"><img src="https://ui-avatars.com/api/?name=Dr+Jane&background=F3F4F6" class="w-10 h-10 rounded-full mr-3"><div class="flex-1 min-w-0"><div class="flex justify-between items-baseline"><h4 class="text-sm font-bold text-gray-900 truncate">Dr. Jane Smith</h4><span class="text-xs text-gray-400">Yesterday</span></div><p class="text-xs text-gray-500 truncate">I have issues with my class import.</p></div></div></div></div><div class="flex-1 flex flex-col"><div class="p-4 border-b border-gray-100 flex items-center justify-between bg-white"><div class="flex items-center"><div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-bold text-sm">H</div><div><h3 class="font-bold text-gray-900 text-sm">Head of IT Dept</h3><p class="text-xs text-green-500 font-medium flex items-center"><span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span>Online</p></div></div><div><button class="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"><i data-lucide="more-vertical" class="w-5 h-5"></i></button></div></div><div class="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-4"><div class="flex items-start"><div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs font-bold">H</div><div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-md"><p class="text-sm text-gray-700">Hello Admin, could you please review and approve the new syllabus for SU26?</p><span class="text-[10px] text-gray-400 block mt-1">10:40 AM</span></div></div><div class="flex items-start justify-end"><div class="bg-[#16A34A] text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-md"><p class="text-sm">Sure, I am looking at it right now. Will approve in a minute.</p><span class="text-[10px] text-green-100 block mt-1 text-right">10:42 AM</span></div><div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center ml-2 text-xs font-bold">A</div></div></div><div class="p-4 border-t border-gray-100 bg-white"><div class="flex items-center space-x-2"><button class="p-2 text-gray-400 hover:text-green-600 rounded-lg"><i data-lucide="paperclip" class="w-5 h-5"></i></button><input type="text" placeholder="Type a message..." class="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:bg-white"><button class="p-2.5 bg-[#16A34A] text-white rounded-xl hover:bg-green-700 shadow-md shadow-green-500/20"><i data-lucide="send" class="w-4 h-4"></i></button></div></div></div></div>'),
    ('admin_feedback.html', 'Feedback & Reports', 'Communication / Feedback', '<div class="space-y-6"><div class="flex justify-between items-center"><div class="flex space-x-2"><button class="px-4 py-2 bg-[#064E3B] text-white text-sm font-bold rounded-xl shadow-sm">All Feedback</button><button class="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50">Bug Reports</button><button class="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50">Suggestions</button></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden"><div class="absolute top-0 left-0 w-1 h-full bg-red-500"></div><div class="flex justify-between items-start mb-4"><span class="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-md">Bug Report</span><span class="text-xs text-gray-400 font-medium">2 hours ago</span></div><h3 class="font-bold text-[#064E3B] text-lg mb-2">Grade sync is failing</h3><p class="text-sm text-gray-500 line-clamp-3 mb-4">When I try to push grades from the Test module to the Gradebook, I receive an error 500. This is urgent as midterms are over.</p><div class="flex items-center justify-between pt-4 border-t border-gray-100"><div class="flex items-center"><img src="https://ui-avatars.com/api/?name=Mark+D&background=F3F4F6" class="w-6 h-6 rounded-full mr-2"><span class="text-xs font-bold text-gray-700">Lecturer Mark</span></div><button class="text-[#16A34A] text-sm font-bold hover:underline">Resolve</button></div></div><div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden"><div class="absolute top-0 left-0 w-1 h-full bg-blue-500"></div><div class="flex justify-between items-start mb-4"><span class="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md">Suggestion</span><span class="text-xs text-gray-400 font-medium">Yesterday</span></div><h3 class="font-bold text-[#064E3B] text-lg mb-2">Add Dark Mode</h3><p class="text-sm text-gray-500 line-clamp-3 mb-4">It would be great if the exam interface had a dark mode option to reduce eye strain during long tests.</p><div class="flex items-center justify-between pt-4 border-t border-gray-100"><div class="flex items-center"><img src="https://ui-avatars.com/api/?name=Student+A&background=F3F4F6" class="w-6 h-6 rounded-full mr-2"><span class="text-xs font-bold text-gray-700">Student A</span></div><button class="text-[#16A34A] text-sm font-bold hover:underline">Review</button></div></div></div></div>'),
    ('admin_students.html', 'Students List', 'Home / Students', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><div class="flex justify-between items-center mb-6"><h3 class="font-bold text-[#064E3B] text-lg">Students Information</h3><div class="flex space-x-3"><div class="relative"><input type="text" placeholder="Search by name or roll" class="border border-gray-200 rounded-xl px-4 py-2 pr-10 w-64 text-sm focus:outline-none focus:border-green-500"><i data-lucide="search" class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"></i></div><select class="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none"><option>Last 30 days</option></select><button class="bg-[#16A34A] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 flex items-center"><i data-lucide="plus" class="w-4 h-4 mr-2"></i>Add Students</button></div></div><table class="w-full text-left text-sm"><tr class="text-gray-400 border-b border-gray-100 uppercase text-xs tracking-wider"><th class="py-3 px-4 w-10"><input type="checkbox" class="rounded text-green-500"></th><th class="py-3">Students Name</th><th class="py-3">Roll</th><th class="py-3">Email</th><th class="py-3">Date Of Birth</th><th class="py-3">Phone</th><th class="py-3 text-right">Action</th></tr><tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors"><td class="py-4 px-4"><input type="checkbox" class="rounded text-green-500"></td><td class="py-4 font-bold text-[#064E3B] flex items-center"><img src="https://ui-avatars.com/api/?name=Eleanor+Pena&background=F3F4F6" class="w-8 h-8 rounded-full mr-3">Eleanor Pena</td><td class="py-4 text-gray-500">#01</td><td class="py-4 text-gray-500">eleanor@fpt.edu.vn</td><td class="py-4 text-gray-500">02/05/2001</td><td class="py-4 text-gray-500">+123 6988567</td><td class="py-4 text-right"><div class="flex justify-end space-x-2"><button class="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"><i data-lucide="edit-2" class="w-4 h-4"></i></button><button class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div></td></tr><tr class="border-b border-gray-50 bg-green-50/50"><td class="py-4 px-4"><input type="checkbox" class="rounded text-green-500" checked></td><td class="py-4 font-bold text-[#064E3B] flex items-center"><img src="https://ui-avatars.com/api/?name=Jessia+Rose&background=F3F4F6" class="w-8 h-8 rounded-full mr-3">Jessia Rose</td><td class="py-4 text-gray-500">#10</td><td class="py-4 text-gray-500">jessia@fpt.edu.vn</td><td class="py-4 text-gray-500">03/04/2000</td><td class="py-4 text-gray-500">+123 8988569</td><td class="py-4 text-right"><div class="flex justify-end space-x-2"><button class="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"><i data-lucide="edit-2" class="w-4 h-4"></i></button><button class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div></td></tr></table><div class="mt-6 flex justify-center"><div class="flex items-center space-x-1 text-sm"><button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"><i data-lucide="chevron-left" class="w-4 h-4"></i></button><button class="w-8 h-8 flex items-center justify-center rounded-lg bg-[#064E3B] text-white font-bold">1</button><button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">2</button><button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">3</button><span class="px-2 text-gray-400">...</span><button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"><i data-lucide="chevron-right" class="w-4 h-4"></i></button></div></div></div>'),
    ('admin_teachers.html', 'Teachers List', 'Home / Teachers', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><div class="flex justify-between items-center mb-6"><h3 class="font-bold text-[#064E3B] text-lg">Teachers Information</h3><button class="bg-[#16A34A] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 flex items-center"><i data-lucide="plus" class="w-4 h-4 mr-2"></i>Add Teacher</button></div><p class="text-gray-500">List of all active teachers and head subjects.</p></div>'),
    ('admin_semesters.html', 'Semesters', 'Academic / Semesters', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><button class="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 mb-6 flex items-center"><i data-lucide="plus" class="w-4 h-4 mr-2"></i>Add Semester</button><ul class="space-y-4"><li><div class="flex justify-between items-center p-4 border border-green-200 bg-green-50 rounded-xl"><span class="font-bold text-[#064E3B]">Summer 2026 (SU26)</span><span class="bg-[#16A34A] text-white text-xs px-2 py-1 rounded-full">Current</span></div></li><li><div class="flex justify-between items-center p-4 border border-gray-100 rounded-xl"><span class="font-bold text-gray-700">Spring 2026 (SP26)</span><span class="text-gray-500 text-sm">Past</span></div></li></ul></div>'),
    ('admin_subjects.html', 'Subjects', 'Academic / Subjects', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><div class="flex justify-between items-center mb-6"><h3 class="font-bold text-[#064E3B] text-lg">Subjects Curriculum</h3><button class="bg-[#16A34A] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 flex items-center"><i data-lucide="plus" class="w-4 h-4 mr-2"></i>New Subject</button></div><p class="text-gray-500">List of subjects.</p></div>'),
    ('admin_classes.html', 'Classes', 'Academic / Classes', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><div class="flex justify-between items-center mb-6"><h3 class="font-bold text-[#064E3B] text-lg">Class Management</h3><div class="flex space-x-3"><button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 text-sm flex items-center"><i data-lucide="upload" class="w-4 h-4 mr-2"></i>Import Students Excel</button><button class="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 text-sm flex items-center"><i data-lucide="plus" class="w-4 h-4 mr-2"></i>Create Class</button></div></div><p class="text-gray-500">List of classes.</p></div>'),
    ('admin_messages.html', 'Messages', 'Communication / Messages', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[500px] flex items-center justify-center flex-col text-gray-400"><i data-lucide="message-circle" class="w-16 h-16 mb-4 text-green-200"></i><p class="font-medium text-lg">Chat System</p><p class="text-sm">Connect with Head Subjects and Lecturers</p></div>'),
    ('admin_feedback.html', 'Feedback & Reports', 'Communication / Feedback', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><h3 class="font-bold text-[#064E3B] text-lg mb-6">System Feedback</h3><p class="text-gray-500">View bug reports, feedback from other roles.</p></div>'),
    ('admin_settings.html', 'Settings', 'System / Settings', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><h3 class="font-bold text-[#064E3B] text-lg mb-6">System Configuration</h3><p class="text-gray-500">Manage security, configurations, and global options.</p></div>'),
]

for filename, title, subtitle, content in pages:
    d = {
        'page_title': title,
        'page_subtitle': subtitle,
        'page_content': content,
        'dash_class': active_class if filename == 'admin_dashboard.html' else inactive_class,
        'dash_indicator': active_indicator if filename == 'admin_dashboard.html' else inactive_indicator,
        'dash_icon_class': active_icon if filename == 'admin_dashboard.html' else inactive_icon,
        'students_class': active_class if filename == 'admin_students.html' else inactive_class,
        'students_indicator': active_indicator if filename == 'admin_students.html' else inactive_indicator,
        'students_icon_class': active_icon if filename == 'admin_students.html' else inactive_icon,
        'employees_class': active_class if filename == 'admin_teachers.html' else inactive_class,
        'employees_indicator': active_indicator if filename == 'admin_teachers.html' else inactive_indicator,
        'employees_icon_class': active_icon if filename == 'admin_teachers.html' else inactive_icon,
        'sems_class': active_class if filename == 'admin_semesters.html' else inactive_class,
        'sems_indicator': active_indicator if filename == 'admin_semesters.html' else inactive_indicator,
        'sems_icon_class': active_icon if filename == 'admin_semesters.html' else inactive_icon,
        'subjects_class': active_class if filename == 'admin_subjects.html' else inactive_class,
        'subjects_indicator': active_indicator if filename == 'admin_subjects.html' else inactive_indicator,
        'subjects_icon_class': active_icon if filename == 'admin_subjects.html' else inactive_icon,
        'classes_class': active_class if filename == 'admin_classes.html' else inactive_class,
        'classes_indicator': active_indicator if filename == 'admin_classes.html' else inactive_indicator,
        'classes_icon_class': active_icon if filename == 'admin_classes.html' else inactive_icon,
        'messages_class': active_class if filename == 'admin_messages.html' else inactive_class,
        'messages_indicator': active_indicator if filename == 'admin_messages.html' else inactive_indicator,
        'messages_icon_class': active_icon if filename == 'admin_messages.html' else inactive_icon,
        'feedback_class': active_class if filename == 'admin_feedback.html' else inactive_class,
        'feedback_indicator': active_indicator if filename == 'admin_feedback.html' else inactive_indicator,
        'feedback_icon_class': active_icon if filename == 'admin_feedback.html' else inactive_icon,
        'settings_class': active_class if filename == 'admin_settings.html' else inactive_class,
        'settings_indicator': active_indicator if filename == 'admin_settings.html' else inactive_indicator,
        'settings_icon_class': active_icon if filename == 'admin_settings.html' else inactive_icon,
    }
    with open(f'mockups/admin/{filename}', 'w', encoding='utf-8') as f:
        f.write(base_html.format(**d))

print('Done')
