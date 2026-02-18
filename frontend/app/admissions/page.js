'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Admissions() {
  const [activeTab, setActiveTab] = useState('process')

  const admissionProcess = [
    {
      step: 1,
      title: 'Initial Inquiry',
      description: 'Contact us to learn more about our programs and schedule a campus tour.',
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      step: 2,
      title: 'Application Submission',
      description: 'Complete and submit the online application form with required documents.',
      icon: DocumentTextIcon,
      color: 'bg-green-500'
    },
    {
      step: 3,
      title: 'Assessment & Interview',
      description: 'Student assessment and parent interview to understand the child\'s needs.',
      icon: AcademicCapIcon,
      color: 'bg-purple-500'
    },
    {
      step: 4,
      title: 'Acceptance Decision',
      description: 'Receive admission decision and enrollment package.',
      icon: CheckCircleIcon,
      color: 'bg-orange-500'
    },
    {
      step: 5,
      title: 'Registration Complete',
      description: 'Complete registration and prepare for the first day of school.',
      icon: ShieldCheckIcon,
      color: 'bg-red-500'
    }
  ]

  const requirements = {
    nursery: [
      'Completed application form',
      'Birth certificate copy',
      'Health certificate',
      '4 passport photos',
      'Parent/guardian ID copy',
      'Registration fee payment'
    ],
    primary: [
      'Completed application form',
      'Birth certificate copy',
      'Previous school report card',
      'Transfer letter (if applicable)',
      'Health certificate',
      '4 passport photos',
      'Parent/guardian ID copy',
      'Registration fee payment'
    ]
  }

  const fees = {
    nursery: {
      registration: 'RWF 50,000',
      tuition: 'RWF 150,000 per term',
      materials: 'RWF 30,000 per term',
      total: 'RWF 230,000 per term'
    },
    primary: {
      registration: 'RWF 75,000',
      tuition: 'RWF 200,000 per term',
      materials: 'RWF 40,000 per term',
      total: 'RWF 315,000 per term'
    }
  }

  const documents = [
    'Completed application form',
    'Birth certificate (certified copy)',
    'Health certificate from registered medical practitioner',
    '4 recent passport-sized photographs',
    'Parent/guardian national ID or passport copy',
    'Previous school records (for transfer students)',
    'Registration fee payment receipt'
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="absolute inset-0 hero-pattern"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6">
              Join Our Learning Community
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover excellence in Christian education. We welcome students from Nursery through Primary 6, 
              providing a nurturing environment where every child can thrive academically, spiritually, and socially.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#apply-now" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                Start Application
              </a>
              <a href="/contact" className="border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                Contact Admissions
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Admission Process</h2>
            <p className="section-subtitle">
              Follow these simple steps to enroll your child at NYABIHU CHRISTIAN ACADEMY
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {admissionProcess.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-nca p-8 text-center hover:shadow-nca-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Admission Information</h2>
            <p className="section-subtitle">
              Learn more about our programs, requirements, and fees
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'process', label: 'Admission Process', icon: ClockIcon },
              { id: 'requirements', label: 'Requirements', icon: CheckCircleIcon },
              { id: 'fees', label: 'Fees & Payment', icon: DocumentTextIcon },
              { id: 'documents', label: 'Required Documents', icon: UsersIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-nca'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 rounded-xl p-8">
            {activeTab === 'process' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Nursery Program</h3>
                    <p className="text-gray-600 mb-4">
                      Our nursery program is designed for children aged 3-5 years, focusing on early childhood 
                      development through play-based learning and structured activities.
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Age requirement: 3-5 years</li>
                      <li>• Small class sizes for personalized attention</li>
                      <li>• Christian values integration</li>
                      <li>• Developmental milestone tracking</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Primary Program</h3>
                    <p className="text-gray-600 mb-4">
                      Our primary program covers P1-P6, following the national curriculum while emphasizing 
                      Christian values and character development.
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Age requirement: 6-12 years</li>
                      <li>• CBC curriculum implementation</li>
                      <li>• Qualified and dedicated teachers</li>
                      <li>• Extracurricular activities included</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'requirements' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Nursery Requirements</h3>
                    <ul className="space-y-3 text-gray-700">
                      {requirements.nursery.map((req, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Primary Requirements</h3>
                    <ul className="space-y-3 text-gray-700">
                      {requirements.primary.map((req, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'fees' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Nursery Fees</h3>
                    <div className="space-y-3 text-gray-700">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Registration Fee (One-time):</span>
                        <span className="font-semibold">{fees.nursery.registration}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Tuition Fee (per term):</span>
                        <span className="font-semibold">{fees.nursery.tuition}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Materials Fee (per term):</span>
                        <span className="font-semibold">{fees.nursery.materials}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-bold">Total per Term:</span>
                        <span className="font-bold text-primary-600">{fees.nursery.total}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Primary Fees</h3>
                    <div className="space-y-3 text-gray-700">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Registration Fee (One-time):</span>
                        <span className="font-semibold">{fees.primary.registration}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Tuition Fee (per term):</span>
                        <span className="font-semibold">{fees.primary.tuition}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Materials Fee (per term):</span>
                        <span className="font-semibold">{fees.primary.materials}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-bold">Total per Term:</span>
                        <span className="font-bold text-primary-600">{fees.primary.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">Payment Information</h4>
                  <p className="text-yellow-700">
                    Payment can be made via bank transfer or mobile money. Term fees are payable 
                    at the beginning of each term. We offer flexible payment plans for families 
                    who need assistance.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Required Documents</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    {documents.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Important Notes</h4>
                  <ul className="text-blue-700 space-y-2">
                    <li>• All documents must be original or certified copies</li>
                    <li>• Birth certificate must show full name and date of birth</li>
                    <li>• Health certificate should be recent (within 3 months)</li>
                    <li>• Application is not complete without all required documents</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Apply Now Section */}
      <section id="apply-now" className="py-20 bg-gradient-to-r from-primary-500 to-gold-400 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Family?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Take the first step towards providing your child with quality Christian education. 
              Our admissions team is ready to guide you through the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-primary-500 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                Request Application Form
              </Link>
              <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-500 font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                Contact Admissions Office
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">+500</div>
                <div className="text-sm opacity-80">Happy Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold">+25</div>
                <div className="text-sm opacity-80">Qualified Teachers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm opacity-80">Years of Excellence</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}