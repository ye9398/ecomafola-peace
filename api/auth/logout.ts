import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // 清除 cookie
  res.setHeader('Set-Cookie', [
    'shopify_access_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    'shopify_refresh_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
  ]);

  return res.status(200).json({ ok: true });
}
