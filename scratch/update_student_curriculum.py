import re

def update_curriculum():
    with open('mockups/student/student_curriculum.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Update Legend
    legend = '''
                <div class="flex space-x-4">
                    <div class="flex items-center text-xs font-bold text-gray-500">
                        <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Passed
                    </div>
                    <div class="flex items-center text-xs font-bold text-gray-500">
                        <span class="w-3 h-3 rounded-full bg-[#4318FF] mr-2"></span> Studying
                    </div>
                    <div class="flex items-center text-xs font-bold text-gray-500">
                        <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Failed
                    </div>
                    <div class="flex items-center text-xs font-bold text-gray-500">
                        <span class="w-3 h-3 rounded-full bg-gray-300 mr-2"></span> Upcoming
                    </div>
                </div>
    '''
    html = re.sub(r'<div class="flex space-x-4">.*?</div>\s*</div>\s*</div>\s*<div class="max-w-5xl">', legend + '\n            </div>\n\n            <div class="max-w-5xl">', html, flags=re.DOTALL)

    # New Semesters Data
    semesters_html = '''
                <!-- Semester Block: Completed -->
                <div class="mb-12 relative pl-8 border-l-2 border-green-500">
                    <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                        <i data-lucide="check" class="w-3 h-3 text-green-500"></i>
                    </div>
                    <h2 class="text-xl font-extrabold text-[#1B2559] mb-6">Semester 1</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        <!-- Passed -->
                        <div class="bg-white border-2 border-green-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -z-0"></div>
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">CSI104</span>
                                    <span class="text-xs font-bold text-gray-400">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-[#1B2559] leading-tight">Introduction to Computing</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-gray-400">
                                    <i data-lucide="check-circle-2" class="w-4 h-4 text-green-500 mr-1"></i> Passed
                                </div>
                            </div>
                        </div>

                        <!-- Passed -->
                        <div class="bg-white border-2 border-green-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -z-0"></div>
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">PRF192</span>
                                    <span class="text-xs font-bold text-gray-400">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-[#1B2559] leading-tight">Programming Fundamentals</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-gray-400">
                                    <i data-lucide="check-circle-2" class="w-4 h-4 text-green-500 mr-1"></i> Passed
                                </div>
                            </div>
                        </div>

                        <!-- Failed -->
                        <div class="bg-white border-2 border-red-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-0"></div>
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">CEA201</span>
                                    <span class="text-xs font-bold text-gray-400">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-[#1B2559] leading-tight">Computer Organization</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-red-500">
                                    <i data-lucide="x-circle" class="w-4 h-4 mr-1"></i> Failed (Retake Required)
                                </div>
                            </div>
                        </div>

                        <!-- Passed -->
                        <div class="bg-white border-2 border-green-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -z-0"></div>
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">MAE101</span>
                                    <span class="text-xs font-bold text-gray-400">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-[#1B2559] leading-tight">Mathematics for Engineering</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-gray-400">
                                    <i data-lucide="check-circle-2" class="w-4 h-4 text-green-500 mr-1"></i> Passed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Semester Block: Current -->
                <div class="mb-12 relative pl-8 border-l-2 border-[#4318FF] border-dashed">
                    <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-blue-100 border-2 border-[#4318FF] flex items-center justify-center animate-pulse">
                        <div class="w-2 h-2 rounded-full bg-[#4318FF]"></div>
                    </div>
                    <h2 class="text-xl font-extrabold text-[#1B2559] mb-6 flex items-center">
                        Semester 5 <span class="ml-3 text-xs font-bold bg-[#4318FF]/10 text-[#4318FF] px-2 py-1 rounded-md">Current</span>
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        <!-- Studying -->
                        <div class="bg-[#4318FF]/5 border-2 border-[#4318FF]/30 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-16 h-16 bg-[#4318FF]/10 rounded-bl-full -z-0"></div>
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-[#4318FF] bg-white px-2 py-1 rounded shadow-sm">SWD392</span>
                                    <span class="text-xs font-bold text-[#4318FF]">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-[#1B2559] leading-tight">Software Architecture & Design</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-[#4318FF]">
                                    <i data-lucide="loader-2" class="w-4 h-4 mr-1 animate-spin"></i> Studying
                                </div>
                            </div>
                        </div>

                        <!-- Studying -->
                        <div class="bg-[#4318FF]/5 border-2 border-[#4318FF]/30 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-16 h-16 bg-[#4318FF]/10 rounded-bl-full -z-0"></div>
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-[#4318FF] bg-white px-2 py-1 rounded shadow-sm">PRJ301</span>
                                    <span class="text-xs font-bold text-[#4318FF]">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-[#1B2559] leading-tight">Java Web Application</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-[#4318FF]">
                                    <i data-lucide="loader-2" class="w-4 h-4 mr-1 animate-spin"></i> Studying
                                </div>
                            </div>
                        </div>
                        
                        <!-- Studying (Retake) -->
                        <div class="bg-[#4318FF]/5 border-2 border-[#4318FF]/30 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-16 h-16 bg-[#4318FF]/10 rounded-bl-full -z-0"></div>
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-orange-500 bg-white px-2 py-1 rounded shadow-sm border border-orange-200">CEA201</span>
                                    <span class="text-xs font-bold text-[#4318FF]">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-[#1B2559] leading-tight">Computer Organization</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-[#4318FF]">
                                    <i data-lucide="loader-2" class="w-4 h-4 mr-1 animate-spin"></i> Studying (Retake)
                                </div>
                            </div>
                        </div>
                        
                        <!-- Studying -->
                        <div class="bg-[#4318FF]/5 border-2 border-[#4318FF]/30 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-16 h-16 bg-[#4318FF]/10 rounded-bl-full -z-0"></div>
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-[#4318FF] bg-white px-2 py-1 rounded shadow-sm">IOT102</span>
                                    <span class="text-xs font-bold text-[#4318FF]">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-[#1B2559] leading-tight">Internet of Things</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-[#4318FF]">
                                    <i data-lucide="loader-2" class="w-4 h-4 mr-1 animate-spin"></i> Studying
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Semester Block: Future -->
                <div class="mb-12 relative pl-8 border-l-2 border-gray-200">
                    <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                        <div class="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                    <h2 class="text-xl font-extrabold text-gray-400 mb-6">Semester 6</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 opacity-70 grayscale">
                        <!-- Upcoming -->
                        <div class="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">PRN211</span>
                                    <span class="text-xs font-bold text-gray-400">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-gray-600 leading-tight">C# and .NET Framework</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-gray-400">
                                    <i data-lucide="lock" class="w-3 h-3 mr-1"></i> Upcoming
                                </div>
                            </div>
                        </div>
                        
                        <!-- Upcoming -->
                        <div class="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">MLN101</span>
                                    <span class="text-xs font-bold text-gray-400">3 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-gray-600 leading-tight">Machine Learning Basics</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-gray-400">
                                    <i data-lucide="lock" class="w-3 h-3 mr-1"></i> Upcoming
                                </div>
                            </div>
                        </div>
                        
                        <!-- Upcoming -->
                        <div class="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                            <div class="relative z-10">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">SEP490</span>
                                    <span class="text-xs font-bold text-gray-400">6 cr</span>
                                </div>
                                <h4 class="text-sm font-bold text-gray-600 leading-tight">Capstone Project</h4>
                                <div class="mt-3 flex items-center text-xs font-bold text-gray-400">
                                    <i data-lucide="lock" class="w-3 h-3 mr-1"></i> Upcoming
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    '''
    
    html = re.sub(r'<!-- Semester Block: Completed -->.*<!-- Semester Block: Future -->.*?</div>\s*</div>\s*</div>\s*</div>', semesters_html + '\n            </div>\n\n        </div>', html, flags=re.DOTALL)
    
    with open('mockups/student/student_curriculum.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    update_curriculum()
