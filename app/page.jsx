import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { CategoriesSection } from '@/components/landing/categories-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { FeaturedHelpersSection } from '@/components/landing/featured-helpers-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CTASection } from '@/components/landing/cta-section';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <HowItWorksSection />
        <FeaturedHelpersSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
