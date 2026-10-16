import React, { useState } from 'react';
import { 
  X, 
  User, 
  KeyRound, 
  Save, 
  RotateCcw, 
  ExternalLink,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { getStoredToken, saveStoredToken, saveStoredUsername } from '../services/githubService';

interface UserConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onApplyConfig: (username: string) => void;
}

export const UserConfigModal: React.FC<UserConfigModalProps> = ({
  isOpen,
  onClose,
  currentUsername,
  onApplyConfig,
}) => {
  const [usernameInput, setUsernameInput] = useState(currentUsername);
  const [tokenInput, setTokenInput] = useState(getStoredToken() || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim() || 'bageurhendri';
    saveStoredUsername(cleanUser);
    saveStoredToken(tokenInput.trim() || null);
    
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onApplyConfig(cleanUser);
      onClose();
    }, 700);
  };

  const handleQuickSelect = (name: string) => {
    setUsernameInput(name);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Ganti Akun & Konfigurasi GitHub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih username GitHub mana saja untuk menghasilkan portofolio otomatis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs sm:text-sm">
          
          {/* GitHub Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Username GitHub:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                github.com/
              </span>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="bageurhendri"
                className="w-full pl-28 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>
          </div>

          {/* Quick presets suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Contoh Akun Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              {['bageurhendri', 'torvalds', 'shadcn', 'tailwindlabs'].map((u) => (
                <button
                  type="button"
                  key={u}
                  onClick={() => handleQuickSelect(u)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                    usernameInput.toLowerCase() === u.toLowerCase()
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  @{u}
                </button>
              ))}
            </div>
          </div>

          {/* GitHub Personal Access Token (Optional) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>GitHub Personal Access Token (Opsional)</span>
              </label>
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Buat Token</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (opsional)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              *Hanya disimpan di <code className="font-mono">localStorage</code> browser Anda. Berguna untuk meningkatkan limit request dari 60 req/jam menjadi 5.000 req/jam jika sering testing.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Tersimpan! Memuat...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan & Tampilkan</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
