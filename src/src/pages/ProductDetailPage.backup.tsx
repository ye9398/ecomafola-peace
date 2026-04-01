import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Star, Truck, MapPin, Package, AlertTriangle, ChevronRight, Minus, Plus, Info, Zap, Leaf, Users, Ruler, ShieldCheck, BookOpen, HelpCircle } from 'lucide-react'
import { shopifyClient, getProductByHandle } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import { useGeoLocation, useShipping } from '../hooks/useShipping'
import SlideOverCheckout from '../components/SlideOverCheckout'
import { getProductDescription } from '../data/productDescriptions'

// URL handle → productDescriptions handle 映射表
// 支持 Shopify 实际 handle（如 samoan-handcrafted-coconut-bowl）和简化 handle（如 coconut-bowl）
const URL_TO_DESCRIPTION_HANDLE: Record<string, string> = {
  // 新的英文 handle 映射（Shopify 后台当前使用）
  'Coconut Bowl': 'coconutbowl',
  'Grass Tote Bag': 'woven-tote',
  'Shell Necklace': 'shell-necklace',
  'Samoan Woven Basket': 'wovenbasket',
  // Shopify 实际 handle - 完整版本
  'samoan-handcrafted-coconut-bowl': 'coconutbowl',
  'samoan-woven-basket': 'wovenbasket',
  'natural-coconut-soap': 'naturalsoap',
  'samoan-handwoven-grass-tote-bag': 'woven-tote',
  'samoan-handcrafted-shell-necklace': 'shell-necklace',
  'tapa-cloth-wall-art': 'tapa-cloth',
  // Shopify 实际 handle - 简化版本
  'samoan-grass-tote-bag': 'woven-tote',
  'samoan-shell-necklace': 'shell-necklace',
  // 简化 handle（备用）
  'coconut-bowl': 'coconutbowl',
  'woven-basket': 'wovenbasket',
  'natural-soap': 'naturalsoap',
  'grass-tote-bag': 'woven-tote',
  'shell-necklace': 'shell-necklace',
  'tapa-cloth': 'tapa-cloth',
  // 兼容旧的中文 handle映射
  '手工椰子碗': 'coconutbowl',
  '编织篮': 'wovenbasket',
  '天然肥皂': 'naturalsoap',
  '草编手工托特包': 'woven-tote',
  '萨摩亚手工贝壳项链': 'shell-necklace',
  'Tapa Cloth Wall Art': 'tapa-cloth',
  // 直接使用 productDescriptions 中的 handle
  'coconutbowl': 'coconutbowl',
  'wovenbasket': 'wovenbasket',
  'naturalsoap': 'naturalsoap',
  'woven-tote': 'woven-tote',
  'shell-necklace': 'shell-necklace',
  'tapa-cloth': 'tapa-cloth'
}

const PRODUCT_DETAIL_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      productType
      vendor
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            weight
          }
        }
      }
    }
  }
