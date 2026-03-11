// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Default headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (includeAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  return headers
}

// API Error Handler
class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Core request function
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: getHeaders(options.includeAuth !== false),
    ...options,
  }
  // Remove custom key so fetch doesn't complain
  delete config.includeAuth

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || 'An error occurred',
        response.status,
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      // Provide more user-friendly error messages
      if (error.status === 0) {
        throw new ApiError(
          'Unable to connect to server. Please ensure the backend is running.',
          0,
          { originalError: error }
        )
      }
      if (error.status === 500) {
        throw new ApiError(
          'Server error. Please try again later or contact support.',
          error.status,
          error.data
        )
      }
      throw error
    }
    throw new ApiError('Network error occurred. Please check your connection.', 0, { originalError: error })
  }
}

// HTTP Client
const apiClient = {
  request,

  // Authentication methods
  auth: {
    async login(email, password, securityCode = null) {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, securityCode }),
        includeAuth: false,
      })
    },

    async register(userData) {
      return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        includeAuth: false,
      })
    },

    async logout() {
      return request('/auth/logout', {
        method: 'POST',
      })
    },

    async getMe() {
      return request('/auth/me')
    },

    async getUsers() {
      return request('/auth/users')
    },

    async updateProfile(profileData) {
      return request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      })
    },

    async changePassword(passwordData) {
      return request('/auth/password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      })
    },

    async setSecurityCode(securityCode, currentPassword) {
      return request('/auth/security-code', {
        method: 'POST',
        body: JSON.stringify({ securityCode, currentPassword }),
      })
    },

    async removeSecurityCode(currentPassword) {
      return request('/auth/security-code', {
        method: 'DELETE',
        body: JSON.stringify({ currentPassword }),
      })
    },
  },

  // Student methods
  students: {
    async getAll(params = {}) {
      const searchParams = new URLSearchParams(params)
      const queryString = searchParams.toString()
      const endpoint = `/students${queryString ? `?${queryString}` : ''}`
      return request(endpoint)
    },

    async getById(id) {
      return request(`/students/${id}`)
    },

    async create(studentData) {
      return request('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
      })
    },

    async update(id, studentData) {
      return request(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData),
      })
    },

    async delete(id) {
      return request(`/students/${id}`, {
        method: 'DELETE',
      })
    },

    async getByParent(parentId) {
      return request(`/students/parent/${parentId}`)
    },

    async addAcademicRecord(id, recordData) {
      return request(`/students/${id}/academic`, {
        method: 'POST',
        body: JSON.stringify(recordData),
      })
    },

    async addAttendanceRecord(id, attendanceData) {
      return request(`/students/${id}/attendance`, {
        method: 'POST',
        body: JSON.stringify(attendanceData),
      })
    },

    async getStats(id) {
      return request(`/students/${id}/stats`)
    },
  },

  // Announcement methods
  announcements: {
    async getAll(params = {}) {
      const searchParams = new URLSearchParams(params)
      const queryString = searchParams.toString()
      const endpoint = `/announcements${queryString ? `?${queryString}` : ''}`
      return request(endpoint)
    },

    async getActive() {
      return request('/announcements/active')
    },

    async getById(id) {
      return request(`/announcements/${id}`)
    },

    async create(announcementData) {
      return request('/announcements', {
        method: 'POST',
        body: JSON.stringify(announcementData),
      })
    },

    async update(id, announcementData) {
      return request(`/announcements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(announcementData),
      })
    },

    async delete(id) {
      return request(`/announcements/${id}`, {
        method: 'DELETE',
      })
    },

    async publish(id) {
      return request(`/announcements/${id}/publish`, {
        method: 'PUT',
      })
    },

    async unpublish(id) {
      return request(`/announcements/${id}/unpublish`, {
        method: 'PUT',
      })
    },

    async getByCategory(category) {
      return request(`/announcements/category/${category}`)
    },

    async getByAudience(audience) {
      return request(`/announcements/audience/${audience}`)
    },
  },

  // Event methods
  events: {
    async getAll(params = {}) {
      const searchParams = new URLSearchParams(params)
      const queryString = searchParams.toString()
      const endpoint = `/events${queryString ? `?${queryString}` : ''}`
      return request(endpoint)
    },

    async getUpcoming() {
      return request('/events/upcoming')
    },

    async getOngoing() {
      return request('/events/ongoing')
    },

    async getById(id) {
      return request(`/events/${id}`)
    },

    async create(eventData) {
      return request('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      })
    },

    async update(id, eventData) {
      return request(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      })
    },

    async delete(id) {
      return request(`/events/${id}`, {
        method: 'DELETE',
      })
    },

    async registerForEvent(id) {
      return request(`/events/${id}/register`, {
        method: 'POST',
      })
    },

    async cancelRegistration(id) {
      return request(`/events/${id}/cancel-registration`, {
        method: 'POST',
      })
    },

    async publish(id) {
      return request(`/events/${id}/publish`, {
        method: 'PUT',
      })
    },

    async cancel(id) {
      return request(`/events/${id}/cancel`, {
        method: 'PUT',
      })
    },

    async getByType(eventType) {
      return request(`/events/type/${eventType}`)
    },

    async getByAudience(audience) {
      return request(`/events/audience/${audience}`)
    },
  },

  // Teacher methods
  teachers: {
    async getAll(params = {}) {
      const searchParams = new URLSearchParams(params)
      const queryString = searchParams.toString()
      const endpoint = `/teachers${queryString ? `?${queryString}` : ''}`
      return request(endpoint)
    },

    async getById(id) {
      return request(`/teachers/${id}`)
    },

    async create(teacherData) {
      return request('/teachers', {
        method: 'POST',
        body: JSON.stringify(teacherData),
      })
    },

    async update(id, teacherData) {
      return request(`/teachers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(teacherData),
      })
    },

    async delete(id) {
      return request(`/teachers/${id}`, {
        method: 'DELETE',
      })
    },

    async getStudents(id) {
      return request(`/teachers/${id}/students`)
    },

    async activate(id) {
      return request(`/teachers/${id}/activate`, {
        method: 'PUT',
      })
    },

    async deactivate(id) {
      return request(`/teachers/${id}/deactivate`, {
        method: 'PUT',
      })
    },

    async getByDepartment(department) {
      return request(`/teachers/department/${department}`)
    },
  },

  // Gallery methods
  gallery: {
    async getAll(params = {}) {
      const searchParams = new URLSearchParams(params)
      const queryString = searchParams.toString()
      const endpoint = `/gallery${queryString ? `?${queryString}` : ''}`
      return request(endpoint)
    },

    async getPublic() {
      return request('/gallery/public')
    },

    async getFeatured() {
      return request('/gallery/featured')
    },

    async getById(id) {
      return request(`/gallery/${id}`)
    },

    async create(galleryData) {
      // If it's FormData, don't stringify it
      if (galleryData instanceof FormData) {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/gallery`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: galleryData,
        })
        return response.json()
      }
      return request('/gallery', {
        method: 'POST',
        body: JSON.stringify(galleryData),
      })
    },

    async uploadWithImages(formData) {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/gallery/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      })
      return response.json()
    },

    async update(id, galleryData) {
      return request(`/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(galleryData),
      })
    },

    async delete(id) {
      return request(`/gallery/${id}`, {
        method: 'DELETE',
      })
    },

    async addImages(id, images) {
      return request(`/gallery/${id}/images`, {
        method: 'POST',
        body: JSON.stringify({ images }),
      })
    },

    async removeImage(id, imageId) {
      return request(`/gallery/${id}/images/${imageId}`, {
        method: 'DELETE',
      })
    },

    async makePublic(id) {
      return request(`/gallery/${id}/public`, {
        method: 'PUT',
      })
    },

    async makePrivate(id) {
      return request(`/gallery/${id}/private`, {
        method: 'PUT',
      })
    },

    async feature(id) {
      return request(`/gallery/${id}/feature`, {
        method: 'PUT',
      })
    },

    async unfeature(id) {
      return request(`/gallery/${id}/unfeature`, {
        method: 'PUT',
      })
    },

    async getByCategory(category) {
      return request(`/gallery/category/${category}`)
    },
  },
}

export default apiClient
export { ApiError }
