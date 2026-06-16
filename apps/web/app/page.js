import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import Hero from '@/components/features/home/Hero';
import HowItWorks from '@/components/features/home/HowItWorks';
import Features from '@/components/features/home/Features';
import CTA from '@/components/features/home/CTA';
import HomeFooter from '@/components/layout/HomeFooter';

export const metadata = {
  title: 'FitFlow - Free Personalized Fitness & Nutrition Plans',
  description:
    'Generate your free personalized 7-day workout and meal plan in seconds. Science-based, tailored to your goals, experience level, and diet.',
  openGraph: {
    title: 'FitFlow - Free Personalized Fitness & Nutrition Plans',
    description:
      'Generate your free personalized 7-day workout and meal plan in seconds. Science-based and tailored to you.',
  },
  twitter: {
    title: 'FitFlow - Free Personalized Fitness & Nutrition Plans',
    description:
      'Generate your free personalized 7-day workout and meal plan in seconds.',
  },
};

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen pt-[60px] bg-canvas dark:bg-dark-bg">
        <Container>
          <Hero />
          <HowItWorks />
          <Features />
          <CTA />
        </Container>
      </main>

      <HomeFooter />
    </>
  );
}
