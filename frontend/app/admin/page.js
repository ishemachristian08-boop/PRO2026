'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  PhotoIcon,
  CogIcon,
  ChartBarIcon,
  UsersIcon,
  PlusIcon,
  ArrowRightIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import apiClient from '../../lib/api'

const adminFeatures = [
  {
    title: 'Student Management',
    description: 'Manage student records, admissions, and academic progress',
    icon: AcademicCapIcon,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    href: '/admin/students',
  },
  {
    title: 'Teacher Management',
    description: 'Manage teacher profiles, schedules, and performance',
    icon: UsersIcon,
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    href: '/admin/teachers',
  },
  {
    title: 'Announcements',
    description: 'Create and manage school announcements and news',
    icon: DocumentTextIcon,
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    href: '/admin/announcements',
  },
  {
    title: 'Events Management',
    description: 'Organize and manage school events and activities',
    icon: CalendarIcon,
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    href: '/admin/events',
  },
  {
    title: 'Gallery',
    description: 'Manage photo galleries and school memories',
    icon: PhotoIcon,
    color: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    href: '/admin/gallery',
  },
  {
    title: 'System Settings',
    description: 'Configure school settings and preferences',
    icon: CogIcon,
    color: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    href: '/admin/settings',
  }
]

export default function AdminDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [stats, setStats] = useState({
    students: '—',
    teachers: '—',
    announcements: '—',
    events: '—',
  })

  useEffect(() => {
    setIsLoaded(true)
    // Try to fetch live stats from backend
    const fetchStats = async () => {
      try {
        const [studentsRes, teachersRes, announcementsRes, eventsRes] = await Promise.allSettled([
          apiClient.students.getAll(),
          apiClient.teachers.getAll(),
          apiClient.announcements.getAll(),
          apiClient.events.getUpcoming(),
        ])
        setStats({
          students: studentsRes.status === 'fulfilled' ? (studentsRes.value?.data?.length ?? '—') : '—',
          teachers: teachersRes.status === 'fulfilled' ? (teachersRes.value?.data?.length ?? '—') : '—',
          announcements: announcementsRes.status === 'fulfilled' ? (announcementsRes.value?.data?.length ?? '—') : '—',
          events: eventsRes.status === 'fulfilled' ? (eventsRes.value?.data?.length ?? '—') : '—',
        })
      } catch {
        // Stats remain as '—' if backend not connected
      }
    }
    fetchStats()
  }, [])

  const quickStats = [
    { label: 'Total Students', value: stats.students, icon: AcademicCapIcon, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Teachers', value: stats.teachers, icon: UsersIcon, color: 'from-green-500 to-green-600' },
    { label: 'Announcements', value: stats.announcements, icon: DocumentTextIcon, color: 'from-purple-500 to-purple-600' },
    { label: 'Upcoming Events', value: stats.events, icon: CalendarIcon, color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-primary-100 shadow-sm flex-shrink-0">
                <Image
                  src="/nca logo.png"
                  alt="NCA Logo"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm">NYABIHU CHRISTIAN ACADEMY</p>
              </div>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">View Website</span>
              </Link>
              <Link
                href="/admin/reports"
                className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                <ChartBarIcon className="w-4 h-4" />
                Reports
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <CogIcon className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-nca transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">School Management</h2>
            <p className="text-gray-600 mt-1">Access all the tools you need to manage your school effectively</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link href={feature.href} className="block group">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-nca transition-all duration-300 p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Quick Actions */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <Link href="/admin/reports" className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1">
                View All Reports <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/admin/students" className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300 group">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Add New Student</h4>
                  <p className="text-sm text-gray-600">Register a new student</p>
                </div>
              </Link>

              <Link href="/admin/announcements" className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-300 group">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Create Announcement</h4>
                  <p className="text-sm text-gray-600">Post a new announcement</p>
                </div>
              </Link>

              <Link href="/admin/events" className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-300 group">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Add Event</h4>
                  <p className="text-sm text-gray-600">Schedule a new event</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} NYABIHU CHRISTIAN ACADEMY. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-gray-700 transition-colors">
                Support
              </Link>
              <Link href="/" className="hover:text-gray-700 transition-colors">
                View Website
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
