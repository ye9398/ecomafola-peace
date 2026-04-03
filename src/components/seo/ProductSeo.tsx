/**
 * ProductSeo Component
 *
 * Unified SEO component for product pages using react-helmet-async.
 * Generates Open Graph, Twitter Card, and JSON-LD structured data.
 */

import { Helmet } from 'react-helmet-async';

/**
 * Product data interface for SEO generation.
 */
export interface ProductSeoData {
  /** Product ID */
  id: string;
  /** Product name/title */
  name: string;
  /** Product description (may contain HTML) */
  description: string;
  /** Product handle/slug for URL */
  handle: string;
  /** SKU or product code */
  sku?: string;
  /** Product images (first image used for social sharing) */
  images: string[];
  /** Price in USD */
  price: number;
  /** Currency code (default: 'USD') */
  currency?: string;
  /** Stock quantity */
  stock: number;
  /** Product category */
  category?: string;
  /** Brand name (default: 'EcoMafola Peace') */
  brand?: string;
  /** Product origin (default: 'Samoa') */
  origin?: string;
  /** Material description (default: 'Natural Materials') */
  material?: string;
}

/**
 * Review data for aggregate rating in structured data.
 */
export interface ReviewData {
  id: string;
  rating: number;
  author: string;
  content?: string;
}

/**
 * SEO configuration options.
 */
export interface SeoOptions {
  /** Site origin URL (default: window.location.origin) */
  origin?: string;
  /** Site name (default: 'EcoMafola Peace') */
  siteName?: string;
  /** Twitter handle (default: '@ecomafola') */
  twitterHandle?: string;
  /** Product reviews for aggregate rating */
  reviews?: ReviewData[];
  /** Shipping cost in USD (default: 0 for free shipping) */
  shippingCost?: number;
  /** Estimated delivery time in days */
  deliveryTime?: {
    min: number;
    max: number;
  };
}

/**
 * Generates Product Schema.org structured data.
 *
 * @param product - Product data
 * @param options - SEO configuration
 * @returns JSON-LD structured data object
 */
export function getProductSchema(
  product: ProductSeoData,
  options: SeoOptions = {}
): Record<string, any> {
  const {
    reviews = [],
    shippingCost = 0,
    deliveryTime = { min: 7, max: 15 },
  } = options;

  // Use product data first, fallback to options, then defaults
  const material = product.material || options.material || 'Natural Materials';
  const origin = product.origin || options.origin || 'Samoa';
  const brand = product.brand || options.brand || 'EcoMafola Peace';

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.filter(Boolean),
    description: stripHtml(product.description),
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    material,
    origin,
    sku: product.sku || product.handle,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: shippingCost.toString(),
          currency: product.currency || 'USD',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: deliveryTime.min,
            maxValue: deliveryTime.max,
            unitCode: 'd',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviews.length.toString(),
    },
  };
}

/**
 * Generates BreadcrumbList Schema.org structured data.
 *
 * @param product - Product data for breadcrumb
 * @param options - SEO configuration with origin
 * @returns JSON-LD structured data object
 */
