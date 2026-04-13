/**
 * App Lazy Loading Route Tests
 *
 * Verifies that lazy loading is properly configured for:
 * - ProductDetailPage
 * - CheckoutPage
 * - AccountOrdersPage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LazyProductDetailPage, LazyCheckoutPage, LazyAccountOrdersPage } from './components/LazyLoading';

// Mock pages for testing
vi.mock('./pages/ProductDetailPage', () => ({
  default: () => <div data-testid="product-detail-page">Product Detail Page</div>,
}));

vi.mock('./pages/CheckoutPage', () => ({
  default: () => <div data-testid="checkout-page">Checkout Page</div>,
}));

vi.mock('./pages/AccountOrdersPage', () => ({
  default: () => <div data-testid="account-orders-page">Account Orders Page</div>,
}));

vi.mock('./pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('./pages/ProductListPage', () => ({
  default: () => <div data-testid="product-list-page">Product List Page</div>,
}));

vi.mock('./pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('./pages/AuthCallback', () => ({
  default: () => <div data-testid="auth-callback">Auth Callback</div>,
}));

vi.mock('./pages/AccountPage', () => ({
  default: () => <div data-testid="account-page">Account Page</div>,
}));

vi.mock('./pages/TrackOrderPage', () => ({
  default: () => <div data-testid="track-order-page">Track Order Page</div>,
}));

vi.mock('./pages/SubPages', () => ({
  OurStoryPage: () => <div data-testid="our-story-page">Our Story Page</div>,
  ImpactPage: () => <div data-testid="impact-page">Impact Page</div>,
  ContactPage: () => <div data-testid="contact-page">Contact Page</div>,
}));

vi.mock('./pages/PrivacyPolicyPage', () => ({
  PrivacyPolicyPage: () => <div data-testid="privacy-policy-page">Privacy Policy Page</div>,
}));

vi.mock('./components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('./components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('./components/SlideOverCheckout', () => ({
  default: () => <div data-testid="slide-over-checkout">Slide Over Checkout</div>,
}));

vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App Lazy Loading Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('should export LazyProductDetailPage component', () => {
    expect(LazyProductDetailPage).toBeDefined();
  });

  it('should export LazyCheckoutPage component', () => {
    expect(LazyCheckoutPage).toBeDefined();
  });

  it('should export LazyAccountOrdersPage component', () => {
    expect(LazyAccountOrdersPage).toBeDefined();
  });

  it('should render home page at root path', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Wait for lazy loaded HomePage
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  it('should render ProductDetailPage with Suspense at /product/:id route', async () => {
    window.history.pushState({}, '', '/product/123');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Wait for lazy loaded component
    await waitFor(() => {
      expect(screen.getByTestId('product-detail-page')).toBeInTheDocument();
    });
  });

  it('should have ProductDetailSuspense wrapper available', async () => {
    const { ProductDetailSuspense } = await import('./components/LazyLoading');
    expect(ProductDetailSuspense).toBeDefined();
  });

  it('should have CheckoutSuspense wrapper available', async () => {
    const { CheckoutSuspense } = await import('./components/LazyLoading');
    expect(CheckoutSuspense).toBeDefined();
  });

  it('should have AccountOrdersSuspense wrapper available', async () => {
    const { AccountOrdersSuspense } = await import('./components/LazyLoading');
    expect(AccountOrdersSuspense).toBeDefined();
  });
});
