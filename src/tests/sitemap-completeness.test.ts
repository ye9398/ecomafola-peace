/**
 * Sitemap Completeness Tests
 *
 * Phase 1.3: Verify that all product pages are included in sitemap.xml
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PRODUCTS } from '../lib/seo-config';

const sitemapPath = path.resolve(__dirname, '../../public/sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

describe('Sitemap Completeness (Phase 1.3)', () => {
  describe('All product pages present in sitemap', () => {
    for (const [handle, product] of Object.entries(PRODUCTS)) {
      it(`should include /product/${handle}`, () => {
        expect(sitemapContent).toContain(`https://ecomafola.com/product/${handle}`);
      });
    }
  });

  describe('Product page structure', () => {
    const productHandles = Object.keys(PRODUCTS);

    it('should have changefreq for product pages', () => {
      // Each product URL should have a changefreq
      for (const handle of productHandles) {
        const urlBlock = extractUrlBlock(`product/${handle}`);
        expect(urlBlock).toContain('<changefreq>');
      }
    });

    it('should have priority for product pages', () => {
      for (const handle of productHandles) {
        const urlBlock = extractUrlBlock(`product/${handle}`);
        expect(urlBlock).toContain('<priority>');
      }
    });

    it('should have at least 20 total <url> entries', () => {
      const urlCount = (sitemapContent.match(/<url>/g) || []).length;
      expect(urlCount).toBeGreaterThanOrEqual(20);
    });
  });

  describe('Consistency with SSG routes', () => {
    it('should have same product count as seo-config', () => {
      const productUrls = sitemapContent.match(/\/product\/[^<]+/g) || [];
      expect(productUrls.length).toBe(Object.keys(PRODUCTS).length);
    });

    it('should include all key pages', () => {
      const requiredPages = [
        '/',
        '/products',
        '/our-story',
        '/impact',
        '/contact',
        '/faq',
        '/blog',
        '/privacy-policy',
        '/shipping-returns',
        '/track',
      ];
      for (const page of requiredPages) {
        expect(sitemapContent).toContain(`https://ecomafola.com${page}`);
      }
    });
  });
});

/**
 * Extract the <url> block for a given path from sitemap content.
 */
function extractUrlBlock(path: string): string {
  const regex = new RegExp(`<url>[\\s\\S]*?<loc>[^<]*?${path}[^<]*?</loc>[\\s\\S]*?</url>`, 'g');
  const match = sitemapContent.match(regex);
  return match ? match[0] : '';
}
