/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, KeyRound, Server, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SuperAdminLogin: React.FC = () => {
  const { loginSuperAdmin } = useApp();
  const [email, setEmail] = useState('superadmin@qradv.com');
  const [password, setPassword] = useState('admin2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = loginSuperAdmin(email, password);
      if (!ok) {
        setError('Geçersiz platform süper admin e-posta adresi veya güvenlik anahtarı!');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 shadow-xl shadow-red-500/5 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-800 text-red-400 text-[10px] font-mono tracking-wider uppercase font-bold">
            qradv.com/manager • Platform Root Level
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Site Süper Yöneticisi Girişi
          </h1>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            QRAdv Global Sistem Yönetimi, Çoklu Firma & Mekan Lisansları, API ve Küresel Finans Kur Servisi
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
                Süper Admin E-Posta
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@qradv.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">
                Root Güvenlik Parolası
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Platform Konsoluna Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="pt-4 border-t border-neutral-800/80">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1 text-neutral-400">
              <div className="flex items-center gap-1.5 text-neutral-300 font-bold text-[11px]">
                <Server className="w-3.5 h-3.5 text-red-400" />
                <span>Hazır Demo Süper Admin Girişi:</span>
              </div>
              <p className="font-mono text-[11px] text-neutral-400">
                E-posta: <strong className="text-white">superadmin@qradv.com</strong>
              </p>
              <p className="font-mono text-[11px] text-neutral-400">
                Şifre: <strong className="text-white">admin2026</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-neutral-500">
          Bu portal sadece platform sahibi ve sistem mimarları içindir. Mekan sahipleri{' '}
          <span className="text-amber-400 font-bold">/panel</span> girişini kullanmalıdır.
        </p>
      </div>
    </div>
  );
};
