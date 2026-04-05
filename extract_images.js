import fs from 'fs';
import path from 'path';

const productHandle = "samoan-handcrafted-coconut-bowl";
const inputPath = "F:/xwechat_files/a504060516_65ac/msg/file/2026-04/product-content-config (2)(1).json";
const outputDir = `public/images/products/${productHandle}`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const sections = ["story", "environmental", "partnership", "specifications", "guarantee"];

for (const section of sections) {
  const sectionData = data.products[productHandle][section];
  if (sectionData && sectionData.image && sectionData.image.startsWith("data:image")) {
    const header = sectionData.image.split(',')[0];
    const encoded = sectionData.image.split(',')[1];
    const ext = header.split('/')[1].split(';')[0];
    const filename = `${section}.${ext}`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, Buffer.from(encoded, 'base64'));
    sectionData.image = `/images/products/${productHandle}/${filename}`;
    console.log(`Saved ${filename}`);
  }
}

const contentPath = 'public/admin-content/ecomafola-content.json';
const mainDataRaw = fs.readFileSync(contentPath, 'utf8');
const mainData = JSON.parse(mainDataRaw.replace(/^\uFEFF/, ''));

if (!mainData.products) mainData.products = {};
mainData.products[productHandle] = data.products[productHandle];

fs.writeFileSync(contentPath, JSON.stringify(mainData, null, 2));
console.log("Updated ecomafola-content.json");
