/**
 * SSG Route Data Generator
 *
 * Generates static route data for pre-rendering during build.
 * This script runs before vite build and outputs:
 *   - dist/admin-content/ssg-routes.json (all routes with SEO data)
 *   - Product pages with individual SEO metadata
 *   - Blog posts with individual SEO metadata (if available)
 *
 * The vite-plugin-prerender reads this file to know which routes
 * to pre-render and what meta tags to inject.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const trimmedKey = key?.trim();
    if (trimmedKey && !trimmedKey.startsWith('#') && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (value && !process.env[trimmedKey]) {
        process.env[trimmedKey] = value;
      }
    }
  });
}

const BASE_URL = 'https://ecomafola.com';

/**
 * Static pages with their SEO metadata.
 * These are always pre-rendered regardless of external data.
 */
const STATIC_PAGES = [
  {
    route: '/',
    title: 'EcoMafola Peace | Handcrafted Treasures from Samoa',
    description: 'Authentic handcrafted goods from Samoa, made in partnership with local artisan cooperatives. Eco-friendly, sustainable, ocean-inspired.',
    ogImage: '/images/banner-main.jpg',
  },
  {
    route: '/products',
    title: 'All Products | Samoan Handcrafted Goods | EcoMafola Peace',
    description: 'Browse our complete collection of Samoan handcrafted products. Coconut bowls, woven baskets, beach bags, home decor & jewelry.',
    ogImage: '/images/banner-main.jpg',
  },
  {
    route: '/our-story',
    title: 'Our Story | EcoMafola Peace - Supporting Samoan Artisans',
    description: 'Learn about our mission to preserve traditional Samoan craftsmanship while supporting 240+ artisan families across the Pacific.',
    ogImage: '/images/banner-main.jpg',
  },
  {
    route: '/impact',
    title: 'Our Impact | Environmental & Social Responsibility | EcoMafola Peace',
    description: 'See how EcoMafola Peace is making a difference through fair trade, environmental sustainability, and community support.',
    ogImage: '/images/banner-main.jpg',
  },
  {
    route: '/contact',
    title: 'Contact Us | EcoMafola Peace',
    description: 'Get in touch with EcoMafola Peace. Questions about products, shipping, or custom orders? We are here to help.',
    ogImage: '/images/banner-main.jpg',
  },
  {
    route: '/faq',
    title: 'Frequently Asked Questions | EcoMafola Peace',
    description: 'Find answers to common questions about EcoMafola Peace products, shipping, returns, and our Samoan artisan partnership.',
    ogImage: '/images/banner-main.jpg',
  },
  {
    route: '/shipping-returns',
    title: 'Shipping & Returns | EcoMafola Peace',
    description: 'Learn about EcoMafola Peace shipping zones, delivery times, return policy, and our craftsmanship warranty for handcrafted products.',
    ogImage: '/images/banner-main.jpg',
  },
  {
    route: '/privacy-policy',
    title: 'Privacy Policy | EcoMafola Peace',
    description: 'Read EcoMafola Peace privacy policy. Learn how we protect your personal information and respect your privacy.',
    ogImage: '/images/banner-main.jpg',
  },
  {
    route: '/blog',
    title: 'The Pacific Soul Blog | Samoan Craftsmanship & Culture | EcoMafola Peace',
    description: 'Discover stories behind South Pacific craftsmanship, sustainable living tips, and island heritage from EcoMafola Peace.',
    ogImage: '/images/banner-main.jpg',
  },
];

/**
 * Mock product data matching preload-products.mjs
 */
