import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Bold Calculator — Быстрый веб-калькулятор',
  description:
    'Веб-калькулятор в стиле Calcu: крупная типографика, история операций, поддержка клавиатуры. Работает оффлайн.',
  applicationName: 'Bold Calculator',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Bold Calculator',
    description: 'Bold-калькулятор: крупный шрифт, история, поддержка клавиатуры.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-sans">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Bold Calculator',
              operatingSystem: 'Web',
              applicationCategory: 'UtilitiesApplication',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            }),
          }}
        />
      </body>
    </html>
  );
}
