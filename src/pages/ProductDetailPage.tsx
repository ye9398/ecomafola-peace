import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ChevronRight, Plus, Minus, ShoppingCart, Zap, Truck,
  MapPin, Star, Search, Globe, Heart, Sparkles, Check
} from 'lucide-react'
import { getProductByHandle, getProductRecommendations } from '../lib/shopify'
import { getProductContent } from '../lib/contentService'
import { useCart } from '../context/CartContext'
import { useGeoLocation, useShipping } from '../hooks/useShipping'
import { getProductDescription } from '../data/productDescriptions'
import { OptimizedImage } from '../components/OptimizedImage'
import { ProductDetailContent } from '../components/ProductDetailContent'
import { getHowToByHandle } from '../lib/howToSchema'
import { smartTruncate } from '../lib/seo-config'

// URL Parameter → Shopify handle mapping
const URL_TO_SHOPIFY_HANDLE: Record<string, string> = {
  'coconutbowl': 'samoan-handcrafted-coconut-bowl',
  'coconut-bowl': 'samoan-handcrafted-coconut-bowl',
  'woven-tote': 'samoan-handwoven-grass-tote-bag',
  'grass-tote-bag': 'samoan-handwoven-grass-tote-bag',
  'shell-necklace': 'samoan-handcrafted-shell-necklace',
  'wovenbasket': 'samoan-woven-basket',
  'woven-basket': 'samoan-woven-basket',
  'naturalsoap': 'natural-coconut-soap',
  'natural-soap': 'natural-coconut-soap',
  'tapa-cloth': 'tapa-cloth-wall-art',
  'shell-coasters': 'samoan-handcrafted-natural-shell-coasters',
  'shellcoasters': 'samoan-handcrafted-natural-shell-coasters',
  'coasters': 'samoan-handcrafted-natural-shell-coasters',
  'samoan-handcrafted-natural-shell-coasters': 'samoan-handcrafted-natural-shell-coasters',
  'beachbag': 'handwoven-papua-new-guinea-beach-bag',
  'beach-bag': 'handwoven-papua-new-guinea-beach-bag',
  'handwoven-beach-bag': 'handwoven-papua-new-guinea-beach-bag',
  'doormat': 'natural-coir-handwoven-coconut-palm-doormat',
  'coir-doormat': 'natural-coir-handwoven-coconut-palm-doormat',
  'natural-coir-doormat': 'natural-coir-handwoven-coconut-palm-doormat',
  'polynesian-shell-necklace': 'polynesian-shell-necklace',
  'artisan-alloy-shell-earrings': 'artisan-alloy-shell-earrings',
  'hand-woven-husk-coasters': 'hand-woven-husk-coasters',
  'ceramic-soul-incense-holder': 'ceramic-soul-incense-holder',
  'pacific-artisan-gift-set': 'pacific-artisan-gift-set',
  'samoan-handcrafted-coconut-bowl': 'samoan-handcrafted-coconut-bowl',
  'samoan-handwoven-grass-tote-bag': 'samoan-handwoven-grass-tote-bag',
  'samoan-handcrafted-shell-necklace': 'samoan-handcrafted-shell-necklace',
  'samoan-woven-basket': 'samoan-woven-basket',
  'natural-coconut-soap': 'natural-coconut-soap',
  'tapa-cloth-wall-art': 'tapa-cloth-wall-art',
  'handwoven-papua-new-guinea-beach-bag': 'handwoven-papua-new-guinea-beach-bag',
  'natural-coir-handwoven-coconut-palm-doormat': 'natural-coir-handwoven-coconut-palm-doormat',
}

const SHOPIFY_HANDLE_TO_DESCRIPTION: Record<string, string> = {
  'samoan-handcrafted-coconut-bowl': 'coconutbowl',
  'samoan-handwoven-grass-tote-bag': 'woven-tote',
  'samoan-handcrafted-shell-necklace': 'shell-necklace',
  'samoan-woven-basket': 'wovenbasket',
  'natural-coconut-soap': 'naturalsoap',
  'tapa-cloth-wall-art': 'tapa-cloth',
  'samoan-handcrafted-natural-shell-coasters': 'shell-coasters',
  'handwoven-papua-new-guinea-beach-bag': 'beachbag',
  'natural-coir-handwoven-coconut-palm-doormat': 'doormat',
}

// ---------- Inline Sub-components ----------

