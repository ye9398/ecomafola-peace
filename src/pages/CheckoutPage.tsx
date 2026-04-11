import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ShieldCheck, Truck, CreditCard, Info, AlertTriangle, CheckCircle, ExternalLink, Minus, Plus, Trash2, MapPin, ShoppingCart, Mail, User, Home, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useGeoLocation, useShipping } from '../hooks/useShipping'
import { api } from '../services/api'
import { OptimizedImage } from '../components/OptimizedImage'

const getStates = (countryCode: string): string[] => {
  const states: Record<string, string[]> = {
    US: ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
    AU: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
    GB: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    CA: ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba'],
    NZ: ['Auckland', 'Wellington', 'Canterbury', 'Waikato', 'Otago']
  }
  return states[countryCode] || []
}

const StripeIcon = () => (
  <svg viewBox="0 0 50 50" className="w-6 h-6">
    <rect fill="#635BFF" width="50" height="50" rx="8"/>
    <text x="25" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">stripe</text>
  </svg>
)

const PayPalIcon = () => (
  <svg viewBox="0 0 50 50" className="w-6 h-6">
    <rect fill="#003087" width="50" height="50" rx="8"/>
    <text x="25" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">PayPal</text>
  </svg>
)

const ApplePayIcon = () => (
  <svg viewBox="0 0 50 50" className="w-6 h-6">
    <rect fill="#000000" width="50" height="50" rx="8"/>
    <text x="25" y="30" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold"></text>
  </svg>
)

const GooglePayIcon = () => (
  <svg viewBox="0 0 50 50" className="w-6 h-6">
    <rect fill="#FFFFFF" width="50" height="50" rx="8"/>
    <text x="25" y="20" textAnchor="middle" fill="#4285F4" fontSize="10" fontWeight="bold">G</text>
    <text x="25" y="34" textAnchor="middle" fill="#5F6368" fontSize="8" fontWeight="500">Pay</text>
  </svg>
)

const UnionPayIcon = () => (
  <svg viewBox="0 0 50 50" className="w-6 h-6">
    <rect fill="#E31837" width="50" height="50" rx="8"/>
    <text x="25" y="22" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">UnionPay</text>
    <text x="25" y="34" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">银联</text>
  </svg>
)

