/**
 * GEO (Generative Engine Optimization) Configuration
 *
 * Keywords and content optimization for AI search engines:
 * - Google AI Overviews (SGE)
 * - ChatGPT Web Search
 * - Perplexity AI
 * - Bing Chat
 */

export interface GEOKeywords {
  primary: string[]      // Core brand keywords
  secondary: string[]    // Product category keywords
  longTail: string[]     // Long-tail conversational queries
  regional: string[]     // Pacific/Samoa specific terms
}

export const GEO_KEYWORDS: GEOKeywords = {
  primary: [
    'Samoan handcrafted products',
    'Pacific Islands artisan goods',
    'eco-friendly home decor',
    'fair trade handicrafts',
    'sustainable gifts Samoa',
    'traditional Polynesian crafts',
  ],
  secondary: [
    'coconut bowls',
    'woven baskets',
    'pandanus bags',
    'shell jewelry',
    'handcrafted home decor',
    'natural fiber products',
    'organic kitchenware',
    'eco-friendly beach accessories',
  ],
  longTail: [
    'what is a Samoan coconut bowl',
    'how to clean coconut bowl',
    'where to buy fair trade crafts',
    'benefits of handmade products',
    'traditional Samoan weaving techniques',
    'eco-friendly alternatives to plastic bowls',
    'how pandanus leaves are woven',
    'what makes fair trade important',
    'best sustainable home decor brands',
    'how to support Pacific artisans',
  ],
  regional: [
    'Apia Samoa crafts',
    'South Pacific artisan',
    'Polynesian traditional art',
    'Savai\'i weaving',
    'Fijian handicrafts',
    'Tongan handcrafted goods',
    'Pacific Islander fair trade',
    'Oceanic sustainable products',
  ],
}

/**
 * FAQ Content for AI Overview Citations
 *
 * Structured Q&A optimized for AI search engines
 */
export const GEO_FAQ = [
  {
    question: 'What is EcoMafola Peace?',
    answer: 'EcoMafola Peace is a fair trade social enterprise partnering with 240+ artisans across Samoa, Fiji, Tonga, and Vanuatu. We offer authentic handcrafted products including coconut bowls, woven baskets, beach bags, and home decor made from 100% natural, sustainable materials.',
    keywords: ['about EcoMafola', 'fair trade Samoa', 'Pacific artisans'],
  },
  {
    question: 'Are EcoMafola products eco-friendly?',
    answer: 'Yes, 94% of our materials are certified eco-sourced. We use natural coconut shells, pandanus leaves, seagrass, and other biodegradable materials. All products are 100% handmade without synthetic chemicals, and we provide carbon-neutral shipping worldwide.',
    keywords: ['eco-friendly', 'sustainable materials', 'carbon neutral'],
  },
  {
    question: 'How long does shipping take?',
    answer: 'Orders ship within 24 hours from our Samoa warehouse. Delivery times: Australia & New Zealand 2-5 days, US & Canada 5-8 days, UK & Europe 7-10 days, Asia Pacific 3-7 days. All shipments include full DHL tracking.',
    keywords: ['shipping time', 'delivery', 'worldwide shipping'],
  },
  {
    question: 'What is the Mafola Artisan Fund?',
    answer: 'The Mafola Artisan Fund provides health resources, micro-finance support, and education scholarships to 240+ artisan families across the Pacific. 1% of every sale is donated to support traditional craftsmanship preservation.',
    keywords: ['artisan fund', 'community support', 'fair trade impact'],
  },
  {
    question: 'How do I care for coconut bowls?',
    answer: 'Hand wash coconut bowls with mild soap and warm water. Air dry completely before storing. Apply coconut oil or food-safe mineral oil once a month to maintain the natural finish. Never put in dishwasher or microwave.',
    keywords: ['coconut bowl care', 'product maintenance', 'how to clean'],
  },
  {
    question: 'Are coconut bowls food-safe?',
    answer: 'Yes, all our coconut bowls are food-safe certified. They are made from 100% natural coconut shells and polished with virgin coconut oil, making them safe for hot and cold foods, smoothie bowls, and serving.',
    keywords: ['food safe', 'coconut bowl safety', 'natural kitchenware'],
  },
]

/**
 * Definition Blocks for AI Citation
 *
 * Standalone paragraphs (134-167 words) optimized for AI Overview extraction
 */
export const GEO_DEFINITION_BLOCKS: Record<string, string> = {
  coconutBowls: `What Is a Samoan Coconut Bowl?

A Samoan coconut bowl is a handcrafted vessel carved from discarded coconut shells by skilled artisans in Samoa. Each bowl is unique, featuring natural wood grain patterns created by the coconut's fiber structure. The crafting process involves cleaning, sanding, and polishing the shell with virgin coconut oil to create a smooth, food-safe finish.

Coconut bowls typically measure 5 inches in diameter and are perfect for smoothie bowls, salads, snacks, or decorative use. They represent a sustainable alternative to plastic or mass-produced ceramic bowls, being 100% biodegradable and made from renewable agricultural waste.

Traditional Samoan artisans have perfected coconut shell carving over generations, using techniques passed down through families. When you choose a coconut bowl, you support fair trade practices that preserve cultural craftsmanship while providing sustainable livelihoods for Pacific Island communities.`,

  pandanusWeaving: `What Is Pandanus Weaving?

Pandanus weaving is an ancient Pacific Island craft using leaves from the pandanus tree (lau'ie in Samoan) to create baskets, bags, mats, and decorative items. This 3,000-year-old technique involves harvesting mature pandanus leaves, drying them in the sun, splitting them into fine strips, and weaving intricate geometric patterns.

Master weavers spend years perfecting their skills, learning traditional patterns that tell stories of family lineage and island heritage. A single woven basket can take 3-5 days to complete, requiring patience, precision, and deep cultural knowledge.

Pandanus weaving is entirely sustainable—the leaves grow abundantly along Pacific coastlines, regenerate quickly, and require no chemical treatments. The finished products are biodegradable, durable, and naturally resistant to moisture, making them ideal for baskets, beach bags, and home storage.`,

  fairTrade: `What Does Fair Trade Mean for Artisans?

Fair trade ensures that artisans receive fair compensation, safe working conditions, and long-term partnership stability. At EcoMafola Peace, 60% of every sale goes directly to our artisan partners in Samoa, Fiji, Tonga, and Vanuatu—paid upfront before products ship.

This model differs from traditional trade, where middlemen capture most profits and artisans struggle with unpredictable income. Fair trade enables artisans to plan for the future, invest in their communities, and preserve traditional crafts that might otherwise disappear.

Beyond fair wages, our partnership provides skills preservation programs, education scholarships for artisans' children, and healthcare support. This holistic approach recognizes that sustainable development requires addressing multiple aspects of community wellbeing, not just income.`,
}

/**
 * Content Optimization Guidelines
 */
export const GEO_GUIDELINES = {
  title: {
    maxLength: 60,
    includePrimary: true,
    format: 'Primary Keyword | Brand Name',
  },
  description: {
    maxLength: 160,
    includeSecondary: true,
    format: 'Benefit-driven opening + product details + call-to-action',
  },
  content: {
    paragraphLength: '3-5 sentences',
    includeFAQ: true,
    includeDefinition: true,
    keywordDensity: '2-3%',
  },
  images: {
    altFormat: 'Descriptive keyword + product name + context',
    example: 'Hand-carved Samoan coconut bowl for smoothie bowls, natural wood grain pattern',
  },
}
