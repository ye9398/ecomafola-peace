const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'public', 'images', 'banner-main.jpg');
const output = path.join(__dirname, '..', 'banner-main-compressed.jpg');

async function compress() {
  try {
    const originalStats = fs.statSync(source);
    console.log(`📊 原始大小：${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);
    
    const metadata = await sharp(source).metadata();
    console.log(`📐 原始尺寸：${metadata.width} x ${metadata.height}`);
    
    // 压缩并调整尺寸
    await sharp(source)
      .resize(1920, null, { 
        withoutEnlarging: true,
        kernel: 'lanczos3' 
      })
      .jpeg({ 
        quality: 85, 
        progressive: true,
        mozjpeg: true 
      })
      .toFile(output);
    
    const compressedStats = fs.statSync(output);
    const originalSize = originalStats.size / 1024 / 1024;
    const compressedSize = compressedStats.size / 1024 / 1024;
    const ratio = (1 - compressedSize / originalSize) * 100;
    
    console.log(`📊 压缩后大小：${compressedSize.toFixed(2)} MB (${(compressedStats.size / 1024).toFixed(0)} KB)`);
    console.log(`💾 压缩率：${ratio.toFixed(1)}%`);
    console.log(`\n✅ 压缩完成：${output}`);
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

compress();
