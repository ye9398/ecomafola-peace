import { Link } from 'react-router-dom'
import { ShoppingCart, Star, ArrowRight } from 'lucide-react'
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
    <>
      <section className="py-20 bg-sand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="font-sans text-xs font-medium text-ocean-blue tracking-[0.2em] uppercase mb-3 border-b-2 border-tropical-green inline-block pb-1">
                Featured Collection
              </p>
              <h2 className="section-title">Treasures from the Pacific</h2>
            </div>
            <Link to="/products" className="font-sans text-sm font-medium text-ocean-blue hover:text-tropical-green transition-colors duration-200 underline underline-offset-4 flex items-center gap-2 group">
              View All Products
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            // 加载中骨架屏
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white shadow-md animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const image = product.images?.edges?.[0]?.node
                const price = product.priceRange?.minVariantPrice?.amount
                const currency = product.priceRange?.minVariantPrice?.currencyCode
                const variantId = product.variants?.edges?.[0]?.node?.id

                return (
                  <div
                    key={product.id}
                    className="bg-white group relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link to={`/product/${product.handle}`} className="block">
                      <div className="relative aspect-square overflow-hidden cursor-pointer">
                        <img
                          src={image?.url || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&q=80'}
                          alt={image?.altText || product.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-tropical-green text-white text-xs font-sans font-semibold px-3 py-1.5 rounded-full shadow-sm">
                            Featured
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="p-5">
                      <Link to={`/product/${product.handle}`}>
                        <h3 className="font-serif text-lg font-semibold text-ocean-blue mb-2 hover:text-tropical-green transition-colors cursor-pointer line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className="fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-ocean-blue/10">
                        <span className="font-serif text-xl font-semibold text-ocean-blue">
                          {currency} {parseFloat(price).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(variantId)}
                          className="flex items-center gap-2 bg-ocean-blue text-white text-xs font-sans font-medium px-4 py-2.5 rounded-none hover:bg-tropical-green transition-colors duration-200 border-2 border-transparent shadow-sm"
                        >
                          <ShoppingCart size={13} />
                          Add to Cart
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
    </>
  )
}