// Smart Volume Savings — auto-detects Volume vs Bundle mode by category
const VolumeSavings = ({ product, qty, setQty, recommendations, onBundleSelect }: any) => {
  const CATEGORIES_WITH_VOLUME_DISCOUNT = ['coconut-bowls', 'shell-coasters', 'natural-soaps', 'bowls', 'coasters', 'soaps']
  const category = product?.category?.toLowerCase() || ''
  const price = parseFloat(product?.price_usd || 0)
  const variantId = product?.variants?.edges?.[0]?.node?.id

  const hasVolumeTag = product?.tags?.includes('upsell:volume_discount') || CATEGORIES_WITH_VOLUME_DISCOUNT.some((c: string) => category.includes(c))
  const isExcluded = ['jewelry', 'necklaces', 'earrings', 'bags', 'tote', 'decor', 'basket', 'tapa', 'accessories'].some((c: string) => category.includes(c)) || !hasVolumeTag

  const hasRecommendations = recommendations && recommendations.length > 0

  // ===== BUNDLE MODE (jewelry, bags, accessories — mix & match) =====
  if ((product?.tags?.includes('upsell:set_bundle') || isExcluded) && hasRecommendations) {
    const recs = (recommendations || []).slice(0, 2)
    const bundles = [
      {
        id: 'full-set',
        items: [
          { id: variantId, title: product.name, price: price },
          ...(recs[0] ? [{
            id: recs[0].variants?.edges?.[0]?.node?.id || recs[0].id,
            title: recs[0].title || recs[0].name,
            price: parseFloat(recs[0].price_usd || recs[0].priceRange?.minVariantPrice?.amount || 0)
          }] : []),
          ...(recs[1] ? [{
            id: recs[1].variants?.edges?.[0]?.node?.id || recs[1].id,
            title: recs[1].title || recs[1].name,
            price: parseFloat(recs[1].price_usd || recs[1].priceRange?.minVariantPrice?.amount || 0)
          }] : [])
        ],
        discount: 0.15,
        label: 'Pacific Style Set',
        badge: 'Best Value'
      },
      {
        id: 'duo-set',
        items: [
          { id: variantId, title: product.name, price: price },
          ...(recs[0] ? [{
            id: recs[0].variants?.edges?.[0]?.node?.id || recs[0].id,
            title: recs[0].title || recs[0].name,
            price: parseFloat(recs[0].price_usd || recs[0].priceRange?.minVariantPrice?.amount || 0)
          }] : [])
        ],
        discount: 0.08,
        label: 'Essential Duo',
        badge: 'Most Gifted'
      },
      {
        id: 'solo',
        items: [{ id: variantId, title: product.name, price: price }],
        discount: 0,
        label: 'Individual Item',
        badge: null
      }
    ].filter(b => b.items.length > 0)

    const [selectedBundle, setSelectedBundle] = useState('solo')

    return (
      <div className="mt-8 space-y-4 animate-fade-in">
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-amber-100"></div></div>
          <span className="relative px-4 bg-coral-white font-serif text-sm font-bold text-ocean-blue uppercase tracking-widest">
            Mix & Match Bundles
          </span>
        </div>
        <div className="space-y-3">
          {bundles.map(bundle => {
            const isSelected = selectedBundle === bundle.id
            const originalTotal = bundle.items.reduce((sum: number, item: any) => sum + item.price, 0)
            const discountedTotal = (originalTotal * (1 - bundle.discount)).toFixed(2)

            return (
              <div
                key={bundle.id}
                onClick={() => {
                  setSelectedBundle(bundle.id)
                  onBundleSelect && onBundleSelect(bundle.items.map((item: any) => ({ variantId: item.id, quantity: 1 })))
                }}
                className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                  isSelected ? 'border-amber-400 bg-white shadow-md ring-2 ring-amber-400/10' : 'border-gray-100 bg-white/50 hover:border-amber-200'
                }`}
              >
                {bundle.badge && (
                  <div className={`absolute -top-3 -right-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    bundle.id === 'full-set' ? 'bg-amber-400 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {bundle.badge}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-amber-400 bg-amber-400' : 'border-gray-200'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></div>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg font-bold text-ocean-blue">{bundle.label}</span>
                        {bundle.discount > 0 && (
                          <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            -{(bundle.discount * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-sans text-gray-400 mt-1">
                        {bundle.items.map((i: any) => i.title).join(' + ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-xl font-bold text-ocean-blue">${discountedTotal}</div>
                    {bundle.discount > 0 && (
                      <div className="text-xs font-sans text-gray-400 line-through tracking-tighter">
                        ${originalTotal.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ===== VOLUME MODE (bowls, coasters, soaps — buy multiples of same item) =====
  // If category is excluded (jewelry, bags, etc.), never show Volume mode — wait for recommendations to load for Bundle mode
  if (!hasVolumeTag || isExcluded) return null

  const tiers = [
    { qty: 4, discount: 0.20, label: '4+ Items', badge: 'Biggest Savings' },
    { qty: 2, discount: 0.10, label: '2 Items', badge: 'Most Popular' },
    { qty: 1, discount: 0, label: '1 Item', badge: null }
  ]

  return (
    <div className="mt-8 space-y-4 animate-fade-in">
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-amber-100"></div></div>
        <span className="relative px-4 bg-coral-white font-serif text-sm font-bold text-ocean-blue uppercase tracking-widest">
          Exclusive Volume Savings
        </span>
      </div>
      <div className="space-y-3">
        {tiers.map(tier => {
          const isActive = (tier.qty === 4 && qty >= 4) || (tier.qty === 2 && qty >= 2 && qty < 4) || (tier.qty === 1 && qty < 2)
          const tierPrice = (price * tier.qty * (1 - tier.discount)).toFixed(2)
          const originalPrice = (price * tier.qty).toFixed(2)

          return (
            <div
              key={tier.qty}
              onClick={() => setQty(tier.qty)}
              className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                isActive ? 'border-amber-400 bg-white shadow-md ring-2 ring-amber-400/10' : 'border-gray-100 bg-white/50 hover:border-amber-200'
              }`}
            >
              {tier.badge && (
                <div className={`absolute -top-3 -right-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  tier.qty === 4 ? 'bg-amber-400 text-white' : 'bg-amber-100 text-amber-700'
                }`}>
                  {tier.badge}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isActive ? 'border-amber-400 bg-amber-400' : 'border-gray-200'
                  }`}>
                    {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-ocean-blue">{tier.label}</span>
                    {tier.discount > 0 && (
                      <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        {(tier.discount * 100).toFixed(0)}% OFF
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-xl font-bold text-ocean-blue">${tierPrice}</div>
                  {tier.discount > 0 && (
                    <div className="text-xs font-sans text-gray-400 line-through tracking-tighter">
                      ${originalPrice}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Frequently Bought Together
const FrequentlyBoughtTogether = ({ recommendations, onAddToCart }: any) => {
  if (!recommendations || recommendations.length === 0) return null
  const items = recommendations.slice(0, 2)

  return (
    <div className="mt-8 space-y-4">
      <h4 className="font-serif text-sm font-bold text-ocean-blue uppercase tracking-widest flex items-center gap-2">
        Frequently Bought Together
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item: any) => {
          const price = item.priceRange?.minVariantPrice?.amount || item.price_usd
          const variantId = item.variants?.edges?.[0]?.node?.id || item.id
          const imageUrl = item.images?.edges?.[0]?.node?.url || item.image_url

          return (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl hover:border-tropical-green/30 transition-all group">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                <OptimizedImage src={imageUrl} alt={item.title || item.name} preset="cart" className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-sans font-bold text-ocean-blue truncate">{item.title || item.name}</p>
                <p className="text-[10px] font-sans font-black text-ocean-blue/40 uppercase tracking-tighter">
                  ${parseFloat(price).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => onAddToCart(variantId)}
                className="w-10 h-10 rounded-full bg-ocean-blue/5 text-ocean-blue hover:bg-ocean-blue hover:text-white transition-all flex items-center justify-center group-hover:scale-110 active:scale-95"
                title="Quick Add"
              >
                <Plus size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Complete the Look
const CompleteTheLook = ({ recommendations }: any) => {
  if (!recommendations || recommendations.length === 0) return null

  return (
    <section className="mt-24 pt-24 border-t border-gray-100">
      <div className="text-center mb-16">
        <p className="text-[10px] font-black text-tropical-green uppercase tracking-[0.3em] mb-4">You Might Also Love</p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-ocean-blue italic">Complete the Look</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {recommendations.slice(0, 4).map((p: any) => {
          const image = p.images?.edges?.[0]?.node?.url
          const price = p.priceRange?.minVariantPrice?.amount
          
          return (
            <Link key={p.id} to={`/product/${p.handle}`} className="group block">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 mb-4 relative shadow-sm group-hover:shadow-xl transition-all duration-500">
                <OptimizedImage src={image} alt={p.title} preset="card" loading="lazy" className="w-full h-full transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-ocean-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-serif text-sm font-bold text-ocean-blue group-hover:text-tropical-green transition-colors line-clamp-1">{p.title}</h3>
              <p className="font-sans text-[10px] font-black text-ocean-blue/30 uppercase tracking-widest mt-1">${parseFloat(price).toFixed(2)}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

// Fallback FBT pairings when Shopify recommendations API returns empty
const FALLBACK_FBT: Record<string, { handle: string; title: string; price: string }[]> = {
  'samoan-handcrafted-coconut-bowl': [
    { handle: 'samoan-handwoven-grass-tote-bag', title: 'Samoan Handwoven Grass Tote Bag', price: '49.99' },
    { handle: 'samoan-woven-basket', title: 'Samoan Woven Basket', price: '39.99' }
  ],
  'samoan-handwoven-grass-tote-bag': [
    { handle: 'samoan-handcrafted-coconut-bowl', title: 'Samoan Handcrafted Coconut Bowl', price: '29.99' },
    { handle: 'samoan-handwoven-half-moon-bag', title: 'Samoan Handwoven Half Moon Bag', price: '49.99' }
  ],
  'samoan-handcrafted-shell-necklace': [
    { handle: 'polynesian-shell-necklace', title: 'Polynesian Shell Necklace', price: '19.99' },
    { handle: 'artisan-alloy-shell-earrings', title: 'Artisan Alloy Shell Earrings', price: '16.99' }
  ],
  'samoan-woven-basket': [
    { handle: 'handwoven-seagrass-basket', title: 'Handwoven Seagrass Basket', price: '38.99' },
    { handle: 'samoan-handcrafted-coconut-bowl', title: 'Samoan Handcrafted Coconut Bowl', price: '29.99' }
  ],
  'samoan-handcrafted-natural-shell-coasters': [
    { handle: 'hand-woven-husk-coasters', title: 'Hand Woven Husk Coasters', price: '17.99' },
    { handle: 'ceramic-soul-incense-holder', title: 'Ceramic Soul Incense Holder', price: '24.99' }
  ],
  'polynesian-shell-necklace': [
    { handle: 'samoan-handcrafted-shell-necklace', title: 'Samoan Handcrafted Shell Necklace', price: '24.99' },
    { handle: 'artisan-alloy-shell-earrings', title: 'Artisan Alloy Shell Earrings', price: '16.99' }
  ],
  'artisan-alloy-shell-earrings': [
    { handle: 'polynesian-shell-necklace', title: 'Polynesian Shell Necklace', price: '19.99' },
    { handle: 'samoan-handcrafted-shell-necklace', title: 'Samoan Handcrafted Shell Necklace', price: '24.99' }
  ],
  'hand-woven-husk-coasters': [
    { handle: 'samoan-handcrafted-natural-shell-coasters', title: 'Samoan Handcrafted Natural Shell Coasters', price: '15.99' },
    { handle: 'samoan-handcrafted-coconut-bowl', title: 'Samoan Handcrafted Coconut Bowl', price: '29.99' }
  ],
  'ceramic-soul-incense-holder': [
    { handle: 'samoan-handcrafted-coconut-bowl', title: 'Samoan Handcrafted Coconut Bowl', price: '29.99' },
    { handle: 'samoan-handcrafted-natural-shell-coasters', title: 'Samoan Handcrafted Natural Shell Coasters', price: '15.99' }
  ],
  'polynesian-rattan-chandelier': [
    { handle: 'artisan-rattan-coastal-mirror', title: 'Artisan Rattan Coastal Mirror', price: '98.99' },
    { handle: 'mother-of-pearl-inlaid-tray', title: 'Mother of Pearl Inlaid Tray', price: '88.99' }
  ],
  'artisan-rattan-coastal-mirror': [
    { handle: 'polynesian-rattan-chandelier', title: 'Polynesian Rattan Chandelier', price: '148.99' },
    { handle: 'handwoven-seagrass-basket', title: 'Handwoven Seagrass Basket', price: '38.99' }
  ],
  'mother-of-pearl-inlaid-tray': [
    { handle: 'artisan-rattan-coastal-mirror', title: 'Artisan Rattan Coastal Mirror', price: '98.99' },
    { handle: 'samoan-handcrafted-natural-shell-coasters', title: 'Samoan Handcrafted Natural Shell Coasters', price: '15.99' }
  ],
  'handwoven-seagrass-basket': [
    { handle: 'samoan-woven-basket', title: 'Samoan Woven Basket', price: '39.99' },
    { handle: 'samoan-handwoven-grass-tote-bag', title: 'Samoan Handwoven Grass Tote Bag', price: '49.99' }
  ],
  'samoan-handwoven-half-moon-bag': [
    { handle: 'samoan-handwoven-grass-tote-bag', title: 'Samoan Handwoven Grass Tote Bag', price: '49.99' },
    { handle: 'samoan-woven-basket', title: 'Samoan Woven Basket', price: '39.99' }
  ],
  'natural-coir-handwoven-coconut-palm-doormat': [
    { handle: 'samoan-handcrafted-coconut-bowl', title: 'Samoan Handcrafted Coconut Bowl', price: '29.99' },
    { handle: 'hand-woven-husk-coasters', title: 'Hand Woven Husk Coasters', price: '17.99' }
  ],
  'handwoven-papua-new-guinea-beach-bag': [
    { handle: 'samoan-handwoven-grass-tote-bag', title: 'Samoan Handwoven Grass Tote Bag', price: '49.99' },
    { handle: 'samoan-handwoven-half-moon-bag', title: 'Samoan Handwoven Half Moon Bag', price: '49.99' }
  ],
  'pacific-artisan-gift-set': [
    { handle: 'samoan-handcrafted-coconut-bowl', title: 'Samoan Handcrafted Coconut Bowl', price: '29.99' },
    { handle: 'polynesian-shell-necklace', title: 'Polynesian Shell Necklace', price: '19.99' }
  ]
}

// ---------- Main PDP Component ----------

interface Product {
  id: string
  sku: string
  name: string
  subtitle: string
  description: string
  price_usd: number
  stock: number
  category: string
  image_url: string
  images: string[]
  tag: string
  tags: string[]
  variants: any
}

const ProductDetailPage = () => {
  const { id } = useParams()
  const shopifyHandle = id ? URL_TO_SHOPIFY_HANDLE[id] || id : ''
  const descriptionHandle = shopifyHandle ? SHOPIFY_HANDLE_TO_DESCRIPTION[shopifyHandle] || shopifyHandle : ''

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [isAdded, setIsAdded] = useState(false)
  const [bundleItems, setBundleItems] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isZoomed, setIsZoomed] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const { addToCart, goToCheckout } = useCart()
  const { geo } = useGeoLocation()
  const countryCode = selectedCountry || geo?.country_code || null
  const productId = product ? parseInt(product.id.split('/').pop() || '0') : 0
  const cartItems = product ? [{ product_id: productId, quantity }] : []
  const { shipping, loading: shippingLoading } = useShipping(countryCode, cartItems)

  const description = getProductDescription(descriptionHandle)
  const [customContent, setCustomContent] = useState<any>(null)

  useEffect(() => {
    const loadCustomContent = async () => {
      try {
        if (!shopifyHandle) return
        const data = await getProductContent(shopifyHandle)
        setCustomContent(data)
      } catch (err) {
        // Fallback to static JSON
        try {
          const response = await fetch('/admin-content/ecomafola-content.json')
          if (response.ok) {
            const data = await response.json()
            setCustomContent(data.products?.[shopifyHandle] || null)
          }
        } catch {
          // Silently fail — use default descriptions
        }
      }
    }
    loadCustomContent()
  }, [shopifyHandle])

  const getCustom = (key: string) => customContent ? customContent[key] : null

  useEffect(() => {
    if (!shopifyHandle) return
    setLoading(true)
    ;(async () => {
      try {
        const data = await getProductByHandle(shopifyHandle)
        if (data) {
          const variant = data.variants.edges[0]?.node
          setProduct({
            id: data.id,
            sku: data.handle,
            name: data.title,
            subtitle: data.productType || 'Handcrafted',
            description: data.descriptionHtml || 'No description available',
            price_usd: parseFloat(variant?.price.amount || data.priceRange.minVariantPrice.amount),
            stock: variant?.availableForSale ? 999 : 0,
            category: data.productType?.toLowerCase().replace(/\s+/g, '-') || 'all-products',
            image_url: data.images.edges[0]?.node.url,
            images: data.images.edges.map((e: any) => e.node.url),
            tag: data.tags[0] || 'Handmade',
            tags: data.tags || [],
            variants: data.variants
          })
        }
      } catch (err) {
        console.error('Failed to fetch product:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [shopifyHandle])

  useEffect(() => {
    if (!product?.id) return
    ;(async () => {
      try {
        const recs = await getProductRecommendations(product.id)
        if (recs && recs.length > 0) {
          setRecommendations(recs)
          return
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err)
      }

      // Fallback: try fetching FBT products by handle, with static data as last resort
      const fallbackItems = FALLBACK_FBT[shopifyHandle]
      if (!fallbackItems || fallbackItems.length === 0) return

      try {
        const fallbackProducts = await Promise.all(
          fallbackItems.map(async (item) => {
            try {
              const p = await getProductByHandle(item.handle)
              if (p) return p
            } catch { /* ignore */ }
            // Static fallback if API fails
            return {
              id: `gid://shopify/Product/${item.handle}`,
              title: item.title,
              handle: item.handle,
              productType: '',
              priceRange: { minVariantPrice: { amount: item.price, currencyCode: 'USD' } },
              images: { edges: [] },
              variants: { edges: [] }
            }
          })
        )
        setRecommendations(fallbackProducts.filter(Boolean))
      } catch (err) {
        // Last resort: use pure static data
        setRecommendations(fallbackItems.map(item => ({
          id: `gid://shopify/Product/${item.handle}`,
          title: item.title,
          handle: item.handle,
          productType: '',
          priceRange: { minVariantPrice: { amount: item.price, currencyCode: 'USD' } },
          images: { edges: [] },
          variants: { edges: [] }
        })))
      }
    })()
  }, [product?.id, shopifyHandle])

  const handleAddToCart = async () => {
    if (!product) return
    const variantId = product.variants?.edges[0]?.node.id
    if (variantId) {
      if (bundleItems) {
        for (const item of bundleItems) await addToCart(item.variantId, item.quantity)
      } else {
        await addToCart(variantId, quantity)
      }
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 800)
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    goToCheckout()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePos({ x, y })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin"></div></div>
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="text-gray-500 font-serif">Product not found.</p><Link to="/products" className="text-ocean-blue underline text-sm font-serif">← Back to Products</Link></div>

  const reviews = customContent?.reviews || [
    { id: '1', rating: 5, author: 'Sarah M.', body: 'Absolutely beautiful handcrafted bowl! The natural coconut material feels so authentic and the craftsmanship is exceptional. Perfect for serving fruit or as a decorative piece.', createdAt: '2024-03-15', isVerified: true, helpfulCount: 12, image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=200&h=200&fit=crop' },
    { id: '2', rating: 5, author: 'James K.', body: 'Love supporting traditional Samoan craftsmanship. This coconut bowl exceeded my expectations - smooth finish, perfect size, and it looks stunning on my dining table.', createdAt: '2024-03-10', isVerified: true, helpfulCount: 8, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop' },
    { id: '3', rating: 4, author: 'Emily R.', body: 'Great quality and love the eco-friendly aspect. Each bowl is truly unique with its own natural pattern. Shipping was fast too!', createdAt: '2024-03-05', isVerified: true, helpfulCount: 5 }
  ]

  return (
    <div className="min-h-screen bg-coral-white pt-20">
      <Helmet>
        <title>{product?.name || 'Loading...'} | EcoMafola Peace</title>
        <meta name="description" content={smartTruncate(product?.description || 'Handcrafted eco-friendly products from Samoa', 160)} />
        <link rel="canonical" href={`https://ecomafola.com/product/${shopifyHandle}`} />
        {/* Product Schema.org JSON-LD for SEO and GEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product?.name,
            "description": product?.description?.replace(/<[^>]*>/g, '').substring(0, 500),
            "brand": {
              "@type": "Brand",
              "name": "EcoMafola Peace",
              "sameAs": [
                "https://ecomafola.com",
                "https://www.facebook.com/profile.php?id=61586686574243",
                "https://www.instagram.com/ecomafola_official/",
                "https://www.tiktok.com/@ecomafola"
              ]
            },
            "offers": {
              "@type": "Offer",
              "url": `https://ecomafola.com/product/${shopifyHandle}`,
              "price": product?.price_usd,
              "priceCurrency": "USD",
              "availability": product?.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "USD"
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 3,
                    "unitCode": "d"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 7,
                    "maxValue": 12,
                    "unitCode": "d"
                  }
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "Worldwide",
                "shippingPolicyCountry": "Worldwide",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNoReturns",
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/NonFreeReturn"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : "5.0",
              "reviewCount": reviews.length.toString()
            },
            "image": product?.images?.map((img: string, idx: number) => ({
              "@type": "ImageObject",
              "url": img,
              "width": "1200",
              "height": "1200",
              "caption": `${product?.name} - Image ${idx + 1}`
            })) || [],
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Sustainable",
                "value": "true"
              },
              {
                "@type": "PropertyValue",
                "name": "Handmade",
                "value": "true"
              },
              {
                "@type": "PropertyValue",
                "name": "Fair Trade",
                "value": "true"
              },
              {
                "@type": "PropertyValue",
                "name": "Eco-Friendly",
                "value": "true"
              }
            ],
            "material": "Natural Materials (Coconut, Shell, Rattan, Seagrass)",
            "countryOfOrigin": shopifyHandle?.includes('papua-new-guinea') ? 'Papua New Guinea' : 'Samoa',
            "isAccessibleForFree": "False",
            "priceRange": "$24.99 - $39.99",
            "category": product?.category || "Handcrafted Home Decor"
          })}
        </script>
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ecomafola.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": "https://ecomafola.com/products"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product?.name || "Product",
                "item": `https://ecomafola.com/product/${shopifyHandle}`
              }
            ]
          })}
        </script>
        {/* HowTo Schema for Care Instructions - GEO Optimization */}
        <script type="application/ld+json">
          {JSON.stringify(getHowToByHandle(shopifyHandle))}
        </script>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs font-serif text-gray-400">
          <Link to="/" className="hover:text-ocean-blue">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-ocean-blue">Products</Link>
          <ChevronRight size={12} />
          <span className="text-ocean-blue">{product.name}</span>
        </nav>
      </div>

      {/* Two-Column Hero: Left = Image+Shipping+FBT, Right = Info+Volume+Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT COLUMN: Image Gallery + Shipping + FBT */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
              ref={containerRef}
              className="relative aspect-square rounded-3xl overflow-hidden shadow-xl cursor-zoom-in group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => { setIsZoomed(false); setMousePos({ x: 50, y: 50 }) }}
              onMouseMove={handleMouseMove}
            >
              <OptimizedImage
                src={product.images[activeImage] || product.image_url}
                alt={product.name}
                preset="detailDesktop"
                priority
                className="w-full h-full object-cover"
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transition: isZoomed ? 'transform 0.1s ease-out' : 'transform 0.3s ease'
                }}
              />
              <div className={`absolute bottom-5 right-5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
                <Search size={12} className="text-ocean-blue" />
                <span className="text-xs font-serif text-gray-700">Hover to zoom</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-5 gap-3">
              {product.images.slice(0, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImage === idx ? 'border-ocean-blue ring-2 ring-ocean-blue/20' : 'border-gray-200 hover:border-ocean-blue'
                  }`}
                >
                  <OptimizedImage src={img} alt={`${product.name} view ${idx + 1}`} preset="thumbnail" loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Shipping Calculator */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-ocean-blue" />
                  <span className="font-serif font-semibold text-sm text-ocean-blue">
                    Shipping to {geo?.city ? `(${geo.city}, ${geo.country})` : ''}
                  </span>
                </div>
                <select
                  value={selectedCountry || geo?.country_code || ''}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="text-xs font-serif border border-gray-200 rounded-lg px-2 py-1 bg-white"
                >
                  <option value="US">United States</option>
                  <option value="AU">Australia</option>
                  <option value="NZ">New Zealand</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="WS">Samoa</option>
                </select>
              </div>
              {shipping && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-serif">
                    <span className="text-gray-500">Total Shipping</span>
                    <span className="font-medium text-ocean-blue">${shipping.total_shipping_usd?.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-serif text-gray-400 pt-1">
                    <Globe size={11} />
                    <span>{shipping.carrier} · {shipping.estimated_days}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Frequently Bought Together */}
            <FrequentlyBoughtTogether recommendations={recommendations} onAddToCart={addToCart} />
          </div>

          {/* RIGHT COLUMN: Title + Price + Actions + Volume Savings + Description */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-serif text-tropical-green font-semibold uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="font-serif text-3xl font-bold text-ocean-blue mb-2">{product.name}</h1>
              <p className="text-sm font-serif text-gray-500">{product.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-sm font-serif text-gray-500">4.9 ({reviews.length} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl font-bold text-ocean-blue">${product.price_usd.toFixed(2)}</span>
              <span className="text-sm font-serif text-gray-400">USD · incl. taxes</span>
            </div>

            {/* Quantity + Add to Cart + Buy Now */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="px-4 py-3 text-gray-500 hover:bg-gray-50"><Minus size={14} /></button>
                <span className="px-4 font-serif font-semibold text-ocean-blue">{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)} className="px-4 py-3 text-gray-500 hover:bg-gray-50"><Plus size={14} /></button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-serif font-semibold text-sm transition-all duration-300 ${
                  isAdded ? 'bg-tropical-green text-white' : 'bg-ocean-blue text-white hover:bg-tropical-green'
                }`}
              >
                <ShoppingCart size={16} /> {isAdded ? '✓ Added' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-serif font-semibold text-sm bg-tropical-green text-white hover:bg-ocean-blue transition-all duration-300"
              >
                <Zap size={16} /> Buy Now
              </button>
            </div>

            {/* Volume Savings / Bundle Selector */}
            <VolumeSavings product={product} qty={quantity} setQty={setQuantity} recommendations={recommendations} onBundleSelect={(items: any) => setBundleItems(items)} />

            {/* Product Description (from Shopify) */}
            <div className="text-sm font-serif text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </div>
      </div>

      {/* Classic 5-Section Layout: Story → Environmental → Partnership → Specifications → Guarantee */}
      {description && (
        <div className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 space-y-24">
          {/* 1. Product Story (text left, image right) */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 flex flex-col lg:order-1">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {getCustom('story')?.title || description.title}
              </h2>
              <div className="prose prose-lg max-w-none flex-grow">
                {(getCustom('story')?.content ? getCustom('story').content.split('\n\n') : description.story.split('\n\n')).map((p: string, i: number) => (
                  <p key={i} className="text-gray-700 leading-loose mb-6">{p}</p>
                ))}
              </div>
            </div>
            <div className="relative group lg:order-2">
              {(getCustom('story')?.image || (description as any).images?.story) && (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <OptimizedImage src={getCustom('story')?.image || (description as any).images?.story} alt="Product Story" preset="detailDesktop" loading="lazy" className="w-full h-full" />
                </div>
              )}
            </div>
          </section>

          {/* 2. Environmental Impact (image left, text right) */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              {(getCustom('environmental')?.image || (description as any).images?.environmental) && (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <OptimizedImage src={getCustom('environmental')?.image || (description as any).images?.environmental} alt="Environmental Impact" preset="detailDesktop" loading="lazy" className="w-full h-full" />
                </div>
              )}
            </div>
            <div className="space-y-6 flex flex-col">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {getCustom('environmental')?.title || 'Environmental Impact'}
              </h2>
              <div className="prose prose-lg max-w-none flex-grow">
                {(getCustom('environmental')?.content ? getCustom('environmental').content.split('\n\n') : description.environmental.split('\n\n')).map((p: string, i: number) => (
                  <p key={i} className="text-gray-700 leading-loose mb-6">{p.replace(/\*\*/g, '')}</p>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Partnership Model (image left, text right) */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              {(getCustom('partnership')?.image || (description as any).images?.partnership) && (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <OptimizedImage src={getCustom('partnership')?.image || (description as any).images?.partnership} alt="Partnership Model" preset="detailDesktop" loading="lazy" className="w-full h-full" />
                </div>
              )}
            </div>
            <div className="space-y-6 flex flex-col">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {getCustom('partnership')?.title || 'Our Partnership Model'}
              </h2>
              <div className="prose prose-lg max-w-none flex-grow">
                {(getCustom('partnership')?.content ? getCustom('partnership').content.split('\n\n') : description.partnership.split('\n\n')).map((p: string, i: number) => (
                  <p key={i} className="text-gray-700 leading-loose mb-6">{p.replace(/^[*-] /, '').replace(/\*\*/g, '')}</p>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Specifications (image left, specs right) */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              {(getCustom('specifications')?.image || (description as any).images?.specifications) && (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <OptimizedImage src={getCustom('specifications')?.image || (description as any).images?.specifications} alt="Specifications" preset="detailDesktop" loading="lazy" className="w-full h-full" />
                </div>
              )}
            </div>
            <div className="space-y-4 flex flex-col">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {getCustom('specifications')?.title || 'Specifications'}
              </h2>
              <div className="space-y-2 flex-grow">
                {getCustom('specifications')?.content ? (
                  typeof getCustom('specifications').content === 'string' ? (
                    getCustom('specifications').content.split('\n').filter(Boolean).map((line: string, i: number) => {
                      const parts = line.split(':')
                      return (
                        <div key={i} className="flex gap-3 py-2 border-b border-dashed border-gray-300 last:border-b-0">
                          <dt className="text-sm font-serif text-tropical-green uppercase tracking-wider font-semibold w-28 flex-shrink-0">{parts[0]?.trim()}</dt>
                          <dd className="text-gray-800 font-serif leading-relaxed text-base flex-1">{parts.slice(1).join(':').trim()}</dd>
                        </div>
                      )
                    })
                  ) : (
                    Object.entries(getCustom('specifications').content).map(([key, value]: any, i: number) => (
                      <div key={i} className="flex gap-3 py-2 border-b border-dashed border-gray-300 last:border-b-0">
                        <dt className="text-sm font-serif text-tropical-green uppercase tracking-wider font-semibold w-28 flex-shrink-0">{key}</dt>
                        <dd className="text-gray-800 font-serif leading-relaxed text-base flex-1">{String(value)}</dd>
                      </div>
                    ))
                  )
                ) : (
                  [
                    { label: 'Size', value: description.specifications.size },
                    { label: 'Weight', value: description.specifications.weight },
                    { label: 'Material', value: description.specifications.material },
                    { label: 'Origin', value: description.specifications.origin },
                    { label: 'Care', value: description.specifications.care }
                  ].map((spec, i) => (
                    <div key={i} className="flex gap-3 py-2 border-b border-dashed border-gray-300 last:border-b-0">
                      <dt className="text-sm font-serif text-tropical-green uppercase tracking-wider font-semibold w-28 flex-shrink-0">{spec.label}</dt>
                      <dd className="text-gray-800 font-serif leading-relaxed text-base flex-1">{spec.value}</dd>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* 5. Quality Guarantee (image left, text right) */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              {(getCustom('guarantee')?.image || (description as any).images?.guarantee) && (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <OptimizedImage src={getCustom('guarantee')?.image || (description as any).images?.guarantee} alt="Quality Guarantee" preset="detailDesktop" loading="lazy" className="w-full h-full" />
                </div>
              )}
            </div>
            <div className="space-y-6 flex flex-col">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {getCustom('guarantee')?.title || 'Quality Guarantee'}
              </h2>
              <div className="prose prose-lg max-w-none flex-grow">
                {(getCustom('guarantee')?.content ? getCustom('guarantee').content.split('\n\n') : description.guarantee.split('\n\n')).map((p: string, i: number) => (
                  <p key={i} className="text-gray-700 leading-loose mb-6">{p}</p>
                ))}
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
                {getCustom('faqs')?.title || 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg font-serif text-gray-600 mt-3 leading-relaxed">
                {getCustom('faqs')?.subtitle || 'Everything you need to know about our products'}
              </p>
            </div>
            <div className="space-y-6">
              {(getCustom('faqs')?.content || (description as any).faqs || [
                { question: 'Is this product food-safe?', answer: 'Yes! Our coconut bowls are polished with 100% organic coconut oil, making them completely food-safe for hot and cold foods.' },
                { question: 'How should I care for my coconut bowl?', answer: 'Hand wash with mild soap and air dry completely. Reapply coconut oil monthly. Avoid dishwashers and microwaves.' },
                { question: 'What is your return policy?', answer: 'Due to the nature of handcrafted products and international shipping, we do not accept returns. However, if your product arrives damaged, please contact us within 7 days for a replacement or full refund.' }
              ]).map((faq: any, i: number) => (
                <div key={i} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                  <dt className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold">Q</span>
                    <span className="font-serif font-semibold text-gray-800 text-lg">{faq.question}</span>
                  </dt>
                  <dd className="ml-11 text-gray-600 font-serif leading-relaxed text-base">{faq.answer}</dd>
                </div>
              ))}
            </div>
          </section>

          {/* Extended Product Content for SEO/GEO - 350+ words */}
          {description && (
            <section className="mt-24 pt-16 border-t border-gray-100">
              <ProductDetailContent
                content={{
                  story: description.story,
                  environmental: description.environmental,
                  partnership: description.partnership,
                  features: description.features,
                  specifications: description.specifications,
                  guarantee: description.guarantee,
                  shipping: description.shipping,
                  faqs: description.faqs
                }}
                productName={product.name}
              />
            </section>
          )}

          {/* Reviews Section */}
          <section className="mt-24 pt-24 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
              <div>
                <p className="text-[10px] font-black text-tropical-green uppercase tracking-[0.3em] mb-4">What Our Collectors Say</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-ocean-blue italic">Customer Appreciations</h2>
              </div>
              <div className="flex items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-50 min-w-[280px]">
                <div className="flex items-center gap-2">
                  <span className="text-6xl font-sans font-black text-ocean-blue">4.9</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Average Rating</span>
                  </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-ocean-blue hover:text-tropical-green transition-colors flex items-center gap-2">
                  <Sparkles size={14} /> Write an appreciation
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 flex flex-col gap-6 group hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-blue to-tropical-green flex items-center justify-center text-white font-serif font-bold text-lg shadow-md">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-serif font-bold text-ocean-blue">{review.author}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{review.createdAt}</span>
                          {review.isVerified && (
                            <span className="flex items-center gap-1 text-[8px] font-black text-tropical-green uppercase tracking-tighter">
                              <Check size={8} /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(review.rating)].map((_: any, i: number) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-gray-600 font-serif leading-relaxed italic">"{review.body}"</p>
                  {review.image && (
                    <div className="mt-auto pt-4">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
                        <OptimizedImage src={review.image} alt="Customer Preview" preset="card" loading="lazy" className="w-full h-full" />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-ocean-blue transition-colors">
                      <Heart size={12} /> Was this helpful? ({review.helpfulCount || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Complete the Look */}
          <CompleteTheLook recommendations={recommendations} />

          <div className="text-center py-12">
            <Link to="/products" className="inline-flex items-center gap-2 text-ocean-blue font-serif font-semibold hover:text-tropical-green transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
