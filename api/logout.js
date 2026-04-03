// api/logout.js
// Vercel Serverless Function for Customer Account API logout

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { id_token } = req.body;
  const POST_LOGOUT_URI = process.env.VITE_APP_URL || 'https://ecomafola.com';

  // 返回 Shopify 登出 URL，前端负责跳转
  const logoutUrl = new URL(
    'https://shopify.com/authentication/67818717289/logout'
  );
  logoutUrl.searchParams.set('id_token_hint', id_token);
  logoutUrl.searchParams.set('post_logout_redirect_uri', POST_LOGOUT_URI);

  return res.status(200).json({ logout_url: logoutUrl.toString() });
}
