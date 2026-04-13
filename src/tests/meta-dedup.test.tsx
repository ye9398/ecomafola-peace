/**
 * Meta Tag Deduplication Tests
 *
 * Phase 1.2: Verify that SEO components use centralized constants
 * and that meta tag generation functions produce correct, non-duplicate output.
 */

import { describe, it, expect } from 'vitest';
import { getOpenGraphTags, getTwitterCardTags } from '../components/seo/PageSeo';
import { PAGE_SEO } from '../lib/seo';
import { SEO_CONFIG, BRAND_INFO } from '../lib/seo-config';

describe('Meta Tag Deduplication (Phase 1.2)', () => {
  describe('PageSeo generates exactly one of each tag', () => {
    const props = {
      title: 'Test Page',
      description: 'Test description for dedup testing.',
      canonical: '/test',
    };

    it('should generate exactly one og:title', () => {
      const tags = getOpenGraphTags(props);
      expect(tags['og:title']).toBe('Test Page | EcoMafola Peace');
    });

    it('should generate exactly one og:description', () => {
      const tags = getOpenGraphTags(props);
      expect(tags['og:description']).toBe(props.description);
    });

    it('should generate exactly one twitter:title', () => {
      const tags = getTwitterCardTags(props);
      expect(tags['twitter:title']).toBe('Test Page | EcoMafola Peace');
    });

    it('should generate exactly one twitter:description', () => {
      const tags = getTwitterCardTags(props);
      expect(tags['twitter:description']).toBe(props.description);
    });

    it('should generate og:image with correct fallback', () => {
      const tags = getOpenGraphTags(props);
      expect(tags['og:image']).toContain('/og-default.jpg');
    });

    it('should include og:site_name from centralized BRAND_INFO', () => {
      const tags = getOpenGraphTags(props);
      expect(tags['og:site_name']).toBe(BRAND_INFO.siteName);
    });
  });

  describe('PAGE_SEO uses centralized BRAND_INFO siteName', () => {
    it('should have home page title consistent with BRAND_INFO', () => {
      expect(PAGE_SEO.home.title).toContain('EcoMafola Peace');
    });

    it('should have unique canonical URLs for all pages', () => {
      const canonicals = Object.values(PAGE_SEO).map(p => p.canonical);
      const unique = new Set(canonicals);
      expect(unique.size).toBe(canonicals.length);
    });

    it('should have descriptions that do not end mid-sentence', () => {
      for (const [, page] of Object.entries(PAGE_SEO)) {
        expect(/[.!?]$/.test(page.description.trim())).toBe(true);
      }
    });
  });

  describe('Centralized config usage', () => {
    it('should have SEO_CONFIG.baseUrl', () => {
      expect(SEO_CONFIG.baseUrl).toBe('https://ecomafola.com');
    });

    it('should have BRAND_INFO.siteName', () => {
      expect(BRAND_INFO.siteName).toBe('EcoMafola Peace');
    });

    it('should have BRAND_INFO.social links', () => {
      expect(BRAND_INFO.social.facebook).toContain('facebook.com');
      expect(BRAND_INFO.social.instagram).toContain('instagram.com');
      expect(BRAND_INFO.social.tiktok).toContain('tiktok.com');
    });
  });
});
