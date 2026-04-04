import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ShoppingCart, Star, Truck, MapPin, Package, AlertTriangle, ChevronRight, Minus, Plus, Info, Zap, Leaf, Users, Ruler, ShieldCheck, BookOpen, HelpCircle, Heart, Globe, Award } from 'lucide-react'
import { shopifyClient, getProductByHandle } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import { useGeoLocation, useShipping } from '../hooks/useShipping'
import { getProductDescription } from '../data/productDescriptions'

// URL 参数 → Shopify handle 映射表
// 左侧是 URL 中可能出现的值，右侧是对应的 Shopify 商品 handle
const URL_TO_SHOPIFY_HANDLE: Record<string, string> = {
  // 简短别名映射
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
  'samoan-handcrafted-natural-shell-coasters': 'samoan-handcrafted-natural-shell-coasters',
  // 沙滩包 - Shopify handle: handwoven-papua-new-guinea-beach-bag
  'beachbag': 'handwoven-papua-new-guinea-beach-bag',
  'beach-bag': 'handwoven-papua-new-guinea-beach-bag',
  'handwoven-beach-bag': 'handwoven-papua-new-guinea-beach-bag',
  // 门垫 - Shopify handle: natural-coir-handwoven-coconut-palm-doormat
  'doormat': 'natural-coir-handwoven-coconut-palm-doormat',
  'coir-doormat': 'natural-coir-handwoven-coconut-palm-doormat',
  'natural-coir-doormat': 'natural-coir-handwoven-coconut-palm-doormat',
  // 中文名称映射
  '手工椰子碗': 'samoan-handcrafted-coconut-bowl',
  '编织篮': 'samoan-woven-basket',
  '天然肥皂': 'natural-coconut-soap',
  '草编手工托特包': 'samoan-handwoven-grass-tote-bag',
  '萨摩亚手工贝壳项链': 'samoan-handcrafted-shell-necklace',
  '沙滩包': 'handwoven-beach-bag',
  '椰棕门垫': 'natural-coir-doormat',
  // 完整 Shopify handle（直接匹配）
  'samoan-handcrafted-coconut-bowl': 'samoan-handcrafted-coconut-bowl',
  'samoan-handwoven-grass-tote-bag': 'samoan-handwoven-grass-tote-bag',
  'samoan-handcrafted-shell-necklace': 'samoan-handcrafted-shell-necklace',
  'samoan-woven-basket': 'samoan-woven-basket',
  'natural-coconut-soap': 'natural-coconut-soap',
  'tapa-cloth-wall-art': 'tapa-cloth-wall-art',
}

// Shopify handle → 本地描述内容 handle 映射表
const SHOPIFY_HANDLE_TO_DESCRIPTION: Record<string, string> = {
  'samoan-handcrafted-coconut-bowl': 'coconutbowl',
  'samoan-handwoven-grass-tote-bag': 'woven-tote',
  'samoan-handcrafted-shell-necklace': 'shell-necklace',
  'samoan-woven-basket': 'wovenbasket',
  'natural-coconut-soap': 'naturalsoap',
  'tapa-cloth-wall-art': 'tapa-cloth',
  // 沙滩包 - 支持短别名和完整 handle
  'handwoven-beach-bag': 'beachbag',
  'handwoven-papua-new-guinea-beach-bag': 'beachbag',
  // 门垫 - 支持短别名和完整 handle
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
}

interface Review {
  id: string;
  rating: number;
  author: string;
  body: string;
  createdAt: string;
  image?: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  console.log('[ProductDetailPage] URL param id:', id)
  // URL 参数 → Shopify handle
  const shopifyHandle = id ? (URL_TO_SHOPIFY_HANDLE[id] || id) : ''
  console.log('[ProductDetailPage] Mapped shopifyHandle:', shopifyHandle)
  // Shopify handle → 本地描述内容 handle
  const descriptionHandle = shopifyHandle ? (SHOPIFY_HANDLE_TO_DESCRIPTION[shopifyHandle] || shopifyHandle) : ''
  console.log('[ProductDetailPage] descriptionHandle:', descriptionHandle)
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [countryOverride, setCountryOverride] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const zoomContainerRef = useRef<HTMLDivElement>(null)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // ✅ 优化图片 URL（与 ProductListPage 保持一致）
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

