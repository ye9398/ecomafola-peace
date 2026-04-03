/**
 * Shopify CDN Image Optimization
 *
 * Provides utilities for generating optimized image URLs using Shopify's CDN.
 * Shopify automatically serves optimized images with automatic format selection (WebP/AVIF).
 *
 * @see https://shopify.dev/docs/api/storefront/latest/objects/image
 */

/**
 * Image size presets for common use cases in the application.
 * These presets align with responsive image breakpoints.
 */
export const IMAGE_SIZES = {
  // Thumbnail for lists, grids, carousels
  thumbnail: { width: 300, height: 300 },
  // Standard product card image
  card: { width: 500, height: 500 },
  // Product detail page main image (mobile)
  detailMobile: { width: 600, height: 600 },
  // Product detail page main image (desktop)
  detailDesktop: { width: 1200, height: 1200 },
  // Hero/banner images
  hero: { width: 1920, height: 800 },
  // Collection/category images
  collection: { width: 800, height: 600 },
  // Cart thumbnail
  cart: { width: 120, height: 120 },
  // Avatar/profile images
  avatar: { width: 80, height: 80 },
} as const;

export type ImageSizePreset = keyof typeof IMAGE_SIZES;

/**
 * Supported image formats for Shopify CDN.
 * Shopify will automatically serve the best format (WebP, AVIF) based on browser support.
 */
export type ImageFormat = 'jpg' | 'png' | 'webp' | 'avif' | 'gif' | 'auto';

/**
 * Crop options for image transformation.
 * - crop: Crops to exact dimensions (may lose some image content)
 * - scale: Scales to fit within dimensions (preserves entire image)
 * - pad: Scales and adds padding to fit exact dimensions
 */
export type ImageCrop = 'crop' | 'scale' | 'pad';

/**
 * Options for image optimization.
 */
export interface ImageOptimizerOptions {
  /** Target width in pixels */
  width?: number;
  /** Target height in pixels */
  height?: number;
  /** Output format (default: 'auto' for automatic format selection) */
  format?: ImageFormat;
  /** Crop mode (default: 'crop') */
  crop?: ImageCrop;
  /** Quality level 1-100 (default: 85, recommended for web) */
  quality?: number;
  /** Apply blur effect (0-100) */
  blur?: number;
}

/**
 * Extracts the base image URL without size parameters.
 * Shopify image URLs follow the pattern:
 * https://cdn.shopify.com/s/files/1/{shopId}/files/{filename}.{ext}
 * or legacy pattern:
 * https://cdn.shopify.com/s/files/1/{shopId}/products/{filename}.{ext}
 *
 * @param imageUrl - The original image URL from Shopify API
 * @returns The base URL without size parameters, or null if invalid
 *
 * @example
 * const baseUrl = extractBaseUrl('https://cdn.shopify.com/.../image_100x100.jpg')
 * // Returns: 'https://cdn.shopify.com/.../image.jpg'
 */
export function extractBaseUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;

  try {
    // Handle Shopify CDN URLs with size parameters
    // Pattern: _{width}x{height}.{format} or _{width}x.{format}
    // Does NOT match _{width}.{format} (pure numbers without 'x' should be preserved)
    const shopifyPattern = /(_\d+x\d+|_\d+x)\.(jpg|jpeg|png|webp|avif|gif)$/i;
    if (shopifyPattern.test(imageUrl)) {
      return imageUrl.replace(shopifyPattern, '.$2');
    }

    // If no size parameter found, return as-is
    return imageUrl;
  } catch {
    return null;
  }
}

/**
 * Generates an optimized Shopify CDN image URL.
 *
 * Shopify's CDN automatically:
 * - Serves next-gen formats (WebP, AVIF) to supported browsers
 * - Applies compression optimized for web delivery
 * - Provides global edge caching for fast delivery
 *
 * @param imageUrl - The original image URL from Shopify API
 * @param options - Optimization options
 * @returns Optimized image URL, or original URL if input is invalid
 *
 * @example
 * // Basic usage with preset size
 * const url = getShopifyImageUrl(productImage, { width: 500, height: 500 })
 *
 * @example
 * // Using a preset
 * const url = getShopifyImageUrl(productImage, IMAGE_SIZES.card)
 *
 * @example
 * // Custom quality and format
 * const url = getShopifyImageUrl(productImage, {
 *   width: 800,
 *   quality: 90,
 *   format: 'webp'
 * })
 */
