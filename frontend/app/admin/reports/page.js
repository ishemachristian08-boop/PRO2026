'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChartBarIcon,
  AcademicCapIcon,
  UsersIcon,
  MegaphoneIcon,
  CalendarIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import apiClient from '@lib/api'

export default function AdminReportsPage() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    announcements: 0,
    events: 0,
    galleries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, teachersRes, announcementsRes, eventsRes, galleriesRes] = await Promise.allSettled([
          apiClient.students.getAll(),
          apiClient.teachers.getAll(),
          apiClient.announcements.getAll(),
          apiClient.events.getAll(),
          apiClient.gallery.getAll(),
        ])

        setStats({
          students: studentsRes.status === 'fulfilled' ? (studentsRes.value?.data?.length || 0) : 0,
          teachers: teachersRes.status === 'fulfilled' ? (teachersRes.value?.data?.length || 0) : 0,
          announcements: announcementsRes.status === 'fulfilled' ? (announcementsRes.value?.data?.length || 0) : 0,
          events: eventsRes.status === 'fulfilled' ? (eventsRes.value?.data?.length || 0) : 0,
          galleries: galleriesRes.status === 'fulfilled' ? (galleriesRes.value?.data?.length || 0) : 0,
        })
      } catch (err) {
        // Stats remain at 0 if backend not connected
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const reportCards = [
    { label: 'Total Students', value: stats.students, icon: AcademicCapIcon, color: 'from-blue-500 to-blue-600', href: '/admin/students' },
    { label: 'Active Teachers', value: stats.teachers, icon: UsersIcon, color: 'from-green-500 to-green-600', href: '/admin/teachers' },
    { label: 'Announcements', value: stats.announcements, icon: MegaphoneIcon, color: 'from-purple-500 to-purple-600', href: '/admin/announcements' },
    { label: 'Events', value: stats.events, icon: CalendarIcon, color: 'from-orange-500 to-orange-600', href: '/admin/events' },
    { label: 'Gallery Albums', value: stats.galleries, icon: PhotoIcon, color: 'from-pink-500 to-pink-600', href: '/admin/gallery' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-primary-600 transition-colors">
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 text-sm mt-1">Overview of school data and statistics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reportCards.map((card) => (
                <Link key={card.label} href={card.href} className="block">
                  <div className="bg-white rounded-xl shadow-nca p-6 hover:shadow-nca-lg transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">{card.value}</span>
                    </div>
                    <p className="text-gray-600 font-medium">{card.label}</p>
                    <p className="text-primary-500 text-sm mt-1 group-hover:underline">View details →</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Summary Table */}
            <div className="bg-white rounded-xl shadow-nca p-6">
              <div className="flex items-center gap-3 mb-6">
                <ChartBarIcon className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Summary Report</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Count</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportCards.map((card) => (
                      <tr key={card.label} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-800 font-medium">{card.label}</td>
                        <td className="py-3 px-4 text-right text-gray-900 font-bold">{card.value}</td>
                        <td className="py-3 px-4 text-right">
                          <Link href={card.href} className="text-primary-600 hover:text-primary-700 font-medium text-xs">
                            Manage →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 font-bold text-gray-900">Total Records</td>
                      <td className="py-3 px-4 text-right font-bold text-primary-600">
                        {Object.values(stats).reduce((a, b) => a + b, 0)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <strong>Note:</strong> These statistics are fetched live from the database. Connect the backend to see real data.
            </div>
          </>
        )}
      </main>
    </div>
  )
}
