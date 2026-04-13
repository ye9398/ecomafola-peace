/**
 * Lazy Loading and Suspense Components
 * NOTE: Only pages that are NOT statically imported anywhere else should be lazy-loaded here.
 * Admin pages are statically imported in App.tsx — do NOT add them here.
 */

import React, { lazy, Suspense, type ReactNode } from 'react';
import { ProductSkeleton } from './skeletons';
import { CheckoutSkeleton } from './skeletons';
import { PageSkeleton } from './skeletons';

// These pages are ONLY referenced here (not statically imported in App.tsx)
export const LazyProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
export const LazyCheckoutPage = lazy(() => import('../pages/CheckoutPage'));
export const LazyAccountOrdersPage = lazy(() => import('../pages/AccountOrdersPage'));
export const LazyHomePage = lazy(() => import('../pages/HomePage'));
export const LazyProductListPage = lazy(() => import('../pages/ProductListPage'));

// ⛔ DO NOT add admin pages here — they are statically imported in App.tsx
//    Adding them as lazy() causes Vite __vitePreload TypeError at runtime

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProductDetailSuspense({ children }: SuspenseBoundaryProps) {
  return <Suspense fallback={<ProductSkeleton />}>{children}</Suspense>;
}

export function CheckoutSuspense({ children }: SuspenseBoundaryProps) {
  return <Suspense fallback={<CheckoutSkeleton />}>{children}</Suspense>;
}

export function AccountOrdersSuspense({ children, fallback }: SuspenseBoundaryProps) {
  return <Suspense fallback={fallback || <PageSkeleton />}>{children}</Suspense>;
}
