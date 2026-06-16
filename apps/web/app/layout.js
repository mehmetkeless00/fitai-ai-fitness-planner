import './globals.css';
import { Schibsted_Grotesk, Hanken_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import ThemeProvider from '@/components/layout/ThemeProvider';
import LanguageProvider from '@/components/layout/LanguageProvider';
import AuthProvider from '@/components/layout/AuthProvider';

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://fitai-ai-fitness-planner.vercel.app'),
  title: {
    default: 'FitFlow - Your Personal Fitness Coach',
    template: '%s | FitFlow',
  },
  description:
    'Get a free personalized 7-day workout and meal plan. Tailored to your fitness goals, experience level, and dietary preferences.',
  keywords: [
    'fitness plan',
    'workout plan',
    'meal plan',
    'fitness calculator',
    'personal trainer',
    'nutrition plan',
    'weight loss',
    'muscle building',
  ],
  authors: [{ name: 'FitFlow' }],
  openGraph: {
    title: 'FitFlow - Your Personal Fitness Coach',
    description:
      'Get a free personalized 7-day workout and meal plan. Tailored to your goals, experience, and diet.',
    type: 'website',
    siteName: 'FitFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitFlow - Your Personal Fitness Coach',
    description:
      'Get a free personalized 7-day workout and meal plan. Tailored to your goals, experience, and diet.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${schibsted.variable} ${hanken.variable} font-sans`}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
