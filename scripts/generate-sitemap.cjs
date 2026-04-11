#!/usr/bin/env node

/**
 * Dynamic Sitemap Generator for EcoMafola Peace
 *
 * Fetches products from Shopify and generates sitemap.xml with:
 * - Static pages (home, products, brand pages)
 * - Dynamic product pages
 * - Collection pages
 */

const fs = require('fs');
const path = require('path');

const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'ecomafola-peace.myshopify.com';
const SHOP_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

const STATIC_PAGES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/products', changefreq: 'daily', priority: '0.9' },
  { loc: '/products/coconut-bowls', changefreq: 'weekly', priority: '0.8' },
  { loc: '/products/woven-baskets', changefreq: 'weekly', priority: '0.8' },
  { loc: '/products/beach-bags', changefreq: 'weekly', priority: '0.8' },
  { loc: '/products/home-decor', changefreq: 'weekly', priority: '0.8' },
  { loc: '/our-story', changefreq: 'monthly', priority: '0.7' },
  { loc: '/impact', changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
  { loc: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/track', changefreq: 'monthly', priority: '0.5' },
];

const COLLECTIONS = [
  { handle: 'coconut-bowls', priority: '0.8' },
  { handle: 'woven-baskets', priority: '0.8' },
  { handle: 'beach-bags', priority: '0.8' },
  { handle: 'home-decor', priority: '0.8' },
  { handle: 'shell-jewelry', priority: '0.8' },
  { handle: 'wood-carvings', priority: '0.8' },
  { handle: 'textiles', priority: '0.7' },
  { handle: 'natural-soaps', priority: '0.7' },
  { handle: 'incense-holders', priority: '0.7' },
  { handle: 'coasters', priority: '0.7' },
];

async function fetchProducts() {
  if (!SHOP_TOKEN) {
    console.warn('⚠️  VITE_SHOPIFY_STOREFRONT_TOKEN not set, skipping product fetch');
    return [];
  }

  const query = `
    query GetProducts {
      products(first: 100) {
        edges {
          node {
            handle
            updatedAt
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOP_DOMAIN}/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOP_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GraphQL errors:', errors);
      return [];
    }

    return data?.products?.edges?.map(edge => ({
      handle: edge.node.handle,
      updatedAt: edge.node.updatedAt,
    })) || [];
  } catch (error) {
    console.error('Failed to fetch products:', error.message);
    return [];
  }
}

async function fetchCollections() {
  if (!SHOP_TOKEN) {
    return COLLECTIONS;
  }

  const query = `
    query GetCollections {
      collections(first: 50) {
        edges {
          node {
            handle
            updatedAt
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOP_DOMAIN}/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOP_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    return data?.collections?.edges?.map(edge => ({
      handle: edge.node.handle,
      updatedAt: edge.node.updatedAt,
    })) || COLLECTIONS;
  } catch (error) {
    console.error('Failed to fetch collections:', error.message);
    return COLLECTIONS;
  }
}

function generateSitemapXml(products, collections) {
  const baseUrl = 'https://ecomafola.com';
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Static pages
  STATIC_PAGES.forEach(page => {
    xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}T00:00:00+00:00</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Product pages
  products.forEach(product => {
    const lastmod = product.updatedAt
      ? new Date(product.updatedAt).toISOString()
      : `${today}T00:00:00+00:00`;

    xml += `  <url>
    <loc>${baseUrl}/product/${product.handle}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });

  // Collection pages
  collections.forEach(collection => {
    const lastmod = collection.updatedAt
      ? new Date(collection.updatedAt).toISOString()
      : `${today}T00:00:00+00:00`;

    xml += `  <url>
    <loc>${baseUrl}/products/category/${collection.handle}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  xml += `</urlset>\n`;
  return xml;
}

async function main() {
  console.log('🚀 Generating sitemap for EcoMafola Peace...\n');

  const [products, collections] = await Promise.all([
    fetchProducts(),
    fetchCollections(),
  ]);

  console.log(`✅ Found ${products.length} products`);
  console.log(`✅ Found ${collections.length} collections`);

  const xml = generateSitemapXml(products, collections);

  // Write to both public and dist directories
  const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  const distPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');

  fs.writeFileSync(publicPath, xml, 'utf8');
  console.log(`\n✅ Written to ${publicPath}`);

  if (fs.existsSync(path.dirname(distPath))) {
    fs.writeFileSync(distPath, xml, 'utf8');
    console.log(`✅ Written to ${distPath}`);
  }

  // Count total URLs
  const urlCount = (xml.match(/<url>/g) || []).length;
  console.log(`\n📊 Total URLs in sitemap: ${urlCount}`);
  console.log('\n✨ Sitemap generation complete!\n');
}

main().catch(console.error);
