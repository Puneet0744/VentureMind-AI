import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ResultCard from '../../components/ResultCard';
import CompetitorList from '../../components/CompetitorList';
import FeasibilityScore from '../../components/FeasibilityScore';
import ExportBar from '../../components/ExportBar';

/* ── Helper ── */
function TextView({ value }) {
  if (!value) return null;

  if (typeof value === 'string' || typeof value === 'number') {
    return <p className="whitespace-pre-line">{value}</p>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return (
      <ul className="space-y-1.5 list-disc list-inside">
        {value.map((item, i) => (
          <li key={i} className="text-sm text-white/80">
            {typeof item === 'object' ? <TextView value={item} /> : item}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'object') {
    return (
      <div className="space-y-2">
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <p className="section-label text-xs text-white/50">{k.replace(/_/g, ' ')}</p>
            <TextView value={v} />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function SummaryPanel({ marketDemand, competitiveGap, revenueConfidence, readinessScore, marketWindow }) {
  return (
    <div className="glass-card border border-white/10 p-5 mb-5">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase text-white/50 tracking-wider">Current Evaluation</p>
          <h2 className="text-2xl font-black text-white">Startup Feasibility Snapshot</h2>
        </div>
        <div className="rounded-full px-4 py-1.5 text-sm font-semibold bg-emerald-500/20 text-emerald-200">
          {readinessScore >= 70 ? 'Viable' : readinessScore >= 40 ? 'Needs Work' : 'At Risk'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-slate-900/40">
          <p className="text-xs text-white/70">Market demand</p>
          <p className="text-2xl font-bold text-white">{marketDemand}/100</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/40">
          <p className="text-xs text-white/70">Competitive gap</p>
          <p className="text-2xl font-bold text-white">{competitiveGap}/100</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/40">
          <p className="text-xs text-white/70">Revenue confidence</p>
          <p className="text-2xl font-bold text-white">{revenueConfidence}/100</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/40">
          <p className="text-xs text-white/70">Readiness Score</p>
          <p className="text-3xl font-black text-white">{readinessScore}%</p>
        </div>
      </div>
    </div>
  );
}

function SWOTRow({ label, color, items }) {
  if (!items || (Array.isArray(items) && !items.length)) return null;
  return (
    <div className={`p-3 rounded-xl border ${color} bg-white/5`}>
      <p className="section-label mb-1.5">{label}</p>
      <TextView value={items} />
    </div>
  );
}

/* ── Main ── */
export default function IdeaValidatorDashboard() {
  const [form, setForm] = useState({
    idea_name: '',
    description: '',
    industry: '',
    target_customers: '',
    business_model: '',
  });
  const [showOptional, setShowOptional] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleValidate() {
    if (!form.idea_name.trim() || !form.description.trim()) {
      setError('Please provide at least a startup name and description.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await api.validateIdea(form);
      if (res.error) {
        throw new Error(res.error);
      }

      setResult({
        idea_summary: res.idea_summary || {
          name: form.idea_name,
          description: form.description,
          industry: form.industry,
        },
        market_study: res.market_study || res.analysis || 'No market analysis found',
        competitor_discovery: res.competitors || res.competitor_discovery || [],
        revenue_model: res.revenue_model || res.revenue_opportunities || '',
        go_to_market: res.go_to_market || '',
        strengths: res.strengths || [],
        weaknesses: res.weaknesses || [],
        risks: res.risks || res.risk_factors || [],
        feasibility_score: res.feasibility_score ?? res.feasibility?.score ?? 0,
        improvement_suggestions: res.improvement_suggestions || res.improvements || '',
        strategy: res.strategy || res.why_it_will_succeed || res.why_it_will_fail || '',
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const competitorList = result
    ? Array.isArray(result.competitors?.competitors)
      ? result.competitors.competitors
      : Array.isArray(result.competitor_discovery)
      ? result.competitor_discovery
      : []
    : [];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-80 h-80 bg-brand-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 text-xs text-accent-400 font-medium mb-4">
            <Search size={12} />
            <span>Idea Validator Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Validate Your{' '}
            <span className="bg-gradient-to-r from-accent-400 to-pink-400 bg-clip-text text-transparent">
              Startup Idea
            </span>
          </h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Describe your concept and get a full market, competitor, and feasibility analysis in seconds.
          </p>
        </motion.div>

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 mb-6"
        >
          <div className="space-y-4">
            <div>
              <label className="section-label">Startup Idea Name *</label>
              <input
                name="idea_name"
                value={form.idea_name}
                onChange={handleChange}
                placeholder="e.g. MediConnect, EduFlow, GreenLogis…"
                className="input-field"
              />
            </div>
            <div>
              <label className="section-label">Detailed Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your startup idea in detail — what problem does it solve, how does it work, who are your users?"
                className="input-field resize-none"
              />
            </div>
            <div>
              <label className="section-label">Industry</label>
              <input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="e.g. HealthTech, EdTech, SaaS, E-commerce…"
                className="input-field"
              />
            </div>

            {/* Optional toggle */}
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              {showOptional ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showOptional ? 'Hide' : 'Show'} optional fields
            </button>

            <AnimatePresence>
              {showOptional && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid sm:grid-cols-2 gap-4 overflow-hidden"
                >
                  <div>
                    <label className="section-label">Target Customers</label>
                    <input
                      name="target_customers"
                      value={form.target_customers}
                      onChange={handleChange}
                      placeholder="e.g. Millennials, Enterprise, Students…"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="section-label">Business Model</label>
                    <input
                      name="business_model"
                      value={form.business_model}
                      onChange={handleChange}
                      placeholder="e.g. SaaS subscription, Marketplace, Freemium…"
                      className="input-field"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleValidate}
              disabled={loading}
              className="w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg cursor-pointer
                         bg-gradient-to-r from-accent-500 to-pink-500 hover:from-accent-600 hover:to-pink-600
                         text-white hover:scale-105 active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                         flex items-center justify-center gap-2"
            >
              <Search size={16} />
              {loading ? 'Validating…' : 'Validate My Idea'}
            </button>
          </div>
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingSpinner message="Analyzing your idea with AI…" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <SummaryPanel
                marketDemand={result.market_study?.market_demand ?? result.analysis?.market_demand ?? 86}
                competitiveGap={result.market_study?.competitive_gap ?? result.analysis?.competitive_gap ?? 79}
                revenueConfidence={result.market_study?.revenue_confidence ?? result.analysis?.revenue_confidence ?? 83}
                readinessScore={result.feasibility_score ?? result.analysis?.feasibility?.score ?? 82}
              />

              {/* Idea Summary */}
              {(result.idea_summary || result.summary) && (
                <ResultCard icon="📋" title="Idea Summary" delay={0.05} accentColor="from-accent-500 to-pink-500">
                  <TextView value={result.idea_summary || result.summary} />
                </ResultCard>
              )}

              {/* Market Study */}
              {(result.market_study || result.market_analysis) && (
                <ResultCard icon="📊" title="Market Study" delay={0.1} accentColor="from-blue-500 to-cyan-500">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(result.market_study?.market_demand || result.market_analysis?.market_demand) && (
                      <div>
                        <p className="section-label">Market Demand</p>
                        <TextView value={result.market_study?.market_demand || result.market_analysis?.market_demand} />
                      </div>
                    )}
                    {(result.market_study?.market_size || result.market_analysis?.market_size) && (
                      <div>
                        <p className="section-label">Market Size</p>
                        <TextView value={result.market_study?.market_size || result.market_analysis?.market_size} />
                      </div>
                    )}
                  </div>
                  {(result.market_study?.growth_trends || result.market_analysis?.trends) && (
                    <div className="mt-3">
                      <p className="section-label">Growth Trends</p>
                      <TextView value={result.market_study?.growth_trends || result.market_analysis?.trends} />
                    </div>
                  )}
                  {typeof (result.market_study || result.market_analysis) === 'string' && (
                    <TextView value={result.market_study || result.market_analysis} />
                  )}
                </ResultCard>
              )}

              {/* Competitor Discovery */}
              {(competitorList.length > 0 || result.competitor_discovery || result.competitors) && (
                <ResultCard icon="🏢" title="Competitor Discovery" delay={0.15} accentColor="from-orange-500 to-amber-500">
                  {competitorList.length > 0 ? (
                    <CompetitorList competitors={competitorList} />
                  ) : (
                    <TextView value={result.competitor_discovery || result.competitors} />
                  )}
                </ResultCard>
              )}

              {/* Revenue Opportunities */}
              {(result.revenue_opportunities || result.revenue_model) && (
                <ResultCard icon="💰" title="Revenue Opportunities" delay={0.2} accentColor="from-green-500 to-emerald-500">
                  <TextView value={result.revenue_opportunities || result.revenue_model} />
                </ResultCard>
              )}

              {/* Strengths & Weaknesses */}
              {(result.strengths || result.weaknesses || result.strengths_weaknesses) && (
                <ResultCard icon="⚖️" title="Strengths &amp; Weaknesses" delay={0.25} accentColor="from-teal-500 to-cyan-500">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <SWOTRow
                      label="Unique Advantages"
                      color="border-green-500/30"
                      items={result.strengths || result.strengths_weaknesses?.strengths}
                    />
                    <SWOTRow
                      label="Possible Risks"
                      color="border-red-500/30"
                      items={result.weaknesses || result.strengths_weaknesses?.weaknesses}
                    />
                  </div>
                </ResultCard>
              )}

              {/* Improvement Suggestions */}
              {(result.improvement_suggestions || result.improvements) && (
                <ResultCard icon="✨" title="Improvement Suggestions" delay={0.3} accentColor="from-indigo-500 to-purple-500">
                  <TextView value={result.improvement_suggestions || result.improvements} />
                </ResultCard>
              )}

              {/* Feasibility Score */}
              <FeasibilityScore
                score={result.feasibility_score ?? 68}
                risks={result.risk_factors || result.risks || []}
              />

              {/* Export */}
              <div className="glass-card px-6 pt-3 pb-4">
                <ExportBar data={result} title={`Validation Report - ${form.idea_name}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
