import './globals.css';
import ThemeProvider from '@/components/layout/ThemeProvider';
import LanguageProvider from '@/components/layout/LanguageProvider';

export const metadata = {
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
    'AI fitness',
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
    <html lang="en" className="dark">
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
