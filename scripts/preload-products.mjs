/**
 * Pre-render Product Schema Script
 *
 * Fetches product data from Shopify and generates static JSON files
 * for SEO structured data that's visible to AI crawlers.
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

// Shopify configuration
const STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

// Check if we should use mock data
const USE_MOCK_DATA = !STOREFRONT_TOKEN || STOREFRONT_TOKEN === 'your-actual-token-here';

if (USE_MOCK_DATA) {
  console.log('⚠️  No valid Shopify token found. Using mock product data for development.');
  console.log('   Set VITE_SHOPIFY_STOREFRONT_TOKEN to fetch real data.\n');
}

// Mock product data for development
const MOCK_PRODUCTS = {
  'samoan-handcrafted-coconut-bowl': {
    title: 'Samoan Handcrafted Coconut Bowl',
    handle: 'samoan-handcrafted-coconut-bowl',
    description: 'Hand-carved from fallen coconut shells, polished with virgin coconut oil. Each bowl is unique with natural patterns.',
    priceRange: { minVariantPrice: { amount: '29.99', currencyCode: 'USD' } },
    images: { edges: [{ node: { url: 'https://ecomafola.com/images/coconut-bowl.jpg', altText: 'Coconut Bowl' } }] },
    variants: { edges: [{ node: { availableForSale: true, price: { amount: '29.99', currencyCode: 'USD' } } }] }
  },
  'samoan-handwoven-grass-tote-bag': {
    title: 'Samoan Handwoven Grass Tote Bag',
    handle: 'samoan-handwoven-grass-tote-bag',
    description: 'Traditional pandanus weaving, eco-friendly shopping bag. Made by skilled artisans in Samoa.',
    priceRange: { minVariantPrice: { amount: '34.99', currencyCode: 'USD' } },
    images: { edges: [{ node: { url: 'https://ecomafola.com/images/grass-tote.jpg', altText: 'Grass Tote Bag' } }] },
    variants: { edges: [{ node: { availableForSale: true, price: { amount: '34.99', currencyCode: 'USD' } } }] }
  },
  'samoan-handcrafted-shell-necklace': {
    title: 'Samoan Handcrafted Shell Necklace',
    handle: 'samoan-handcrafted-shell-necklace',
    description: 'Naturally collected shells, traditional Pacific jewelry. Each piece tells a story of the ocean.',
    priceRange: { minVariantPrice: { amount: '24.99', currencyCode: 'USD' } },
    images: { edges: [{ node: { url: 'https://ecomafola.com/images/shell-necklace.jpg', altText: 'Shell Necklace' } }] },
    variants: { edges: [{ node: { availableForSale: true, price: { amount: '24.99', currencyCode: 'USD' } } }] }
  },
  'samoan-woven-basket': {
    title: 'Samoan Woven Basket',
    handle: 'samoan-woven-basket',
    description: 'Multi-purpose storage, traditional Samoan weaving. Perfect for home organization or as a decorative piece.',
    priceRange: { minVariantPrice: { amount: '39.99', currencyCode: 'USD' } },
    images: { edges: [{ node: { url: 'https://ecomafola.com/images/woven-basket.jpg', altText: 'Woven Basket' } }] },
    variants: { edges: [{ node: { availableForSale: true, price: { amount: '39.99', currencyCode: 'USD' } } }] }
  },
  'natural-coconut-soap': {
    title: 'Natural Coconut Soap',
    handle: 'natural-coconut-soap',
    description: 'Made from pure coconut oil, gentle on skin. Traditional recipe passed down through generations.',
    priceRange: { minVariantPrice: { amount: '12.99', currencyCode: 'USD' } },
    images: { edges: [{ node: { url: 'https://ecomafola.com/images/coconut-soap.jpg', altText: 'Coconut Soap' } }] },
    variants: { edges: [{ node: { availableForSale: true, price: { amount: '12.99', currencyCode: 'USD' } } }] }
  },
  'tapa-cloth-wall-art': {
    title: 'Tapa Cloth Wall Art',
    handle: 'tapa-cloth-wall-art',
    description: 'Traditional Pacific bark cloth, hand-painted with cultural motifs. Authentic island art for your home.',
    priceRange: { minVariantPrice: { amount: '89.99', currencyCode: 'USD' } },
    images: { edges: [{ node: { url: 'https://ecomafola.com/images/tapa-cloth.jpg', altText: 'Tapa Cloth' } }] },
    variants: { edges: [{ node: { availableForSale: true, price: { amount: '89.99', currencyCode: 'USD' } } }] }
  },
  'samoan-handcrafted-natural-shell-coasters': {
    title: 'Samoan Handcrafted Natural Shell Coasters',
    handle: 'samoan-handcrafted-natural-shell-coasters',
    description: 'Set of 6 decorative shell coasters. Each coaster showcases natural ocean beauty.',
    priceRange: { minVariantPrice: { amount: '27.99', currencyCode: 'USD' } },
    images: { edges: [{ node: { url: 'https://ecomafola.com/images/shell-coasters.jpg', altText: 'Shell Coasters' } }] },
    variants: { edges: [{ node: { availableForSale: true, price: { amount: '27.99', currencyCode: 'USD' } } }] }
  },
  'handwoven-papua-new-guinea-beach-bag': {
    title: 'Handwoven Papua New Guinea Beach Bag',
    handle: 'handwoven-papua-new-guinea-beach-bag',
    description: 'PNG artisan made, sustainable beach accessory. Spacious and durable for all your adventures.',
    priceRange: { minVariantPrice: { amount: '34.99', currencyCode: 'USD' } },
    images: { edges: [{ node: { url: 'https://ecomafola.com/images/beach-bag.jpg', altText: 'Beach Bag' } }] },
    variants: { edges: [{ node: { availableForSale: true, price: { amount: '34.99', currencyCode: 'USD' } } }] }
  },
  'natural-coir-handwoven-coconut-palm-doormat': {
    title: 'Natural Coir Handwoven Coconut Palm Doormat',
    handle: 'natural-coir-handwoven-coconut-palm-doormat',
    description: 'Natural coconut fiber, durable entrance mat. Welcome guests with island style.',
    priceRange: { minVariantPrice: { amount: '34.99', currencyCode: 'USD' } },
    images: { edges: [{ node: { url: 'https://ecomafola.com/images/doormat.jpg', altText: 'Coir Doormat' } }] },
    variants: { edges: [{ node: { availableForSale: true, price: { amount: '34.99', currencyCode: 'USD' } } }] }
  }
};

// Product handles to pre-render
const PRODUCT_HANDLES = [
  'samoan-handcrafted-coconut-bowl',
  'samoan-handwoven-grass-tote-bag',
  'samoan-handcrafted-shell-necklace',
  'samoan-woven-basket',
  'natural-coconut-soap',
  'tapa-cloth-wall-art',
  'samoan-handcrafted-natural-shell-coasters',
  'handwoven-papua-new-guinea-beach-bag',
  'natural-coir-handwoven-coconut-palm-doormat',
];

// Shopify GraphQL query
const PRODUCT_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      productType
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            sku
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

async function fetchProduct(handle) {
  if (USE_MOCK_DATA) {
    return MOCK_PRODUCTS[handle] || null;
  }

  const response = await fetch(`https://${STORE_DOMAIN}/api/2026-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: PRODUCT_QUERY,
      variables: { handle },
    }),
  });

  const data = await response.json();
  return data.data?.product;
}

function generateProductSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description?.replace(/<[^>]*>/g, '').substring(0, 500),
    "brand": {
      "@type": "Brand",
      "name": "EcoMafola Peace"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://ecomafola.com/product/${product.handle}`,
      "price": product.priceRange?.minVariantPrice?.amount,
      "priceCurrency": product.priceRange?.minVariantPrice?.currencyCode || 'USD',
      "availability": product.variants?.edges?.[0]?.node?.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "EcoMafola Peace"
      }
    },
    "image": product.images?.edges?.map(img => img.node.url) || [],
    "material": "Natural Materials",
    "origin": "Samoa",
    "craftsmanship": "Handcrafted"
  };
}

async function main() {
  const distDir = path.resolve(__dirname, '../dist/admin-content');

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const productSchemas = {};

  if (USE_MOCK_DATA) {
    console.log('Generating mock product schemas...\n');
  } else {
    console.log('Fetching product data from Shopify...\n');
  }

  for (const handle of PRODUCT_HANDLES) {
    try {
      console.log(`  Processing: ${handle}`);
      const product = USE_MOCK_DATA ? MOCK_PRODUCTS[handle] : await fetchProduct(handle);

      if (product) {
        const schema = generateProductSchema(product);
        productSchemas[handle] = schema;
        console.log(`    ✓ ${product.title}`);
      } else {
        console.log(`    ✗ Not found`);
      }
    } catch (error) {
      console.error(`    ✗ Error: ${error.message}`);
    }
  }

  // Write combined schema file
  const outputPath = path.join(distDir, 'product-schemas.json');
  fs.writeFileSync(outputPath, JSON.stringify(productSchemas, null, 2));
  console.log(`\n✅ Written ${Object.keys(productSchemas).length} product schemas to ${outputPath}`);

  // Also copy to public for development
  const publicPath = path.resolve(__dirname, '../public/admin-content/product-schemas.json');
  if (fs.existsSync(path.dirname(publicPath))) {
    fs.writeFileSync(publicPath, JSON.stringify(productSchemas, null, 2));
    console.log(`📄 Copied to ${publicPath}`);
  }
}

main().catch(console.error);
