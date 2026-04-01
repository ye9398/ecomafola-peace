import { useState } from 'react'
import { Package, ArrowLeft, Mail, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    setError('')
    
    if (!orderNumber.trim()) {
      setError('Please enter your order number')
      return
    }
    
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setLoading(true)
    
    // 跳转到 Shopify 官方订单查询页
    // 注意：实际 URL 需要根据你的 Shopify 应用调整
    const trackUrl = `https://ecomafola-peace.myshopify.com/apps/trackr?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
    
    window.open(trackUrl, '_blank')
    
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleTrack()
  }

  return (
    <div className="min-h-screen bg-coral-white pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-ocean-blue hover:text-tropical-green font-sans text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-tropical-green/10 rounded-full mb-4">
            <Package size={32} className="text-tropical-green" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ocean-blue mb-3">
            Track Your Order
          </h1>
          <p className="font-sans text-gray-600 max-w-md mx-auto">
            Enter your order number and email address to check the delivery status of your order
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Number */}
            <div>
              <label htmlFor="orderNumber" className="block font-sans text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <div className="relative">
                <input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., EM-2024-001"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-tropical-green focus:border-transparent transition-all"
                />
                <Search 
                  size={18} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block font-sans text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-tropical-green focus:border-transparent transition-all"
                />
                <Mail 
                  size={18} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-sans">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-ocean-blue text-white font-sans font-semibold text-sm rounded-xl hover:bg-tropical-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Track Order
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-sans text-center">
              Need help? Contact us at{' '}
              <a href="mailto:support@ecomafola.com" className="text-tropical-green hover:underline">
                support@ecomafola.com
              </a>
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-sans font-semibold text-ocean-blue mb-2">Where to find your order number?</h3>
            <p className="text-sm text-gray-600 font-sans">
              Your order number is included in the confirmation email sent after purchase
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-sans font-semibold text-ocean-blue mb-2">What email to use?</h3>
            <p className="text-sm text-gray-600 font-sans">
              Use the same email address you provided during checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}