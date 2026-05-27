import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata = {
  title: 'DailyHire - Find Trusted Helpers Near You',
  description: 'Book nearby professionals instantly - plumbers, electricians, cleaners, mechanics, and more. Fast discovery, transparent pricing, easy booking.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
