import { Link } from 'react-router-dom'
import { ShoppingCart, Star, ArrowRight, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState, useEffect, useRef } from 'react'
import { getFeaturedProducts } from '../lib/shopify'
import { OptimizedImage } from './OptimizedImage'

export default function Products() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .finally(() => setLoading(false))

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleAddToCart = async (variantId: string) => {
    await addToCart(variantId)
  }

  return (
    <section ref={sectionRef} className="py-24 bg-[#F0E8DC] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sand-beige/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tropical-green/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-20">
          <div className={`max-w-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-blue/5 border border-ocean-blue/10 mb-6">
              <span className="w-1.5 h-1.5 bg-tropical-green rounded-full animate-pulse" />
              <p className="font-sans text-[10px] font-black text-ocean-blue uppercase tracking-[0.2em]">
                Artisan Spotlight
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-ocean-blue mb-8 leading-[1.1]">
              Small Treasures,<br /><span className="italic text-tropical-green font-normal whitespace-nowrap">Big Soul</span>
            </h2>
            <p className="font-sans text-ocean-blue/60 leading-relaxed text-base md:text-lg max-w-xl">
              Curated handcrafted treasures from South Pacific artisans. Small, exquisite, and ethically sourced. Perfect for those who carry the ocean's rhythm in their heart.
            </p>
          </div>
          <Link 
            to="/products" 
            className={`shrink-0 flex items-center gap-3 font-sans text-xs font-black uppercase tracking-widest text-ocean-blue hover:text-tropical-green transition-all group pb-2 border-b-2 border-transparent hover:border-tropical-green ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Explore Collection
            <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] shadow-sm animate-pulse border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-50" />
                <div className="p-8 space-y-4">
                  <div className="h-3 bg-gray-50 rounded w-1/2" />
                  <div className="h-6 bg-gray-50 rounded w-full" />
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
                  className={`bg-white group relative rounded-[2.5rem] overflow-hidden border border-transparent hover:border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <Link to={`/product/${product.handle}`} className="block relative aspect-square overflow-hidden shrink-0">
                    <OptimizedImage
                      src={image?.url || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80'}
                      alt={image?.altText || product.title}
                      preset="card"
                      loading="lazy"
                      className="w-full h-full transition-transform duration-[2000ms] group-hover:scale-110 ease-out"
                    />
                    
                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-ocean-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                      <span className="bg-white/90 backdrop-blur-md text-ocean-blue text-[9px] font-black font-sans px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg transform group-hover:-translate-y-1 transition-transform">
                        {product.productType || 'Artisan'}
                      </span>
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-coral-pink shadow-lg hover:bg-coral-pink hover:text-white transition-all transform hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100">
                        <Heart size={18} />
                      </button>
                    </div>

                    {/* Quick Add Button Overlay (visible on desktop hover) */}
                    <div className="absolute inset-x-5 bottom-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10 hidden md:block">
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(variantId)
                        }}
                        disabled={!isAvailable}
                        className="w-full bg-white/90 backdrop-blur-md text-ocean-blue py-3 rounded-2xl font-sans font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-tropical-green hover:text-white transition-all"
                      >
                        Quick Add to Cart
                      </button>
                    </div>
                  </Link>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[9px] font-black text-ocean-blue/30 ml-2 uppercase tracking-tighter">Small Batch</span>
                    </div>

                    <Link to={`/product/${product.handle}`} className="flex-1">
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-ocean-blue mb-4 hover:text-tropical-green transition-colors cursor-pointer line-clamp-2 leading-[1.2]">
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
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl active:scale-95 ${
                          isAvailable
                            ? 'bg-ocean-blue text-white hover:bg-tropical-green hover:shadow-tropical-green/30 hover:rotate-12'
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  )
}