const MOCK_PRODUCTS = {
  'samoan-handcrafted-coconut-bowl': {
    title: 'Samoan Handcrafted Coconut Bowl',
    handle: 'samoan-handcrafted-coconut-bowl',
    description: 'Hand-carved from fallen coconut shells, polished with virgin coconut oil. Each bowl is unique with natural patterns.',
    price: '29.99',
    currencyCode: 'USD',
    image: 'https://ecomafola.com/images/coconut-bowl.jpg',
    availableForSale: true,
  },
  'samoan-handwoven-grass-tote-bag': {
    title: 'Samoan Handwoven Grass Tote Bag',
    handle: 'samoan-handwoven-grass-tote-bag',
    description: 'Traditional pandanus weaving, eco-friendly shopping bag. Made by skilled artisans in Samoa.',
    price: '34.99',
    currencyCode: 'USD',
    image: 'https://ecomafola.com/images/grass-tote.jpg',
    availableForSale: true,
  },
  'samoan-handcrafted-shell-necklace': {
    title: 'Samoan Handcrafted Shell Necklace',
    handle: 'samoan-handcrafted-shell-necklace',
    description: 'Naturally collected shells, traditional Pacific jewelry. Each piece tells a story of the ocean.',
    price: '24.99',
    currencyCode: 'USD',
    image: 'https://ecomafola.com/images/shell-necklace.jpg',
    availableForSale: true,
  },
  'samoan-woven-basket': {
    title: 'Samoan Woven Basket',
    handle: 'samoan-woven-basket',
    description: 'Multi-purpose storage, traditional Samoan weaving. Perfect for home organization or as a decorative piece.',
    price: '39.99',
    currencyCode: 'USD',
    image: 'https://ecomafola.com/images/woven-basket.jpg',
    availableForSale: true,
  },
  'natural-coconut-soap': {
    title: 'Natural Coconut Soap',
    handle: 'natural-coconut-soap',
    description: 'Made from pure coconut oil, gentle on skin. Traditional recipe passed down through generations.',
    price: '12.99',
    currencyCode: 'USD',
    image: 'https://ecomafola.com/images/coconut-soap.jpg',
    availableForSale: true,
  },
  'tapa-cloth-wall-art': {
    title: 'Tapa Cloth Wall Art',
    handle: 'tapa-cloth-wall-art',
    description: 'Traditional Pacific bark cloth, hand-painted with cultural motifs. Authentic island art for your home.',
    price: '89.99',
    currencyCode: 'USD',
    image: 'https://ecomafola.com/images/tapa-cloth.jpg',
    availableForSale: true,
  },
  'samoan-handcrafted-natural-shell-coasters': {
    title: 'Samoan Handcrafted Natural Shell Coasters',
    handle: 'samoan-handcrafted-natural-shell-coasters',
    description: 'Set of 6 decorative shell coasters. Each coaster showcases natural ocean beauty.',
    price: '27.99',
    currencyCode: 'USD',
    image: 'https://ecomafola.com/images/shell-coasters.jpg',
    availableForSale: true,
  },
  'handwoven-papua-new-guinea-beach-bag': {
    title: 'Handwoven Papua New Guinea Beach Bag',
    handle: 'handwoven-papua-new-guinea-beach-bag',
    description: 'PNG artisan made, sustainable beach accessory. Spacious and durable for all your adventures.',
    price: '34.99',
    currencyCode: 'USD',
    image: 'https://ecomafola.com/images/beach-bag.jpg',
    availableForSale: true,
  },
  'natural-coir-handwoven-coconut-palm-doormat': {
    title: 'Natural Coir Handwoven Coconut Palm Doormat',
    handle: 'natural-coir-handwoven-coconut-palm-doormat',
    description: 'Natural coconut fiber, durable entrance mat. Welcome guests with island style.',
    price: '34.99',
    currencyCode: 'USD',
    image: 'https://ecomafola.com/images/doormat.jpg',
    availableForSale: true,
  },
};

const PRODUCT_HANDLES = Object.keys(MOCK_PRODUCTS);

/**
 * Generate product page data for SSG.
 */
function generateProductPage(handle, product) {
  const cleanDescription = product.description.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    route: `/product/${handle}`,
    title: `${product.title} | EcoMafola Peace`,
    description: cleanDescription,
    ogImage: product.image,
    isProductPage: true,
    product: {
      ...product,
      description: cleanDescription,
    },
  };
}

/**
 * Try to fetch blog posts from Supabase for SSG.
 * Falls back to empty array (blog list page still renders).
 */
async function fetchBlogPosts() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('  ⚠️  No Supabase credentials, skipping blog post SSG data');
    return [];
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=id,title,excerpt,slug,image_url&order=created_at.desc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      console.log(`  ⚠️  Blog fetch failed (${response.status}), skipping blog post SSG data`);
      return [];
    }

    const posts = await response.json();
    return posts.map(post => ({
      route: `/blog/${post.slug || post.id}`,
      title: `${post.title} | The Pacific Soul Blog | EcoMafola Peace`,
      description: (post.excerpt || '').substring(0, 160),
      ogImage: post.image_url || '/images/banner-main.jpg',
      isBlogPost: true,
      blogPost: {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        image: post.image_url,
      },
    }));
  } catch (error) {
    console.log(`  ⚠️  Blog fetch error: ${error.message}, skipping blog post SSG data`);
    return [];
  }
}

async function main() {
  console.log('\n🔧 Generating SSG route data...\n');

  const distDir = path.resolve(__dirname, '../dist/admin-content');

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Start with static pages
  const routes = [...STATIC_PAGES];
  console.log(`  ✓ ${STATIC_PAGES.length} static pages`);

  // Add product pages
  const productPages = PRODUCT_HANDLES
    .filter(handle => MOCK_PRODUCTS[handle])
    .map(handle => generateProductPage(handle, MOCK_PRODUCTS[handle]));

  routes.push(...productPages);
  console.log(`  ✓ ${productPages.length} product pages`);

  // Try to fetch blog posts
  const blogPages = await fetchBlogPosts();
  if (blogPages.length > 0) {
    routes.push(...blogPages);
    console.log(`  ✓ ${blogPages.length} blog post pages`);
  } else {
    console.log(`  - 0 blog post pages (dynamic rendering via SPA fallback)`);
  }

  // Write SSG routes
  const outputPath = path.join(distDir, 'ssg-routes.json');
  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log(`\n✅ Written ${routes.length} routes to ${outputPath}`);

  // Also write to public for development
  const publicPath = path.resolve(__dirname, '../public/admin-content/ssg-routes.json');
  const publicDir = path.dirname(publicPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(publicPath, JSON.stringify(routes, null, 2));
  console.log(`📄 Copied to ${publicPath}`);

  return routes;
}

main().catch(console.error);

// Export for use in vite.config.ts
export { STATIC_PAGES, MOCK_PRODUCTS, PRODUCT_HANDLES };
