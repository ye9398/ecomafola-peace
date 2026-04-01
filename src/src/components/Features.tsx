const features = [
  {
    title: '100% Eco-Friendly',
    description: 'Every product is crafted from sustainably sourced, natural materials — no plastics, no waste.',
    image: '/images/feature-eco-friendly.webp',
  },
  {
    title: 'Artisan Partnership',
    description: 'Made in partnership with Samoan artisan cooperatives that value fair pay and creative freedom.',
    image: '/images/feature-artisan.webp',
  },
  {
    title: 'Ocean-Inspired',
    description: 'Designs drawn from the Pacific\'s colors, textures, and rhythms — from shell to wood.',
    image: '/images/feature-ocean.webp',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-br from-tropical-green to-ocean-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="font-sans text-xs font-medium text-ocean-blue tracking-[0.2em] uppercase mb-3 border-b-2 border-tropical-green inline-block pb-1">
            Why EcoMafola Peace
          </p>
          <h2 className="section-title">
            Crafted with Purpose
          </h2>
        </div>

        {/* Feature Cards with Blurred Background Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md group w-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              {/* Background Image with Blur Effect */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${feature.image}')`,
                  filter: 'blur(6px) brightness(0.75)',
                  transform: 'scale(1.1)',
                }}
              />
              
              {/* Content Overlay */}
              <div className="relative z-10 p-8 text-white">
                <h3 className="font-serif text-2xl font-semibold mb-3 drop-shadow-md text-white">
                  {feature.title}
                </h3>
                <p className="font-sans text-base leading-relaxed drop-shadow-sm text-white">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
