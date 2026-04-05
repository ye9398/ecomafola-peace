import { ShoppingCart, X, Minus, Plus, Trash2, Truck, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function SlideOverCheckout() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, goToCheckout, shipping } = useCart()

  const lines = cart?.lines.edges.map(e => e.node) || []
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || cart?.cost?.totalAmount?.amount || '0')
  const FREE_SHIPPING_THRESHOLD = 45
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Slide-over Panel - 2/3 width on large screens */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[66.666%] lg:w-[400px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} className="text-ocean-blue" />
            <h2 className="font-serif text-xl font-semibold text-ocean-blue">Your Cart ({lines.length})</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {lines.length > 0 && (
          <div className="px-6 py-4 bg-ocean-blue/5 border-b border-ocean-blue/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-tropical-green" />
                <span className="text-xs font-sans font-bold text-ocean-blue uppercase tracking-wider">
                  {remaining > 0 
                    ? `Add $${remaining.toFixed(2)} more for FREE shipping` 
                    : 'You unlocked FREE shipping!'}
                </span>
              </div>
              <span className="text-[10px] font-sans font-black text-tropical-green">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-tropical-green transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-sans mb-4">Your cart is empty</p>
              <button 
                onClick={handleClose}
                className="bg-ocean-blue text-white px-8 py-3 rounded-full font-sans font-bold text-sm shadow-lg hover:bg-tropical-green transition-all"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {lines.map(line => (
                <div key={line.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                  <img
                    src={line.merchandise.product.images.edges[0]?.node.url || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=200&q=80'}
                    alt={line.merchandise.product.title}
                    className="w-20 h-20 rounded-xl object-cover shadow-sm"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="font-sans font-bold text-ocean-blue text-sm truncate leading-tight mb-1">{line.merchandise.product.title}</p>
                      <p className="text-[10px] font-sans font-black text-ocean-blue/30 uppercase tracking-widest">
                        ${parseFloat(line.merchandise.price.amount).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white w-fit mt-2">
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        className="px-2 py-1 text-gray-400 hover:text-ocean-blue transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="px-2 font-sans font-bold text-ocean-blue text-xs">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        className="px-2 py-1 text-gray-400 hover:text-ocean-blue transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(line.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="font-serif font-bold text-ocean-blue">
                      ${(parseFloat(line.merchandise.price.amount) * line.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-sans text-ocean-blue/40 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="font-sans font-bold text-ocean-blue">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-sans text-ocean-blue/40 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                <span className={`font-sans font-bold ${remaining <= 0 ? 'text-tropical-green' : 'text-ocean-blue'}`}>
                  {remaining <= 0 ? 'FREE' : (shipping?.supported ? `$${shipping.total_shipping_usd?.toFixed(2)}` : '--')}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <span className="font-serif text-lg font-bold text-ocean-blue">Total</span>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-ocean-blue">
                    ${(() => {
                      const shippingCost = (remaining <= 0) ? 0 : (shipping?.supported ? (shipping.total_shipping_usd || 0) : 0);
                      return (subtotal + shippingCost).toFixed(2);
                    })()}
                  </span>
                  <p className="text-[10px] font-sans font-black text-ocean-blue/20 uppercase tracking-tighter">USD | All taxes included</p>
                </div>
              </div>

              <button
                onClick={goToCheckout}
                className="w-full bg-ocean-blue text-white py-4 rounded-2xl font-sans font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-tropical-green transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group"
              >
                Complete Purchase
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  )
}
