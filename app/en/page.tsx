import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ChatSimulator from '@/components/ChatSimulator';
import InsightsDashboardAnimation from '@/components/InsightsDashboardAnimation';

// Helper component for divider
const Divider = () => <hr className="border-t border-gray-300 my-16 md:my-24" />;

// --- FAQ Data ---
const faqs = [
  {
    question: "How does InsureSim model conversations?",
    answer: "We use advanced AI language models trained on insurance scenarios to simulate realistic agent and customer dialogues based on defined personas and objectives.",
  },
  {
    question: "Can we customize the agent and customer personas?",
    answer: "Absolutely. You can define specific characteristics, goals, knowledge levels, and even objection handling styles for both agent and customer simulators.",
  },
  {
    question: "What kind of insights can we expect?",
    answer: "Our analytics dashboard provides metrics on conversion rates, response times, successful objection handling, script adherence, and identifies key moments for improvement.",
  },
  {
    question: "Is this suitable for training new agents?",
    answer: "Yes, it's an ideal tool for onboarding. New agents can practice in a safe, simulated environment and receive immediate feedback on their performance against various scenarios.",
  },
  {
    question: "How is this different from traditional role-playing?",
    answer: "InsureSim provides scalable, consistent, and data-driven practice. AI simulates a wider range of customer types and provides objective performance analysis unlike human-led role-play.",
  },
];

