import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import Hero from '@/components/features/home/Hero';
import Features from '@/components/features/home/Features';
import CTA from '@/components/features/home/CTA';
import HomeFooter from '@/components/layout/HomeFooter';

export const metadata = {
  title: 'FitFlow - Free AI Fitness & Nutrition Plans',
  description:
    'Generate your free personalized 7-day workout and meal plan in seconds. Science-based, tailored to your goals, experience level, and diet.',
  openGraph: {
    title: 'FitFlow - Free AI Fitness & Nutrition Plans',
    description:
      'Generate your free personalized 7-day workout and meal plan in seconds. Science-based and tailored to you.',
  },
  twitter: {
    title: 'FitFlow - Free AI Fitness & Nutrition Plans',
    description:
      'Generate your free personalized 7-day workout and meal plan in seconds.',
  },
};

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <Container>
          <Hero />
          <Features />
          <CTA />
        </Container>
      </main>

      <HomeFooter />
    </>
  );
}
