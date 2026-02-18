'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  UserGroupIcon,
  HeartIcon,
  ShieldCheckIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline'

// Components
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Qualified Teachers',
      description: 'Our dedicated team of experienced educators are committed to providing quality education in a nurturing environment.'
    },
    {
      icon: HeartIcon,
      title: 'Strong Christian Foundation',
      description: 'We integrate Christian values and teachings into our curriculum, fostering spiritual growth alongside academic excellence.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Safe Learning Environment',
      description: 'Our campus provides a secure and supportive atmosphere where children can learn and grow with confidence.'
    },
    {
      icon: UserGroupIcon,
      title: 'Modern Teaching Methods',
      description: 'We utilize innovative teaching approaches and technology to engage students and enhance their learning experience.'
    }
  ]

  const stats = [
    { label: 'Happy Students', value: '200+', icon: StarIcon },
    { label: 'Qualified Teachers', value: '20+', icon: AcademicCapIcon },
    { label: 'Years of Excellence', value: '13+', icon: CalendarIcon },
    { label: 'Christian Values', value: '100%', icon: HeartIcon }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-gold-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gold-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-primary-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex justify-center mb-6"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden bg-white shadow-nca-lg border-4 border-white">
                <Image
                  src="/nca logo.png"
                  alt="NYABIHU CHRISTIAN ACADEMY Logo"
                  width={112}
                  height={112}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </motion.div>

            {/* School Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-900 mb-4">
              NYABIHU
              <br />
              <span className="text-gradient">CHRISTIAN ACADEMY</span>
            </h1>

            {/* Motto */}
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 font-medium"
            >
              Generate a Child, Transform Generation
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="text-base sm:text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Excellence in Christian Education for Nursery and Primary levels in Nyabihu District, Rwanda. 
              We provide a nurturing environment where children grow academically, spiritually, and socially.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/admissions" className="btn-primary text-lg px-8 py-4">
                Apply Now
              </Link>
              <Link href="/academics" className="btn-outline text-lg px-8 py-4">
                Explore Our Programs
              </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
              className="mt-16 animate-bounce"
            >
              <svg className="w-6 h-6 mx-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-500 to-transparent opacity-10"></div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">About Our School</h2>
            <p className="section-subtitle">
              Committed to providing quality Christian education that nurtures the whole child
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-xl shadow-nca">
                <h3 className="text-2xl font-bold text-primary-900 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide quality Christian education that develops the intellectual, spiritual, 
                  physical, and social potential of each child in a safe and nurturing environment.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-nca">
                <h3 className="text-2xl font-bold text-primary-900 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To be a leading Christian school that produces responsible, knowledgeable, 
                  and God-fearing citizens who contribute positively to society.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-nca">
                <h3 className="text-2xl font-bold text-primary-900 mb-4">Our Values</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Christian faith and moral integrity</li>
                  <li>• Academic excellence</li>
                  <li>• Respect and discipline</li>
                  <li>• Community service</li>
                  <li>• Holistic development</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* School Logo / Branding */}
              <div className="bg-gradient-to-br from-primary-100 to-gold-100 rounded-xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-white shadow-nca-lg mx-auto mb-6 border-4 border-primary-200">
                    <Image
                      src="/nca logo.png"
                      alt="NYABIHU CHRISTIAN ACADEMY"
                      width={160}
                      height={160}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-2">NYABIHU CHRISTIAN ACADEMY</h3>
                  <p className="text-primary-700 font-medium italic">"Generate a Child, Transform Generation"</p>
                  <p className="text-gray-600 text-sm mt-2">Nyabihu District, Rwanda</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Why Choose NCA</h2>
            <p className="section-subtitle">
              We provide an exceptional learning environment that prepares children for success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="feature-card hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-gold-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-8"
              >
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Give your child the gift of quality Christian education. 
              Contact us today to learn more about our programs and admission process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admissions" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                Start Application
              </Link>
              <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
