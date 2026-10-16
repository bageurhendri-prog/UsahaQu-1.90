import React, { useState } from 'react';
import { 
  X, 
  Rocket, 
  Check, 
  Copy, 
  Terminal, 
  Settings, 
  FileCode2, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const WORKFLOW_YAML = `name: Deploy Auto Portfolio to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm install

      - name: Build Web Application
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({
  isOpen,
  onClose,
  username,
}) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const targetUrl = `https://${username}.github.io/portfolio/`;

  const handleCopyWorkflow = () => {
    navigator.clipboard.writeText(WORKFLOW_YAML);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-emerald-50/50 dark:bg-emerald-950/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <Rocket className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Panduan Build & Deploy ke GitHub Pages
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Langkah otomatisasi untuk mempublikasikan portofolio Anda secara gratis
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          
          {/* Target URL highlight */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Target URL GitHub Pages Anda:
              </div>
              <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {targetUrl}
              </div>
            </div>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Tersalin' : 'Salin URL'}</span>
            </button>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              4 Langkah Cepat Menuju Live:
            </h3>

            {/* Step 1 */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>Buat / Buka Repositori di GitHub</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                Buat repositori baru di akun GitHub Anda (misal bernama <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">portfolio</code> atau repositori profil <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{username}.github.io</code>). Push semua file proyek ini ke branch <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">main</code>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>Aktifkan Source "GitHub Actions" di Repository Settings</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                Di halaman GitHub repositori Anda, klik tab <b>Settings</b> &rarr; pilih menu <b>Pages</b> (di sisi kiri) &rarr; pada bagian <b>Build and deployment &gt; Source</b>, pilih <b>"GitHub Actions"</b> (bukan "Deploy from a branch").
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>File Workflow GitHub Actions (.github/workflows/deploy.yml)</span>
                </div>
                <button
                  onClick={handleCopyWorkflow}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedWorkflow ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWorkflow ? 'YAML Tersalin!' : 'Salin File YAML'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                File ini sudah otomatis disertakan di direktori proyek ini pada path <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-bold">.github/workflows/deploy.yml</code>.
              </p>

              {/* Code preview block */}
              <div className="pl-8">
                <div className="bg-slate-950 rounded-xl p-3 text-[11px] font-mono text-slate-300 max-h-44 overflow-y-auto border border-slate-800">
                  <pre>{WORKFLOW_YAML}</pre>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                <span>Push dan Nikmati Live Auto-Sync!</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                Setiap kali Anda push perubahan ke branch <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">main</code>, GitHub Actions akan otomatis meng-compile aset Vite ke direktori <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">dist/</code> dan mempublikasikannya tanpa biaya hosting sama sekali!
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Keunggulan Build Ini untuk GitHub Pages:</span>
            </div>
            <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 list-disc list-inside pl-1">
              <li><b>Base Relatif Aktif (<code className="font-mono">base: './'</code>)</b>: Menghindari error 404 path aset saat dihosting di subfolder repositori.</li>
              <li><b>Auto-Fetch API GitHub</b>: Otomatis membaca repositori publik Anda secara live tanpa perlu mengetik ulang daftar proyek secara manual.</li>
              <li><b>Mendukung Parameter URL</b>: Bisa dibuka dengan format <code className="font-mono">?user=username_anda</code> untuk langsung menampilkan portofolio pengguna lain.</li>
              <li><b>IndexedDB & LocalStorage Cache</b>: Menghemat kuota rate limit GitHub API agar situs selalu cepat terbuka.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            Vite 6 / 8 + React 19 + Tailwind CSS
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
