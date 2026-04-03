/**
 * Parallel Data Fetching for Shop Storefront
 *
 * Provides optimized data fetching utilities using Promise.all for parallel loading.
 * Reduces waterfall requests and improves page load performance.
 */

import { shopifyClient, SHOPIFY_QUERIES, getProducts, getProductByHandle } from './shopify';

/**
 * Cache configuration for data fetching.
 */
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'fetch:';

interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Reads data from localStorage cache.
 * @param cacheKey - The cache key to look up
 * @returns Cached data or null if not found/expired
 */
function readFromCache<T>(cacheKey: string): T | null {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    const { data, timestamp }: CachedData<T> = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Writes data to localStorage cache.
 * @param cacheKey - The cache key
 * @param data - The data to cache
 */
function writeToCache<T>(cacheKey: string, data: T): void {
  if (typeof window === 'undefined') return;

  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch {
    // Ignore cache write errors
  }
}

/**
 * Clears all fetch-related cache.
 */
export function clearFetchCache(): void {
  if (typeof window === 'undefined') return;

  Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

/**
 * Product data structure returned from fetch operations.
 */
export interface ProductData {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  productType: string;
  vendor: string;
  tags: string[];
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice: {
      amount: string;
      currencyCode: string;
    } | null;
    availableForSale: boolean;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  }>;
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

/**
 * Collection data structure.
 */
export interface CollectionData {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  image: {
    url: string;
    altText: string | null;
  } | null;
  productsCount: number;
}

/**
 * Review data structure (from local/backend API).
 */
export interface ReviewData {
  id: string;
  rating: number;
  author: string;
  title?: string;
  content: string;
  createdAt: string;
  verified: boolean;
}

/**
 * Fetch result container with loading states.
 */
export interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetches product detail page data in parallel.
 * Combines product info, related products, and reviews in a single request batch.
 *
 * @param handle - Product handle (URL slug)
 * @param options - Optional fetch configuration
 * @returns Promise resolving to combined product data
 *
 * @example
 * const data = await fetchProductData('samoan-coconut-bowl', {
 *   includeReviews: true,
 *   includeRelated: true,
 *   relatedCount: 4
 * })
 */
export async function fetchProductData(
  handle: string,
  options: {
    includeReviews?: boolean;
    includeRelated?: boolean;
    relatedCount?: number;
    skipCache?: boolean;
  } = {}
): Promise<{
  product: ProductData | null;
  reviews: ReviewData[];
  relatedProducts: ProductData[];
  error: string | null;
}> {
  const {
    includeReviews = true,
    includeRelated = true,
    relatedCount = 4,
    skipCache = false,
  } = options;

  const cacheKey = `${CACHE_PREFIX}product:${handle}`;

  // Check cache first
  if (!skipCache) {
    const cached = readFromCache<{
      product: ProductData;
      timestamp: number;
    }>(cacheKey);
    if (cached) {
      console.log('[DataFetcher] Cache HIT:', handle);
      return {
        product: cached.product,
        reviews: [],
        relatedProducts: [],
        error: null,
      };
    }
  }

  console.log('[DataFetcher] Cache MISS:', handle);

  // Build parallel fetch promises
  const fetchPromises: Promise<any>[] = [
    // Primary product data (required)
    (async () => {
      const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getProductByHandle, {
        variables: { handle },
      });

      if (errors) {
        console.error('Shopify API errors:', errors);
        return null;
      }

      return data?.product || null;
    })(),
  ];

  // Add reviews fetch (if enabled)
  if (includeReviews) {
    fetchPromises.push(
      (async () => {
        try {
          const response = await fetch(`/api/reviews?product=${handle}`);
          if (!response.ok) return [];
          const data = await response.json();
          return data.reviews || [];
        } catch (error) {
          console.warn('Failed to fetch reviews:', error);
          return [];
        }
      })(),
    );
  }

  // Add related products fetch (if enabled)
  if (includeRelated) {
    fetchPromises.push(
      (async () => {
        const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getProducts, {
          variables: { first: relatedCount + 5 },
        });

        if (errors) {
          console.warn('Failed to fetch related products:', errors);
          return [];
        }

        const products = data?.products?.edges?.map((edge: any) => edge.node) || [];
        // Filter out current product and limit to requested count
        return products
          .filter((p: any) => p.handle !== handle)
          .slice(0, relatedCount);
      })(),
    );
  }

  // Execute all fetches in parallel
  const results = await Promise.allSettled(fetchPromises);

  // Process results
  const product = results[0].status === 'fulfilled' ? results[0].value : null;
  const reviews = includeReviews && results[1]?.status === 'fulfilled' ? results[1].value : [];
  const relatedProducts =
    includeRelated && results[includeReviews ? 2 : 1]?.status === 'fulfilled'
      ? results[includeReviews ? 2 : 1].value
      : [];

  // Cache the product data
  if (product) {
    writeToCache(cacheKey, { product, timestamp: Date.now() });
  }

  // Check for critical errors
  let error: string | null = null;
  if (!product) {
    error = 'Failed to load product data';
  }

  return {
    product,
    reviews,
    relatedProducts,
    error,
  };
}

