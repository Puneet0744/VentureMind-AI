import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ResultCard from '../../components/ResultCard';
import CompetitorList from '../../components/CompetitorList';
import FeasibilityScore from '../../components/FeasibilityScore';
import ExportBar from '../../components/ExportBar';
import ProgressSteps from '../../components/ProgressSteps';

/* ── Helper ── */
function TextView({ value }) {
  if (!value) return null;
  if (typeof value === 'string') return <p className="whitespace-pre-line">{value}</p>;
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-1.5">
        {value.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
            <span>{typeof item === 'object' ? JSON.stringify(item) : item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="space-y-2">
      {Object.entries(value).map(([k, v]) => (
        <div key={k}>
          <p className="section-label">{k.replace(/_/g, ' ')}</p>
          <TextView value={v} />
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ── */
export default function IdeaGeneratorDashboard() {
  const [form, setForm] = useState({
    industry: '',
    target_market: '',
    budget_range: '',
    technology_preference: '',
  });
  const [showOptional, setShowOptional] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleGenerate() {
    if (!form.industry.trim()) {
      setError('Please enter an industry or domain.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    setStep(1);

    try {
      setStep(1);
      const ideaRes = await api.generateIdea(form);
      setStep(2);
      const marketRes = await api.marketAnalysis({ industry: form.industry, idea: ideaRes.idea });
      setStep(3);
      const compRes = await api.competitorAnalysis({ industry: form.industry, idea: ideaRes.idea });
      setStep(4);

      setResult({
        idea: ideaRes,
        market_analysis: marketRes,
        competitors: compRes,
        revenue_model: ideaRes.revenue_model || marketRes.revenue_model,
        go_to_market: ideaRes.go_to_market || marketRes.go_to_market,
        feasibility_score: ideaRes.feasibility_score ?? marketRes.feasibility_score ?? 72,
        risk_factors: ideaRes.risk_factors || marketRes.risk_factors || [],
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setStep(0);
    }
  }

  const competitorList = result
    ? Array.isArray(result.competitors?.competitors)
      ? result.competitors.competitors
      : typeof result.competitors?.competitors === 'object'
      ? Object.values(result.competitors.competitors)
      : []
    : [];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 text-xs text-brand-300 font-medium mb-4">
            <Zap size={12} />
            <span>Idea Generator Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Generate Your{' '}
            <span className="gradient-text">Next Big Idea</span>
          </h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Enter an industry and let AI craft a complete startup concept with deep market intelligence.
          </p>
        </motion.div>

        {/* ── Input Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 mb-6"
        >
          <div className="space-y-4">
            {/* Required */}
            <div>
              <label className="section-label">Industry / Domain *</label>
              <input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="e.g. Healthcare, EdTech, FinTech, Sustainability…"
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
                    <label className="section-label">Target Market</label>
                    <input
                      name="target_market"
                      value={form.target_market}
                      onChange={handleChange}
                      placeholder="e.g. Gen Z, SMBs, Hospitals…"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="section-label">Budget Range</label>
                    <input
                      name="budget_range"
                      value={form.budget_range}
                      onChange={handleChange}
                      placeholder="e.g. Bootstrapped, $50K–$200K…"
                      className="input-field"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="section-label">Technology Preference</label>
                    <input
                      name="technology_preference"
                      value={form.technology_preference}
                      onChange={handleChange}
                      placeholder="e.g. AI/ML, Blockchain, Mobile-first, No-code…"
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
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Zap size={16} />
              {loading ? 'Generating...' : 'Generate Startup Idea'}
            </button>
          </div>
        </motion.div>

        {/* ── Progress Steps ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProgressSteps currentStep={step} />
              <LoadingSpinner message={
                step === 1 ? 'Generating startup idea…' :
                step === 2 ? 'Analyzing market data…' :
                step === 3 ? 'Finding competitors…' :
                'Building strategy…'
              } />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Idea */}
              <ResultCard icon="💡" title="Generated Startup Idea" delay={0.05} accentColor="from-brand-500 to-accent-500">
                {result.idea?.startup_name && (
                  <h2 className="text-xl font-black text-white mb-1">{result.idea.startup_name}</h2>
                )}
                <TextView value={result.idea?.description || result.idea?.idea || result.idea} />
                {result.idea?.problem_statement && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="section-label">Problem Statement</p>
                    <TextView value={result.idea.problem_statement} />
                  </div>
                )}
                {result.idea?.solution_overview && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="section-label">Solution Overview</p>
                    <TextView value={result.idea.solution_overview} />
                  </div>
                )}
              </ResultCard>

              {/* Market Analysis */}
              {result.market_analysis && (
                <ResultCard icon="📊" title="Market Analysis" delay={0.1} accentColor="from-blue-500 to-cyan-500">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {result.market_analysis.market_size && (
                      <div>
                        <p className="section-label">Market Size</p>
                        <TextView value={result.market_analysis.market_size} />
                      </div>
                    )}
                    {result.market_analysis.target_audience && (
                      <div>
                        <p className="section-label">Target Audience</p>
                        <TextView value={result.market_analysis.target_audience} />
                      </div>
                    )}
                  </div>
                  {result.market_analysis.market_demand && (
                    <div className="mt-3">
                      <p className="section-label">Market Demand</p>
                      <TextView value={result.market_analysis.market_demand} />
                    </div>
                  )}
                  {result.market_analysis.trends && (
                    <div className="mt-3">
                      <p className="section-label">Industry Trends</p>
                      <TextView value={result.market_analysis.trends} />
                    </div>
                  )}
                  {!result.market_analysis.market_size && (
                    <TextView value={result.market_analysis} />
                  )}
                </ResultCard>
              )}

              {/* Competitors */}
              {(competitorList.length > 0 || result.competitors) && (
                <ResultCard icon="🏢" title="Competitor Analysis" delay={0.15} accentColor="from-orange-500 to-amber-500">
                  {competitorList.length > 0 ? (
                    <CompetitorList competitors={competitorList} />
                  ) : (
                    <TextView value={result.competitors} />
                  )}
                  {result.competitors?.market_gap && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="section-label">Market Gap Identified</p>
                      <TextView value={result.competitors.market_gap} />
                    </div>
                  )}
                </ResultCard>
              )}

              {/* Revenue Model */}
              {result.revenue_model && (
                <ResultCard icon="💰" title="Revenue Model" delay={0.2} accentColor="from-green-500 to-emerald-500">
                  <TextView value={result.revenue_model} />
                </ResultCard>
              )}

              {/* Go-To-Market */}
              {result.go_to_market && (
                <ResultCard icon="🚀" title="Go-To-Market Strategy" delay={0.25} accentColor="from-purple-500 to-indigo-500">
                  <TextView value={result.go_to_market} />
                </ResultCard>
              )}

              {/* Feasibility Score */}
              <FeasibilityScore
                score={result.feasibility_score || 72}
                risks={result.risk_factors || []}
              />

              {/* Export */}
              <div className="glass-card px-6 pt-3 pb-4">
                <ExportBar data={result} title={`Startup Idea Report - ${form.industry}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
