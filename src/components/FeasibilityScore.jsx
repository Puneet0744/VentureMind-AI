import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

function getRating(score) {
  if (score >= 80) return { label: 'Highly Viable', color: '#22c55e' };
  if (score >= 60) return { label: 'Promising', color: '#3b82f6' };
  if (score >= 40) return { label: 'Moderate Risk', color: '#f59e0b' };
  return { label: 'High Risk', color: '#ef4444' };
}

export default function FeasibilityScore({ score = 0, risks = [] }) {
  const { label, color } = getRating(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-lg shadow-lg">
          🎯
        </div>
        <h3 className="font-bold text-white text-base">Startup Readiness Score</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Circular score */}
        <div className="w-36 h-36 flex-shrink-0">
          <CircularProgressbar
            value={score}
            text={`${score}%`}
            styles={buildStyles({
              pathColor: color,
              textColor: '#fff',
              trailColor: 'rgba(255,255,255,0.08)',
              textSize: '20px',
              pathTransitionDuration: 1.2,
            })}
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="section-label">Viability Rating</p>
            <span
              className="inline-block text-sm font-bold px-3 py-1 rounded-full border"
              style={{ color, borderColor: color, background: `${color}18` }}
            >
              {label}
            </span>
          </div>

          {risks.length > 0 && (
            <div>
              <p className="section-label flex items-center gap-1">
                <AlertTriangle size={11} /> Risk Factors
              </p>
              <ul className="space-y-1.5">
                {risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
