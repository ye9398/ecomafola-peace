import { generatePKCE } from '../utils/pkce';
import { useCustomer } from '../hooks/useCustomer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AUTH_URL = import.meta.env.VITE_SHOPIFY_AUTH_URL;
const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
const REDIRECT_URI = `${import.meta.env.VITE_APP_URL}/auth/callback`;

export default function LoginPage() {
  const { customer, loading } = useCustomer();
  const navigate = useNavigate();

  // 已登录则直接跳转账户页
  useEffect(() => {
    if (!loading && customer) navigate('/account');
  }, [customer, loading]);

  const handleLogin = async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const state = crypto.randomUUID();

    sessionStorage.setItem('pkce_verifier', codeVerifier);
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      scope: 'openid email customer-account-api:full',
      state,
    });

    window.location.href = `${AUTH_URL}?${params}`;
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
