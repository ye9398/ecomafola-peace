import { useState } from 'react'
import PageSeo from '../components/seo/PageSeo'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
  category: string
}

const faqs: FaqItem[] = [
  {
    category: 'Products',
    question: 'Are all products genuinely handmade?',
    answer: 'Yes. Every single item on ecomafola.com is handcrafted by Pacific Islander artisans. We don\'t work with factories or mass producers. Each piece shows the natural variations that come with handmade work — slight differences in pattern, texture, or color that make each one unique.',
  },
  {
    category: 'Products',
    question: 'What materials are your products made from?',
    answer: 'Our artisans use natural, renewable materials: coconut shells, pandanus leaves, coconut coir, sustainably sourced shells, grasses, and natural wood. Nothing synthetic, nothing factory-made. Every material is biodegradable and eco-friendly.',
  },
  {
    category: 'Products',
    question: 'Why do handmade products have slight variations?',
    answer: 'Because each piece is individually crafted by hand, no two items are exactly alike. These variations aren\'t defects — they\'re the signature of handmade work. The slight irregularities are what give each piece its character and authenticity.',
  },
  {
    category: 'Shipping',
    question: 'How much does shipping cost?',
    answer: 'Free shipping on all US orders. International shipping starts at $9.99. Every order ships carbon-neutral — we offset the emissions from every shipment at no extra cost to you.',
  },
  {
    category: 'Shipping',
    question: 'How long does shipping take?',
    answer: 'US orders arrive in 7-12 business days. International orders take 10-21 business days depending on destination. We ship to the US, UK, Australia, New Zealand, and throughout the EU.',
  },
  {
    category: 'Shipping',
    question: 'Can I include a gift message with my order?',
    answer: 'Absolutely. At checkout, you can add a gift message and we\'ll include it on a recycled card inside your package. We leave out pricing information so your gift recipient just sees your note and the story behind their piece.',
  },
  {
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day satisfaction guarantee. If you\'re not happy with your purchase, contact us within 30 days of delivery for a replacement or full refund. We also provide a one-year craftsmanship warranty against defects.',
  },
  {
    category: 'Returns',
    question: 'What if my order arrives damaged?',
    answer: 'It\'s rare, but natural materials can take a beating during long-distance shipping. If anything arrives damaged, contact us and we\'ll send a replacement at no cost. No need to return the damaged item.',
  },
  {
    category: 'Fair Trade',
    question: 'How much do the artisans earn?',
    answer: 'We operate on a 60% revenue share model — 60% of every retail price goes directly to the artisan who made the product. That\'s significantly higher than the 10-20% typical in conventional fair trade arrangements.',
  },
  {
    category: 'Fair Trade',
    question: 'Where do the artisans live?',
    answer: 'Our artisan network spans 240+ families across four Pacific Island nations: Samoa (primarily Savai\'i and Upolu), Fiji (Suva and surrounding villages), Tonga (Tongatapu), and Vanuatu (Efate and Santo).',
  },
  {
    category: 'Fair Trade',
    question: 'What is the Mafola Artisan Fund?',
    answer: 'Beyond the 60% revenue share, we set aside 5% of all sales into the Mafola Artisan Fund. It covers medical expenses, provides interest-free micro-loans, and supports education for artisan families. Last year we helped 14 families with health costs totaling over $6,200.',
  },
  {
    category: 'Sustainability',
    question: 'How is your shipping carbon-neutral?',
    answer: 'We calculate the emissions from every shipment and purchase verified carbon offsets to neutralize the impact. Our packaging uses recycled paper with zero plastic or styrofoam. We\'re committed to minimizing our environmental footprint at every step.',
  },
  {
    category: 'Sustainability',
    question: 'Are your products sustainably sourced?',
    answer: '94% of our materials are certified eco-sourced. Coconut shells are upcycled from food waste. Pandanus leaves are harvested sustainably. Shells are collected from beaches and storm wash-ups — never taken from living creatures or active reefs.',
  },
]

const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))]

function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filtered = activeCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeCategory)

  return (
    <>
      <PageSeo
        title="Frequently Asked Questions"
        description="Answers to common questions about EcoMafola's handmade Pacific Islander products, shipping, returns, fair trade practices, and sustainability."
        canonical="/faq"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(faq => ({
              '@type': 'Question',
              'name': faq.question,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer,
              },
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-coral-white pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-ocean-blue mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Can't find what you're looking for?{' '}
            <a href="mailto:hello@ecomafola.com" className="text-tropical-green underline">
              Email us
            </a>{' '}
            and we'll respond within 24 hours.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-ocean-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filtered.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-ocean-blue pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default FaqPage
