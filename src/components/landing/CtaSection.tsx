import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export function CtaSection() {
  return (
    <div id="contact" className="bg-saas-darkGray">
      <div className="section-container py-16 md:py-20">
        <div className="bg-gradient-to-r from-saas-primary/20 to-saas-primaryDark/20 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saas-primary opacity-20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-saas-primaryDark opacity-10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Ready to transform your ISP?
              </h2>
              <p className="text-gray-300 text-sm mb-6 max-w-xl">
                Join hundreds of operators using ISP Billing for hotspots, subscriptions, and payments. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard/login">
                  <Button className="bg-saas-primary hover:bg-saas-primaryDark text-white text-sm font-semibold py-2.5 px-5 border-0">
                    Start Free Trial
                  </Button>
                </Link>
                <a href="mailto:contact@example.com">
                  <Button variant="outline" className="border-gray-400 text-white text-sm hover:bg-white hover:text-saas-black hover:border-white bg-transparent py-2.5 px-5">
                    Contact Sales
                  </Button>
                </a>
              </div>
            </div>

            <div className="md:w-1/3">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&h=300&q=80"
                alt="Dashboard"
                className="rounded-lg w-full card-shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
