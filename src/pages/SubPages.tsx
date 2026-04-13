// OurStoryPage.tsx
import { Link } from 'react-router-dom'
import PageSeo from '../components/seo/PageSeo'
import { Helmet } from 'react-helmet-async'
import { OptimizedImage } from '../components/OptimizedImage'

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
            "@type": "WebPage",
            "name": "Our Story | EcoMafola Peace",
            "url": "https://ecomafola.com/our-story",
            "description": "EcoMafola Peace was founded on the belief that the ancient artistry of the South Pacific deserves a global stage.",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://ecomafola.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Our Story",
                  "item": "https://ecomafola.com/our-story"
                }
              ]
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Polynesian Soul, Handcrafted Heritage - Our Story",
            "description": "EcoMafola Peace was founded on the belief that the ancient artistry of the South Pacific deserves a global stage.",
            "image": {
              "@type": "ImageObject",
              "url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
              "width": "1200",
              "height": "675",
              "caption": "Samoan Artisan Crafting"
            },
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
          <OptimizedImage src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80" alt="Samoan Artisan Crafting" preset="hero" priority className="w-full h-full" />
        </div>
        <div className="prose prose-lg max-w-none font-sans text-gray-700 space-y-6 leading-relaxed">
          <p className="text-xl font-medium text-ocean-blue/80 italic">"Not just decor, but a piece of the Pacific Soul."</p>

          <h2 className="font-serif text-2xl font-bold text-ocean-blue mt-10 mb-4">Where It All Began</h2>
          <p>EcoMafola Peace was founded on a simple but powerful belief: the ancient artistry of the South Pacific — from the rhythmic weaving of Samoan pandanus grass to the intricate carving of mother-of-pearl — deserves a global stage. We don't just sell objects; we share a legacy that stretches back thousands of years.</p>

          <p>The story starts in Samoa, on the island of Savai'i. This is the largest and least developed of the Samoan islands, where many villages still live without grid electricity and where traditional knowledge is passed from grandmother to grandchild the way it always has been — through doing, not writing. It was here, sitting on woven mats in open-air fales, that we first understood the depth of Pacific craftsmanship.</p>

          <p>One of the first artisans we met was Afioga Mele, a master weaver from a village on the northwest coast. She had been weaving since she was seven years old, learning from her grandmother who learned from hers. The pattern she uses — a tight diamond weave — has been in her family for generations. Each coir mat she makes takes about five days from start to finish: stripping the pandanus leaves, drying them in the sun, dyeing with natural bark, and then weaving the pattern by hand on the lava floor of her family fale. She makes two to three mats a month, on top of everything else she does — cooking, gardening, church choir on Sundays.</p>

          <h2 className="font-serif text-2xl font-bold text-ocean-blue mt-10 mb-4">The Meaning of "Mafola"</h2>
          <p>The word <em>mafola</em> in Samoan means to spread out, to flatten, to flourish. It's what you do when you lay out a woven mat for guests — you spread it wide so everyone has a place to sit. It's also what happens when a community shares its skills: the craft spreads, grows, takes root in new places.</p>

          <p>That's the spirit behind our name. EcoMafola Peace exists to help Pacific Islander craft traditions spread beyond the village market, beyond the island, beyond the risk of being forgotten. Every product on our site carries that name because every product is part of that mission.</p>

          <h2 className="font-serif text-2xl font-bold text-ocean-blue mt-10 mb-4">The People Behind Every Product</h2>

          <p>When you buy a coconut bowl from us, it was carved by someone like Tavita Ioane, a craftsman in Apia who started carving after a tourism layoff in 2020. He sources his coconut shells from a copra processor in Vaiusu — shells that would otherwise be burned as waste. Each bowl takes about three hours of active work: sanding, shaping, polishing, and sealing with natural coconut oil. At our price point, Tavita earns roughly $15 per bowl — well above Samoa's average monthly income when he sells 30 to 40 bowls a month.</p>

          <p>When you order a shell necklace, it was strung by someone like Lani Tuatagaloa, who has been making shell jewelry in Fagali'i, Samoa, for forty years. She walks the same two-kilometer stretch of reef flat every morning with a bucket, collecting shells from beach combing and storm wash-ups. No living creatures. No active reef harvesting. Her most popular piece — the Loto necklace — uses tiny cowrie shells strung on hand-braided coconut fiber. Each one takes about 90 minutes. She runs a collective of six women from her village, paying each woman directly from her earnings.</p>

          <p>When you pick up a woven basket, it was made by someone from the Leulumoego Coir Collective — a group of eight families, mostly men who worked in fishing or farming before they started making coir products full-time. They use traditional techniques passed down through generations, but they've adapted the designs for modern homes. Everyone contributes raw materials. Everyone shares the income. There's no single boss — Sione coordinates, but decisions are made together.</p>

          <h2 className="font-serif text-2xl font-bold text-ocean-blue mt-10 mb-4">Our Fair Trade Model: 60% Goes Directly to Makers</h2>
          <p>Most fair trade claims give 10 to 20 percent back to makers. We give 60 percent of the retail price. Directly. No middlemen, no agent fees, no "processing costs" deducted before the artisan sees a dollar.</p>

          <p>Here's what that looks like in practice: a $25 coconut bowl means $15 goes to the carver. A $48 coir mat means $28.80 goes to the weaver. A $35 shell necklace means $21 goes to the jewelry maker. A $60 woven basket means $36 goes to the collective.</p>

          <p>The remaining 40 percent covers our actual costs: shipping from the islands, packaging that doesn't use plastic, website hosting, marketing so people actually find these products, and a small margin that keeps EcoMafola running.</p>

          <h2 className="font-serif text-2xl font-bold text-ocean-blue mt-10 mb-4">The Mafola Artisan Fund</h2>
          <p>Beyond the 60 percent revenue share, we set aside 5 percent of all sales into the Mafola Artisan Fund. It's not a marketing initiative. It's a real pool of money that goes to three things:</p>

          <p><strong>Health.</strong> Medical expenses are one of the biggest financial shocks for families in rural Pacific communities. The fund has covered dental work, prescription medications, and emergency transport to Apia hospital for artisan families. Last year alone, we helped 14 families with health costs totaling over $6,200.</p>

          <p><strong>Micro-finance.</strong> Some artisans need a small loan to buy materials, upgrade tools, or cover costs while waiting for a large order to ship. The fund provides interest-free loans — typically $100 to $500 — repaid over 3 to 6 months. We've issued 32 loans since starting the program. The repayment rate is 97 percent.</p>

          <p><strong>Education.</strong> Several artisan families have used the fund to cover school fees, uniforms, and supplies. We've supported 23 students so far. The average grant is $180 per student per term.</p>

          <h2 className="font-serif text-2xl font-bold text-ocean-blue mt-10 mb-4">Women-Led Cooperatives and What They Change</h2>
          <p>Most of the artisans we work with are women. That's not by design — it's how Pacific craft traditions work. Weaving, shell work, fiber arts — these have historically been women's domains.</p>

          <p>What's changed is the economic power that comes with selling beyond the village market. When a woman in Savai'i earns $300 a month from her weaving, she doesn't spend it on herself. She pays school fees. She buys rice and tinned fish for the household. She contributes to the church fund. She saves for emergencies. She becomes the person others come to when they need help.</p>

          <p>We've seen this pattern repeat across every cooperative we work with. Women who started making crafts as a side income are now the primary earners in their households. That shifts something fundamental in how decisions get made, whose voice carries weight, and what the next generation of girls sees as possible.</p>

          <h2 className="font-serif text-2xl font-bold text-ocean-blue mt-10 mb-4">Where We Are Today</h2>
          <p>Today, EcoMafola Peace works with over 240 families across four Pacific Island nations: Samoa, Fiji, Tonga, and Vanuatu. We have 18 women-led weaving and craft cooperatives in our network. Since 2019, we've made direct fair-trade payments totaling over $2.4 million to artisan partners. Ninety-four percent of our materials are certified eco-sourced.</p>

          <p>But the numbers only tell part of the story. The real story is in the hands that make what you hold. It's in the sound of weaving that starts before sunrise behind a mango tree in Leulumoego. It's in the tool marks on a coconut bowl that tell you a person, not a machine, shaped it. It's in the quiet pride of a woman who went from asking her husband for money to being the one others turn to when they need help.</p>

          <p>That's the EcoMafola story. And it's a story that keeps growing with every piece we sell, every artisan we partner with, and every person who brings a piece of the Pacific into their home.</p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 p-8 bg-ocean-blue/5 rounded-3xl border border-ocean-blue/10">
          <div className="w-20 h-20 rounded-full bg-ocean-blue flex items-center justify-center text-white text-3xl shrink-0">🌊</div>
          <div>
            <h3 className="font-serif text-xl font-bold text-ocean-blue mb-2">The Artisan Commitment</h3>
            <p className="text-sm text-gray-600">Every purchase directly fuels the <em>Mafola Artisan Fund</em>, providing health and micro-finance resources to over 240 artisan families across the Pacific islands.</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-serif text-2xl font-bold text-tropical-green">240+</p>
            <p className="text-xs text-gray-500 mt-1">Artisan Families</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-serif text-2xl font-bold text-tropical-green">$2.4M</p>
            <p className="text-xs text-gray-500 mt-1">Paid to Artisans</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-serif text-2xl font-bold text-tropical-green">60%</p>
            <p className="text-xs text-gray-500 mt-1">Revenue to Makers</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-serif text-2xl font-bold text-tropical-green">4</p>
            <p className="text-xs text-gray-500 mt-1">Pacific Nations</p>
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
            "@type": "WebPage",
            "name": "Our Impact | EcoMafola Peace",
            "url": "https://ecomafola.com/impact",
            "description": "EcoMafola Peace partners with 240+ artisan families across the Pacific.",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://ecomafola.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Our Impact",
                  "item": "https://ecomafola.com/impact"
                }
              ]
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Real Change, Real Lives - Our Impact",
            "description": "EcoMafola Peace partners with 240+ artisan families across the Pacific, paying 40% above market rates.",
            "image": {
              "@type": "ImageObject",
              "url": "https://ecomafola.com/og-default.jpg",
              "width": "1200",
              "height": "630",
              "caption": "EcoMafola Peace Impact Statistics"
            },
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
import { Helmet } from 'react-helmet-async'

