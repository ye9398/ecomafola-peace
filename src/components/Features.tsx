import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Waves, PenTool as Tool, Heart } from 'lucide-react'

const heritageSteps = [
  {
    id: 'ocean',
    title: 'The Ocean Whisper',
    subtitle: 'Nature\'s Gift',
    description: 'Our journey begins at dawn on Samoa\'s southern coastline. We collect only naturally fallen shells — never harvested, never exploited. Every piece carries the actual texture of a Samoan morning: salt-kissed and timeless.',
    image: 'https://sc02.alicdn.com/kf/A21fee7c2f37e41828c1e50b124b3fe041.png',
    icon: <Waves className="w-6 h-6" />,
    detail: 'Naturally Fallen Shells'
  },
  {
    id: 'artisan',
    title: 'Ana\'s 15-Year Craft',
    subtitle: 'The Human Touch',
    description: 'Meet Ana, who has been hand-polishing treasures in her seaside village for over 15 years. Every hole is hand-drilled, and every surface is finished with organic coconut oil — a traditional method that honors the material without chemicals.',
    image: 'https://sc02.alicdn.com/kf/A8e4e1093b33640ce93656d48c5b6eaa3d.png',
    icon: <Tool className="w-6 h-6" />,
    detail: '100% Hand-Drilled'
  },
  {
    id: 'alofa',
    title: 'Alofa Atasi',
    subtitle: 'From Samoa with Love',
    description: 'Your piece isn\'t finished until Ana includes a hand-written card. "Alofa Atasi" means One Love. You aren\'t just buying a necklace; you are supporting a family and preserving a Pacific heritage that spans generations.',
    image: 'https://sc02.alicdn.com/kf/Acb7c584bfed94dc59d4e56613a1c5f952.png',
    icon: <Heart className="w-6 h-6" />,
    detail: 'Hand-Signed Cards'
  }
]

export default function Features() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="py-24 bg-[#F0E8DC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tropical-green/10 border border-tropical-green/20 mb-6">
            <span className="w-1.5 h-1.5 bg-tropical-green rounded-full" />
            <p className="font-sans text-[10px] font-black text-tropical-green uppercase tracking-[0.2em]">
              Artisan Heritage
            </p>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-ocean-blue mb-6">
            The Journey of <span className="italic text-tropical-green font-normal">Soul</span>
          </h2>
          <p className="max-w-2xl mx-auto font-sans text-ocean-blue/60 text-sm md:text-base leading-relaxed">
            Every EcoMafola piece travels a path of respect, tradition, and human connection. 
            Follow the story from the reef to your hands.
          </p>
        </div>

        {/* Interactive Story Module */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Image Display */}
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl group">
            {heritageSteps.map((step, index) => (
              <div
                key={step.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  activeStep === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
                }`}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-blue/60 via-transparent to-transparent" />
                
                {/* Image Overlay Detail */}
                <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      {step.icon}
                    </div>
                    <span className="font-sans text-xs font-black uppercase tracking-widest">
                      {step.detail}
                    </span>
                  </div>
                  <span className="font-serif text-4xl italic opacity-50">0{index + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Content & Navigation */}
          <div className="flex flex-col gap-8 md:gap-12">
            <div className="space-y-8">
              {heritageSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left group transition-all duration-500 border-l-4 pl-8 py-2 ${
                    activeStep === index 
                      ? 'border-tropical-green opacity-100' 
                      : 'border-gray-100 opacity-40 hover:opacity-70 hover:border-gray-200'
                  }`}
                >
                  <p className={`font-sans text-[10px] font-black uppercase tracking-widest mb-2 transition-colors ${
                    activeStep === index ? 'text-tropical-green' : 'text-ocean-blue/40'
                  }`}>
                    {step.subtitle}
                  </p>
                  <h3 className={`font-serif text-2xl md:text-3xl font-bold mb-4 transition-colors ${
                    activeStep === index ? 'text-ocean-blue' : 'text-ocean-blue/60'
                  }`}>
                    {step.title}
                  </h3>
                  
                  {activeStep === index && (
                    <div className="animate-fade-in-up">
                      <p className="font-sans text-ocean-blue/60 text-sm md:text-base leading-relaxed mb-6">
                        {step.description}
                      </p>
                      <Link to="/our-story" className="inline-flex items-center gap-3 text-tropical-green font-sans text-xs font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                        Learn more about Ana <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Scroll Indicator (only visible on mobile) */}
            <div className="flex lg:hidden items-center gap-2 mt-4">
              {heritageSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    activeStep === index ? 'w-8 bg-tropical-green' : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute -bottom-24 -left-24 font-serif text-[20vw] font-black text-ocean-blue/5 pointer-events-none select-none italic leading-none whitespace-nowrap">
        Alofa Atasi
      </div>
    </section>
  )
}
