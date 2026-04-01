import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'public', 'images');

// 需要压缩的图片列表
const images = [
  { input: 'banner-main.jpg', output: 'banner-main.jpg', maxWidth: 1920 },
  { input: 'feature-artisan.jpg', output: 'feature-artisan.jpg', maxWidth: 1200 },
  { input: 'feature-eco-friendly.jpg', output: 'feature-eco-friendly.jpg', maxWidth: 1200 },
  { input: 'feature-ocean.jpg', output: 'feature-ocean.jpg', maxWidth: 1200 },
  { input: 'impact/artisan-partners.jpg', output: 'impact/artisan-partners.jpg', maxWidth: 1200 },
  { input: 'impact/back-to-community.jpg', output: 'impact/back-to-community.jpg', maxWidth: 1200 },
  { input: 'impact/countries-served.jpg', output: 'impact/countries-served.jpg', maxWidth: 1200 },
  { input: 'impact/village-cooperatives.jpg', output: 'impact/village-cooperatives.jpg', maxWidth: 1200 },
  { input: 'shell-pattern.png', output: 'shell-pattern.png', maxWidth: 1920 },
  { input: 'tapa-pattern.png', output: 'tapa-pattern.png', maxWidth: 1920 },
];

let totalOriginal = 0;
let totalCompressed = 0;
let successCount = 0;

console.log('🚀 开始批量压缩图片...\n');

for (const img of images) {
  const inputPath = path.join(imagesDir, img.input);
  const outputPath = path.join(imagesDir, img.output);
  
  try {
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;
    totalOriginal += originalSize;
    
    const metadata = await sharp(inputPath).metadata();
    console.log(`🖼️  ${img.input}`);
    console.log(`   原始：${(originalSize / 1024 / 1024).toFixed(2)} MB (${metadata.width}x${metadata.height})`);
    
    // 压缩图片
    if (img.input.endsWith('.png')) {
      // PNG 压缩
      await sharp(inputPath)
        .resize(img.maxWidth, null, { withoutEnlarging: true, kernel: 'lanczos3' })
        .png({ compressionLevel: 6, adaptiveFiltering: true })
        .toFile(outputPath + '.tmp');
    } else {
      // JPG 压缩
      await sharp(inputPath)
        .resize(img.maxWidth, null, { withoutEnlarging: true, kernel: 'lanczos3' })
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toFile(outputPath + '.tmp');
    }
    
    // 替换原文件
    fs.renameSync(outputPath + '.tmp', outputPath);
    
    const compressedStats = fs.statSync(outputPath);
    const compressedSize = compressedStats.size;
    totalCompressed += compressedSize;
    const ratio = (1 - compressedSize / originalSize) * 100;
    
    console.log(`   压缩：${(compressedSize / 1024).toFixed(0)} KB`);
    console.log(`   压缩率：${ratio.toFixed(1)}% ✅\n`);
    successCount++;
    
  } catch (error) {
    console.error(`   ❌ 失败：${error.message}\n`);
  }
}

console.log('═══════════════════════════════════════════');
console.log(`✅ 完成！成功压缩 ${successCount}/${images.length} 张图片`);
console.log(`📊 原始总大小：${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
console.log(`📊 压缩后总大小：${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
console.log(`💾 总压缩率：${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%`);
console.log(`\n💡 下一步：运行 vercel --prod 重新部署`);
