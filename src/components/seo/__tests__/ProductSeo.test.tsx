/**
 * Product SEO Component Tests
 */

import { describe, it, expect } from 'vitest';
import ProductSeo, {
  getProductSchema,
  getBreadcrumbSchema,
  getOpenGraphTags,
  getTwitterCardTags,
  getPageTitle,
  getPageDescription,
  PAGE_DESCRIPTIONS,
  type ProductSeoData,
  type ReviewData,
  type SeoOptions,
} from '../ProductSeo';

describe('ProductSeo', () => {
  const mockProduct: ProductSeoData = {
    id: 'gid://shopify/Product/123',
    name: 'Samoan Handcrafted Coconut Bowl',
    description: 'Beautiful handcrafted coconut bowl made from natural materials.',
    handle: 'samoan-handcrafted-coconut-bowl',
    sku: 'COCONUT-BOWL-001',
    images: [
      'https://cdn.shopify.com/image1.jpg',
      'https://cdn.shopify.com/image2.jpg',
    ],
    price: 29.99,
    currency: 'USD',
    stock: 100,
    category: 'Home & Kitchen',
    brand: 'EcoMafola Peace',
    origin: 'Samoa',
    material: 'Natural Coconut',
  };

  const mockReviews: ReviewData[] = [
    { id: '1', rating: 5, author: 'Sarah M.', content: 'Great product!' },
    { id: '2', rating: 4, author: 'James K.', content: 'Good quality.' },
  ];

  describe('getProductSchema', () => {
    it('should generate valid product schema', () => {
      const schema = getProductSchema(mockProduct);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe(mockProduct.name);
      expect(schema.sku).toBe(mockProduct.sku);
    });

    it('should include brand information', () => {
      const schema = getProductSchema(mockProduct);

      expect(schema.brand).toBeDefined();
      expect(schema.brand.name).toBe('EcoMafola Peace');
    });

    it('should include offers with correct price', () => {
      const schema = getProductSchema(mockProduct);

      expect(schema.offers.price).toBe(29.99);
      expect(schema.offers.priceCurrency).toBe('USD');
    });

    it('should set availability based on stock', () => {
      const inStockProduct = { ...mockProduct, stock: 100 };
      const outOfStockProduct = { ...mockProduct, stock: 0 };

      const inStockSchema = getProductSchema(inStockProduct);
      const outOfStockSchema = getProductSchema(outOfStockProduct);

      expect(inStockSchema.offers.availability).toBe('https://schema.org/InStock');
      expect(outOfStockSchema.offers.availability).toBe('https://schema.org/OutOfStock');
    });

    it('should include aggregate rating from reviews', () => {
      const schema = getProductSchema(mockProduct, { reviews: mockReviews });

      expect(schema.aggregateRating).toBeDefined();
      expect(schema.aggregateRating.ratingValue).toBe('4.5');
      expect(schema.aggregateRating.reviewCount).toBe('2');
    });

    it('should default to 5.0 rating when no reviews', () => {
      const schema = getProductSchema(mockProduct, { reviews: [] });

      expect(schema.aggregateRating.ratingValue).toBe('5.0');
      expect(schema.aggregateRating.reviewCount).toBe('0');
    });

    it('should include shipping details with free shipping by default', () => {
      const schema = getProductSchema(mockProduct);

      expect(schema.offers.shippingDetails).toBeDefined();
      expect(schema.offers.shippingDetails.shippingRate.value).toBe('0');
    });

    it('should accept custom shipping cost', () => {
      const schema = getProductSchema(mockProduct, { shippingCost: 9.99 });

      expect(schema.offers.shippingDetails.shippingRate.value).toBe('9.99');
    });

    it('should include delivery time', () => {
      const schema = getProductSchema(mockProduct, {
        deliveryTime: { min: 5, max: 10 },
      });

      expect(schema.offers.shippingDetails.deliveryTime.transitTime.minValue).toBe(5);
      expect(schema.offers.shippingDetails.deliveryTime.transitTime.maxValue).toBe(10);
    });

    it('should strip HTML from description', () => {
      const productWithHtml = {
        ...mockProduct,
        description: '<p>Beautiful <strong>handcrafted</strong> bowl</p>',
      };

      const schema = getProductSchema(productWithHtml);

      expect(schema.description).toBe('Beautiful handcrafted bowl');
    });

    it('should include material and origin from product', () => {
      const schema = getProductSchema(mockProduct);

      expect(schema.material).toBe('Natural Coconut');
      expect(schema.origin).toBe('Samoa');
    });

    it('should use default material and origin when not provided', () => {
      const minimalProduct: ProductSeoData = {
        id: '1',
        name: 'Test Product',
        description: 'Test',
        handle: 'test',
        images: [],
        price: 10,
        stock: 10,
      };

      const schema = getProductSchema(minimalProduct);

      expect(schema.material).toBe('Natural Materials');
      expect(schema.origin).toBe('Samoa');
    });
  });

  describe('getBreadcrumbSchema', () => {
    it('should generate valid breadcrumb schema', () => {
      const schema = getBreadcrumbSchema(mockProduct);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
    });

    it('should include 3 levels of breadcrumb', () => {
      const schema = getBreadcrumbSchema(mockProduct);

      expect(schema.itemListElement).toHaveLength(3);
    });

    it('should have correct breadcrumb structure', () => {
      const schema = getBreadcrumbSchema(mockProduct);

      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].name).toBe('Products');
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].name).toBe(mockProduct.name);
      expect(schema.itemListElement[2].position).toBe(3);
    });

    it('should use correct URLs', () => {
      const schema = getBreadcrumbSchema(mockProduct, { origin: 'https://test.com' });

      expect(schema.itemListElement[0].item).toBe('https://test.com');
      expect(schema.itemListElement[1].item).toBe('https://test.com/products');
      expect(schema.itemListElement[2].item).toBe(
        'https://test.com/products/COCONUT-BOWL-001'
      );
    });

    it('should fallback to handle when no SKU', () => {
      const productWithoutSku = { ...mockProduct, sku: undefined };
      const schema = getBreadcrumbSchema(productWithoutSku, { origin: 'https://test.com' });

      expect(schema.itemListElement[2].item).toBe(
        'https://test.com/products/samoan-handcrafted-coconut-bowl'
      );
    });
  });

  describe('getOpenGraphTags', () => {
    it('should generate all required og:* tags', () => {
      const tags = getOpenGraphTags(mockProduct);

      const requiredTags = [
        'og:type',
        'og:title',
        'og:description',
        'og:image',
        'og:url',
        'og:site_name',
        'og:locale',
      ];

      requiredTags.forEach((tag) => {
        expect(tags[tag]).toBeDefined();
      });
    });

    it('should include all product:* tags', () => {
      const tags = getOpenGraphTags(mockProduct);

      const productTags = [
        'product:price:amount',
        'product:price:currency',
        'product:availability',
        'product:brand',
        'product:category',
        'product:condition',
      ];

      productTags.forEach((tag) => {
        expect(tags[tag]).toBeDefined();
      });
    });

    it('should have correct og:image dimensions', () => {
      const tags = getOpenGraphTags(mockProduct);

      expect(tags['og:image:width']).toBe('1200');
      expect(tags['og:image:height']).toBe('630');
    });

    it('should include og:image:alt', () => {
      const tags = getOpenGraphTags(mockProduct);

      expect(tags['og:image:alt']).toContain(mockProduct.name);
    });

    it('should use first image for og:image', () => {
      const tags = getOpenGraphTags(mockProduct);

      expect(tags['og:image']).toBe(mockProduct.images[0]);
    });

    it('should handle empty images array', () => {
      const productWithoutImages = { ...mockProduct, images: [] };
      const tags = getOpenGraphTags(productWithoutImages);

      expect(tags['og:image']).toBe('');
    });

    it('should include correct product price and currency', () => {
      const tags = getOpenGraphTags(mockProduct);

      expect(tags['product:price:amount']).toBe('29.99');
      expect(tags['product:price:currency']).toBe('USD');
    });

    it('should accept custom origin', () => {
      const tags = getOpenGraphTags(mockProduct, { origin: 'https://custom.com' });

      expect(tags['og:url']).toBe('https://custom.com/products/samoan-handcrafted-coconut-bowl');
    });

    it('should accept custom site name', () => {
      const tags = getOpenGraphTags(mockProduct, { siteName: 'Custom Store' });

      expect(tags['og:site_name']).toBe('Custom Store');
      expect(tags['og:title']).toContain('Custom Store');
    });

    it('should strip HTML from description', () => {
      const productWithHtml = {
        ...mockProduct,
        description: '<p>Description with <strong>HTML</strong></p>',
      };
      const tags = getOpenGraphTags(productWithHtml);

      expect(tags['og:description']).not.toContain('<');
    });
  });

  describe('getTwitterCardTags', () => {
    it('should generate all required twitter:* tags', () => {
      const tags = getTwitterCardTags(mockProduct);

      const requiredTags = [
        'twitter:card',
        'twitter:title',
        'twitter:description',
        'twitter:image',
        'twitter:site',
      ];

      requiredTags.forEach((tag) => {
        expect(tags[tag]).toBeDefined();
      });
    });

    it('should use summary_large_image card type', () => {
      const tags = getTwitterCardTags(mockProduct);

      expect(tags['twitter:card']).toBe('summary_large_image');
    });

    it('should include twitter:image:alt', () => {
      const tags = getTwitterCardTags(mockProduct);

      expect(tags['twitter:image:alt']).toContain(mockProduct.name);
    });

    it('should include twitter:label and twitter:data for price and availability', () => {
      const tags = getTwitterCardTags(mockProduct);

      expect(tags['twitter:label1']).toBe('Price');
      expect(tags['twitter:data1']).toContain('$');
      expect(tags['twitter:label2']).toBe('Availability');
    });

    it('should accept custom twitter handle', () => {
      const tags = getTwitterCardTags(mockProduct, { twitterHandle: '@custom' });

      expect(tags['twitter:site']).toBe('@custom');
      expect(tags['twitter:creator']).toBe('@custom');
    });
  });

  describe('ProductSeo Component', () => {
    it('should be a function that returns JSX', () => {
      expect(typeof ProductSeo).toBe('function');
    });

    it('should return valid element', () => {
      const element = ProductSeo({ product: mockProduct });
      expect(element).toBeDefined();
      // Element type is the Helmet component
      expect(element.type).toBeDefined();
    });
  });

  describe('getPageTitle', () => {
    it('should generate page title with default options', () => {
      const title = getPageTitle('About Us');

      expect(title).toBe('About Us | EcoMafola Peace');
    });

    it('should accept custom site name', () => {
      const title = getPageTitle('Contact', { siteName: 'Custom Store' });

      expect(title).toBe('Contact | Custom Store');
    });

    it('should accept custom separator', () => {
      const title = getPageTitle('Home', { separator: '-' });

      expect(title).toBe('Home - EcoMafola Peace');
    });
  });

  describe('getPageDescription', () => {
    it('should return description for known page keys', () => {
      expect(getPageDescription('home')).toContain('Pacific treasures');
      expect(getPageDescription('products')).toContain('handcrafted');
      expect(getPageDescription('about')).toContain('artisans');
    });

    it('should return fallback for unknown keys', () => {
      const description = getPageDescription('unknown');

      expect(description).toBe(PAGE_DESCRIPTIONS.home);
    });

    it('should accept custom fallback', () => {
      const description = getPageDescription('unknown', 'Custom fallback');

      expect(description).toBe('Custom fallback');
    });
  });

  describe('PAGE_DESCRIPTIONS', () => {
    it('should have descriptions for common pages', () => {
      expect(PAGE_DESCRIPTIONS.home).toBeDefined();
      expect(PAGE_DESCRIPTIONS.products).toBeDefined();
      expect(PAGE_DESCRIPTIONS.about).toBeDefined();
      expect(PAGE_DESCRIPTIONS.contact).toBeDefined();
    });

    it('should have reasonable length descriptions', () => {
      Object.values(PAGE_DESCRIPTIONS).forEach((desc) => {
        expect(desc.length).toBeGreaterThan(50);
        expect(desc.length).toBeLessThan(200);
      });
    });
  });
});
