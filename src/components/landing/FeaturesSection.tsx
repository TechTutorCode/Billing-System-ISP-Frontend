import { Search, Settings, User, Wifi, CreditCard, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <BarChart3 className="h-6 w-6 text-saas-primary" />,
    title: 'Smart Analytics',
    description: 'Track revenue, payment trends, and customer usage. Make data-driven decisions with real-time dashboards.',
  },
  {
    icon: <Settings className="h-5 w-5 text-saas-primary" />,
    title: 'MikroTik Integration',
    description: 'Manage routers and hotspot gateways from one place. Bandwidth shaping, PPPoE, and MAC-based access.',
  },
  {
    icon: <User className="h-6 w-6 text-saas-primary" />,
    title: 'Customer Management',
    description: 'Subscriptions, invoicing, and self-service portals. Keep your customers and data organized.',
  },
  {
    icon: <Wifi className="h-5 w-5 text-saas-primary" />,
    title: 'Hotspot & Captive Portal',
    description: 'Custom branded login pages, vouchers, and session management. Deploy Wi‑Fi hotspots with ease.',
  },
  {
    icon: <CreditCard className="h-5 w-5 text-saas-primary" />,
    title: 'M-Pesa & Payments',
    description: 'Accept payments via M-Pesa, Paystack, Flutterwave, and more. Automate top-ups and package activation.',
  },
  {
    icon: <Search className="h-6 w-6 text-saas-primary" />,
    title: 'Reports & Exports',
    description: 'Export data, run reports, and monitor KPIs. Stay compliant and audit-ready.',
  },
];

export function FeaturesSection() {
  return (
    <div id="features" className="bg-saas-black">
      <div className="section-container py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Powerful <span className="gradient-text">Features</span> for Your ISP
          </h2>
          <p className="text-gray-400 text-sm">
            Billing, hotspots, routers, and analytics in one platform. Scale your network and grow revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-saas-darkGray p-6 rounded-xl border border-gray-800 hover:border-saas-primary/50 transition-all duration-300 card-shadow"
            >
              <div className="bg-saas-primary/10 w-10 h-10 flex items-center justify-center rounded-lg mb-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
