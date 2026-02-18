'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import apiClient from '../../lib/api'

const placeholderItems = [
  { type: 'Announcement', title: 'Term I Admission Ongoing', date: '2026-01-10', description: 'Applications for Term I are now open. Contact the admissions office for more information.' },
  { type: 'Event', title: 'Parents Fellowship Meeting', date: '2026-02-02', description: 'All parents are invited to the quarterly fellowship meeting at the school hall.' },
  { type: 'Event', title: 'Sports & Talent Day', date: '2026-02-20', description: 'Annual sports and talent showcase. Students will compete in various sports and perform.' },
  { type: 'Announcement', title: 'CBC Assessment Schedule Released', date: '2026-03-01', description: 'The Competence-Based Curriculum assessment schedule for Term I has been released.' },
]

export default function NewsPage() {
  const [items, setItems] = useState(placeholderItems)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsRes, eventsRes] = await Promise.all([
          apiClient.announcements.getActive(),
          apiClient.events.getUpcoming(),
        ])
        const combined = []
        if (announcementsRes?.data?.length) {
          announcementsRes.data.forEach(a => combined.push({ type: 'Announcement', title: a.title, date: a.createdAt?.slice(0, 10), description: a.content }))
        }
        if (eventsRes?.data?.length) {
          eventsRes.data.forEach(e => combined.push({ type: 'Event', title: e.title, date: e.startDate?.slice(0, 10), description: e.description }))
        }
        if (combined.length > 0) {
          setItems(combined)
        }
      } catch (err) {
        // Use placeholder data if backend not connected
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = activeFilter === 'All' ? items : items.filter(i => i.type === activeFilter)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            News & Events
          </motion.h1>
          <p className="text-lg text-gray-700">Stay updated with announcements, school activities, and important dates.</p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-3 justify-center">
          {['All', 'Announcement', 'Event'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === f
                  ? 'bg-primary-500 text-white shadow-nca'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No items found.</div>
          ) : (
            filtered.map((item, index) => (
              <motion.article
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className={`inline-block text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-2 ${
                      item.type === 'Announcement'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gold-100 text-gold-700'
                    }`}>
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold text-primary-900 mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">{item.date}</p>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
