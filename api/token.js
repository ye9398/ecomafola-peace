// api/token.js
// Vercel Serverless Function for Shopify OAuth token exchange
// This bypasses CORS by doing the token exchange server-side

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, code_verifier, redirect_uri } = req.body;

  const SHOP_ID = '67818717289';
  const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID; // 服务端环境变量（无 VITE_ 前缀）

  try {
    const tokenRes = await fetch(
      `https://shopify.com/authentication/${SHOP_ID}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          redirect_uri,
          code,
          code_verifier,
        }),
      }
    );

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Token exchange failed:', data);
      return res.status(tokenRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Token exchange error:', err);
    return res.status(500).json({ error: 'Token exchange failed' });
  }
}
