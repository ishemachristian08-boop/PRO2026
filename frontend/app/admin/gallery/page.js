'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import apiClient from '@lib/api'

export default function AdminGalleryPage() {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', category: 'general', isPublic: true })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    try {
      const res = await apiClient.gallery.getAll()
      setGalleries(res.data || [])
    } catch (err) {
      setMessage('Could not load galleries. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      if (editItem) {
        await apiClient.gallery.update(editItem._id, form)
        setMessage('Gallery updated successfully.')
      } else {
        await apiClient.gallery.create(form)
        setMessage('Gallery created successfully.')
      }
      setShowForm(false)
      setEditItem(null)
      setForm({ title: '', description: '', category: 'general', isPublic: true })
      fetchGalleries()
    } catch (err) {
      setMessage(err.message || 'Failed to save gallery.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item) => {
    setEditItem(item)
    setForm({ title: item.title, description: item.description || '', category: item.category || 'general', isPublic: item.isPublic !== false })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return
    try {
      await apiClient.gallery.delete(id)
      setMessage('Gallery deleted.')
      fetchGalleries()
    } catch (err) {
      setMessage(err.message || 'Failed to delete.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-primary-600 transition-colors">
                ← Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-gray-600 text-sm mt-1">Manage photo galleries and school memories</p>
              </div>
            </div>
            <button
              onClick={() => { setShowForm(true); setEditItem(null); setForm({ title: '', description: '', category: 'general', isPublic: true }) }}
              className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              New Gallery
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
            {message}
          </div>
        )}

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-nca p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editItem ? 'Edit Gallery' : 'Create New Gallery'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Gallery title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                  placeholder="Gallery description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="academics">Academics</option>
                    <option value="sports">Sports</option>
                    <option value="events">Events</option>
                    <option value="christian-life">Christian Life</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={form.isPublic}
                    onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                    className="w-4 h-4 text-primary-600"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">Make Public</label>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                  {saving ? 'Saving...' : editItem ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditItem(null) }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-nca">
            <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No galleries yet.</p>
            <p className="text-gray-400 text-sm mt-1">Create your first gallery above.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-nca overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-primary-100 to-gold-100 flex items-center justify-center">
                  <PhotoIcon className="w-12 h-12 text-primary-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                      item.isPublic !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.isPublic !== false ? 'Public' : 'Private'}
                    </span>
                  </div>
                  {item.description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>}
                  <p className="text-gray-400 text-xs mb-3">{item.images?.length || 0} images · {item.category}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
