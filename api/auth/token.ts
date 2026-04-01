import type { VercelRequest, VercelResponse } from '@vercel/node';

const TOKEN_URL = process.env.SHOPIFY_TOKEN_URL!;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 天

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { code, codeVerifier, redirectUri } = req.body;
  if (!code || !codeVerifier || !redirectUri) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        redirect_uri: redirectUri,
        code,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      console.error('Token exchange failed:', await response.text());
      return res.status(401).json({ error: 'Token exchange failed' });
    }

    const tokens = await response.json();

    res.setHeader('Set-Cookie', [
      `shopify_access_token=${tokens.access_token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${COOKIE_MAX_AGE}`,
      `shopify_refresh_token=${tokens.refresh_token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${COOKIE_MAX_AGE}`,
    ]);

    // ✅ 返回 access_token 给前端（用于 sessionStorage 保存）
    return res.status(200).json({
      ok: true,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
