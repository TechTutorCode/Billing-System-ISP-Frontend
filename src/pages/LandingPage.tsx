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
  Sparkles,
  Menu,
  X,
  Star,
  Play,
  Package,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState } from 'react';

// Image component with fallback
const DashboardImage = ({ 
  src, 
  alt, 
  fallbackIcon: FallbackIcon, 
  fallbackText 
}: { 
  src: string; 
  alt: string; 
  fallbackIcon: React.ComponentType<{ className?: string }>; 
  fallbackText: string;
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <FallbackIcon className="h-16 w-16 mb-3" />
        <p className="text-sm font-medium">{fallbackText}</p>
        <p className="text-xs mt-1">Loading image...</p>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Wifi,
      title: 'Hotspot Management',
      description: 'Complete hotspot configuration and management with MikroTik integration, MAC-based vouchers, and customizable captive portals.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Smartphone,
      title: 'Mobile App Ready',
      description: 'Manage your ISP operations on the go. Monitor network status, manage accounts, and handle billing from anywhere.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Ensure user privacy and network integrity with SSL, secure token-based authentication, IP binding, and RADIUS integration.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: CreditCard,
      title: 'Real-time Payments',
      description: 'Enable instant top-ups and package purchases via M-Pesa, card payments, or vouchers with automatic activation.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track revenue across multiple locations, monitor payment trends, and make data-driven business decisions.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Settings,
      title: 'Router Management',
      description: 'Effortlessly manage MikroTik or other router configurations remotely with bandwidth shaping and session rules.',
      color: 'from-teal-500 to-blue-500',
    },
  ];

  const paymentProviders = [
    { name: 'M-Pesa', color: 'bg-green-600' },
    { name: 'Paystack', color: 'bg-blue-600' },
    { name: 'Flutterwave', color: 'bg-purple-600' },
    { name: 'ClickPesa', color: 'bg-orange-600' },
  ];

  const stats = [
    { value: '1000+', label: 'Active ISPs' },
    { value: '50K+', label: 'Managed Devices' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ISP Billing
                </span>
                <p className="text-xs text-gray-500 -mt-1">Management System</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </a>
              <a href="#solutions" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Solutions
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </a>
              <Link to="/dashboard/login">
                <Button variant="outline" className="font-medium">Sign In</Button>
              </Link>
              <Link to="/dashboard/login">
                <Button className="font-medium shadow-md hover:shadow-lg transition-shadow">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <a href="#features" className="block text-gray-700 hover:text-blue-600 font-medium py-2">
              Features
            </a>
            <a href="#solutions" className="block text-gray-700 hover:text-blue-600 font-medium py-2">
              Solutions
            </a>
            <a href="#about" className="block text-gray-700 hover:text-blue-600 font-medium py-2">
              About
            </a>
            <Link to="/dashboard/login" className="block">
              <Button variant="outline" className="w-full font-medium">Sign In</Button>
            </Link>
            <Link to="/dashboard/login" className="block">
              <Button className="w-full font-medium">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 fill-blue-600" />
              <span>Trusted by thousands of ISPs across Africa</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Scale billing & network
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                operations effortlessly
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              The most complete billing system with Wireless and PPPoE support, custom user portals,
              self-service capabilities, hotspot roaming, and enterprise-grade features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/dashboard/login">
                <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-2">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hero Dashboard Screenshot */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="relative rounded-3xl shadow-2xl border-8 border-white overflow-hidden bg-white">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 flex-1 bg-white rounded-lg px-4 py-1.5 text-sm text-gray-500">
                  dashboard.example.com
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <DashboardImage 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop"
                  alt="ISP Billing Dashboard Overview"
                  fallbackIcon={BarChart3}
                  fallbackText="Dashboard Screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What makes us different?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                  className="group relative p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`bg-gradient-to-br ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Payment Integrations */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Integrated Payment Gateways
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Accept payments seamlessly with our integrated payment gateway solutions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {paymentProviders.map((provider, index) => (
              <div
                key={index}
                className={`${provider.color} p-8 rounded-2xl text-white text-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
              >
                <div className="text-2xl font-bold">{provider.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edge Infrastructure */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Edge Computing for Maximum Performance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deploy critical services at the edge, close to your network infrastructure,
              ensuring minimal latency and the best experience for your customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Reduced Latency</h3>
              <p className="text-gray-600 leading-relaxed">
                Deploy services at the edge, close to your network infrastructure, minimizing round-trip times and providing instant authentication responses.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Enhanced Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Keep sensitive authentication and access control services within your network perimeter, reducing exposure to external threats.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Server className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Better Reliability</h3>
              <p className="text-gray-600 leading-relaxed">
                Local deployment ensures your services remain operational even if external connectivity is disrupted, keeping your customers connected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Billing & Analytics */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Complete Billing System with Real-time Revenue Insights
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Automate your entire billing process from subscription management to invoice generation.
                Track revenue across multiple locations, monitor payment trends, and make data-driven business decisions.
              </p>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Automated Invoicing</h4>
                    <p className="text-blue-100">Generate and send invoices automatically based on customer plans</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Revenue Analytics</h4>
                    <p className="text-blue-100">Visualize revenue trends, customer growth, and business performance</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Multi-location Tracking</h4>
                    <p className="text-blue-100">Monitor activity and engagement across all your service locations</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                  <DashboardImage 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop"
                    alt="Revenue Analytics Dashboard"
                    fallbackIcon={BarChart3}
                    fallbackText="Analytics Dashboard"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Screenshots Showcase */}
      <section id="solutions" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Dashboard at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience intuitive management with our comprehensive dashboard. Monitor everything from one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl shadow-2xl border-4 border-white overflow-hidden bg-white">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-gray-600 font-medium">Customer Management</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <DashboardImage 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80&auto=format&fit=crop"
                  alt="Customer Management Dashboard"
                  fallbackIcon={Users}
                  fallbackText="Customer Dashboard"
                />
              </div>
            </div>
            
            <div className="rounded-2xl shadow-2xl border-4 border-white overflow-hidden bg-white">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-gray-600 font-medium">Hotspot Management</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <DashboardImage 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80&auto=format&fit=crop"
                  alt="Hotspot Management Dashboard"
                  fallbackIcon={Wifi}
                  fallbackText="Hotspot Dashboard"
                />
              </div>
            </div>
            
            <div className="rounded-2xl shadow-2xl border-4 border-white overflow-hidden bg-white">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-gray-600 font-medium">Package Management</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <DashboardImage 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop"
                  alt="Package Management Dashboard"
                  fallbackIcon={Package}
                  fallbackText="Package Dashboard"
                />
              </div>
            </div>
            
            <div className="rounded-2xl shadow-2xl border-4 border-white overflow-hidden bg-white">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-gray-600 font-medium">Payment Analytics</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                <DashboardImage 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop"
                  alt="Payment Analytics Dashboard"
                  fallbackIcon={CreditCard}
                  fallbackText="Payments Dashboard"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Device Management */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl shadow-2xl border-4 border-gray-200 overflow-hidden bg-white">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-sm text-gray-600 font-medium">Device Management</span>
                </div>
                <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <DashboardImage 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80&auto=format&fit=crop"
                    alt="Device Management Dashboard"
                    fallbackIcon={Server}
                    fallbackText="Device Dashboard"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Advanced Device Management
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Securely manage and monitor all customer devices. Control access, track bandwidth usage,
                and ensure network security with our powerful device management tools.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">WireGuard Integration</h4>
                    <p className="text-gray-600 leading-relaxed">Secure VPN connections with modern WireGuard protocol</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">Bandwidth Monitoring</h4>
                    <p className="text-gray-600 leading-relaxed">Real-time bandwidth tracking and usage analytics per device</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">Device Authentication</h4>
                    <p className="text-gray-600 leading-relaxed">Secure device onboarding with MAC binding and token auth</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Branding & Customization */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Custom Branded Hotspot Captive Portal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create a professional first impression with fully customizable captive portals.
              Add your logo, colors, and branding to deliver a seamless customer experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Full Branding Control</h3>
              <p className="text-gray-600 leading-relaxed">Customize logos, colors, and messaging for your captive portal</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Wifi className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hotspot Management</h3>
              <p className="text-gray-600 leading-relaxed">Configure and manage multiple hotspots from one dashboard</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer Engagement</h3>
              <p className="text-gray-600 leading-relaxed">Retain users with branded authentication experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reports & Analytics */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Business Reports & Performance Metrics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get detailed insights into your business performance with comprehensive reports covering revenue,
              customer engagement, network usage, and payment trends.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Revenue Reports</h3>
              <p className="text-gray-600 leading-relaxed">Track income, expenses, and profit margins across all locations</p>
            </div>
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer Analytics</h3>
              <p className="text-gray-600 leading-relaxed">Monitor customer growth, churn rates, and engagement metrics</p>
            </div>
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Exportable Data</h3>
              <p className="text-gray-600 leading-relaxed">Export reports in PDF, Excel, or CSV for further analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            Helping ISPs scale Operations
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of satisfied customers who have transformed their billing and network operations.
            Our platform is designed to help you scale your business efficiently and effectively.
          </p>
          <Link to="/dashboard/login">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-7 h-auto shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">ISP Billing</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Making ISP management easy and efficient for customers.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#solutions" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><Link to="/dashboard/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>Copyright © {new Date().getFullYear()} ISP Billing System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