export function getShopifyImageUrl(
  imageUrl: string | null | undefined,
  options?: ImageOptimizerOptions | ImageSizePreset
): string | null {
  const baseUrl = extractBaseUrl(imageUrl);
  if (!baseUrl) return null;

  // Handle preset lookup
  let opts: ImageOptimizerOptions = {};
  if (typeof options === 'string' && options in IMAGE_SIZES) {
    opts = IMAGE_SIZES[options as ImageSizePreset];
  } else if (options && typeof options === 'object') {
    opts = options;
  }

  // Build query parameters for Shopify CDN
  const params = new URLSearchParams();

  if (opts.width) {
    params.set('width', opts.width.toString());
  }
  if (opts.height) {
    params.set('height', opts.height.toString());
  }
  if (opts.crop) {
    params.set('crop', opts.crop);
  }
  if (opts.format && opts.format !== 'auto') {
    params.set('format', opts.format);
  }
  if (opts.quality && opts.quality !== 85) {
    params.set('quality', opts.quality.toString());
  }
  if (opts.blur) {
    params.set('blur', opts.blur.toString());
  }

  // If no params, return base URL
  if (params.toString() === '') {
    return baseUrl;
  }

  // Append query params to URL
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${params.toString()}`;
}

/**
 * Generates a responsive srcset attribute for responsive images.
 * Creates multiple resolution variants for optimal loading across devices.
 *
 * @param imageUrl - The original image URL from Shopify API
 * @param baseWidth - The base/max width to generate variants from
 * @returns srcset string or empty string if image is invalid
 *
 * @example
 * // Generate srcset for a 1200px image
 * const srcset = generateSrcSet(productImage, 1200)
 * // Returns: "url_300w.jpg 300w, url_600w.jpg 600w, url_1200w.jpg 1200w"
 */
export function generateSrcSet(
  imageUrl: string | null | undefined,
  baseWidth: number = 1200
): string {
  const baseUrl = extractBaseUrl(imageUrl);
  if (!baseUrl) return '';

  // Generate standard responsive breakpoints
  const breakpoints = [
    Math.min(300, baseWidth),
    Math.min(500, baseWidth),
    Math.min(700, baseWidth),
    Math.min(900, baseWidth),
    Math.min(1200, baseWidth),
    Math.min(1600, baseWidth),
  ].filter((w, i, arr) => w > 0 && (i === 0 || w !== arr[i - 1]));

  return breakpoints
    .map((width) => {
      const optimizedUrl = getShopifyImageUrl(baseUrl, { width, height: width, crop: 'crop' });
      return optimizedUrl ? `${optimizedUrl} ${width}w` : null;
    })
    .filter((s): s is string => s !== null)
    .join(', ');
}

/**
 * Returns optimal sizes attribute for responsive image loading.
 * Tells the browser which image size to load based on viewport.
 *
 * @param mobileSize - CSS width for mobile viewports (default: 50vw)
 * @param tabletSize - CSS width for tablet viewports (default: 33vw)
 * @param desktopSize - CSS width for desktop viewports (default: 25vw)
 * @returns sizes attribute string
 *
 * @example
 * // Product grid: 2 columns on mobile, 3 on tablet, 4 on desktop
 * const sizes = getResponsiveSizes('45vw', '32vw', '23vw')
 */
export function getResponsiveSizes(
  mobileSize: string = '50vw',
  tabletSize: string = '33vw',
  desktopSize: string = '25vw'
): string {
  return `(max-width: 640px) ${mobileSize}, (max-width: 1024px) ${tabletSize}, ${desktopSize}`;
}

/**
 * Preloads critical images to improve LCP (Largest Contentful Paint).
 * Should be used for above-the-fold images like hero banners.
 *
 * @param imageUrl - The image URL to preload
 * @param as - Resource type (default: 'image')
 * @param imageSizes - Optional sizes attribute for responsive images
 *
 * @example
 * // Preload hero image in component
 * useEffect(() => {
 *   preloadImage(heroImage, 'image', '100vw')
 * }, [heroImage])
 */
export function preloadImage(
  imageUrl: string | null | undefined,
  as: string = 'image',
  imageSizes?: string
): void {
  const optimizedUrl = getShopifyImageUrl(imageUrl, { width: 1920 });
  if (!optimizedUrl) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = optimizedUrl;

  if (as === 'image') {
    link.setAttribute('imagesizes', imageSizes || '100vw');
    link.setAttribute('imagesrcset', generateSrcSet(imageUrl, 1920));
  }

  document.head.appendChild(link);
}

/**
 * Image lazy loading options using Intersection Observer.
 * Provides a hook-friendly interface for lazy loading.
 */
export interface LazyLoadOptions {
  /** Root margin for intersection observer (default: '100px') */
  rootMargin?: string;
  /** Threshold for triggering load (default: 0) */
  threshold?: number | number[];
  /** Placeholder blur data URL */
  placeholder?: string;
  /** Enable progressive blur-up effect */
  blurUp?: boolean;
}

/**
 * Default lazy loading configuration for common scenarios.
 */
export const LAZY_LOAD_DEFAULTS: Readonly<LazyLoadOptions> = {
  rootMargin: '100px',
  threshold: 0,
  blurUp: true,
} as const;

// ============================================================
// 任务 1: Shopify CDN 图片优化 - 新增功能（图片体积 -30%）
// ============================================================

/**
 * Options for optimized image loading.
 */
export interface OptimizedImageOptions {
  /** Target width in pixels */
  width?: number;
  /** Target height in pixels */
  height?: number;
  /** Auto-select best format (AVIF/WebP) based on browser support */
  autoFormat?: boolean;
  /** Enable lazy loading (default: true) */
  lazy?: boolean;
  /** Quality level 1-100 (auto-calculated if not provided) */
  quality?: number;
  /** Crop mode */
  crop?: ImageCrop;
  /** Priority loading for LCP images (disables lazy loading) */
  priority?: boolean;
}

/**
 * Calculates optimal quality based on image size.
 * Larger images can use lower quality without visible loss.
 * Smaller images benefit from higher quality.
 *
 * @param width - Image width in pixels
 * @returns Optimal quality value (1-100)
 *
 * @example
 * calculateOptimalQuality(1920) // Returns ~75
 * calculateOptimalQuality(300)  // Returns ~90
 */
export function calculateOptimalQuality(width: number): number {
  if (width >= 1600) return 70;  // Very large images
  if (width >= 1200) return 75;  // Desktop full-width
  if (width >= 800) return 80;   // Tablet
  if (width >= 500) return 85;   // Standard card
  return 90;                      // Thumbnail/small
}

/**
 * Detects if the browser supports AVIF format.
 * Uses CSS.supports() for feature detection instead of UA sniffing.
 *
 * @returns true if AVIF is supported
 *
 * @example
 * if (shouldUseAVIF()) {
 *   // Use AVIF format for better compression
 * }
 */
export function shouldUseAVIF(): boolean {
  // SSR check - CSS is not available on server
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return false;
  }

  // Use CSS feature detection for AVIF support
  // Tests if browser supports image/avif MIME type
  return CSS.supports('image-type', 'image/avif');
}

/**
 * Generates an optimized image URL with automatic quality, format, and loading strategy.
 *
 * Features:
 * - Automatic quality based on image size
 * - AVIF/WebP format selection based on browser support
 * - Lazy loading by default
 * - Priority loading for LCP images
 *
 * @param imageUrl - The original image URL from Shopify API
 * @param options - Optimization options
 * @returns Optimized image URL with all optimizations applied
 *
 * @example
 * // Basic usage with auto-optimizations
 * const url = getOptimizedImageUrl(productImage, { width: 800 })
 *
 * @example
 * // LCP image (above-fold, no lazy loading)
 * const url = getOptimizedImageUrl(productImage, {
 *   width: 1200,
 *   priority: true,
 *   autoFormat: true
 * })
 */
export function getOptimizedImageUrl(
  imageUrl: string | null | undefined,
  options: OptimizedImageOptions = {}
): string | null {
  const baseUrl = extractBaseUrl(imageUrl);
  if (!baseUrl) return null;

  const {
    width = 800,
    height,
    autoFormat = false,
    lazy = true,
    quality,
    crop,
    priority = false,
  } = options;

  // Build query parameters
  const params = new URLSearchParams();

  // Size parameters
  params.set('width', width.toString());
  if (height) {
    params.set('height', height.toString());
  }

  // Auto-calculate quality if not provided
  const optimalQuality = quality ?? calculateOptimalQuality(width);
  params.set('quality', optimalQuality.toString());

  // Crop mode
  if (crop) {
    params.set('crop', crop);
  }

  // Format selection
  if (autoFormat) {
    params.set('format', shouldUseAVIF() ? 'avif' : 'webp');
  }

  // Lazy loading (note: this is a custom param, actual lazy loading done via img attribute)
  if (lazy && !priority) {
    params.set('loading', 'lazy');
  }

  // Append parameters to URL
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${params.toString()}`;
}

