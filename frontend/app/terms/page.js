'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the NYABIHU CHRISTIAN ACADEMY website and its services, you agree 
                to be bound by these Terms of Service. If you do not agree to these terms, please do not 
                use our services.
              </p>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">2. Use of Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You agree to use our services only for lawful purposes and in accordance with these terms. You must not:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Use the service in any way that violates applicable laws or regulations</li>
                <li>Transmit any unsolicited or unauthorized advertising material</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">3. Student Portal</h2>
              <p className="text-gray-700 leading-relaxed">
                Access to the Student Portal is restricted to registered students and their authorized 
                guardians. You are responsible for maintaining the confidentiality of your login credentials 
                and for all activities that occur under your account.
              </p>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">4. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content on this website, including text, graphics, logos, and images, is the property 
                of NYABIHU CHRISTIAN ACADEMY and is protected by applicable intellectual property laws. 
                You may not reproduce or distribute any content without prior written permission.
              </p>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">5. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-700">
                <p>📧 Email: <a href="mailto:info@nca.rw" className="text-primary-600 hover:underline">info@nca.rw</a></p>
                <p>📞 Phone: <a href="tel:+250788000000" className="text-primary-600 hover:underline">+250 788 000 000</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
