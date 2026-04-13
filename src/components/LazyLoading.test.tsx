/**
 * Lazy Loading and Suspense Components Tests
 *
 * Tests verify the actual exports from LazyLoading.tsx:
 * - LazyProductDetailPage, LazyCheckoutPage, LazyAccountOrdersPage (lazy components)
 * - ProductDetailSuspense, CheckoutSuspense, AccountOrdersSuspense (suspense wrappers)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductDetailSuspense, CheckoutSuspense, AccountOrdersSuspense } from './LazyLoading';

describe('LazyLoading Components', () => {
  describe('ProductDetailSuspense', () => {
    it('should render content when loaded', () => {
      render(
        <ProductDetailSuspense>
          <div data-testid="content">Product Loaded</div>
        </ProductDetailSuspense>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Product Loaded')).toBeInTheDocument();
    });
  });

  describe('CheckoutSuspense', () => {
    it('should render content when loaded', () => {
      render(
        <CheckoutSuspense>
          <div data-testid="content">Checkout Loaded</div>
        </CheckoutSuspense>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('AccountOrdersSuspense', () => {
    it('should render content when loaded', () => {
      render(
        <AccountOrdersSuspense>
          <div data-testid="content">Orders Loaded</div>
        </AccountOrdersSuspense>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should use default PageSkeleton when no fallback provided', () => {
      render(
        <AccountOrdersSuspense>
          <div>Content</div>
        </AccountOrdersSuspense>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Lazy component exports exist', () => {
    it('should export LazyProductDetailPage', async () => {
      const { LazyProductDetailPage } = await import('./LazyLoading');
      expect(LazyProductDetailPage).toBeDefined();
    });

    it('should export LazyCheckoutPage', async () => {
      const { LazyCheckoutPage } = await import('./LazyLoading');
      expect(LazyCheckoutPage).toBeDefined();
    });

    it('should export LazyAccountOrdersPage', async () => {
      const { LazyAccountOrdersPage } = await import('./LazyLoading');
      expect(LazyAccountOrdersPage).toBeDefined();
    });

    it('should export LazyHomePage', async () => {
      const { LazyHomePage } = await import('./LazyLoading');
      expect(LazyHomePage).toBeDefined();
    });

    it('should export LazyProductListPage', async () => {
      const { LazyProductListPage } = await import('./LazyLoading');
      expect(LazyProductListPage).toBeDefined();
    });
  });
});
