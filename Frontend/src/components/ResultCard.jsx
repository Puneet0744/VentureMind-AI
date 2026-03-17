import { motion } from 'framer-motion';

export default function ResultCard({ icon, title, children, delay = 0, accentColor = 'from-brand-500 to-accent-500' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentColor}`} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentColor} flex items-center justify-center text-lg shadow-lg`}>
          {icon}
        </div>
        <h3 className="font-bold text-white text-base">{title}</h3>
      </div>

      {/* Content */}
      <div className="text-white/75 text-sm leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}
