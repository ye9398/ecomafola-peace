import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import path from 'path'
import fs from 'fs'

// Load SSG routes from the generated file
function loadSSGRoutes() {
  const routesPath = path.resolve(__dirname, 'dist/admin-content/ssg-routes.json')
  if (fs.existsSync(routesPath)) {
    return JSON.parse(fs.readFileSync(routesPath, 'utf-8'))
  }
  return [
    { route: '/' },
    { route: '/products' },
    { route: '/our-story' },
    { route: '/impact' },
    { route: '/contact' },
    { route: '/faq' },
    { route: '/shipping-returns' },
    { route: '/privacy-policy' },
    { route: '/blog' },
  ]
}

/**
 * SSG Pre-render Plugin
 *
 * After Vite builds the SPA, this plugin:
 * 1. Reads the pre-generated SSG route data (ssg-routes.json)
 * 2. For each route, creates a directory-specific index.html
 *    with the correct <title>, <meta description>, OG/Twitter tags
 * 3. The base dist/index.html remains as the SPA fallback
 *
 * This approach doesn't require headless Chrome — it generates
 * static HTML that crawlers can read immediately. React hydrates
 * on the client side as normal.
 */
function ssgPreRender() {
  return {
    name: 'ssg-pre-render',
    apply: 'build' as const,
    closeBundle() {
      const routes = loadSSGRoutes()
      console.log(`\n🔧 SSG Pre-rendering ${routes.length} routes...\n`)

      // Read the original built index.html ONCE as template
      const distIndex = path.resolve(__dirname, 'dist/index.html')
      if (!fs.existsSync(distIndex)) {
        throw new Error(`dist/index.html not found — Vite build output missing`)
      }
      const baseHTML = fs.readFileSync(distIndex, 'utf-8')

      for (const routeData of routes) {
        const html = generateRouteHTML(routeData, baseHTML)
        const outputPath = getOutputPath(routeData.route)

        const dir = path.dirname(outputPath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }

        fs.writeFileSync(outputPath, html, 'utf-8')
        console.log(`  ✓ ${routeData.route} → ${outputPath.replace(path.resolve(__dirname, 'dist'), '')}`)
      }

      // Copy static assets
      copyStaticAssets()

      // Inject Product Schema into SPA fallback (the homepage)
      injectProductSchemaIntoFallback()

      console.log(`\n✅ SSG Pre-render complete for ${routes.length} routes\n`)
    }
  }
}

function generateRouteHTML(routeData: any, baseHTML: string): string {
  const { title, description, ogImage, isProductPage, product } = routeData
  const baseUrl = 'https://ecomafola.com'
  const canonical = routeData.route === '/' ? baseUrl : `${baseUrl}${routeData.route}`
  const imageUrl = ogImage?.startsWith('http') ? ogImage : `${baseUrl}${ogImage || '/images/banner-main.jpg'}`

  let html = baseHTML

  const seoBlock = `
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="${isProductPage ? 'product' : 'website'}" />
    <meta property="og:site_name" content="EcoMafola Peace" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@ecomafola" />
    <meta name="twitter:creator" content="@ecomafola" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />`

  let productSchema = ''
  if (isProductPage && product) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "description": product.description,
      "brand": { "@type": "Brand", "name": "EcoMafola Peace" },
      "offers": {
        "@type": "Offer",
        "url": canonical,
        "price": product.price,
        "priceCurrency": product.currencyCode || 'USD',
        "availability": product.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock"
      },
      "image": product.image ? [product.image] : [],
      "material": "Natural Materials",
      "origin": "Samoa",
      "craftsmanship": "Handcrafted"
    }
    productSchema = `\n    <script type="application/ld+json">${JSON.stringify(schema)}</script>`
  }

  // Replace title(s) - baseHTML has 1 title, replace it
  html = html.replace(/<title>.*?<\/title>/g, `<title>${title}</title>`)

  // Replace description meta tags
  html = html.replace(/<meta name="description" content="[^"]*" \/>/g, '')
  html = html.replace('</head>', `<meta name="description" content="${description}" />\n  </head>`)

  // Handle canonical - replace all with the correct one
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/g, '')
  html = html.replace('</head>', `<link rel="canonical" href="${canonical}" />\n  </head>`)

  // Remove existing OG/Twitter meta tags from the template to avoid duplicates.
  // Match both property="og:..." and property="twitter:..." formats
  html = html.replace(/[\s]*<meta property="(og|twitter):[^"]*" content="[^"]*" \/>/g, '')
  html = html.replace(/[\s]*<meta name="twitter:[^"]*" content="[^"]*" \/>/g, '')

  // Add OG/Twitter tags before </head>
  html = html.replace('</head>', `${seoBlock}${productSchema}\n  </head>`)

  return html
}

