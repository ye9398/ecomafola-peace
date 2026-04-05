import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  ShoppingCart, Star, Truck, MapPin, Package, AlertTriangle, 
  ChevronRight, Minus, Plus, Info, Zap, Leaf, Users, Ruler, 
  ShieldCheck, BookOpen, HelpCircle, Heart, Globe, Award,
  Check, RefreshCw, Box, Shield, Gift, Sparkles, Droplets, Sun, Wind
} from 'lucide-react'
import { shopifyClient, getProductByHandle, getProductRecommendations } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import { useGeoLocation, useShipping } from '../hooks/useShipping'
import { getProductDescription } from '../data/productDescriptions'
import { VolumeDiscount, FrequentlyBoughtTogether, CompleteTheLook } from '../components/UpsellSections'

// URL Parameter → Shopify handle mapping (Enhanced for luxury boutique)
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
  '手工椰子碗': 'samoan-handcrafted-coconut-bowl',
  '编织篮': 'samoan-woven-basket',
  '天然肥皂': 'natural-coconut-soap',
  '草编手工托特包': 'samoan-handwoven-grass-tote-bag',
  '萨摩亚手工贝壳项链': 'samoan-handcrafted-shell-necklace',
  '沙滩包': 'handwoven-beach-bag',
  '椰棕门垫': 'natural-coir-doormat',
  'samoan-handcrafted-coconut-bowl': 'samoan-handcrafted-coconut-bowl',
  'samoan-handwoven-grass-tote-bag': 'samoan-handwoven-grass-tote-bag',
  'samoan-handcrafted-shell-necklace': 'samoan-handcrafted-shell-necklace',
  'samoan-woven-basket': 'samoan-woven-basket',
  'natural-coconut-soap': 'natural-coconut-soap',
  'tapa-cloth-wall-art': 'tapa-cloth-wall-art',
}

const SHOPIFY_HANDLE_TO_DESCRIPTION: Record<string, string> = {
  'samoan-handcrafted-coconut-bowl': 'coconutbowl',
  'samoan-handwoven-grass-tote-bag': 'woven-tote',
  'samoan-handcrafted-shell-necklace': 'shell-necklace',
  'samoan-woven-basket': 'wovenbasket',
  'natural-coconut-soap': 'naturalsoap',
  'tapa-cloth-wall-art': 'tapa-cloth',
  'handwoven-beach-bag': 'beachbag',
  'handwoven-papua-new-guinea-beach-bag': 'beachbag',
  'natural-coir-doormat': 'doormat',
  'natural-coir-handwoven-coconut-palm-doormat': 'doormat',
}

interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  description: string;
  price_usd: number;
  stock: number;
  category: string;
  image_url: string;
  images: string[];
  tag: string;
  weight_kg: number;
  variants: { edges: Array<{ node: { id: string; availableForSale: boolean; price: { amount: string; }; weight?: string; }; }> };
  tags: string[];
}

interface Review {
  id: string;
  rating: number;
  author: string;
  body: string;
  createdAt: string;
  image?: string;
  isVerified: boolean;
  helpfulCount: number;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const shopifyHandle = id ? (URL_TO_SHOPIFY_HANDLE[id] || id) : ''
  const descriptionHandle = shopifyHandle ? (SHOPIFY_HANDLE_TO_DESCRIPTION[shopifyHandle] || shopifyHandle) : ''
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [qty, setQty] = useState(1)
  const [countryOverride, setCountryOverride] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const zoomContainerRef = useRef<HTMLDivElement>(null)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'details' | 'story' | 'shipping' | 'faqs'>('details')

