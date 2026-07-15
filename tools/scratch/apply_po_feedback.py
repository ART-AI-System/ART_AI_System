import os
import re

def apply_po_feedback():
    # 1. Update UI_DESIGN_SPEC.md
    spec_path = r'C:\Users\OS\.gemini\antigravity-ide\brain\2bf25318-0de1-4657-a2e8-51318d41bc94\UI_DESIGN_SPEC.md'
    with open(spec_path, 'r', encoding='utf-8') as f:
        spec_html = f.read()
        
    new_rule = '''
- **Non-linear Forms**: Cho phép sinh viên điền biểu mẫu nhiều bước (như form khai báo AI) mà không cần tuân theo thứ tự tuần tự bắt buộc (Non-linear). Loại bỏ các biểu tượng mũi tên chỉ hướng để tránh cảm giác bị ép buộc tiến độ. Tuy nhiên, khi bấm nút Submit, hệ thống phải thực hiện validate toàn bộ các bước và hiển thị thông báo lỗi liệt kê chính xác các mục cụ thể đang bị bỏ trống (ví dụ: "Bạn chưa điền mục Pattern Recognition").'''

    if "- **Non-linear Forms**" not in spec_html:
        with open(spec_path, 'a', encoding='utf-8') as f:
            f.write(new_rule)
            
    # 2. Update submission.html
    html_path = 'mockups/student/submission.html'
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Remove the Handle arrow visibility logic
    arrow_logic_pattern = re.compile(r'// Handle arrow visibility\s+const separators = document\.querySelectorAll\(\'\.tab-separator\'\);\s+separators\.forEach\(\(sep, sepIndex\) => \{.*?\n                                            \}\);', re.DOTALL)
    html = arrow_logic_pattern.sub('', html)
    
    # Add ID to submit button
    btn_pattern = r'<button class="fpt-orange-gradient text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:opacity-90 flex items-center">'
    if 'id="submitBtn"' not in html:
        html = html.replace(
            btn_pattern,
            '<button id="submitBtn" class="fpt-orange-gradient text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:opacity-90 flex items-center">'
        )
        
    # Add JS for submit button validation
    js_to_add = '''
                                    // Submit validation logic
                                    const submitBtn = document.getElementById('submitBtn');
                                    if (submitBtn) {
                                        submitBtn.addEventListener('click', () => {
                                            alert("Vui lòng điền đầy đủ các mục sau trước khi nộp bài:\\n- Pattern Recognition\\n- Reflection");
                                        });
                                    }
                                });
                            </script>'''
                            
    if '// Submit validation logic' not in html:
        html = html.replace('});\n                            </script>', js_to_add)
        
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    apply_po_feedback()
