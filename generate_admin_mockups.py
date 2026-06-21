import os

os.makedirs('mockups/admin', exist_ok=True)

base_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ART-AI Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {{ font-family: 'Inter', sans-serif; background-color: #F4F7FE; }}
        .admin-green-gradient {{ background: linear-gradient(135deg, #16A34A 0%, #4ADE80 100%); }}
    </style>
</head>
<body class="flex h-screen overflow-hidden">

    <!-- ADMIN SIDEBAR (DARK THEME) -->
    <aside class="w-[280px] bg-[#064E3B] flex flex-col h-full shadow-2xl relative z-20">
        <!-- Logo -->
        <a href="admin_dashboard.html" class="h-24 flex items-center px-8 cursor-pointer border-b border-white/10">
            <div class="w-10 h-10 rounded-xl admin-green-gradient flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-green-500/30">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <span class="text-2xl font-extrabold text-white tracking-tight">ART-AI<span class="text-[#4ADE80] text-xs align-top ml-1">ADMIN</span></span>
        </a>

        <!-- Navigation Links -->
        <nav class="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            <a href="admin_dashboard.html" class="{dash_class}">
                {dash_indicator}
                <i data-lucide="layout-dashboard" class="w-5 h-5 mr-4 {dash_icon_class}"></i>
                Dashboard
            </a>
            
            <a href="admin_users.html" class="{users_class}">
                {users_indicator}
                <i data-lucide="users" class="w-5 h-5 mr-4 {users_icon_class}"></i>
                User Management
            </a>

            <a href="admin_semesters.html" class="{sems_class}">
                {sems_indicator}
                <i data-lucide="calendar-days" class="w-5 h-5 mr-4 {sems_icon_class}"></i>
                Semesters
            </a>

            <a href="admin_classes.html" class="{classes_class}">
                {classes_indicator}
                <i data-lucide="book-open" class="w-5 h-5 mr-4 {classes_icon_class}"></i>
                Classes
            </a>
        </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
        <!-- TOP HEADER -->
        <header class="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10">
            <div>
                <h1 class="text-2xl font-extrabold text-[#064E3B]">{page_title}</h1>
                <p class="text-sm font-medium text-gray-500 mt-1">{page_subtitle}</p>
            </div>
            
            <div class="flex items-center space-x-6">
                <button class="relative p-2.5 text-gray-400 hover:text-[#16A34A] hover:bg-green-50 rounded-xl transition-all">
                    <i data-lucide="bell" class="w-6 h-6"></i>
                    <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div class="flex items-center pl-6 border-l border-gray-200 gap-3">
                    <div class="text-right">
                        <p class="text-sm font-bold text-[#064E3B]">System Admin</p>
                        <p class="text-xs font-medium text-gray-500">Administrator</p>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Admin&background=16A34A&color=fff" alt="User" class="w-10 h-10 rounded-full border-2 border-white shadow-sm">
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
    ('admin_dashboard.html', 'Admin Dashboard', 'System Overview', '<div class="grid grid-cols-3 gap-6"><div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><h3 class="text-gray-500 font-semibold mb-2">Total Users</h3><p class="text-3xl font-extrabold text-[#064E3B]">1,245</p></div><div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><h3 class="text-gray-500 font-semibold mb-2">Active Classes</h3><p class="text-3xl font-extrabold text-[#064E3B]">84</p></div><div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><h3 class="text-gray-500 font-semibold mb-2">System Load</h3><p class="text-3xl font-extrabold text-green-600">Normal</p></div></div>'),
    ('admin_users.html', 'User Management', 'Manage students, lecturers and roles', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><div class="flex justify-between mb-6"><input type="text" placeholder="Search users..." class="border border-gray-200 rounded-xl px-4 py-2 w-64"><button class="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700">+ Add User</button></div><table class="w-full text-left"><tr class="text-gray-500 border-b border-gray-100"><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr><tr class="border-b border-gray-50"><td class="py-4 font-bold text-[#064E3B]">Nguyen Van A</td><td class="py-4">a@fpt.edu.vn</td><td class="py-4"><span class="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-xs font-bold">Student</span></td><td class="py-4"><span class="text-green-600 font-medium">Active</span></td><td class="py-4 text-[#16A34A] font-medium cursor-pointer">Edit</td></tr></table></div>'),
    ('admin_semesters.html', 'Semesters', 'Manage academic semesters', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><button class="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 mb-6">+ Add Semester</button><ul class="space-y-4"><li><div class="flex justify-between items-center p-4 border border-green-200 bg-green-50 rounded-xl"><span class="font-bold text-[#064E3B]">Summer 2026 (SU26)</span><span class="bg-[#16A34A] text-white text-xs px-2 py-1 rounded-full">Current</span></div></li><li><div class="flex justify-between items-center p-4 border border-gray-100 rounded-xl"><span class="font-bold text-gray-700">Spring 2026 (SP26)</span><span class="text-gray-500 text-sm">Past</span></div></li></ul></div>'),
    ('admin_classes.html', 'Class Management', 'Manage classes and import students', '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><div class="flex justify-between mb-6"><input type="text" placeholder="Search classes..." class="border border-gray-200 rounded-xl px-4 py-2 w-64"><div class="space-x-2"><button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200"><i data-lucide="upload" class="w-4 h-4 inline mr-2"></i>Import Excel</button><button class="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700">+ Create Class</button></div></div><table class="w-full text-left"><tr class="text-gray-500 border-b border-gray-100"><th>Class Code</th><th>Subject</th><th>Lecturer</th><th>Students</th><th>Actions</th></tr><tr class="border-b border-gray-50"><td class="py-4 font-bold text-[#064E3B]">SE18D01</td><td class="py-4">SWD392</td><td class="py-4">Dr. Khue</td><td class="py-4">30/30</td><td class="py-4 text-[#16A34A] font-medium cursor-pointer">Manage</td></tr></table></div>')
]

for filename, title, subtitle, content in pages:
    d = {
        'page_title': title,
        'page_subtitle': subtitle,
        'page_content': content,
        'dash_class': active_class if filename == 'admin_dashboard.html' else inactive_class,
        'dash_indicator': active_indicator if filename == 'admin_dashboard.html' else inactive_indicator,
        'dash_icon_class': active_icon if filename == 'admin_dashboard.html' else inactive_icon,
        'users_class': active_class if filename == 'admin_users.html' else inactive_class,
        'users_indicator': active_indicator if filename == 'admin_users.html' else inactive_indicator,
        'users_icon_class': active_icon if filename == 'admin_users.html' else inactive_icon,
        'sems_class': active_class if filename == 'admin_semesters.html' else inactive_class,
        'sems_indicator': active_indicator if filename == 'admin_semesters.html' else inactive_indicator,
        'sems_icon_class': active_icon if filename == 'admin_semesters.html' else inactive_icon,
        'classes_class': active_class if filename == 'admin_classes.html' else inactive_class,
        'classes_indicator': active_indicator if filename == 'admin_classes.html' else inactive_indicator,
        'classes_icon_class': active_icon if filename == 'admin_classes.html' else inactive_icon,
    }
    with open(f'mockups/admin/{filename}', 'w', encoding='utf-8') as f:
        f.write(base_html.format(**d))

print('Done')
