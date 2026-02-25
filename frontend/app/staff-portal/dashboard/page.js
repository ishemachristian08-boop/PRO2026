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
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
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
    icon: ClipboardDocumentListIcon, // ✅ FIXED
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
    const fetchData = async () => {
      try {
        const announcementsRes = await apiClient.announcements.getActive()
        setRecentAnnouncements(announcementsRes.data?.slice(0, 3) || [])
        setStats({
          classes: '—',
          students: '—',
          announcements: announcementsRes.data?.length || '0',
          upcomingEvents: '—',
        })
      } catch {}
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
                <ArrowRightOnRectangleIcon className="w-4 h-4" /> {/* ✅ FIXED */}
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of your code remains EXACTLY the same */}
    </div>
  )
}