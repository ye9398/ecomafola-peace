import { describe, it, expect, vi } from 'vitest'

// Mock Product and Review types
interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price_usd: number;
  stock: number;
  images: string[];
}

interface Review {
  id: string;
  rating: number;
  author: string;
}

// SEO 函数实现（从 ProductDetailPage.tsx 复制）
const getProductSchema = (product: Product, reviews: Review[]) => {
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0"

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.filter(Boolean),
    "description": product.description.replace(/<[^>]*>/g, ''),
    "brand": {
      "@type": "Brand",
      "name": "EcoMafola Peace"
    },
    "material": "Natural Materials",
    "origin": "Samoa",
    "sku": product.sku || product.handle,
    "offers": {
      "@type": "Offer",
      "price": product.price_usd,
      "priceCurrency": "USD",
      "availability": product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "d"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 7,
            "maxValue": 15,
            "unitCode": "d"
          }
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": reviews.length.toString()
    }
  }
}

const getBreadcrumbSchema = (product: Product) => {
  const origin = 'https://ecomafola-peace.com'

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": `${origin}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `${origin}/products/${product.sku}`
      }
    ]
  }
}

// Mock Open Graph 标签生成函数
const getOpenGraphTags = (product: Product) => {
  const origin = 'https://ecomafola-peace.com'
  const description = product.description.replace(/<[^>]*>/g, '')

  return {
    // 基础 Open Graph
    'og:type': 'product',
    'og:site_name': 'EcoMafola Peace',
    'og:locale': 'en_US',
    'og:title': `${product.name} | EcoMafola Peace`,
    'og:description': description || `Handcrafted ${product.name} from Samoa`,
    'og:image': product.images[0],
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': `${product.name} - Handcrafted from Samoa`,
    'og:url': `${origin}/products/${product.sku}`,

    // 产品专用标签
    'product:price:amount': product.price_usd.toString(),
    'product:price:currency': 'USD',
    'product:availability': product.stock > 0 ? 'instock' : 'outofstock',
    'product:brand': 'EcoMafola Peace',
    'product:category': 'Home & Kitchen > Kitchen & Dining > Tableware',
    'product:condition': 'new',
  }
}

const getTwitterCardTags = (product: Product) => {
  const description = product.description.replace(/<[^>]*>/g, '')

  return {
    'twitter:card': 'summary_large_image',
    'twitter:site': '@ecomafola',
    'twitter:creator': '@ecomafola',
    'twitter:title': `${product.name} | EcoMafola Peace`,
    'twitter:description': description || `Handcrafted ${product.name} from Samoa`,
    'twitter:image': product.images[0],
    'twitter:image:alt': `${product.name} - Handcrafted from Samoa`,
    'twitter:label1': 'Price',
    'twitter:data1': `$${product.price_usd}`,
    'twitter:label2': 'Availability',
    'twitter:data2': product.stock > 0 ? 'In Stock' : 'Out of Stock',
  }
}

// Mock product data
const mockProduct: Product = {
  id: 'gid://shopify/Product/123456',
  sku: 'samoan-handcrafted-coconut-bowl',
  name: 'Samoan Handcrafted Coconut Bowl',
  description: 'Beautiful handcrafted coconut bowl made from natural materials.',
  price_usd: 29.99,
  stock: 100,
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
  ],
}

const mockReviews: Review[] = [
  { id: '1', rating: 5, author: 'Sarah M.' },
  { id: '2', rating: 4, author: 'James K.' },
]

