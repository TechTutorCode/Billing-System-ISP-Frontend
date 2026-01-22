import { Link } from 'react-router-dom';
import {
  Wifi,
  Smartphone,
  Shield,
  CreditCard,
  BarChart3,
  Settings,
  Zap,
  Globe,
  Users,
  CheckCircle2,
  ArrowRight,
  Server,
  Lock,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Button } from '../components/ui/button';

export const LandingPage = () => {
  const features = [
    {
      icon: Wifi,
      title: 'Hotspot Management',
      description: 'Complete hotspot configuration and management with MikroTik integration, MAC-based vouchers, and customizable captive portals.',
    },
    {
      icon: Smartphone,
      title: 'Mobile App Ready',
      description: 'Manage your ISP operations on the go. Monitor network status, manage accounts, and handle billing from anywhere.',
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Ensure user privacy and network integrity with SSL, secure token-based authentication, IP binding, and RADIUS integration.',
    },
    {
      icon: CreditCard,
      title: 'Real-time Payments',
      description: 'Enable instant top-ups and package purchases via M-Pesa, card payments, or vouchers with automatic activation.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track revenue across multiple locations, monitor payment trends, and make data-driven business decisions.',
    },
    {
      icon: Settings,
      title: 'Router Management',
      description: 'Effortlessly manage MikroTik or other router configurations remotely with bandwidth shaping and session rules.',
    },
  ];

  const paymentProviders = [
    { name: 'M-Pesa', logo: 'M-Pesa' },
    { name: 'Paystack', logo: 'Paystack' },
    { name: 'Flutterwave', logo: 'Flutterwave' },
    { name: 'ClickPesa', logo: 'ClickPesa' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Wifi className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ISP Billing</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
              <Link to="/dashboard/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Scale billing & network operations
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              with ISP Billing System
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The most complete billing system with Wireless and PPPoE support, custom user portals,
            self-service capabilities, hotspot roaming, and other enterprise-grade features.
            It's fit for any ISP—whether small, medium, or large enterprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard/login">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Features
              </Button>
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">Trusted by thousands of ISPs across Africa</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What makes us different?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ISP Billing System is designed with the unique needs of Internet Service Providers in mind.
              It combines powerful billing and network management tools into a single platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Payment Integrations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Integrated Payment Gateways</h2>
            <p className="text-xl text-gray-600">
              Accept payments seamlessly with our integrated payment gateway solutions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {paymentProviders.map((provider, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-2xl font-bold text-gray-700">{provider.logo}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edge Infrastructure */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Edge Computing for Maximum Performance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deploy critical services at the edge, close to your network infrastructure,
              ensuring minimal latency and the best experience for your customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reduced Latency</h3>
              <p className="text-gray-600">
                Deploy services at the edge, close to your network infrastructure, minimizing round-trip times.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enhanced Security</h3>
              <p className="text-gray-600">
                Keep sensitive authentication services within your network perimeter, reducing exposure.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Reliability</h3>
              <p className="text-gray-600">
                Local deployment ensures your services remain operational even if external connectivity is disrupted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Billing & Analytics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Complete Billing System with Real-time Revenue Insights
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Automate your entire billing process from subscription management to invoice generation.
                Track revenue across multiple locations, monitor payment trends, and make data-driven business decisions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Automated Invoicing</h4>
                    <p className="text-gray-600">Generate and send invoices automatically based on customer plans</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Revenue Analytics</h4>
                    <p className="text-gray-600">Visualize revenue trends, customer growth, and business performance</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Multi-location Tracking</h4>
                    <p className="text-gray-600">Monitor activity and engagement across all your service locations</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mt-6"></div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="h-20 bg-blue-50 rounded"></div>
                  <div className="h-20 bg-purple-50 rounded"></div>
                  <div className="h-20 bg-indigo-50 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Device Management */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl order-2 lg:order-1">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-2 bg-gray-100 rounded w-32"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-2 bg-gray-100 rounded w-32"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-2 bg-gray-100 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Advanced Device Management
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Securely manage and monitor all customer devices. Control access, track bandwidth usage,
                and ensure network security with our powerful device management tools.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">WireGuard Integration</h4>
                    <p className="text-gray-600">Secure VPN connections with modern WireGuard protocol</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Bandwidth Monitoring</h4>
                    <p className="text-gray-600">Real-time bandwidth tracking and usage analytics per device</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Device Authentication</h4>
                    <p className="text-gray-600">Secure device onboarding with MAC binding and token auth</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Branding & Customization */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Custom Branded Hotspot Captive Portal</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create a professional first impression with fully customizable captive portals.
              Add your logo, colors, and branding to deliver a seamless customer experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Branding Control</h3>
              <p className="text-gray-600">Customize logos, colors, and messaging for your captive portal</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hotspot Management</h3>
              <p className="text-gray-600">Configure and manage multiple hotspots from one dashboard</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Engagement</h3>
              <p className="text-gray-600">Retain users with branded authentication experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reports & Analytics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Business Reports & Performance Metrics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get detailed insights into your business performance with comprehensive reports covering revenue,
              customer engagement, network usage, and payment trends.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue Reports</h3>
              <p className="text-gray-600">Track income, expenses, and profit margins across all locations</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Analytics</h3>
              <p className="text-gray-600">Monitor customer growth, churn rates, and engagement metrics</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Exportable Data</h3>
              <p className="text-gray-600">Export reports in PDF, Excel, or CSV for further analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Helping ISPs scale Operations
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who have transformed their billing and network operations.
            Our platform is designed to help you scale your business efficiently and effectively.
          </p>
          <Link to="/dashboard/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
                  <Wifi className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ISP Billing</span>
              </div>
              <p className="text-sm text-gray-400">
                Making ISP management easy and efficient for customers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><Link to="/dashboard/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>Copyright © {new Date().getFullYear()} ISP Billing System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
