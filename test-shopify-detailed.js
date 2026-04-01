// Shopify Storefront API 详细测试脚本
const STORE_DOMAIN = 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = '11c0b58bfdee65f96fbbd918d9aeeaa7';

// 测试 1: 获取所有商品（包括隐藏的）
const queryAllProducts = `query {
  products(first: 50) {
    edges {
      node {
        id
        title
        handle
        status
        productType
        vendor
        tags
        createdAt
        updatedAt
      }
    }
  }
}`;

// 测试 2: 检查店铺信息
const queryShopInfo = `query {
  shop {
    name
    description
    url
  }
}`;

async function runTests() {
  console.log('='.repeat(60));
  console.log('Shopify Storefront API 详细诊断');
  console.log('='.repeat(60));
  console.log(`\nStore: ${STORE_DOMAIN}\n`);
  
  // 测试店铺信息
  console.log('\n【测试 1】检查店铺信息...\n');
  try {
    const shopResponse = await fetch(`https://${STORE_DOMAIN}/api/2025-01/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: queryShopInfo })
    });
    
    const shopResult = await shopResponse.json();
    console.log('店铺信息:', JSON.stringify(shopResult, null, 2));
    
    if (shopResult.data?.shop) {
      console.log(`✅ 店铺名称：${shopResult.data.shop.name}`);
      console.log(`✅ 店铺 URL: ${shopResult.data.shop.url}`);
    } else if (shopResult.errors) {
      console.log('❌ 店铺信息查询失败:', shopResult.errors[0].message);
    }
  } catch (error) {
    console.error('❌店铺信息测试失败:', error.message);
  }
  
  // 测试商品列表
  console.log('\n\n【测试 2】获取所有商品...\n');
  try {
    const productResponse = await fetch(`https://${STORE_DOMAIN}/api/2025-01/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: queryAllProducts })
    });
    
    const productResult = await productResponse.json();
    
    if (productResult.errors) {
      console.log('❌ GraphQL 错误:');
      console.log(JSON.stringify(productResult.errors, null, 2));
    } else {
      const products = productResult.data?.products?.edges || [];
      console.log(`📦 查询到 ${products.length} 个商品\n`);
      
      if (products.length === 0) {
        console.log('⚠️  店铺中没有任何商品！\n');
        console.log('请在 Shopify 后台添加商品，并确保:');
        console.log('  1. 商品状态为 "Active"（已激活）');
        console.log('  2. 至少有一个 Variant（变体）');
        console.log('  3. Variant 设置了价格');
        console.log('  4. 商品在 Online Store 销售渠道可见\n');
      } else {
        products.forEach((edge, index) => {
          const product = edge.node;
          console.log(`${index + 1}. ${product.title}`);
          console.log(`   ID: ${product.id}`);
          console.log(`   Handle: ${product.handle}`);
          console.log(`   Status: ${product.status}`);
          console.log(`   Type: ${product.productType || 'N/A'}`);
          console.log(`   Vendor: ${product.vendor || 'N/A'}`);
          console.log(`   Tags: ${product.tags || 'N/A'}`);
          console.log(`   Created: ${product.createdAt}`);
          console.log(`   Updated: ${product.updatedAt}\n`);
        });
      }
    }
  } catch (error) {
    console.error('❌ 商品查询失败:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('诊断完成');
  console.log('='.repeat(60));
}

runTests();
