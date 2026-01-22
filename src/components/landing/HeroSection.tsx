import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-b from-saas-black to-[#1c160c] overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-saas-primary opacity-10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-saas-primary opacity-15 rounded-full blur-[80px]" />
      <div className="absolute top-20 right-1/4 w-[250px] h-[250px] bg-saas-primary opacity-10 rounded-full blur-[70px]" />

      <div className="section-container relative z-10 text-center py-16 md:py-24">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <span className="inline-block bg-saas-primary/10 text-saas-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-saas-primary/20">
              ISP Billing & Hotspot Management
            </span>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Transform Your Network With Our{' '}
              <span className="bg-gradient-to-r from-saas-primary to-saas-primaryDark bg-clip-text text-transparent">
                Billing Platform
              </span>
            </h1>

            <p className="text-base md:text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
              Streamline operations, manage hotspots, and automate billing with our platform. MikroTik integration, M-Pesa, and real-time analytics. Built for ISPs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard/login">
                <Button className="bg-saas-primary hover:bg-saas-primaryDark text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 border-0">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#pricing">
                <Button variant="outline" className="border-saas-primary text-saas-primary hover:bg-saas-primary hover:text-white bg-transparent text-sm py-2.5 px-5">
                  View Pricing
                </Button>
              </a>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="flex -space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"
                  className="w-10 h-10 rounded-full border-2 border-saas-black object-cover"
                  alt=""
                />
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64"
                  className="w-10 h-10 rounded-full border-2 border-saas-black object-cover"
                  alt=""
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64"
                  className="w-10 h-10 rounded-full border-2 border-saas-black object-cover"
                  alt=""
                />
              </div>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-saas-primary">500+</span> ISPs already using our platform
              </p>
            </div>
          </div>

          <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-saas-primary to-saas-primaryDark blur-xl opacity-20 rounded-xl" />
              <div className="relative bg-saas-darkGray rounded-xl border border-saas-primary/20 p-2 card-shadow transform transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(17,148,244,0.15)] hover:shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80"
                  alt="Dashboard Preview"
                  className="rounded-lg w-full"
                />
                <div className="absolute bottom-4 left-4 bg-saas-primary/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium">
                  Billing & Analytics Dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 w-20 h-20 border border-saas-primary/20 rounded-full" />
      <div className="absolute top-20 right-10 w-10 h-10 border border-saas-primary/20 rounded-full" />
      <div className="absolute top-40 left-20 w-5 h-5 bg-saas-primary/20 rounded-full" />
    </div>
  );
}
