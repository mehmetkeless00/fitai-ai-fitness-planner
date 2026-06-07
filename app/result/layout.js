export const metadata = {
  title: 'Your Personalized Plan',
  description:
    'Your AI-generated 7-day workout and meal plan. View your nutrition targets, workout schedule, and coaching advice — or download as a PDF.',
  openGraph: {
    title: 'Your Personalized Fitness Plan | FitFlow',
    description:
      'View your custom 7-day workout and meal plan. Includes nutrition targets, exercise demos, and coaching advice.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultLayout({ children }) {
  return children;
}
