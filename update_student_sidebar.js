const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'mockups', 'student');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const gradebookRegex = /<a href="gradebook\.html"[\s\S]*?<i data-lucide="award"[\s\S]*?Gradebook\s*<\/a>/i;

const dropdownHTML = `<!-- Reports Dropdown -->
            <div class="relative">
                <button class="w-full flex items-center justify-between px-4 py-3.5 text-gray-500 hover:text-gray-900 font-medium rounded-xl transition-all hover:bg-gray-50" onclick="this.nextElementSibling.classList.toggle('hidden'); const icon = this.querySelector('.chevron-icon'); if(icon) icon.classList.toggle('rotate-180');">
                    <div class="flex items-center">
                        <i data-lucide="bar-chart-2" class="w-5 h-5 mr-4"></i> Reports
                    </div>
                    <i data-lucide="chevron-down" class="w-4 h-4 chevron-icon transition-transform"></i>
                </button>
                <div class="hidden flex-col pl-12 pr-4 py-1 space-y-1 mt-1 border-l-2 border-gray-100 ml-6">
                    <a href="student_attendance.html" class="block py-2 text-sm text-gray-500 hover:text-[#4318FF] font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 before:bg-gray-200 hover:before:bg-[#4318FF]">Attendance</a>
                    <a href="gradebook.html" class="block py-2 text-sm text-gray-500 hover:text-[#4318FF] font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 before:bg-gray-200 hover:before:bg-[#4318FF]">Mark Report</a>
                    <a href="student_transcript.html" class="block py-2 text-sm text-gray-500 hover:text-[#4318FF] font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 before:bg-gray-200 hover:before:bg-[#4318FF]">Academic Transcript</a>
                    <a href="student_curriculum.html" class="block py-2 text-sm text-gray-500 hover:text-[#4318FF] font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 before:bg-gray-200 hover:before:bg-[#4318FF]">Curriculum</a>
                    <a href="student_transactions.html" class="block py-2 text-sm text-gray-500 hover:text-[#4318FF] font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 before:bg-gray-200 hover:before:bg-[#4318FF]">Transaction History</a>
                </div>
            </div>`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (gradebookRegex.test(content)) {
        // If it's gradebook.html, we should show the dropdown as open by default
        let replaceHTML = dropdownHTML;
        if (file === 'gradebook.html') {
            replaceHTML = replaceHTML.replace('class="hidden flex-col', 'class="flex flex-col');
            replaceHTML = replaceHTML.replace('chevron-icon transition-transform"', 'chevron-icon transition-transform rotate-180"');
            // make Mark Report active
            replaceHTML = replaceHTML.replace(
                '<a href="gradebook.html" class="block py-2 text-sm text-gray-500 hover:text-[#4318FF] font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 before:bg-gray-200 hover:before:bg-[#4318FF]">Mark Report</a>',
                '<a href="gradebook.html" class="block py-2 text-sm text-[#4318FF] font-bold transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 before:bg-[#4318FF]">Mark Report</a>'
            );
        }
        
        content = content.replace(gradebookRegex, replaceHTML);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}
console.log('Done!');
