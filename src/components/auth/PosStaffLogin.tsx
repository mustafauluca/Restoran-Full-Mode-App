/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChefHat, Flame, Coffee, Carrot, Sparkles, UserCheck, Delete } from 'lucide-react';
import { KitchenStation } from '../../types';
import { useApp } from '../../context/AppContext';

interface RoleOption {
  station: KitchenStation;
  label: string;
  sub: string;
  icon: React.ReactNode;
  defaultPin: string;
  name: string;
  color: string;
}

const ROLES: RoleOption[] = [
  {
    station: 'all',
    label: 'Kasa & Garson Şefi',
    sub: 'Tüm siparişler ve adisyon',
    icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
    defaultPin: '1234',
    name: 'Kasa & Şef Garson',
    color: 'border-emerald-500/50 hover:border-emerald-500',
  },
  {
    station: 'kitchen',
    label: 'Ana Mutfak (Sıcak/Tava)',
    sub: 'Tavalar, çorbalar, fırın',
    icon: <ChefHat className="w-5 h-5 text-amber-400" />,
    defaultPin: '2222',
    name: 'Mutfak Şefi Ahmet',
    color: 'border-amber-500/50 hover:border-amber-500',
  },
  {
    station: 'grill',
    label: 'Izgara & Steak İstasyonu',
    sub: 'Burger, et, köfte, antrikot',
    icon: <Flame className="w-5 h-5 text-rose-400" />,
    defaultPin: '3333',
    name: 'Izgara Ustası Mehmet',
    color: 'border-rose-500/50 hover:border-rose-500',
  },
  {
    station: 'beverage',
    label: 'Bar & İçecek Reyonu',
    sub: 'Kokteyl, kahve, meşrubat',
    icon: <Coffee className="w-5 h-5 text-cyan-400" />,
    defaultPin: '4444',
    name: 'Barmen Selin',
    color: 'border-cyan-500/50 hover:border-cyan-500',
  },
  {
    station: 'salad',
    label: 'Salata Reyonu',
    sub: 'Soğuk salata, yeşillik',
    icon: <Carrot className="w-5 h-5 text-lime-400" />,
    defaultPin: '5555',
    name: 'Salata Ustası Can',
    color: 'border-lime-500/50 hover:border-lime-500',
  },
  {
    station: 'meze',
    label: 'Meze & Başlangıç Ustası',
    sub: 'Humus, şakşuka, gurme meze',
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    defaultPin: '6666',
    name: 'Meze Şefi Fatma',
    color: 'border-purple-500/50 hover:border-purple-500',
  },
];

export const PosStaffLogin: React.FC = () => {
  const { loginStaff } = useApp();
  const [selectedRole, setSelectedRole] = useState<RoleOption>(ROLES[0]);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleKeyClick = (key: string) => {
    if (pin.length < 4) {
      const newPin = pin + key;
      setPin(newPin);
      setError(null);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const verifyPin = (currentPin: string) => {
    const ok = loginStaff(selectedRole.station, currentPin, selectedRole.name);
    if (!ok) {
      setError('Hatalı personel PIN kodu!');
      setTimeout(() => setPin(''), 500);
    }
  };

  const handleQuickDemoFill = (role: RoleOption) => {
    setSelectedRole(role);
    setPin(role.defaultPin);
    setError(null);
    loginStaff(role.station, role.defaultPin, role.name);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-[10px] font-mono tracking-wider uppercase font-bold mb-2">
            qradv.com/pos • Personel & Mutfak KDS Girişi
          </div>
          <h1 className="text-2xl font-black text-white">Personel Hızlı PIN Girişi</h1>
          <p className="text-xs text-neutral-400">
            Çalıştığınız istasyonu veya reyonu seçip 4 haneli PIN kodunuzu giriniz
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ROLES.map((r) => {
            const isSelected = selectedRole.station === r.station;
            return (
              <button
                key={r.station}
                type="button"
                onClick={() => {
                  setSelectedRole(r);
                  setPin('');
                  setError(null);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-xl bg-neutral-950 border border-neutral-800">{r.icon}</div>
                  <span className="text-[10px] font-mono text-neutral-500 font-bold">PIN: {r.defaultPin}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{r.label}</h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-1">{r.sub}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* PIN Pad Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4 max-w-sm mx-auto w-full">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono text-amber-400 font-bold block uppercase tracking-wider">
              {selectedRole.name} • 4 Haneli PIN
            </span>

            {/* PIN Dots */}
            <div className="flex justify-center items-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    pin.length > idx
                      ? 'bg-amber-400 scale-110 shadow-lg shadow-amber-400/50 ring-2 ring-amber-400/30'
                      : 'bg-neutral-800 border border-neutral-700'
                  }`}
                />
              ))}
            </div>

            {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 text-lg font-bold">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyClick(digit)}
                className="py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 active:bg-neutral-700 text-white border border-neutral-800 transition-all cursor-pointer font-mono"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleQuickDemoFill(selectedRole)}
              className="py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase transition-all"
            >
              Hızlı Aç
            </button>
            <button
              type="button"
              onClick={() => handleKeyClick('0')}
              className="py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 active:bg-neutral-700 text-white border border-neutral-800 transition-all cursor-pointer font-mono"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-400 border border-neutral-800 flex items-center justify-center transition-all cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
