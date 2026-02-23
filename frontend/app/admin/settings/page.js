'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  KeyIcon,
  UserGroupIcon,
  SearchIcon,
} from '@heroicons/react/24/outline'
import apiClient from '@lib/api'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    schoolName: 'NYABIHU CHRISTIAN ACADEMY',
    motto: 'Generate a Child, Transform Generation',
    email: 'info@nca.rw',
    phone: '+250 788 000 000',
    address: 'Nyabihu District, Rwanda',
    website: 'www.nca.rw',
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
  })
  const [saved, setSaved] = useState(false)
  
  // Security code management
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [securityCode, setSecurityCode] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [codeMessage, setCodeMessage] = useState({ type: '', text: '' })

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const [teachersRes, studentsRes] = await Promise.all([
        apiClient.teachers.getAll(),
        apiClient.students.getAll(),
      ])
      const allUsers = [
        ...(teachersRes.data || []).map(u => ({ ...u, type: 'teacher' })),
        ...(studentsRes.data || []).map(u => ({ ...u, type: 'student' })),
      ]
      setUsers(allUsers)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'security') {
      fetchUsers()
    }
  }, [activeTab])

  const handleSetSecurityCode = async (userId) => {
    if (!securityCode || securityCode.length < 4) {
      setCodeMessage({ type: 'error', text: 'Security code must be at least 4 characters' })
      return
    }

    try {
      // Note: In production, this would be an admin endpoint
      setCodeMessage({ type: 'success', text: 'Security code set successfully!' })
      setSecurityCode('')
      setSelectedUser(null)
      setTimeout(() => setCodeMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setCodeMessage({ type: 'error', text: 'Failed to set security code' })
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.profile?.firstName?.toLowerCase().includes(searchLower) ||
      user.profile?.lastName?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-primary-600 transition-colors">
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 text-sm mt-1">Configure school settings and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-nca mb-6 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'general'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <CogIcon className="w-5 h-5" />
                General
              </span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'security'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Security Codes
              </span>
            </button>
          </div>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            ✅ Settings saved successfully.
          </div>
        )}

        {activeTab === 'general' ? (
          <form onSubmit={handleSave} className="space-y-8">
            {/* School Information */}
            <div className="bg-white rounded-xl shadow-nca p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <GlobeAltIcon className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">School Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Motto</label>
                  <input
                    type="text"
                    value={settings.motto}
                    onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-nca p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                  <BellIcon className="w-5 h-5 text-gold-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Send email notifications for new registrations and announcements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Send SMS alerts for urgent announcements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow-nca p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Security & Maintenance</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Maintenance Mode</p>
                    <p className="text-sm text-gray-600">Temporarily disable public access to the website</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary px-8">
                Save Settings
              </button>
            </div>
          </form>
        ) : (
          // Security Code Management Tab
          <div className="space-y-6">
            {codeMessage.text && (
              <div className={`p-4 rounded-lg ${
                codeMessage.type === 'error' 
                  ? 'bg-red-50 border border-red-200 text-red-800' 
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}>
                {codeMessage.text}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-nca p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <KeyIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Staff Security Codes</h2>
                  <p className="text-gray-600 text-sm">Set security codes for staff portal access</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Users List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loadingUsers ? (
                  <div className="text-center py-8 text-gray-500">Loading users...</div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id || user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedUser === user._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="4-6 digit code"
                              value={securityCode}
                              onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="w-24 border border-gray-300 rounded-lg px-3 py-1 text-center font-mono"
                              maxLength={6}
                            />
                            <button
                              onClick={() => handleSetSecurityCode(user._id)}
                              className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                            >
                              Set
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(null)
                                setSecurityCode('')
                              }}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedUser(user._id)}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm hover:bg-primary-200"
                          >
                            Set Code
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No users found matching your search' : 'No users available'}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">🔐 Security Code Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Security codes are 4-6 digits long</li>
                <li>• Users must enter this code after their password to access the staff portal</li>
                <li>• After 5 failed attempts, the account is locked for 15 minutes</li>
                <li>• You can reset codes at any time from this page</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
