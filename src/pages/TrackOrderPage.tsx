import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Search, ExternalLink, ChevronRight } from 'lucide-react'

const STOREFRONT_ENDPOINT = 'https://ecomafola-peace.myshopify.com/api/2025-01/graphql.json'
const STOREFRONT_TOKEN = import.meta.env.VITE_STOREFRONT_TOKEN

if (!STOREFRONT_TOKEN) {
  throw new Error('VITE_STOREFRONT_TOKEN 环境变量未配置')
}

// URL 验证函数，防止 XSS 攻击
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

const TRACK_QUERY = `
  query trackOrder($query: String!) {
    orders(first: 1, query: $query) {
      nodes {
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        statusUrl
        lineItems(first: 5) {
          nodes {
            title
            quantity
            originalTotalPrice {
              amount
              currencyCode
            }
          }
        }
        fulfillments {
          trackingInfo {
            number
            url
            company
          }
        }
      }
    }
  }
`

interface Order {
  orderNumber: string
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  statusUrl: string
  lineItems: {
    nodes: {
      title: string
      quantity: number
      originalTotalPrice: {
        amount: string
        currencyCode: string
      }
    }[]
  }
  fulfillments?: {
    trackingInfo?: {
      number: string
      url: string
      company: string
    }[]
  }[]
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [orderData, setOrderData] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrderData(null)

    try {
      const res = await fetch(STOREFRONT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: TRACK_QUERY,
          variables: {
            query: `name:${orderNumber} email:${email}`,
          },
        }),
      })

      const json = await res.json()
      const order = json.data?.orders?.nodes?.[0]

      if (!order) {
        setError('未找到订单，请检查订单号和邮箱')
      } else {
        setOrderData(order)
      }
    } catch (error) {
      console.error('订单查询失败:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const tracking = orderData?.fulfillments?.[0]?.trackingInfo?.[0]

  return (
    <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-ocean-blue mb-2">
            订单追踪
          </h1>
          <p className="text-gray-500 font-sans text-sm">
            输入订单号和下单邮箱查询订单状态
          </p>
        </div>

        {/* Track Form */}
        <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
                订单号
              </label>
              <input
                type="text"
                placeholder="#1001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
                下单邮箱
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ocean-blue text-white py-3.5 rounded-xl font-sans font-semibold text-base hover:bg-tropical-green transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  查询中...
                </>
              ) : (
                <>
                  <Search size={18} />
                  查询订单
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-600 font-sans text-sm">{error}</p>
          </div>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* Order Header */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-serif text-2xl font-bold text-ocean-blue">
                  订单 #{orderData.orderNumber}
                </h2>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-sans font-medium ${
                  orderData.financialStatus === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {orderData.financialStatus === 'paid' ? '已付款' : '待付款'}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-sans">
                下单时间：{new Date(orderData.processedAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-sans text-sm font-semibold text-gray-700 mb-4">商品列表</h3>
              <div className="space-y-3">
                {orderData.lineItems.nodes.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          数量：{item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-sans text-sm font-semibold text-ocean-blue">
                      ${item.originalTotalPrice.amount} {item.originalTotalPrice.currencyCode}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Info */}
            {tracking && (
              <div className="mb-6">
                <h3 className="font-sans text-sm font-semibold text-gray-700 mb-4">物流信息</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-ocean-blue" />
                    <span className="font-sans text-sm font-medium text-gray-700">
                      {tracking.company}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    快递单号：<span className="font-mono">{tracking.number}</span>
                  </p>
                  {tracking.url && isValidUrl(tracking.url) && (
                    <a
                      href={tracking.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-ocean-blue hover:text-tropical-green transition-colors"
                    >
                      追踪物流 <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <span className="font-sans text-sm text-gray-500">
                物流状态：{orderData.fulfillmentStatus || '待处理'}
              </span>
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-sans text-ocean-blue hover:text-tropical-green transition-colors"
                >
                  登录查看更多订单
                </Link>
                {isValidUrl(orderData.statusUrl) && (
                  <a
                    href={orderData.statusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-ocean-blue hover:text-tropical-green transition-colors"
                  >
                    订单详情 <ChevronRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
