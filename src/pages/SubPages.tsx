// OurStoryPage.tsx
import { Link } from 'react-router-dom'
import PageSeo from '../components/seo/PageSeo'
import { Helmet } from 'react-helmet-async'

export function OurStoryPage() {
  return (
    <>
      <PageSeo
        title="Our Story"
        description="EcoMafola Peace was founded on the belief that the ancient artistry of the South Pacific deserves a global stage. We partner directly with family cooperatives across Samoa, Fiji, and the wider Polynesian triangle."
        canonical="/our-story"
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Polynesian Soul, Handcrafted Heritage - Our Story",
            "description": "EcoMafola Peace was founded on the belief that the ancient artistry of the South Pacific deserves a global stage.",
            "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
            "author": {
              "@type": "Organization",
              "name": "EcoMafola Peace"
            },
            "publisher": {
              "@type": "Organization",
              "name": "EcoMafola Peace",
              "logo": "https://ecomafola.com/logo.png"
            },
            "datePublished": "2019-01-01",
            "dateModified": "2026-04-11"
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-sans font-medium text-tropical-green tracking-widest uppercase mb-3">Our Story</p>
        <h1 className="font-serif text-4xl font-bold text-ocean-blue mb-6">Polynesian Soul, Handcrafted Heritage</h1>
        <div className="aspect-video rounded-3xl overflow-hidden mb-10 shadow-lg">
          <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80" alt="Samoan Artisan Crafting" className="w-full h-full object-cover" />
        </div>
        <div className="prose prose-lg max-w-none font-sans text-gray-700 space-y-6 leading-relaxed">
          <p className="text-xl font-medium text-ocean-blue/80 italic">"Not just decor, but a piece of the Pacific Soul."</p>
          <p>EcoMafola Peace was founded on the belief that the ancient artistry of the South Pacific—from the rhythmic weaving of Samoan grass to the intricate carving of mother-of-pearl—deserves a global stage. We don't just sell objects; we share a legacy.</p>
          <p>We partner directly with family cooperatives across Samoa, Fiji, and the wider Polynesian triangle. These are communities where the <em>mafola</em> spirit—meaning to flourish and spread out—is woven into every basket and carved into every shell.</p>
          <p>When you bring an EcoMafola piece into your home, you're not just choosing sustainable decor. You're supporting the education of island youth, the preservation of non-material cultural heritage, and a thousand-year-old story of ocean-borne wisdom.</p>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 p-8 bg-ocean-blue/5 rounded-3xl border border-ocean-blue/10">
          <div className="w-20 h-20 rounded-full bg-ocean-blue flex items-center justify-center text-white text-3xl shrink-0">🌊</div>
          <div>
            <h3 className="font-serif text-xl font-bold text-ocean-blue mb-2">The Artisan Commitment</h3>
            <p className="text-sm text-gray-600">Every purchase directly fuels the <em>Mafola Artisan Fund</em>, providing health and micro-finance resources to over 240 artisan families across the Pacific islands.</p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link to="/products" className="inline-block bg-ocean-blue text-white px-10 py-4 rounded-full font-sans font-bold hover:bg-tropical-green transition-all shadow-md hover:shadow-lg">Shop the Soul of the Pacific →</Link>
        </div>
      </div>
    </div>
    </>
  )
}

// ImpactPage.tsx
import PageSeo from '../components/seo/PageSeo'
import { Helmet } from 'react-helmet-async'

