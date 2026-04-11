import { Helmet } from 'react-helmet-async'
import HeroBanner from '../components/HeroBanner'
import Features from '../components/Features'
import Products from '../components/Products'
import BrandStory from '../components/BrandStory'
import Impact from '../components/Impact'
import Newsletter from '../components/Newsletter'
import Contact from '../components/Contact'

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>EcoMafola Peace — Handcrafted Samoan Treasures | South Pacific Artisan Goods</title>
        <meta name="description" content="Discover authentic handcrafted treasures from Samoa. Coconut bowls, woven bags, shell jewelry, and more — made with love by South Pacific artisans. Free shipping over $50." />
        <meta property="og:title" content="EcoMafola Peace — Where Ocean Meets Craft" />
        <meta property="og:description" content="Handcrafted treasures from Samoa, made with love by local artisans. Every piece tells a story of the South Pacific." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ecomafola.com" />
        <meta property="og:image" content="https://sc02.alicdn.com/kf/Aa05c428c426e40afb2f4a3d8c1d247b0y.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EcoMafola Peace — Where Ocean Meets Craft" />
        <meta name="twitter:description" content="Handcrafted treasures from Samoa, made with love by local artisans. Every piece tells a story of the South Pacific." />
        <meta name="twitter:image" content="https://sc02.alicdn.com/kf/Aa05c428c426e40afb2f4a3d8c1d247b0y.png" />
        <link rel="canonical" href="https://ecomafola.com" />

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "EcoMafola Peace",
            "url": "https://ecomafola.com",
            "logo": "https://ecomafola.com/logo.png",
            "description": "Handcrafted Pacific treasures from Samoa supporting traditional artisans",
            "foundingDate": "2019",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Apia",
              "addressCountry": "Samoa"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "hello@ecomafola.com",
              "contactType": "customer service"
            },
            "sameAs": [
              "https://twitter.com/ecomafola",
              "https://facebook.com/ecomafola",
              "https://instagram.com/ecomafola"
            ]
          })}
        </script>

        {/* WebSite Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "EcoMafola Peace",
            "url": "https://ecomafola.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://ecomafola.com/products/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* ImageObject Schema for brand images */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "url": "https://ecomafola.com/logo.png",
            "width": "400",
            "height": "400",
            "caption": "EcoMafola Peace Logo",
            "representativeOfPage": "True"
          })}
        </script>
      </Helmet>
      <HeroBanner />
      <Features />
      <Products />
      <BrandStory />
      <Impact />
      <Newsletter />
    </>
  )
}
