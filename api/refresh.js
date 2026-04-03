// api/refresh.js
// Vercel Serverless Function for refreshing Customer Account API tokens

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { refresh_token } = req.body;
  const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Missing refresh_token' });
  }

  try {
    const tokenRes = await fetch(
      'https://shopify.com/authentication/67818717289/oauth/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: CLIENT_ID,
          refresh_token,
        }),
      }
    );

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
