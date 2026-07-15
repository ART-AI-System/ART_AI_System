import shutil

def generate_submission_feedback():
    with open('mockups/student/submission.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # We want to change the "Step 2" content to show the "Feedback" block instead, and change the Header
    import re
    
    # Change title and header
    html = html.replace('Submit Assignment', 'Assignment Feedback')
    html = html.replace('Provide your work and AI declaration', 'View lecturer feedback and your submission')
    
    # Remove the "Submit Final Work" and "Save as Draft" buttons
    html = re.sub(r'<div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">.*?</div>', '', html, flags=re.DOTALL)
    
    feedback_content = '''
                        <!-- Lecturer Feedback Block -->
                        <div class="mt-8">
                            <div class="flex justify-between items-end mb-4">
                                <h4 class="text-sm font-bold text-orange-500 uppercase tracking-wider flex items-center">
                                    <i data-lucide="message-square-warning" class="w-4 h-4 mr-2"></i> Lecturer Feedback
                                </h4>
                                <span class="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 animate-pulse">
                                    Status: Resubmission Required
                                </span>
                            </div>
                            
                            <div class="bg-orange-50 border border-orange-200 rounded-[24px] p-6 shadow-sm relative overflow-hidden">
                                <div class="absolute -right-10 -top-10 text-orange-200 opacity-20">
                                    <i data-lucide="quote" class="w-40 h-40"></i>
                                </div>
                                <div class="relative z-10">
                                    <div class="flex items-center mb-4">
                                        <img src="https://ui-avatars.com/api/?name=Nguyen+Van+A&background=f97316&color=fff" class="w-10 h-10 rounded-full mr-3 shadow-sm border-2 border-white">
                                        <div>
                                            <h5 class="text-sm font-bold text-[#1B2559]">Dr. Nguyen Van A</h5>
                                            <p class="text-xs text-gray-500 font-medium">Lecturer - 2 hours ago</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-800 leading-relaxed mb-4">
                                        Your architectural diagram looks good, but the AI declaration is incomplete. 
                                        In the <strong>Pattern Recognition</strong> step, you must provide the exact prompt you used to generate the similarities between the MVC and MVVM patterns. 
                                        Also, your self-reflection needs to explain *why* you chose MVC over MVVM based on the AI's suggestion, not just copy-paste the AI output.
                                        <br><br>
                                        Please update your AI Declaration and resubmit before <strong>June 18, 11:59 PM</strong>.
                                    </p>
                                    
                                    <div class="flex items-center gap-3">
                                        <button class="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-200 hover:bg-orange-600 flex items-center transition-colors">
                                            <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i> Start Resubmission
                                        </button>
                                        <button class="bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center transition-colors">
                                            <i data-lucide="message-circle" class="w-4 h-4 mr-2"></i> Reply to Lecturer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-8 border-t border-gray-100 pt-8">
                            <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Your Previous Submission (Read-only)</h4>
    '''
    
    html = re.sub(r'<!-- Step 1: Assignment Details -->', feedback_content + '\n                        <!-- Step 1: Assignment Details -->', html)
    
    # Disable inputs to make it read-only
    html = html.replace('<input type="file"', '<input type="file" disabled')
    html = html.replace('<textarea ', '<textarea disabled ')
    html = html.replace('Click to upload or drag and drop', 'Attachment.pdf (Uploaded)')
    html = html.replace('SVG, PNG, JPG or GIF (max. 5MB)', '2.4 MB')
    
    with open('mockups/student/submission_feedback.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    generate_submission_feedback()
