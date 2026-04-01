import type { VercelRequest, VercelResponse } from '@vercel/node';

const TOKEN_URL = process.env.SHOPIFY_TOKEN_URL!;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const refreshToken = parseCookie(req.headers.cookie, 'shopify_refresh_token');
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) return res.status(401).json({ error: 'Refresh failed' });

    const tokens = await response.json();

    res.setHeader('Set-Cookie', [
      `shopify_access_token=${tokens.access_token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${COOKIE_MAX_AGE}`,
      `shopify_refresh_token=${tokens.refresh_token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${COOKIE_MAX_AGE}`,
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function parseCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
