/**
 * Product Detail Service
 *
 * Provides detailed product information fetching and processing utilities.
 * Handles product variants, options, pricing calculations, and availability checks.
 */

import { shopifyClient, SHOPIFY_QUERIES, getProductByHandle } from '../lib/shopify';

/**
 * Product variant option.
 */
export interface VariantOption {
  name: string;
  value: string;
}

/**
 * Product variant with pricing and availability.
 */
export interface ProductVariant {
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
  selectedOptions: VariantOption[];
  quantityAvailable?: number;
}

/**
 * Product option for selection (e.g., Size, Color).
 */
export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

/**
 * Product image.
 */
export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

/**
 * Price range for a product.
 */
export interface PriceRange {
  minVariantPrice: {
    amount: string;
    currencyCode: string;
  };
  maxVariantPrice: {
    amount: string;
    currencyCode: string;
  };
}

/**
 * Complete product detail data.
 */
export interface ProductDetail {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  productType: string;
  vendor: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  options: ProductOption[];
  priceRange: PriceRange;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Selected variant result after option matching.
 */
export interface SelectedVariantResult {
  variant: ProductVariant | null;
  available: boolean;
  price: string;
  compareAtPrice: string | null;
  isOnSale: boolean;
  discountPercentage: number;
}

/**
 * Cache configuration.
 */
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'product-detail:';

interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Reads data from localStorage cache.
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
 * Clears product detail cache.
 */
export function clearProductDetailCache(): void {
  if (typeof window === 'undefined') return;

  Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

/**
 * Fetches complete product detail data by handle.
 * Includes all variants, options, images, and pricing information.
 *
 * @param handle - Product handle (URL slug)
 * @param skipCache - Whether to bypass cache
 * @returns Promise resolving to product detail or null
 *
 * @example
 * const product = await fetchProductDetail('samoan-coconut-bowl')
 */
export async function fetchProductDetail(
  handle: string,
  skipCache: boolean = false
): Promise<ProductDetail | null> {
  const cacheKey = `${CACHE_PREFIX}${handle}`;

  // Check cache first
  if (!skipCache) {
    const cached = readFromCache<ProductDetail>(cacheKey);
    if (cached) {
      console.log('[ProductDetailService] Cache HIT:', handle);
      return cached;
    }
  }

  console.log('[ProductDetailService] Cache MISS:', handle);

  try {
    const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getProductByHandle, {
      variables: { handle },
    });

    if (errors) {
      console.error('[ProductDetailService] Shopify API errors:', errors);
      return null;
    }

    const product = data?.product;
    if (!product) {
      return null;
    }

    // Transform Shopify response to our ProductDetail type
    const productDetail: ProductDetail = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      productType: product.productType,
      vendor: product.vendor,
      tags: product.tags || [],
      images: product.images?.edges?.map((edge: any) => ({
        id: edge.node.id,
        url: edge.node.url,
        altText: edge.node.altText,
        width: edge.node.width,
        height: edge.node.height,
      })) || [],
      variants: product.variants?.edges?.map((edge: any) => {
        const node = edge.node;
        return {
          id: node.id,
          title: node.title,
          price: {
            amount: node.price.amount,
            currencyCode: node.price.currencyCode,
          },
          compareAtPrice: node.compareAtPrice
            ? {
                amount: node.compareAtPrice.amount,
                currencyCode: node.compareAtPrice.currencyCode,
              }
            : null,
          availableForSale: node.availableForSale,
          selectedOptions: node.selectedOptions?.map((opt: any) => ({
            name: opt.name,
            value: opt.value,
          })) || [],
        };
      }) || [],
      options: product.options?.map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        values: opt.values || [],
      })) || [],
      priceRange: {
        minVariantPrice: product.priceRange?.minVariantPrice || {
          amount: '0',
          currencyCode: 'USD',
        },
        maxVariantPrice: product.priceRange?.maxVariantPrice || {
          amount: '0',
          currencyCode: 'USD',
        },
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    // Cache the product detail
    writeToCache(cacheKey, productDetail);

    return productDetail;
  } catch (error) {
    console.error('[ProductDetailService] Error fetching product:', error);
    return null;
  }
}

/**
 * Finds a variant by matching selected options.
 *
 * @param variants - Array of product variants
 * @param options - Selected option values { optionName: optionValue }
 * @returns Matching variant or null
 *
 * @example
 * const variant = findVariantByOptions(variants, { Size: 'Medium', Color: 'Blue' })
 */
export function findVariantByOptions(
  variants: ProductVariant[],
  options: Record<string, string>
): ProductVariant | null {
  const selectedEntries = Object.entries(options);

  return variants.find((variant) => {
    return selectedEntries.every(([optionName, optionValue]) => {
      return variant.selectedOptions.some(
        (opt) => opt.name === optionName && opt.value === optionValue
      );
    });
  }) || null;
}

/**
 * Gets the selected variant info including pricing and availability.
 *
 * @param variant - Product variant
 * @returns Selected variant result with computed fields
 *
 * @example
 * const result = getSelectedVariantInfo(variant)
 */
