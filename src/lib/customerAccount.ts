/**
 * Customer Account API 封装
 * 用于登录后用户订单查询
 */

/**
 * 从 Customer Account API 获取数据
 * @param query GraphQL 查询语句
 * @returns 查询结果数据
 * @throws 未登录时抛出"未登录"错误，API 错误时抛出对应错误信息
 */
export async function customerAccountFetch(query: string) {
  const token = localStorage.getItem('customer_access_token');

  if (!token) {
    throw new Error('未登录');
  }

  const res = await fetch(
    'https://shopify.com/authentication/customer/api/2025-01/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    }
  );

  const json = await res.json();

  // token 过期处理
  if (res.status === 401) {
    localStorage.removeItem('customer_access_token');
    throw new Error('登录已过期');
  }

  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

/**
 * 获取当前登录客户的信息和订单列表
 * @returns 客户信息对象，包含订单列表
 * @throws 未登录时抛出错误
 */
export async function getCurrentCustomer() {
  const query = `
    query {
      customer {
        id
        displayName
        email
        phone
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            number
            processedAt
            fulfillmentStatus
            financialStatus
            statusUrl
            fulfillments {
              trackingInfo {
                number
                url
                company
              }
            }
            lineItems(first: 3) {
              nodes {
                title
                quantity
                originalTotalPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await customerAccountFetch(query);
  return data?.customer;
}
