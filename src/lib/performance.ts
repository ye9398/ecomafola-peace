/**
 * Core Web Vitals Utilities for EcoMafola Peace
 *
 * Performance monitoring and optimization helpers
 */

import type { Metric } from 'web-vitals'

/**
 * Report Web Vitals to analytics provider
 */
export function reportWebVitals(metric: Metric) {
  // Send to Vercel Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value)
  }
}

/**
 * Performance thresholds (Google recommendations)
 */
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // milliseconds
  INP: { good: 200, needsImprovement: 500 }, // milliseconds
  CLS: { good: 0.1, needsImprovement: 0.25 }, // score
  FCP: { good: 1800, needsImprovement: 3000 }, // milliseconds
  TTFB: { good: 800, needsImprovement: 1800 }, // milliseconds
}

/**
 * Get performance score based on thresholds
 */
export function getPerformanceScore(metric: string, value: number): 'good' | 'needsImprovement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS]
  if (!thresholds) return 'good'

  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.needsImprovement) return 'needsImprovement'
  return 'poor'
}

/**
 * Preload critical resources
 */
export function preloadResources() {
  // Preload hero image
  const heroImage = document.createElement('link')
  heroImage.rel = 'preload'
  heroImage.as = 'image'
  heroImage.href = '/images/banner-main.jpg'
  document.head.appendChild(heroImage)

  // Preload critical fonts
  const fontLinks = [
    { href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap', as: 'style' },
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', as: 'style' },
  ]

  fontLinks.forEach(({ href, as }) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = as
    link.href = href
    if (as === 'style') link.rel = 'stylesheet'
    document.head.appendChild(link)
  })
}

/**
 * Lazy load non-critical resources
 */
export function lazyLoadImages() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const images = document.querySelectorAll('img[loading="lazy"]')
    images.forEach(img => {
      img.loading = 'lazy'
    })
  } else {
    // Fallback for browsers without native support
    import('lazysizes').then(() => {
      const images = document.querySelectorAll('img.lazyload')
      images.forEach(img => {
        img.classList.add('lazyload')
      })
    })
  }
}

/**
 * Optimize third-party scripts
 */
export function loadThirdPartyScript(src: string, async = true) {
  const script = document.createElement('script')
  script.src = src
  if (async) script.async = true
  script.defer = true
  document.body.appendChild(script)
  return script
}

/**
 * Generate performance report
 */
export interface PerformanceReport {
  LCP?: number
  INP?: number
  CLS?: number
  FCP?: number
  TTFB?: number
  overallScore: number
  recommendations: string[]
}

export function generatePerformanceReport(metrics: Partial<PerformanceReport>): PerformanceReport {
  const recommendations: string[] = []

  // Calculate individual scores
  const scores = {
    LCP: metrics.LCP ? getScoreForValue(metrics.LCP, PERFORMANCE_THRESHOLDS.LCP) : 1,
    INP: metrics.INP ? getScoreForValue(metrics.INP, PERFORMANCE_THRESHOLDS.INP) : 1,
    CLS: metrics.CLS ? getScoreForValue(metrics.CLS, PERFORMANCE_THRESHOLDS.CLS) : 1,
    FCP: metrics.FCP ? getScoreForValue(metrics.FCP, PERFORMANCE_THRESHOLDS.FCP) : 1,
    TTFB: metrics.TTFB ? getScoreForValue(metrics.TTFB, PERFORMANCE_THRESHOLDS.TTFB) : 1,
  }

  // Calculate overall score (weighted average)
  const weights = { LCP: 0.25, INP: 0.25, CLS: 0.25, FCP: 0.15, TTFB: 0.1 }
  const overallScore = Object.entries(scores).reduce(
    (sum, [key, score]) => sum + score * (weights[key as keyof typeof weights] || 0),
    0
  )

  // Generate recommendations
  if (metrics.LCP && metrics.LCP > 2500) {
    recommendations.push('Optimize Largest Contentful Paint: Preload hero image, reduce server response time')
  }
  if (metrics.INP && metrics.INP > 200) {
    recommendations.push('Improve Interaction to Next Paint: Reduce JavaScript execution time, optimize event handlers')
  }
  if (metrics.CLS && metrics.CLS > 0.1) {
    recommendations.push('Reduce Cumulative Layout Shift: Set explicit dimensions for images and ads')
  }
  if (metrics.FCP && metrics.FCP > 1800) {
    recommendations.push('Improve First Contentful Paint: Eliminate render-blocking resources, reduce CSS size')
  }
  if (metrics.TTFB && metrics.TTFB > 800) {
    recommendations.push('Reduce Time to First Byte: Enable caching, optimize server configuration')
  }

  return {
    ...metrics,
    overallScore: Math.round(overallScore * 100),
    recommendations,
  }
}

function getScoreForValue(value: number, thresholds: { good: number; needsImprovement: number }): number {
  if (value <= thresholds.good) return 1
  if (value <= thresholds.needsImprovement) return 0.7
  return 0.4
}
