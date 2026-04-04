import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Shopify Storefront API 配置
const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || import.meta.env.VITE_STOREFRONT_TOKEN;

// 强制使用环境变量
if (!STOREFRONT_TOKEN) {
  throw new Error('VITE_SHOPIFY_STOREFRONT_TOKEN (or VITE_STOREFRONT_TOKEN) is required.');
}

const API_URL = `https://${STORE_DOMAIN}/api/2026-01/graphql.json`;

// 缓存配置
const CACHE_DURATION = 5 * 60 * 1000; // 5 分钟
const CACHE_PREFIX = 'shopify:';

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// 生成缓存�?
function getCacheKey(prefix: string, variables: Record<string, any>): string {
  return `${CACHE_PREFIX}${prefix}:${JSON.stringify(variables)}`;
}

// 从缓存读�?
function readFromCache<T>(cacheKey: string): T | null {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached) as CachedData<T>;
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

// 写入缓存
function writeToCache<T>(cacheKey: string, data: T): void {
  if (typeof window === 'undefined') return;

  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

// 清除缓存（用于后台更新后�?
export function clearShopifyCache() {
  if (typeof window === 'undefined') return;

  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => localStorage.removeItem(key));

  console.log('[Shopify Cache] Cleared all cache');
}

export const shopifyClient = createStorefrontApiClient({
  storeDomain: STORE_DOMAIN,
  apiVersion: '2026-01',
  publicAccessToken: STOREFRONT_TOKEN,
});

// 常用查询
export const SHOPIFY_QUERIES = {
  // 获取商品列表
  getProducts: `query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          vendor
          tags
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }`,

  // 获取单个商品详情
  getProductByHandle: `query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      vendor
      tags
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first:20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        id
        name
        values
      }
    }
  }`,

  // 获取商品集合
  getCollections: `query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }`,

  // 创建购物�?
  createCart: `
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      images(first:1) {
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
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  // 添加商品到购物车
  addToCart: `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
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
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  // 更新购物车商品数�?
  updateCartLines: `
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  // 从购物车移除商品
  removeFromCart: `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  // 获取购物�?
  getCart: `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
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
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `,
};

// 辅助函数：获取商品列表（带缓存）
export async function getProducts(first: number = 20): Promise<any[] | null> {
  const cacheKey = getCacheKey('products', { first });

  // 尝试从缓存读�?
  const cached = readFromCache<any[]>(cacheKey);
  if (cached) {
    console.log('[Shopify Cache] HIT:', cacheKey);
    return cached;
  }

  console.log('[Shopify Cache] MISS:', cacheKey);

  const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getProducts, {
    variables: { first },
  });

  if (errors) {
    console.error('Shopify API errors:', errors);
    return null;
  }

  const result = data?.products?.edges?.map((edge: any) => edge.node) || [];

  // 写入缓存
  writeToCache(cacheKey, result);

  return result;
}

// 辅助函数：获取单个商品（带缓存）
export async function getProductByHandle(handle: string): Promise<any | null> {
  const cacheKey = getCacheKey('product', { handle });

  // 尝试从缓存读�?
  const cached = readFromCache<any>(cacheKey);
  if (cached) {
    console.log('[Shopify Cache] HIT:', cacheKey);
    return cached;
  }

  console.log('[Shopify Cache] MISS:', cacheKey);

  const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getProductByHandle, {
    variables: { handle },
  });

  if (errors) {
    console.error('Shopify API errors:', errors);
    return null;
  }

  const result = data?.product;

  // 写入缓存
  writeToCache(cacheKey, result);

  return result;
}

// 辅助函数：创建购物车
export async function createCart(lines: { merchandiseId: string; quantity: number }[] = []) {
  const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.createCart, {
    variables: { input: { lines } },
  });
  
  if (errors) {
    console.error('Shopify API errors:', errors);
    return null;
  }
  
  return data?.cartCreate?.cart;
}

// 辅助函数：添加商品到购物�?
export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.addToCart, {
    variables: { cartId, lines },
  });
  
  if (errors) {
    console.error('Shopify API errors:', errors);
    return null;
  }
  
  return data?.cartLinesAdd?.cart;
}

// 辅助函数：获取购物车
export async function getCart(cartId: string) {
  const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getCart, {
    variables: { cartId },
  });
  
  if (errors) {
    console.error('Shopify API errors:', errors);
    return null;
  }
  
  return data?.cart;
}

// 按标签查询商�?
export async function getFeaturedProducts() {
  const { data } = await shopifyClient.request(`
    query {
      products(first: 6, query: "tag:featured") {
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
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `);

  return data?.products?.edges?.map((e: any) => e.node) || [];
}

// 按分类（Collection）查询商�?
export async function getProductsByCollection(handle: string) {
  const { data } = await shopifyClient.request(`
    query getProductsByCollection($handle: String!) {
      collection(handle: $handle) {
        products(first: 20) {
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
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `, { variables: { handle } });

  return data?.collection?.products?.edges?.map((e: any) => e.node) || [];
}

// 获取所有商�?
export async function getAllProducts() {
  const { data } = await shopifyClient.request(`
    query {
      products(first: 20) {
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
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `);

  return data?.products?.edges?.map((e: any) => e.node) || [];
}
