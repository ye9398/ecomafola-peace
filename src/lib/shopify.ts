import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Shopify Storefront API Configuration
const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || import.meta.env.VITE_STOREFRONT_TOKEN;

// Enforce environment variables
if (!STOREFRONT_TOKEN) {
  throw new Error('VITE_SHOPIFY_STOREFRONT_TOKEN (or VITE_STOREFRONT_TOKEN) is required.');
}

// Cache Configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'shopify:';

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// Generate cache key
function getCacheKey(prefix: string, variables: Record<string, any>): string {
  return `${CACHE_PREFIX}${prefix}:${JSON.stringify(variables)}`;
}

// Read from cache
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

// Write to cache
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

// Clear all Shopify cache
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

// Shopify GraphQL Queries
export const SHOPIFY_QUERIES = {
  // Get detailed product by handle
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
      variants(first: 20) {
        edges {
          node {
            id
            title
            sku
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              id
              url
              altText
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

  // Get cart content
  getCart: `query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                image {
                  url
                  altText
                }
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                }
              }
            }
          }
        }
      }
    }
  }`,
};

// Helper: Get product by handle (with caching)
export async function getProductByHandle(handle: string): Promise<any | null> {
  const cacheKey = getCacheKey('product', { handle });
  const cached = readFromCache<any>(cacheKey);
  if (cached) return cached;

  const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getProductByHandle, {
    variables: { handle },
  });
  
  if (errors) {
    console.error('Shopify API errors:', errors);
    return null;
  }
  
  const result = data?.product;
  if (result) writeToCache(cacheKey, result);
  return result;
}

// Helper: Get cart
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

// Search products
export async function searchProducts(query: string) {
  const { data, errors } = await shopifyClient.request(`
    query searchProducts($query: String!) {
      products(first: 20, query: $query) {
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
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `, { variables: { query } });

  if (errors) {
    console.error('Shopify search errors:', errors);
    return [];
  }

  return data?.products?.edges?.map((e: any) => e.node) || [];
}

// Get all products
export async function getAllProducts() {
  const { data } = await shopifyClient.request(`
    query {
      products(first: 50) {
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
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
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

// Get products by collection
export async function getProductsByCollection(handle: string) {
  const { data, errors } = await shopifyClient.request(`
    query getProductsByCollection($handle: String!) {
      collection(handle: $handle) {
        products(first: 50) {
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
              variants(first: 1) {
                edges {
                  node {
                    id
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
  `, { variables: { handle } });

  if (errors) {
    console.error('Shopify collection errors:', errors);
    return [];
  }

  return data?.collection?.products?.edges?.map((e: any) => e.node) || [];
}

// Get featured products
export async function getFeaturedProducts() {
  const { data } = await shopifyClient.request(`
    query {
      products(first: 8, query: "tag:featured", sortKey: CREATED_AT, reverse: true) {
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
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
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
