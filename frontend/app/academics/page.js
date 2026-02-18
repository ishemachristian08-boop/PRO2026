'use client'

import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            Academics
          </motion.h1>
          <p className="text-lg text-gray-700">Nursery and Primary programs aligned with Rwanda CBC and strong Christian values.</p>
        </div>
      </section>

      {/* Programs */}
      <section id="nursery" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="text-2xl font-bold text-primary-900 mb-3">Nursery Program</h3>
            <p className="text-gray-700 mb-4">Child-centered early learning with literacy, numeracy, creativity, and social skills development.</p>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Age: 3–5 years</li>
              <li>• Play-based and structured learning</li>
              <li>• Christian values integration</li>
              <li>• Developmental milestone tracking</li>
              <li>• Small class sizes for personal attention</li>
            </ul>
          </div>
          <div id="primary" className="card p-6">
            <h3 className="text-2xl font-bold text-primary-900 mb-3">Primary Program (P1–P6)</h3>
            <p className="text-gray-700 mb-4">Competence-Based Curriculum, continuous assessment, and holistic growth in academics and character.</p>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Age: 6–12 years</li>
              <li>• Rwanda CBC curriculum</li>
              <li>• Qualified and dedicated teachers</li>
              <li>• Continuous assessment system</li>
              <li>• Extracurricular activities included</li>
            </ul>
          </div>
          <div id="curriculum" className="card p-6 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-900 mb-3">Curriculum Overview</h3>
            <p className="text-gray-700 mb-4">
              NCA follows the Rwanda Competence-Based Curriculum (CBC) as prescribed by the Rwanda Education Board (REB), 
              enriched with Christian values and character development programs.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {['Kinyarwanda', 'English', 'Mathematics', 'Science & Technology', 'Social Studies', 'Religious Education', 'Creative Arts', 'Physical Education', 'ICT'].map((subject) => (
                <div key={subject} className="bg-primary-50 rounded-lg px-4 py-2 text-primary-800 text-sm font-medium text-center">
                  {subject}
                </div>
              ))}
            </div>
          </div>
          <div id="co-curricular" className="card p-6 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-900 mb-3">Co-curricular Activities</h3>
            <p className="text-gray-700 mb-4">Sports, music, debates, Bible study, leadership clubs, and community service.</p>
            <div className="grid sm:grid-cols-4 gap-4 mt-4">
              {['Football', 'Volleyball', 'Athletics', 'Music & Choir', 'Bible Study', 'Debate Club', 'Leadership Club', 'Community Service'].map((activity) => (
                <div key={activity} className="bg-gold-50 rounded-lg px-4 py-2 text-gold-800 text-sm font-medium text-center">
                  {activity}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
