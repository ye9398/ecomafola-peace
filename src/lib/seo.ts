/**
 * SEO Configuration for EcoMafola Peace
 *
 * Centralized SEO metadata for all pages.
 * Used for server-side rendering and dynamic meta generation.
 */

export interface PageSEO {
  title: string
  description: string
  canonical: string
  keywords?: string[]
  ogImage?: string
}

const BASE_URL = 'https://ecomafola.com'
const DEFAULT_IMAGE = '/og-default.jpg'

/**
 * SEO configurations for all pages
 */
export const PAGE_SEO: Record<string, PageSEO> = {
  home: {
    title: 'EcoMafola Peace | Handcrafted Pacific Treasures from Samoa',
    description: 'Discover authentic Samoan handcrafted products. Coconut bowls, woven baskets, beach bags & more. Fair trade, sustainable, eco-friendly. Worldwide shipping.',
    canonical: '/',
    keywords: ['Samoan crafts', 'Pacific Islands art', 'handcrafted products', 'eco-friendly decor', 'fair trade', 'sustainable gifts'],
    ogImage: '/og-home.jpg',
  },
  products: {
    title: 'All Products | Samoan Handcrafted Goods',
    description: 'Browse our complete collection of Samoan handcrafted products. Coconut bowls, woven baskets, beach bags, home decor & jewelry.',
    canonical: '/products',
    keywords: ['Samoan products', 'handcrafted goods', 'coconut bowls', 'woven baskets', 'Pacific art'],
    ogImage: '/og-products.jpg',
  },
  blog: {
    title: 'The Pacific Soul Blog | Samoan Craftsmanship & Culture',
    description: 'Discover stories behind South Pacific craftsmanship, sustainable living tips, and island heritage from EcoMafola Peace.',
    canonical: '/blog',
    keywords: ['Pacific culture', 'Samoan traditions', 'sustainable living', 'handmade crafts', 'island heritage'],
    ogImage: '/og-blog.jpg',
  },
  ourStory: {
    title: 'Our Story | EcoMafola Peace - Supporting Samoan Artisans',
    description: 'Learn about our mission to preserve traditional Samoan craftsmanship while supporting 240+ artisan families across the Pacific.',
    canonical: '/our-story',
    keywords: ['about EcoMafola', 'Samoan artisans', 'fair trade story', 'Pacific heritage', 'traditional crafts'],
    ogImage: '/og-story.jpg',
  },
  impact: {
    title: 'Our Impact | Environmental & Social Responsibility',
    description: 'See how EcoMafola Peace is making a difference through fair trade, environmental sustainability, and community support.',
    canonical: '/impact',
    keywords: ['social impact', 'environmental responsibility', 'fair trade impact', 'sustainable business'],
    ogImage: '/og-impact.jpg',
  },
  contact: {
    title: 'Contact Us | EcoMafola Peace',
    description: 'Get in touch with EcoMafola Peace. Questions about products, shipping, or custom orders? We are here to help.',
    canonical: '/contact',
    keywords: ['contact', 'customer service', 'support'],
    ogImage: '/og-contact.jpg',
  },
  trackOrder: {
    title: 'Track Your Order | EcoMafola Peace',
    description: 'Track your EcoMafola Peace order status. Real-time updates on your handcrafted products shipment.',
    canonical: '/track',
    keywords: ['order tracking', 'shipment status', 'delivery tracking'],
  },
  privacyPolicy: {
    title: 'Privacy Policy | EcoMafola Peace',
    description: 'Read EcoMafola Peace privacy policy. Learn how we protect your personal information and respect your privacy.',
    canonical: '/privacy-policy',
  },
  account: {
    title: 'My Account | EcoMafola Peace',
    description: 'Manage your EcoMafola Peace account. View orders, update profile, and track your handcrafted treasures.',
    canonical: '/account',
  },
  login: {
    title: 'Sign In | EcoMafola Peace',
    description: 'Sign in to your EcoMafola Peace account to manage orders and access exclusive offers.',
    canonical: '/login',
  },
  checkout: {
    title: 'Checkout | EcoMafola Peace',
    description: 'Complete your purchase of authentic Samoan handcrafted products. Secure checkout with worldwide shipping.',
    canonical: '/checkout',
  },
}

/**
 * Generate Product Page SEO
 */
export function getProductSEO(product: {
  handle: string
  name: string
  description: string
  price?: number
  image?: string
}): PageSEO {
  const handle = product.handle
  const name = product.name || 'Handcrafted Product'
  const priceStr = product.price ? ` | $${product.price.toFixed(2)}` : ''

  return {
    title: `${name}${priceStr} | EcoMafola Peace`,
    description: product.description?.substring(0, 160) || `Handcrafted ${name} from Samoa. Authentic, sustainable, fair trade.` || 'Authentic Samoan handcrafted product.',
    canonical: `/product/${handle}`,
    keywords: [`${name} Samoa`, 'handcrafted', 'eco-friendly', 'fair trade', 'Samoan artisan'],
    ogImage: product.image || DEFAULT_IMAGE,
  }
}

/**
 * Generate Blog Post SEO
 */
export function getBlogPostSEO(post: {
  id: string
  title: string
  excerpt: string
  image?: string
}): PageSEO {
  return {
    title: `${post.title} | The Pacific Soul Blog`,
    description: post.excerpt?.substring(0, 160) || 'Read more on The Pacific Soul Blog by EcoMafola Peace.',
    canonical: `/blog/${post.id}`,
    keywords: ['Pacific culture', 'Samoan traditions', 'handcrafted stories'],
    ogImage: post.image || DEFAULT_IMAGE,
  }
}

/**
 * Generate Collection SEO
 */
export function getCollectionSEO(collection: {
  handle: string
  name: string
  description?: string
}): PageSEO {
  const name = collection.name || 'Collection'

  return {
    title: `${name} | Samoan Handcrafted Products`,
    description: collection.description?.substring(0, 160) || `Browse our collection of ${name.toLowerCase()}. Authentic Samoan handcrafted products.`,
    canonical: `/products/category/${collection.handle}`,
    keywords: [`${name} Samoa`, 'handcrafted', 'Pacific art', 'eco-friendly'],
    ogImage: DEFAULT_IMAGE,
  }
}

/**
 * Generate JSON-LD Schema for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EcoMafola Peace',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://www.facebook.com/ecomafola',
      'https://www.instagram.com/ecomafola',
      'https://twitter.com/ecomafola',
    ],
    description: 'Authentic handcrafted Pacific treasures from Samoa. Supporting traditional artisans through fair trade.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Apia',
      addressCountry: 'WS',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'hello@ecomafola-peace.com',
    },
  }
}

/**
 * Generate JSON-LD Schema for WebSite
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EcoMafola Peace',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    } as any,
  }
}
