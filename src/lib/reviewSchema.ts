/**
 * Review Schema Generator for Product Ratings
 *
 * Generates Schema.org Review and AggregateRating structured data.
 * Optimized for Google Rich Results and AI search citation.
 *
 * Example output:
 * {
 *   "@context": "https://schema.org",
 *   "@type": "Product",
 *   "name": "Samoan Handcrafted Coconut Bowl",
 *   "aggregateRating": {
 *     "@type": "AggregateRating",
 *     "ratingValue": "4.8",
 *     "reviewCount": "127"
 *   },
 *   "review": [
 *     {
 *       "@type": "Review",
 *       "author": { "@type": "Person", "name": "Jane D." },
 *       "datePublished": "2026-03-15",
 *       "reviewBody": "Beautiful craftsmanship...",
 *       "reviewRating": {
 *         "@type": "Rating",
 *         "ratingValue": "5"
 *       }
 *     }
 *   ]
 * }
 */

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  body: string
  date: string
  verified?: boolean
  helpful?: number
  images?: string[]
}

export interface AggregateRating {
  average: number
  count: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface ProductReviewSchema {
  "@context": "https://schema.org"
  "@type": "Product"
  name: string
  aggregateRating: {
    "@type": "AggregateRating"
    ratingValue: string
    reviewCount: string
    bestRating: string
    worstRating: string
  }
  review?: ReviewSchema[]
}

export interface ReviewSchema {
  "@context": "https://schema.org"
  "@type": "Review"
  author: {
    "@type": "Person"
    name: string
  }
  datePublished: string
  reviewBody: string
  reviewHeading?: string
  reviewRating: {
    "@type": "Rating"
    ratingValue: string
    bestRating: string
    worstRating: string
  }
  verifiedPurchase?: boolean
}

/**
 * Generate AggregateRating Schema from rating data
 */
export function generateAggregateRatingSchema(
  productName: string,
  average: number,
  count: number
): ProductReviewSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": average.toFixed(1),
      "reviewCount": count.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  }
}

/**
 * Generate individual Review Schema
 */
export function generateReviewSchema(
  review: Review
): ReviewSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "datePublished": review.date,
    "reviewBody": review.body,
    "reviewHeading": review.title,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "verifiedPurchase": review.verified || false
  }
}

/**
 * Generate full Product Review Schema with aggregate + individual reviews
 */
export function generateProductReviewSchema(
  productName: string,
  average: number,
  count: number,
  reviews?: Review[]
): ProductReviewSchema {
  const schema: ProductReviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": average.toFixed(1),
      "reviewCount": count.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  if (reviews && reviews.length > 0) {
    schema.review = reviews.map(r => generateReviewSchema(r))
  }

  return schema
}

/**
 * Mock review data for demonstration (replace with real API data)
 */
