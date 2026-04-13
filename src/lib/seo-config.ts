/**
 * SEO Configuration - Centralized Constants
 *
 * All SEO-related constants live here to prevent duplication across
 * generate-ssg-routes.mjs, vite.config.ts, llms.txt, and component files.
 */

// ---------------------------------------------------------------------------
// Site Configuration
// ---------------------------------------------------------------------------

export const SEO_CONFIG = {
  baseUrl: 'https://ecomafola.com',
  defaultOgImage: '/images/banner-main.jpg',
  productCount: 9,
} as const;

// ---------------------------------------------------------------------------
// Brand Information
// ---------------------------------------------------------------------------

export const BRAND_INFO = {
  siteName: 'EcoMafola Peace',
  contactEmail: 'hello@ecomafola.com',
  foundingYear: 2019,
  headquarters: {
    locality: 'Apia',
    country: 'Samoa',
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61586686574243',
    instagram: 'https://www.instagram.com/ecomafola_official/',
    pinterest: 'https://www.pinterest.com/ecomafola/',
    tiktok: 'https://www.tiktok.com/@ecomafola',
  },
  impact: {
    artisans: 240,
    paidToArtisans: '$2.4M',
    cooperatives: 18,
    ecoSourcedPercent: 94,
  },
} as const;

// ---------------------------------------------------------------------------
// Product Data
// ---------------------------------------------------------------------------

interface ProductData {
  title: string;
  handle: string;
  description: string;
  price: number;
  currency: string;
  countryOfOrigin: string;
  images: string[];
  craftsmanship?: string;
}

export const PRODUCTS: Record<string, ProductData> = {
  'samoan-handcrafted-coconut-bowl': {
    title: 'Samoan Handcrafted Coconut Bowl',
    handle: 'samoan-handcrafted-coconut-bowl',
    description:
      'Hand-carved from fallen coconut shells, polished with virgin coconut oil. Each bowl is unique with natural patterns.',
    price: 29.99,
    currency: 'USD',
    countryOfOrigin: 'Samoa',
    images: ['https://ecomafola.com/images/coconut-bowl.jpg'],
    craftsmanship: 'Hand-carved from fallen coconut shells',
  },
  'samoan-handwoven-grass-tote-bag': {
    title: 'Samoan Handwoven Grass Tote Bag',
    handle: 'samoan-handwoven-grass-tote-bag',
    description:
      'Traditional pandanus weaving, eco-friendly shopping bag. Made by skilled artisans in Samoa.',
    price: 34.99,
    currency: 'USD',
    countryOfOrigin: 'Samoa',
    images: ['https://ecomafola.com/images/grass-tote.jpg'],
    craftsmanship: 'Traditional pandanus leaf weaving',
  },
  'samoan-handcrafted-shell-necklace': {
    title: 'Samoan Handcrafted Shell Necklace',
    handle: 'samoan-handcrafted-shell-necklace',
    description:
      'Naturally collected shells, traditional Pacific jewelry. Each piece tells a story of the ocean.',
    price: 24.99,
    currency: 'USD',
    countryOfOrigin: 'Samoa',
    images: ['https://ecomafola.com/images/shell-necklace.jpg'],
    craftsmanship: 'Naturally collected Pacific shells',
  },
  'samoan-woven-basket': {
    title: 'Samoan Woven Basket',
    handle: 'samoan-woven-basket',
    description:
      'Multi-purpose storage, traditional Samoan weaving. Perfect for home organization or as a decorative piece.',
    price: 39.99,
    currency: 'USD',
    countryOfOrigin: 'Samoa',
    images: ['https://ecomafola.com/images/woven-basket.jpg'],
    craftsmanship: 'Traditional Samoan weaving technique',
  },
  'natural-coconut-soap': {
    title: 'Natural Coconut Soap',
    handle: 'natural-coconut-soap',
    description:
      'Made from pure coconut oil, gentle on skin. Traditional recipe passed down through generations.',
    price: 12.99,
    currency: 'USD',
    countryOfOrigin: 'Samoa',
    images: ['https://ecomafola.com/images/coconut-soap.jpg'],
    craftsmanship: 'Traditional cold-process soap making',
  },
  'tapa-cloth-wall-art': {
    title: 'Tapa Cloth Wall Art',
    handle: 'tapa-cloth-wall-art',
    description:
      'Traditional Pacific bark cloth, hand-painted with cultural motifs. Authentic island art for your home.',
    price: 89.99,
    currency: 'USD',
    countryOfOrigin: 'Samoa',
    images: ['https://ecomafola.com/images/tapa-cloth.jpg'],
    craftsmanship: 'Hand-painted on traditional bark cloth',
  },
  'samoan-handcrafted-natural-shell-coasters': {
    title: 'Samoan Handcrafted Natural Shell Coasters',
    handle: 'samoan-handcrafted-natural-shell-coasters',
    description:
      'Set of 6 decorative shell coasters. Each coaster showcases natural ocean beauty.',
    price: 27.99,
    currency: 'USD',
    countryOfOrigin: 'Samoa',
    images: ['https://ecomafola.com/images/shell-coasters.jpg'],
    craftsmanship: 'Hand-selected natural shells',
  },
  'handwoven-papua-new-guinea-beach-bag': {
    title: 'Handwoven Papua New Guinea Beach Bag',
    handle: 'handwoven-papua-new-guinea-beach-bag',
    description:
      'PNG artisan made, sustainable beach accessory. Spacious and durable for all your adventures.',
    price: 34.99,
    currency: 'USD',
    countryOfOrigin: 'Papua New Guinea',
    images: ['https://ecomafola.com/images/beach-bag.jpg'],
    craftsmanship: 'PNG artisan handwoven fibers',
  },
  'natural-coir-handwoven-coconut-palm-doormat': {
    title: 'Natural Coir Handwoven Coconut Palm Doormat',
    handle: 'natural-coir-handwoven-coconut-palm-doormat',
    description:
      'Natural coconut fiber, durable entrance mat. Welcome guests with island style.',
    price: 34.99,
    currency: 'USD',
    countryOfOrigin: 'Samoa',
    images: ['https://ecomafola.com/images/doormat.jpg'],
    craftsmanship: 'Natural coconut coir fiber weaving',
  },
};

// ---------------------------------------------------------------------------
// Product Schema Generator
// ---------------------------------------------------------------------------

interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string[];
  offers: {
    '@type': string;
    price: number;
    priceCurrency: string;
    availability: string;
  };
  countryOfOrigin: string;
  additionalProperty?: Array<{ '@type': string; name: string; value: string }>;
}

export function generateProductSchema(
  product: ProductData,
  handle: string
): ProductSchema {
  const schema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: [...product.images],
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
    },
    countryOfOrigin: product.countryOfOrigin,
  };

  if (product.craftsmanship) {
    schema.additionalProperty = [
      {
        '@type': 'PropertyValue',
        name: 'Craftsmanship',
        value: product.craftsmanship,
      },
    ];
  }

  return schema;
}

// ---------------------------------------------------------------------------
// Utility: Smart Description Truncation
// ---------------------------------------------------------------------------

export function smartTruncate(text: string, max: number): string {
  if (text.length <= max) {
    return text;
  }

  // Try to truncate at sentence boundary first
  const sentenceEnd = text.lastIndexOf('.', max);
  if (sentenceEnd > max * 0.5) {
    return text.slice(0, sentenceEnd + 1);
  }

  // Fall back to word boundary
  const wordEnd = text.lastIndexOf(' ', max);
  if (wordEnd > 0) {
    return text.slice(0, wordEnd);
  }

  // Last resort: hard cut
  return text.slice(0, max);
}
