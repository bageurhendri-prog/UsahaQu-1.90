import React from 'react';
import { GitHubUser } from '../types/github';
import { 
  Github, 
  Rocket, 
  Settings, 
  Sun, 
  Moon, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  user: GitHubUser | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenDeployGuide: () => void;
  onOpenSettings: () => void;
  isFallback: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onOpenDeployGuide,
  onOpenSettings,
  isFallback,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & User Handle */}
          <div className="flex items-center gap-3">
            <a 
              href="#top" 
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-black text-base shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                    {user?.name || user?.login || 'GitPortfolio'}
                  </span>
                  <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                    GitHub Pages
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
                  github.com/{user?.login || 'repo'}
                </p>
              </div>
            </a>

            {isFallback && (
              <span 
                title="Menggunakan mode data offline/cache"
                className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-md border border-amber-300/50"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Demo / Cache
              </span>
            )}
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Deploy to GitHub Pages Guide Button */}
            <button
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4 animate-bounce" />
              <span className="hidden xs:inline">Deploy Pages</span>
              <span className="xs:hidden">Deploy</span>
            </button>

            {/* Change Username / Settings */}
            <button
              onClick={onOpenSettings}
              title="Ganti Username GitHub / Token"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden md:inline">Ganti Akun</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* GitHub Profile Link */}
            {user && (
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center cursor-pointer"
                title="Buka profil GitHub asli"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
