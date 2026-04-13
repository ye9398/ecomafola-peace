import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'public', 'images');

// 需要压缩的图片
const images = [
  { input: 'banner-main.jpg', output: 'banner-main.jpg', maxWidth: 1920, quality: 80 },
  { input: 'feature-artisan.jpg', output: 'feature-artisan.jpg', maxWidth: 1200, quality: 80 },
  { input: 'feature-eco-friendly.jpg', output: 'feature-eco-friendly.jpg', maxWidth: 1200, quality: 80 },
  { input: 'feature-ocean.jpg', output: 'feature-ocean.jpg', maxWidth: 1200, quality: 80 },
  { input: 'impact/artisan-partners.jpg', output: 'impact/artisan-partners.jpg', maxWidth: 1200, quality: 80 },
  { input: 'impact/back-to-community.jpg', output: 'impact/back-to-community.jpg', maxWidth: 1200, quality: 80 },
  { input: 'impact/countries-served.jpg', output: 'impact/countries-served.jpg', maxWidth: 1200, quality: 80 },
  { input: 'impact/village-cooperatives.jpg', output: 'impact/village-cooperatives.jpg', maxWidth: 1200, quality: 80 },
];

let totalOriginal = 0;
let totalCompressed = 0;
let successCount = 0;

console.log('🚀 Compressing images...\n');

for (const img of images) {
  const inputPath = path.join(imagesDir, img.input);
  const outputPath = path.join(imagesDir, img.output);

  try {
    const originalStats = fs.statSync(inputPath);
    totalOriginal += originalStats.size;
    const metadata = await sharp(inputPath).metadata();

    await sharp(inputPath)
      .resize(img.maxWidth, null, { withoutEnlarging: true, kernel: 'lanczos3' })
      .jpeg({ quality: img.quality, progressive: true, mozjpeg: true })
      .toFile(outputPath + '.tmp');

    fs.renameSync(outputPath + '.tmp', outputPath);
    const compressedStats = fs.statSync(outputPath);
    totalCompressed += compressedStats.size;

    console.log(`${img.input}: ${(compressedStats.size / 1024).toFixed(0)} KB (${(1 - compressedStats.size / originalStats.size) * 100 < 0 ? 'skipped' : ((1 - compressedStats.size / originalStats.size) * 100).toFixed(0) + '% saved')}`);
    successCount++;
  } catch (error) {
    console.error(`${img.input}: ${error.message}`);
  }
}

// Convert large PNGs to WebP
const pngFiles = ['shell-pattern.png', 'tapa-pattern.png'];
for (const name of pngFiles) {
  const inputPath = path.join(imagesDir, name);
  try {
    const originalStats = fs.statSync(inputPath);
    totalOriginal += originalStats.size;
    const base = name.replace('.png', '');
    const webpPath = path.join(imagesDir, base + '.webp');

    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(webpPath + '.tmp');

    fs.renameSync(webpPath + '.tmp', webpPath);
    const compressedStats = fs.statSync(webpPath);
    totalCompressed += compressedStats.size;

    console.log(`${name} → ${base}.webp: ${(compressedStats.size / 1024).toFixed(0)} KB (${((1 - compressedStats.size / originalStats.size) * 100).toFixed(0)}% saved)`);
    successCount++;
  } catch (error) {
    console.error(`${name}: ${error.message}`);
  }
}

console.log(`\n✅ Done! ${successCount} images processed`);
console.log(`📊 Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
console.log(`📊 Compressed: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
console.log(`💾 Saved: ${((1 - totalCompressed / totalOriginal) * 100).toFixed(0)}%`);
