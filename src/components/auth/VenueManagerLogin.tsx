/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Store, Lock, Mail, KeyRound, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VenueManagerLogin: React.FC = () => {
  const { loginVenueManager, venue } = useApp();
  const [email, setEmail] = useState('yonetici@lezzetduragi.com');
  const [password, setPassword] = useState('lezzet2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = loginVenueManager(email, password);
      if (!ok) {
        setError('Hatalı mekan yöneticisi e-posta adresi veya şifresi!');
        setIsLoading(false);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Amber Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-xl shadow-amber-500/5 mb-2">
            <Store className="w-8 h-8" />
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800 text-amber-400 text-[10px] font-mono tracking-wider uppercase font-bold">
            qradv.com/panel • Firma & Restoran Yöneticisi
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mekan Yönetim Paneli Girişi
          </h1>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            {venue.name} — Menü, Kampanya 1+1, Masa & Kural Ayarları, Kotalar ve Adisyon
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">
                Yönetici E-Posta
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yonetici@lezzetduragi.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">
                Yönetici Şifresi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Mekan Paneline Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="pt-4 border-t border-neutral-800/80">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1 text-neutral-400">
              <div className="flex items-center gap-1.5 text-neutral-300 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Hazır Demo Firma / Mekan Yöneticisi:</span>
              </div>
              <p className="font-mono text-[11px] text-neutral-400">
                E-posta: <strong className="text-white">yonetici@lezzetduragi.com</strong>
              </p>
              <p className="font-mono text-[11px] text-neutral-400">
                Şifre: <strong className="text-white">lezzet2026</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-neutral-500">
          Mutfak veya garson çalışanları için PIN girişli{' '}
          <span className="text-cyan-400 font-bold">/pos</span> terminalini kullanınız.
        </p>
      </div>
    </div>
  );
};
