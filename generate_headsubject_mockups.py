import os

os.makedirs('mockups/headsubject', exist_ok=True)

NAV_ITEMS = [
    ('dashboard', 'layout-dashboard', 'Dashboard', 'headsubject_dashboard.html'),
    ('classes', 'book-open', 'Classes', 'headsubject_classes.html'),
    ('approvals', 'clipboard-check', 'Grade Approvals', 'headsubject_grade_approvals.html'),
    ('flags', 'shield-alert', 'AI Flags', 'headsubject_flags.html'),
    ('reports', 'bar-chart-2', 'Reports', 'headsubject_reports.html'),
    ('messages', 'message-circle', 'Messages', 'headsubject_messages.html'),
    ('settings', 'settings', 'Settings', 'headsubject_settings.html'),
]

def nav_link(key, icon, label, href, active):
    if active == key:
        return f'''
            <a href="{href}" class="flex items-center px-4 py-3.5 bg-white/10 text-white font-bold rounded-xl transition-all relative">
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#EAB308] rounded-r-full"></div>
                <i data-lucide="{icon}" class="w-5 h-5 mr-4 text-[#EAB308]"></i>
                <span class="sidebar-text whitespace-nowrap">{label}</span>
                {'<span class="sidebar-text ml-auto bg-[#EAB308] text-[#1B2559] text-xs font-bold px-2 py-0.5 rounded-full">3</span>' if key == 'approvals' else ''}
            </a>'''
    return f'''
            <a href="{href}" class="flex items-center px-4 py-3.5 text-blue-200 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5">
                <i data-lucide="{icon}" class="w-5 h-5 mr-4 opacity-70"></i>
                <span class="sidebar-text whitespace-nowrap">{label}</span>
            </a>'''

def sidebar(active):
    links = ''.join(nav_link(k, i, l, h, active) for k, i, l, h in NAV_ITEMS)
    return f'''
    <aside id="sidebar" class="w-[280px] bg-[#1B2559] fixed h-full shadow-[4px_0_24px_rgba(0,0,0,0.2)] border-r border-white/5 z-30 flex flex-col transition-all duration-300 -translate-x-full lg:translate-x-0">
        <div class="h-24 flex items-center px-6 border-b border-white/10 shrink-0">
            <a href="headsubject_dashboard.html" class="flex items-center">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#FACC15] flex items-center justify-center text-[#1B2559] mr-3 shadow-lg shadow-yellow-500/30">
                    <i data-lucide="brain-circuit" class="w-6 h-6"></i>
                </div>
                <span class="sidebar-text text-2xl font-extrabold text-white tracking-tight">ART-AI<span class="text-[#EAB308] text-[10px] align-top ml-1 block leading-none">HEAD SUBJECT</span></span>
            </a>
            <button id="mobileCloseSidebar" class="lg:hidden absolute right-4 text-white/50 hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">{links}
        </nav>
        <div class="p-4 border-t border-white/10 shrink-0">
            <a href="../auth/login.html" class="flex items-center px-4 py-3 text-red-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-bold">
                <i data-lucide="log-out" class="w-5 h-5 mr-3"></i>
                <span class="sidebar-text">Logout</span>
            </a>
        </div>
    </aside>'''

