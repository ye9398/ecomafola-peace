import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Star, Filter } from 'lucide-react'
import { getProductsByCollection, getAllProducts } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import SlideOverCheckout from '../components/SlideOverCheckout'

const CATEGORIES = [
  { slug: '', label: 'All Products' },
  { slug: 'coconut-bowls', label: 'Coconut Bowls' },
  { slug: 'woven-baskets', label: 'Woven Baskets' },
  { slug: 'natural-soaps', label: 'Natural Soaps' },
  { slug: 'wood-carvings', label: 'Wood Carvings' },
  { slug: 'textiles', label: 'Textiles' },
  { slug: 'shell-jewelry', label: 'Shell Jewelry' },
]

export default function ProductListPage() {
  const { category } = useParams<{ category?: string }>()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // 有分类就按 collection 拉，没有分类就拉全部
        const productsData = category 
          ? await getProductsByCollection(category)
          : await getAllProducts()

        const productList = productsData?.map((product: any) => ({
          id: product.id,
          sku: product.handle,
          name: product.title,
          subtitle: product.productType || 'Handcrafted',
          tag: 'Handmade',
          price_usd: parseFloat(product.priceRange.minVariantPrice.amount),
          image_url: product.images.edges[0]?.node.url || '/placeholder.jpg',
          weight_kg: 0.5,
          available: product.variants.edges[0]?.node.availableForSale ?? true,
          variantId: product.variants.edges[0]?.node.id, // Shopify Variant GID
        })) || []
        
        setProducts(productList)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  return (
    <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-sans font-medium text-tropical-green tracking-widest uppercase mb-2">Pacific Collection</p>
          <h1 className="font-serif text-4xl font-bold text-ocean-blue">
            {CATEGORIES.find(c => c.slug === (category || ''))?.label || 'All Products'}
          </h1>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter size={14} className="text-gray-400 shrink-0" />
          {CATEGORIES.map(cat => (
            <Link 
              key={cat.slug} 
              to={cat.slug ? `/products/${cat.slug}` : '/products'}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-sans font-medium transition-all duration-200 ${
                (category || '') === cat.slug 
                  ? 'bg-ocean-blue text-white' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-ocean-blue hover:text-ocean-blue'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <Link to={`/product/${p.sku}`} className="block relative aspect-square overflow-hidden">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 bg-tropical-green text-white text-xs font-sans font-semibold px-2.5 py-1 rounded-full">{p.tag}</span>
                </Link>
                <div className="p-4">
                  <p className="text-xs font-sans text-gray-400 mb-1">{p.subtitle}</p>
                  <Link to={`/product/${p.sku}`}>
                    <h3 className="font-serif text-base font-semibold text-ocean-blue mb-2 hover:text-tropical-green transition-colors">{p.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-sans text-gray-400 ml-1">4.9</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-ocean-blue">${p.price_usd}</span>
                    <button 
                      onClick={() => { 
                        addToCart(p.variantId)
                        setIsSlideOverOpen(true) 
                      }}
                      disabled={!p.available}
                      className={`flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-2 rounded-full transition-colors ${
                        p.available 
                          ? 'bg-ocean-blue text-white hover:bg-tropical-green' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={12} /> {p.available ? 'Add' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
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
