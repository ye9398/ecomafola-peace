import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ShoppingCart, Star, Filter, Search as SearchIcon, ArrowRight, Heart } from 'lucide-react'
import { getProductsByCollection, getAllProducts, searchProducts } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import SlideOverCheckout from '../components/SlideOverCheckout'

const CATEGORIES = [
  { slug: '', label: 'All Treasures' },
  { slug: 'shell-jewelry', label: 'Shell Jewelry' },
  { slug: 'wood-carvings', label: 'Artisan Carvings' },
  { slug: 'coconut-bowls', label: 'Coconut Bowls' },
  { slug: 'woven-baskets', label: 'Woven Crafts' },
  { slug: 'coasters', label: 'Hand-woven Coasters' },
  { slug: 'incense-holders', label: 'Incense Holders' },
  { slug: 'natural-soaps', label: 'Island Soaps' },
  { slug: 'textiles', label: 'Traditional Textiles' },
]

// ✅ 优化 Shopify 图片 URL - 添加尺寸和质量参数
function optimizeImageUrl(url: string, width: number = 665, quality: number = 80): string {
  if (!url || url.includes('unsplash.com')) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}width=${width}&quality=${quality}`
}

export default function ProductListPage() {
  const { category } = useParams<{ category?: string }>()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q')
  const [products, setProducts] = useState<any[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)

  const canonicalUrl = category
    ? `https://ecomafola.com/products/category/${category}`
    : searchQuery
      ? `https://ecomafola.com/products?q=${encodeURIComponent(searchQuery)}`
      : 'https://ecomafola.com/products'

  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}" | EcoMafola Peace`
    : category
      ? `${CATEGORIES.find(c => c.slug === category)?.label || 'Collection'} | EcoMafola Peace`
      : 'All Products | EcoMafola Peace'

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let productsData: any[] | null = []

        if (searchQuery) {
          productsData = await searchProducts(searchQuery)
        } else if (category) {
          productsData = await getProductsByCollection(category)
        } else {
          productsData = await getAllProducts()
        }

        const mapProduct = (product: any) => ({
          id: product.id,
          sku: product.handle,
          name: product.title,
          subtitle: product.productType || 'Handcrafted',
          tag: 'Artisan',
          price_usd: parseFloat(product.priceRange?.minVariantPrice?.amount || '0'),
          image_url: optimizeImageUrl(product.images?.edges[0]?.node?.url || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80', 665),
          weight_kg: 0.2,
          available: product.variants?.edges[0]?.node?.availableForSale ?? true,
          variantId: product.variants?.edges[0]?.node?.id,
        })

        const productList = productsData?.map(mapProduct) || []
        setProducts(productList)

        // If no products found in a category, fetch some recommendations
        if (productList.length === 0) {
          const all = await getAllProducts()
          setRecommendedProducts(all?.slice(0, 4).map(mapProduct) || [])
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    // Scroll to top when category/search changes
    window.scrollTo(0, 0)
  }, [category, searchQuery])

  return (
    <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        <title>{pageTitle}</title>
        <meta name="description" content={searchQuery ? `Search results for ${searchQuery}` : 'Browse our collection of handcrafted Pacific treasures'} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageTitle,
            "url": canonicalUrl,
            "breadcrumb": {
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
                }
              ]
            }
          })}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <p className="text-xs font-sans font-bold text-tropical-green tracking-widest uppercase mb-3 animate-fade-in">
            {searchQuery ? 'Search Discovery' : 'Pacific Heritage Collection'}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ocean-blue mb-4 animate-fade-in-up">
            {searchQuery 
              ? `Results for "${searchQuery}"` 
              : (CATEGORIES.find(c => c.slug === (category || ''))?.label || 'The Full Collection')
            }
          </h1>
          <p className="max-w-2xl text-ocean-blue/60 font-sans text-sm md:text-base leading-relaxed animate-fade-in-up delay-100">
            Small, high-margin, and soulfully handcrafted. Each piece supports artisan communities across the Pacific islands.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-full border border-gray-100 backdrop-blur-sm">
            <Filter size={14} className="text-ocean-blue/40 ml-3 shrink-0" />
            {CATEGORIES.map(cat => (
              <Link 
                key={cat.slug} 
                to={cat.slug ? `/products/category/${cat.slug}` : '/products'}
                className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-tight transition-all duration-300 ${
                  !searchQuery && (category || '') === cat.slug 
                    ? 'bg-ocean-blue text-white shadow-lg scale-105' 
                    : 'bg-transparent text-ocean-blue/70 hover:bg-white hover:text-ocean-blue'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-tropical-green/20 border-t-tropical-green rounded-full animate-spin mb-4" />
            <p className="font-sans text-sm font-bold text-ocean-blue/40 animate-pulse">Sourcing artisan treasures...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="space-y-16">
            <div className="text-center py-20 bg-white rounded-[2rem] shadow-xl shadow-ocean-blue/5 border border-gray-50 max-w-4xl mx-auto px-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sand-beige/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-tropical-green/5 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="relative z-10">
                <SearchIcon size={64} className="mx-auto text-ocean-blue/10 mb-6" />
                <h2 className="font-serif text-3xl text-ocean-blue mb-4 font-bold">No treasures found</h2>
                <p className="text-ocean-blue/60 font-sans max-w-md mx-auto mb-10 leading-relaxed italic">
                  "The tide hasn't brought this in yet." <br />
                  Try searching for <span className="text-tropical-green font-bold underline decoration-2 underline-offset-4 cursor-pointer">Earrings</span>, <span className="text-tropical-green font-bold underline decoration-2 underline-offset-4 cursor-pointer">Coconut</span>, or <span className="text-tropical-green font-bold underline decoration-2 underline-offset-4 cursor-pointer">Carvings</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link to="/products" className="bg-ocean-blue text-white px-10 py-4 rounded-full text-sm font-bold font-sans hover:bg-tropical-green transition-all shadow-xl hover:shadow-tropical-green/20 hover:-translate-y-1">
                    Explore All Treasures
                  </Link>
                  <button onClick={() => window.history.back()} className="px-10 py-4 rounded-full text-sm font-bold font-sans text-ocean-blue border border-ocean-blue/10 hover:bg-gray-50 transition-all">
                    Go Back
                  </button>
                </div>
              </div>
            </div>

            {recommendedProducts.length > 0 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif text-2xl font-bold text-ocean-blue">You Might Also Love</h3>
                  <Link to="/products" className="text-sm font-sans font-bold text-tropical-green flex items-center gap-2 group">
                    Shop All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedProducts.map(p => (
                    <ProductCard key={p.id} p={p} addToCart={addToCart} setIsSlideOverOpen={setIsSlideOverOpen} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((p, index) => (
              <ProductCard 
                key={p.id} 
                p={p} 
                index={index}
                addToCart={addToCart} 
                setIsSlideOverOpen={setIsSlideOverOpen} 
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Slide-over Checkout */}
      <SlideOverCheckout 
        isOpen={isSlideOverOpen} 
        onClose={() => setIsSlideOverOpen(false)} 
      />
    </div>
  )
}

function ProductCard({ p, index = 0, addToCart, setIsSlideOverOpen }: { p: any, index?: number, addToCart: any, setIsSlideOverOpen: any }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full border border-transparent hover:border-gray-50 animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${p.sku}`} className="block relative aspect-square overflow-hidden shrink-0">
        <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className="bg-white/90 backdrop-blur-md text-ocean-blue text-[10px] font-sans font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg transform group-hover:-translate-y-1 transition-transform">
            {p.tag}
          </span>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-coral-pink shadow-lg hover:bg-coral-pink hover:text-white transition-all transform hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100">
            <Heart size={18} />
          </button>
        </div>
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-ocean-blue/20 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[10px] font-sans font-black text-ocean-blue/30 ml-1 uppercase tracking-tighter">Verified Choice</span>
        </div>

        <p className="text-[10px] font-sans font-black text-tropical-green uppercase tracking-widest mb-2 opacity-70">{p.subtitle}</p>
        <Link to={`/product/${p.sku}`} className="flex-1">
          <h3 className="font-serif text-xl font-bold text-ocean-blue mb-3 group-hover:text-tropical-green transition-colors leading-tight line-clamp-2">
            {p.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-auto pt-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-sans font-bold text-ocean-blue/40 uppercase tracking-widest mb-0.5">Price</span>
            <span className="font-serif text-2xl font-bold text-ocean-blue">${p.price_usd}</span>
          </div>
          <button 
            onClick={() => { 
              addToCart(p.variantId)
              setIsSlideOverOpen(true) 
            }}
            disabled={!p.available}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
              p.available 
                ? 'bg-ocean-blue text-white hover:bg-tropical-green hover:shadow-tropical-green/30 active:scale-90 hover:rotate-12' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
            aria-label={p.available ? 'Add to Cart' : 'Sold Out'}
          >
            {p.available ? <ShoppingCart size={24} /> : <XIcon size={24} />}
          </button>
        </div>
      </div>
    </div>
  )
}

function XIcon({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  )
}
