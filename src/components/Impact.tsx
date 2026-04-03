const stats = [
  { 
    value: '120+', 
    label: 'Artisan Partners',
    bgImage: '/images/impact/artisan-partners.jpg'
  },
  { 
    value: '5', 
    label: 'Village Cooperatives',
    bgImage: '/images/impact/village-cooperatives.jpg'
  },
  { 
    value: '1%', 
    label: 'Back to Community',
    bgImage: '/images/impact/back-to-community.jpg'
  },
  { 
    value: '12', 
    label: 'Countries Served',
    bgImage: '/images/impact/countries-served.jpg'
  },
]

const stories = [
  {
    quote: "Working with EcoMafola Peace has transformed our cooperative. We have steady income and our children can attend school.",
    name: "Faleolo Tuilagi",
    role: "Weaving Cooperative Leader, Samoa",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
  },
  {
    quote: "Every basket I weave carries the story of our village. I'm proud that people across the world can hold a piece of our culture.",
    name: "Sina Faleolo",
    role: "Master Weaver, Savai'i",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
  },
]

export default function Impact() {
  return (
    <section className="py-20 bg-[#4A7C59] relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-tropical-green/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-sans text-xs font-medium text-tropical-green-light tracking-[0.2em] uppercase mb-3 border-b-2 border-white/20 inline-block pb-1">
            Our Impact
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white leading-tight">
            Real Change, Real Lives
          </h2>
        </div>

        {/* Intro Text */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-sans text-lg text-white/90 leading-relaxed">
            When you choose EcoMafola Peace, you're supporting jobs for local makers, 
            preserving traditional techniques, and protecting the islands' natural resources.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16" role="list" aria-label="Impact statistics">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="text-center p-6 bg-[#4A7C59]/85 border-2 border-[#7FB895] shadow-lg relative overflow-hidden rounded-lg"
              role="listitem"
            >
              {/* Background image layer - positioned absolutely behind content */}
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${stat.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'none',
                  transform: 'scale(1.1)',
                }}
                aria-hidden="true"
              />
              
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/40 z-[1]" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="font-serif text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="font-sans text-sm text-white/90">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <div key={story.name} className="bg-white/10 border-2 border-white/15 p-8 shadow-lg relative">
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-ocean-blue/20 text-6xl font-serif">"</div>
              
              <p className="font-sans text-base text-white/90 italic leading-relaxed mb-6 relative z-10">
                "{story.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src={story.avatar}
                  alt={story.name}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover border-2 border-tropical-green-light shadow-md"
                />
                <div>
                  <p className="font-sans text-sm font-semibold text-white">{story.name}</p>
                  <p className="font-sans text-xs text-white/70">{story.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}