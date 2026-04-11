import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, ChevronRight, ExternalLink, LogOut } from 'lucide-react';
import { getCurrentCustomer, clearTokens } from '../lib/customerAccount';

// URL 验证函数，防止 XSS 攻击
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

interface Order {
  id: string;
  number: string;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  statusPageUrl: string;
  fulfillments?: {
    nodes: {
      trackingInformation?: {
        number: string;
        url: string;
        company: string;
      }[];
    }[];
  };
  lineItems: {
    nodes: {
      title: string;
      quantity: number;
      price: {
        amount: string;
        currencyCode: string;
      };
    }[];
  };
}

interface Customer {
  id: string;
  displayName: string;
  emailAddress: { emailAddress: string };
  phoneNumber?: { phoneNumber: string };
  orders: {
    nodes: Order[];
  };
}

export default function AccountOrdersPage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentCustomer()
      .then((data) => {
        if (!data) {
          // 没有用户数据，清除 token 并跳转
          localStorage.removeItem('customer_access_token');
          navigate('/login');
          return;
        }
        setCustomer(data);
      })
      .catch((err) => {
        console.error('Failed to load customer:', err);
        // token 无效或过期，清除 token 并跳转
        localStorage.removeItem('customer_access_token');
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-coral-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue mx-auto mb-4" />
          <p className="text-gray-500 font-sans">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return null;
  }

  const customerEmail = customer.emailAddress?.emailAddress || customer.email || 'Unknown';
  const orders = customer.orders.nodes;

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://ecomafola.com/account/orders" />
        <title>My Orders | EcoMafola Peace</title>
        <meta name="description" content="View and track your EcoMafola Peace orders." />
        <meta name="robots" content="noindex, nofollow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "My Orders",
            "url": "https://ecomafola.com/account/orders"
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-ocean-blue mb-2">
                My Orders
              </h1>
              <p className="text-gray-500 font-sans text-sm">
                Welcome, {customer.displayName} ({customerEmail})
              </p>
            </div>
            <button
              onClick={async () => {
                const idToken = localStorage.getItem('customer_id_token');
                clearTokens();
                if (idToken) {
                  const res = await fetch('/api/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_token: idToken }),
                  });
                  const { logout_url } = await res.json();
                  window.location.href = logout_url;
                } else {
                  window.location.href = '/';
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-sans mb-4">No orders yet</p>
            <Link
              to="/products"
              className="inline-block bg-ocean-blue text-white px-6 py-2.5 rounded-full font-sans font-medium text-sm hover:bg-tropical-green transition-colors"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const tracking = order.fulfillments?.[0]?.trackingInfo?.[0];
              
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="font-serif font-semibold text-lg text-ocean-blue">
                        Order #{order.number}
                      </p>
                      <p className="text-sm text-gray-500 font-sans">
                        {new Date(order.processedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-sans font-medium ${
                        order.financialStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.financialStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    {order.lineItems?.nodes?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package size={24} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="font-sans text-sm font-medium text-gray-800">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-sans text-sm font-semibold text-ocean-blue">
                          ${item.price.amount} {item.price.currencyCode}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Info */}
                  {order.fulfillments?.nodes?.[0]?.trackingInformation?.[0] && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={16} className="text-ocean-blue" />
                        <span className="font-sans text-sm font-medium text-gray-700">
                          Shipping Info
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Carrier: {order.fulfillments.nodes[0].trackingInformation[0].company}
                        </p>
                        <p className="text-sm text-gray-600">
                          Tracking #: {order.fulfillments.nodes[0].trackingInformation[0].number}
                        </p>
                        {order.fulfillments.nodes[0].trackingInformation[0].url && isValidUrl(order.fulfillments.nodes[0].trackingInformation[0].url) && (
                          <a
                            href={order.fulfillments.nodes[0].trackingInfo[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-ocean-blue hover:text-tropical-green transition-colors"
                          >
                            Track Package <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="font-sans text-sm text-gray-500">
                      Fulfillment: {order.fulfillmentStatus || 'Unfulfilled'}
                    </span>
                    {isValidUrl(order.statusPageUrl) && (
                      <a
                        href={order.statusPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-ocean-blue hover:text-tropical-green transition-colors"
                      >
                        View Order Details <ChevronRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
