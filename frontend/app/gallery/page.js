'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getAllImages, GALLERY_CATEGORIES, CATEGORY_INFO } from '@lib/firebaseGallery'

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await getAllImages()
        if (result.success && result.images.length > 0) {
          setImages(result.images)
        }
      } catch (err) {
        console.error('Error fetching images:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  // Filter images by category
  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => (img.category || 'Academics') === activeCategory)

  // Group images by category for category cards
  const imagesByCategory = GALLERY_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = images.filter(img => (img.category || 'Academics') === cat)
    return acc
  }, {})

  const openImageModal = (image, index) => {
    setSelectedImage(image)
    setCurrentImageIndex(index)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  const nextImage = (e) => {
    e?.stopPropagation()
    const nextIndex = (currentImageIndex + 1) % filteredImages.length
    setCurrentImageIndex(nextIndex)
    setSelectedImage(filteredImages[nextIndex])
  }

  const prevImage = (e) => {
    e?.stopPropagation()
    const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length
    setCurrentImageIndex(prevIndex)
    setSelectedImage(filteredImages[prevIndex])
  }

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      'Academics': 'bg-blue-500',
      'Co-curricular': 'bg-green-500',
      'Christian Life': 'bg-purple-500',
      'Community': 'bg-orange-500',
      'Events': 'bg-pink-500'
    }
    return colors[category] || 'bg-primary-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1E3A8A] via-primary-500 to-[#1e40af]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80"
          >
            Explore moments of learning, faith, and community at NCA
          </motion.p>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="sticky top-16 z-30 bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === 'All'
                  ? 'bg-[#1E3A8A] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {GALLERY_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category
                    ? 'bg-[#1E3A8A] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{CATEGORY_INFO[category]?.icon}</span>
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No images yet</h3>
              <p className="text-gray-500 mb-6">Check back later for photos from our school.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 inline-block">
                <p className="text-blue-800 font-medium">📸 School administrators can upload photos through the <a href="/admin" className="underline font-medium hover:text-blue-900">Admin Dashboard → Gallery</a>.</p>
              </div>
            </div>
          ) : activeCategory === 'All' ? (
            // Show category cards when "All" is selected
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GALLERY_CATEGORIES.map((category, catIndex) => {
                const categoryImages = imagesByCategory[category]
                const coverImage = categoryImages?.[0]?.imageUrl
                const count = categoryImages?.length || 0
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIndex * 0.1 }}
                    onClick={() => setActiveCategory(category)}
                    className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
                  >
                    {/* Category Cover Image */}
                    <div className="relative h-48 overflow-hidden">
                      {coverImage ? (
                        <Image
                          src={coverImage}
                          alt={category}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                          <span className="text-5xl">{CATEGORY_INFO[category]?.icon}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                      
                      {/* Category Badge */}
                      <div className={`absolute top-4 left-4 ${getCategoryColor(category)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                        {category}
                      </div>
                      
                      {/* Image Count */}
                      <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        {count} {count === 1 ? 'photo' : 'photos'}
                      </div>
                    </div>
                    
                    {/* Category Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-[#1E3A8A] transition-colors">
                        {category}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {CATEGORY_INFO[category]?.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            // Show filtered images grid
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode='wait'>
                {filteredImages.map((image, index) => (
                  <motion.article
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => openImageModal(image, index)}
                    className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={image.imageUrl}
                        alt={image.title || 'Gallery image'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                      {/* Category Badge */}
                      <div className={`absolute top-3 left-3 ${getCategoryColor(image.category || 'Academics')} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                        {image.category || 'Academics'}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg">{image.title || 'Untitled'}</h3>
                      {image.description && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{image.description}</p>
                      )}
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10"
              onClick={closeImageModal}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            {filteredImages.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {filteredImages.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title || 'Gallery image'}
                  width={1200}
                  height={800}
                  className="max-h-[80vh] w-full h-auto object-contain rounded-lg"
                />
              </div>
              <div className="mt-4 text-center">
                <div className={`inline-block ${getCategoryColor(selectedImage.category || 'Academics')} text-white px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                  {selectedImage.category || 'Academics'}
                </div>
                <h3 className="text-xl font-bold text-white">{selectedImage.title || 'Untitled'}</h3>
                {selectedImage.description && (
                  <p className="text-gray-300 mt-1">{selectedImage.description}</p>
                )}
                {filteredImages.length > 1 && (
                  <p className="text-gray-400 text-sm mt-2">
                    {currentImageIndex + 1} of {filteredImages.length}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
