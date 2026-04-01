import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="py-20 bg-ocean-blue relative overflow-hidden">
      {/* Decorative Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tropical-green/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tropical-green/40 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
          Join Our Community
        </h2>
        <p className="font-sans text-base text-white/90 mb-8 leading-relaxed max-w-xl mx-auto">
          Be the first to discover new artisan collections, behind-the-scenes stories from Samoa,
          and exclusive offers. No spam, just the good stuff.
        </p>

        {submitted ? (
          <div className="bg-white/20 border-2 border-white/20 px-8 py-5 inline-block shadow-lg">
            <p className="font-sans text-white font-medium">
              Welcome to the EcoMafola family! Check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-3.5 bg-white/20 border-2 border-white/30 text-white placeholder-white/60 font-sans text-sm focus:outline-none focus:border-white/60 focus:bg-white/25 transition-all duration-200 shadow-sm"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-tropical-green text-white font-sans font-semibold text-sm px-6 py-3.5 hover:bg-tropical-green-dark transition-colors duration-200 whitespace-nowrap shadow-md border-2 border-transparent"
            >
              Subscribe
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </form>
        )}

        <p className="font-sans text-xs text-white/60 mt-4">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  )
}