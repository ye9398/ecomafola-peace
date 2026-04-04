import { useState, useEffect } from 'react'
import { api } from '../services/api'

export interface GeoLocation {
  ip: string
  country_code: string
  country: string
  city: string
  is_local?: boolean
  fallback?: boolean
}

export interface ShippingResult {
  supported: boolean
  country_code: string
  zone?: string
  carrier?: string
  base_fee_usd?: number
  weight_fee_usd?: number
  total_shipping_usd?: number
  estimated_days?: string
  total_weight_kg?: number
  message?: string
  alternatives?: string[]
}

export function useGeoLocation() {
  const [geo, setGeo] = useState<GeoLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Use ipapi.co for better accuracy (supports country_code directly)
    api.locateByIP()
      .then(data => {
        // Detect local IP addresses and mark as defaulted
        const isLocal = data.ip?.startsWith('127.') || data.ip?.startsWith('192.168') || data.ip?.startsWith('10.')
        setGeo({
          ...data,
          is_local: isLocal,
        })
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { geo, loading, error }
}

export function useShipping(country_code: string | null, items: { product_id: number; quantity: number }[] | null) {
  const [shipping, setShipping] = useState<ShippingResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!country_code) return
    if (!items || items.length === 0) {
      setShipping(null)
      return
    }
    setLoading(true)
    api.calcShipping(country_code, items)
      .then(result => {
        if (result && typeof result === 'object') {
          setShipping(result as ShippingResult)
        }
      })
      .catch(() => setShipping({ supported: false, country_code: country_code, message: 'Could not calculate shipping. Please try again.' }))
      .finally(() => setLoading(false))
  }, [country_code, items?.length])

  return { shipping, loading }
}