function getOutputPath(route: string): string {
  if (route === '/') {
    return path.resolve(__dirname, 'dist', 'index.html')
  }
  // /product/foo → dist/product/foo/index.html
  const cleanRoute = route.replace(/^\//, '').replace(/\/$/, '')
  return path.resolve(__dirname, 'dist', cleanRoute, 'index.html')
}

function copyStaticAssets() {
  const staticFiles = [
    'sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt',
    'rsl-license.txt', 'google-merchant-feed.txt', 'favicon.ico', 'logo.png'
  ]

  for (const file of staticFiles) {
    const src = path.resolve(__dirname, `public/${file}`)
    const dist = path.resolve(__dirname, `dist/${file}`)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dist)
      console.log(`  ✓ ${file} → /${file}`)
    }
  }

  // Copy images directory if it exists
  const srcImages = path.resolve(__dirname, 'public/images')
  const distImages = path.resolve(__dirname, 'dist/images')
  if (fs.existsSync(srcImages) && !fs.existsSync(distImages)) {
    fs.cpSync(srcImages, distImages, { recursive: true })
    console.log(`  ✓ images/ → /images/`)
  }

  // Copy vercel.json
  const srcVercel = path.resolve(__dirname, 'vercel.json')
  const distVercel = path.resolve(__dirname, 'dist/vercel.json')
  if (fs.existsSync(srcVercel)) {
    fs.copyFileSync(srcVercel, distVercel)
    console.log(`  ✓ vercel.json → /vercel.json`)
  }
}

function injectProductSchemaIntoFallback() {
  const distIndex = path.resolve(__dirname, 'dist/index.html')
  if (!fs.existsSync(distIndex)) return

  let html = fs.readFileSync(distIndex, 'utf-8')

  const productSchemasPath = path.resolve(__dirname, 'dist/admin-content/product-schemas.json')
  if (fs.existsSync(productSchemasPath)) {
    const productSchemas = JSON.parse(fs.readFileSync(productSchemasPath, 'utf-8'))
    const allSchemas = Object.values(productSchemas)

    // Only inject if not already present
    if (!html.includes('Pre-rendered Product Schema')) {
      const schemaScript = `
    <!-- Pre-rendered Product Schema.org structured data -->
    <script type="application/ld+json">
    ${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": allSchemas
    }, null, 2)}
    </script>`

      html = html.replace('</head>', `${schemaScript}\n  </head>`)
    }
  }

  fs.writeFileSync(distIndex, html, 'utf-8')
}

// @ts-ignore
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [
      react(),
      // SSG Pre-rendering (production only)
      ...(isProd ? [ssgPreRender()] : []),
      // 仅在生产环境启用图片优化
      ...(isProd ? [ViteImageOptimizer({
        png: { quality: 80, compressionLevel: 9 },
        jpeg: { quality: 80, progressive: true },
        webp: { quality: 80, lossless: false },
        avif: { quality: 70, compression: 'avif' },
        svg: {
          multipass: true,
          plugins: [{
            name: 'preset-default',
            params: { overrides: { cleanupNumericValues: false } },
          }],
        },
      })] : []),
    ],
    server: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
      fs: { allow: ['.'] }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./src/tests/setup.ts'],
    },
    build: {
      sourcemap: false,
      minify: 'esbuild',
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          }
        }
      }
    }
  }
})