/**
 * Fetches multiple products by their handles in parallel.
 * More efficient than sequential fetching for product lists.
 *
 * @param handles - Array of product handles to fetch
 * @param skipCache - Whether to bypass cache
 * @returns Promise resolving to array of product data
 *
 * @example
 * const products = await fetchProductsByHandles(['bowl-1', 'bowl-2', 'bowl-3'])
 */
export async function fetchProductsByHandles(
  handles: string[],
  skipCache: boolean = false
): Promise<ProductData[]> {
  if (handles.length === 0) return [];

  // Check if all products are in cache
  if (!skipCache) {
    const cachedProducts: ProductData[] = [];
    let allCached = true;

    for (const handle of handles) {
      const cached = readFromCache<{ product: ProductData; timestamp: number }>(
        `${CACHE_PREFIX}product:${handle}`
      );
      if (cached) {
        cachedProducts.push(cached.product);
      } else {
        allCached = false;
      }
    }

    if (allCached) {
      console.log('[DataFetcher] All products cached:', handles.length);
      return cachedProducts;
    }
  }

  // Fetch products in parallel using individual queries
  // For large batches, consider using a batch GraphQL query
  const fetchPromises = handles.map(async (handle) => {
    const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getProductByHandle, {
      variables: { handle },
    });

    if (errors || !data?.product) {
      console.warn(`Failed to fetch product ${handle}:`, errors);
      return null;
    }

    return data.product;
  });

  const results = await Promise.allSettled(fetchPromises);

  return results
    .filter((r): r is PromiseFulfilledResult<ProductData> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((p): p is ProductData => p !== null);
}

/**
 * Fetches collection data with products in parallel.
 *
 * @param collectionHandle - Collection handle (URL slug)
 * @param productCount - Number of products to fetch
 * @returns Promise resolving to collection with products
 *
 * @example
 * const collection = await fetchCollectionWithProducts('featured')
 */
export async function fetchCollectionWithProducts(
  collectionHandle: string,
  productCount: number = 12
): Promise<{
  collection: CollectionData | null;
  products: ProductData[];
  error: string | null;
}> {
  const cacheKey = `${CACHE_PREFIX}collection:${collectionHandle}`;

  // Check cache
  const cached = readFromCache<{ collection: CollectionData; timestamp: number }>(cacheKey);
  if (cached) {
    console.log('[DataFetcher] Collection cache HIT:', collectionHandle);
    return {
      collection: cached.collection,
      products: [],
      error: null,
    };
  }

  // Build parallel fetch for collection and products
  const [collectionResult, productsResult] = await Promise.allSettled([
    shopifyClient.request(
      `query GetCollection($handle: String!) {
        collection(handle: $handle) {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          productsCount
        }
      }`,
      { variables: { handle: collectionHandle } }
    ),
    getProducts(productCount),
  ]);

  const collectionData =
    collectionResult.status === 'fulfilled' ? collectionResult.value?.data?.collection : null;
  const products = productsResult.status === 'fulfilled' ? productsResult.value : [];

  const collection: CollectionData | null = collectionData
    ? {
        id: collectionData.id,
        title: collectionData.title,
        handle: collectionData.handle,
        description: collectionData.description,
        image: collectionData.image,
        productsCount: collectionData.productsCount,
      }
    : null;

  // Cache collection data
  if (collection) {
    writeToCache(cacheKey, { collection, timestamp: Date.now() });
  }

  return {
    collection,
    products: products || [],
    error: collection ? null : 'Failed to load collection',
  };
}

