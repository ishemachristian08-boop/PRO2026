'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarIcon,
  PhotoIcon,
  CogIcon,
  ChartBarIcon,
  UsersIcon,
  ArrowRightIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import { loginWithEmail, loginWithGoogle, logout, onAuthChange } from '@lib/firebaseAuth'

const adminFeatures = [
  {
    title: 'Student Management',
    description: 'Manage student records, admissions, and academic progress',
    icon: AcademicCapIcon,
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-500/20',
    href: '/admin/students',
  },
  {
    title: 'Teacher Management',
    description: 'Manage teacher profiles, schedules, and performance',
    icon: UsersIcon,
    color: 'from-green-500 to-green-600',
    borderColor: 'border-green-500/20',
    href: '/admin/teachers',
  },
  {
    title: 'Announcements',
    description: 'Create and manage school announcements and news',
    icon: DocumentTextIcon,
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-500/20',
    href: '/admin/announcements',
  },
  {
    title: 'Events Management',
    description: 'Organize and manage school events and activities',
    icon: CalendarIcon,
    color: 'from-orange-500 to-orange-600',
    borderColor: 'border-orange-500/20',
    href: '/admin/events',
  },
  {
    title: 'Gallery',
    description: 'Manage photo galleries and school memories',
    icon: PhotoIcon,
    color: 'from-pink-500 to-pink-600',
    borderColor: 'border-pink-500/20',
    href: '/admin/gallery',
  },
  {
    title: 'System Settings',
    description: 'Configure school settings and preferences',
    icon: CogIcon,
    color: 'from-gray-500 to-gray-600',
    borderColor: 'border-gray-500/20',
    href: '/admin/settings',
  }
]

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      const result = await loginWithEmail(loginForm.email, loginForm.password)
      
      if (result.success) {
        if (result.user.role === 'admin') {
          // Login successful, component will re-render with user
        } else {
          setLoginError('Access denied. Admin privileges required.')
          await logout()
        }
      } else {
        setLoginError(result.message)
      }
    } catch (error) {
      setLoginError(error.message || 'Login failed')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoginError('')
    setIsLoggingIn(true)

    try {
      const result = await loginWithGoogle()
      
      if (result.success) {
        if (result.user.role === 'admin') {
          // Login successful
        } else {
          setLoginError('Access denied. Admin privileges required.')
          await logout()
        }
      } else {
        setLoginError(result.message)
      }
    } catch (error) {
      setLoginError(error.message || 'Google login failed')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const quickStats = [
    { label: 'Total Students', value: '—', icon: AcademicCapIcon, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Teachers', value: '—', icon: UsersIcon, color: 'from-green-500 to-green-600' },
    { label: 'Announcements', value: '—', icon: DocumentTextIcon, color: 'from-purple-500 to-purple-600' },
    { label: 'Upcoming Events', value: '—', icon: CalendarIcon, color: 'from-orange-500 to-orange-600' },
  ]

  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Show login form if not authenticated or not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-white border-4 border-gray-600">
                <Image
                  src="/nca logo.png"
                  alt="NCA Logo"
                  width={80}
                  height={80}
                  className="object-contain w-full h-full"
                />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Login</h1>
              <p className="text-gray-400 mt-2">NYABIHU CHRISTIAN ACADEMY</p>
            </div>

            {/* Login Error */}
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
                {loginError}
              </div>
            )}

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@nca.rw"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? 'Logging in...' : 'Login with Email'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or</span>
              </div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Info */}
            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-400 text-center">
                🔐 Contact administrator to get access
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-400 hover:text-white text-sm">
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Admin is authenticated - show dashboard
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
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
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm">NYABIHU CHRISTIAN ACADEMY</p>
              </div>
            </div>

            {/* User Info & Nav Actions */}
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'Admin'}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user.displayName?.[0] || user.email?.[0] || 'A'}
                </div>
              )}
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-semibold text-white">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="text-xs text-gray-400">Admin</span>
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-700"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">View Website</span>
              </Link>
              <Link
                href="/admin/reports"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-medium"
              >
                <ChartBarIcon className="w-4 h-4" />
                Reports
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                <CogIcon className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="py-6 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">School Management</h2>
            <p className="text-gray-400 mt-1">Access all the tools you need to manage your school effectively</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature, index) => (
              <Link key={index} href={feature.href} className="block group">
                <div className={`bg-gray-800 rounded-xl border ${feature.borderColor} hover:border-gray-500 transition-all duration-300 p-6 h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Quick Actions */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Quick Actions</h3>
              <Link href="/admin/reports" className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-1">
                View All Reports <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/admin/students" className="flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors duration-300 group">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Add New Student</h4>
                  <p className="text-sm text-gray-400">Register a new student</p>
                </div>
              </Link>

              <Link href="/admin/announcements" className="flex items-center gap-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-colors duration-300 group">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Create Announcement</h4>
                  <p className="text-sm text-gray-400">Post a new announcement</p>
                </div>
              </Link>

              <Link href="/admin/events" className="flex items-center gap-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl hover:bg-orange-500/20 transition-colors duration-300 group">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Add Event</h4>
                  <p className="text-sm text-gray-400">Schedule a new event</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} NYABIHU CHRISTIAN ACADEMY. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-gray-300 transition-colors">
                Support
              </Link>
              <Link href="/" className="hover:text-gray-300 transition-colors">
                View Website
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
