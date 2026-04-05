import React from 'react'
import { ShoppingCart, Tag, Plus, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

interface UpsellProduct {
  id: string
  title: string
  handle: string
  price: string
  image: string
  variantId: string
}

interface UpsellSectionsProps {
  product: any
  recommendations: any[]
  onAddToCart: (variantId: string) => void
}

export const VolumeDiscount = ({ product }: { product: any }) => {
  // Buy 2 for 10% off, Buy 4 or more for 20% off
  // We check if the product has volume discount enabled (via tag or metafield)
  const hasDiscount = product.tags?.includes('upsell:volume_discount') || 
                      product.metafields?.find((m: any) => m.key === 'volume_discount')?.value === 'true'

  if (!hasDiscount) return null

  return (
    <div className="mt-4 p-4 bg-tropical-green/5 border border-tropical-green/10 rounded-2xl flex items-center gap-3 animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-tropical-green shadow-sm">
        <Tag size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black text-tropical-green uppercase tracking-widest mb-0.5">Volume Savings</p>
        <p className="text-xs font-sans font-bold text-ocean-blue">
          Add 2 to save <span className="text-tropical-green">10%</span> • Add 4+ to save <span className="text-tropical-green">20%</span>
        </p>
      </div>
    </div>
  )
}

export const FrequentlyBoughtTogether = ({ recommendations, onAddToCart }: { recommendations: any[], onAddToCart: (id: string) => void }) => {
  if (!recommendations || recommendations.length === 0) return null

  // Take the first 2 recommendations
  const items = recommendations.slice(0, 2)

  return (
    <div className="mt-8 space-y-4">
      <h4 className="font-serif text-sm font-bold text-ocean-blue uppercase tracking-widest flex items-center gap-2">
        Frequently Bought Together
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item: any) => {
          const price = item.priceRange?.minVariantPrice?.amount
          const variantId = item.variants?.edges?.[0]?.node?.id
          const image = item.images?.edges?.[0]?.node?.url

          return (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl hover:border-tropical-green/30 transition-all group">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                <img src={image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-sans font-bold text-ocean-blue truncate">{item.title}</p>
                <p className="text-[10px] font-sans font-black text-ocean-blue/40 uppercase tracking-tighter">${parseFloat(price).toFixed(2)}</p>
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

export const CompleteTheLook = ({ recommendations }: { recommendations: any[] }) => {
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
            <Link 
              key={p.id} 
              to={`/product/${p.handle}`}
              className="group block"
            >
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 mb-4 relative shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img src={image} alt={p.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
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