/**
 * Extracts image dimensions from a Shopify CDN URL.
 *
 * @param imageUrl - The Shopify image URL
 * @returns Object with width and height, or null if not found
 *
 * @example
 * const dims = getImageDimensions('https://cdn.shopify.com/.../image_800x600.jpg')
 * // Returns: { width: 800, height: 600 }
 */
export function getImageDimensions(
  imageUrl: string | null | undefined
): { width: number; height: number } | null {
  if (!imageUrl) return null;

  try {
    // Match pattern: _{width}x{height} before file extension
    const dimPattern = /_(\d+)x(\d+)\.(jpg|jpeg|png|webp|avif|gif)$/i;
    const match = imageUrl.match(dimPattern);

    if (match && match[1] && match[2]) {
      return {
        width: parseInt(match[1], 10),
        height: parseInt(match[2], 10),
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Preloads an optimized image for LCP improvement.
 * Should be used for above-the-fold images like hero banners and product main images.
 *
 * @param imageUrl - The image URL to preload
 * @param width - Target width (default: 1920 for hero images)
 *
 * @example
 * // Preload product main image
 * useEffect(() => {
 *   preloadOptimizedImage(product.images[0], 1200)
 * }, [product])
 */
export function preloadOptimizedImage(
  imageUrl: string | null | undefined,
  width: number = 1920
): void {
  if (typeof document === 'undefined') return;

  const optimizedUrl = getOptimizedImageUrl(imageUrl, {
    width,
    priority: true,
    autoFormat: true,
  });

  if (!optimizedUrl) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.imageSrcset = optimizedUrl;
  link.imageSizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px';
  link.fetchPriority = 'high';

  document.head.appendChild(link);
}