export default function InsuranceSimulationPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-[rgb(var(--foreground-rgb))]">
      {/* Simplified Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-3xl font-bold font-serif text-brand-blue">InsureSim</div>
          <button className="text-brand-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <hr className="border-t border-gray-400" />
        </div>
      </nav>

      <main className="pt-28 md:pt-36">
        <header className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="md:w-1/2 text-left">
            <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight mb-6">
              <span className="block bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                Simulate. Strategize.
              </span>
              <span className="block bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                Drive insurance success.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-2xl">Our platform models agent and customer dialogues to uncover winning sales strategies and build memorable experiences.</p>
            <div className="mt-10 flex items-center space-x-4">
              <a 
                href="#get-started"
                className="inline-flex items-center px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
              >
                Request a Demo
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
              <a 
                href="#get-started"
                className="inline-flex items-center px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
              >
                Register Interest
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <ChatSimulator />
          </div>
        </header>

        <hr className="border-t border-gray-400 mt-8 mb-8 md:mt-12 md:mb-12 max-w-7xl mx-auto px-6" />

        {/* --- New Service Description Section --- */}
        <section id="description" className="max-w-4xl mx-auto px-6 py-12 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">What is InsureSim?</h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            InsureSim is a cutting-edge AI platform designed to elevate insurance agent training and strategy development. 
            By simulating hyper-realistic customer interactions and analyzing performance, we empower teams to master 
            conversational sales, refine scripts, and ultimately drive significant improvements in conversion rates and customer satisfaction.
          </p>
        </section>
        {/* --- End New Section --- */}

        <hr className="border-t border-gray-400 mt-8 mb-8 md:mt-12 md:mb-12 max-w-7xl mx-auto px-6" />

        <section id="features" className="max-w-7xl mx-auto px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 text-left">
            <div className="relative overflow-hidden rounded-lg h-96 transition-transform duration-300 hover:scale-105 group">
              <div className="absolute inset-0 bg-brand-red z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <Image 
                    src="/images/agent.png" 
                    alt="Agent silhouette" 
                    width={300} 
                    height={300}
                    className="object-cover h-full w-full opacity-80 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <h3 className="text-2xl font-semibold font-serif text-white mb-2">Agent Modeling</h3>
                <p className="text-base text-white/90">Build realistic agent personas to train your team effectively.</p>
              </div>
              <div className="absolute bottom-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl">→</span>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg h-96 transition-transform duration-300 hover:scale-105 group">
              <div className="absolute inset-0 bg-brand-red z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <Image 
                    src="/images/user_sim.png" 
                    alt="Customer silhouette" 
                    width={300} 
                    height={300}
                    className="object-cover h-full w-full opacity-80 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <h3 className="text-2xl font-semibold font-serif text-white mb-2">Customer Simulation</h3>
                <p className="text-base text-white/90">Replicate real policyholder behaviors and objections.</p>
              </div>
              <div className="absolute bottom-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl">→</span>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg h-96 transition-transform duration-300 hover:scale-105 group">
              <div className="absolute inset-0 bg-brand-red z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <Image 
                    src="/images/analysis.png" 
                    alt="Analytics visualization" 
                    width={300} 
                    height={300}
                    className="object-cover h-full w-full opacity-80 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <h3 className="text-2xl font-semibold font-serif text-white mb-2">Analytics Dashboard</h3>
                <p className="text-base text-white/90">Get actionable insights in real time to optimize strategies.</p>
              </div>
              <div className="absolute bottom-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl">→</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-t border-gray-400 my-4 md:my-6 max-w-6xl mx-auto px-6" />

        <section id="insights" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Deep‑Dive Insights</h2>
              <ul className="mt-6 space-y-3 text-lg list-none pl-0">
                <li>✓ Conversion lift analysis</li>
                <li>✓ Response time improvements</li>
                <li>✓ Success rate by persona</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <InsightsDashboardAnimation />
            </div>
          </div>
        </section>

        <hr className="border-t border-gray-400 my-8 md:my-12 max-w-6xl mx-auto px-6" />

        {/* FAQ Section (Replaces Testimonials) */}
        <section id="faq" className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-left"> 
          {/* Changed heading */}
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-12">Frequently Asked Questions</h2> 
          {/* Map over FAQ data */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details key={index} className="group border-b border-gray-400 pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none py-2">
                  <span className="font-semibold text-lg group-open:text-brand-cyan">{faq.question}</span>
                  {/* Simple Chevron Icon */}
                  <span className="transition-transform duration-300 group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </summary>
                <p className="mt-3 text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <hr className="border-t border-gray-400 my-8 md:my-12 max-w-6xl mx-auto px-6" />

        {/* --- Combined Contact/Register Section --- */}
        <section id="get-started" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:space-x-12 md:items-stretch">
            {/* Left Side: Define Scenario */}
            <div className="md:w-1/2 mb-12 md:mb-0 flex flex-col">
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-left">Define Your Scenario</h2>
              <form className="mt-8 space-y-4 text-left flex flex-col flex-grow">
                <input 
                  type="text" 
                  placeholder="Customer Name (e.g., Alex Johnson)" 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent" 
                  required 
                />
                <input 
                  type="number" 
                  placeholder="Age (e.g., 35)" 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Occupation (e.g., Software Engineer)" 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent" 
                />
                <textarea 
                  placeholder="Describe the detailed scenario or request (e.g., Young couple needs life insurance)" 
                  rows={3} 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent"
                  required
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center mt-auto px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
                >
                  Generate Simulation Persona
                  <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </form>
            </div>

            {/* Vertical Divider - Hidden on mobile */} 
            <div className="hidden md:block border-l border-gray-400 mx-6"></div>

            {/* Right Side: Register Interest */}
            <div className="md:w-1/2 flex flex-col">
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-left">Register Your Interest</h2>
              <form className="mt-8 space-y-6 text-left flex flex-col flex-grow">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent" 
                  required 
                />
                <textarea 
                  placeholder="Your comments or questions (optional)" 
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent"
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center mt-auto px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
                >
                  Register
                  <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </form>
            </div>
          </div>
        </section>
        {/* --- End Combined Section --- */}

      </main>

      <footer className="mt-auto text-gray-500 py-8 border-t border-gray-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-brand-blue">Privacy</a>
            <a href="#" className="hover:text-brand-blue">Terms</a>
            <a href="#" className="hover:text-brand-blue">Contact</a>
          </div>
          <p>© 2025 InsureSim.</p>
        </div>
      </footer>
    </div>
  );
} 