export const MOCK_REVIEWS: Record<string, Review[]> = {
  'samoan-handcrafted-coconut-bowl': [
    {
      id: 'rev-001',
      productId: 'samoan-handcrafted-coconut-bowl',
      author: 'Sarah M.',
      rating: 5,
      title: 'Beautiful craftsmanship!',
      body: 'This coconut bowl exceeded my expectations. The smooth finish and natural patterns make every meal feel special. I love knowing it was handcrafted by skilled artisans in Samoa.',
      date: '2026-03-15',
      verified: true,
      helpful: 12
    },
    {
      id: 'rev-002',
      productId: 'samoan-handcrafted-coconut-bowl',
      author: 'James K.',
      rating: 5,
      title: 'Perfect size and quality',
      body: 'Great for smoothie bowls or salads. The size is perfect and the quality is outstanding. Easy to clean and maintain with the included care instructions.',
      date: '2026-03-10',
      verified: true,
      helpful: 8
    },
    {
      id: 'rev-003',
      productId: 'samoan-handcrafted-coconut-bowl',
      author: 'Emily R.',
      rating: 4,
      title: 'Love it, but smaller than expected',
      body: 'Beautiful bowl with amazing detail. Just a bit smaller than I imagined from the photos. Still use it daily for my morning acai bowls!',
      date: '2026-02-28',
      verified: true,
      helpful: 5
    }
  ],
  'samoan-handwoven-grass-tote-bag': [
    {
      id: 'rev-004',
      productId: 'samoan-handwoven-grass-tote-bag',
      author: 'Lisa T.',
      rating: 5,
      title: 'Perfect beach bag',
      body: 'This tote is exactly what I needed for beach days. Sturdy, spacious, and the natural grass material dries quickly. Gets compliments everywhere I go!',
      date: '2026-03-12',
      verified: true,
      helpful: 9
    },
    {
      id: 'rev-005',
      productId: 'samoan-handwoven-grass-tote-bag',
      author: 'Michelle P.',
      rating: 5,
      title: 'Supporting artisans feels great',
      body: 'Not only is this bag beautiful and functional, but knowing it supports traditional Samoan weaving makes it even more special. The craftsmanship is incredible.',
      date: '2026-03-08',
      verified: true,
      helpful: 7
    }
  ],
  'samoan-woven-basket': [
    {
      id: 'rev-006',
      productId: 'samoan-woven-basket',
      author: 'Amanda H.',
      rating: 5,
      title: 'Stunning decorative piece',
      body: 'This basket is absolutely gorgeous. I use it for storing throw blankets in my living room. The pandanus weaving is tight and well-crafted.',
      date: '2026-03-05',
      verified: true,
      helpful: 6
    }
  ],
  'samoan-handcrafted-shell-necklace': [
    {
      id: 'rev-007',
      productId: 'samoan-handcrafted-shell-necklace',
      author: 'Jennifer L.',
      rating: 5,
      title: 'Unique and elegant',
      body: 'Wore this to a summer wedding and received so many compliments. The shell work is delicate and beautiful. Came with a nice gift box too.',
      date: '2026-02-20',
      verified: true,
      helpful: 4
    }
  ],
  'natural-coir-handwoven-coconut-palm-doormat': [
    {
      id: 'rev-008',
      productId: 'natural-coir-handwoven-coconut-palm-doormat',
      author: 'Robert C.',
      rating: 4,
      title: 'Great quality doormat',
      body: 'Durable and attractive. The coir material is excellent at scraping dirt off shoes. Only wish it came in more sizes.',
      date: '2026-03-01',
      verified: true,
      helpful: 3
    }
  ],
  'samoan-handcrafted-natural-shell-coasters': [
    {
      id: 'rev-009',
      productId: 'samoan-handcrafted-natural-shell-coasters',
      author: 'Karen W.',
      rating: 5,
      title: 'Beautiful conversation starter',
      body: 'These coasters are stunning! Each one has unique shell patterns. They protect my furniture well and look elegant on my coffee table.',
      date: '2026-02-25',
      verified: true,
      helpful: 5
    }
  ],
  'natural-coconut-soap': [
    {
      id: 'rev-010',
      productId: 'natural-coconut-soap',
      author: 'Maria S.',
      rating: 5,
      title: 'Gentle and natural',
      body: 'My skin has never felt better! This coconut soap is incredibly gentle yet effective. No harsh chemicals, just pure natural ingredients.',
      date: '2026-03-18',
      verified: true,
      helpful: 6
    },
    {
      id: 'rev-011',
      productId: 'natural-coconut-soap',
      author: 'David T.',
      rating: 4,
      title: 'Great daily soap',
      body: 'Switched from commercial soap and my skin feels much healthier. Lathers well and lasts a long time. Only wish it came in a larger bar size.',
      date: '2026-03-14',
      verified: true,
      helpful: 4
    }
  ],
  'tapa-cloth-wall-art': [
    {
      id: 'rev-012',
      productId: 'tapa-cloth-wall-art',
      author: 'Rachel P.',
      rating: 5,
      title: 'Stunning cultural masterpiece',
      body: 'This tapa cloth is a work of art. The hand-painted motifs tell beautiful stories of Pacific heritage. It is the centerpiece of my living room.',
      date: '2026-03-20',
      verified: true,
      helpful: 8
    },
    {
      id: 'rev-013',
      productId: 'tapa-cloth-wall-art',
      author: 'Michael B.',
      rating: 5,
      title: 'Museum quality',
      body: 'I collect Pacific art and this piece rivals museum-quality tapa cloth. The traditional bark cloth texture and hand-painted designs are extraordinary.',
      date: '2026-03-16',
      verified: true,
      helpful: 5
    },
    {
      id: 'rev-014',
      productId: 'tapa-cloth-wall-art',
      author: 'Sophie L.',
      rating: 4,
      title: 'Beautiful but needs careful handling',
      body: 'Absolutely gorgeous piece with rich cultural meaning. The natural bark cloth is delicate so handle with care. Came with display instructions.',
      date: '2026-03-09',
      verified: true,
      helpful: 3
    }
  ],
  'handwoven-papua-new-guinea-beach-bag': [
    {
      id: 'rev-015',
      productId: 'handwoven-papua-new-guinea-beach-bag',
      author: 'Anna K.',
      rating: 5,
      title: 'Perfect beach companion',
      body: 'This bag is incredibly spacious and sturdy. The PNG weaving technique creates a unique pattern that stands out at the beach.',
      date: '2026-03-22',
      verified: true,
      helpful: 7
    },
    {
      id: 'rev-016',
      productId: 'handwoven-papua-new-guinea-beach-bag',
      author: 'Tom H.',
      rating: 4,
      title: 'Great quality, unique design',
      body: 'Love supporting PNG artisans through this purchase. The bag is well-made and the natural fibers are strong. Fits everything I need.',
      date: '2026-03-11',
      verified: true,
      helpful: 4
    }
  ]
}

/**
 * Calculate aggregate rating for a product
 */
export function calculateAggregateRating(reviews: Review[]): AggregateRating {
  if (reviews.length === 0) {
    return {
      average: 0,
      count: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let total = 0

  for (const review of reviews) {
    distribution[review.rating as keyof typeof distribution]++
    total += review.rating
  }

  return {
    average: total / reviews.length,
    count: reviews.length,
    distribution
  }
}

/**
 * Get reviews and aggregate rating by product handle
 */
export function getProductReviews(handle: string): {
  reviews: Review[]
  aggregate: AggregateRating
} {
  const reviews = MOCK_REVIEWS[handle] || []
  const aggregate = calculateAggregateRating(reviews)
  return { reviews, aggregate }
}

/**
 * Generate complete Review Schema for a product by handle
 */
export function getProductReviewSchemaByHandle(handle: string, productName: string): ProductReviewSchema {
  const { reviews, aggregate } = getProductReviews(handle)
  return generateProductReviewSchema(productName, aggregate.average, aggregate.count, reviews)
}