export function getBreadcrumbSchema(
  product: Pick<ProductSeoData, 'name' | 'handle' | 'sku'>,
  options: { origin?: string } = {}
): Record<string, any> {
  const origin = options.origin || (typeof window !== 'undefined' ? window.location.origin : '');

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: origin,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${origin}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${origin}/products/${product.sku || product.handle}`,
      },
    ],
  };
}

/**
 * Generates Open Graph meta tags.
 *
 * @param product - Product data
 * @param options - SEO configuration
 * @returns Object with Open Graph meta tags
 */
export function getOpenGraphTags(
  product: ProductSeoData,
  options: SeoOptions = {}
): Record<string, string> {
  const {
    origin = typeof window !== 'undefined' ? window.location.origin : '',
    siteName = 'EcoMafola Peace',
  } = options;

  const description = stripHtml(product.description);
  const productUrl = `${origin}/products/${product.handle}`;

  return {
    // Basic Open Graph
    'og:type': 'product',
    'og:site_name': siteName,
    'og:locale': 'en_US',
    'og:title': `${product.name} | ${siteName}`,
    'og:description': description || `Handcrafted ${product.name} from Samoa`,
    'og:image': product.images[0] || '',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': `${product.name} - Handcrafted from Samoa`,
    'og:url': productUrl,

    // Product-specific tags
    'product:price:amount': product.price.toString(),
    'product:price:currency': product.currency || 'USD',
    'product:availability': product.stock > 0 ? 'instock' : 'outofstock',
    'product:brand': product.brand || siteName,
    'product:category': product.category || 'Home & Kitchen > Kitchen & Dining > Tableware',
    'product:condition': 'new',
  };
}

/**
 * Generates Twitter Card meta tags.
 *
 * @param product - Product data
 * @param options - SEO configuration
 * @returns Object with Twitter Card meta tags
 */
export function getTwitterCardTags(
  product: ProductSeoData,
  options: SeoOptions = {}
): Record<string, string> {
  const {
    twitterHandle = '@ecomafola',
    origin = typeof window !== 'undefined' ? window.location.origin : '',
  } = options;

  const description = stripHtml(product.description);

  return {
    'twitter:card': 'summary_large_image',
    'twitter:site': twitterHandle,
    'twitter:creator': twitterHandle,
    'twitter:title': `${product.name} | EcoMafola Peace`,
    'twitter:description': description || `Handcrafted ${product.name} from Samoa`,
    'twitter:image': product.images[0] || '',
    'twitter:image:alt': `${product.name} - Handcrafted from Samoa`,
    'twitter:label1': 'Price',
    'twitter:data1': `$${product.price}`,
    'twitter:label2': 'Availability',
    'twitter:data2': product.stock > 0 ? 'In Stock' : 'Out of Stock',
  };
}

/**
 * Strips HTML tags from a string.
 *
 * @param html - HTML string
 * @returns Plain text
 */
function stripHtml(html: string): string {
  if (typeof window !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  // SSR fallback
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Unified SEO Component for Product Pages
 *
 * Renders all necessary SEO meta tags including:
 * - Open Graph tags for social sharing
 * - Twitter Card tags
 * - JSON-LD structured data for search engines
 *
 * @param product - Product data for SEO generation
 * @param options - Optional SEO configuration
 *
 * @example
 * // Basic usage
 * <ProductSeo product={productData} />
 *
 * @example
 * // With reviews and custom options
 * <ProductSeo
 *   product={productData}
 *   options={{
 *     reviews: productReviews,
 *     shippingCost: 0,
 *     deliveryTime: { min: 5, max: 10 }
 *   }}
 * />
 */
export default function ProductSeo({
  product,
  options = {},
}: {
  product: ProductSeoData;
  options?: SeoOptions;
}): JSX.Element {
  const openGraphTags = getOpenGraphTags(product, options);
  const twitterTags = getTwitterCardTags(product, options);
  const productSchema = getProductSchema(product, options);
  const breadcrumbSchema = getBreadcrumbSchema(product, options);

  return (
    <Helmet>
      {/* Open Graph Tags */}
      {Object.entries(openGraphTags).map(([key, value]) => (
        <meta key={key} property={key} content={value} />
      ))}

      {/* Twitter Card Tags */}
      {Object.entries(twitterTags).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  );
}

/**
 * Page-level SEO configuration for non-product pages.
 *
 * @param options - Page SEO options
 *
 * @example
 * <Helmet>
 *   <title>{getPageTitle('About Us')}</title>
 *   <meta name="description" content={getPageDescription('about')} />
 * </Helmet>
 */
export function getPageTitle(
  pageName: string,
  options: { siteName?: string; separator?: string } = {}
): string {
  const { siteName = 'EcoMafola Peace', separator = '|' } = options;
  return `${pageName} ${separator} ${siteName}`;
}

/**
 * Default meta descriptions for common pages.
 */
export const PAGE_DESCRIPTIONS: Record<string, string> = {
  home: 'Discover handcrafted Pacific treasures from Samoa. EcoMafola Peace offers authentic, eco-friendly products that support traditional artisans and sustainable livelihoods.',
  products:
    'Browse our collection of handcrafted Pacific products. Each item is made with natural materials by skilled Samoan artisans using traditional techniques.',
  about:
    'Learn about EcoMafola Peace mission to empower Samoan artisans through fair trade. We preserve cultural heritage while supporting sustainable livelihoods in the Pacific.',
  contact:
    'Get in touch with EcoMafola Peace. We are here to answer your questions about our handcrafted products, shipping, or partnership opportunities.',
};

/**
 * Generates default page description.
 *
 * @param pageKey - Page identifier key
 * @param fallback - Fallback description if key not found
 * @returns Page description string
 */
export function getPageDescription(
  pageKey: string,
  fallback: string = PAGE_DESCRIPTIONS.home
): string {
  return PAGE_DESCRIPTIONS[pageKey] || fallback;
}
