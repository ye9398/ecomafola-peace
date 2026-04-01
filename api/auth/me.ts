import type { VercelRequest, VercelResponse } from '@vercel/node';

const CUSTOMER_API_URL = 'https://shopify.com/67818717289/account/customer/api/2024-07/graphql';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const accessToken = parseCookie(req.headers.cookie, 'shopify_access_token');
  if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const response = await fetch(CUSTOMER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({
        query: `{
          customer {
            id
            firstName
            lastName
            emailAddress { emailAddress }
            phoneNumber { phoneNumber }
          }
        }`,
      }),
    });

    const { data } = await response.json();
    const c = data?.customer;
    if (!c) return res.status(401).json({ error: 'Invalid token' });

    return res.status(200).json({
      customer: {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.emailAddress?.emailAddress,
        phone: c.phoneNumber?.phoneNumber,
      },
    });
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
