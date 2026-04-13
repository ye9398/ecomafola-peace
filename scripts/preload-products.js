/**
 * Pre-render Product Schema Script
 * 
 * Fetches product data from Shopify and generates static JSON files
 * for SEO structured data that's visible to AI crawlers.
 */

const fs = require('fs');
const path = require('path');

// Shopify configuration
const STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

if (!STOREFRONT_TOKEN) {
  console.error('Error: VITE_SHOPIFY_STOREFRONT_TOKEN is required');
  process.exit(1);
}

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

  console.log('Fetching product data from Shopify...');
  
  for (const handle of PRODUCT_HANDLES) {
    try {
      console.log(`  Fetching: ${handle}`);
      const product = await fetchProduct(handle);
      
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
  console.log(`\nWritten ${Object.keys(productSchemas).length} product schemas to ${outputPath}`);
}

main().catch(console.error);
