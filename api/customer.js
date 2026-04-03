// api/customer.js
// Vercel Serverless Function for Customer Account API GraphQL proxy
// This bypasses CORS by doing the GraphQL requests server-side

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { query, variables } = req.body;
  const authHeader = req.headers['authorization'];

  // 去掉 "Bearer " 前缀，只传 token 本身
  const token = authHeader?.replace(/^Bearer\s+/i, '');

  const endpoint = 'https://shopify.com/67818717289/account/customer/api/2025-01/graphql';

  try {
    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    const text = await apiRes.text();

    if (text.trim().startsWith('<')) {
      console.error('Shopify returned HTML:', text.slice(0, 200));
      return res.status(500).json({ error: 'Shopify returned HTML', status: apiRes.status });
    }

    return res.status(apiRes.status).json(JSON.parse(text));
  } catch (err) {
    console.error('Customer API error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
