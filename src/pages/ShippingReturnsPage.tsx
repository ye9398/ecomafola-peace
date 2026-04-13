import PageSeo from '../components/seo/PageSeo'
import { Helmet } from 'react-helmet-async'
import { Truck, RotateCcw, Package, Clock } from 'lucide-react'

function ShippingReturnsPage() {
  return (
    <>
      <PageSeo
        title="Shipping & Returns"
        description="Free shipping on US orders. Carbon-neutral worldwide delivery in 7-21 days. 30-day satisfaction guarantee on all handcrafted products."
        canonical="/shipping-returns"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'How much does shipping cost?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Free shipping on all US orders. International shipping rates start at $9.99. All shipping is carbon-neutral.',
                },
              },
              {
                '@type': 'Question',
                'name': 'How long does shipping take?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'US orders arrive in 7-12 business days. International orders take 10-21 business days depending on destination.',
                },
              },
              {
                '@type': 'Question',
                'name': 'What is your return policy?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'We offer a 30-day satisfaction guarantee. If you are not happy with your purchase, contact us for a replacement or refund.',
                },
              },
            ],
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-coral-white pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-ocean-blue mb-4">
            Shipping & Returns
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Every order ships carbon-neutral. We use recycled packaging and traditional
            Siapo-patterned wrapping paper — because even the delivery should carry meaning.
          </p>

          {/* Shipping Info */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-bold text-ocean-blue mb-6 flex items-center gap-3">
              <Truck className="text-tropical-green" size={28} />
              Shipping
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-lg text-ocean-blue mb-3">United States</h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-tropical-green">FREE shipping</span> on all orders
                </p>
                <p className="text-gray-500 text-sm">Delivery: 7-12 business days</p>
                <p className="text-gray-500 text-sm">Carrier: USPS / DHL Express</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-lg text-ocean-blue mb-3">International</h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-ocean-blue">From $9.99</span> carbon-neutral shipping
                </p>
                <p className="text-gray-500 text-sm">Delivery: 10-21 business days</p>
                <p className="text-gray-500 text-sm">Ships to: US, UK, AU, NZ, EU</p>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-semibold text-lg text-ocean-blue mb-3 flex items-center gap-2">
                <Package size={20} className="text-tropical-green" />
                Processing & Packaging
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>Orders ship within 24 hours of placement</li>
                <li>All packaging is recycled paper — no plastic, no styrofoam</li>
                <li>Wrapping features traditional Siapo (Samoan bark cloth) patterns</li>
                <li>Gift messages available on recycled cards at checkout</li>
              </ul>
            </div>
          </section>

          {/* Returns Info */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-bold text-ocean-blue mb-6 flex items-center gap-3">
              <RotateCcw className="text-tropical-green" size={28} />
              Returns & Exchanges
            </h2>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-semibold text-lg text-ocean-blue mb-3">30-Day Satisfaction Guarantee</h3>
              <p className="text-gray-600 mb-4">
                If you're not completely satisfied with your purchase, we'll make it right.
                Contact us within 30 days of delivery for a replacement or full refund.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-tropical-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Damaged on Arrival</p>
                    <p className="text-gray-600 text-sm">
                      These are natural materials traveling across oceans. If anything arrives damaged,
                      contact us and we'll send a replacement at no cost.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-tropical-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Not What You Expected</p>
                    <p className="text-gray-600 text-sm">
                      Each piece is handmade and unique — slight variations in pattern, texture,
                      and color are natural. If the piece doesn't meet your expectations,
                      we'll work with you to find a solution.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-tropical-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Craftsmanship Warranty</p>
                    <p className="text-gray-600 text-sm">
                      We stand behind the quality of every piece. If a craftsmanship defect
                      appears within one year of purchase, we'll replace it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-ocean-blue text-white rounded-2xl p-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Need Help with Your Order?</h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Our team responds within 24 hours. We're here for any questions about
              shipping, returns, or our products.
            </p>
            <a
              href="mailto:hello@ecomafola-peace.com"
              className="inline-block bg-white text-ocean-blue font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </>
  )
}

export default ShippingReturnsPage
