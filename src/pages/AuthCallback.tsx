import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveTokens } from '../lib/customerAccount';

const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
const SHOP_ID = '67818717289'; // ✅ 数字 ID
const REDIRECT_URI = `${import.meta.env.VITE_APP_URL}/auth/callback`;

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
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

      try {
        // ✅ 调用自己的 Vercel Function，绕过 CORS
        const tokenRes = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
            redirect_uri: REDIRECT_URI,
          }),
        });

        const tokenData = await tokenRes.json();

        if (tokenData.access_token) {
          saveTokens(tokenData); // ✅ 同时保存 access_token、refresh_token、expires_in、id_token
          navigate('/account/orders');
        } else {
          setError('Failed to get access token');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('Token exchange error:', err);
        setError('Sign in failed. Please try again.');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        localStorage.removeItem('pkce_verifier');
        localStorage.removeItem('oauth_state');
      }
    };

    handleCallback();
  }, [navigate]);

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
