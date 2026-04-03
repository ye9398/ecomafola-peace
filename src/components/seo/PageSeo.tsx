/**
 * PageSeo Component
 *
 * Unified SEO component for non-product pages using react-helmet-async.
 * Generates Open Graph, Twitter Card, and basic meta tags.
 *
 * @example
 * // Home page
 * <PageSeo
 *   title="Home"
 *   description="Discover handcrafted Pacific treasures"
 *   image="/og-home.jpg"
 *   canonical="/"
 * />
 *
 * @example
 * // About page
 * <PageSeo
 *   title="About Us"
 *   description="Learn about our mission"
 *   type="website"
 * />
 */

import { Helmet } from 'react-helmet-async';

export interface PageSeoProps {
  /** Page title (without site name suffix) */
  title: string;
  /** Meta description */
  description: string;
  /** OG/Twitter image URL */
  image?: string;
  /** Page type: 'website' | 'article' | 'profile' */
  type?: 'website' | 'article' | 'profile';
  /** Canonical URL (absolute or relative) */
  canonical?: string;
  /** Additional keywords */
  keywords?: string[];
  /** Override site name */
  siteName?: string;
  /** Twitter handle */
  twitterHandle?: string;
  /** Additional custom meta tags */
  extra?: Array<{ name?: string; property?: string; content: string }>;
}

/**
 * Default SEO configuration.
 */
const DEFAULT_SEO = {
  type: 'website' as const,
  siteName: 'EcoMafola Peace',
  twitterHandle: '@ecomafola',
};

/**
 * Generates Open Graph meta tags for pages.
 * @export for testing
 */
export function getOpenGraphTags(props: PageSeoProps): Record<string, string> {
  const {
    title,
    description,
    image,
    type = DEFAULT_SEO.type,
    siteName = DEFAULT_SEO.siteName,
  } = props;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = props.canonical?.startsWith('http')
    ? props.canonical
    : `${origin}${props.canonical || '/'}`;

  return {
    'og:type': type,
    'og:site_name': siteName,
    'og:locale': 'en_US',
    'og:title': `${title} | ${siteName}`,
    'og:description': description,
    'og:image': image || `${origin}/og-default.jpg`,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:url': productUrl,
  };
}

/**
 * Generates Twitter Card meta tags for pages.
 * @export for testing
 */
export function getTwitterCardTags(props: PageSeoProps): Record<string, string> {
  const {
    title,
    description,
    image,
    twitterHandle = DEFAULT_SEO.twitterHandle,
  } = props;

  return {
    'twitter:card': 'summary_large_image',
    'twitter:site': twitterHandle,
    'twitter:creator': twitterHandle,
    'twitter:title': `${title} | ${DEFAULT_SEO.siteName}`,
    'twitter:description': description,
    'twitter:image': image || `${DEFAULT_SEO.siteName}/og-default.jpg`,
  };
}

/**
 * PageSeo Component
 */
export default function PageSeo({
  title,
  description,
  image,
  type = 'website',
  canonical,
  keywords = [],
  siteName = DEFAULT_SEO.siteName,
  twitterHandle = DEFAULT_SEO.twitterHandle,
  extra = [],
}: PageSeoProps): JSX.Element {
  const openGraphTags = getOpenGraphTags({
    title,
    description,
    image,
    type,
    siteName,
    canonical,
  });

  const twitterTags = getTwitterCardTags({
    title,
    description,
    image,
    twitterHandle,
  });

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl = canonical?.startsWith('http')
    ? canonical
    : `${origin}${canonical || '/'}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{`${title} | ${siteName}`}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      {Object.entries(openGraphTags).map(([key, value]) => (
        <meta key={key} property={key} content={value} />
      ))}

      {/* Twitter Card Tags */}
      {Object.entries(twitterTags).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}

      {/* Extra Custom Meta Tags */}
      {extra.map((tag, index) => (
        <meta
          key={index}
          {...(tag.name ? { name: tag.name } : { property: tag.property })}
          content={tag.content}
        />
      ))}
    </Helmet>
  );
}

/**
 * Pre-defined SEO configurations for common pages.
 */
export const PAGE_SEO = {
  home: {
    title: 'Handcrafted Pacific Treasures',
    description:
      'Discover handcrafted Pacific treasures from Samoa. EcoMafola Peace offers authentic, eco-friendly products that support traditional artisans.',
    canonical: '/',
  },
  products: {
    title: 'Our Products',
    description:
      'Browse our collection of handcrafted Pacific products. Each item is made with natural materials by skilled Samoan artisans.',
    canonical: '/products',
  },
  about: {
    title: 'About Us',
    description:
      'Learn about EcoMafola Peace mission to empower Samoan artisans through fair trade and preserve cultural heritage.',
    canonical: '/about',
  },
  contact: {
    title: 'Contact Us',
    description:
      'Get in touch with EcoMafola Peace. We are here to answer your questions about our products and shipping.',
    canonical: '/contact',
  },
  account: {
    title: 'My Account',
    description: 'Manage your account and orders.',
    canonical: '/account',
  },
  login: {
    title: 'Sign In',
    description: 'Sign in to your EcoMafola Peace account.',
    canonical: '/login',
  },
  checkout: {
    title: 'Checkout',
    description: 'Complete your purchase securely.',
    canonical: '/checkout',
    type: 'website' as const,
  },
} as const;
