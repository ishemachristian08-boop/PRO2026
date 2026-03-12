'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import apiClient from './api'

// Create Auth Context
const AuthContext = createContext()

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Check authentication status
  const checkAuth = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (token) {
        const response = await apiClient.auth.getMe()
        setUser(response.data)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (email, password, securityCode = null) => {
    // Demo mode is disabled - using Firebase Authentication
    const DEMO_MODE = false
    
    if (DEMO_MODE) {
      // Demo mode is disabled
      return { success: false, message: 'Demo mode is disabled. Please use Firebase Authentication.' }
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.auth.login(email, password, securityCode)
      
      if (response.success) {
        localStorage.setItem('token', response.data.token)
        setUser(response.data)
        return { success: true, data: response.data }
      }
      
      return { success: false, message: response.message, requiresSecurityCode: response.requiresSecurityCode }
    } catch (error) {
      const errorMessage = error.message || 'Login failed'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.auth.register(userData)
      
      if (response.success) {
        // Auto-login after registration
        localStorage.setItem('token', response.data.token)
        setUser(response.data)
        return { success: true }
      }
      
      return { success: false, message: response.message }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await apiClient.auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setError(null)
    }
  }

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.auth.updateProfile(profileData)
      
      if (response.success) {
        setUser(response.data)
        return { success: true }
      }
      
      return { success: false, message: response.message }
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.auth.changePassword(passwordData)
      
      if (response.success) {
        return { success: true }
      }
      
      return { success: false, message: response.message }
    } catch (error) {
      const errorMessage = error.message || 'Password change failed'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role
  }

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin')
  }

  // Check if user is teacher
  const isTeacher = () => {
    return user && (user.role === 'admin' || user.role === 'teacher')
  }

  // Check if user is parent
  const isParent = () => {
    return user && (user.role === 'admin' || user.role === 'parent')
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    isAdmin,
    isTeacher,
    isParent,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth(Component, requiredRole = null) {
  return function AuthenticatedComponent(props) {
    const { user, loading, isParent, isTeacher, isAdmin } = useAuth()

    // Show loading spinner while checking auth
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )
    }

    // Redirect to login if not authenticated
    if (!user) {
      // You could use Next.js router here to redirect
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      )
    }

    // Check role requirements
    if (requiredRole) {
      let hasAccess = false
      
      switch (requiredRole) {
        case 'admin':
          hasAccess = isAdmin()
          break
        case 'teacher':
          hasAccess = isTeacher()
          break
        case 'parent':
          hasAccess = isParent()
          break
        default:
          hasAccess = true
      }

      if (!hasAccess) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        )
      }
    }

    return <Component {...props} />
  }
}