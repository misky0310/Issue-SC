import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Issue Management Portal',
  description: 'Portal for managing student issues',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}