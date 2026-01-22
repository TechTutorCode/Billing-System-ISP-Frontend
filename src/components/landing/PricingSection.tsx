import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 29,
      annualPrice: 23,
      description: 'For small ISPs and single-location hotspots',
      features: [
        'Up to 100 customers',
        '5GB storage',
        'Basic analytics',
        'Email support',
        '1 hotspot',
      ],
      isPopular: false,
      ctaText: 'Start with Starter',
    },
    {
      name: 'Professional',
      monthlyPrice: 79,
      annualPrice: 63,
      description: 'For growing ISPs and multiple locations',
      features: [
        'Up to 1,000 customers',
        '50GB storage',
        'Advanced analytics',
        'Priority support',
        'Unlimited hotspots',
        'M-Pesa & Paystack',
        'Custom branding',
      ],
      isPopular: true,
      ctaText: 'Start with Pro',
    },
    {
      name: 'Enterprise',
      monthlyPrice: 149,
      annualPrice: 119,
      description: 'For large operators and networks',
      features: [
        'Unlimited customers',
        '500GB storage',
        'Full analytics & API',
        '24/7 dedicated support',
        'Unlimited hotspots',
        'SSO & custom integrations',
        'Dedicated account manager',
      ],
      isPopular: false,
      ctaText: 'Contact Sales',
    },
  ];

  return (
    <div id="pricing" className="bg-gradient-to-b from-saas-darkGray to-saas-black">
      <div className="section-container py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Choose the plan that fits your ISP. No hidden fees.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${isAnnual ? 'text-saas-primary' : 'text-gray-400'}`}>
              Annual <span className="text-xs text-saas-primary">(Save 20%)</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${isAnnual ? 'bg-saas-primary' : 'bg-gray-600'}`}
              aria-label="Toggle annual / monthly"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-sm font-medium ${!isAnnual ? 'text-saas-primary' : 'text-gray-400'}`}>
              Monthly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-saas-primary/20 to-saas-black border border-saas-primary/30 transform hover:-translate-y-2'
                  : 'bg-saas-darkGray border border-gray-800 transform hover:-translate-y-1'
              }`}
            >
              {plan.isPopular && (
                <span className="bg-saas-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-white">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-gray-400 text-sm"> /month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-saas-primary mr-2 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.ctaText === 'Contact Sales' ? (
                <a href="#contact" className="block">
                  <Button
                    className="w-full bg-transparent border border-saas-primary/30 hover:border-saas-primary text-white text-sm py-2.5"
                  >
                    {plan.ctaText}
                  </Button>
                </a>
              ) : (
                <Link to="/dashboard/login" className="block">
                  <Button
                    className={`w-full text-sm py-2.5 ${
                      plan.isPopular
                        ? 'bg-saas-primary hover:bg-saas-primaryDark text-white border-0'
                        : 'bg-transparent border border-saas-primary/30 hover:border-saas-primary text-white'
                    }`}
                  >
                    {plan.ctaText}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