describe('SEO Schema', () => {
  describe('getProductSchema', () => {
    it('should include brand information', () => {
      const schema = getProductSchema(mockProduct, mockReviews)
      expect(schema.brand).toBeDefined()
      expect(schema.brand?.name).toBe('EcoMafola Peace')
    })

    it('should include shipping details with free shipping', () => {
      const schema = getProductSchema(mockProduct, mockReviews)
      expect(schema.offers?.shippingDetails).toBeDefined()
      expect(schema.offers?.shippingDetails?.shippingRate?.value).toBe('0')
    })

    it('should include aggregateRating', () => {
      const schema = getProductSchema(mockProduct, mockReviews)
      expect(schema.aggregateRating).toBeDefined()
      expect(schema.aggregateRating?.ratingValue).toBeDefined()
      expect(schema.aggregateRating?.reviewCount).toBe(mockReviews.length.toString())
    })

    it('should include material and origin fields', () => {
      const schema = getProductSchema(mockProduct, mockReviews)
      expect(schema.material).toBe('Natural Materials')
      expect(schema.origin).toBe('Samoa')
    })

    it('should include correct availability based on stock', () => {
      const inStockProduct = { ...mockProduct, stock: 100 }
      const outOfStockProduct = { ...mockProduct, stock: 0 }

      const inStockSchema = getProductSchema(inStockProduct, mockReviews)
      const outOfStockSchema = getProductSchema(outOfStockProduct, mockReviews)

      expect(inStockSchema.offers?.availability).toBe('https://schema.org/InStock')
      expect(outOfStockSchema.offers?.availability).toBe('https://schema.org/OutOfStock')
    })

    it('should calculate average rating correctly', () => {
      const reviews = [
        { id: '1', rating: 5, author: 'A' },
        { id: '2', rating: 3, author: 'B' },
      ]
      const schema = getProductSchema(mockProduct, reviews)
      expect(schema.aggregateRating?.ratingValue).toBe('4.0')
    })

    it('should default to 5.0 rating when no reviews', () => {
      const schema = getProductSchema(mockProduct, [])
      expect(schema.aggregateRating?.ratingValue).toBe('5.0')
    })
  })

  describe('getBreadcrumbSchema', () => {
    it('should include 3 levels of breadcrumb', () => {
      const schema = getBreadcrumbSchema(mockProduct)
      expect(schema.itemListElement).toHaveLength(3)
    })

    it('should have correct breadcrumb structure', () => {
      const schema = getBreadcrumbSchema(mockProduct)
      expect(schema.itemListElement[0]?.name).toBe('Home')
      expect(schema.itemListElement[1]?.name).toBe('Products')
      expect(schema.itemListElement[2]?.name).toBe(mockProduct.name)
    })

    it('should include correct URLs for each level', () => {
      const schema = getBreadcrumbSchema(mockProduct)
      expect(schema.itemListElement[0]?.item).toBe('https://ecomafola-peace.com')
      expect(schema.itemListElement[1]?.item).toBe('https://ecomafola-peace.com/products')
      expect(schema.itemListElement[2]?.item).toContain('/products/')
    })
  })
})

describe('Open Graph Tags', () => {
  describe('getOpenGraphTags', () => {
    it('should include all required og:* tags', () => {
      const tags = getOpenGraphTags(mockProduct)
      const requiredTags = ['og:type', 'og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'og:locale']

      requiredTags.forEach(tag => {
        expect(tags[tag as keyof typeof tags]).toBeDefined()
      })
    })

    it('should include all product:* tags', () => {
      const tags = getOpenGraphTags(mockProduct)
      const productTags = ['product:price:amount', 'product:price:currency', 'product:availability', 'product:brand', 'product:category', 'product:condition']

      productTags.forEach(tag => {
        expect(tags[tag as keyof typeof tags]).toBeDefined()
      })
    })

    it('should have correct og:image dimensions', () => {
      const tags = getOpenGraphTags(mockProduct)
      expect(tags['og:image:width']).toBe('1200')
      expect(tags['og:image:height']).toBe('630')
    })

    it('should include og:image:alt', () => {
      const tags = getOpenGraphTags(mockProduct)
      expect(tags['og:image:alt']).toContain(mockProduct.name)
    })

    it('should include correct product price and currency', () => {
      const tags = getOpenGraphTags(mockProduct)
      expect(tags['product:price:amount']).toBe(mockProduct.price_usd.toString())
      expect(tags['product:price:currency']).toBe('USD')
    })
  })

  describe('getTwitterCardTags', () => {
    it('should include all required twitter:* tags', () => {
      const tags = getTwitterCardTags(mockProduct)
      const requiredTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:site']

      requiredTags.forEach(tag => {
        expect(tags[tag as keyof typeof tags]).toBeDefined()
      })
    })

    it('should use summary_large_image card type', () => {
      const tags = getTwitterCardTags(mockProduct)
      expect(tags['twitter:card']).toBe('summary_large_image')
    })

    it('should include twitter:image:alt', () => {
      const tags = getTwitterCardTags(mockProduct)
      expect(tags['twitter:image:alt']).toContain(mockProduct.name)
    })

    it('should include twitter:label and twitter:data for price and availability', () => {
      const tags = getTwitterCardTags(mockProduct)
      expect(tags['twitter:label1']).toBe('Price')
      expect(tags['twitter:data1']).toContain('$')
      expect(tags['twitter:label2']).toBe('Availability')
    })
  })
})
