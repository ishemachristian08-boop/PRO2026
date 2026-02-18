'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '../../../lib/auth'
import apiClient from '../../../lib/api'
import {
  AcademicCapIcon,
  UserIcon,
  BriefcaseIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

export default function TeachersPage() {
  const { user, isAdmin } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const departments = ['All', 'Nursery', 'Primary', 'Administration', 'Special Education']

  useEffect(() => {
    fetchTeachers()
  }, [currentPage])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        department: departmentFilter === 'All' ? undefined : departmentFilter
      }
      
      const response = await apiClient.teachers.getAll(params)
      if (response.success) {
        setTeachers(response.data)
      } else {
        setError(response.message)
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
      setError('Failed to fetch teachers')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchTeachers()
  }

  const handleDelete = async (teacherId) => {
    if (!confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      return
    }

    try {
      await apiClient.teachers.delete(teacherId)
      fetchTeachers() // Refresh the list
    } catch (error) {
      console.error('Error deleting teacher:', error)
      setError('Failed to delete teacher')
    }
  }

  const handleToggleStatus = async (teacherId, currentStatus) => {
    try {
      if (currentStatus) {
        await apiClient.teachers.deactivate(teacherId)
      } else {
        await apiClient.teachers.activate(teacherId)
      }
      fetchTeachers() // Refresh the list
    } catch (error) {
      console.error('Error updating teacher status:', error)
      setError('Failed to update teacher status')
    }
  }

  const filteredTeachers = teachers.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Teacher Management - Admin Dashboard</title>
        <meta name="description" content="Manage teacher records and information" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
              <p className="text-gray-600 mt-1">Manage teacher profiles, schedules, and performance</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/teachers/new"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Teacher</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-lg">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300"
              >
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-500" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Table */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="bg-white rounded-xl shadow-nca p-8">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-nca overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Teachers ({teachers.total || 0})
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Students
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTeachers.map((teacher, index) => (
                        <motion.tr
                          key={teacher._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <AcademicCapIcon className="w-6 h-6 text-primary-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {teacher.firstName} {teacher.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {teacher.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {teacher.department}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                <span>{teacher.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <PhoneIcon className="w-4 h-4 text-gray-400" />
                                <span>{teacher.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {teacher.studentsCount || 0} Students
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleStatus(teacher._id, teacher.isActive)}
                              className={`inline-flex items-center space-x-2 px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-300 ${
                                teacher.isActive 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {teacher.isActive ? (
                                <>
                                  <CheckCircleIcon className="w-4 h-4" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="w-4 h-4" />
                                  <span>Inactive</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Link
                              href={`/admin/teachers/${teacher._id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(teacher._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                            <Link
                              href={`/admin/teachers/${teacher._id}/students`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <BriefcaseIcon className="w-5 h-5" />
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {teachers.pagination && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, teachers.total)} of {teachers.total} teachers
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={!teachers.pagination.hasNextPage}
                          className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Empty State */}
              {filteredTeachers.length === 0 && !loading && (
                <div className="bg-white rounded-xl shadow-nca p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || departmentFilter !== 'All' 
                      ? 'Try adjusting your search criteria or filters.' 
                      : 'No teachers have been added yet.'}
                  </p>
                  <Link
                    href="/admin/teachers/new"
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300 inline-flex items-center space-x-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add First Teacher</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}