const PAYMENT_METHODS = [
  { id: 'stripe', label: 'Credit / Debit Card', icon: StripeIcon, desc: 'Visa, Mastercard, Amex via Stripe', redirectUrl: 'https://checkout.stripe.com' },
  { id: 'paypal', label: 'PayPal', icon: PayPalIcon, desc: 'PayPal Buyer Protection', redirectUrl: 'https://www.paypal.com/checkout' },
  { id: 'applepay', label: 'Apple Pay', icon: ApplePayIcon, desc: 'Touch ID / Face ID secured', redirectUrl: 'https://www.apple.com/apple-pay/' },
  { id: 'googlepay', label: 'Google Pay', icon: GooglePayIcon, desc: 'Tokenized payment', redirectUrl: 'https://pay.google.com/gp/web/checkout' },
  { id: 'unionpay', label: 'UnionPay', icon: UnionPayIcon, desc: 'UnionPay International', redirectUrl: 'https://www.unionpayintl.com' },
]

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, goToCheckout } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'review'|'payment'|'address'|'confirm'>('review')
  const [payMethod, setPayMethod] = useState('stripe')
  const [terms, setTerms] = useState<Record<string, any>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [contactEmail, setContactEmail] = useState(user?.email || '')
  const [address, setAddress] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    line1: '', 
    line2: '',
    city: '', 
    state: '',
    postal: '', 
    country: '',
    phone: '',
    phoneCountryCode: '+1'
  })
  const [placing, setPlacing] = useState(false)
  const [orderNo, setOrderNo] = useState<string | null>(null)
  const { geo } = useGeoLocation()
  
  // 适配新的购物车数据结构
  const items = cart?.lines?.edges?.map(edge => ({
    lineId: edge.node.id,  // 购物车行 ID（用于更新/删除）
    id: (edge.node.merchandise.product.id || edge.node.id).split('/').pop() || '0',
    title: edge.node.merchandise.product.title,
    price: parseFloat(edge.node.merchandise.price.amount),
    quantity: edge.node.quantity,
    image: edge.node.merchandise.product.images?.edges?.[0]?.node?.url
  })) || []
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  const shippingItems = items.map(i => ({ product_id: parseInt(i.id) || 0, quantity: i.quantity }))
  const { shipping, loading: shipLoading } = useShipping(countryCode || geo?.country_code || null, shippingItems)

  useEffect(() => {
    if (geo?.country_code && !countryCode) setCountryCode(geo.country_code)
  }, [geo])

  useEffect(() => {
    if (!terms[payMethod]) {
      api.getPaymentTerms(payMethod).then(t => setTerms(prev => ({ ...prev, [payMethod]: t }))).catch(() => {})
    }
  }, [payMethod])

  const subtotal = total;
  const FREE_SHIPPING_THRESHOLD = 45;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const grandTotal = total + (isFreeShipping ? 0 : (shipping?.total_shipping_usd ?? 0))

  const handleQuantityChange = (lineId: string, delta: number) => {
    const item = items.find(i => i.id === lineId)
    if (item) {
      const newQty = Math.max(1, item.quantity + delta)
      updateQuantity(lineId, newQty)
    }
  }

  const handleRemoveItem = (lineId: string) => {
    removeFromCart(lineId)
  }

  const handlePaymentComplete = () => {
    if (!termsAccepted) return
    const paymentMethod = PAYMENT_METHODS.find(pm => pm.id === payMethod)
    if (paymentMethod && paymentMethod.redirectUrl) {
      window.open(paymentMethod.redirectUrl, '_blank')
    }
    setTimeout(() => {
      setStep('address')
    }, 1000)
  }

  const placeOrder = async () => {
    if (!user) { navigate('/login'); return }
    setPlacing(true)
    try {
      const result = await api.createOrder({
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity, price_usd: i.price })),
        shipping_addr: { ...address, country_code: countryCode, email: contactEmail },
        payment_method: payMethod,
        subtotal_usd: total,
        shipping_usd: shipping?.total_shipping_usd ?? 0,
      })
      setOrderNo(result.order_no)
      clear()
      setStep('confirm')
    } catch (err: any) {
      alert(err.message)
    } finally { setPlacing(false) }
  }

  if (orderNo) return (
    <div className="min-h-screen bg-coral-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-tropical-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-tropical-green" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ocean-blue mb-2">Order Placed!</h2>
        <p className="text-sm font-sans text-gray-500 mb-4">Order <strong>{orderNo}</strong> has been received. We'll notify you when it ships.</p>
        <Link to="/" className="inline-block bg-ocean-blue text-white px-6 py-3 rounded-full font-sans font-medium text-sm hover:bg-tropical-green transition-colors">Back to Home</Link>
      </div>
    </div>
  )

  if (items.length === 0) return (
    <div className="min-h-screen bg-coral-white flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 font-sans">Your cart is empty.</p>
      <Link to="/products" className="text-ocean-blue underline text-sm font-sans">Browse Products →</Link>
    </div>
  )

  const isAddressValid = address.firstName && address.lastName && address.line1 && address.city && address.postal && address.phone && contactEmail && /\S+@\S+\.\S+/.test(contactEmail)
  return (
    <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <Helmet>
        <link rel="canonical" href="https://ecomafola.com/checkout" />
        <title>Checkout | EcoMafola Peace</title>
        <meta name="description" content="Complete your purchase securely. Free US shipping on all orders." />
        <meta name="robots" content="noindex, nofollow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Checkout",
            "url": "https://ecomafola.com/checkout",
            "description": "Complete your purchase securely."
          })}
        </script>
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-ocean-blue mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {(['review','payment','address','confirm'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-all ${
                step === s ? 'bg-ocean-blue text-white' : 
                i < ['review','payment','address','confirm'].indexOf(step) ? 'bg-tropical-green text-white' : 
                'bg-gray-200 text-gray-400'
              }`}>{i +1}</div>
              <span className={`text-sm font-sans capitalize ${step === s ? 'text-ocean-blue font-semibold' : 'text-gray-400'}`}>
                {s === 'review' ? 'Review' : s === 'payment' ? 'Payment' : s === 'address' ? 'Address' : 'Confirm'}
              </span>
              {i< 3 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {(step === 'review' || step === 'payment') && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <ShoppingCart size={18} className="text-ocean-blue" />
                  <h2 className="font-serif text-lg font-semibold text-ocean-blue">Review Your Order</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.lineId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <OptimizedImage src={item.image} alt={item.title} preset="cart" className="w-16 h-16 rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-sans font-medium text-gray-800 truncate">{item.title}</p>
                        <p className="text-xs font-sans text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                        <button 
                          onClick={() => handleQuantityChange(item.lineId, -1)} 
                          className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 font-sans font-semibold text-ocean-blue text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.lineId, 1)} 
                          className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <span className="text-sm font-sans font-semibold text-ocean-blue min-w-[60px] text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      
                      <button 
                        onClick={() => handleRemoveItem(item.lineId)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-ocean-blue" />
                      <span className="font-sans font-semibold text-sm text-ocean-blue">Shipping to</span>
                      {geo && (
                        <span className="text-xs font-sans text-tropical-green font-medium">
                          ({geo.city}, {geo.country})
                        </span>
                      )}
                    </div>
                    <select 
                      value={countryCode || geo?.country_code || ''} 
                      onChange={e => setCountryCode(e.target.value)}
                      className="text-xs font-sans border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-ocean-blue/30"
                    >
                      {[['AU','Australia'],['NZ','New Zealand'],['US','United States'],['GB','United Kingdom'],['CA','Canada'],['JP','Japan'],['SG','Singapore'],['DE','Germany'],['FR','France'],['CN','China'],['WS','Samoa'],['FJ','Fiji'],['AE','UAE'],['KR','South Korea'],['ID','Indonesia']].map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {shipLoading && <p className="text-xs text-gray-400 font-sans animate-pulse">Calculating shipping…</p>}
                  {shipping && !shipLoading && (
                    shipping.supported ? (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="flex items-center justify-between text-sm font-sans">
                          <div className="flex items-center gap-2 text-green-700">
                            <Truck size={14} />
                            <span>{shipping.carrier} · {shipping.estimated_days}</span>
                          </div>
                          <span className="font-semibold text-green-700">{isFreeShipping ? 'FREE' : `$${(shipping.total_shipping_usd ?? 0).toFixed(2)}`}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-sans text-amber-700">{shipping.message}</p>
                      </div>
                    )
                  )}
                </div>

                {step === 'review' && (
                  <button 
                    onClick={() => setStep('payment')}
                    disabled={!shipping?.supported || shipLoading}
                    className="mt-6 w-full bg-ocean-blue text-white py-3.5 rounded-xl font-sans font-semibold text-sm hover:bg-tropical-green transition-colors disabled:opacity-50"
                  >
                    Continue to Payment →
                  </button>
                )}
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={18} className="text-ocean-blue" />
                  <h2 className="font-serif text-lg font-semibold text-ocean-blue">Payment Method</h2>
                </div>
                
                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${payMethod === pm.id ? 'border-ocean-blue bg-ocean-blue/5' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" name="payment" value={pm.id} checked={payMethod === pm.id} onChange={() => setPayMethod(pm.id)} className="accent-ocean-blue" />
                      <pm.icon />
                      <div className="flex-1">
                        <p className="text-sm font-sans font-semibold text-gray-800">{pm.label}</p>
                        <p className="text-xs font-sans text-gray-400">{pm.desc}</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-sans font-medium">Port Reserved</span>
                    </label>
                  ))}
                </div>

                {/* Payment Terms */}
                {terms[payMethod] && (
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={13} className="text-gray-400" />
                      <span className="text-xs font-sans font-semibold text-gray-600">{terms[payMethod].title}</span>
                      <a href={terms[payMethod].url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                        <ExternalLink size={11} className="text-gray-400 hover:text-ocean-blue" />
                      </a>
                    </div>
                    <p className="text-xs font-sans text-gray-500">{terms[payMethod].summary}</p>
                  </div>
                )}

                <label className="flex items-start gap-2 mb-5 cursor-pointer">
                  <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-0.5 accent-ocean-blue" />
                  <span className="text-xs font-sans text-gray-500">
                    I agree to the <a href={terms[payMethod]?.url} target="_blank" rel="noopener noreferrer" className="text-ocean-blue underline">{terms[payMethod]?.title || 'payment terms'}</a> and EcoMafola Peace<Link to="/terms" className="text-ocean-blue underline">Terms of Service</Link>
                  </span>
                </label>

                <div className="flex items-center gap-2 mb-4 bg-blue-50 rounded-xl p-3">
                  <ShieldCheck size={14} className="text-blue-500" />
                  <span className="text-xs font-sans text-blue-600">Payment gateway integration pending — order will be recorded; payment processed manually</span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('review')} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-sans text-sm hover:bg-gray-50 transition-colors">← Back</button>
                  <button 
                    onClick={handlePaymentComplete} 
                    disabled={!termsAccepted}
                    className="flex-1 bg-ocean-blue text-white py-3 rounded-xl font-sans font-semibold text-sm hover:bg-tropical-green transition-colors disabled:opacity-50"
                  >
                    Complete Payment →
                  </button>
                </div>
              </div>
            )}
            {/* Step 3: Delivery Address */}
            {step === 'address' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin size={18} className="text-ocean-blue" />
                  <h2 className="font-serif text-lg font-semibold text-ocean-blue">Delivery Address</h2>
                </div>
                
                {/* Contact Information */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h3 className="font-serif text-base font-semibold text-ocean-blue mb-4">Contact Information</h3>
                  <div>
                    <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="email" 
                        value={contactEmail} 
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all" 
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-serif text-base font-semibold text-ocean-blue mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Country/Region */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">Country/Region *</label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select 
                          value={countryCode || ''} 
                          onChange={e => setCountryCode(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 appearance-none"
                        >
                          {[['US','United States'],['AU','Australia'],['GB','United Kingdom'],['CA','Canada'],['NZ','New Zealand'],['JP','Japan'],['SG','Singapore'],['DE','Germany'],['FR','France'],['CN','China'],['WS','Samoa'],['FJ','Fiji'],['AE','UAE'],['KR','South Korea'],['ID','Indonesia']].map(([c,n]) => (
                            <option key={c} value={c}>{n}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">First Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          value={address.firstName} 
                          onChange={e => setAddress(a => ({...a, firstName: e.target.value}))}
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all" 
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">Last Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          value={address.lastName} 
                          onChange={e => setAddress(a => ({...a, lastName: e.target.value}))}
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all" 
                        />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">Street Address *</label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          value={address.line1} 
                          onChange={e => setAddress(a => ({...a, line1: e.target.value}))}
                          placeholder="123 Main St"
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all" 
                        />
                      </div>
                    </div>

                    {/* Apartment, suite, etc. (optional) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">Apartment, suite, etc. (optional)</label>
                      <input 
                        type="text" 
                        value={address.line2} 
                        onChange={e => setAddress(a => ({...a, line2: e.target.value}))}
                        placeholder="Apt 4B"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all" 
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">City *</label>
                      <input 
                        type="text" 
                        value={address.city} 
                        onChange={e => setAddress(a => ({...a, city: e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all" 
                      />
                    </div>

                    {/* State/Province */}
                    <div>
                      <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">State/Province *</label>
                      <select 
                        value={address.state} 
                        onChange={e => setAddress(a => ({...a, state: e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-ocean-blue/30"
                      >
                        <option value="">Select State</option>
                        {getStates(countryCode || 'US').map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">Postal Code *</label>
                      <input 
                        type="text" 
                        value={address.postal} 
                        onChange={e => setAddress(a => ({...a, postal: e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all" 
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">Phone Number *</label>
                      <div className="flex gap-2">
                        <div className="relative w-24">
                          <select 
                            value={address.phoneCountryCode} 
                            onChange={e => setAddress(a => ({...a, phoneCountryCode: e.target.value}))}
                            className="w-full border border-gray-200 rounded-xl px-2 py-3 text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 appearance-none cursor-pointer"
                          >
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+61">🇦🇺 +61</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+1">🇨🇦 +1</option>
                            <option value="+64">🇳🇿 +64</option>
                            <option value="+81">🇯🇵 +81</option>
                            <option value="+65">🇸🇬 +65</option>
                            <option value="+49">🇩🇪 +49</option>
                            <option value="+33">🇫🇷 +33</option>
                            <option value="+86">🇨🇳 +86</option>
                            <option value="+685">🇼🇸 +685</option>
                            <option value="+679">🇫🇯 +679</option>
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+82">🇰🇷 +82</option>
                            <option value="+62">🇮🇩 +62</option>
                          </select>
                        </div>
                        <input 
                          type="tel" 
                          value={address.phone} 
                          onChange={e => setAddress(a => ({...a, phone: e.target.value}))}
                          placeholder="123-456-7890"
                          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep('payment')} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-sans text-sm hover:bg-gray-50 transition-colors">← Back</button>
                  <button 
                    onClick={placeOrder} 
                    disabled={!isAddressValid || placing}
                    className="flex-1 bg-tropical-green text-white py-3 rounded-xl font-sans font-semibold text-sm hover:bg-ocean-blue transition-colors disabled:opacity-50"
                  >
                    {placing ? 'Placing order…' : `Place Order · $${grandTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
              <h2 className="font-serif text-lg font-semibold text-ocean-blue mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm font-sans">
                    <span className="text-gray-600">{item.title} × {item.quantity}</span>
                    <span className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800 font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-gray-600">Shipping</span>
                  {shipLoading ? (
                    <span className="text-gray-400 animate-pulse">Calculating…</span>
                  ) : shipping?.supported ? (
                    <span className="text-green-600 font-medium">{isFreeShipping ? 'FREE' : `$${(shipping.total_shipping_usd ?? 0).toFixed(2)}`}</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Calculated at next step</span>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-sans font-bold">
                  <span className="text-ocean-blue">Total</span>
                  <span className="text-ocean-blue">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={14} className="text-tropical-green mt-0.5" />
                  <div className="text-xs font-sans text-gray-600">
                    <p className="font-semibold text-gray-700 mb-1">Secure Checkout</p>
                    <p className="text-gray-500">Your information is protected with industry-standard encryption.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
