'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Truck,
  ScanEye,
  Wallet,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { checkBackendHealth } from '@/lib/api';
import Web3WalletModal from '@/components/issuer/Web3WalletModal';

const NAV_ITEMS = [
  { label: 'Public Verifier', href: '/verify', icon: ShieldCheck },
  { label: 'AI Forensics', href: '/forensics', icon: ScanEye },
  { label: 'Issuer Portal', href: '/issuer', icon: Building2 },
  { label: 'Logistics', href: '/logistics', icon: Truck },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendHealth().then(({ online }) => setBackendOnline(online));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/75 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-glow-sm shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-slate-100">
                  Proof<span className="text-cyan-400">Route</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <span className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Web3 + AI Provenance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-indigo-500/15 text-white border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-indigo-400' : 'text-slate-400')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Network Badge & Web3 Wallet */}
          <div className="hidden lg:flex items-center gap-3">
            {/* API Backend Status */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono ${
                backendOnline === true
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : backendOnline === false
                  ? 'bg-slate-900/80 border-slate-700/60 text-slate-400'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-500'
              }`}
              title={backendOnline ? 'FastAPI backend connected' : 'Using local mock fallback'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline === true
                    ? 'bg-emerald-400 animate-pulse'
                    : backendOnline === false
                    ? 'bg-amber-400'
                    : 'bg-slate-600'
                }`}
              />
              <span>{backendOnline === true ? 'API Live' : backendOnline === false ? 'Mock Demo' : 'Checking…'}</span>
            </div>

            {/* Live Network Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
              <span>Sepolia (11155111)</span>
            </div>

            {/* Wallet Button */}
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wallet className="w-4 h-4 text-indigo-200" />
              {connectedAccount ? (
                <span>{`${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`}</span>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-500/20 text-white border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-white/5'
                  )}
                >
                  <Icon className="w-5 h-5 text-indigo-400" />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWalletModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-md"
              >
                <Wallet className="w-5 h-5" />
                {connectedAccount ? `${connectedAccount.slice(0, 6)}...` : 'Connect Web3 Wallet'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Wallet Connection Modal */}
      <Web3WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        connectedAccount={connectedAccount}
        onConnect={(acc) => setConnectedAccount(acc)}
        onDisconnect={() => setConnectedAccount(null)}
      />
    </>
  );
}