`

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
  tag: string;
  weight_kg: number;
  variants: {
    edges: Array<{
      node: {
        id: string;
        availableForSale: boolean;
        price: {
          amount: string;
        };
        weight?: string;
      };
    }>;
  };
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()

  // URL handle 映射到 productDescriptions handle
  const descriptionHandle = id ? (URL_TO_DESCRIPTION_HANDLE[id] || id) : ''
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [countryOverride, setCountryOverride] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const zoomContainerRef = useRef<HTMLDivElement>(null)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const { addToCart: shopifyAddToCart, goToCheckout } = useCart()
  const navigate = useNavigate()
  const { geo, loading: geoLoading } = useGeoLocation()
  const country = countryOverride || geo?.country_code || null
  // 提取 Shopify Product GID 中的数字 ID
  const numericProductId = product ? parseInt(product.id.split('/').pop() || '0') : 0
  const shippingItems = product ? [{ product_id: numericProductId, quantity: qty }] : []
  const { shipping, loading: shipLoading } = useShipping(country, shippingItems)
  
  // 获取商品详情描述内容（使用英文 handle）
  const description = getProductDescription(descriptionHandle)

  useEffect(() => {
    if (!descriptionHandle) return
    setLoading(true)
    
    const fetchProduct = async () => {
      try {
        // 使用原始 id（Shopify handle）查询 Shopify API
        const shopifyProduct = await getProductByHandle(id)

        if (!shopifyProduct) {
          console.error('Product not found:', id)
          setProduct(null)
        } else {
          // 转换 Shopify 数据为组件需要的格式
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
            image_url: shopifyProduct.images.edges[0]?.node.url || '/placeholder.jpg',
            tag: shopifyProduct.tags[0] || 'Handmade',
            weight_kg: parseFloat(firstVariant?.weight?.toString() || '0.5') / 1000,
            variants: shopifyProduct.variants // 保留完整的 variants 信息
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
  }, [descriptionHandle])

  const handleAddToCart = async () => {
    if (!product) return
    
    // 获取第一个变体的 ID（Shopify 变体 ID）
    const firstVariantId = product.variants?.edges[0]?.node.id
    if (!firstVariantId) return
    
    await shopifyAddToCart(firstVariantId)
    setAdded(true)
    setTimeout(() => { setAdded(false) }, 800)
  }

  const handleBuyNow = async () => {
    if (!product) return
    
    // 获取第一个变体的 ID
    const firstVariantId = product.variants?.edges[0]?.node.id
    if (!firstVariantId) return
    
    await shopifyAddToCart(firstVariantId)
    goToCheckout() // 直接跳转 Shopify 结账页
  }

  // Mouse move handler for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomContainerRef.current || !imageRef.current) return
    
    const rect = zoomContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
     <p className="text-gray-500 font-sans">Product not found.</p>
      <Link to="/products" className="text-ocean-blue underline text-sm font-sans">← Back to Products</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-coral-white pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs font-sans text-gray-400">
          <Link to="/" className="hover:text-ocean-blue">Home</Link>
          <ChevronRight size={12} />
         <Link to="/products" className="hover:text-ocean-blue">Products</Link>
          <ChevronRight size={12} />
         <span className="text-ocean-blue">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image with Zoom Effect */}
          <div 
            ref={zoomContainerRef}
            className="relative aspect-square rounded-3xl overflow-hidden shadow-xl cursor-zoom-in group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => { setIsHovering(false); setZoomPosition({ x: 50, y: 50 }) }}
            onMouseMove={handleMouseMove}
          >
            <img 
              ref={imageRef}
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isHovering ? 'scale(2)' : 'scale(1)',
                transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.3s ease'
              }}
            />
            {/* Zoom overlay indicator */}
            {isHovering && (
              <div className="absolute inset-0 border-2 border-white/50 rounded-3xl pointer-events-none"
                   style={{
                     left: `${zoomPosition.x - 25}%`,
                     top: `${zoomPosition.y - 25}%`,
                     width: '50%',
                     height: '50%'
                   }}
              />
            )}
            <span className="absolute top-5 left-5 bg-tropical-green text-white text-xs font-sans font-semibold px-3 py-1 rounded-full">{product.tag}</span>
           <div className={`absolute bottom-5 right-5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
              <Info size={12} className="text-ocean-blue" />
              <span className="text-xs font-sans text-gray-700">Hover to zoom</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 relative">
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-gray-200/40 to-transparent rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <p className="text-xs font-sans text-tropical-green font-semibold uppercase tracking-widest mb-2">{product.category.replace(/-/g, ' ')}</p>
              <h1 className="font-serif text-3xl font-bold text-ocean-blue mb-2">{product.name}</h1>
              <p className="text-sm font-sans text-gray-500">{product.subtitle}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) =><Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}</div>
              <span className="text-sm font-sans text-gray-500">4.9 (87 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl font-bold text-ocean-blue">${product.price_usd}</span>
              <span className="text-sm font-sans text-gray-400">USD · incl. taxes</span>
            </div>

            {/* Description */}
            <div 
              className="text-sm font-sans text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Qty + Cart + Buy Now */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                <span className="px-4 font-sans font-semibold text-ocean-blue">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors"><Plus size={14} /></button>
              </div>
              <button onClick={handleAddToCart} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-sans font-semibold text-sm transition-all duration-300 ${added ? 'bg-tropical-green text-white' : 'bg-ocean-blue text-white hover:bg-tropical-green'}`}>
                <ShoppingCart size={16} />
                {added ? '✓ Added' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-sans font-semibold text-sm bg-tropical-green text-white hover:bg-ocean-blue transition-all duration-300">
                <Zap size={16} />
                Buy Now
              </button>
            </div>

            {/* ── Shipping Section ───────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Truck size={16} className="text-ocean-blue" />
                  <span className="font-sans font-semibold text-sm text-ocean-blue">Shipping to</span>
                  {geo && !countryOverride && (
                    <span className="text-xs font-sans text-tropical-green font-medium">
                      ({geo.city}, {geo.country})
                    </span>
                  )}
                </div>
                {/* Country override */}
                <select value={countryOverride || geo?.country_code || ''} onChange={e => setCountryOverride(e.target.value)}
                  className="text-xs font-sans border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-ocean-blue/30">
                  {[['AU','Australia'],['NZ','New Zealand'],['US','United States'],['GB','United Kingdom'],['CA','Canada'],['JP','Japan'],['SG','Singapore'],['DE','Germany'],['FR','France'],['CN','China'],['WS','Samoa'],['FJ','Fiji'],['AE','UAE'],['KR','South Korea'],['ID','Indonesia']].map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>

              {/* IP auto-detect notice - simplified */}
              {geo && !countryOverride && (
                <div className="flex items-center gap-2 text-xs font-sans text-gray-500">
                  <MapPin size={11} className="text-tropical-green" />
                  <span>Auto-detected: <strong>{geo.city}, {geo.country}</strong> {geo.is_local && '(local IP)'}</span>
                </div>
              )}
              {geoLoading && <p className="text-xs text-gray-400 font-sans">Detecting your location…</p>}

              {/* Shipping result */}
              {shipLoading && <p className="text-xs text-gray-400 font-sans animate-pulse">Calculating shipping…</p>}
              {shipping && !shipLoading && (
                shipping.supported ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-sans">
                      <span className="text-gray-500">Base shipping fee</span>
                      <span className="font-medium">${shipping.base_fee_usd?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-sans">
                      <span className="text-gray-500">Weight fee ({shipping.total_weight_kg}kg)</span>
                      <span className="font-medium">${shipping.weight_fee_usd?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-sans font-semibold border-t border-gray-100 pt-2">
                      <span className="text-ocean-blue">Total Shipping</span>
                      <span className="text-ocean-blue">${shipping.total_shipping_usd?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-sans text-gray-400 pt-1">
                      <Package size={11} />
                      <span>{shipping.carrier} · {shipping.estimated_days}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-sans font-semibold text-amber-700 mb-1">Shipping not available</p>
                     <p className="text-xs font-sans text-amber-600">{shipping.message}</p>
                      {shipping.alternatives?.map((a, i) => <p key={i} className="text-xs font-sans text-amber-600 mt-1">• {a}</p>)}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>


        {/* Slide-over Checkout */}
        <SlideOverCheckout />

        {/* Product Detailed Content Sections - 八大区块 */}
        {description && (
          <div className="max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Section Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ocean-blue/30 to-transparent"></div>
              <Leaf size={20} className="text-tropical-green" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ocean-blue/30 to-transparent"></div>
            </div>

            {/* 1. Product Story - 产品故事 */}
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tropical-green to-ocean-blue flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
               <h2 className="font-serif text-2xl md:text-3xl font-bold text-ocean-blue">{description.title}</h2>
              </div>
             <p className="text-lg font-sans text-gray-600 leading-relaxed mb-4">{description.subtitle}</p>
              <div className="prose prose-slate max-w-none">
                {description.story.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 leading-loose mb-4">{paragraph}</p>
                ))}
              </div>
              {description.images?.story && (
                <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
                 <img src={description.images.story} alt="Product Story" className="w-full h-auto object-cover" />
                </div>
              )}
            </section>

            {/* 2. Environmental Impact - 环保价值 */}
            <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 border border-emerald-100">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                 <Leaf size={24} className="text-white" />
                </div>
               <h2 className="font-serif text-2xl md:text-3xl font-bold text-emerald-800">Environmental Impact</h2>
              </div>
              <div className="space-y-6">
                {description.environmental.split('\n\n').map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
                      {idx + 1}
                    </div>
                   <div className="flex-1">
                      {item.split('\n').map((line, i) => (
                        <p key={i} className={`text-gray-700 ${i === 0 ? 'font-semibold mb-2' : 'leading-relaxed'}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {description.images?.environmental && (
                <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
                  <img src={description.images.environmental} alt="Environmental Impact" className="w-full h-auto object-cover" />
               </div>
              )}
            </section>

            {/* 3. Partnership Model - 合作模式 */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-blue-800">Our Partnership Model</h2>
              </div>
             <div className="space-y-6">
                {description.partnership.split('\n\n').map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                      {idx + 1}
                    </div>
                   <div className="flex-1">
                      {item.split('\n').map((line, i) => (
                        <p key={i} className={`text-gray-700 ${i === 0 ? 'font-semibold mb-2' : 'leading-relaxed'}`}>{line.replace(/^[*-] /, '')}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {description.images?.partnership && (
               <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
                 <img src={description.images.partnership} alt="Partnership Model" className="w-full h-auto object-cover" />
               </div>
              )}
           </section>

            {/* 4. Features - 产品特点 */}
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral-pink to-orange-400 flex items-center justify-center">
                  <Star size={24} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-ocean-blue">Features & Benefits</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {description.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-coral-pink/10 hover:to-orange-400/10 transition-all duration-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-coral-pink to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                      ✓
                    </div>
                   <span className="text-gray-700 font-sans leading-relaxed">{feature.replace(/^[^]+ /, '')}</span>
                  </div>
                ))}
              </div>
              {description.images?.features && (
                <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
                 <img src={description.images.features} alt="Features & Benefits" className="w-full h-auto object-cover" />
              </div>
              )}
            </section>

            {/* 5. Specifications - 规格说明 */}
           <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Ruler size={24} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-ocean-blue">Specifications</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: 'Size', value: description.specifications.size },
                  { label: 'Weight', value: description.specifications.weight },
                  { label: 'Material', value: description.specifications.material },
                  { label: 'Origin', value: description.specifications.origin },
                  { label: 'Care Instructions', value: description.specifications.care }
                ].map((spec, idx) => (
                  <div key={idx} className="border-l-4 border-ocean-blue pl-4 py-2">
                    <dt className="text-xs font-sans text-gray-500 uppercase tracking-wider mb-1">{spec.label}</dt>
                   <dd className="text-gray-800 font-sans leading-relaxed">{spec.value}</dd>
                  </div>
                ))}
              </div>
              {description.images?.specifications && (
                <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
                 <img src={description.images.specifications} alt="Specifications" className="w-full h-auto object-cover" />
                </div>
              )}
           </section>

            {/*6. Quality Guarantee - 质量保证 */}
           <section className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 md:p-12 border border-amber-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-amber-800">Quality Guarantee</h2>
              </div>
              <div className="prose prose-amber max-w-none">
                {description.guarantee.split('\n\n').map((paragraph, idx) => (
                 <p key={idx} className="text-gray-700 leading-loose mb-4">{paragraph}</p>
                ))}
              </div>
              {description.images?.guarantee && (
                <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
                 <img src={description.images.guarantee} alt="Quality Guarantee" className="w-full h-auto object-cover" />
               </div>
              )}
           </section>

            {/* 7. Shipping Info - 运输信息 */}
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center">
                 <Truck size={24} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-ocean-blue">Shipping & Delivery</h2>
              </div>
              <div className="prose prose-sky max-w-none">
                {description.shipping.split('\n\n').map((paragraph, idx) => (
                 <div key={idx} className="mb-6">
                    {paragraph.split('\n').map((line, i) => (
                      <p key={i} className={`text-gray-700 ${line.startsWith('**') ? 'font-semibold mb-2' : 'leading-relaxed'}`}>
                        {line.replace(/\*\*/g, '')}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
              {description.images?.shipping && (
              <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
                <img src={description.images.shipping} alt="Shipping & Delivery" className="w-full h-auto object-cover" />
               </div>
              )}
            </section>

            {/* 8. FAQs - 常见问题 */}
           <section className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-gray-600 flex items-center justify-center">
                 <HelpCircle size={24} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-800">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {description.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                   <dt className="flex items-start gap-3 mb-3">
                     <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">Q</span>
                      <span className="font-sans font-semibold text-gray-800">{faq.question}</span>
                    </dt>
                    <dd className="ml-9 text-gray-600 font-sans leading-relaxed">{faq.answer}</dd>
                  </div>
                ))}
              </div>
              {description.images?.faqs && (
             <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
               <img src={description.images.faqs} alt="Frequently Asked Questions" className="w-full h-auto object-cover" />
               </div>
              )}
            </section>

            {/* Final CTA */}
            <div className="text-center py-12">
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 text-ocean-blue font-sans font-semibold hover:text-tropical-green transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
