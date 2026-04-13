/**
 * Extended Schema.org Generator for EcoMafola Peace
 *
 * Generates comprehensive structured data for:
 * - Product with Offer and AggregateRating
 * - LocalBusiness (Samoa headquarters)
 * - BreadcrumbList
 * - FAQPage
 */

export interface ProductSchemaParams {
  name: string
  description: string
  price: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  image?: string[]
  brand?: string
  category?: string
  material?: string
  countryOfOrigin?: string
  reviews?: Review[]
  howToSteps?: HowToStep[]
}

export interface Review {
  author: string
  rating: number
  title: string
  body: string
  date: string
  verified?: boolean
}

export interface HowToStep {
  name: string
  text: string
  position: number
}

/**
 * Generate Product Schema with full e-commerce properties
 */
export function generateProductSchema(params: ProductSchemaParams) {
  const {
    name,
    description,
    price,
    currency = 'USD',
    availability = 'InStock',
    image = [],
    brand = 'EcoMafola Peace',
    category = 'Handcrafted Home Decor',
    material = 'Natural Materials',
    countryOfOrigin = 'Samoa',
    reviews = [],
  } = params

  // Calculate aggregate rating
  const reviewCount = reviews.length
  const averageRating = reviewCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : '5.0'

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description.substring(0, 500),
    image: image.map((url, idx) => ({
      '@type': 'ImageObject',
      url,
      width: '1200',
      height: '1200',
      caption: `${name} - Image ${idx + 1}`,
    })),
    brand: {
      '@type': 'Brand',
      name: brand,
      sameAs: 'https://ecomafola.com',
    },
    category,
    material,
    countryOfOrigin,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url: `https://ecomafola.com/product/${name.toLowerCase().replace(/\s+/g, '-')}`,
      seller: {
        '@type': 'Organization',
        name: 'EcoMafola Peace',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 7,
            maxValue: 12,
            unitCode: 'd',
          },
        },
      },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Sustainable', value: 'true' },
      { '@type': 'PropertyValue', name: 'Handmade', value: 'true' },
      { '@type': 'PropertyValue', name: 'Fair Trade', value: 'true' },
      { '@type': 'PropertyValue', name: 'Eco-Friendly', value: 'true' },
    ],
  }

  // Add aggregate rating if reviews exist
  if (reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    }

    // Add individual reviews
    schema.review = reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.date,
      reviewBody: review.body,
      reviewHeading: review.title,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      verifiedPurchase: review.verified,
    }))
  }

  return schema
}

/**
 * Generate LocalBusiness Schema for Samoa headquarters
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'EcoMafola Peace',
    image: 'https://ecomafola.com/logo.png',
    description: 'Authentic handcrafted Pacific treasures from Samoa. Supporting traditional artisans through fair trade.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Apia',
      addressRegion: 'Tuamasaga',
      postalCode: '00290',
      addressCountry: 'WS',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-13.8333',
      longitude: '-171.7500',
    },
    url: 'https://ecomafola.com',
    telephone: '+685-123-4567',
    email: 'hello@ecomafola.com',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
      timeZone: 'Pacific/Apia',
    },
    sameAs: [
      'https://www.facebook.com/ecomafola',
      'https://www.instagram.com/ecomafola',
      'https://twitter.com/ecomafola',
    ],
    priceRange: '$$',
    paymentAccepted: 'Credit Card, PayPal',
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide',
    },
  }
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://ecomafola.com${item.url}`,
    })),
  }
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate HowTo Schema for product care guides
 */
export function generateHowToSchema(params: {
  name: string
  description: string
  totalTime: string // ISO 8601 duration (e.g., "PT5M")
  steps: HowToStep[]
  supplies?: string[]
  tools?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.name,
    description: params.description,
    totalTime: params.totalTime,
    step: params.steps.map((step) => ({
      '@type': 'HowToStep',
      position: step.position,
      name: step.name,
      text: step.text,
    })),
    supply: (params.supplies || []).map((item) => ({
      '@type': 'HowToSupply',
      name: item,
    })),
    tool: (params.tools || []).map((item) => ({
      '@type': 'HowToTool',
      name: item,
    })),
  }
}
