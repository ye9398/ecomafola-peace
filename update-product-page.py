import re

file_path = 'src/pages/ProductDetailPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 移除所有带 emoji 图标的圆形背景 div，只保留标题文字
# 替换模式：移除包含 icon 的圆形背景 div，只保留 h2 标题
patterns_to_remove = [
    # Environmental Impact section icon
    (r'<div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">\s*<Leaf size={24} className="text-white" />\s*</div>', ''),
    # Partnership Model section icon
    (r'<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">\s*<Users size={24} className="text-white" />\s*</div>', ''),
    # Specifications section icon
    (r'<div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">\s*<Ruler size={24} className="text-white" />\s*</div>', ''),
    # Quality Guarantee section icon
    (r'<div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">\s*<ShieldCheck size={24} className="text-white" />\s*</div>', ''),
    # FAQs section icon - keep the outer container but remove icon
    (r'<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-gray-600 mb-4">\s*<HelpCircle size={32} className="text-white" />\s*</div>', ''),
]

for pattern, replacement in patterns_to_remove:
    content = re.sub(pattern, replacement, content)

# 2. 调整标题和描述的间距和层级
# 修改副标题的字体和间距
content = re.sub(
    r'<p className="text-sm font-serif text-emerald-600 mt-1">How our products benefit the planet</p>',
    '<p className="text-base font-serif text-gray-600 mt-2 leading-relaxed">How our products benefit the planet</p>',
    content
)

content = re.sub(
    r'<p className="text-sm font-serif text-blue-600 mt-1">Fair trade that empowers communities</p>',
    '<p className="text-base font-serif text-gray-600 mt-2 leading-relaxed">Fair trade that empowers communities</p>',
    content
)

content = re.sub(
    r'<p className="text-sm font-serif text-gray-500 mt-1">What our customers say about our products</p>',
    '<p className="text-base font-serif text-gray-600 mt-2 leading-relaxed">What our customers say about our products</p>',
    content
)

content = re.sub(
    r'<p className="text-sm font-serif text-gray-500">Everything you need to know about our products</p>',
    '<p className="text-base font-serif text-gray-600 mt-2 leading-relaxed">Everything you need to know about our products</p>',
    content
)

# 3. 优化列表项的排版 - 增加间距
content = re.sub(
    r'className="text-gray-700 leading-loose mb-5"',
    'className="text-gray-700 leading-loose mb-6"',
    content
)

content = re.sub(
    r'className="text-gray-700 leading-loose mb-4"',
    'className="text-gray-700 leading-loose mb-6"',
    content
)

# 4. 优化规格说明的排版
content = re.sub(
    r'className="border-l-4 border-purple-500 pl-5 py-4"',
    'className="border-l-4 border-purple-500 pl-6 py-5"',
    content
)

# 5. 优化问答区块的间距
content = re.sub(
    r'className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"',
    'className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0"',
    content
)

content = re.sub(
    r'className="ml-11 text-gray-600 font-serif leading-relaxed"',
    'className="ml-11 text-gray-600 font-serif leading-relaxed text-base"',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ 已移除 emoji 图标并优化排版层级')
