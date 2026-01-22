import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { PricingSection } from '../components/landing/PricingSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { CtaSection } from '../components/landing/CtaSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-saas-black text-gray-900 dark:text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};
