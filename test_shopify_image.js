import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  url: 'https://ecomafola-peace.myshopify.com/api/2026-01/graphql.json',
  storeDomain: 'ecomafola-peace.myshopify.com',
  apiVersion: '2026-01',
  publicAccessToken: '11c0b58bfdee65f96fbbd918d9aeeaa7',
});

async function test() {
  // 测试：获取手工椰子碗的完整信息
  const product = await client.request(`query {
    product(handle: "手工椰子碗") {
      id
      title
      handle
      descriptionHtml
      images(first: 5) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }`);
  
  console.log('=== Product Data ===');
  console.log(JSON.stringify(product.data?.product, null, 2));
}

test().catch(console.error);
