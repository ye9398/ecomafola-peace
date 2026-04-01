import fetch from 'node-fetch';

const STORE_DOMAIN = 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = '11c0b58bfdee65f96fbbd918d9aeeaa7';
const API_URL = `https://${STORE_DOMAIN}/api/2026-01/graphql.json`;

const query = `
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          productType
        }
      }
    }
  }
`;

async function checkHandles() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('API Error:', result.errors);
      return;
    }

    console.log('\n=== Shopify 后台商品 Handle 列表 ===\n');
    result.data?.products?.edges?.forEach((edge, index) => {
      const product = edge.node;
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Handle: ${product.handle}`);
      console.log(`   Type: ${product.productType || 'N/A'}`);
      console.log('');
    });
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

checkHandles();
