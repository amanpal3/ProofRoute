import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Cpu, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 dark:border-zinc-200 bg-black text-white dark:bg-white dark:text-zinc-950 mt-24 relative z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 dark:bg-zinc-100 dark:border-zinc-300 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white dark:text-zinc-950" />
              </div>
              <span className="font-bold text-base tracking-tight text-white dark:text-zinc-950">
                ProofRoute
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 dark:border-zinc-300 dark:bg-zinc-100 dark:text-zinc-700 font-medium">
                Core v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-md leading-relaxed">
              Decentralized provenance, document tampering forensics, and cryptographic supply chain
              auditing. In-browser SHA-256 anchoring with EVM smart contract immutability.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-400 dark:text-zinc-600">
              <span className="flex items-center gap-1.5 text-zinc-300 dark:text-zinc-800 font-medium">
                <Lock className="w-3 h-3 text-emerald-400 dark:text-emerald-600" /> SHA-256 On-Chain
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">•</span>
              <span className="flex items-center gap-1.5 text-zinc-300 dark:text-zinc-800 font-medium">
                <Cpu className="w-3 h-3 text-indigo-400 dark:text-indigo-600" /> ELA + CMFD Vision
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">•</span>
              <span className="flex items-center gap-1.5 text-zinc-300 dark:text-zinc-800 font-medium">
                <Database className="w-3 h-3 text-zinc-400 dark:text-zinc-500" /> Real-time Indexer
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 dark:text-zinc-950 mb-3.5 font-mono">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/verify" className="text-zinc-400 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-950 transition-colors">
                  Public Document Verifier
                </Link>
              </li>
              <li>
                <Link href="/forensics" className="text-zinc-400 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-950 transition-colors">
                  AI Forensics & Heatmap
                </Link>
              </li>
              <li>
                <Link href="/issuer" className="text-zinc-400 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-950 transition-colors">
                  Manufacturer Portal
                </Link>
              </li>
              <li>
                <Link href="/logistics" className="text-zinc-400 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-950 transition-colors">
                  Logistics Milestones
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 dark:text-zinc-950 mb-3.5 font-mono">
              Contract & Security
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-relaxed">
              Cryptographic commitments are permanently written to EVM storage. Tamper forensics run locally without data retention.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-900 dark:border-zinc-200 flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-600" />
              <span className="text-zinc-500">Contract:</span>
              <span className="font-mono text-zinc-300 dark:text-zinc-900 font-semibold">0x71C6...6b19</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-zinc-900 dark:border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500 font-mono">
          <p className="text-zinc-400 dark:text-zinc-600">© 2026 ProofRoute Protocol. Zero PII stored on-chain.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-zinc-400 dark:text-zinc-600">Client-Side Verification</span>
            <span className="text-zinc-700 dark:text-zinc-300">•</span>
            <span className="text-zinc-400 dark:text-zinc-600">Non-Custodial</span>
            <span className="text-zinc-700 dark:text-zinc-300">•</span>
            <span className="text-emerald-400 dark:text-emerald-600 font-semibold">Anvil / Sepolia Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
