import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-sand-beige">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/banner-main.jpg')`,
        }}
      />

      {/* Content Container - Clean Solid Background */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto py-16 px-8">
        
        {/* Main Title - Where Ocean Meets Craft */}
        <h1 className="font-serif text-5xl md:text-7xl font-semibold leading-tight mb-6 text-ocean-blue drop-shadow-md">
          Where Ocean
          <br />
          <span className="italic text-tropical-green">Meets Craft</span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-lg md:text-xl text-sand-beige mb-10 max-w-2xl mx-auto leading-relaxed">
          Handcrafted treasures from Samoa, made with love by local artisans.
          Every piece tells a story of the South Pacific.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/products" className="btn-green flex items-center gap-2 group shadow-md">
            Shop Now
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link to="/our-story" className="btn-outline flex items-center gap-2 shadow-md">
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll Indicator - Hand-drawn Style */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ocean-blue/60">
        <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-ocean-blue/60 to-transparent animate-bounce" />
      </div>
    </section>
  )
}