def header(title, subtitle, back_href=None):
    back = ''
    if back_href:
        back = f'''<a href="{back_href}" class="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-[#EAB308] hover:border-[#EAB308] text-gray-500 hover:text-[#1B2559] flex items-center justify-center transition-all mr-4">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </a>'''
    return f'''
        <header class="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-10 shrink-0">
            <div class="flex items-center">
                <button id="sidebarToggle" class="mr-4 p-2 text-gray-500 hover:text-[#EAB308] rounded-lg hover:bg-yellow-50 lg:hidden">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>
                {back}
                <div>
                    <h1 class="text-xl lg:text-2xl font-extrabold text-[#1B2559]">{title}</h1>
                    <p class="text-sm font-medium text-gray-500 mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <select class="hidden sm:block appearance-none bg-gray-50 border border-gray-200 text-[#1B2559] text-sm font-bold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#EAB308]/30 cursor-pointer">
                    <option>Spring 2026</option>
                    <option>Fall 2025</option>
                </select>
                <button class="relative p-2.5 text-gray-400 hover:text-[#EAB308] hover:bg-yellow-50 rounded-xl">
                    <i data-lucide="bell" class="w-6 h-6"></i>
                    <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div class="flex items-center pl-4 border-l border-gray-200 gap-3">
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-bold text-[#1B2559]">Dr. Tran Minh Hoang</p>
                        <p class="text-xs text-gray-500">Software Engineering Dept.</p>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Head+Subject&background=EAB308&color=1B2559" class="w-10 h-10 rounded-full border-2 border-white shadow-md">
                </div>
            </div>
        </header>'''

FOOTER_SCRIPT = '''
    <script>lucide.createIcons();</script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            const overlay = document.getElementById('sidebarOverlay');
            const open = () => { sidebar.classList.remove('-translate-x-full'); overlay.classList.remove('hidden'); setTimeout(() => overlay.classList.remove('opacity-0'), 10); };
            const close = () => { sidebar.classList.add('-translate-x-full'); overlay.classList.add('opacity-0'); setTimeout(() => overlay.classList.add('hidden'), 300); };
            document.getElementById('sidebarToggle')?.addEventListener('click', open);
            document.getElementById('mobileCloseSidebar')?.addEventListener('click', close);
            overlay?.addEventListener('click', close);
        });
    </script>'''

