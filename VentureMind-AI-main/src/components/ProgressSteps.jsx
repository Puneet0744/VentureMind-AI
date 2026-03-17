import { motion } from 'framer-motion';

const steps = [
  { id: 1, label: 'Generating Idea', icon: '💡' },
  { id: 2, label: 'Analyzing Market', icon: '📊' },
  { id: 3, label: 'Finding Competitors', icon: '🏢' },
  { id: 4, label: 'Building Strategy', icon: '🚀' },
];

export default function ProgressSteps({ currentStep }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4">
      {steps.map(({ id, label, icon }) => {
        const done = currentStep > id;
        const active = currentStep === id;
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: id * 0.15 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all duration-500 ${
              done
                ? 'bg-green-500/15 border-green-500/40 text-green-400'
                : active
                ? 'bg-brand-500/20 border-brand-400/50 text-brand-300 shadow-lg shadow-brand-500/20'
                : 'bg-white/5 border-white/10 text-white/30'
            }`}
          >
            <span>{done ? '✓' : icon}</span>
            <span>{label}</span>
            {active && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
