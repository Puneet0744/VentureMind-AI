import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Processing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-brand-500/20 border-t-brand-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 animate-pulse" />
        </div>
      </div>
      <p className="text-white/60 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}
