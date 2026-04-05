// OurStoryPage.tsx
import { Link } from 'react-router-dom'

export function OurStoryPage() {
  return (
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
  )
}

// ImpactPage.tsx
export function ImpactPage() {
  const stats = [
    { value: '240+', label: 'Artisan Partners', desc: 'Across Samoa, Fiji, Tonga & Vanuatu' },
    { value: '$2.4M', label: 'Paid to Artisans', desc: 'Direct fair-trade payments since 2019' },
    { value: '18', label: 'Cooperatives', desc: 'Women-led weaving & craft cooperatives' },
    { value: '94%', label: 'Sustainable Materials', desc: 'Certified eco-sourced raw materials' },
  ]
  return (
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
  )
}

// ContactPage.tsx
export function ContactPage() {
  return (
    <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-sans font-medium text-tropical-green tracking-widest uppercase mb-3">Get in Touch</p>
        <h1 className="font-serif text-4xl font-bold text-ocean-blue mb-8">Contact Us</h1>
        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-5">
          {[['Your Name','text','name'],['Email Address','email','email'],['Subject','text','subject']].map(([label, type, id]) => (
            <div key={id}>
              <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">{label}</label>
              <input type={type} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-sans font-medium text-gray-500 mb-1.5">Message</label>
            <textarea rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all resize-none" />
          </div>
          <button className="w-full bg-ocean-blue text-white py-3.5 rounded-xl font-sans font-semibold text-sm hover:bg-tropical-green transition-colors">Send Message</button>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[['📧','Email','hello@ecomafola.com'],['📍','Address','Apia, Samoa & Sydney, AU'],['⏰','Response','Within 24 hours']].map(([icon, label, val]) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-xs font-sans font-semibold text-gray-600">{label}</p>
              <p className="text-xs font-sans text-gray-400">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
