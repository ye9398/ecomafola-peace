import { useState, useEffect } from 'react';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export function useCustomer() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setCustomer(data?.customer ?? null))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setCustomer(null);
    window.location.href = import.meta.env.VITE_SHOPIFY_LOGOUT_URL;
  };

  return { customer, loading, logout };
}
