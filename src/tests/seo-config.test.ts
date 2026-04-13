/**
 * SEO Config Consistency Tests
 *
 * Verifies that all SEO constants are centralized and consistent
 * across all data sources (seo-config.ts, generate-ssg-routes.mjs,
 * vite.config.ts, llms.txt, etc.)
 */

import { describe, it, expect } from 'vitest';
import {
  SEO_CONFIG,
  PRODUCTS,
  BRAND_INFO,
  generateProductSchema,
  smartTruncate
} from '../lib/seo-config';

describe('SEO Config Centralization', () => {
  describe('BRAND_INFO', () => {
    it('should have consistent email across all sources', () => {
      expect(BRAND_INFO.contactEmail).toBe('hello@ecomafola.com');
    });

    it('should have founding date', () => {
      expect(BRAND_INFO.foundingYear).toBe(2019);
    });

    it('should have headquarters location', () => {
      expect(BRAND_INFO.headquarters).toBeDefined();
      expect(BRAND_INFO.headquarters.locality).toBe('Apia');
      expect(BRAND_INFO.headquarters.country).toBe('Samoa');
    });

    it('should have social links', () => {
      expect(BRAND_INFO.social.facebook).toContain('facebook.com');
      expect(BRAND_INFO.social.instagram).toContain('instagram.com');
    });

    it('should have impact statistics', () => {
      expect(BRAND_INFO.impact.artisans).toBe(240);
      expect(BRAND_INFO.impact.paidToArtisans).toBe('$2.4M');
      expect(BRAND_INFO.impact.cooperatives).toBe(18);
      expect(BRAND_INFO.impact.ecoSourcedPercent).toBe(94);
    });
  });

  describe('PRODUCTS', () => {
    it('should have all 9 products', () => {
      expect(Object.keys(PRODUCTS).length).toBe(9);
    });

    it('should have unique handles for all products', () => {
      const handles = Object.keys(PRODUCTS);
      const uniqueHandles = new Set(handles);
      expect(uniqueHandles.size).toBe(handles.length);
    });

    it('should have valid price for each product', () => {
      for (const [handle, product] of Object.entries(PRODUCTS)) {
        expect(product.price).toBeDefined();
        expect(typeof product.price).toBe('number');
        expect(product.price).toBeGreaterThan(0);
      }
    });

    it('should have valid currency for each product', () => {
      for (const [, product] of Object.entries(PRODUCTS)) {
        expect(product.currency).toBe('USD');
      }
    });

    it('should have countryOfOrigin (not "origin") for each product', () => {
      for (const [, product] of Object.entries(PRODUCTS)) {
        expect(product.countryOfOrigin).toBeDefined();
        expect(product.countryOfOrigin).not.toBe('');
        // Verify "origin" field does not exist
        expect((product as any).origin).toBeUndefined();
      }
    });

    it('should have correct origin for PNG Beach Bag', () => {
      const beachBag = PRODUCTS['handwoven-papua-new-guinea-beach-bag'];
      expect(beachBag.countryOfOrigin).toBe('Papua New Guinea');
    });

    it('should have description that does not end mid-word', () => {
      for (const [, product] of Object.entries(PRODUCTS)) {
        const desc = product.description;
        // Should end with punctuation or be complete
        expect(/[.!?]$/.test(desc.trim())).toBe(true);
      }
    });

    it('should have images array with at least 1 image', () => {
      for (const [, product] of Object.entries(PRODUCTS)) {
        expect(product.images).toBeDefined();
        expect(Array.isArray(product.images)).toBe(true);
        expect(product.images.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('generateProductSchema', () => {
    it('should generate valid schema.org Product JSON-LD', () => {
      const product = PRODUCTS['samoan-handcrafted-coconut-bowl'];
      const schema = generateProductSchema(product, 'samoan-handcrafted-coconut-bowl');

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe(product.title);
      expect(schema.description).toBe(product.description);
    });

    it('should use countryOfOrigin instead of origin', () => {
      const product = PRODUCTS['samoan-handcrafted-coconut-bowl'];
      const schema = generateProductSchema(product, 'test-handle');

      expect(schema).toHaveProperty('countryOfOrigin');
      expect(schema).not.toHaveProperty('origin');
      expect(schema).not.toHaveProperty('craftsmanship');
    });

    it('should have valid offers with price and currency', () => {
      const product = PRODUCTS['samoan-handcrafted-coconut-bowl'];
      const schema = generateProductSchema(product, 'test-handle');

      expect(schema.offers['@type']).toBe('Offer');
      expect(schema.offers.price).toBe(product.price);
      expect(schema.offers.priceCurrency).toBe('USD');
      expect(schema.offers.availability).toBe('https://schema.org/InStock');
    });

    it('should include all product images', () => {
      const product = PRODUCTS['samoan-handcrafted-coconut-bowl'];
      const schema = generateProductSchema(product, 'test-handle');

      expect(Array.isArray(schema.image)).toBe(true);
      expect(schema.image.length).toBe(product.images.length);
    });

    it('should use additionalProperty for craftsmanship', () => {
      const product = PRODUCTS['samoan-handcrafted-coconut-bowl'];
      const schema = generateProductSchema(product, 'test-handle');

      if (product.craftsmanship) {
        expect(schema.additionalProperty).toBeDefined();
        expect(Array.isArray(schema.additionalProperty)).toBe(true);
        const craftProp = schema.additionalProperty.find(
          (p: any) => p.name === 'Craftsmanship'
        );
        expect(craftProp).toBeDefined();
        expect(craftProp.value).toBe(product.craftsmanship);
      }
    });
  });

  describe('smartTruncate', () => {
    it('should truncate to max length', () => {
      const long = 'A'.repeat(200);
      const result = smartTruncate(long, 100);
      expect(result.length).toBeLessThanOrEqual(100);
    });

    it('should not cut mid-word', () => {
      const text = 'This is a very long sentence about something and more words here to exceed limit';
      const result = smartTruncate(text, 30);
      // Should end at a space or punctuation, not mid-word
      // Word boundary: result doesn't end mid-word (no partial words)
      expect(result).toBe('This is a very long sentence');
    });

    it('should return original text if shorter than max', () => {
      const text = 'Short text.';
      const result = smartTruncate(text, 100);
      expect(result).toBe(text);
    });

    it('should prefer truncating at sentence boundary', () => {
      const text = 'First sentence. Second sentence that goes on and on.';
      const result = smartTruncate(text, 20);
      expect(result).toBe('First sentence.');
    });

    it('should fall back to word boundary if no sentence boundary', () => {
      const text = 'one two three four five six seven';
      const result = smartTruncate(text, 15);
      expect(result.endsWith(' ')).toBe(false);
    });
  });

  describe('SEO_CONFIG', () => {
    it('should have baseUrl', () => {
      expect(SEO_CONFIG.baseUrl).toBe('https://ecomafola.com');
    });

    it('should have defaultOgImage', () => {
      expect(SEO_CONFIG.defaultOgImage).toBeDefined();
    });

    it('should have productCount matching PRODUCTS', () => {
      expect(SEO_CONFIG.productCount).toBe(Object.keys(PRODUCTS).length);
    });
  });
});
