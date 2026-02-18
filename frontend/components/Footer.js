'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'News & Events', href: '/news' },
    { name: 'Contact Us', href: '/contact' },
  ]

  const academicLinks = [
    { name: 'Nursery Program', href: '/academics#nursery' },
    { name: 'Primary Program', href: '/academics#primary' },
    { name: 'Curriculum', href: '/academics#curriculum' },
    { name: 'Co-curricular', href: '/academics#co-curricular' },
  ]

  const contactInfo = [
    {
      icon: MapPinIcon,
      label: 'Location',
      value: 'Nyabihu District, Rwanda',
      href: 'https://maps.google.com/?q=Nyabihu+District,+Rwanda'
    },
    {
      icon: PhoneIcon,
      label: 'Phone',
      value: '+250 79 179 2982',
      href: 'tel:+250791792982'
    },
    {
      icon: EnvelopeIcon,
      label: 'Email',
      value: 'info@nca.rw',
      href: 'mailto:ishemachristian08@gmail.com'
    },
  ]

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/nca.rwanda',
      icon: FaFacebookF,
      color: 'text-blue-400 hover:text-blue-300'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/nca.rwanda',
      icon: FaInstagram,
      color: 'text-pink-400 hover:text-pink-300'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/school/nca-rwanda',
      icon: FaLinkedinIn,
      color: 'text-blue-400 hover:text-blue-300'
    },
    {
      name: 'X (Twitter)',
      href: 'https://x.com/nca_rwanda',
      icon: FaXTwitter,
      color: 'text-gray-400 hover:text-gray-300'
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* School Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-nca flex-shrink-0">
                <Image
                  src="/nca logo.png"
                  alt="NCA Logo"
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">NYABIHU CHRISTIAN ACADEMY</h3>
                <p className="text-gray-400 text-sm">Generate a Child, Transform Generation</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Excellence in Christian Education for Nursery and Primary levels in Nyabihu District, Rwanda. 
              We provide a nurturing environment where children grow academically, spiritually, and socially.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">{item.label}</p>
                    <Link 
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-white hover:text-primary-400 transition-colors duration-300"
                    >
                      {item.value}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Academic Programs</h4>
            <ul className="space-y-3">
              {academicLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {currentYear} NYABIHU CHRISTIAN ACADEMY. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} transition-colors duration-300`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            {/* Additional Links */}
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors duration-300">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            Designed with ❤️ for NYABIHU CHRISTIAN ACADEMY — Nyabihu District, Rwanda
          </p>
        </div>
      </div>
    </footer>
  )
}