export function ImpactPage() {
  const stats = [
    { value: '240+', label: 'Artisan Partners', desc: 'Across Samoa, Fiji, Tonga & Vanuatu' },
    { value: '$2.4M', label: 'Paid to Artisans', desc: 'Direct fair-trade payments since 2019' },
    { value: '18', label: 'Cooperatives', desc: 'Women-led weaving & craft cooperatives' },
    { value: '94%', label: 'Sustainable Materials', desc: 'Certified eco-sourced raw materials' },
  ]
  return (
    <>
      <PageSeo
        title="Our Impact"
        description="Real change, real lives. EcoMafola Peace partners with 240+ artisan families across the Pacific, paying 40% above market rates and providing healthcare contributions."
        canonical="/impact"
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Real Change, Real Lives - Our Impact",
            "description": "EcoMafola Peace partners with 240+ artisan families across the Pacific, paying 40% above market rates.",
            "image": "https://ecomafola.com/og-default.jpg",
            "author": {
              "@type": "Organization",
              "name": "EcoMafola Peace"
            },
            "publisher": {
              "@type": "Organization",
              "name": "EcoMafola Peace",
              "logo": "https://ecomafola.com/logo.png"
            },
            "datePublished": "2019-01-01",
            "dateModified": "2026-04-11"
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-sans font-medium text-tropical-green tracking-widest uppercase mb-3">Our Impact</p>
        <h1 className="font-serif text-4xl font-bold text-ocean-blue mb-10">Real Change, Real Lives</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-3xl p-6 shadow-sm text-center">
              <p className="font-serif text-3xl font-bold text-tropical-green mb-1">{s.value}</p>
              <p className="font-sans font-semibold text-ocean-blue text-sm mb-1">{s.label}</p>
              <p className="font-sans text-xs text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-ocean-blue rounded-3xl p-8 text-white">
          <h2 className="font-serif text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="font-sans text-white/80 leading-relaxed">Every purchase directly supports artisan families. We pay 40% above market rates, provide healthcare contributions, and invest in skills training programs for the next generation of Pacific craftspeople.</p>
        </div>
      </div>
    </div>
    </>
  )
}

// ContactPage.tsx
import { Mail, MapPin, Clock, Send } from 'lucide-react'
import PageSeo from '../components/seo/PageSeo'

export function ContactPage() {
  return (
    <>
      <PageSeo
        title="Contact Us"
        description="Have questions about our artisans, wholesale opportunities, or your order? Our team is here to share the spirit of Samoa with you. Email: hello@ecomafola.com"
        canonical="/contact"
        type="website"
      />
      <div className="min-h-screen bg-coral-white pt-24 pb-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tropical-green/10 border border-tropical-green/20 mb-6">
              <span className="w-1.5 h-1.5 bg-tropical-green rounded-full" />
              <p className="font-sans text-[10px] font-black text-tropical-green uppercase tracking-[0.2em]">
                Get in Touch
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-ocean-blue mb-8">
              Let's Connect with the <span className="italic text-tropical-green font-normal">Pacific</span>
            </h2>
            <p className="font-sans text-ocean-blue/60 text-sm md:text-base leading-relaxed mb-12 max-w-lg">
              Have questions about our artisans, wholesale opportunities, or your order? 
              Our team is here to share the spirit of Samoa with you.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Mail className="text-tropical-green" />, label: 'Email Us', value: 'hello@ecomafola.com' },
                { icon: <MapPin className="text-tropical-green" />, label: 'Our Base', value: 'Apia, Samoa & Sydney, AU' },
                { icon: <Clock className="text-tropical-green" />, label: 'Response Time', value: 'Within 24 Hours' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-ocean-blue/5 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-sans text-xs font-black uppercase tracking-widest text-ocean-blue/40 mb-1">{item.label}</p>
                    <p className="font-serif text-lg font-bold text-ocean-blue">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-[#F0E8DC] p-8 md:p-12 rounded-[2.5rem] shadow-xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-sans text-xs font-black uppercase tracking-widest text-ocean-blue/40 ml-1">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white border-0 rounded-2xl px-6 py-4 text-sm font-sans focus:ring-2 focus:ring-tropical-green transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-xs font-black uppercase tracking-widest text-ocean-blue/40 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-white border-0 rounded-2xl px-6 py-4 text-sm font-sans focus:ring-2 focus:ring-tropical-green transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs font-black uppercase tracking-widest text-ocean-blue/40 ml-1">Message</label>
                <textarea 
                  rows={4} 
                  placeholder="Tell us your story..."
                  className="w-full bg-white border-0 rounded-2xl px-6 py-4 text-sm font-sans focus:ring-2 focus:ring-tropical-green transition-all resize-none"
                />
              </div>
              <button className="w-full bg-ocean-blue text-white py-5 rounded-2xl font-sans font-black uppercase tracking-[0.2em] text-xs hover:bg-tropical-green transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group">
                Send Message
                <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute -top-12 -right-12 font-serif text-[15vw] font-black text-ocean-blue/5 pointer-events-none select-none italic leading-none whitespace-nowrap">
        Contact Us
      </div>
    </div>
    </>
  )
}