def page(title, page_title, active, content, back_href=None):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ART-AI Head Subject - {page_title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {{ font-family: 'Inter', sans-serif; background-color: #F4F7FE; }}
        ::-webkit-scrollbar {{ width: 6px; }}
        ::-webkit-scrollbar-thumb {{ background: #CBD5E1; border-radius: 10px; }}
    </style>
</head>
<body class="flex h-screen overflow-hidden">
    <div id="sidebarOverlay" class="fixed inset-0 bg-gray-900/50 z-20 hidden lg:hidden opacity-0 transition-opacity"></div>
    {sidebar(active)}
    <main id="mainContent" class="flex-1 ml-0 lg:ml-[280px] flex flex-col h-screen overflow-hidden">
        {header(title, page_title, back_href)}
        <div class="flex-1 overflow-y-auto p-6 lg:p-10">{content}</div>
    </main>
    {FOOTER_SCRIPT}
</body>
</html>'''

# ── Page contents ─────────────────────────────────────────────────────────────

DASHBOARD = '''
<div class="max-w-7xl mx-auto space-y-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 text-[#4318FF] flex items-center justify-center mr-4"><i data-lucide="layers" class="w-7 h-7"></i></div>
            <div><p class="text-sm font-bold text-gray-400">Total Classes</p><h3 class="text-2xl font-extrabold text-[#1B2559]">8</h3></div>
        </div>
        <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
            <div class="w-14 h-14 rounded-2xl bg-yellow-50 text-[#CA8A04] flex items-center justify-center mr-4"><i data-lucide="clipboard-check" class="w-7 h-7"></i></div>
            <div><p class="text-sm font-bold text-gray-400">Pending Approvals</p><h3 class="text-2xl font-extrabold text-[#1B2559]">3</h3></div>
        </div>
        <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
            <div class="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mr-4"><i data-lucide="shield-alert" class="w-7 h-7"></i></div>
            <div><p class="text-sm font-bold text-gray-400">High AI Flags</p><h3 class="text-2xl font-extrabold text-[#1B2559]">5</h3></div>
        </div>
        <div class="bg-[#1B2559] p-6 rounded-[24px] shadow-lg flex flex-col justify-center">
            <p class="text-sm font-bold text-blue-200">Department Pass Rate</p>
            <h3 class="text-3xl font-extrabold text-white mt-1">87.4%</h3>
            <p class="text-xs text-blue-300 mt-1">Spring 2026 • Software Engineering</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-extrabold text-[#1B2559]">AI Usage by Class</h2>
                <a href="headsubject_reports.html" class="text-sm font-bold text-[#EAB308] hover:underline">View Reports</a>
            </div>
            <canvas id="aiUsageChart" height="120"></canvas>
        </div>
        <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
            <h2 class="text-lg font-extrabold text-[#1B2559] mb-6">Score Distribution</h2>
            <canvas id="scoreChart" height="200"></canvas>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-extrabold text-[#1B2559]">Pending Grade Approvals</h2>
                <a href="headsubject_grade_approvals.html" class="text-sm font-bold text-[#EAB308]">View all</a>
            </div>
            <div class="space-y-3">
                <div class="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <div>
                        <p class="font-bold text-[#1B2559] text-sm">PRJ301 • SE20A09</p>
                        <p class="text-xs text-gray-500 mt-1">Dr. Nguyen Van A • Sent 2 hours ago</p>
                    </div>
                    <span class="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full">Pending</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <div>
                        <p class="font-bold text-[#1B2559] text-sm">SWT301 • SE20A10</p>
                        <p class="text-xs text-gray-500 mt-1">Dr. Le Thi B • Sent yesterday</p>
                    </div>
                    <span class="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full">Pending</span>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-extrabold text-[#1B2559]">High Severity Flags</h2>
                <a href="headsubject_flags.html" class="text-sm font-bold text-[#EAB308]">View all</a>
            </div>
            <div class="space-y-3">
                <div class="flex items-start p-4 bg-red-50 rounded-2xl border border-red-100">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0"></i>
                    <div>
                        <p class="font-bold text-[#1B2559] text-sm">HIGH AI Dependency</p>
                        <p class="text-xs text-gray-500 mt-1">Nguyen Van Duc • PRJ301 Slot 5 • Pattern: HIGH_DEPENDENCY</p>
                    </div>
                </div>
                <div class="flex items-start p-4 bg-red-50 rounded-2xl border border-red-100">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0"></i>
                    <div>
                        <p class="font-bold text-[#1B2559] text-sm">Missing AI Interactions</p>
                        <p class="text-xs text-gray-500 mt-1">Tran Thi E • SWT301 Slot 3 • Flag: MISSING_AI_INTERACTIONS</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
new Chart(document.getElementById('aiUsageChart'), {
    type: 'bar',
    data: {
        labels: ['PRJ301-A09', 'PRJ301-A10', 'SWT301-A09', 'SWT301-A10', 'OSG301-A01'],
        datasets: [{ label: 'AI Evaluations', data: [42, 38, 35, 29, 31], backgroundColor: '#EAB308', borderRadius: 8 }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
});
new Chart(document.getElementById('scoreChart'), {
    type: 'doughnut',
    data: {
        labels: ['Excellent', 'Very Good', 'Good', 'Average', 'Poor'],
        datasets: [{ data: [12, 28, 35, 18, 7], backgroundColor: ['#16A34A', '#4318FF', '#EAB308', '#F26F21', '#EF4444'] }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
});
</script>'''

CLASSES = '''
<div class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex gap-3">
            <select class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#1B2559]">
                <option>All Subjects</option><option>PRJ301</option><option>SWT301</option><option>OSG301</option>
            </select>
            <select class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#1B2559]">
                <option>All Lecturers</option><option>Dr. Nguyen Van A</option><option>Dr. Le Thi B</option>
            </select>
        </div>
        <button class="bg-[#EAB308] hover:bg-[#CA8A04] text-[#1B2559] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-md">
            <i data-lucide="download" class="w-4 h-4 mr-2"></i> Export All
        </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <a href="headsubject_class_detail.html" class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group block">
            <div class="flex justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-yellow-50 text-[#CA8A04] flex items-center justify-center font-bold">PRJ</div>
                <span class="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
            </div>
            <h3 class="text-lg font-bold text-[#1B2559] group-hover:text-[#CA8A04]">PRJ301 • SE20A09</h3>
            <p class="text-sm text-gray-500 mt-1">Java Web Application</p>
            <p class="text-xs text-gray-400 mt-2">Lecturer: Dr. Nguyen Van A</p>
            <div class="flex justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
                <span class="text-gray-500">35 students</span>
                <span class="font-bold text-[#4318FF]">Avg: 7.8</span>
            </div>
        </a>
        <a href="headsubject_class_detail.html" class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group block">
            <div class="flex justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-[#4318FF] flex items-center justify-center font-bold">SWT</div>
                <span class="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full">Pending Approval</span>
            </div>
            <h3 class="text-lg font-bold text-[#1B2559] group-hover:text-[#4318FF]">SWT301 • SE20A10</h3>
            <p class="text-sm text-gray-500 mt-1">Software Testing</p>
            <p class="text-xs text-gray-400 mt-2">Lecturer: Dr. Le Thi B</p>
            <div class="flex justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
                <span class="text-gray-500">32 students</span>
                <span class="font-bold text-[#4318FF]">Avg: 7.2</span>
            </div>
        </a>
        <a href="headsubject_class_detail.html" class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group block">
            <div class="flex justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-orange-50 text-[#F26F21] flex items-center justify-center font-bold">OSG</div>
                <span class="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">2 High Flags</span>
            </div>
            <h3 class="text-lg font-bold text-[#1B2559] group-hover:text-[#F26F21]">OSG301 • SE20A01</h3>
            <p class="text-sm text-gray-500 mt-1">Operating Systems</p>
            <p class="text-xs text-gray-400 mt-2">Lecturer: Dr. Pham Van C</p>
            <div class="flex justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
                <span class="text-gray-500">30 students</span>
                <span class="font-bold text-[#4318FF]">Avg: 6.9</span>
            </div>
        </a>
    </div>
</div>'''

CLASS_DETAIL = '''
<div class="max-w-6xl mx-auto space-y-6">
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-wrap justify-between gap-4">
        <div>
            <p class="text-sm text-gray-500 font-medium">PRJ301 • SE20A09</p>
            <h2 class="text-2xl font-extrabold text-[#1B2559] mt-1">Java Web Application</h2>
            <p class="text-sm text-gray-500 mt-2">Lecturer: Dr. Nguyen Van A • 35 students • Spring 2026</p>
        </div>
        <div class="flex gap-3 items-center">
            <button class="border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-[#1B2559] hover:bg-gray-50 flex items-center"><i data-lucide="download" class="w-4 h-4 mr-2"></i>Export</button>
            <button class="bg-[#EAB308] px-4 py-2 rounded-xl text-sm font-bold text-[#1B2559] flex items-center"><i data-lucide="eye" class="w-4 h-4 mr-2"></i>View Grade Report</button>
        </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-gray-100 text-center"><p class="text-xs text-gray-400 font-bold">Pass Rate</p><p class="text-2xl font-extrabold text-green-600 mt-1">91%</p></div>
        <div class="bg-white p-5 rounded-2xl border border-gray-100 text-center"><p class="text-xs text-gray-400 font-bold">Avg Score</p><p class="text-2xl font-extrabold text-[#1B2559] mt-1">7.8</p></div>
        <div class="bg-white p-5 rounded-2xl border border-gray-100 text-center"><p class="text-xs text-gray-400 font-bold">AI Evaluations</p><p class="text-2xl font-extrabold text-[#4318FF] mt-1">42</p></div>
        <div class="bg-white p-5 rounded-2xl border border-gray-100 text-center"><p class="text-xs text-gray-400 font-bold">High Flags</p><p class="text-2xl font-extrabold text-red-500 mt-1">1</p></div>
    </div>
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 class="font-extrabold text-[#1B2559]">Final Results Gradebook</h3>
            <span class="text-xs font-bold px-3 py-1 bg-green-50 text-green-700 rounded-full">Approved</span>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                    <tr><th class="px-6 py-4 text-left">Student</th><th class="px-4 py-4 text-center">Slot 1</th><th class="px-4 py-4 text-center">Slot 2</th><th class="px-4 py-4 text-center">Slot 3</th><th class="px-4 py-4 text-center">Final</th><th class="px-4 py-4 text-center">Rank</th><th class="px-4 py-4 text-center">Classification</th></tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr class="hover:bg-gray-50"><td class="px-6 py-4 font-bold text-[#1B2559]">SE123456 - Nguyen Van A</td><td class="px-4 py-4 text-center">8.5</td><td class="px-4 py-4 text-center">9.0</td><td class="px-4 py-4 text-center">8.0</td><td class="px-4 py-4 text-center font-bold">8.5</td><td class="px-4 py-4 text-center">1</td><td class="px-4 py-4 text-center"><span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">Very Good</span></td></tr>
                    <tr class="hover:bg-gray-50"><td class="px-6 py-4 font-bold text-[#1B2559]">SE123457 - Tran Thi B</td><td class="px-4 py-4 text-center">7.0</td><td class="px-4 py-4 text-center">7.5</td><td class="px-4 py-4 text-center">8.0</td><td class="px-4 py-4 text-center font-bold">7.5</td><td class="px-4 py-4 text-center">2</td><td class="px-4 py-4 text-center"><span class="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold">Good</span></td></tr>
                    <tr class="hover:bg-gray-50 bg-red-50/30"><td class="px-6 py-4 font-bold text-[#1B2559]">SE123458 - Nguyen Van Duc <i data-lucide="flag" class="w-3 h-3 inline text-red-500"></i></td><td class="px-4 py-4 text-center">5.0</td><td class="px-4 py-4 text-center">4.5</td><td class="px-4 py-4 text-center">5.5</td><td class="px-4 py-4 text-center font-bold">5.0</td><td class="px-4 py-4 text-center">35</td><td class="px-4 py-4 text-center"><span class="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">Average</span></td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>'''

APPROVALS = '''
<div class="max-w-6xl mx-auto space-y-6">
    <div class="flex gap-3">
        <button class="bg-[#1B2559] text-white px-5 py-2 rounded-xl text-sm font-bold">Pending (3)</button>
        <button class="bg-white border border-gray-200 text-gray-500 px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-50">Approved (12)</button>
        <button class="bg-white border border-gray-200 text-gray-500 px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-50">Rejected (1)</button>
    </div>
    <div class="space-y-4">
        <div class="bg-white rounded-[24px] border border-yellow-200 shadow-sm p-6">
            <div class="flex flex-wrap justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Pending Review</span>
                        <span class="text-xs text-gray-400">Submitted Jul 13, 2026 09:30</span>
                    </div>
                    <h3 class="text-lg font-extrabold text-[#1B2559]">PRJ301 • SE20A09 — Final Grade Report</h3>
                    <p class="text-sm text-gray-500 mt-1">Lecturer: Dr. Nguyen Van A • 35 students • Avg score: 7.8</p>
                    <p class="text-xs text-gray-400 mt-2 italic">Note: "All slots graded. Ready for department review."</p>
                </div>
                <div class="flex gap-3 items-start">
                    <button onclick="document.getElementById('rejectModal').classList.remove('hidden')" class="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50">Reject</button>
                    <button onclick="document.getElementById('approveModal').classList.remove('hidden')" class="bg-[#EAB308] hover:bg-[#CA8A04] text-[#1B2559] px-5 py-2.5 rounded-xl text-sm font-bold shadow-md">Approve</button>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                <button class="text-sm font-bold text-[#4318FF] flex items-center"><i data-lucide="table" class="w-4 h-4 mr-1"></i> Preview Gradebook</button>
                <button class="text-sm font-bold text-[#4318FF] flex items-center"><i data-lucide="download" class="w-4 h-4 mr-1"></i> Download CSV</button>
            </div>
        </div>
        <div class="bg-white rounded-[24px] border border-yellow-200 shadow-sm p-6">
            <div class="flex flex-wrap justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Pending Review</span>
                        <span class="text-xs text-gray-400">Submitted Jul 12, 2026 16:00</span>
                    </div>
                    <h3 class="text-lg font-extrabold text-[#1B2559]">SWT301 • SE20A10 — Final Grade Report</h3>
                    <p class="text-sm text-gray-500 mt-1">Lecturer: Dr. Le Thi B • 32 students • Avg score: 7.2</p>
                </div>
                <div class="flex gap-3 items-start">
                    <button class="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50">Reject</button>
                    <button class="bg-[#EAB308] hover:bg-[#CA8A04] text-[#1B2559] px-5 py-2.5 rounded-xl text-sm font-bold shadow-md">Approve</button>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="approveModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[24px] p-8 max-w-md w-full shadow-2xl">
        <h3 class="text-xl font-extrabold text-[#1B2559] mb-2">Approve Grade Report?</h3>
        <p class="text-sm text-gray-500 mb-6">This will lock the gradebook for PRJ301 SE20A09 and notify the lecturer.</p>
        <textarea class="w-full border border-gray-200 rounded-xl p-3 text-sm mb-4" rows="3" placeholder="Optional approval note..."></textarea>
        <div class="flex gap-3 justify-end">
            <button onclick="document.getElementById('approveModal').classList.add('hidden')" class="px-5 py-2 rounded-xl text-sm font-bold text-gray-500">Cancel</button>
            <button onclick="document.getElementById('approveModal').classList.add('hidden')" class="bg-[#EAB308] text-[#1B2559] px-5 py-2 rounded-xl text-sm font-bold">Confirm Approve</button>
        </div>
    </div>
</div>
<div id="rejectModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[24px] p-8 max-w-md w-full shadow-2xl">
        <h3 class="text-xl font-extrabold text-[#1B2559] mb-2">Reject Grade Report</h3>
        <p class="text-sm text-gray-500 mb-4">Please provide a reason for rejection (required).</p>
        <textarea class="w-full border border-gray-200 rounded-xl p-3 text-sm mb-4" rows="3" placeholder="Reason for rejection..."></textarea>
        <div class="flex gap-3 justify-end">
            <button onclick="document.getElementById('rejectModal').classList.add('hidden')" class="px-5 py-2 rounded-xl text-sm font-bold text-gray-500">Cancel</button>
            <button onclick="document.getElementById('rejectModal').classList.add('hidden')" class="bg-red-500 text-white px-5 py-2 rounded-xl text-sm font-bold">Confirm Reject</button>
        </div>
    </div>
</div>'''

FLAGS = '''
<div class="max-w-6xl mx-auto space-y-6">
    <div class="flex flex-wrap gap-3">
        <select class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold"><option>All Severities</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select>
        <select class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold"><option>All Flag Types</option><option>HIGH_AI_DEPENDENCY</option><option>MISSING_AI_INTERACTIONS</option><option>WEAK_REFLECTION</option></select>
    </div>
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                <tr><th class="px-6 py-4 text-left">Student</th><th class="px-4 py-4 text-left">Class</th><th class="px-4 py-4 text-left">Flag Type</th><th class="px-4 py-4 text-center">Severity</th><th class="px-4 py-4 text-center">Status</th><th class="px-4 py-4 text-right">Action</th></tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-bold text-[#1B2559]">Nguyen Van Duc</td>
                    <td class="px-4 py-4">PRJ301 • SE20A09</td>
                    <td class="px-4 py-4">HIGH_AI_DEPENDENCY</td>
                    <td class="px-4 py-4 text-center"><span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">HIGH</span></td>
                    <td class="px-4 py-4 text-center"><span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Open</span></td>
                    <td class="px-4 py-4 text-right"><button class="text-[#4318FF] font-bold text-xs">View Detail</button></td>
                </tr>
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-bold text-[#1B2559]">Tran Thi E</td>
                    <td class="px-4 py-4">SWT301 • SE20A10</td>
                    <td class="px-4 py-4">MISSING_AI_INTERACTIONS</td>
                    <td class="px-4 py-4 text-center"><span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">HIGH</span></td>
                    <td class="px-4 py-4 text-center"><span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Open</span></td>
                    <td class="px-4 py-4 text-right"><button class="text-[#4318FF] font-bold text-xs">View Detail</button></td>
                </tr>
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-bold text-[#1B2559]">Le Van F</td>
                    <td class="px-4 py-4">OSG301 • SE20A01</td>
                    <td class="px-4 py-4">WEAK_REFLECTION</td>
                    <td class="px-4 py-4 text-center"><span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">MEDIUM</span></td>
                    <td class="px-4 py-4 text-center"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Resolved</span></td>
                    <td class="px-4 py-4 text-right"><button class="text-[#4318FF] font-bold text-xs">View Detail</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>'''

REPORTS = '''
<div class="max-w-5xl mx-auto space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            <i data-lucide="book-open" class="w-8 h-8 text-[#EAB308] mb-4"></i>
            <h3 class="font-extrabold text-[#1B2559] mb-2">Class Report</h3>
            <p class="text-sm text-gray-500 mb-4">Export grade summary, final results, rankings for a specific class.</p>
            <select class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3"><option>PRJ301 • SE20A09</option><option>SWT301 • SE20A10</option></select>
            <button class="w-full bg-[#1B2559] text-white py-2.5 rounded-xl text-sm font-bold">Export XLSX</button>
        </div>
        <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            <i data-lucide="library" class="w-8 h-8 text-[#4318FF] mb-4"></i>
            <h3 class="font-extrabold text-[#1B2559] mb-2">Subject Report</h3>
            <p class="text-sm text-gray-500 mb-4">AI usage trends and academic performance across all classes of a subject.</p>
            <select class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3"><option>PRJ301</option><option>SWT301</option><option>OSG301</option></select>
            <button class="w-full bg-[#1B2559] text-white py-2.5 rounded-xl text-sm font-bold">Export PDF</button>
        </div>
        <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            <i data-lucide="calendar" class="w-8 h-8 text-[#F26F21] mb-4"></i>
            <h3 class="font-extrabold text-[#1B2559] mb-2">Semester Report</h3>
            <p class="text-sm text-gray-500 mb-4">Department-wide AI usage and pass rate for the entire semester.</p>
            <select class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3"><option>Spring 2026</option><option>Fall 2025</option></select>
            <button class="w-full bg-[#1B2559] text-white py-2.5 rounded-xl text-sm font-bold">Export CSV</button>
        </div>
    </div>
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
        <h3 class="font-extrabold text-[#1B2559] mb-4">Suspicious Cases Report</h3>
        <p class="text-sm text-gray-500 mb-4">List of submissions with HIGH severity flags across all managed classes.</p>
        <button class="bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center"><i data-lucide="shield-alert" class="w-4 h-4 mr-2"></i> Export Suspicious Cases (5 records)</button>
    </div>
</div>'''

MESSAGES = '''
<div class="max-w-6xl mx-auto h-[calc(100vh-12rem)]">
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm h-full flex overflow-hidden">
        <div class="w-80 border-r border-gray-100 flex flex-col shrink-0">
            <div class="p-4 border-b border-gray-100"><input type="text" placeholder="Search conversations..." class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"></div>
            <div class="flex-1 overflow-y-auto">
                <div class="p-4 bg-yellow-50 border-l-4 border-[#EAB308] cursor-pointer">
                    <p class="font-bold text-[#1B2559] text-sm">Dr. Nguyen Van A</p>
                    <p class="text-xs text-gray-500 mt-1 truncate">Grade report for PRJ301 submitted...</p>
                </div>
                <div class="p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-transparent">
                    <p class="font-bold text-[#1B2559] text-sm">Dr. Le Thi B</p>
                    <p class="text-xs text-gray-500 mt-1 truncate">Can you review the AI flag case?</p>
                </div>
            </div>
        </div>
        <div class="flex-1 flex flex-col">
            <div class="p-4 border-b border-gray-100 flex items-center">
                <img src="https://ui-avatars.com/api/?name=NVA&background=f97316&color=fff" class="w-10 h-10 rounded-full mr-3">
                <div><p class="font-bold text-[#1B2559]">Dr. Nguyen Van A</p><p class="text-xs text-green-500 font-bold">Online</p></div>
            </div>
            <div class="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
                <div class="flex"><div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-md text-sm">I've submitted the final grade report for PRJ301 SE20A09. Please review when you have time.</div></div>
                <div class="flex justify-end"><div class="bg-[#1B2559] text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-md text-sm">Received. I'll review it today.</div></div>
            </div>
            <div class="p-4 border-t border-gray-100 flex gap-3">
                <input type="text" placeholder="Type a message..." class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm">
                <button class="bg-[#EAB308] text-[#1B2559] px-5 py-2.5 rounded-xl font-bold text-sm">Send</button>
            </div>
        </div>
    </div>
</div>'''

SETTINGS = '''
<div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div class="md:w-56 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-100 space-y-2">
            <button class="w-full text-left px-4 py-3 rounded-xl bg-white font-bold text-[#1B2559] shadow-sm text-sm">Profile</button>
            <button class="w-full text-left px-4 py-3 rounded-xl text-gray-500 hover:bg-white font-bold text-sm">Password</button>
            <button class="w-full text-left px-4 py-3 rounded-xl text-gray-500 hover:bg-white font-bold text-sm">Notifications</button>
        </div>
        <div class="flex-1 p-8 space-y-6">
            <h2 class="text-xl font-extrabold text-[#1B2559]">Profile Settings</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label class="text-xs font-bold text-gray-400 uppercase">Full Name</label><input value="Dr. Tran Minh Hoang" class="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium"></div>
                <div><label class="text-xs font-bold text-gray-400 uppercase">Email</label><input value="headsubject@fpt.edu.vn" class="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium"></div>
                <div><label class="text-xs font-bold text-gray-400 uppercase">Department</label><input value="Software Engineering" readonly class="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium"></div>
                <div><label class="text-xs font-bold text-gray-400 uppercase">Role</label><input value="Subject Head" readonly class="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium"></div>
            </div>
            <button class="bg-[#EAB308] text-[#1B2559] px-6 py-2.5 rounded-xl text-sm font-bold">Save Changes</button>
        </div>
    </div>
</div>'''

PAGES = [
    ('headsubject_dashboard.html', 'Dashboard', 'dashboard', 'Department overview & analytics', DASHBOARD, None),
    ('headsubject_classes.html', 'Classes', 'classes', 'All classes in your department', CLASSES, None),
    ('headsubject_class_detail.html', 'Class Detail', 'classes', 'PRJ301 • SE20A09 — Gradebook & analytics', CLASS_DETAIL, 'headsubject_classes.html'),
    ('headsubject_grade_approvals.html', 'Grade Approvals', 'approvals', 'Review grade reports from lecturers', APPROVALS, None),
    ('headsubject_flags.html', 'AI Flags', 'flags', 'High severity academic integrity flags', FLAGS, None),
    ('headsubject_reports.html', 'Reports', 'reports', 'Export department reports', REPORTS, None),
    ('headsubject_messages.html', 'Messages', 'messages', 'Chat with lecturers in your department', MESSAGES, None),
    ('headsubject_settings.html', 'Settings', 'settings', 'Account & profile settings', SETTINGS, None),
]

for filename, title, active, subtitle, content, back in PAGES:
    html = page(title, subtitle, active, content, back)
    with open(f'mockups/headsubject/{filename}', 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Generated mockups/headsubject/{filename}')

print('Done! 8 Head Subject mockups generated.')
