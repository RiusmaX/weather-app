import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MétéoIA - Application Météo Intelligente',
  description: 'Application météo moderne avec prévisions en temps réel et cartes interactives. Développée avec Next.js, React et TailwindCSS.',
  keywords: ['météo', 'prévisions', 'temps', 'weather', 'carte météo', 'NextJS'],
  authors: [{ name: 'MétéoIA Team' }],
  creator: 'MétéoIA',
  publisher: 'MétéoIA',
  openGraph: {
    title: 'MétéoIA - Application Météo Intelligente',
    description: 'Consultez la météo en temps réel avec des prévisions précises et des cartes interactives',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MétéoIA - Application Météo Intelligente',
    description: 'Consultez la météo en temps réel avec des prévisions précises',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.openweathermap.org" />
        <link rel="preconnect" href="https://openweathermap.org" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
