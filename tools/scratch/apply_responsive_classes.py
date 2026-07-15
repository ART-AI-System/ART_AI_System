import glob
import re

def fix_header_responsiveness(html):
    # Hide search on mobile
    search_pattern = re.compile(r'<div class="flex items-center flex-1 bg-white rounded-full px-5 py-3 shadow-\[0_2px_12px_rgba\(0,0,0,0\.04\)\]">')
    html = search_pattern.sub('<div class="hidden md:flex items-center flex-1 bg-white rounded-full px-5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">', html)
    
    # Right actions: space-x-6 -> space-x-2 md:space-x-6
    actions_pattern = re.compile(r'<div class="flex items-center space-x-6">')
    html = actions_pattern.sub('<div class="flex items-center space-x-2 md:space-x-6">', html)

    # User profile name hidden on mobile
    user_name_pattern = re.compile(r'<div class="text-right">')
    html = user_name_pattern.sub('<div class="text-right hidden sm:block">', html)
    return html

def fix_tables(html):
    # Ensure tables are wrapped in overflow-x-auto
    # We find <table and check if parent is overflow-x-auto. Simplest is to just replace <table with <div class="overflow-x-auto w-full"><table and </table> with </table></div>
    # But only if not already wrapped. Since this is a simple script, we can just replace all <table class="..." with a wrapper, 
    # but let's be careful. Let's do it manually for files that have tables.
    return html

def fix_submission(html):
    # <div class="flex h-[calc(100vh-6rem)] overflow-hidden">
    # -> <div class="flex flex-col lg:flex-row h-[calc(100vh-6rem)] overflow-y-auto lg:overflow-hidden">
    pattern = re.compile(r'<div class="flex h-\[calc\(100vh-6rem\)\] overflow-hidden">')
    html = pattern.sub('<div class="flex flex-col lg:flex-row h-[calc(100vh-6rem)] overflow-y-auto lg:overflow-hidden">', html)
    
    # <div class="w-1/3 min-w-\[350px\] max-w-\[450px\] bg-white border-r border-gray-100 flex flex-col h-full z-10 shadow-\[4px_0_24px_rgba\(0,0,0,0\.02\)\]">
    col1 = re.compile(r'<div class="w-1/3 min-w-\[350px\] max-w-\[450px\] bg-white border-r border-gray-100 flex flex-col h-full z-10 shadow-\[4px_0_24px_rgba\(0,0,0,0\.02\)\]">')
    html = col1.sub('<div class="w-full lg:w-1/3 lg:min-w-[350px] lg:max-w-[450px] bg-white border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col lg:h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 h-auto">', html)

    # <div class="flex-1 bg-[#F4F7FE] flex flex-col h-full relative overflow-hidden">
    col2 = re.compile(r'<div class="flex-1 bg-\[#F4F7FE\] flex flex-col h-full relative overflow-hidden">')
    html = col2.sub('<div class="flex-1 bg-[#F4F7FE] flex flex-col h-auto lg:h-full relative overflow-hidden">', html)

    return html

def fix_chat(html):
    # In chat, mobile should only show list or room
    # List: <div class="w-[320px] bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
    # Room: <div class="flex-1 bg-[#F4F7FE] flex flex-col h-full">
    list_p = re.compile(r'<div class="w-\[320px\] bg-white border-r border-gray-100 flex flex-col h-full shrink-0">')
    html = list_p.sub('<div class="w-full md:w-[320px] bg-white border-r border-gray-100 flex flex-col h-full shrink-0">', html)

    room_p = re.compile(r'<div class="flex-1 bg-\[#F4F7FE\] flex flex-col h-full">')
    html = room_p.sub('<div class="hidden md:flex flex-1 bg-[#F4F7FE] flex-col h-full">', html)
    return html

def fix_settings(html):
    # Settings main area has flex -> flex-col lg:flex-row
    p = re.compile(r'<div class="flex items-start">')
    html = p.sub('<div class="flex flex-col lg:flex-row items-start gap-8 lg:gap-0">', html)
    
    # Left nav: w-64 -> w-full lg:w-64
    p2 = re.compile(r'<div class="w-64 shrink-0 bg-white rounded-\[24px\] p-4 shadow-sm border border-gray-100 mr-8 sticky top-8">')
    html = p2.sub('<div class="w-full lg:w-64 shrink-0 bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 lg:mr-8 sticky top-8 z-10">', html)

    # Right content: flex-1
    return html

for filepath in glob.glob('mockups/student/*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    html = fix_header_responsiveness(html)
    
    if 'submission.html' in filepath:
        html = fix_submission(html)
    elif 'chat.html' in filepath:
        html = fix_chat(html)
    elif 'settings.html' in filepath:
        html = fix_settings(html)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