  const optimizeImageUrl = (url: string, width: number = 800, quality: number = 80): string => {
    if (!url || url.includes('unsplash.com')) return url
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}width=${width}&quality=${quality}`
  }
  
  const { addToCart: shopifyAddToCart, goToCheckout } = useCart()
  const navigate = useNavigate()
  const { geo, loading: geoLoading } = useGeoLocation()
  const country = countryOverride || geo?.country_code || null
  const numericProductId = product ? parseInt(product.id.split('/').pop() || '0') : 0
  const shippingItems = product ? [{ product_id: numericProductId, quantity: qty }] : []
  const { shipping, loading: shipLoading } = useShipping(country, shippingItems)
  const description = getProductDescription(descriptionHandle)

  const [customContent, setCustomContent] = useState<any>(null)
  const [customLoading, setCustomLoading] = useState(true)

  useEffect(() => {
    const loadCustomContent = async () => {
      try {
        const response = await fetch('/admin-content/ecomafola-content.json')
        if (response.ok) {
          const data = await response.json()
          setCustomContent(data.products?.[shopifyHandle] || null)
        }
      } catch (error) {
        console.error('Error loading custom content:', error)
      } finally {
        setCustomLoading(false)
      }
    }
    loadCustomContent()
  }, [shopifyHandle])

  const reviews: Review[] = customContent?.reviews?.map((r: any) => ({
    id: r.id, rating: r.rating, author: r.author, body: r.content, createdAt: r.date, image: r.image, isVerified: true, helpfulCount: Math.floor(Math.random() * 15)
  })) || [
    { id: '1', rating: 5, author: 'Sarah M.', body: 'Absolutely beautiful handcrafted bowl! The natural coconut material feels so authentic and the craftsmanship is exceptional. Perfect for serving fruit or as a decorative piece.', createdAt: '2024-03-15', image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400&h=400&fit=crop', isVerified: true, helpfulCount: 12 },
    { id: '2', rating: 5, author: 'James K.', body: 'Love supporting traditional Samoan craftsmanship. This coconut bowl exceeded my expectations - smooth finish, perfect size, and it looks stunning on my dining table.', createdAt: '2024-03-10', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', isVerified: true, helpfulCount: 8 },
    { id: '3', rating: 4, author: 'Emily R.', body: 'Great quality and fast shipping to Australia. The only minor thing is that each bowl has slight natural variations, but that actually adds to its unique charm.', createdAt: '2024-03-05', isVerified: true, helpfulCount: 5 },
    { id: '4', rating: 5, author: 'Michael T.', body: 'Bought this as a gift for my wife who loves eco-friendly products. She absolutely adores it! The packaging was also very thoughtful and sustainable.', createdAt: '2024-02-28', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop', isVerified: true, helpfulCount: 15 },
    { id: '5', rating: 5, author: 'Lisa Chen', body: 'These bowls are not just functional but also conversation starters. Everyone who visits asks where I got them. Truly appreciate the fair trade aspect.', createdAt: '2024-02-20', isVerified: true, helpfulCount: 3 },
    { id: '6', rating: 4, author: 'David Park', body: 'Solid craftsmanship and good value for handmade items. The natural varnish gives it a nice sheen. Would recommend for anyone looking for sustainable kitchenware.', createdAt: '2024-02-15', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop', isVerified: true, helpfulCount: 7 }
  ]

  useEffect(() => {
    if (!shopifyHandle && !descriptionHandle) return
    setLoading(true)
    const fetchProduct = async () => {
      try {
        let shopifyProduct = null
        if (shopifyHandle) {
          try {
            shopifyProduct = await getProductByHandle(shopifyHandle)
          } catch (error) {
            console.error('[ProductDetailPage] Shopify API error:', error)
          }
        }
        
        if (!shopifyProduct) {
          setProduct(null)
        } else {
          const firstVariant = shopifyProduct.variants.edges[0]?.node
          const productData: Product = {
            id: shopifyProduct.id,
            sku: shopifyProduct.handle,
            name: shopifyProduct.title,
            subtitle: shopifyProduct.productType || 'Handcrafted',
            description: shopifyProduct.descriptionHtml || 'No description available',
            price_usd: parseFloat(firstVariant?.price.amount || shopifyProduct.priceRange.minVariantPrice.amount),
            stock: firstVariant?.availableForSale ? 999 : 0,
            category: shopifyProduct.productType?.toLowerCase().replace(/\s+/g, '-') || 'all-products',
            image_url: shopifyProduct.images.edges[0]?.node.url || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&q=80',
            images: shopifyProduct.images.edges.map((edge: any) => edge.node.url) || [],
            tag: shopifyProduct.tags[0] || 'Handmade',
            weight_kg: parseFloat(firstVariant?.weight?.toString() || '0.5') / 1000,
            variants: shopifyProduct.variants,
            tags: shopifyProduct.tags || []
          }
          setProduct(productData)
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [shopifyHandle])

  useEffect(() => {
    if (!product) return
    const fetchRecommendations = async () => {
      try {
        const recs = await getProductRecommendations(product.id)
        setRecommendations(recs)
      } catch (error) {
        console.error('Failed to fetch recommendations:', error)
      }
    }
    fetchRecommendations()
  }, [product])

  const handleAddToCart = async () => {
    if (!product) return
    const firstVariantId = product.variants?.edges[0]?.node.id
    if (!firstVariantId) return
    await shopifyAddToCart(firstVariantId)
    setAdded(true)
    setTimeout(() => { setAdded(false) }, 1500)
  }

  const handleBuyNow = async () => {
    if (!product) return
    const firstVariantId = product.variants?.edges[0]?.node.id
    if (!firstVariantId) return
    await shopifyAddToCart(firstVariantId)
    goToCheckout()
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomContainerRef.current || !imageRef.current) return
    const rect = zoomContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-coral-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-ocean-blue border-t-transparent rounded-full animate-spin shadow-xl" />
        <p className="font-serif italic text-ocean-blue tracking-widest animate-pulse">Sourcing Handcrafted Excellence...</p>
      </div>
    </div>
  )
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-coral-white px-4 text-center">
      <Box className="w-20 h-20 text-ocean-blue opacity-20" />
      <h2 className="text-3xl font-serif font-bold text-ocean-blue">Whispers of the Pacific</h2>
      <p className="text-gray-500 font-serif max-w-md">This particular piece of artisan craftsmanship has drifted back into the ocean of history.</p>
      <Link to="/products" className="bg-ocean-blue text-white px-8 py-3 rounded-full font-serif font-semibold hover:bg-tropical-green transition-all shadow-lg hover:shadow-xl">
        Discover Other Treasures
      </Link>
    </div>
  )

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const currentImageUrl = (product.images.length > 0 ? product.images : [product.image_url])[selectedImageIndex] || product.image_url

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Luxury Pacific Handcrafted | EcoMafola Peace`}</title>
        <meta name="description" content={product.description.replace(/<[^>]*>/g, '').substring(0, 160) || `Experience the luxury of handcrafted Samoan items.`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} | EcoMafola Peace`} />
        <meta property="og:description" content={product.description.replace(/<[^>]*>/g, '').substring(0, 160)} />
        <meta property="og:image" content={product.images[0] || product.image_url} />
        <meta property="og:url" content={`${origin}/product/${product.sku}`} />
        <meta property="product:price:amount" content={product.price_usd.toString()} />
        <meta property="product:price:currency" content="USD" />
        <meta property="product:brand" content="EcoMafola Peace" />
        <meta property="product:availability" content="in stock" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:image" content={product.images[0] || product.image_url} />
      </Helmet>

      <div className="min-h-screen bg-coral-white">
        {/* Breadcrumbs & Decorative Header */}
        <div className="pt-24 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gray-400">
              <Link to="/" className="hover:text-ocean-blue transition-colors">Home</Link>
              <ChevronRight size={10} className="text-gray-300" />
              <Link to="/products" className="hover:text-ocean-blue transition-colors">Boutique</Link>
              <ChevronRight size={10} className="text-gray-300" />
              <span className="text-ocean-blue">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Product Media Gallery (5/12 columns) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="sticky top-28">
                <div 
                  ref={zoomContainerRef} 
                  className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] cursor-crosshair group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => { setIsHovering(false); setZoomPosition({ x: 50, y: 50 }) }}
                  onMouseMove={handleMouseMove}
                >
                  <img 
                    ref={imageRef}
                    src={optimizeImageUrl(currentImageUrl, 1600, 90)} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 ease-out"
                    style={{ 
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transform: isHovering ? 'scale(1.8)' : 'scale(1)',
                    }}
                  />
                  
                  {/* Floating Labels */}
                  <div className="absolute top-8 left-8 flex flex-col gap-3">
                    <span className="bg-ocean-blue/90 backdrop-blur-md text-white text-[10px] font-sans font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg">
                      {product.tag}
                    </span>
                    <span className="bg-tropical-green/90 backdrop-blur-md text-white text-[10px] font-sans font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <Leaf size={12} /> Sustainable
                    </span>
                  </div>

                  {/* Zoom Hint */}
                  <div className={`absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
                    <Sparkles className="text-white w-5 h-5 animate-pulse" />
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="mt-8 grid grid-cols-5 gap-4">
                  {(product.images.length > 0 ? product.images : [product.image_url]).map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 transform ${
                        selectedImageIndex === idx 
                          ? 'border-ocean-blue ring-4 ring-ocean-blue/10 scale-95 shadow-lg' 
                          : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img src={optimizeImageUrl(img, 300, 75)} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Product Info (5/12 columns) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[11px] font-black text-tropical-green uppercase tracking-[0.3em] bg-tropical-green/10 px-4 py-1.5 rounded-full">
                    {product.category.replace(/-/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < 5 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                    ))}
                    <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">4.9 • {reviews.length} Reviews</span>
                  </div>
                </div>
                
                <h1 className="font-serif text-5xl md:text-6xl font-bold text-ocean-blue leading-tight mb-4 tracking-tight">
                  {product.name}
                </h1>
                <p className="font-serif italic text-xl text-gray-400 mb-8 leading-relaxed">
                  {product.subtitle}
                </p>
                
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-5xl font-sans font-black text-ocean-blue tracking-tighter">
                      ${product.price_usd.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      USD • Inclusive of Duty & Tax
                    </span>
                  </div>
                  <VolumeDiscount product={product} />
                </div>
              </div>

              <div className="space-y-10">
                {/* Description Snippet */}
                <div 
                  className="prose prose-ocean max-w-none text-gray-600 font-serif text-lg leading-relaxed italic"
                  dangerouslySetInnerHTML={{ __html: product.description }} 
                />

                {/* Purchase Actions */}
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full p-2">
                      <button 
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-ocean-blue hover:bg-white rounded-full transition-all"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-sans font-black text-ocean-blue text-xl">{qty}</span>
                      <button 
                        onClick={() => setQty(q => q + 1)}
                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-ocean-blue hover:bg-white rounded-full transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button 
                      onClick={handleAddToCart}
                      className={`flex-1 h-16 flex items-center justify-center gap-4 rounded-full font-sans font-black uppercase tracking-[0.2em] text-sm transition-all duration-500 relative overflow-hidden group shadow-xl ${
                        added 
                          ? 'bg-tropical-green text-white scale-[1.02]' 
                          : 'bg-ocean-blue text-white hover:bg-ocean-blue/90 hover:-translate-y-1'
                      }`}
                    >
                      <div className={`flex items-center gap-3 transition-transform duration-500 ${added ? 'translate-y-20' : 'translate-y-0'}`}>
                        <ShoppingCart size={20} /> Add to Collection
                      </div>
                      <div className={`absolute inset-0 flex items-center justify-center gap-3 bg-tropical-green transition-transform duration-500 ${added ? 'translate-y-0' : '-translate-y-20'}`}>
                        <Check size={20} className="animate-bounce" /> Added to Cart
                      </div>
                    </button>
                  </div>

                  <button 
                    onClick={handleBuyNow}
                    className="w-full h-16 bg-white border-2 border-ocean-blue text-ocean-blue rounded-full font-sans font-black uppercase tracking-[0.2em] text-sm hover:bg-ocean-blue hover:text-white transition-all duration-500 shadow-sm flex items-center justify-center gap-3 group"
                  >
                    <Zap size={18} className="group-hover:animate-pulse" /> Express Checkout
                  </button>
                </div>

                {/* Upsell: Frequently Bought Together */}
                <FrequentlyBoughtTogether recommendations={recommendations} onAddToCart={shopifyAddToCart} />

                {/* Value Props & Shipping */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-gray-50 rounded-[2rem] shadow-sm flex flex-col gap-4 group hover:border-tropical-green/30 transition-colors">
                    <Truck size={24} className="text-tropical-green" />
                    <div>
                      <h4 className="font-sans font-black text-[10px] uppercase tracking-widest text-ocean-blue mb-1">Global Concierge</h4>
                      <p className="text-xs font-serif text-gray-500 italic">Carbon-neutral delivery in 3-7 days worldwide.</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white border border-gray-50 rounded-[2rem] shadow-sm flex flex-col gap-4 group hover:border-ocean-blue/30 transition-colors">
                    <ShieldCheck size={24} className="text-ocean-blue" />
                    <div>
                      <h4 className="font-sans font-black text-[10px] uppercase tracking-widest text-ocean-blue mb-1">Artisan Warranty</h4>
                      <p className="text-xs font-serif text-gray-500 italic">Every stitch and carve guaranteed for 24 months.</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Estimator Mini */}
                <div className="bg-ocean-blue/5 rounded-[2.5rem] p-8 border border-ocean-blue/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ocean-blue shadow-sm">
                        <MapPin size={18} />
                      </div>
                      <span className="font-serif font-bold text-ocean-blue">Shipping to {country || 'Global'}</span>
                    </div>
                    <button onClick={() => setCountryOverride(null)} className="text-[10px] font-black text-ocean-blue/40 uppercase tracking-widest hover:text-ocean-blue transition-colors">Change</button>
                  </div>
                  
                  {shipLoading ? (
                    <div className="flex items-center gap-4 animate-pulse">
                      <div className="h-4 w-3/4 bg-ocean-blue/10 rounded" />
                    </div>
                  ) : shipping && shipping.supported ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-ocean-blue/5">
                        <span className="text-sm font-serif text-gray-500">Logistics & Handling</span>
                        <span className="text-sm font-sans font-black text-ocean-blue">${shipping.total_shipping_usd?.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-sans font-black text-tropical-green uppercase tracking-widest">
                        <Check size={12} /> Priority Ocean Air Dispatch
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-serif italic text-gray-400">Please provide location at checkout for accurate logistics.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Sections (Luxury Boutique Style) */}
        {description && (
          <div className="space-y-40 mb-32">
            
            {/* Navigation Tabs for Details */}
            <div className="sticky top-0 z-40 bg-coral-white/80 backdrop-blur-xl border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center gap-12 overflow-x-auto py-6 no-scrollbar">
                  {[
                    { id: 'details', label: 'Craft & Specs', icon: Sparkles },
                    { id: 'story', label: 'The Artisan Journey', icon: BookOpen },
                    { id: 'shipping', label: 'Delivery & Ethics', icon: Globe },
                    { id: 'faqs', label: 'Inquiry', icon: HelpCircle }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`flex items-center gap-3 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${
                        activeTab === tab.id ? 'text-ocean-blue' : 'text-gray-400 hover:text-ocean-blue/60'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ocean-blue rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-48">
              
              {/* 1. Artisan Story Section */}
              <section id="story" className="scroll-mt-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="relative">
                    <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10">
                      <img 
                        src={description.images?.story || "https://images.unsplash.com/photo-1590001158193-790130ae8e2d?w=1200&q=80"} 
                        alt="Artisan at work" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {/* Decorative Background Shape */}
                    <div className="absolute -top-12 -left-12 w-64 h-64 bg-tropical-green/5 rounded-full blur-3xl -z-10 animate-pulse" />
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-ocean-blue/5 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
                    
                    {/* Quote Box */}
                    <div className="absolute -right-8 bottom-12 bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-xs border border-gray-50 z-20 hidden md:block">
                      <Sparkles className="text-tropical-green w-8 h-8 mb-6" />
                      <p className="font-serif italic text-lg text-ocean-blue leading-relaxed">
                        "Every piece we carve carries the soul of Samoa and the rhythm of the tides."
                      </p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100" />
                        <div>
                          <p className="text-[10px] font-black uppercase text-ocean-blue">Malia T.</p>
                          <p className="text-[9px] text-gray-400 uppercase tracking-widest">Master Carver</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <p className="text-[11px] font-black text-tropical-green uppercase tracking-[0.4em] mb-4">The Human Element</p>
                      <h2 className="font-serif text-5xl md:text-6xl font-bold text-ocean-blue leading-tight italic">An Artisan Legacy</h2>
                    </div>
                    <div className="prose prose-ocean prose-xl max-w-none text-gray-600 font-serif leading-relaxed space-y-8">
                      {description.story.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-12 pt-10">
                      <div className="space-y-2">
                        <span className="text-4xl font-sans font-black text-ocean-blue">100%</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Handcrafted</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-4xl font-sans font-black text-ocean-blue">3-5</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Days to Craft</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Environmental Impact (Ocean Harmony) */}
              <section className="relative overflow-hidden bg-ocean-blue rounded-[5rem] py-32 px-12 md:px-24">
                {/* Decorative SVG Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                   <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="waves" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M0 50 Q25 40 50 50 T100 50" fill="none" stroke="white" strokeWidth="2" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#waves)" />
                  </svg>
                </div>

                <div className="max-w-5xl mx-auto relative z-10 text-center space-y-16">
                  <div className="space-y-4">
                    <Leaf className="text-tropical-green w-16 h-16 mx-auto mb-8 animate-bounce" />
                    <h2 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight">Woven into the Ecosystem</h2>
                    <p className="font-serif italic text-2xl text-white/60 max-w-2xl mx-auto">
                      Our commitment to the Earth is as deep as the Pacific itself.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {description.environmental.split('\n\n').map((item, i) => {
                      const [title, ...content] = item.split('\n');
                      return (
                        <div key={i} className="bg-white/5 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/10 flex flex-col items-center gap-6 group hover:bg-white/10 transition-all duration-500">
                          <div className="w-16 h-16 rounded-full bg-tropical-green flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                            {i === 0 ? <RefreshCw /> : i === 1 ? <Shield /> : <Droplets />}
                          </div>
                          <h4 className="text-xl font-serif font-bold text-white italic">{title.replace(/\*\*/g, '').trim()}</h4>
                          <p className="text-sm font-serif text-white/70 leading-relaxed">
                            {content.join('\n').replace(/\*\*/g, '').trim()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* 3. Partnership Model Section */}
              <section className="scroll-mt-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="order-2 lg:order-1 space-y-12">
                    <div>
                      <p className="text-[11px] font-black text-tropical-green uppercase tracking-[0.4em] mb-4">Empowerment + Partnership</p>
                      <h2 className="font-serif text-5xl md:text-6xl font-bold text-ocean-blue leading-tight">Shared Prosperity</h2>
                    </div>
                    <div className="prose prose-ocean prose-xl max-w-none text-gray-600 font-serif leading-relaxed">
                      {description.partnership.split('\n\n').map((para, i) => (
                        <p key={i} className={i === 0 ? 'text-2xl font-bold text-ocean-blue italic border-l-4 border-tropical-green pl-8' : ''}>
                          {para.replace(/\*\*/g, '')}
                        </p>
                      ))}
                    </div>
                    <ul className="space-y-6 pt-6">
                      {['Direct artisan profit sharing (60%)', 'Health & Education micro-grants', 'Traditional skills preservation'].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-ocean-blue font-serif text-lg font-bold">
                          <div className="w-8 h-8 rounded-full bg-tropical-green/10 flex items-center justify-center text-tropical-green">
                            <Check size={16} />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="order-1 lg:order-2">
                    <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative group">
                      <img 
                        src={description.images?.partnership || "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=1200&q=80"} 
                        alt="Artisan Partnership" 
                        className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0" 
                      />
                      <div className="absolute inset-0 bg-ocean-blue/20 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-1000" />
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white pointer-events-none group-hover:opacity-0 transition-opacity">
                        <Users className="w-24 h-24 mx-auto mb-6 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Village Collective</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Features & 5. Specifications (Grid Layout) */}
              <section id="details" className="scroll-mt-40 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-[4rem] p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-50 group hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-tropical-green/10 flex items-center justify-center text-tropical-green shadow-sm">
                      <Zap size={28} />
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-ocean-blue italic">Signature Features</h3>
                  </div>
                  <ul className="grid grid-cols-1 gap-8">
                    {description.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-6 group/item">
                        <div className="mt-2 w-2 h-2 rounded-full bg-tropical-green group-hover/item:scale-[2] transition-transform" />
                        <span className="text-xl font-serif text-gray-600 leading-relaxed group-hover/item:text-ocean-blue transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-ocean-blue rounded-[4rem] p-16 shadow-[0_40px_100px_-20px_rgba(0,10,30,0.2)] text-white group hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-white shadow-sm">
                      <Ruler size={28} />
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-white italic">Specifications</h3>
                  </div>
                  <dl className="space-y-10">
                    {Object.entries(description.specifications).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b border-white/10 pb-6 group/spec">
                        <dt className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2 group-hover/spec:text-tropical-green transition-colors">{key}</dt>
                        <dd className="text-xl font-serif text-white/90 leading-relaxed">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>

              {/* 6. Guarantee & 7. Shipping Policy (Full Width Cards) */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative group overflow-hidden rounded-[4rem] bg-white p-16 border border-gray-100 shadow-xl">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-tropical-green/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 flex flex-col gap-10">
                    <div className="w-16 h-16 rounded-[2rem] bg-tropical-green/10 flex items-center justify-center text-tropical-green">
                      <ShieldCheck size={32} />
                    </div>
                    <div className="space-y-6">
                      <h3 className="font-serif text-4xl font-bold text-ocean-blue italic">Artisan Guarantee</h3>
                      <div className="text-lg font-serif text-gray-500 leading-relaxed space-y-4">
                        {description.guarantee.split('\n\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-tropical-green mt-4">
                      <Award size={16} /> Certified Authentic Craft
                    </div>
                  </div>
                </div>

                <div id="shipping" className="relative group overflow-hidden rounded-[4rem] bg-white p-16 border border-gray-100 shadow-xl">
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-ocean-blue/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 flex flex-col gap-10">
                    <div className="w-16 h-16 rounded-[2rem] bg-ocean-blue/10 flex items-center justify-center text-ocean-blue">
                      <Truck size={32} />
                    </div>
                    <div className="space-y-6">
                      <h3 className="font-serif text-4xl font-bold text-ocean-blue italic">Delivery & Returns</h3>
                      <div className="text-lg font-serif text-gray-500 leading-relaxed">
                        {description.shipping.split('\n\n').map((item, i) => (
                          <p key={i} className="mb-4">{item.replace(/\*\*/g, '')}</p>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-4">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-ocean-blue">
                        <Package size={14} /> Eco-Packaging
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-ocean-blue">
                        <RefreshCw size={14} /> 30-Day Returns
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. FAQ Section (Luxury Grid Layout) */}
              <section id="faqs" className="scroll-mt-40">
                <div className="text-center mb-24">
                  <p className="text-[11px] font-black text-tropical-green uppercase tracking-[0.5em] mb-6">Concierge Support</p>
                  <h2 className="font-serif text-5xl md:text-7xl font-bold text-ocean-blue italic">Frequently Inquired</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {description.faqs.map((faq, idx) => (
                    <div 
                      key={idx} 
                      className="group bg-white rounded-[3rem] p-12 border border-gray-50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-10 h-10 rounded-full bg-ocean-blue/5 flex items-center justify-center text-ocean-blue shrink-0 group-hover:bg-ocean-blue group-hover:text-white transition-colors">
                          <HelpCircle size={18} />
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xl font-serif font-bold text-ocean-blue leading-tight group-hover:text-tropical-green transition-colors">{faq.question}</h4>
                          <p className="text-gray-500 font-serif leading-relaxed italic">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-20 text-center">
                  <p className="font-serif text-gray-400 italic mb-8">Need further assistance with your selection?</p>
                  <button className="bg-ocean-blue text-white px-12 py-5 rounded-full font-sans font-black uppercase tracking-[0.3em] text-xs hover:bg-tropical-green transition-all shadow-xl">
                    Contact Our Concierge
                  </button>
                </div>
              </section>

              {/* 9. Reviews Section (Luxury Grid of Cards) */}
              <section className="pt-24 border-t border-gray-100">
                <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
                  <div className="space-y-6">
                    <p className="text-[11px] font-black text-tropical-green uppercase tracking-[0.5em]">The Collective Voice</p>
                    <h2 className="font-serif text-5xl md:text-7xl font-bold text-ocean-blue italic leading-tight">Artisan Appreciation</h2>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-4 bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 min-w-[280px]">
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
                  {reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="bg-white rounded-[3.5rem] p-12 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col gap-8 group hover:-translate-y-3 transition-all duration-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ocean-blue to-tropical-green flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-ocean-blue text-lg">{review.author}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{review.createdAt}</span>
                              {review.isVerified && (
                                <span className="flex items-center gap-1 text-[8px] font-black text-tropical-green uppercase tracking-tighter">
                                  <Check size={8} /> Verified Collector
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Sparkles className="absolute -top-4 -left-4 text-tropical-green/10 w-12 h-12 -z-10 group-hover:scale-150 transition-transform duration-1000" />
                        <p className="text-gray-600 font-serif text-lg leading-relaxed italic">
                          "{review.body}"
                        </p>
                      </div>

                      {review.image && (
                        <div className="mt-auto pt-8">
                          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                            <img src={review.image} alt="Customer Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                        <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-ocean-blue transition-colors">
                          <Heart size={12} /> Was this helpful? ({review.helpfulCount})
                        </button>
                        <button className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-ocean-blue transition-colors">Report</button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-20 flex justify-center">
                  <button className="group flex items-center gap-4 text-ocean-blue font-sans font-black uppercase tracking-[0.4em] text-[10px] bg-white border border-gray-100 px-10 py-5 rounded-full shadow-lg hover:shadow-2xl transition-all">
                    Load More appreciations <Plus size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                </div>
              </section>

              {/* Complete the Look (Upsell) */}
              <CompleteTheLook recommendations={recommendations} />

              <div className="text-center py-24 border-t border-gray-100 mt-20">
                <p className="font-serif italic text-gray-400 mb-12">Drawn to more Pacific treasures?</p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-6 text-ocean-blue font-serif text-3xl font-bold hover:text-tropical-green transition-all group"
                >
                  <span className="w-16 h-0.5 bg-ocean-blue group-hover:w-24 transition-all" />
                  Explore the Full Collection
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Floating Add to Cart for Mobile/Scroll */}
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${isHovering ? 'scale-0 translate-y-20 opacity-0' : 'scale-100 translate-y-0 opacity-100'} lg:hidden`}>
           <button 
            onClick={handleAddToCart}
            className="bg-ocean-blue text-white px-10 py-5 rounded-full font-sans font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl flex items-center gap-4 backdrop-blur-md"
          >
            <ShoppingCart size={16} /> ${product.price_usd.toFixed(2)} — Add to Cart
          </button>
        </div>
      </div>
    </>
  )
}
