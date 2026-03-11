'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@lib/auth'
import { getAllImages, uploadImage, addImageFromURL, updateImage, deleteImage, GALLERY_CATEGORIES } from '@lib/firebaseGallery'
import {
  ArrowLeftIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  LinkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function AdminGalleryPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadType, setUploadType] = useState('device') // 'device' or 'url'
  const [imageTitle, setImageTitle] = useState('')
  const [imageDescription, setImageDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Academics')
  const [editCategory, setEditCategory] = useState('Academics')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      window.location.href = '/login'
    }
  }, [user, authLoading])

  useEffect(() => {
    if (user && isAdmin()) {
      fetchImages()
    }
  }, [user])

  const fetchImages = async () => {
    setLoading(true)
    try {
      const result = await getAllImages()
      if (result.success) {
        setImages(result.images)
      }
    } catch (err) {
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!imageTitle.trim()) {
      alert('Please enter a title for the image')
      return
    }

    setUploading(true)
    try {
      let result
      if (uploadType === 'device' && selectedFile) {
        result = await uploadImage(selectedFile, imageTitle, imageDescription, selectedCategory)
      } else if (uploadType === 'url' && imageUrl.trim()) {
        result = await addImageFromURL(imageUrl, imageTitle, imageDescription, selectedCategory)
      } else {
        alert('Please select an image or enter a URL')
        setUploading(false)
        return
      }

      if (result.success) {
        alert('Image uploaded successfully!')
        setShowUploadModal(false)
        resetUploadForm()
        fetchImages()
      } else {
        alert('Failed to upload: ' + result.message)
      }
    } catch (error) {
      alert('Error uploading: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = async () => {
    if (!imageTitle.trim()) {
      alert('Please enter a title')
      return
    }

    try {
      const result = await updateImage(selectedImage.id, {
        title: imageTitle,
        description: imageDescription,
        category: editCategory
      })

      if (result.success) {
        alert('Image updated successfully!')
        setShowEditModal(false)
        setSelectedImage(null)
        fetchImages()
      } else {
        alert('Failed to update: ' + result.message)
      }
    } catch (error) {
      alert('Error updating: ' + error.message)
    }
  }

  const handleDelete = async (image) => {
    if (confirm(`Are you sure you want to delete "${image.title || 'this image'}"?`)) {
      try {
        const result = await deleteImage(image.id)
        if (result.success) {
          alert('Image deleted successfully!')
          fetchImages()
        } else {
          alert('Failed to delete: ' + result.message)
        }
      } catch (error) {
        alert('Error deleting: ' + error.message)
      }
    }
  }

  const openEditModal = (image) => {
    setSelectedImage(image)
    setImageTitle(image.title || '')
    setImageDescription(image.description || '')
    setEditCategory(image.category || 'Academics')
    setShowEditModal(true)
  }

  const resetUploadForm = () => {
    setImageTitle('')
    setImageDescription('')
    setImageUrl('')
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadType('device')
    setSelectedCategory('Academics')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user || !isAdmin()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="text-gray-600 mt-1">Manage your school gallery images</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Upload Image
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <PhotoIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No images yet</h3>
            <p className="text-gray-500 mb-6">Upload your first image to get started</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Upload First Image
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow overflow-hidden group"
              >
                <div className="relative h-48">
                  <Image
                    src={image.imageUrl}
                    alt={image.title || 'Gallery image'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(image)}
                      className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(image)}
                      className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{image.title || 'Untitled'}</h3>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      {image.category || 'Academics'}
                    </span>
                  </div>
                  {image.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{image.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Upload Image</h2>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Upload Type Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setUploadType('device')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                    uploadType === 'device' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                  Browse Device
                </button>
                <button
                  onClick={() => setUploadType('url')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                    uploadType === 'url' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <LinkIcon className="w-5 h-5 mr-2" />
                  From URL
                </button>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter image title"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter image description"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Device Upload */}
              {uploadType === 'device' && (
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div className="relative">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl(null)
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors"
                    >
                      <CloudArrowUpIcon className="w-10 h-10 mb-2" />
                      <span>Click to select image</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                    </button>
                  )}
                </div>
              )}

              {/* URL Upload */}
              {uploadType === 'url' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {imageUrl && (
                    <div className="mt-2">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          alert('Invalid image URL')
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Image</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <Image
                  src={selectedImage.imageUrl}
                  alt="Current"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
