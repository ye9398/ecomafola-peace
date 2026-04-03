import { generatePKCE } from '../utils/pkce';
import { useCustomer } from '../hooks/useCustomer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
const SHOP_ID = '67818717289'; // ✅ 数字 ID，不是域名前缀
const REDIRECT_URI = `${import.meta.env.VITE_APP_URL}/auth/callback`;

export default function LoginPage() {
  const { customer, loading } = useCustomer();
  const navigate = useNavigate();

  // 已登录则直接跳转账户页
  useEffect(() => {
    if (!loading) {
      // 检查 localStorage 中是否有 Shopify token
      const hasShopifyToken = localStorage.getItem('customer_access_token');
      
      if (hasShopifyToken) {
        // 有 Shopify token，跳转到订单页
        navigate('/account/orders');
      }
    }
  }, [loading, navigate]);

  const handleLogin = async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID(); // ✅ Customer Account API 需要 nonce

    // 使用 localStorage 保证跨标签页一致性
    localStorage.setItem('pkce_verifier', codeVerifier);
    localStorage.setItem('oauth_state', state);
    localStorage.setItem('oauth_nonce', nonce);

    // ✅ 正确的 Customer Account API 授权 URL
    const loginUrl = new URL(
      `https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`
    );
    loginUrl.searchParams.set('client_id', CLIENT_ID);
    loginUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    loginUrl.searchParams.set('scope', 'openid email customer-account-api:full');
    loginUrl.searchParams.set('state', state);
    loginUrl.searchParams.set('nonce', nonce); // ✅ 必须加
    loginUrl.searchParams.set('code_challenge', codeChallenge);
    loginUrl.searchParams.set('code_challenge_method', 'S256');
    loginUrl.searchParams.set('response_type', 'code');

    window.location.href = loginUrl.toString();
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-sm text-center">
        {/* Logo */}
        <div className="mb-8">
          <img src="/logo.png" alt="EcoMafola Peace" className="w-40 h-40 mx-auto object-contain drop-shadow-lg" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-sm mb-8">
          Sign in to access your orders and account information
        </p>
        <button
          onClick={handleLogin}
          className="w-full py-3 px-4 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors font-medium text-base"
        >
          Continue with Shopify
        </button>
        <p className="text-xs text-gray-400 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
