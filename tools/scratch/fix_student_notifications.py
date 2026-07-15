import os
import re

def fix_student_notifications():
    student_dir = 'mockups/student'
    
    # We want to replace the bell button with a link to notifications.html
    # Current button looks like:
    # <button class="relative p-2 text-gray-400 hover:text-orange-500 transition-colors">
    #     <i data-lucide="bell" class="w-6 h-6"></i>
    #     <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F4F7FE]"></span>
    # </button>
    
    button_pattern = re.compile(r'<button class="relative p-2 text-gray-400 hover:text-orange-500 transition-colors">\s*<i data-lucide="bell".*?</button>', re.DOTALL)
    
    link_replacement = '''<a href="notifications.html" class="relative p-2 text-gray-400 hover:text-orange-500 transition-colors block">
                        <i data-lucide="bell" class="w-6 h-6"></i>
                        <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F4F7FE]"></span>
                    </a>'''
                    
    for f in os.listdir(student_dir):
        if f.endswith('.html') and f != 'notifications.html':
            filepath = os.path.join(student_dir, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = button_pattern.sub(link_replacement, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Fixed bell icon in {f}")
                
    # Now fix the link in notifications.html to point to submission_feedback.html
    noti_file = os.path.join(student_dir, 'notifications.html')
    with open(noti_file, 'r', encoding='utf-8') as file:
        noti_content = file.read()
        
    # Find the feedback notification block and wrap it or change its button to a link
    # It has a button: <button class="mt-3 text-sm font-bold text-[#4318FF] hover:underline flex items-center">
    
    feedback_btn_pattern = re.compile(r'<button class="mt-3 text-sm font-bold text-\[#4318FF\] hover:underline flex items-center">\s*View Feedback Details <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>\s*</button>', re.DOTALL)
    feedback_link = '''<a href="submission_feedback.html" class="mt-3 text-sm font-bold text-[#4318FF] hover:underline flex items-center w-fit">
                            View Feedback Details <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
                        </a>'''
    
    noti_content = feedback_btn_pattern.sub(feedback_link, noti_content)
    
    # Also wrap the whole card in an <a> tag instead of a <div> if possible, but the card already has cursor-pointer. Let's just wrap it.
    # Actually, replacing the button is enough since the user can click "View Feedback Details".
    # Let's make the whole card clickable by changing <div class="bg-blue-50... cursor-pointer"> to <a href="submission_feedback.html" class="block bg-blue-50...">
    
    noti_content = re.sub(
        r'<div class="bg-blue-50 border border-blue-100 rounded-\[20px\] p-5 shadow-sm flex items-start relative cursor-pointer hover:bg-blue-100/50 transition-colors">',
        r'<a href="submission_feedback.html" class="bg-blue-50 border border-blue-100 rounded-[20px] p-5 shadow-sm flex items-start relative cursor-pointer hover:bg-blue-100/50 transition-colors block">',
        noti_content
    )
    # We must also replace the closing </div> of this card with </a>.
    # It's safer to just rely on the "View Feedback Details" link inside for now, to avoid regex malformation on nested divs.
    
    with open(noti_file, 'w', encoding='utf-8') as file:
        file.write(noti_content)

if __name__ == '__main__':
    fix_student_notifications()
