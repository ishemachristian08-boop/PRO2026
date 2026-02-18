'use client'

import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            About NYABIHU CHRISTIAN ACADEMY
          </motion.h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            We are a Christian-based private school in Nyabihu District, Rwanda, offering Nursery and Primary education (P1–P6).
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {[
            ['Mission', 'To provide quality Christian education that shapes learners intellectually, spiritually, and socially.'],
            ['Vision', 'To raise responsible, competent, and God-fearing citizens for Rwanda and beyond.'],
            ['Christian Values', 'Faith, integrity, discipline, service, respect, and love guide everything we do.']
          ].map(([title, text]) => (
            <div key={title} className="card p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3">{title}</h3>
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Our History</h2>
            <p className="section-subtitle">A legacy of Christian education in Nyabihu District</p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <div className="card p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                NYABIHU CHRISTIAN ACADEMY was founded with a vision to provide quality, Christ-centered education 
                to children in Nyabihu District, Rwanda. Over the years, we have grown into a thriving school 
                community that serves hundreds of students from Nursery through Primary 6.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our school follows the Rwanda Competence-Based Curriculum (CBC) while integrating strong 
                Christian values into every aspect of school life. We believe that education is not just 
                about academic achievement, but about developing the whole child — intellectually, 
                spiritually, physically, and socially.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, NCA stands as a beacon of excellence in Christian education, with a dedicated team 
                of qualified teachers, modern facilities, and a supportive community of parents and 
                stakeholders committed to the school's motto: <em>"Generate a Child, Transform Generation."</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">School Leadership</h2>
            <p className="section-subtitle">Dedicated leaders guiding our school community</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { role: 'Head Teacher', name: 'School Director', desc: 'Providing visionary leadership and academic oversight for the entire school.' },
              { role: 'Deputy Head Teacher', name: 'Deputy Director', desc: 'Supporting school operations and ensuring quality education delivery.' },
              { role: 'Academic Coordinator', name: 'Academic Lead', desc: 'Overseeing curriculum implementation and teacher professional development.' },
            ].map((leader) => (
              <div key={leader.role} className="card p-6 text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">{leader.name[0]}</span>
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1">{leader.name}</h3>
                <p className="text-sm text-gold-600 font-medium mb-3">{leader.role}</p>
                <p className="text-gray-600 text-sm">{leader.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
