'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import apiClient from '@lib/api'

const placeholderPhotos = [
  { title: 'Classroom Learning', category: 'Academics', color: 'from-blue-200 to-blue-300' },
  { title: 'Sports Day', category: 'Co-curricular', color: 'from-green-200 to-green-300' },
  { title: 'Prayer & Worship', category: 'Christian Life', color: 'from-purple-200 to-purple-300' },
  { title: 'Science Activity', category: 'Academics', color: 'from-yellow-200 to-yellow-300' },
  { title: 'Parents Meeting', category: 'Community', color: 'from-pink-200 to-pink-300' },
  { title: 'Graduation Ceremony', category: 'Events', color: 'from-orange-200 to-orange-300' },
]

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const data = await apiClient.gallery.getPublic()
        if (data && data.data && data.data.length > 0) {
          setGalleries(data.data)
        }
      } catch (err) {
        // Backend not connected — use placeholder data
      } finally {
        setLoading(false)
      }
    }
    fetchGalleries()
  }, [])

  const categories = ['All', 'Academics', 'Co-curricular', 'Christian Life', 'Community', 'Events']

  const filteredPhotos = activeCategory === 'All'
    ? placeholderPhotos
    : placeholderPhotos.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            School Gallery
          </motion.h1>
          <p className="text-lg text-gray-700">A glimpse into learning, faith, and school life at NCA.</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-primary-500 text-white shadow-nca'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="card overflow-hidden group cursor-pointer"
                >
                  <div className={`h-52 bg-gradient-to-br ${item.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="text-center text-white opacity-60">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium">Photo Coming Soon</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-primary-900 text-lg">{item.title}</h3>
                    <span className="inline-block mt-2 text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                      {item.category}
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Upload notice for admin */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-blue-800 font-medium mb-2">📸 Want to add real photos?</p>
            <p className="text-blue-700 text-sm">
              School administrators can upload photos through the{' '}
              <a href="/admin" className="underline font-medium hover:text-blue-900">Admin Dashboard → Gallery</a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
