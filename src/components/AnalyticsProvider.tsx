/**
 * GA4 Analytics Provider
 *
 * Initializes Google Analytics 4 and Vercel Analytics
 * Wrap this around your App component
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initGA4, initVercelAnalytics, reportWebVitals, sendToAnalytics } from '../lib/analytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
  ga4MeasurementId?: string
}

export function AnalyticsProvider({ children, ga4MeasurementId }: AnalyticsProviderProps) {
  const location = useLocation()

  useEffect(() => {
    // Initialize GA4 if Measurement ID is provided
    if (ga4MeasurementId && ga4MeasurementId !== 'G-XXXXXXXXXX') {
      // Set tracking ID before init
      const config = {
        ga4: {
          measurementId: ga4MeasurementId,
          trackingId: ga4MeasurementId,
        }
      }
      // Store in window for access by analytics lib
      ;(window as any).GA4_MEASUREMENT_ID = ga4MeasurementId
      initGA4()
    }

    // Initialize Vercel Analytics
    initVercelAnalytics()

    // Register Web Vitals monitoring
    reportWebVitals(sendToAnalytics)
  }, [ga4MeasurementId])

  // Track page views on route change
  useEffect(() => {
    if (ga4MeasurementId && ga4MeasurementId !== 'G-XXXXXXXXXX' && (window as any).gtag) {
      ;(window as any).gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      })
    }
  }, [location, ga4MeasurementId])

  return <>{children}</>
}
