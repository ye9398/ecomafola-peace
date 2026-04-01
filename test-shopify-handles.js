import { getProductByHandle, getAllProducts } from './src/lib/shopify.js';

async function test() {
  console.log('\n=== 测试 Shopify Handle ===\n');
  
  // 获取所有商品
  const products = await getAllProducts();
  
  if (!products || products.length === 0) {
    console.log('未获取到商品，尝试按已知 handle 查询...');
    
    const testHandles = [
      'samoan-handcrafted-coconut-bowl',
      'coconutbowl',
      'wovenbasket',
      'naturalsoap',
      'woven-tote',
      'shellnecklace',
      'tapacloth'
    ];
    
    for (const handle of testHandles) {
      console.log(`\n尝试查询：${handle}`);
      const product = await getProductByHandle(handle);
      if (product) {
        console.log(`✓ 找到商品：${product.title} (handle: ${product.handle})`);
      } else {
        console.log(`✗ 未找到`);
      }
    }
  } else {
    console.log(`找到 ${products.length} 个商品:\n`);
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   Handle: ${p.handle}`);
      console.log(`   Price: $${p.priceRange?.minVariantPrice?.amount}`);
      console.log('');
    });
  }
}

test().catch(console.error);
