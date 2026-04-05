import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { AudioProvider } from '@/contexts/AudioContext'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Happy Birthday, Chiku 🎂',
  description: 'A special birthday for a special person — turning 24.',
  openGraph: {
    title: 'Happy Birthday, Chiku!',
    description: 'Turning 24 on April 5, 2026',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-canvas text-cream font-sans antialiased">
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  )
}
