/**
 * Lazy Loading and Suspense Components
 *
 * React 18 lazy loading with Suspense for streaming rendering.
 * Reduces initial bundle size and improves FCP.
 *
 * @see https://react.dev/reference/react/Suspense
 * @see https://react.dev/reference/react/lazy
 */

import React, { lazy, Suspense, type ReactNode } from 'react';
import { ProductSkeleton } from './skeletons';
import { CheckoutSkeleton } from './skeletons';
import { PageSkeleton } from './skeletons';

/**
 * Lazy loaded pages for code splitting.
 * These will be loaded on demand when the route is accessed.
 */

// Product Detail Page - lazy loaded
export const LazyProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));

// Checkout Page - lazy loaded
export const LazyCheckoutPage = lazy(() => import('../pages/CheckoutPage'));

// Account Orders Page - lazy loaded
export const LazyAccountOrdersPage = lazy(() => import('../pages/AccountOrdersPage'));

// Admin pages - lazy loaded (if needed)
export const LazyHomePageAdmin = lazy(() => import('../pages/admin/HomePageAdmin'));
export const LazyProductContentAdmin = lazy(() => import('../pages/admin/ProductContentAdmin'));

/**
 * Suspense wrapper for lazy loaded pages with custom fallback.
 *
 * @param children - The lazy component to wrap
 * @param fallback - Custom fallback UI (defaults to PageSkeleton)
 *
 * @example
 * <SuspenseBoundary>
 *   <LazyProductDetailPage />
 * </SuspenseBoundary>
 */
interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuspenseBoundary({ children, fallback }: SuspenseBoundaryProps) {
  return <Suspense fallback={fallback || <PageSkeleton />}>{children}</Suspense>;
}

/**
 * Product Detail Suspense wrapper with ProductSkeleton fallback.
 *
 * @example
 * <ProductDetailSuspense>
 *   <LazyProductDetailPage />
 * </ProductDetailSuspense>
 */
export function ProductDetailSuspense({ children }: SuspenseBoundaryProps) {
  return <Suspense fallback={<ProductSkeleton />}>{children}</Suspense>;
}

/**
 * Checkout Suspense wrapper with CheckoutSkeleton fallback.
 */
export function CheckoutSuspense({ children }: SuspenseBoundaryProps) {
  return <Suspense fallback={<CheckoutSkeleton />}>{children}</Suspense>;
}

/**
 * Generic lazy loader with error boundary.
 *
 * @param importFn - Dynamic import function
 * @param fallback - Custom fallback component
 *
 * @example
 * const LazyComponent = createLazy(() => import('./HeavyComponent'));
 */
export function createLazy<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <PageSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Preload a lazy component on user interaction (hover, etc).
 *
 * @param importFn - Dynamic import function
 * @returns Object with preload function and Lazy component
 *
 * @example
 * const { Lazy, preload } = useLazyWithPreload(() => import('./HeavyComponent'));
 * <button onMouseEnter={preload}>Hover to preload</button>
 */
export function useLazyWithPreload<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  let resolve: ((value: any) => void) | null = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  const preload = () => {
    importFn().then(resolve!);
  };

  const LazyComponent = lazy(() => promise as any);

  return {
    Lazy: LazyComponent,
    preload,
  };
}

/**
 * Image preload utility for LCP optimization.
 *
 * @param src - Image URL to preload
 * @param as - Resource type (default: 'image')
 *
 * @example
 * // In component useEffect
 * useEffect(() => {
 *   preloadImage(heroImage, 'image');
 * }, []);
 */
export function preloadImage(src: string, as: string = 'image'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;

  if (as === 'image') {
    link.fetchPriority = 'high';
  }

  document.head.appendChild(link);
}

/**
 * Module preload utility for critical chunks.
 *
 * @param href - Module URL to preload
 *
 * @example
 * // Preload critical chunk
 * preloadModule('/assets/ProductDetailPage.js');
 */
export function preloadModule(href: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = href;

  document.head.appendChild(link);
}
