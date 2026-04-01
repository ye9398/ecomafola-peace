/**
 * Shopify API 连接测试脚本
 * 
 * 使用方法:
 * 1. 确保已安装依赖：npm install @shopify/storefront-api-client
 * 2. 运行此脚本：node test-shopify-connection.js
 * 3. 查看控制台输出
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Shopify 配置
const STORE_DOMAIN = 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = '11c0b58bfdee65f96fbbd918d9aeeaa7';

// 创建客户端
const shopifyClient = createStorefrontApiClient({
  storeDomain: STORE_DOMAIN,
  apiVersion: '2025-01',
  publicAccessToken: STOREFRONT_TOKEN,
});

// 测试查询
async function testShopifyConnection() {
  console.log('🔍 正在测试 Shopify API 连接...\n');
  console.log('Store Domain:', STORE_DOMAIN);
  console.log('API Version: 2025-01\n');

  try {
    const { data, errors } = await shopifyClient.request(`
      query {
        products(first: 6) {
          edges {
            node {
              id
              title
              handle
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
      }
    `);

    if (errors) {
      console.error('❌ Shopify API 错误:');
      console.error(JSON.stringify(errors, null, 2));
      process.exit(1);
    }

    const products = data?.products?.edges || [];
    
    if (products.length === 0) {
      console.log('⚠️  API 连接成功，但没有获取到商品数据');
      console.log('请检查 Shopify 后台是否有上架商品');
    } else {
      console.log('\n✅ 接入成功！商品数据:\n');
      
      products.forEach((edge, index) => {
        const product = edge.node;
        console.log(`\n--- 商品 ${index + 1} ---`);
        console.log('ID:', product.id);
        console.log('标题:', product.title);
        console.log('Handle:', product.handle);
        console.log('价格:', `$${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`);
        console.log('图片:', product.images.edges[0]?.node?.url || '无');
      });

      console.log(`\n📦 共获取 ${products.length} 个商品`);
      console.log('\n🎉 Shopify API 连接测试完成！');
    }

  } catch (error) {
    console.error('\n❌ Shopify API 连接失败:');
    console.error(error.message);
    console.error('\n可能的原因:');
    console.error('1. 未安装 SDK: 运行 npm install @shopify/storefront-api-client');
    console.error('2. Token 无效：检查 Shopify 后台 Storefront API token');
    console.error('3. 网络问题：检查网络连接');
    process.exit(1);
  }
}

// 执行测试
testShopifyConnection();