export function ContactPage() {
  const faqs = [
    {
      "@type": "Question",
      "name": "What is your shipping time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer free US shipping with delivery in 7-12 business days. Orders are processed within 1-3 business days."
      }
    },
    {
      "@type": "Question",
      "name": "Are your products really handmade?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Every EcoMafola product is 100% handmade by skilled artisans in Samoa and the South Pacific using traditional techniques passed down through generations."
      }
    },
    {
      "@type": "Question",
      "name": "What materials do you use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We use only natural, sustainable materials including coconut shell, pandanus grass, natural shells, and coconut coir. 94% of our materials are certified eco-sourced."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer returns?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer a 30-day return policy. If you're not completely satisfied, you can return your purchase for a full refund."
      }
    },
    {
      "@type": "Question",
      "name": "How do I track my order?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can track your order at any time by visiting our Track Order page at ecomafola.com/track with your order number."
      }
    }
  ]

  return (
    <>
      <PageSeo
        title="Contact Us"
        description="Have questions about our artisans, wholesale opportunities, or your order? Our team is here to share the spirit of Samoa with you. Email: hello@ecomafola.com"
        canonical="/contact"
        type="website"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Contact Us | EcoMafola Peace",
            "url": "https://ecomafola.com/contact",
            "description": "Get in touch with EcoMafola Peace. Questions about artisans, wholesale, or orders?",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://ecomafola.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Contact Us",
                  "item": "https://ecomafola.com/contact"
                }
              ]
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs
          })}
        </script>
      </Helmet>
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
