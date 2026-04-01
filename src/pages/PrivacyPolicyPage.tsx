// PrivacyPolicyPage.tsx
import { Link } from 'react-router-dom'

export function PrivacyPolicyPage() {
  return (
   <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
       <p className="text-xs font-sans font-medium text-tropical-green tracking-widest uppercase mb-3">Legal</p>
       <h1 className="font-serif text-4xl font-bold text-ocean-blue mb-2">Privacy Policy</h1>
       <p className="text-sm font-sans text-gray-400 mb-8">Last updated: March 2026</p>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="prose prose-lg max-w-none font-sans text-gray-600 space-y-6">
            <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">1. Introduction</h2>
              <p>EcoMafola Peace ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from our online store.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">2. Information We Collect</h2>
              <p><strong>Personal Information:</strong> When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping address, billing address, and payment information.</p>
              <p><strong>Usage Data:</strong> We automatically collect information about how you interact with our website, including your IP address, browser type, pages visited, and time spent on our site.</p>
              <p><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your browsing experience and gather analytics about site usage.</p>
           </section>

           <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To process and fulfill your orders</li>
                <li>To send order confirmations, shipping updates, and customer service communications</li>
                <li>To respond to your inquiries and provide support</li>
                <li>To improve our website, products, and services</li>
                <li>To prevent fraud and ensure security</li>
                <li>To send promotional emails (only with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">4. Sharing Your Information</h2>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Payment Processors:</strong> To process transactions securely (Stripe, PayPal, Apple Pay, Google Pay, UnionPay)</li>
                <li><strong>Shipping Partners:</strong> To deliver your orders</li>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our website and business</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">5. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">6. Your Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
               <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
               <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
             </ul>
           </section>

           <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">7. International Transfers</h2>
              <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with applicable laws.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">8. Children's Privacy</h2>
              <p>Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this policy periodically for any changes.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-ocean-blue mb-3">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or how we handle your personal information, please contact us at:</p>
              <div className="bg-gray-50 rounded-xl p-4 mt-3">
                <p className="text-sm font-sans"><strong>Email:</strong> privacy@ecomafolapeace.com</p>
               <p className="text-sm font-sans"><strong>Address:</strong> EcoMafola Peace, Apia, Samoa</p>
              </div>
            </section>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link to="/" className="inline-block text-ocean-blue hover:text-tropical-green text-sm font-sans font-medium">← Back to Home</Link>
         </div>
       </div>
     </div>
   </div>
  )
}
