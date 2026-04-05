import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function BrandStory() {
  return (
    <section className="py-20 bg-[#F0E8DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image with Hand-drawn Frame */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden shadow-xl rounded-[2.5rem]">
              <img
                src="/images/brand-story-custom.jpg"
                alt="Children in the South Pacific"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card with Rough Border */}
            <div className="absolute -bottom-6 -right-6 bg-tropical-green text-white p-5 shadow-xl max-w-[200px]">
              <p className="font-serif text-3xl font-bold mb-1">5+</p>
              <p className="font-sans text-sm text-white/90 leading-snug">Village cooperatives in Samoa</p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="font-sans text-xs font-medium text-ocean-blue tracking-[0.2em] uppercase mb-4 border-b-2 border-tropical-green inline-block pb-1">
              Our Story
            </p>
            <h2 className="section-title mb-6">
              Partnership Rooted in the Pacific
            </h2>
            <div className="space-y-4 mb-8">
              <p className="section-subtitle text-gray-700 leading-relaxed">
                EcoMafola Peace was born from a deep respect for the artisans of Samoa — skilled craftspeople whose traditions have been passed down through generations. We don't just sell products; we build lasting partnerships.
              </p>
              <p className="section-subtitle text-gray-700 leading-relaxed">
                Working directly with women-led village cooperatives, we ensure that every purchase supports sustainable livelihoods, preserves cultural heritage, and helps fund children's education in rural communities.
              </p>
              <p className="section-subtitle text-gray-700 leading-relaxed">
                <span className="font-semibold text-ocean-blue">1% of every sale</span> goes directly back to community programs — because true sustainability means caring for both the planet and the people who call it home.
              </p>
            </div>

            {/* Values List with Shell Pattern */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {['Eco-Friendly Materials', 'Fair Trade Practices', 'Women-Led Cooperatives', 'Children Education Fund'].map((val) => (
                <div key={val} className="flex items-center gap-2.5 bg-white px-3 py-2 shadow-sm border border-ocean-blue/10">
                  <div className="w-2 h-2 rounded-full bg-tropical-green flex-shrink-0" />
                  <span className="font-sans text-sm text-gray-700">{val}</span>
                </div>
              ))}
            </div>

            <Link to="/our-story" className="btn-primary inline-flex items-center gap-2 group shadow-md">
              Read Our Story
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
