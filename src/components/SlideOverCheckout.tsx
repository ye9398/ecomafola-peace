import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function SlideOverCheckout() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, goToCheckout, shipping } = useCart()

  const lines = cart?.lines.edges.map(e => e.node) || []

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
      <div className="fixed top-0 right-0 h-full w-full sm:w-[66.666%] lg:w-[66.666%] max-w-5xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in">
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

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-sans mb-4">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lines.map(line => (
                <div key={line.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                  <img
                    src={line.merchandise.product.images.edges[0]?.node.url || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=200&q=80'}
                    alt={line.merchandise.product.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <div className="flex-1 min-w-0">
                   <p className="font-sans font-medium text-gray-800 truncate">{line.merchandise.product.title}</p>
                   <p className="text-xs font-sans text-gray-500">
                      ${parseFloat(line.merchandise.price.amount).toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="font-sans font-semibold text-ocean-blue">
                      ${(parseFloat(line.merchandise.price.amount) * line.quantity).toFixed(2)}
                    </span>

                    {/* Quantity Controls with +/- buttons */}
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-4 font-sans font-semibold text-ocean-blue text-sm">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                       <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(line.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Shipping Estimation */}
        {lines.length > 0 && (
         <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-gray-500">Subtotal</span>
              <span className="font-sans font-semibold text-gray-800">
                ${cart?.cost?.subtotalAmount?.amount || cart?.cost?.totalAmount?.amount || '0.00'}
              </span>
            </div>

            {/* Shipping Estimation */}
            {shipping && (
              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping to {shipping.country_code}</span>
                  <span className="font-semibold">
                    {shipping.supported
                      ? `$${shipping.total_shipping_usd?.toFixed(2)}`
                      : 'Not available'
                    }
                  </span>
                </div>
                {shipping.supported && shipping.estimated_days && (
                  <p className="text-xs text-gray-500">
                    Estimated delivery: {shipping.estimated_days} days
                  </p>
                )}
              </div>
            )}

            {/* Total with Shipping */}
            <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
              <span className="font-serif text-base font-semibold text-gray-800">Total</span>
              <div className="text-right">
                <span className="font-serif text-xl font-bold text-ocean-blue">
                  ${(() => {
                    const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || cart?.cost?.totalAmount?.amount || '0');
                    const shippingCost = shipping?.supported ? (shipping.total_shipping_usd || 0) : 0;
                    return (subtotal + shippingCost).toFixed(2);
                  })()}
                </span>
                <p className="text-xs text-gray-400">{cart?.cost?.totalAmount?.currencyCode || 'USD'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl font-sans font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
             <button
                onClick={goToCheckout}
                className="flex-1 bg-ocean-blue text-white py-3.5 rounded-xl font-sans font-semibold text-sm hover:bg-tropical-green transition-colors"
              >
                Proceed to Checkout →
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
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
