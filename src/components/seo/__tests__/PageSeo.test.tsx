/**
 * PageSeo Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import PageSeo, { PAGE_SEO, getOpenGraphTags, getTwitterCardTags } from '../PageSeo';

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <HelmetProvider>{children}</HelmetProvider>
  );
};

describe('PageSeo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOpenGraphTags', () => {
    it('should generate basic Open Graph tags', () => {
      const tags = getOpenGraphTags({
        title: 'Test Page',
        description: 'Test description',
      });

      expect(tags['og:type']).toBe('website');
      expect(tags['og:site_name']).toBe('EcoMafola Peace');
      expect(tags['og:title']).toBe('Test Page | EcoMafola Peace');
      expect(tags['og:description']).toBe('Test description');
    });

    it('should use custom site name', () => {
      const tags = getOpenGraphTags({
        title: 'Test',
        description: 'Desc',
        siteName: 'Custom Site',
      });

      expect(tags['og:site_name']).toBe('Custom Site');
      expect(tags['og:title']).toBe('Test | Custom Site');
    });

    it('should handle image URL', () => {
      const tags = getOpenGraphTags({
        title: 'Test',
        description: 'Desc',
        image: 'https://example.com/image.jpg',
      });

      expect(tags['og:image']).toBe('https://example.com/image.jpg');
    });
  });

  describe('getTwitterCardTags', () => {
    it('should generate basic Twitter Card tags', () => {
      const tags = getTwitterCardTags({
        title: 'Test Page',
        description: 'Test description',
      });

      expect(tags['twitter:card']).toBe('summary_large_image');
      expect(tags['twitter:site']).toBe('@ecomafola');
      expect(tags['twitter:title']).toBe('Test Page | EcoMafola Peace');
    });

    it('should use custom twitter handle', () => {
      const tags = getTwitterCardTags({
        title: 'Test',
        description: 'Desc',
        twitterHandle: '@custom',
      });

      expect(tags['twitter:site']).toBe('@custom');
      expect(tags['twitter:creator']).toBe('@custom');
    });
  });

  describe('PageSeo component', () => {
    const wrapper = createWrapper();

    it('should render with basic props', () => {
      render(
        <PageSeo title="Test" description="Test description" />,
        { wrapper }
      );

      // If it renders without error, the test passes
      expect(true).toBe(true);
    });

    it('should render with all props', () => {
      render(
        <PageSeo
          title="Complete Test"
          description="Complete description"
          image="/test.jpg"
          type="article"
          canonical="/test"
          keywords={['test', 'seo']}
          siteName="Test Site"
        />,
        { wrapper }
      );

      expect(true).toBe(true);
    });

    it('should render with extra meta tags', () => {
      render(
        <PageSeo
          title="Test"
          description="Desc"
          extra={[
            { name: 'author', content: 'Test Author' },
            { property: 'article:author', content: 'Author Name' },
          ]}
        />,
        { wrapper }
      );

      expect(true).toBe(true);
    });
  });

  describe('PAGE_SEO presets', () => {
    it('should have home preset', () => {
      expect(PAGE_SEO.home.title).toBe('Handcrafted Pacific Treasures');
      expect(PAGE_SEO.home.canonical).toBe('/');
    });

    it('should have products preset', () => {
      expect(PAGE_SEO.products.title).toBe('Our Products');
      expect(PAGE_SEO.products.canonical).toBe('/products');
    });

    it('should have about preset', () => {
      expect(PAGE_SEO.about.title).toBe('About Us');
      expect(PAGE_SEO.about.canonical).toBe('/about');
    });

    it('should have contact preset', () => {
      expect(PAGE_SEO.contact.title).toBe('Contact Us');
      expect(PAGE_SEO.contact.canonical).toBe('/contact');
    });

    it('should have account preset', () => {
      expect(PAGE_SEO.account.title).toBe('My Account');
      expect(PAGE_SEO.account.canonical).toBe('/account');
    });

    it('should have login preset', () => {
      expect(PAGE_SEO.login.title).toBe('Sign In');
      expect(PAGE_SEO.login.canonical).toBe('/login');
    });

    it('should have checkout preset', () => {
      expect(PAGE_SEO.checkout.title).toBe('Checkout');
      expect(PAGE_SEO.checkout.canonical).toBe('/checkout');
    });
  });
});
