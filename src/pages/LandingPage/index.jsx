import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, TrendingUp, Users, DollarSign, Target, Lightbulb,
  ArrowRight, Sparkles, BarChart3, Search,
} from 'lucide-react';

const features = [
  { icon: <Lightbulb size={18} />, title: 'AI Idea Generation', desc: 'Get unique startup ideas tailored to any industry with AI-powered brainstorming.' },
  { icon: <BarChart3 size={18} />, title: 'Market Analysis', desc: 'Deep dive into market size, demand trends, and target audience insights.' },
  { icon: <Search size={18} />, title: 'Competitor Discovery', desc: 'Automatically identify competitors and uncover market gaps you can exploit.' },
  { icon: <DollarSign size={18} />, title: 'Revenue Modeling', desc: 'Explore monetization strategies and pricing models tailored to your idea.' },
  { icon: <Target size={18} />, title: 'Go-To-Market Strategy', desc: 'Get actionable marketing and customer acquisition strategies.' },
  { icon: <TrendingUp size={18} />, title: 'Feasibility Scoring', desc: 'AI-powered readiness score with risk assessment to guide your next move.' },
];

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="glass-card p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
      <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-brand-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero ── */}
        <section className="pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 text-xs text-brand-300 font-medium mb-8"
          >
            <Sparkles size={12} />
            <span>Powered by Advanced AI &amp; Market Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5"
          >
            <span className="text-white">AI Powered Startup</span>
            <br />
            <span className="gradient-text">Idea &amp; Market</span>
            <br />
            <span className="text-white">Validation Platform</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Generate, analyze, and validate startup ideas using AI and market
            intelligence — built for founders, innovators, and hackathon winners.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button onClick={() => navigate('/generate')} className="btn-primary flex items-center justify-center gap-2 text-base">
              <Zap size={18} />
              Generate Startup Idea
              <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/validate')} className="btn-secondary flex items-center justify-center gap-2 text-base">
              <Search size={18} />
              Validate My Idea
            </button>
          </motion.div>
        </section>

        {/* ── Two Main Options ── */}
        <section className="py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="section-label tracking-widest">Choose Your Path</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Two Ways to{' '}
              <span className="gradient-text">Build Smarter</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Option 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate('/generate')}
              className="glass-card p-7 cursor-pointer hover:bg-white/10 hover:border-brand-500/40 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform duration-300">
                💡
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Generate Startup Idea</h3>
              <p className="text-white/55 text-sm leading-relaxed mb-4">
                Provide an industry or domain and let AI generate a complete startup concept
                — with market analysis, competitors, revenue model, and go-to-market strategy.
              </p>
              <div className="flex items-center gap-1.5 text-brand-400 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                Get Started <ArrowRight size={15} />
              </div>
            </motion.div>

            {/* Option 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate('/validate')}
              className="glass-card p-7 cursor-pointer hover:bg-white/10 hover:border-accent-500/40 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500 to-pink-500 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-accent-500/30 group-hover:scale-110 transition-transform duration-300">
                🔍
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Validate My Idea</h3>
              <p className="text-white/55 text-sm leading-relaxed mb-4">
                Already have an idea? Enter your startup concept and get a comprehensive
                market study, competitor comparison, feasibility score, and improvement tips.
              </p>
              <div className="flex items-center gap-1.5 text-accent-400 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                Validate Now <ArrowRight size={15} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section className="py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="section-label tracking-widest">Platform Capabilities</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Everything You Need to{' '}
              <span className="gradient-text">Launch with Confidence</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.08} />
            ))}
          </div>
        </section>

        {/* ── Stats row ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-10"
        >
          <div className="glass-card p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: '10+', label: 'Analysis Dimensions' },
                { value: 'AI', label: 'Powered Engine' },
                { value: '< 30s', label: 'Results Delivered' },
                { value: '100%', label: 'Client-side PDF Export' },
              ].map(({ value, label }, i) => (
                <div key={i}>
                  <p className="text-2xl sm:text-3xl font-black gradient-text">{value}</p>
                  <p className="text-white/45 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── CTA Footer ── */}
        <section className="py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-600/10 pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 relative">
              Ready to Build Your Next{' '}
              <span className="gradient-text">Unicorn?</span>
            </h2>
            <p className="text-white/50 text-sm mb-7 relative">
              Start with an industry. Let AI do the heavy lifting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <button onClick={() => navigate('/generate')} className="btn-primary flex items-center justify-center gap-2">
                <Zap size={16} />
                Generate an Idea
              </button>
              <button onClick={() => navigate('/validate')} className="btn-secondary flex items-center justify-center gap-2">
                <Search size={16} />
                Validate My Idea
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
