import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/generate', label: 'Idea Generator' },
    { to: '/validate', label: 'Web Scrapper' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === to
                    ? 'bg-brand-500/20 text-brand-200 border border-brand-500/40'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden sm:flex items-center">
            <span className="text-[11px] px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/70 flex items-center gap-1.5">
              AI Market Intelligence
            </span>
          </div>

          <button
            className="sm:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t border-white/10 bg-dark-900/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname === to
                  ? 'bg-brand-500/20 text-brand-300'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
