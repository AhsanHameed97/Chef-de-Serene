import type { Metadata, Viewport } from 'next'
import { Gilda_Display, JetBrains_Mono } from 'next/font/google'
import { appUrl } from '@/lib/url'
import './globals.css'

const gilda = Gilda_Display({ subsets: ['latin'], weight: '400', variable: '--font-gilda', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: {
    default: 'Chef de Serene | Functional Fine Dining for Private Estates',
    template: '%s | Chef de Serene',
  },
  description:
    'Eliminate decision fatigue and protect longevity with dietitian-aligned fine dining and custom weekly meal prep—delivered across Los Angeles in luxury glassware.',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${gilda.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@300,400,500,600,700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  )
}
