import type { LucideIcon } from 'lucide-react';
import {
  Zap,
  ThumbsUp,
  Shapes,
  Rocket,
  Check,
  Wifi,
  Shield,
  CreditCard,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react';

export const companiesLogo = [
  { name: 'Framer', logo: '/assets/companies-logo/framer.svg' },
  { name: 'Huawei', logo: '/assets/companies-logo/huawei.svg' },
  { name: 'Instagram', logo: '/assets/companies-logo/instagram.svg' },
  { name: 'Microsoft', logo: '/assets/companies-logo/microsoft.svg' },
  { name: 'Walmart', logo: '/assets/companies-logo/walmart.svg' },
];

export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Docs', href: '#docs' },
];

export const featuresData: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Zap,
    title: 'Lightning-fast setup',
    description: 'Launch production-ready pages in minutes with prebuilt components.',
  },
  {
    icon: ThumbsUp,
    title: 'Pixel perfect',
    description: 'Modern Figma-driven UI that translates to exact code.',
  },
  {
    icon: Shapes,
    title: 'Highly customizable',
    description: 'Tailwind utility-first classes make customization trivial.',
  },
  {
    icon: Rocket,
    title: 'Accessible & responsive',
    description: 'Built with accessibility and mobile-first design in mind.',
  },
];

export const ispFeaturesData: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Wifi, title: 'Hotspot Management', description: 'Complete hotspot configuration with MikroTik integration, MAC-based vouchers, and customizable captive portals.' },
  { icon: Shield, title: 'Security First', description: 'SSL, token-based auth, IP binding, and RADIUS integration for user privacy and network integrity.' },
  { icon: CreditCard, title: 'Real-time Payments', description: 'M-Pesa, cards, vouchers with instant top-ups and automatic activation.' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track revenue, payment trends, and make data-driven decisions across locations.' },
  { icon: Settings, title: 'Router Management', description: 'Manage MikroTik and other routers remotely with bandwidth shaping and session rules.' },
  { icon: Sparkles, title: 'Custom Portals', description: 'Branded captive portals with your logo, colors, and messaging.' },
];

export const faqsData = [
  {
    question: 'What is this billing system used for?',
    answer: 'This app helps ISPs manage billing, subscriptions, hotspots, and network devices. Automate invoicing, track payments, and integrate with M-Pesa, Paystack, and more.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start.',
  },
  {
    question: 'Can I change my subscription plan later?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time from your account settings.',
  },
  {
    question: 'How is my data secured?',
    answer: 'We use industry-standard encryption, regular security audits, and secure data centers to keep your data safe.',
  },
  {
    question: 'Do you offer customer support?',
    answer: 'Yes, our support team is available 24/7 via live chat and email. We also provide detailed documentation and tutorials.',
  },
];

export const pricingData: {
  title: string;
  price: number;
  mostPopular?: boolean;
  features: { name: string; icon: LucideIcon }[];
  buttonText: string;
}[] = [
  {
    title: 'Basic Plan',
    price: 29,
    features: [
      { name: 'Up to 100 customers', icon: Check },
      { name: '5 GB Storage', icon: Check },
      { name: 'Basic Support', icon: Check },
      { name: 'Community Access', icon: Check },
      { name: 'Hotspot basics', icon: Check },
    ],
    buttonText: 'Get Started',
  },
  {
    title: 'Pro Plan',
    price: 79,
    mostPopular: true,
    features: [
      { name: 'Up to 1,000 customers', icon: Check },
      { name: '50 GB Storage', icon: Check },
      { name: 'Priority Support', icon: Check },
      { name: 'M-Pesa & Paystack', icon: Check },
      { name: 'Advanced Analytics', icon: Check },
      { name: 'Custom branding', icon: Check },
    ],
    buttonText: 'Upgrade Now',
  },
  {
    title: 'Enterprise Plan',
    price: 149,
    features: [
      { name: 'Unlimited customers', icon: Check },
      { name: '500 GB Storage', icon: Check },
      { name: '24/7 Dedicated Support', icon: Check },
      { name: 'Custom Integrations', icon: Check },
      { name: 'SLA Guarantee', icon: Check },
    ],
    buttonText: 'Contact Sales',
  },
];
