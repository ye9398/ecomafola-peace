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
import { BRAND_INFO, SEO_CONFIG } from '../../lib/seo-config';

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
  /** Prevent search engine indexing (for private pages) */
  noindex?: boolean;
}

/**
 * Default SEO configuration — delegates to centralized BRAND_INFO.
 */
const DEFAULT_SEO = {
  type: 'website' as const,
  siteName: BRAND_INFO.siteName,
  twitterHandle: '@ecomafola',
  baseUrl: SEO_CONFIG.baseUrl,
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
    'twitter:image': image || `${DEFAULT_SEO.baseUrl}/og-default.jpg`,
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
  noindex = false,
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

      {/* Search Engine Indexing */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

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

// PAGE_SEO page configurations have been consolidated into src/lib/seo.ts.
// Import from there for page-specific SEO data.
