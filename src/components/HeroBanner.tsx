import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ocean-blue/5">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/banner-main.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-blue/40 via-transparent to-ocean-blue/40" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
        
        {/* Main Title - Where Ocean Meets Craft */}
        <h1 className="font-serif text-5xl md:text-7xl font-semibold leading-tight mb-6 text-ocean-blue drop-shadow-md animate-fade-in-up">
          Where Ocean
          <br />
          <span className="italic text-tropical-green">Meets Craft</span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-lg md:text-xl text-sand-beige mb-10 max-w-2xl mx-auto leading-relaxed font-medium animate-fade-in-up delay-100">
          Handcrafted treasures from Samoa, made with love by local artisans.
          Every piece tells a story of the South Pacific.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up delay-200">
          <Link to="/products" className="bg-tropical-green text-white px-10 py-5 rounded-full font-sans font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-tropical-green/30 hover:bg-white hover:text-ocean-blue transition-all duration-500 hover:-translate-y-2 active:scale-95 group">
            Shop the Collection
            <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
          <Link to="/our-story" className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-full font-sans font-black text-sm uppercase tracking-widest hover:bg-white hover:text-ocean-blue transition-all duration-500 hover:-translate-y-2 shadow-2xl">
            Our Heritage
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto pt-8 border-t border-white/10 animate-fade-in delay-300">
          <div className="text-center">
             <p className="text-white font-serif text-xl font-bold">100%</p>
             <p className="text-white/40 font-sans text-[10px] uppercase font-bold tracking-tighter">Artisan Made</p>
          </div>
          <div className="text-center border-x border-white/10">
             <p className="text-white font-serif text-xl font-bold">Eco</p>
             <p className="text-white/40 font-sans text-[10px] uppercase font-bold tracking-tighter">Sustainable</p>
          </div>
          <div className="text-center">
             <p className="text-white font-serif text-xl font-bold">Small</p>
             <p className="text-white/40 font-sans text-[10px] uppercase font-bold tracking-tighter">Batch Only</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40 animate-fade-in delay-500">
        <span className="font-sans text-[10px] font-black tracking-[0.4em] uppercase">Discovery</span>
        <div className="w-px h-16 bg-gradient-to-b from-tropical-green to-transparent relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll-line" />
        </div>
      </div>
    </section>
  )
}
