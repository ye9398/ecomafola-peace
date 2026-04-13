/**
 * Analytics Configuration for EcoMafola Peace
 *
 * Google Analytics 4 (GA4) integration with enhanced e-commerce tracking
 * Vercel Analytics for Real User Monitoring (RUM)
 * Search Console configuration
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer?: any[]
  }
}

/**
 * Analytics Configuration
 */
export const ANALYTICS_CONFIG = {
  ga4: {
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-48S7HL321X',
    trackingId: import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-48S7HL321X',
  },
  googleAds: {
    conversionId: 'AW-XXXXXXXXXXX', // TODO: Replace with actual Google Ads Conversion ID
  },
  searchConsole: {
    propertyUrl: 'https://ecomafola.com',
    verificationFile: '/googleXXXXXXXXXXXXXXXXXXXXX.html', // TODO: Add verification file
  },
  vercelAnalytics: {
    enabled: true,
    endpoint: '/_vercel/insight',
  },
}

/**
 * GA4 Event Names
 */
export enum GA4EventNames {
  // E-commerce events
  VIEW_ITEM = 'view_item',
  ADD_TO_CART = 'add_to_cart',
  BEGIN_CHECKOUT = 'begin_checkout',
  ADD_PAYMENT_INFO = 'add_payment_info',
  PURCHASE = 'purchase',
  REFUND = 'refund',
  SEARCH = 'search',
  SELECT_ITEM = 'select_item',
  VIEW_ITEM_LIST = 'view_item_list',

  // Engagement events
  PAGE_VIEW = 'page_view',
  SCROLL = 'scroll',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  VIDEO_START = 'video_start',
  VIDEO_COMPLETE = 'video_complete',

  // Custom events
  NEWSLETTER_SIGNUP = 'newsletter_signup',
  CONTACT_FORM = 'contact_form',
  BLOG_POST_VIEW = 'blog_post_view',
  PRODUCT_FILTER = 'product_filter',
  SORT_PRODUCTS = 'sort_products',
  WISHLIST_ADD = 'wishlist_add',
  EXIT_INTENT = 'exit_intent',
}

/**
 * Initialize GA4
 */
export function initGA4() {
  if (typeof window === 'undefined') return

  // Load GA4 script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4.trackingId}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer?.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', ANALYTICS_CONFIG.ga4.trackingId, {
    send_page_view: true,
    enhanced_ecommerce: true,
  })
}

/**
 * Track GA4 Event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', eventName, eventParams)
}

/**
 * Track E-commerce Item View
 */
export function trackProductView(product: {
  id: string
  name: string
  price: number
  category?: string
  brand?: string
  variant?: string
  quantity?: number
}) {
  trackEvent(GA4EventNames.VIEW_ITEM, {
    currency: 'USD',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand,
        item_variant: product.variant,
        price: product.price,
        quantity: product.quantity || 1,
      },
    ],
  })
}

/**
 * Track Add to Cart
 */
export function trackAddToCart(product: {
  id: string
  name: string
  price: number
  category?: string
  brand?: string
  variant?: string
  quantity?: number
}) {
  trackEvent(GA4EventNames.ADD_TO_CART, {
    currency: 'USD',
    value: product.price * (product.quantity || 1),
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand,
        item_variant: product.variant,
        price: product.price,
        quantity: product.quantity || 1,
      },
    ],
  })
}

/**
 * Track Purchase
 */
export function trackPurchase(order: {
  orderId: string
  total: number
  tax?: number
  shipping?: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    category?: string
  }>
}) {
  trackEvent(GA4EventNames.PURCHASE, {
    transaction_id: order.orderId,
    value: order.total,
    tax: order.tax,
    shipping: order.shipping,
    currency: 'USD',
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
  })
}

/**
 * Track Search
 */
export function trackSearch(searchTerm: string, resultsCount?: number) {
  trackEvent(GA4EventNames.SEARCH, {
    search_term: searchTerm,
    results_count: resultsCount,
  })
}

/**
 * Track Form Submission
 */
export function trackFormSubmit(formName: string, formId?: string) {
  trackEvent(GA4EventNames.FORM_SUBMIT, {
    form_name: formName,
    form_id: formId,
  })
}

/**
 * Vercel Analytics Integration
 */
export function initVercelAnalytics() {
  if (!ANALYTICS_CONFIG.vercelAnalytics.enabled) return

  if (typeof window === 'undefined') return

  // Vercel Analytics script
  const script = document.createElement('script')
  script.src = 'https://cdn.vercel-insights.com/v1/script.js'
  script.defer = true
  document.head.appendChild(script)
}

