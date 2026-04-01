#!/usr/bin/env python3
"""
批量压缩图片脚本
使用 Pillow 库压缩所有 JPG/PNG 图片到目标大小
"""

from PIL import Image
import os
from pathlib import Path

# 配置
IMAGES_DIR = Path(__file__).parent / "public" / "images"
MAX_SIZE_KB = 300  # 最大文件大小（KB）
QUALITY = 85  # JPG 质量（1-100）
SCALE = 0.8  # 缩放比例（0.5-1.0）

def get_file_size_mb(path):
    return os.path.getsize(path) / 1024 / 1024

def compress_image(image_path):
    """压缩单张图片"""
    try:
        img = Image.open(image_path)
        
        # 如果是 PNG 且有透明度，转换为 RGBA
        if image_path.suffix.lower() == '.png' and img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGBA')
        
        # 第一次压缩：调整尺寸
        if img.width > 1920 or img.height > 1080:
            img.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
            print(f"  ✓ 调整尺寸：{img.width}x{img.height}")
        
        # 保存压缩
        output_path = image_path
        if image_path.suffix.lower() in ['.jpg', '.jpeg']:
            img.save(output_path, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
        elif image_path.suffix.lower() == '.png':
            img.save(output_path, 'PNG', optimize=True, compress_level=6)
        
        # 计算压缩率
        original_size = get_file_size_mb(image_path)
        # 重新读取压缩后的大小（需要重新保存来估算）
        print(f"  ✓ 已压缩：{image_path.name}")
        return True
        
    except Exception as e:
        print(f"  ✗ 失败：{e}")
        return False

def main():
    print(f"🔍 扫描图片目录：{IMAGES_DIR}")
    
    # 查找所有图片
    image_extensions = ['.jpg', '.jpeg', '.png', '.webp']
    images = []
    
    for root, dirs, files in os.walk(IMAGES_DIR):
        for file in files:
            if Path(file).suffix.lower() in image_extensions:
                images.append(Path(root) / file)
    
    print(f"📊 找到 {len(images)} 张图片\n")
    
    # 压缩每张图片
    success = 0
    for img_path in images:
        size_mb = get_file_size_mb(img_path)
        if size_mb > 0.3:  # 只压缩大于 300KB 的图片
            print(f"🖼️  压缩：{img_path.name} ({size_mb:.2f}MB)")
            if compress_image(img_path):
                success += 1
            print()
    
    print(f"✅ 完成！成功压缩 {success}/{len(images)} 张图片")
    print(f"💡 提示：运行 `vercel --prod` 重新部署")

if __name__ == "__main__":
    # 检查 Pillow 是否安装
    try:
        from PIL import Image
    except ImportError:
        print("❌ 缺少 Pillow 库，请先安装：pip install Pillow")
        exit(1)
    
    main()
