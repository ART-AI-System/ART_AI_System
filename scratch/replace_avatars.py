import os
import re

def replace_avatars():
    dirs = ['mockups/student', 'mockups/lecturer', 'mockups/admin', 'mockups/system']
    
    avatar_pattern = re.compile(r'<img[^>]+src="([^"]+)"[^>]*>')
    
    for d in dirs:
        if not os.path.exists(d):
            continue
        for root, _, files in os.walk(d):
            for f in files:
                if f.endswith('.html'):
                    filepath = os.path.join(root, f)
                    with open(filepath, 'r', encoding='utf-8') as file:
                        content = file.read()
                    
                    # We only want to replace profile pictures, not logos or other generic images.
                    # Usually, profile pictures have classes like rounded-full.
                    # Let's search for <img src="..." class="...rounded-full...">
                    
                    def replacer(match):
                        img_tag = match.group(0)
                        src = match.group(1)
                        if 'rounded-full' in img_tag and 'ui-avatars.com' not in src:
                            # It's a profile picture not using ui-avatars
                            # We can replace it with a random ui-avatar based on the file type (lecturer vs student)
                            if 'lecturer' in filepath:
                                new_src = "https://ui-avatars.com/api/?name=Lecturer&background=f97316&color=fff"
                            elif 'student' in filepath:
                                new_src = "https://ui-avatars.com/api/?name=Viet+Khoa&background=F26F21&color=fff"
                            else:
                                new_src = "https://ui-avatars.com/api/?name=User&background=4318FF&color=fff"
                            
                            new_img_tag = img_tag.replace(src, new_src)
                            return new_img_tag
                        return img_tag

                    new_content = avatar_pattern.sub(replacer, content)
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as file:
                            file.write(new_content)
                        print(f"Updated avatars in {filepath}")

if __name__ == '__main__':
    replace_avatars()
