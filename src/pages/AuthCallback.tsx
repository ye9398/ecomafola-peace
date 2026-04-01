import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const REDIRECT_URI = `${import.meta.env.VITE_APP_URL}/auth/callback`;

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const savedState = localStorage.getItem('oauth_state');
    const codeVerifier = localStorage.getItem('pkce_verifier');

    if (!code || !codeVerifier || state !== savedState) {
      setError('Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    localStorage.removeItem('pkce_verifier');
    localStorage.removeItem('oauth_state');

    fetch('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code, codeVerifier, redirectUri: REDIRECT_URI }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        // ✅ 保存 token 到 localStorage（持久化，关闭浏览器不丢失）
        console.log('AuthCallback data:', data);
        if (data.access_token) {
          localStorage.setItem('customer_access_token', data.access_token);
          console.log('Token saved:', data.access_token.substring(0, 20) + '...');
        } else if (data.token) {
          localStorage.setItem('customer_access_token', data.token);
          console.log('Token saved (token field):', data.token.substring(0, 20) + '...');
        }
        // ✅ 跳转到订单页面
        navigate('/account/orders');
      })
      .catch(() => {
        setError('Sign in failed. Please try again.');
        setTimeout(() => navigate('/login'), 2000);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-4" />
          <p className="text-gray-500">Signing in, please wait...</p>
        </div>
      )}
    </div>
  );
}
