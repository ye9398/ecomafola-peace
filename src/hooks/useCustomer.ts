import { useState, useEffect } from 'react';
import { clearTokens } from '../lib/customerAccount';

export interface Customer {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
}

export function useCustomer() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('customer_access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    // ✅ 用代理端点，不直接调 Shopify
    fetch('/api/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `query { 
          customer { 
            id 
            displayName 
            emailAddress { emailAddress }
            phoneNumber { phoneNumber }
          } 
        }`,
      }),
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const c = data?.data?.customer;
        if (!c) return setCustomer(null);
        setCustomer({
          id: c.id,
          displayName: c.displayName,
          email: c.emailAddress?.emailAddress ?? '',
          phone: c.phoneNumber?.phoneNumber,
        });
      })
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    const idToken = localStorage.getItem('customer_id_token');

    // 清除本地所有 token
    clearTokens();
    setCustomer(null);

    if (idToken) {
      // 从服务端获取登出 URL
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });
      const { logout_url } = await res.json();
      window.location.href = logout_url; // ✅ 跳转到 Shopify 登出页
    } else {
      window.location.href = '/'; // 没有 id_token 直接回首页
    }
  };

  return { customer, loading, logout };
}
