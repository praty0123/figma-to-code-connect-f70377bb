import { Link } from 'react-router-dom';
import { Heart, Shield, Users, Video, Activity, Bell, Calendar, FileText, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="size-8 text-green-600" />
              <span className="text-2xl text-green-900">AuraHome</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-neutral-700 hover:text-green-600 transition-colors">Features</a>
              <a href="#pricing" className="text-neutral-700 hover:text-green-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-neutral-700 hover:text-green-600 transition-colors">Testimonials</a>
              <a href="#contact" className="text-neutral-700 hover:text-green-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl text-green-900 mb-6">
                Empowering senior living with care, transparency, and connection
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                AuraHome brings families, residents, and caregivers together through a comprehensive digital platform designed for modern senior living communities in India.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Start Free Trial
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-8 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600" />
                  <span>Setup in minutes</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl shadow-2xl overflow-hidden bg-white p-8">
                <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <Heart className="size-24 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-green-900 mb-4">Comprehensive Care Management</h2>
            <p className="text-xl text-neutral-600">Everything you need to manage senior living communities</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Users className="size-8 text-green-600" />}
              title="For Families"
              description="Stay connected with real-time updates on daily care, health vitals, and activities"
            />
            <FeatureCard
              icon={<Heart className="size-8 text-blue-600" />}
              title="For Residents"
              description="Simple tablet interface for video calls, activity booking, and requesting help"
            />
            <FeatureCard
              icon={<Shield className="size-8 text-amber-600" />}
              title="For Staff"
              description="Streamlined care tasks, incident reporting, and duty management"
            />
            <FeatureCard
              icon={<Activity className="size-8 text-purple-600" />}
              title="For Admins"
              description="Comprehensive analytics, compliance tracking, and facility management"
            />
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl text-green-900 mb-6">Family Dashboard</h3>
              <ul className="space-y-4">
                <FeatureItem icon={<Activity />} text="Real-time health monitoring with wearable integration" />
                <FeatureItem icon={<Video />} text="Video calls and daily care updates with photos" />
                <FeatureItem icon={<Bell />} text="Instant SOS alerts and abnormal vitals notifications" />
                <FeatureItem icon={<FileText />} text="Transparent billing and payment tracking" />
              </ul>
            </div>
            <div>
              <h3 className="text-3xl text-green-900 mb-6">Care Management</h3>
              <ul className="space-y-4">
                <FeatureItem icon={<Calendar />} text="Medication reminders and adherence tracking" />
                <FeatureItem icon={<Users />} text="Staff duty roster and task assignment" />
                <FeatureItem icon={<Shield />} text="Incident reporting and emergency workflows" />
                <FeatureItem icon={<Activity />} text="Activity booking and participation tracking" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-green-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-neutral-600">Choose the plan that fits your community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="₹999"
              period="/month"
              features={[
                'Up to 20 residents',
                'Family app access',
                'Basic health monitoring',
                'Email support',
              ]}
            />
            <PricingCard
              name="Professional"
              price="₹2,999"
              period="/month"
              features={[
                'Up to 100 residents',
                'All Starter features',
                'Staff & Admin dashboards',
                'Wearable integration',
                'Priority support',
              ]}
              highlighted
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              period=""
              features={[
                'Unlimited residents',
                'All Professional features',
                'Multi-facility support',
                'Custom integrations',
                'Dedicated account manager',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-green-900 mb-4">Trusted by Families Across India</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="AuraHome gives me peace of mind. I can check on my mother's health from Mumbai while she's in Bangalore. The daily updates are invaluable."
              author="Priya Sharma"
              role="Family Member"
            />
            <TestimonialCard
              quote="The tablet interface is so simple. I can video call my children and join yoga classes with just one tap. It's wonderful!"
              author="Mrs. Lakshmi Reddy"
              role="Resident, 72 years"
            />
            <TestimonialCard
              quote="As a facility manager, AuraHome has transformed our operations. Staff efficiency is up, and families are happier than ever."
              author="Dr. Rajesh Kumar"
              role="Community Manager"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-green-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-neutral-600">We're here to help you get started</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <ContactCard
              icon={<Phone />}
              title="Phone"
              content="+91 98765 43210"
            />
            <ContactCard
              icon={<Mail />}
              title="Email"
              content="hello@aurahome.in"
            />
            <ContactCard
              icon={<MapPin />}
              title="Office"
              content="Bangalore, India"
            />
          </div>

          <Card className="p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tell us about your requirements"
                />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">Send Message</Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="size-6" />
                <span className="text-xl">AuraHome</span>
              </div>
              <p className="text-green-100">Empowering senior living with care and connection</p>
            </div>
            <div>
              <h4 className="mb-4">Product</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-green-800 text-center text-green-100">
            <p>© 2025 AuraHome. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </Card>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="text-green-600 mt-1">{icon}</div>
      <span className="text-neutral-700">{text}</span>
    </li>
  );
}

function PricingCard({
  name,
  price,
  period,
  features,
  highlighted = false,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card className={`p-8 ${highlighted ? 'ring-2 ring-green-600 shadow-xl' : ''}`}>
      {highlighted && (
        <div className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded-full mb-4">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl text-neutral-900 mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl text-green-900">{price}</span>
        <span className="text-neutral-600">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-neutral-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Button className={`w-full ${highlighted ? 'bg-green-600 hover:bg-green-700' : ''}`} variant={highlighted ? 'default' : 'outline'}>
        Get Started
      </Button>
    </Card>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card className="p-6">
      <p className="text-neutral-700 mb-4 italic">"{quote}"</p>
      <div>
        <p className="text-neutral-900">{author}</p>
        <p className="text-sm text-neutral-500">{role}</p>
      </div>
    </Card>
  );
}

function ContactCard({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
        {icon}
      </div>
      <h4 className="text-neutral-900 mb-2">{title}</h4>
      <p className="text-neutral-600">{content}</p>
    </div>
  );
}
