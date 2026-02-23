'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  HomeIcon,
  LogoutIcon,
  ClipboardListIcon,
  BookOpenIcon,
  BellIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@lib/auth'
import apiClient from '@lib/api'

const staffFeatures = [
  {
    title: 'My Classes',
    description: 'View and manage your assigned classes and students',
    icon: AcademicCapIcon,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    href: '/staff-portal/classes',
  },
  {
    title: 'Student Records',
    description: 'Access and update student information and grades',
    icon: UserGroupIcon,
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    href: '/staff-portal/students',
  },
  {
    title: 'Announcements',
    description: 'View school announcements and updates',
    icon: DocumentTextIcon,
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    href: '/staff-portal/announcements',
  },
  {
    title: 'School Calendar',
    description: 'View upcoming events and school schedule',
    icon: CalendarIcon,
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    href: '/staff-portal/calendar',
  },
  {
    title: 'Attendance',
    description: 'Track and manage student attendance',
    icon: ClipboardListIcon,
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    href: '/staff-portal/attendance',
  },
  {
    title: 'Grade Book',
    description: 'Record and manage student grades',
    icon: BookOpenIcon,
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50',
    href: '/staff-portal/grades',
  },
]

export default function StaffDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [stats, setStats] = useState({
    classes: '—',
    students: '—',
    announcements: '—',
    upcomingEvents: '—',
  })
  const [recentAnnouncements, setRecentAnnouncements] = useState([])
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
    // Fetch stats from backend
    const fetchData = async () => {
      try {
        // For now, we'll just fetch announcements to show
        const announcementsRes = await apiClient.announcements.getActive()
        setRecentAnnouncements(announcementsRes.data?.slice(0, 3) || [])
        setStats({
          classes: '—',
          students: '—',
          announcements: announcementsRes.data?.length || '0',
          upcomingEvents: '—',
        })
      } catch {
        // Stats remain as '—' if backend not connected
      }
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/staff-portal')
  }

  const quickStats = [
    { label: 'My Classes', value: stats.classes, icon: AcademicCapIcon, color: 'from-blue-500 to-blue-600' },
    { label: 'My Students', value: stats.students, icon: UserGroupIcon, color: 'from-green-500 to-green-600' },
    { label: 'Announcements', value: stats.announcements, icon: DocumentTextIcon, color: 'from-purple-500 to-purple-600' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: CalendarIcon, color: 'from-orange-500 to-orange-600' },
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
                <h1 className="text-xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-gray-500 text-sm">NYABIHU CHRISTIAN ACADEMY</p>
              </div>
            </div>

            {/* User Info + Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {user?.profile?.firstName?.[0] || 'S'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <LogoutIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
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
            <h2 className="text-2xl font-bold text-gray-900">My Tools</h2>
            <p className="text-gray-600 mt-1">Access your teaching tools and resources</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffFeatures.map((feature, index) => (
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

      {/* Recent Announcements */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BellIcon className="w-5 h-5 text-primary-500" />
                Recent Announcements
              </h3>
              <Link href="/staff-portal/announcements" className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1">
                View All
              </Link>
            </div>
            
            {recentAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {recentAnnouncements.map((announcement, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full ${announcement.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}>
                            {announcement.priority || 'Normal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No announcements at this time</p>
              </div>
            )}
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
              <Link href="/" className="hover:text-gray-700 transition-colors">
                View Website
              </Link>
              <Link href="/contact" className="hover:text-gray-700 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
