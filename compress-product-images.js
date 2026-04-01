import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, 'public', 'product-images');

let totalOriginal = 0;
let totalCompressed = 0;
let successCount = 0;
let errorCount = 0;

console.log('🚀 开始压缩产品详情页图片...\n');

// 递归查找所有图片
function findImages(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(findImages(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
      results.push(fullPath);
    }
  }
  
  return results;
}

const images = findImages(imagesDir);
console.log(`📊 找到 ${images.length} 张图片\n`);

for (const imgPath of images) {
  try {
    const originalStats = fs.statSync(imgPath);
    const originalSize = originalStats.size;
    totalOriginal += originalSize;
    
    const relPath = imgPath.replace(__dirname + '\\public\\', '');
    console.log(`🖼️  ${relPath}`);
    console.log(`   原始：${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // 压缩图片
    await sharp(imgPath)
      .resize(1200, null, { withoutEnlarging: true, kernel: 'lanczos3' })
      .jpeg({ quality: 85, progressive: true, mozjpeg: true })
      .toFile(imgPath + '.tmp');
    
    // 替换原文件
    fs.renameSync(imgPath + '.tmp', imgPath);
    
    const compressedStats = fs.statSync(imgPath);
    const compressedSize = compressedStats.size;
    totalCompressed += compressedSize;
    const ratio = (1 - compressedSize / originalSize) * 100;
    
    console.log(`   压缩：${(compressedSize / 1024).toFixed(0)} KB`);
    console.log(`   压缩率：${ratio.toFixed(1)}% ✅\n`);
    successCount++;
    
  } catch (error) {
    console.error(`   ❌ 失败：${error.message}\n`);
    errorCount++;
  }
}

console.log('═══════════════════════════════════════════');
console.log(`✅ 完成！成功压缩 ${successCount}/${images.length} 张图片`);
console.log(`📊 原始总大小：${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
console.log(`📊 压缩后总大小：${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
console.log(`💾 总压缩率：${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%`);
if (errorCount > 0) {
  console.log(`⚠️ 失败：${errorCount} 张`);
}
console.log(`\n💡 下一步：运行 vercel --prod 重新部署`);
