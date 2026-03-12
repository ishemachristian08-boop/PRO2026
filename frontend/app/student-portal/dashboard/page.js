'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  UserGroupIcon,
  BellIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { onAuthChange, logout } from '@lib/firebaseAuth'

export default function StudentDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    gpa: '—',
    attendance: '—',
    assignments: '—',
    announcements: '—',
  })
  const [grades, setGrades] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [schedule, setSchedule] = useState([])
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser(user)
        fetchStudentData()
      } else {
        router.push('/student-portal')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const fetchStudentData = async () => {
    // In a real app, fetch from API
    // For now, set demo data
    setGrades([
      { subject: 'Mathematics', score: 85, grade: 'A', trend: 'up' },
      { subject: 'English', score: 78, grade: 'B+', trend: 'stable' },
      { subject: 'Science', score: 92, grade: 'A+', trend: 'up' },
      { subject: 'Social Studies', score: 88, grade: 'A', trend: 'up' },
      { subject: 'Religious Education', score: 95, grade: 'A+', trend: 'up' },
    ])
    
    setAnnouncements([
      { id: 1, title: 'End of Term Exams', date: '2026-03-15', type: 'important' },
      { id: 2, title: 'Parent-Teacher Meeting', date: '2026-03-20', type: 'event' },
      { id: 3, title: 'Sports Day Announcement', date: '2026-03-25', type: 'event' },
    ])
    
    setSchedule([
      { time: '7:30 - 8:00', subject: 'Morning Assembly', room: 'Main Hall' },
      { time: '8:00 - 8:45', subject: 'Mathematics', room: 'Room 1' },
      { time: '8:45 - 9:30', subject: 'English', room: 'Room 2' },
      { time: '9:30 - 10:00', subject: 'Break', room: 'Playground' },
      { time: '10:00 - 10:45', subject: 'Science', room: 'Lab' },
      { time: '10:45 - 11:30', subject: 'Social Studies', room: 'Room 3' },
    ])
    
    setStats({
      gpa: '3.8',
      attendance: '96%',
      assignments: '12',
      announcements: '3',
    })
  }

  const handleLogout = async () => {
    await logout()
    router.push('/student-portal')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const quickStats = [
    { label: 'GPA', value: stats.gpa, icon: ChartBarIcon, color: 'from-blue-500 to-blue-600' },
    { label: 'Attendance', value: stats.attendance, icon: CalendarIcon, color: 'from-green-500 to-green-600' },
    { label: 'Assignments', value: stats.assignments, icon: BookOpenIcon, color: 'from-purple-500 to-purple-600' },
    { label: 'Notices', value: stats.announcements, icon: BellIcon, color: 'from-orange-500 to-orange-600' },
  ]

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800'
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800'
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-gray-500 text-sm">NYABIHU CHRISTIAN ACADEMY</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {user?.displayName?.[0] || user?.email?.[0] || 'S'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.displayName || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.displayName || 'Student'}! 👋
          </h2>
          <p className="text-gray-600 mt-1">
            Here's your academic overview for today
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grades Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-primary-500" />
                  Current Grades
                </h3>
                <Link
                  href="/student-portal/grades"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {grades.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <BookOpenIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.subject}</p>
                          <p className="text-sm text-gray-500">Score: {item.score}%</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(item.grade)}`}>
                        {item.grade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary-500" />
                  Today's Schedule
                </h3>
                <Link
                  href="/student-portal/schedule"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Full Schedule →
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {schedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-20 text-sm font-medium text-gray-500">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.subject}</p>
                        <p className="text-sm text-gray-500">{item.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-primary-500" />
                  Announcements
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-gray-900 text-sm">{announcement.title}</p>
                      {announcement.type === 'important' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{announcement.date}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <Link
                  href="/student-portal/announcements"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All Announcements →
                </Link>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/student-portal/assignments"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BookOpenIcon className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-gray-900">View Assignments</span>
                </Link>
                <Link
                  href="/student-portal/attendance"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <CalendarIcon className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-900">Attendance Record</span>
                </Link>
                <Link
                  href="/student-portal/resources"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <UserGroupIcon className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-gray-900">Study Resources</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
