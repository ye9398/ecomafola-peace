/**
 * ProductDetailContent Component
 *
 * Displays extended product content for SEO & GEO optimization:
 * - Product Story (150+ words)
 * - Materials & Sourcing (50+ words)
 * - Specifications & Dimensions (50+ words)
 * - Usage & Care Instructions (50+ words)
 * - Social Impact (50+ words)
 * - FAQ Section
 *
 * Target: 350-400 words total per product
 */

import { useState } from 'react'
import { ChevronDown, ChevronUp, Sprout, Users, Ruler, BookOpen, Heart } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
}

interface Specifications {
  size: string
  weight: string
  material: string
  origin: string
  care: string
}

interface ProductContent {
  story: string
  environmental: string
  partnership: string
  features: string[]
  specifications: Specifications
  guarantee: string
  shipping: string
  faqs: FAQ[]
}

interface ProductDetailContentProps {
  content: ProductContent
  productName: string
}

export function ProductDetailContent({ content, productName }: ProductDetailContentProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  // Strip HTML tags for clean text display
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '\n\n').replace(/\n\n+/g, '\n\n').trim()
  }

  return (
    <div className="mt-16 space-y-12">
      {/* Product Story Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-ocean-blue/5 flex items-center justify-center text-ocean-blue">
            <BookOpen size={24} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-ocean-blue">The Story Behind {productName}</h2>
        </div>
        <div className="prose prose-lg max-w-none">
          {content.story.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="font-sans text-gray-700 leading-relaxed text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Environmental & Partnership Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environmental Impact */}
        <section className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-tropical-green/5 flex items-center justify-center text-tropical-green">
              <Sprout size={24} />
            </div>
            <h3 className="font-serif text-xl font-bold text-ocean-blue">Environmental Impact</h3>
          </div>
          <div className="font-sans text-gray-700 leading-relaxed whitespace-pre-line">
            {stripHtml(content.environmental)}
          </div>
        </section>

        {/* Social Partnership */}
        <section className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-coral-pink/5 flex items-center justify-center text-coral-pink">
              <Users size={24} />
            </div>
            <h3 className="font-serif text-xl font-bold text-ocean-blue">Artisan Partnership</h3>
          </div>
          <div className="font-sans text-gray-700 leading-relaxed whitespace-pre-line">
            {stripHtml(content.partnership)}
          </div>
        </section>
      </div>

      {/* Features List */}
      <section className="bg-white rounded-3xl p-8 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-ocean-blue mb-6">Key Features</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-tropical-green mt-0.5 shrink-0" />
              <span className="font-sans text-gray-700">{feature.replace(/^[\*\•]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Specifications */}
      <section className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sand-beige/5 flex items-center justify-center text-ocean-blue">
            <Ruler size={24} />
          </div>
          <h3 className="font-serif text-xl font-bold text-ocean-blue">Specifications & Care</h3>
        </div>
        <dl className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pb-4 border-b border-gray-100">
            <dt className="font-sans text-xs font-bold text-ocean-blue/50 uppercase tracking-widest w-32 shrink-0">Size</dt>
            <dd className="font-sans text-gray-700">{content.specifications.size}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pb-4 border-b border-gray-100">
            <dt className="font-sans text-xs font-bold text-ocean-blue/50 uppercase tracking-widest w-32 shrink-0">Weight</dt>
            <dd className="font-sans text-gray-700">{content.specifications.weight}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pb-4 border-b border-gray-100">
            <dt className="font-sans text-xs font-bold text-ocean-blue/50 uppercase tracking-widest w-32 shrink-0">Material</dt>
            <dd className="font-sans text-gray-700">{content.specifications.material}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pb-4 border-b border-gray-100">
            <dt className="font-sans text-xs font-bold text-ocean-blue/50 uppercase tracking-widest w-32 shrink-0">Origin</dt>
            <dd className="font-sans text-gray-700">{content.specifications.origin}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <dt className="font-sans text-xs font-bold text-ocean-blue/50 uppercase tracking-widest w-32 shrink-0">Care</dt>
            <dd className="font-sans text-gray-700">{content.specifications.care}</dd>
          </div>
        </dl>
      </section>

      {/* Guarantee */}
      <section className="bg-ocean-blue/5 rounded-3xl p-8 border border-ocean-blue/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-ocean-blue text-white flex items-center justify-center">
            <Heart size={24} />
          </div>
          <h3 className="font-serif text-xl font-bold text-ocean-blue">Our Guarantee</h3>
        </div>
        <p className="font-sans text-gray-700 leading-relaxed whitespace-pre-line">
          {content.guarantee}
        </p>
      </section>

      {/* FAQ Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-ocean-blue mb-6">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {content.faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openFaqIndex === idx}
              >
                <span className="font-sans font-semibold text-ocean-blue pr-8">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-ocean-blue/40 shrink-0 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-0">
                  <p className="font-sans text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