  // ✅ 新增：从 JSON 配置文件加载用户编辑的内容
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

  // ✅ 合并自定义内容和默认内容（自定义优先）
  const getContent = (field: string) => {
    if (!customContent) return null
    return customContent[field]
  }

  // SEO: Product Schema 生成函数
  const getProductSchema = (product: Product, reviews: Review[]) => {
    const averageRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0"

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.images.filter(Boolean),
      "description": product.description.replace(/<[^>]*>/g, ''),
      "brand": {
        "@type": "Brand",
        "name": "EcoMafola Peace"
      },
      "material": "Natural Materials",
      "origin": "Samoa",
      "sku": product.sku || product.handle,
      "offers": {
        "@type": "Offer",
        "price": product.price_usd,
        "priceCurrency": "USD",
        "availability": product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 30,
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "Worldwide"
          },
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
              "maxValue": 15,
              "unitCode": "d"
            }
          }
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating,
        "reviewCount": reviews.length.toString()
      }
    }
  }

  // SEO: BreadcrumbList Schema 生成函数
  const getBreadcrumbSchema = (product: Product) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": `${origin}/products`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": `${origin}/products/${product.sku}`
        }
      ]
    }
  }

  // Mock reviews data - ✅ 优先使用自定义评价
  const reviews: Review[] = customContent?.reviews?.map((r: any) => ({
    id: r.id,
    rating: r.rating,
    author: r.author,
    body: r.content,
    createdAt: r.date,
    image: r.image,
  })) || [
    { id: '1', rating: 5, author: 'Sarah M.', body: 'Absolutely beautiful handcrafted bowl! The natural coconut material feels so authentic and the craftsmanship is exceptional. Perfect for serving fruit or as a decorative piece.', createdAt: '2024-03-15', image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=200&h=200&fit=crop' },
    { id: '2', rating: 5, author: 'James K.', body: 'Love supporting traditional Samoan craftsmanship. This coconut bowl exceeded my expectations - smooth finish, perfect size, and it looks stunning on my dining table.', createdAt: '2024-03-10', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop' },
    { id: '3', rating: 4, author: 'Emily R.', body: 'Great quality and fast shipping to Australia. The only minor thing is that each bowl has slight natural variations, but that actually adds to its unique charm.', createdAt: '2024-03-05' },
    { id: '4', rating: 5, author: 'Michael T.', body: 'Bought this as a gift for my wife who loves eco-friendly products. She absolutely adores it! The packaging was also very thoughtful and sustainable.', createdAt: '2024-02-28', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop' },
    { id: '5', rating: 5, author: 'Lisa Chen', body: 'These bowls are not just functional but also conversation starters. Everyone who visits asks where I got them. Truly appreciate the fair trade aspect.', createdAt: '2024-02-20' },
    { id: '6', rating: 4, author: 'David Park', body: 'Solid craftsmanship and good value for handmade items. The natural varnish gives it a nice sheen. Would recommend for anyone looking for sustainable kitchenware.', createdAt: '2024-02-15', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' }
  ]

  useEffect(() => {
    if (!shopifyHandle && !descriptionHandle) return
    setLoading(true)
    const fetchProduct = async () => {
      try {
        console.log('[ProductDetailPage] Fetching product:', shopifyHandle)
        let shopifyProduct = null
        let apiError = null
        
        if (shopifyHandle) {
          try {
            shopifyProduct = await getProductByHandle(shopifyHandle)
            console.log('[ProductDetailPage] Shopify API result:', shopifyProduct ? 'Found' : 'Not found')
            if (!shopifyProduct) {
              console.error('[ProductDetailPage] Product not found in Shopify. Handle:', shopifyHandle)
              console.error('[ProductDetailPage] Please check in Shopify Admin:')
              console.error('  1. Product status is Active (not Draft)')
              console.error('  2. Online Store sales channel is enabled')
              console.error('  3. Product has inventory > 0')
            }
          } catch (error) {
            apiError = error
            console.error('[ProductDetailPage] Shopify API error:', error)
          }
        }
        
        // ✅ 删除本地 fallback：强制所有产品图片和数据从 Shopify API 拉取
        // 如果 Shopify 返回 null，说明产品未上架或未启用 Online Store 渠道
        if (!shopifyProduct) {
          console.error('Product not found in Shopify API. Handle:', shopifyHandle)
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
            image_url: shopifyProduct.images.edges[0]?.node.url || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
            images: shopifyProduct.images.edges.map((edge: any) => edge.node.url) || ['https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80'],
            tag: shopifyProduct.tags[0] || 'Handmade',
            weight_kg: parseFloat(firstVariant?.weight?.toString() || '0.5') / 1000,
            variants: shopifyProduct.variants
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

  const handleAddToCart = async () => {
    if (!product) return
    const firstVariantId = product.variants?.edges[0]?.node.id
    if (!firstVariantId) return
    await shopifyAddToCart(firstVariantId)
    setAdded(true)
    setTimeout(() => { setAdded(false) }, 800)
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

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin" /></div>
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="text-gray-500 font-serif">Product not found.</p><Link to="/products" className="text-ocean-blue underline text-sm font-serif">← Back to Products</Link></div>

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <>
      <Helmet>
        {/* 基础 Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="EcoMafola Peace" />
        <meta property="og:locale" content="en_US" />

        {/* 产品标题和描述 */}
        <meta property="og:title" content={`${product.name} | EcoMafola Peace`} />
        <meta property="og:description" content={product.description.replace(/<[^>]*>/g, '') || `Handcrafted ${product.name} from Samoa`} />

        {/* 产品图片（使用专用社交分享图或产品主图） */}
        <meta property="og:image" content={product.images[0] || product.image_url} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${product.name} - Handcrafted from Samoa`} />

        {/* 产品 URL */}
        <meta property="og:url" content={`${origin}/products/${product.sku}`} />

        {/* 产品专用标签 */}
        <meta property="product:price:amount" content={product.price_usd.toString()} />
        <meta property="product:price:currency" content="USD" />
        <meta property="product:availability" content={product.stock > 0 ? "instock" : "outofstock"} />
        <meta property="product:brand" content="EcoMafola Peace" />
        <meta property="product:category" content="Home & Kitchen > Kitchen & Dining > Tableware" />
        <meta property="product:condition" content="new" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ecomafola" />
        <meta name="twitter:creator" content="@ecomafola" />
        <meta name="twitter:title" content={`${product.name} | EcoMafola Peace`} />
        <meta name="twitter:description" content={product.description.replace(/<[^>]*>/g, '') || `Handcrafted ${product.name} from Samoa`} />
        <meta name="twitter:image" content={product.images[0] || product.image_url} />
        <meta name="twitter:image:alt" content={`${product.name} - Handcrafted from Samoa`} />

        {/* 可选：Twitter 产品标签 */}
        <meta name="twitter:label1" content="Price" />
        <meta name="twitter:data1" content={`$${product.price_usd}`} />
        <meta name="twitter:label2" content="Availability" />
        <meta name="twitter:data2" content={product.stock > 0 ? "In Stock" : "Out of Stock"} />
      </Helmet>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getProductSchema(product, reviews))}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(getBreadcrumbSchema(product))}
      </script>

      <div className="min-h-screen bg-coral-white pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs font-serif text-gray-400">
          <Link to="/" className="hover:text-ocean-blue">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-ocean-blue">Products</Link>
          <ChevronRight size={12} />
          <span className="text-ocean-blue">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Multi-angle Product Images */}
          <div className="space-y-4">
            <div ref={zoomContainerRef} className="relative aspect-square rounded-3xl overflow-hidden shadow-xl cursor-zoom-in group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => { setIsHovering(false); setZoomPosition({ x: 50, y: 50 }) }} onMouseMove={handleMouseMove}>
              <img ref={imageRef} src={optimizeImageUrl((product.images.length > 1 ? product.images : [product.image_url])[selectedImageIndex] || product.image_url, 1200, 85)} alt={product.name} className="w-full h-full object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`, transform: isHovering ? 'scale(2)' : 'scale(1)', transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.3s ease' }} />
              {isHovering && <div className="absolute inset-0 border-2 border-white/50 rounded-3xl pointer-events-none" style={{ left: `${zoomPosition.x - 25}%`, top: `${zoomPosition.y - 25}%`, width: '50%', height: '50%' }} />}
              <span className="absolute top-5 left-5 bg-tropical-green text-white text-xs font-serif font-semibold px-3 py-1 rounded-full">{product.tag}</span>
              <div className={`absolute bottom-5 right-5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
                <Info size={12} className="text-ocean-blue" /><span className="text-xs font-serif text-gray-700">Hover to zoom</span>
              </div>
            </div>
            {/* Thumbnail strip - 使用真实的多张图片 */}
            <div className="grid grid-cols-5 gap-3">
              {(product.images.length > 1 ? product.images : [product.image_url]).slice(0, 5).map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleThumbnailClick(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${selectedImageIndex === idx ? 'border-ocean-blue ring-2 ring-ocean-blue/20' : 'border-gray-200 hover:border-ocean-blue'}`}
                >
                  <img src={optimizeImageUrl(img, 400, 75)} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" sizes="(max-width: 768px) 20vw, 15vw" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 relative">
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-gray-200/40 to-transparent rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <p className="text-xs font-serif text-tropical-green font-semibold uppercase tracking-widest mb-2">{product.category.replace(/-/g, ' ')}</p>
              <h1 className="font-serif text-3xl font-bold text-ocean-blue mb-2">{product.name}</h1>
              <p className="text-sm font-serif text-gray-500">{product.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}</div>
              <span className="text-sm font-serif text-gray-500">4.9 ({reviews.length} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl font-bold text-ocean-blue">${product.price_usd}</span>
              <span className="text-sm font-serif text-gray-400">USD · incl. taxes</span>
            </div>
            <div className="text-sm font-serif text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                <span className="px-4 font-serif font-semibold text-ocean-blue">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors"><Plus size={14} /></button>
              </div>
              <button onClick={handleAddToCart} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-serif font-semibold text-sm transition-all duration-300 ${added ? 'bg-tropical-green text-white' : 'bg-ocean-blue text-white hover:bg-tropical-green'}`}>
                <ShoppingCart size={16} />{added ? '✓ Added' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-serif font-semibold text-sm bg-tropical-green text-white hover:bg-ocean-blue transition-all duration-300">
                <Zap size={16} />Buy Now
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-ocean-blue" /><span className="font-serif font-semibold text-sm text-ocean-blue">Shipping to</span>
                  {geo && !countryOverride && (<span className="text-xs font-serif text-tropical-green font-medium">({geo.city}, {geo.country})</span>)}
                </div>
                <select value={countryOverride || geo?.country_code || ''} onChange={e => setCountryOverride(e.target.value)} className="text-xs font-serif border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-ocean-blue/30">
                  {[['AU','Australia'],['NZ','New Zealand'],['US','United States'],['GB','United Kingdom'],['CA','Canada'],['JP','Japan'],['SG','Singapore'],['DE','Germany'],['FR','France'],['CN','China'],['WS','Samoa'],['FJ','Fiji'],['AE','UAE'],['KR','South Korea'],['ID','Indonesia']].map(([code, name]) => (<option key={code} value={code}>{name}</option>))}
                </select>
              </div>
              {geo && !countryOverride && (<div className="flex items-center gap-2 text-xs font-serif text-gray-500"><MapPin size={11} className="text-tropical-green" /><span>Auto-detected: <strong>{geo.city}, {geo.country}</strong> {geo.is_local && '(local IP)'}</span></div>)}
              {geoLoading && <p className="text-xs text-gray-400 font-serif">Detecting your location…</p>}
              {shipLoading && <p className="text-xs text-gray-400 font-serif animate-pulse">Calculating shipping…</p>}
              {shipping && !shipLoading && (
                shipping.supported ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-serif"><span className="text-gray-500">Base shipping fee</span><span className="font-medium">${shipping.base_fee_usd?.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm font-serif"><span className="text-gray-500">Weight fee ({shipping.total_weight_kg}kg)</span><span className="font-medium">${shipping.weight_fee_usd?.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm font-serif font-semibold border-t border-gray-100 pt-2"><span className="text-ocean-blue">Total Shipping</span><span className="text-ocean-blue">${shipping.total_shipping_usd?.toFixed(2)}</span></div>
                    <div className="flex items-center gap-1.5 text-xs font-serif text-gray-400 pt-1"><Package size={11} /><span>{shipping.carrier} · {shipping.estimated_days}</span></div>
                  </div>
                ) : (
                  <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    <div><p className="text-xs font-serif font-semibold text-amber-700 mb-1">Shipping not available</p><p className="text-xs font-serif text-amber-600">{shipping.message}</p>{shipping.alternatives?.map((a, i) => <p key={i} className="text-xs font-serif text-amber-600 mt-1">• {a}</p>)}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Detailed Content Sections - UI 改版：左图右文布局 */}
      {description && (
        <div className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Brand Mission Banner - 纯色卡片背景 */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm">
            <div className="p-12 text-center">
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6 leading-tight">Our Mission, Your Impact</h2>
              <div className="prose prose-lg max-w-3xl mx-auto">
                <p className="text-xl font-serif text-gray-700 leading-relaxed mb-6">At EcoMafola Peace, we create meaningful handcrafted products that empower Samoan artisans with fair wages and preserve their rich cultural heritage. Each item is skillfully handmade using renewable, eco-friendly materials such as coconut shells, pandanus leaves and natural fibers, supporting environmental protection and reducing waste.</p>
                <p className="text-xl font-serif text-gray-700 leading-relaxed mb-6">Every purchase directly improves livelihoods, strengthens local communities, and helps fund education, healthcare and village development. By choosing our crafts, you join a global movement for ethical, transparent trade that honors both people and the planet.</p>
                <p className="text-xl font-serif text-gray-700 leading-relaxed">Together, we protect traditional skills, support sustainable livelihoods, and make commerce a powerful force for good in the Pacific Islands.</p>
              </div>
            </div>
          </div>

          {/* Reviews Section - 三列卡片式评价展示 */}
          <section>
            <div className="mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Customer Reviews</h2>
              <p className="text-lg font-serif text-gray-600 mt-3 leading-relaxed">What our customers say about our products</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => {
                // 生成默认头像：取姓名的首字母缩写 + 背景色
                const getInitials = (name: string) => {
                  const parts = name.trim().split(' ')
                  if (parts.length >= 2) {
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                  }
                  return name.slice(0, 2).toUpperCase()
                }
                const getColorClass = (name: string) => {
                  const colors = [
                    'bg-rose-200 text-rose-700',
                    'bg-amber-200 text-amber-700',
                    'bg-emerald-200 text-emerald-700',
                    'bg-teal-200 text-teal-700',
                    'bg-blue-200 text-blue-700',
                    'bg-indigo-200 text-indigo-700',
                    'bg-violet-200 text-violet-700',
                    'bg-fuchsia-200 text-fuchsia-700',
                    'bg-pink-200 text-pink-700',
                  ]
                  const index = name.charCodeAt(0) % colors.length
                  return colors[index]
                }
                const initials = getInitials(review.author)
                const colorClass = getColorClass(review.author)

                return (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={16} className={`${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}</div>
                      </div>
                      {/* 头像：有图片则显示图片，否则显示默认头像 */}
                      {review.image ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                          <img src={review.image} alt="Review avatar" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${colorClass}`}>
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <p className="font-serif font-semibold text-gray-900">{review.author}</p>
                      <p className="text-xs font-serif text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <p className="text-sm font-serif text-gray-600 leading-relaxed">{review.body}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 1. Product Story - 右图左文，交替布局 */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 flex flex-col lg:order-1">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {getContent('story')?.title || description.title}
              </h2>
              {getContent('story')?.subtitle && (
                <p className="text-lg font-serif text-gray-600 leading-relaxed">{getContent('story').subtitle}</p>
              )}
              {!getContent('story')?.subtitle && description.subtitle && (
                <p className="text-lg font-serif text-gray-600 leading-relaxed">{description.subtitle}</p>
              )}
              <div className="prose prose-lg max-w-none flex-grow">
                {getContent('story')?.content ? (
                  getContent('story').content.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-gray-700 leading-loose mb-6">{paragraph}</p>
                  ))
                ) : (
                  description.story.split('\\n\\n').map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 leading-loose mb-6">{paragraph}</p>
                  ))
                )}
              </div>
            </div>
            <div className="relative group lg:order-2">
              <div className="absolute -inset-2 bg-gradient-to-br from-tropical-green/20 to-ocean-blue/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                {getContent('story')?.image ? (
                  <img src={getContent('story').image} alt="Product Story" className="w-full h-full object-cover" />
                ) : description.images?.story ? (
                  <img src={description.images.story} alt="Product Story" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No image available</div>
                )}
              </div>
            </div>
          </section>

          {/* 2. Environmental Impact - 左图右文，文字顶部对齐且不超出图片边界 */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              {getContent('environmental')?.image ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={getContent('environmental').image} alt="Environmental Impact" className="w-full h-full object-cover" />
                </div>
              ) : description.images?.environmental ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={description.images.environmental} alt="Environmental Impact" className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>
            <div className="space-y-6 flex flex-col">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {getContent('environmental')?.title || 'Environmental Impact'}
                </h2>
                {getContent('environmental')?.subtitle && (
                  <p className="text-lg font-serif text-gray-600 mt-3 leading-relaxed">{getContent('environmental').subtitle}</p>
                )}
                {!getContent('environmental')?.subtitle && (
                  <p className="text-lg font-serif text-gray-600 mt-3 leading-relaxed">How our products benefit the planet</p>
                )}
              </div>
              <div className="prose prose-lg max-w-none flex-grow">
                {getContent('environmental')?.content ? (
                  getContent('environmental').content.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-gray-700 leading-loose mb-6">{paragraph}</p>
                  ))
                ) : (
                  description.environmental.split('\\n\\n').map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 leading-loose mb-6">{paragraph.replace(/\*\*/g, '')}</p>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* 3. Partnership Model - 左图右文，文字顶部对齐且不超出图片边界 */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              {getContent('partnership')?.image ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={getContent('partnership').image} alt="Partnership Model" className="w-full h-full object-cover" />
                </div>
              ) : description.images?.partnership ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={description.images.partnership} alt="Partnership Model" className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>
            <div className="space-y-6 flex flex-col">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {getContent('partnership')?.title || 'Our Partnership Model'}
                </h2>
                {getContent('partnership')?.subtitle && (
                  <p className="text-lg font-serif text-gray-600 mt-3 leading-relaxed">{getContent('partnership').subtitle}</p>
                )}
                {!getContent('partnership')?.subtitle && (
                  <p className="text-lg font-serif text-gray-600 mt-3 leading-relaxed">Fair trade that empowers communities</p>
                )}
              </div>
              <div className="prose prose-lg max-w-none flex-grow">
                {getContent('partnership')?.content ? (
                  getContent('partnership').content.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-gray-700 leading-loose mb-6">{paragraph}</p>
                  ))
                ) : (
                  description.partnership.split('\\n\\n').map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 leading-loose mb-6">{paragraph.replace(/^[*-] /, '').replace(/\*\*/g, '')}</p>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* 4. Specifications - 左图右文，文字顶部对齐且不超出图片边界 */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              {getContent('specifications')?.image ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={getContent('specifications').image} alt="Specifications" className="w-full h-full object-cover" />
                </div>
              ) : description.images?.specifications ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={description.images.specifications} alt="Specifications" className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>
            <div className="space-y-4 flex flex-col">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {getContent('specifications')?.title || 'Specifications'}
                </h2>
              </div>
              <div className="space-y-2 flex-grow">
                {getContent('specifications')?.content ? (
                  Object.entries(getContent('specifications').content).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex gap-3 py-2 border-b border-dashed border-gray-300 last:border-b-0">
                      <dt className="text-sm font-serif text-tropical-green uppercase tracking-wider font-semibold w-28 flex-shrink-0">{key}</dt>
                      <dd className="text-gray-800 font-serif leading-relaxed text-base flex-1">{String(value)}</dd>
                    </div>
                  ))
                ) : (
                  <>
                    {[{ label: 'Size', value: description.specifications.size }, { label: 'Weight', value: description.specifications.weight }, { label: 'Material', value: description.specifications.material }, { label: 'Origin', value: description.specifications.origin }, { label: 'Care Instructions', value: description.specifications.care }].map((spec, idx) => (
                      <div key={idx} className="flex gap-3 py-2 border-b border-dashed border-gray-300 last:border-b-0">
                        <dt className="text-sm font-serif text-tropical-green uppercase tracking-wider font-semibold w-28 flex-shrink-0">{spec.label}</dt>
                        <dd className="text-gray-800 font-serif leading-relaxed text-base flex-1">{spec.value}</dd>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>

          {/* 5. Quality Guarantee - 左图右文，文字顶部对齐且不超出图片边界 */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              {getContent('guarantee')?.image ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={getContent('guarantee').image} alt="Quality Guarantee" className="w-full h-full object-cover" />
                </div>
              ) : description.images?.guarantee ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={description.images.guarantee} alt="Quality Guarantee" className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>
            <div className="space-y-6 flex flex-col">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {getContent('guarantee')?.title || 'Quality Guarantee'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none flex-grow">
                {getContent('guarantee')?.content ? (
                  getContent('guarantee').content.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-gray-700 leading-loose mb-6">{paragraph}</p>
                  ))
                ) : (
                  description.guarantee.split('\\n\\n').map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 leading-loose mb-6">{paragraph}</p>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* 6. FAQs - 纯文字通栏布局 */}
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
                {getContent('faqs')?.title || 'Frequently Asked Questions'}
              </h2>
              {getContent('faqs')?.subtitle && (
                <p className="text-lg font-serif text-gray-600 mt-3 leading-relaxed">{getContent('faqs').subtitle}</p>
              )}
              {!getContent('faqs')?.subtitle && (
                <p className="text-lg font-serif text-gray-600 mt-3 leading-relaxed">Everything you need to know about our products</p>
              )}
            </div>
            <div className="space-y-6">
              {getContent('faqs')?.content ? (
                getContent('faqs').content.map((faq: any, idx: number) => (
                  <div key={idx} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                    <dt className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold">Q</span>
                      <span className="font-serif font-semibold text-gray-800 text-lg">{faq.question}</span>
                    </dt>
                    <dd className="ml-11 text-gray-600 font-serif leading-relaxed text-base">{faq.answer}</dd>
                  </div>
                ))
              ) : (
                description.faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                    <dt className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold">Q</span>
                      <span className="font-serif font-semibold text-gray-800 text-lg">{faq.question}</span>
                    </dt>
                    <dd className="ml-11 text-gray-600 font-serif leading-relaxed text-base">{faq.answer}</dd>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Final CTA */}
          <div className="text-center py-12">
            <Link to="/products" className="inline-flex items-center gap-2 text-ocean-blue font-serif font-semibold hover:text-tropical-green transition-colors">← Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
