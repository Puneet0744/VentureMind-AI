import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, Target, Lightbulb,
  ArrowRight, Sparkles, BarChart3, Search, ShieldCheck, Activity,
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[760px] h-[760px] bg-accent-500/12 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-40 w-96 h-96 bg-cyan-500/12 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-[520px] h-[520px] bg-brand-500/12 rounded-full blur-3xl" />
        <div className="hero-grid absolute inset-0 opacity-45" />
        <div className="aurora-ring w-[820px] h-[820px] top-8 left-1/2 -translate-x-1/2" />
        <div className="aurora-ring w-[640px] h-[640px] top-28 left-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="pt-16 pb-14">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 glass-card px-4 py-2 text-xs text-brand-200 font-medium mb-6">
                <Sparkles size={12} />
                <span>Startup Readiness + Market Intelligence Suite</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5 text-white">
                Turn Raw Ideas Into
                <span className="block gradient-text">Investor-Ready Startup Plans</span>
              </h1>

              <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                Generate new startup ideas or validate existing ones with a complete AI workflow
                covering market study, competitor gaps, pricing strategy, and launch roadmap.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-7">
                <button onClick={() => navigate('/generate')} className="btn-primary flex items-center justify-center gap-2 text-base">
                  Generate Startup Idea
                  <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/validate')} className="btn-secondary flex items-center justify-center gap-2 text-base">
                  <Search size={18} />
                  Validate My Idea
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
                {[{ label: 'Ideas analyzed', value: '1.2K+' }, { label: 'Avg analysis time', value: '24s' }, { label: 'Score dimensions', value: '10+' }].map((item) => (
                  <div key={item.label} className="glass-card px-3 py-3">
                    <p className="text-[11px] text-white/45">{item.label}</p>
                    <p className="text-lg font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="glass-card p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute -top-28 -right-14 w-52 h-52 rounded-full bg-brand-400/20 blur-3xl" />
                <div className="absolute -bottom-28 -left-14 w-52 h-52 rounded-full bg-accent-400/20 blur-3xl" />

                <div className="relative rounded-2xl border border-white/10 bg-dark-900/70 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs text-white/45">Current Evaluation</p>
                      <p className="text-white font-semibold">AI HealthOps Assistant</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Viable
                    </span>
                  </div>

                  <div className="space-y-3 mb-5">
                    {[{ icon: Activity, label: 'Market demand', score: '86/100' }, { icon: ShieldCheck, label: 'Competitive gap', score: '79/100' }, { icon: TrendingUp, label: 'Revenue confidence', score: '83/100' }].map((row) => (
                      <div key={row.label} className="flex items-center justify-between glass-card px-3 py-2.5">
                        <div className="flex items-center gap-2 text-white/75 text-sm">
                          <row.icon size={14} className="text-brand-300" />
                          {row.label}
                        </div>
                        <span className="text-sm font-semibold text-white">{row.score}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-3 bg-gradient-to-br from-brand-500/20 to-transparent border-brand-400/35">
                      <p className="text-[11px] text-white/45 mb-1">Readiness Score</p>
                      <p className="text-xl font-black gradient-text">82%</p>
                    </div>
                    <div className="glass-card p-3 bg-gradient-to-br from-accent-500/22 to-transparent border-accent-400/35">
                      <p className="text-[11px] text-white/45 mb-1">Market Window</p>
                      <p className="text-xl font-black text-white">Q3 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

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
              Two Dashboards.{' '}
              <span className="gradient-text">One Startup Engine.</span>
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
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-brand-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-brand-500 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform duration-300">
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
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500 to-brand-500 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-accent-500/30 group-hover:scale-110 transition-transform duration-300">
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
              Everything You Need to <span className="gradient-text">Validate Fast</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.08} />
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-10"
        >
          <div className="glass-card p-8 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10">
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

        <section className="py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-brand-600/10 to-accent-600/10 pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 relative">
              Ready to Build Your Next{' '}
              <span className="gradient-text">Unicorn?</span>
            </h2>
            <p className="text-white/50 text-sm mb-7 relative">
              Start with an industry. Let AI do the heavy lifting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <button onClick={() => navigate('/generate')} className="btn-primary flex items-center justify-center gap-2">
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
