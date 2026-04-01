// Shopify Storefront API 简单测试
const STORE_DOMAIN = 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = '11c0b58bfdee65f96fbbd918d9aeeaa7';

const query = `query {
  products(first: 50) {
    edges {
      node {
        id
        title
        handle
      }
    }
  }
}`;

async function test() {
  console.log('测试 Shopify Storefront API...\n');
  
  const response = await fetch(`https://${STORE_DOMAIN}/api/2025-01/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query })
  });
  
  const result = await response.json();
  
  console.log('完整响应:', JSON.stringify(result, null, 2));
  
  if (result.data?.products?.edges?.length > 0) {
    console.log(`\n✅ 成功！找到 ${result.data.products.edges.length} 个商品`);
  } else {
    console.log('\n⚠️  Shopify 店铺中没有商品数据');
    console.log('\n请登录 Shopify 后台检查:');
    console.log('1. 是否已添加商品');
    console.log('2. 商品状态是否为 Active');
    console.log('3. 商品是否在 Online Store 渠道发布');
  }
}

test();
