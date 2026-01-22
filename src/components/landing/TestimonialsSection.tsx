const testimonials = [
  {
    text: 'Implementing ISP Billing has been a game-changer. Hotspot management, M-Pesa, and analytics in one place. Our team is more productive and our subscribers are happier.',
    author: 'Sarah Johnson',
    position: 'CTO, TechNet Solutions',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100',
  },
  {
    text: 'Support is exceptional. They helped us migrate from our old billing system and set up MikroTik integration. We went live in days, not months.',
    author: 'Michael Chen',
    position: 'Operations Director, Nexus ISP',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100',
  },
  {
    text: 'We tried several platforms before. ISP Billing offers the right balance of features and ease of use. Custom captive portals and M-Pesa were must-haves for us.',
    author: 'Emily Rodriguez',
    position: 'Product Manager, Innovation Labs',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100',
  },
];

export function TestimonialsSection() {
  return (
    <div className="bg-saas-black">
      <div className="section-container py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Trusted by <span className="gradient-text">ISPs</span> Everywhere
          </h2>
          <p className="text-gray-400 text-sm">
            See what operators say about our billing and hotspot platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-saas-darkGray to-saas-black border border-gray-800 rounded-xl p-5 card-shadow"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-saas-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-300 text-sm mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-semibold text-white text-sm">{testimonial.author}</p>
                  <p className="text-gray-400 text-xs">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
