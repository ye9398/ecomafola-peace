// Shopify Storefront API 测试脚本
const STORE_DOMAIN = 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = '11c0b58bfdee65f96fbbd918d9aeeaa7';

const query = `query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        productType
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  }
}`;

async function testShopifyConnection() {
  try {
    console.log('正在测试 Shopify Storefront API 连接...\n');
    console.log('Store Domain:', STORE_DOMAIN);
    console.log('Storefront Token:', STOREFRONT_TOKEN.substring(0, 8) + '...\n');
    
    const response = await fetch(`https://${STORE_DOMAIN}/api/2025-01/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: query,
        variables: { first: 5 }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('\n✅ API 响应成功！\n');
    console.log('完整响应:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.errors) {
      console.log('\n❌ GraphQL 错误:');
      console.log(JSON.stringify(result.errors, null, 2));
    } else if (result.data?.products?.edges?.length > 0) {
      console.log(`\n✅ 成功获取 ${result.data.products.edges.length} 个商品！\n`);
      result.data.products.edges.forEach((edge, index) => {
        const product = edge.node;
        console.log(`${index + 1}. ${product.title}`);
        console.log(`   Handle: ${product.handle}`);
        console.log(`   Type: ${product.productType || 'N/A'}`);
        console.log(`   Price: $${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`);
        console.log(`   Image: ${product.images.edges[0]?.node.url || 'N/A'}\n`);
      });
    } else {
      console.log('\n⚠️ 警告：API 返回成功但没有商品数据');
      console.log('可能原因:');
      console.log('1. Shopify 店铺中没有已发布的商品');
      console.log('2. 商品未设置为 "Available for sale"');
      console.log('3. Storefront Access Token 权限不足');
    }
    
  } catch (error) {
    console.error('\n❌ 测试失败:');
    console.error(error.message);
    console.error('\n请检查:');
    console.error('1. 网络连接是否正常');
    console.error('2. Store Domain 是否正确');
    console.error('3. Storefront Access Token 是否有效');
  }
}

testShopifyConnection();
