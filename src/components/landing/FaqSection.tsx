import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'You get full access for 14 days. No credit card required. At the end, choose a plan or cancel with no charges.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes. You can upgrade or downgrade anytime. Changes apply at the next billing cycle.',
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No setup fees. You only pay the subscription price for your chosen plan.',
  },
  {
    question: 'Do you support MikroTik and other routers?',
    answer: 'Yes. We support MikroTik for hotspots and PPPoE. Other routers can be integrated via our API.',
  },
  {
    question: 'What payment methods do you support?',
    answer: 'M-Pesa, Paystack, Flutterwave, card payments, and vouchers. We can add more gateways on request.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. Cancel whenever you want. You keep access until the end of your current billing period.',
  },
];

export function FaqSection() {
  return (
    <div id="faq" className="bg-gray-50 dark:bg-saas-black border-t border-gray-200 dark:border-gray-800">
      <div className="section-container py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Common questions about ISP Billing. Can&apos;t find an answer? Contact support.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-saas-darkGray rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 card-shadow">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 dark:border-gray-800 last:border-0">
                <AccordionTrigger className="text-left text-gray-900 dark:text-white text-sm hover:text-saas-primary py-3 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 text-sm pb-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
