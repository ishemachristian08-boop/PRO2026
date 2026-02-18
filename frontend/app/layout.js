import '../styles/globals.css'
import { AuthProvider } from '../lib/auth'
import SplashScreen from '../components/SplashScreen'

export const metadata = {
  title: 'NYABIHU CHRISTIAN ACADEMY',
  description: 'Generate a Child, Transform Generation - Excellence in Christian Education',
  keywords: ['school', 'education', 'christian', 'academy', 'nyabihu', 'rwanda'],
  authors: [{ name: 'NYABIHU CHRISTIAN ACADEMY' }],
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
      </head>
      <body>
        <SplashScreen />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
