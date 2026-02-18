'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <div className="space-y-8">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed">
                NYABIHU CHRISTIAN ACADEMY collects personal information that you voluntarily provide when 
                registering students, contacting us, or using our online portals. This may include names, 
                email addresses, phone numbers, and academic records.
              </p>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Process student admissions and registrations</li>
                <li>Communicate with parents and guardians about school matters</li>
                <li>Maintain academic records and attendance</li>
                <li>Send school announcements and event notifications</li>
                <li>Improve our educational services</li>
              </ul>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">3. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. All data is stored securely 
                and access is restricted to authorized school personnel only.
              </p>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">4. Data Sharing</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to outside parties 
                without your consent, except as required by law or for legitimate educational purposes 
                (e.g., reporting to the Rwanda Education Board).
              </p>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">5. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-700">
                <p>📧 Email: <a href="mailto:info@nca.rw" className="text-primary-600 hover:underline">info@nca.rw</a></p>
                <p>📞 Phone: <a href="tel:+250788000000" className="text-primary-600 hover:underline">+250 788 000 000</a></p>
                <p>📍 Address: Nyabihu District, Rwanda</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
