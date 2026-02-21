'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../../../lib/auth'
import apiClient from '../../../lib/api'
import {
  ArrowLeftIcon,
  MegaphoneIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

export default function NewAnnouncementPage() {
  const router = useRouter()
  const { user, isAdmin, isTeacher, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium',
    audience: ['All'],
    expiryDate: ''
  })

  const categories = ['General', 'Academic', 'Events', 'News', 'Important']
  const priorities = ['Low', 'Medium', 'High', 'Urgent']
  const audiences = ['All', 'Parents', 'Students', 'Teachers', 'Nursery', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6']

  useEffect(() => {
    if (!authLoading && (!user || (!isAdmin && !isTeacher))) {
      router.push('/login')
    }
  }, [user, authLoading, isAdmin, isTeacher, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAudienceChange = (audience) => {
    setFormData(prev => {
      if (audience === 'All') {
        return { ...prev, audience: ['All'] }
      }
      
      const newAudience = prev.audience.includes(audience)
        ? prev.audience.filter(a => a !== audience)
        : [...prev.audience.filter(a => a !== 'All'), audience]
      
      return { ...prev, audience: newAudience }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submissionData = {
        ...formData,
        expiryDate: formData.expiryDate || null
      }

      const response = await apiClient.announcements.create(submissionData)
      
      if (response.success) {
        alert('Announcement created successfully!')
        router.push('/admin/announcements')
      } else {
        setError(response.message || 'Failed to create announcement')
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      setError(error.message || 'Failed to create announcement')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Add New Announcement - Admin Dashboard</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/announcements"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Announcements
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Announcement</h1>
          <p className="text-gray-600 mt-1">Create a new announcement for parents and students</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Content */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MegaphoneIcon className="w-5 h-5 mr-2" />
              Announcement Content
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter announcement content"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Audience */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <EyeIcon className="w-5 h-5 mr-2" />
              Target Audience
            </h2>
            
            <div className="flex flex-wrap gap-3">
              {audiences.map(audience => (
                <label
                  key={audience}
                  className={`inline-flex items-center px-3 py-2 rounded-lg cursor-pointer border transition-colors ${
                    formData.audience.includes(audience)
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.audience.includes(audience)}
                    onChange={() => handleAudienceChange(audience)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{audience}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="p-6 bg-gray-50 flex justify-end space-x-4">
            <Link
              href="/admin/announcements"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