import type { Metric } from 'web-vitals'

/**
 * Send Web Vitals to analytics endpoint
 */
export function sendToAnalytics(metric: Metric) {
  const body = {
    dsn: ANALYTICS_CONFIG.ga4.trackingId,
    id: metric.id,
    name: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    delta: metric.delta,
  }

  // Send to analytics endpoint
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', JSON.stringify(body))
  }

  // Log in development
  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', metric.name, metric.value)
  }
}

/**
 * Report Web Vitals - wraps the web-vitals library functions
 */
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  if (typeof window === 'undefined') return

  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry)
      onFCP(onPerfEntry)
      onINP(onPerfEntry)
      onLCP(onPerfEntry)
      onTTFB(onPerfEntry)
    })
  }
}

/**
 * Search Console Utilities
 */
export const SearchConsole = {
  /**
   * Submit URL for indexing via Indexing API
   * Note: Requires server-side implementation
   */
  submitForIndexing: async (url: string) => {
    // Server-side endpoint: POST /api/search-console/index
    const response = await fetch('/api/search-console/index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    return response.json()
  },

  /**
   * Request URL inspection
   */
  requestInspection: async (url: string) => {
    const response = await fetch('/api/search-console/inspect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    return response.json()
  },
}

/**
 * Weekly SEO Monitoring Checklist
 */
export const WEEKLY_CHECKLIST = [
  'Check Google Search Console for crawl errors',
  'Review Core Web Vitals in PageSpeed Insights',
  'Monitor GA4 traffic and conversion rates',
  'Check for broken links (404 errors)',
  'Review AI Overview visibility for target keywords',
  'Verify sitemap.xml is up to date',
  'Check robots.txt for accidental blocks',
]

/**
 * Monthly SEO Monitoring Checklist
 */
export const MONTHLY_CHECKLIST = [
  'Full SEO audit using SEO Machine or claude-seo',
  'Keyword ranking analysis for primary keywords',
  'Backlink profile review',
  'Content gap analysis vs competitors',
  'Update GEO definition blocks based on AI search trends',
  'Review and refresh FAQ content',
  'Check schema markup validity with Rich Results Test',
  'Analyze page speed trends and optimize slow pages',
  'Review and update meta descriptions for low CTR pages',
  'Monitor AI citation rate for brand keywords',
]

/**
 * SEO Health Score Targets
 */
export const SEO_TARGETS = {
  technical: {
    coreWebVitals: '90+', // Percentage of URLs passing CWV
    crawlability: '100%', // Percentage of pages crawlable
    indexability: '100%', // Percentage of important pages indexed
    mobileFriendly: '100%',
    https: '100%',
    securityHeaders: 'A+',
  },
  content: {
    keywordOptimization: '95%+', // Percentage of pages with target keywords
    contentQuality: '90%+', // E-E-A-T score
    internalLinking: '100%', // Percentage of pages with internal links
    imageOptimization: '95%+', // Percentage of images with alt text
  },
  geo: {
    aiOverviewVisibility: '80%+', // Percentage of target queries with AI Overview presence
    citationRate: '50%+', // Percentage of AI Overviews citing our content
    definitionBlockCoverage: '100%', // Percentage of product categories with definition blocks
  },
}

/**
 * Calculate SEO Health Score
 */
export function calculateSEOScore(metrics: {
  coreWebVitalsPass: number
  indexedPages: number
  crawlErrors: number
  aiOverviewPresence: number
  schemaValid: number
}): number {
  const weights = {
    coreWebVitals: 0.3,
    indexability: 0.25,
    crawlability: 0.2,
    geo: 0.15,
    schema: 0.1,
  }

  const scores = {
    coreWebVitals: metrics.coreWebVitalsPass / 100,
    indexability: Math.min(1, metrics.indexedPages / Math.max(1, metrics.indexedPages)),
    crawlability: Math.max(0, 1 - metrics.crawlErrors / 10),
    geo: metrics.aiOverviewPresence / 100,
    schema: metrics.schemaValid / 100,
  }

  const weightedScore =
    scores.coreWebVitals * weights.coreWebVitals +
    scores.indexability * weights.indexability +
    scores.crawlability * weights.crawlability +
    scores.geo * weights.geo +
    scores.schema * weights.schema

  return Math.round(weightedScore * 100)
}
