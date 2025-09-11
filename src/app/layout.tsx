import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Timestack - Luxury Watch Inventory Management',
  description: 'Professional luxury watch inventory management system for dealers and collectors',
  keywords: 'luxury watches, inventory management, watch dealers, timepieces, Rolex, Patek Philippe',
  authors: [{ name: 'Timestack Team' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#007aff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script src="https://kit.fontawesome.com/your-kit-id.js" crossOrigin="anonymous" async />
      </head>
      <body className={`${inter.className} h-full bg-white overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}