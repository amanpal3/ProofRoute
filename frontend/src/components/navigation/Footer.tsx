import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Cpu, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-xl mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Proof<span className="text-cyan-400">Route</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Hybrid Web3 + AI Product Provenance, Document Integrity, and Risk Analysis Platform
              designed for international supply chains. Cryptographic certainty paired with explainable
              tamper detection.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> SHA-256 On-Chain
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> ELA & CMFD AI
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" /> Idempotent Indexer
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/verify" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  Public Document Verifier
                </Link>
              </li>
              <li>
                <Link href="/forensics" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  AI Forensics & Heatmap
                </Link>
              </li>
              <li>
                <Link href="/issuer" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  Manufacturer Portal
                </Link>
              </li>
              <li>
                <Link href="/logistics" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  Logistics Milestones
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Security & Compliance
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cryptographic proofs are anchored to EVM smart contracts. AI risk scores are probabilistic and provided for decision support.
            </p>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Contract: <span className="font-mono text-slate-300">0x71C6...6b19</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>© 2026 ProofRoute Protocol. Built with Next.js, Wagmi & OpenCV.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Zero PII On-Chain</span>
            <span className="text-slate-400">Strictly Non-Custodial</span>
            <span className="text-emerald-400/90 font-medium">Anvil / Sepolia Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
