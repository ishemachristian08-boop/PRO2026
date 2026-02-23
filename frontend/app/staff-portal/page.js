'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '@lib/auth'
import { ShieldCheckIcon, LockClosedIcon, UserIcon, KeyIcon } from '@heroicons/react/24/outline'

export default function StaffPortalPage() {
  const [step, setStep] = useState(1) // 1 = credentials, 2 = security code
  const [form, setForm] = useState({ email: '', password: '', securityCode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(form.email, form.password)
      if (result.success) {
        // Check if security code is required
        if (result.requiresSecurityCode) {
          setStep(2)
          setLoading(false)
        } else {
          // No security code required, redirect to admin
          router.push('/admin')
        }
      } else {
        if (result.requiresSecurityCode) {
          setStep(2)
        } else {
          setError(result.message || 'Invalid email or password. Please try again.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSecurityCodeSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(form.email, form.password, form.securityCode)
      if (result.success) {
        // Determine redirect based on role
        if (result.data?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/staff-portal/dashboard')
        }
      } else {
        setError(result.message || 'Invalid security code. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    setStep(1)
    setForm({ ...form, securityCode: '' })
    setError('')
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShieldCheckIcon className="w-10 h-10 text-primary-600" />
            <h1 className="text-4xl font-bold text-primary-900">Staff Portal</h1>
          </div>
          <p className="text-gray-700 text-center">Secure access for teachers and school staff to manage records and class activities.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'} font-semibold`}>
                  1
                </div>
                <span className="text-sm font-medium">Credentials</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200">
                <div className={`h-full bg-primary-600 transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'} font-semibold`}>
                  2
                </div>
                <span className="text-sm font-medium">Security Code</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                  onSubmit={handleCredentialsSubmit}
                >
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                      <span className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Staff Email
                      </span>
                    </label>
                    <input
                      id="email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300"
                      type="email"
                      required
                      placeholder="staff@nca.rw"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                      <span className="flex items-center gap-2">
                        <LockClosedIcon className="w-4 h-4" />
                        Password
                      </span>
                    </label>
                    <input
                      id="password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300"
                      type="password"
                      required
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-secondary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Verifying...
                      </span>
                    ) : 'Continue'}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    Need help?{' '}
                    <Link href="/contact" className="text-primary-600 hover:underline">
                      Contact the school office
                    </Link>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                  onSubmit={handleSecurityCodeSubmit}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <KeyIcon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Security Verification</h3>
                    <p className="text-sm text-gray-600 mt-1">Enter your security code to continue</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="securityCode">
                      <span className="flex items-center gap-2">
                        <KeyIcon className="w-4 h-4" />
                        Security Code
                      </span>
                    </label>
                    <input
                      id="securityCode"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 text-center text-2xl tracking-widest font-mono"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      placeholder="••••••"
                      value={form.securityCode}
                      onChange={(e) => setForm({ ...form, securityCode: e.target.value.replace(/\D/g, '') })}
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Enter the 4-6 digit security code provided by your administrator
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || form.securityCode.length < 4}
                      className="flex-1 btn-secondary disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          Verifying...
                        </span>
                      ) : 'Sign In'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
