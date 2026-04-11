import { useCustomer } from '../hooks/useCustomer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function AccountPage() {
  const { customer, loading, logout } = useCustomer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && customer) {
      // 登录后自动跳转到订单页面
      navigate('/account/orders');
    }
    if (!loading && !customer) {
      navigate('/login');
    }
  }, [customer, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
      </div>
    );
  }

  if (!customer) return null;

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://ecomafola.com/account" />
        <title>My Account | EcoMafola Peace</title>
        <meta name="description" content="Manage your EcoMafola Peace account and view your orders." />
        <meta name="robots" content="noindex, nofollow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "My Account",
            "url": "https://ecomafola.com/account"
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">
            Hello, {customer.firstName} 👋
          </h1>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          <p><span className="font-medium">Name:</span> {customer.firstName} {customer.lastName}</p>
          <p><span className="font-medium">Email:</span> {customer.email}</p>
          {customer.phone && (
            <p><span className="font-medium">Phone:</span> {customer.phone}</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
