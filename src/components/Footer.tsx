import React from 'react';
import { GitHubUser } from '../types/github';
import { Github, Rocket, ArrowUp, Heart, Code2, Globe } from 'lucide-react';

interface FooterProps {
  user: GitHubUser | null;
  onOpenDeployGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ user, onOpenDeployGuide }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Brand & info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {user?.name || user?.login || 'Portofolio Proyek'}
              </span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300/40">
                GitHub Pages Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Dibuat khusus untuk build otomatis di GitHub Pages dengan Vite, React 19, dan Tailwind CSS. Terhubung langsung dengan repositori GitHub publik.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Panduan GitHub Pages</span>
            </button>

            {user && (
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <Github className="w-3.5 h-3.5" />
                <span>@{user.login}</span>
              </a>
            )}

            <button
              onClick={scrollToTop}
              title="Kembali ke atas"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1">
            <span>Dirancang dengan</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>untuk ekosistem open-source & pengembang UMKM Indonesia.</span>
          </div>
          <div>
            100% Bebas Biaya Hosting via GitHub Pages
          </div>
        </div>

      </div>
    </footer>
  );
};
