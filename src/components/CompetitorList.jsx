import { Building2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CompetitorList({ competitors = [] }) {
  if (!competitors.length) return null;

  return (
    <div className="space-y-3">
      {competitors.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center flex-shrink-0">
              <Building2 size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">{c.name || `Competitor ${i + 1}`}</p>
              {c.description && <p className="text-white/55 text-xs mt-0.5 leading-relaxed">{c.description}</p>}
              <div className="flex flex-wrap gap-3 mt-2">
                {c.strengths && (
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <TrendingUp size={11} />
                    <span>{Array.isArray(c.strengths) ? c.strengths.join(', ') : c.strengths}</span>
                  </div>
                )}
                {c.weaknesses && (
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <TrendingDown size={11} />
                    <span>{Array.isArray(c.weaknesses) ? c.weaknesses.join(', ') : c.weaknesses}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
