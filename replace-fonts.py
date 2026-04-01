#!/usr/bin/env python3
"""批量将 ProductDetailPage.tsx 中的 font-sans 替换为 font-serif"""

file_path = "/Users/bowfan/.real/users/user-b8e1054842397a96334f63a90388dc8a/workspace/ecomafola-peace/src/pages/ProductDetailPage.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 统计替换次数
count = content.count('font-sans')
print(f"找到 {count} 处 font-sans")

# 全部替换
new_content = content.replace('font-sans', 'font-serif')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"已将所有 font-sans 替换为 font-serif")