export function getSelectedVariantInfo(variant: ProductVariant | null): SelectedVariantResult {
  if (!variant) {
    return {
      variant: null,
      available: false,
      price: '0',
      compareAtPrice: null,
      isOnSale: false,
      discountPercentage: 0,
    };
  }

  const priceAmount = parseFloat(variant.price.amount);
  const compareAtPriceAmount = variant.compareAtPrice
    ? parseFloat(variant.compareAtPrice.amount)
    : null;

  const isOnSale = compareAtPriceAmount !== null && compareAtPriceAmount > priceAmount;
  const discountPercentage = isOnSale
    ? Math.round(((compareAtPriceAmount - priceAmount) / compareAtPriceAmount) * 100)
    : 0;

  return {
    variant,
    available: variant.availableForSale,
    price: variant.price.amount,
    compareAtPrice: variant.compareAtPrice?.amount || null,
    isOnSale,
    discountPercentage,
  };
}

/**
 * Calculates the price range from available variants.
 *
 * @param variants - Array of product variants
 * @returns Price range with min and max values
 *
 * @example
 * const range = calculatePriceRange(variants)
 */
export function calculatePriceRange(variants: ProductVariant[]): PriceRange {
  if (variants.length === 0) {
    return {
      minVariantPrice: { amount: '0', currencyCode: 'USD' },
      maxVariantPrice: { amount: '0', currencyCode: 'USD' },
    };
  }

  const prices = variants.map((v) => parseFloat(v.price.amount));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    minVariantPrice: {
      amount: minPrice.toFixed(2),
      currencyCode: variants[0].price.currencyCode,
    },
    maxVariantPrice: {
      amount: maxPrice.toFixed(2),
      currencyCode: variants[0].price.currencyCode,
    },
  };
}

/**
 * Gets all available option values for a given option name.
 *
 * @param options - Product options
 * @param optionName - Option name to get values for (e.g., "Size", "Color")
 * @returns Array of available option values
 *
 * @example
 * const sizes = getAvailableOptionValues(options, 'Size')
 */
export function getAvailableOptionValues(
  options: ProductOption[],
  optionName: string
): string[] {
  const option = options.find((opt) => opt.name === optionName);
  return option?.values || [];
}

/**
 * Checks if a specific option value is available (has at least one variant in stock).
 *
 * @param variants - Product variants
 * @param optionName - Option name
 * @param optionValue - Option value to check
 * @returns true if at least one variant with this option is available
 *
 * @example
 * const isAvailable = isOptionValueAvailable(variants, 'Size', 'Medium')
 */
export function isOptionValueAvailable(
  variants: ProductVariant[],
  optionName: string,
  optionValue: string
): boolean {
  return variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.some(
        (opt) => opt.name === optionName && opt.value === optionValue
      )
  );
}

/**
 * Gets the first available image for a product.
 * Falls back to variant image if available, then product images.
 *
 * @param product - Product detail
 * @param variant - Selected variant (optional)
 * @returns First available product image or null
 *
 * @example
 * const image = getPrimaryImage(product, selectedVariant)
 */
export function getPrimaryImage(
  product: ProductDetail | null,
  variant?: ProductVariant | null
): ProductImage | null {
  if (!product) return null;

  // If variant has specific image, return it
  if (variant && product.images.length > 0) {
    // For now, return first image - can be enhanced to match variant
    return product.images[0];
  }

  return product.images[0] || null;
}

/**
 * Formats product price for display.
 *
 * @param price - Price amount as string
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted price string
 *
 * @example
 * const displayPrice = formatPrice('29.99', 'USD') // "$29.99"
 */
export function formatPrice(
  price: string,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const num = parseFloat(price);
  if (isNaN(num)) {
    return `$${price}`;
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(num);
  } catch {
    return `$${price}`;
  }
}

/**
 * Checks if a product is in stock (has at least one available variant).
 *
 * @param product - Product detail
 * @returns true if product has available variants
 *
 * @example
 * const inStock = isProductInStock(product)
 */
export function isProductInStock(product: ProductDetail | null): boolean {
  if (!product) return false;
  return product.variants.some((v) => v.availableForSale);
}

/**
 * Gets product availability status text.
 *
 * @param product - Product detail
 * @param variant - Selected variant (optional)
 * @returns Availability status string
 *
 * @example
 * const status = getAvailabilityStatus(product, selectedVariant)
 */
export function getAvailabilityStatus(
  product: ProductDetail | null,
  variant?: ProductVariant | null
): string {
  if (!product) return 'Unknown availability';

  if (variant) {
    return variant.availableForSale ? 'In Stock' : 'Out of Stock';
  }

  const hasStock = isProductInStock(product);
  if (!hasStock) return 'Out of Stock';

  // Check if some variants are out of stock
  const allAvailable = product.variants.every((v) => v.availableForSale);
  if (allAvailable) return 'In Stock';

  return 'Select Options for Availability';
}

/**
 * Service API for product detail operations.
 */
export const productDetailService = {
  fetchProductDetail,
  findVariantByOptions,
  getSelectedVariantInfo,
  calculatePriceRange,
  getAvailableOptionValues,
  isOptionValueAvailable,
  getPrimaryImage,
  formatPrice,
  isProductInStock,
  getAvailabilityStatus,
  clearProductDetailCache,
};

export default productDetailService;
