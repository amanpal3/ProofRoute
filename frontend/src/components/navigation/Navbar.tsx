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
import { useWallet } from '@/components/providers/WalletProvider';
import ThemeToggle from '@/components/navigation/ThemeToggle';

const NAV_ITEMS = [
  { label: 'Public Verifier', href: '/verify', icon: ShieldCheck },
  { label: 'AI Forensics', href: '/forensics', icon: ScanEye },
  { label: 'Issuer Portal', href: '/issuer', icon: Building2 },
  { label: 'Logistics', href: '/logistics', icon: Truck },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { account, isModalOpen, openModal, closeModal, connect, disconnect } = useWallet();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendHealth().then(({ online }) => setBackendOnline(online));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-white/[0.07] bg-white/95 dark:bg-[#09090b]/80 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner group-hover:border-zinc-700 transition-colors">
              <ShieldCheck className="w-4 h-4 text-white group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-zinc-950 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
                ProofRoute
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-400 font-medium">
                v1.0
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
                    'group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold'
                      : 'text-zinc-800 dark:text-zinc-300 hover:bg-zinc-800 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-3.5 h-3.5 transition-colors',
                      isActive
                        ? 'text-white dark:text-zinc-950'
                        : 'text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-950'
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Network Badge, Theme Toggle & Web3 Wallet */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* API Backend Status */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono ${
                backendOnline === true
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : backendOnline === false
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-500'
              }`}
              title={backendOnline ? 'FastAPI backend connected' : 'Using local mock fallback'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendOnline === true
                    ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse'
                    : backendOnline === false
                    ? 'bg-amber-500'
                    : 'bg-zinc-400 dark:bg-zinc-600'
                }`}
              />
              <span>{backendOnline === true ? 'API Live' : backendOnline === false ? 'Mock Local' : 'Checking…'}</span>
            </div>

            {/* Live Network Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 text-[11px] font-mono dark:text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              <span>EVM 31337</span>
            </div>

            {/* Day / Night Mode Switcher */}
            <ThemeToggle />

            {/* Wallet Button */}
            <button
              onClick={openModal}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98]',
                account
                  ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700/80 font-mono'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 border border-zinc-900 dark:border-white/20 shadow-sm'
              )}
            >
              <Wallet className="w-3.5 h-3.5" />
              {account ? (
                <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/60"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-2xl space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                      : 'text-zinc-800 dark:text-zinc-300 hover:bg-zinc-800 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950'
                  )}
                >
                  <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-950')} />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-xs font-medium shadow"
              >
                <Wallet className="w-4 h-4" />
                {account ? `${account.slice(0, 6)}...` : 'Connect Web3 Wallet'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Wallet Connection Modal */}
      <Web3WalletModal
        isOpen={isModalOpen}
        onClose={closeModal}
        connectedAccount={account}
        onConnect={connect}
        onDisconnect={disconnect}
      />
    </>
  );
}
