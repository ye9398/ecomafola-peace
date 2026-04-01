import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  url: 'https://ecomafola-peace.myshopify.com/api/2026-01/graphql.json',
  storeDomain: 'ecomafola-peace.myshopify.com',
  apiVersion: '2026-01',
  publicAccessToken: '11c0b58bfdee65f96fbbd918d9aeeaa7',
});

async function test() {
  // 测试 1: 获取所有商品
  const allProducts = await client.request(`{
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }`);
  
  console.log('=== All Products ===');
  console.log(JSON.stringify(allProducts.data?.products?.edges, null, 2));
  
  // 测试 2: 获取 coconutbowl
  const coconutbowl = await client.request(`query {
    product(handle: "coconutbowl") {
      id
      title
      handle
    }
  }`);
  
  console.log('\n=== Coconut Bowl ===');
  console.log(JSON.stringify(coconutbowl.data?.product, null, 2));
}

test().catch(console.error);
