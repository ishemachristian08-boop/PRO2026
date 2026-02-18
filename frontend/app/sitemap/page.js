'use client'

import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const sitePages = [
  {
    category: 'Main Pages',
    pages: [
      { name: 'Home', href: '/', description: 'Welcome to NYABIHU CHRISTIAN ACADEMY' },
      { name: 'About Us', href: '/about', description: 'Our mission, vision, and history' },
      { name: 'Academics', href: '/academics', description: 'Nursery and Primary programs' },
      { name: 'Admissions', href: '/admissions', description: 'How to enroll your child' },
      { name: 'Gallery', href: '/gallery', description: 'School photos and memories' },
      { name: 'News & Events', href: '/news', description: 'Announcements and upcoming events' },
      { name: 'Contact Us', href: '/contact', description: 'Get in touch with us' },
    ]
  },
  {
    category: 'Portals',
    pages: [
      { name: 'Student Portal', href: '/student-portal', description: 'Student login and dashboard' },
      { name: 'Staff Portal', href: '/staff-portal', description: 'Staff and teacher login' },
    ]
  },
  {
    category: 'Admin',
    pages: [
      { name: 'Admin Dashboard', href: '/admin', description: 'School management dashboard' },
      { name: 'Student Management', href: '/admin/students', description: 'Manage student records' },
      { name: 'Teacher Management', href: '/admin/teachers', description: 'Manage teacher profiles' },
      { name: 'Announcements', href: '/admin/announcements', description: 'Create and manage announcements' },
      { name: 'Events', href: '/admin/events', description: 'Manage school events' },
      { name: 'Gallery', href: '/admin/gallery', description: 'Manage photo galleries' },
      { name: 'Reports', href: '/admin/reports', description: 'View school statistics' },
      { name: 'Settings', href: '/admin/settings', description: 'System configuration' },
    ]
  },
  {
    category: 'Legal',
    pages: [
      { name: 'Privacy Policy', href: '/privacy', description: 'How we handle your data' },
      { name: 'Terms of Service', href: '/terms', description: 'Terms and conditions' },
      { name: 'Sitemap', href: '/sitemap', description: 'All pages on this website' },
    ]
  }
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">Sitemap</h1>
          <p className="text-gray-700">All pages available on the NYABIHU CHRISTIAN ACADEMY website.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {sitePages.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-bold text-primary-900 mb-4 pb-2 border-b border-gray-200">
                {section.category}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {section.pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 group"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary-400 mt-2 flex-shrink-0 group-hover:bg-primary-600 transition-colors"></div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors">{page.name}</p>
                      <p className="text-sm text-gray-500">{page.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
