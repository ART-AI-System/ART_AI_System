const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'mockups', 'lecturer');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const userProfileRegex = /\s*<!-- User Profile -->\s*<div class="p-6 border-t border-white\/10">[\s\S]*?<\/div>\s*(?=<\/aside>)/i;

const headerProfileHTML = `
                <button class="relative p-2.5 text-gray-400 hover:text-[#F26F21] hover:bg-orange-50 rounded-xl transition-all">
                    <i data-lucide="bell" class="w-6 h-6"></i>
                    <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div class="flex items-center pl-6 border-l border-gray-200 gap-3">
                    <div class="text-right">
                        <p class="text-sm font-bold text-[#1B2559]">Dr. Nguyen Van A</p>
                        <p class="text-xs font-medium text-gray-500">Lecturer</p>
                    </div>
                    <img src="https://i.pravatar.cc/150?u=lecturer" class="w-10 h-10 rounded-full shadow-md cursor-pointer border-2 border-white">
                </div>
            </div>`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let changed = false;

    // 1. Remove User Profile from Sidebar
    if (userProfileRegex.test(content)) {
        content = content.replace(userProfileRegex, '\n    ');
        changed = true;
    }

    // 2. Add User Profile to Top Header (if not already there)
    if (!content.includes('pl-6 border-l border-gray-200 gap-3') && content.includes('<button class="relative p-2.5 text-gray-400')) {
        // Find the bell icon block and replace it with the new block including the profile
        const bellRegex = /<button class="relative p-2\.5 text-gray-400[^>]*>[\s\S]*?<\/button>\s*<\/div>/;
        if (bellRegex.test(content)) {
            content = content.replace(bellRegex, headerProfileHTML);
            changed = true;
        }
    }

    // 3. Fix href links in sidebar
    const reportsLinkRegex = /href="[^"]*"([^>]*>)\s*<i data-lucide="bar-chart-2"/g;
    content = content.replace(reportsLinkRegex, 'href="lecturer_reports.html"$1\n                <i data-lucide="bar-chart-2"');

    const messagesLinkRegex = /href="[^"]*"([^>]*>)\s*<i data-lucide="message-circle"/g;
    content = content.replace(messagesLinkRegex, 'href="lecturer_messages.html"$1\n                <i data-lucide="message-circle"');

    const settingsLinkRegex = /href="[^"]*"([^>]*>)\s*<i data-lucide="settings"/g;
    content = content.replace(settingsLinkRegex, 'href="lecturer_settings.html"$1\n                <i data-lucide="settings"');

    if (content !== fs.readFileSync(filePath, 'utf8')) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}
console.log('Done!');
