import { Helmet } from 'react-helmet-async'
import HeroBanner from '../components/HeroBanner'
import Features from '../components/Features'
import Products from '../components/Products'
import BrandStory from '../components/BrandStory'
import Impact from '../components/Impact'
import Newsletter from '../components/Newsletter'

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
        <link rel="canonical" href="https://ecomafola.com" />
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
