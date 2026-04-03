/**
 * Customer Account API 封装
 * 用于登录后用户订单查询
 * 包含 token 管理、自动刷新等功能
 */

// Token 管理工具函数
const TOKEN_KEY = 'customer_access_token';
const REFRESH_KEY = 'customer_refresh_token';
const EXPIRY_KEY = 'customer_token_expiry';
const ID_TOKEN_KEY = 'customer_id_token';

export function saveTokens(data: {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  id_token?: string;
}) {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(REFRESH_KEY, data.refresh_token);
  }
  if (data.expires_in) {
    const expiry = Date.now() + data.expires_in * 1000 - 60000; // 提前 1 分钟刷新
    localStorage.setItem(EXPIRY_KEY, String(expiry));
  }
  if (data.id_token) {
    localStorage.setItem(ID_TOKEN_KEY, data.id_token);
  }
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  localStorage.removeItem(ID_TOKEN_KEY);
}

export function isTokenExpired(): boolean {
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!expiry) return false;
  return Date.now() > Number(expiry);
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = localStorage.getItem(REFRESH_KEY);
  if (!refresh_token) return null;

  try {
    const res = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    saveTokens(data);
    return data.access_token;
  } catch {
    clearTokens();
    return null;
  }
}

/**
 * 从 Customer Account API 获取数据
 * @param query GraphQL 查询语句
 * @returns 查询结果数据
 * @throws 未登录时抛出"未登录"错误，API 错误时抛出对应错误信息
 */
export async function customerAccountFetch(query: string) {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error('未登录');

  // ✅ token 过期则自动刷新
  if (isTokenExpired()) {
    token = await refreshAccessToken();
    if (!token) throw new Error('登录已过期，请重新登录');
  }

  try {
    const res = await fetch('/api/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        // token 失效，尝试刷新一次
        const newToken = await refreshAccessToken();
        if (!newToken) {
          clearTokens();
          throw new Error('登录已过期，请重新登录');
        }
        // 用新 token 重试一次
        return customerAccountFetch(query);
      }
      throw new Error(`API 请求失败：${res.status}`);
    }

    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Customer Account API error:', error);
    }
    throw error;
  }
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
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            number
            processedAt
            fulfillmentStatus
            financialStatus
            statusPageUrl
            fulfillments(first: 1) {
              nodes {
                trackingInformation {
                  number
                  url
                  company
                }
              }
            }
            lineItems(first: 3) {
              nodes {
                title
                quantity
                price {
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