/**
 * Fetches homepage data in parallel for optimal initial page load.
 * Combines featured products, collections, and other homepage content.
 *
 * @param options - Fetch configuration
 * @returns Promise resolving to homepage data bundle
 *
 * @example
 * const homeData = await fetchHomePageData({
 *   featuredCount: 6,
 *   collectionsCount: 4
 * })
 */
export async function fetchHomePageData(options: {
  featuredCount?: number;
  collectionsCount?: number;
  skipCache?: boolean;
} = {}): Promise<{
  featuredProducts: ProductData[];
  collections: CollectionData[];
  newProducts: ProductData[];
  loading: boolean;
  error: string | null;
}> {
  const {
    featuredCount = 6,
    collectionsCount = 4,
    skipCache = false,
  } = options;

  const cacheKey = `${CACHE_PREFIX}homepage`;

  // Check cache
  if (!skipCache) {
    const cached = readFromCache<{
      featuredProducts: ProductData[];
      collections: CollectionData[];
      timestamp: number;
    }>(cacheKey);
    if (cached) {
      return {
        ...cached,
        newProducts: [],
        loading: false,
        error: null,
      };
    }
  }

  // Parallel fetch for all homepage data
  const [featuredProducts, collectionsResult, newProducts] = await Promise.allSettled([
    getProducts(featuredCount),
    shopifyClient.request(SHOPIFY_QUERIES.getCollections, {
      variables: { first: collectionsCount },
    }),
    getProducts(featuredCount), // In real app, this would fetch newest products
  ]);

  const collections =
    collectionsResult.status === 'fulfilled'
      ? collectionsResult.value?.data?.collections?.edges?.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
          description: edge.node.description,
          image: edge.node.image,
          productsCount: edge.node.productsCount || 0,
        })) || []
      : [];

  // Cache homepage data
  writeToCache(cacheKey, {
    featuredProducts: (featuredProducts.status === 'fulfilled' ? featuredProducts.value : []) || [],
    collections,
    timestamp: Date.now(),
  });

  return {
    featuredProducts: (featuredProducts.status === 'fulfilled' ? featuredProducts.value : []) || [],
    collections,
    newProducts: (newProducts.status === 'fulfilled' ? newProducts.value : []) || [],
    loading: false,
    error: null,
  };
}

/**
 * AbortController map for managing in-flight requests.
 * Allows cancellation of pending fetches (e.g., on component unmount).
 */
const requestControllers: Map<string, AbortController> = new Map();

/**
 * Fetches data with abort support for cleanup on unmount.
 *
 * @param key - Unique request key for tracking
 * @param fetchFn - The fetch function to execute
 * @returns Promise resolving to fetch result or null if aborted
 */
export async function fetchWithAbort<T>(
  key: string,
  fetchFn: (signal: AbortSignal) => Promise<T>
): Promise<T | null> {
  // Cancel existing request with same key
  if (requestControllers.has(key)) {
    requestControllers.get(key)!.abort();
  }

  const controller = new AbortController();
  requestControllers.set(key, controller);

  try {
    const result = await fetchFn(controller.signal);
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('[DataFetcher] Request aborted:', key);
      return null;
    }
    throw error;
  } finally {
    requestControllers.delete(key);
  }
}

/**
 * Cancels a pending request by key.
 * @param key - The request key to cancel
 */
export function cancelRequest(key: string): void {
  const controller = requestControllers.get(key);
  if (controller) {
    controller.abort();
    requestControllers.delete(key);
  }
}

/**
 * Cancels all pending requests.
 * Useful for cleanup on route changes.
 */
export function cancelAllRequests(): void {
  requestControllers.forEach((controller) => controller.abort());
  requestControllers.clear();
}
