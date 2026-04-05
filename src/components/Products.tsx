import { Link } from 'react-router-dom'
import { ShoppingCart, Star, ArrowRight, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState, useEffect } from 'react'
import { getFeaturedProducts } from '../lib/shopify'

export default function Products() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const handleAddToCart = async (variantId: string) => {
    await addToCart(variantId)
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sand-beige/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-tropical-green/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-blue/5 border border-ocean-blue/10 mb-6">
              <span className="w-1.5 h-1.5 bg-tropical-green rounded-full animate-pulse" />
              <p className="font-sans text-[10px] font-black text-ocean-blue uppercase tracking-[0.2em]">
                Artisan Spotlight
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-ocean-blue mb-6">
              Small Treasures, <span className="italic text-tropical-green font-normal">Big Soul</span>
            </h2>
            <p className="font-sans text-ocean-blue/60 leading-relaxed text-sm md:text-base max-w-xl">
              Curated handcrafted treasures from South Pacific artisans. Small, exquisite, and ethically sourced. Perfect for those who carry the ocean's rhythm in their heart.
            </p>
          </div>
          <Link to="/products" className="shrink-0 flex items-center gap-3 font-sans text-xs font-black uppercase tracking-widest text-ocean-blue hover:text-tropical-green transition-all group pb-2 border-b-2 border-transparent hover:border-tropical-green">
            Explore Collection
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] shadow-sm animate-pulse border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-50" />
                <div className="p-6 space-y-4">
                  <div className="h-3 bg-gray-50 rounded w-1/2" />
                  <div className="h-5 bg-gray-50 rounded w-full" />
                  <div className="h-4 bg-gray-50 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {products.map((product, index) => {
              const image = product.images?.edges?.[0]?.node
              const price = product.priceRange?.minVariantPrice?.amount
              const variantId = product.variants?.edges?.[0]?.node?.id
              const isAvailable = product.variants?.edges?.[0]?.node?.availableForSale

              return (
                <div
                  key={product.id}
                  className="bg-white group relative rounded-[2.5rem] overflow-hidden border border-transparent hover:border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link to={`/product/${product.handle}`} className="block relative aspect-square overflow-hidden shrink-0">
                    <img
                      src={image?.url || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80'}
                      alt={image?.altText || product.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                      <span className="bg-white/90 backdrop-blur-md text-ocean-blue text-[9px] font-black font-sans px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg transform group-hover:-translate-y-1 transition-transform">
                        {product.productType || 'Artisan'}
                      </span>
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-coral-pink shadow-lg hover:bg-coral-pink hover:text-white transition-all transform hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100">
                        <Heart size={18} />
                      </button>
                    </div>
                  </Link>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[9px] font-black text-ocean-blue/30 ml-2 uppercase tracking-tighter">Small Batch</span>
                    </div>

                    <Link to={`/product/${product.handle}`} className="flex-1">
                      <h3 className="font-serif text-xl font-bold text-ocean-blue mb-4 hover:text-tropical-green transition-colors cursor-pointer line-clamp-2 leading-[1.2]">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mt-auto pt-8 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-ocean-blue/40 uppercase tracking-[0.2em] mb-1">Authentic</span>
                        <span className="font-serif text-2xl font-bold text-ocean-blue">
                          ${parseFloat(price).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(variantId)}
                        disabled={!isAvailable}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl ${
                          isAvailable
                            ? 'bg-ocean-blue text-white hover:bg-tropical-green hover:shadow-tropical-green/30 active:scale-90 hover:rotate-12'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                        title={isAvailable ? 'Add to Cart' : 'Sold Out'}
                      >
                        <ShoppingCart size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
