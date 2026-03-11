import '../styles/globals.css'
import { AuthProvider } from '@lib/auth'
import SplashScreen from '../components/SplashScreen'
import Chatbot from '../components/Chatbot'
import '../lib/firebase'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nca.rw'),
  title: {
    default: 'NYABIHU CHRISTIAN ACADEMY',
    template: '%s | NYABIHU CHRISTIAN ACADEMY',
  },
  description: 'Generate a Child, Transform Generation - Excellence in Christian Education in Rwanda',
  keywords: ['school', 'education', 'christian', 'academy', 'nyabihu', 'rwanda', 'primary school', 'secondary school'],
  authors: [{ name: 'NYABIHU CHRISTIAN ACADEMY' }],
  creator: 'NYABIHU CHRISTIAN ACADEMY',
  publisher: 'NYABIHU CHRISTIAN ACADEMY',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nca.rw',
    siteName: 'NYABIHU CHRISTIAN ACADEMY',
    title: 'NYABIHU CHRISTIAN ACADEMY - Excellence in Christian Education',
    description: 'Generate a Child, Transform Generation - Excellence in Christian Education in Rwanda',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NYABIHU CHRISTIAN ACADEMY',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NYABIHU CHRISTIAN ACADEMY',
    description: 'Generate a Child, Transform Generation - Excellence in Christian Education',
    images: ['/og-image.jpg'],
    creator: '@nca',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0052cc',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/nca logo.png" sizes="any" type="image/png" />
        <link rel="apple-touch-icon" href="/nca logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <SplashScreen />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Chatbot />
      </body>
    </html>
  )
}
