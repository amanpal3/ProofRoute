'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Cpu,
  Truck,
  Building2,
  Lock,
  ArrowRight,
  QrCode,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';
import DocumentDropzone from '@/components/verification/DocumentDropzone';
import VerificationResultCard from '@/components/verification/VerificationResultCard';
import { VerificationResult } from '@/lib/types';
import { SAMPLE_PRODUCTS } from '@/lib/mockData';

export default function HomePage() {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleFileProcessed = (data: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    hash: string;
    timeMs: number;
    presetProductId?: string;
  }) => {
    // Check against registered sample products
    const matchedProduct = data.presetProductId
      ? SAMPLE_PRODUCTS[data.presetProductId]
      : Object.values(SAMPLE_PRODUCTS).find((p) => p.documentHash.toLowerCase() === data.hash.toLowerCase());

    if (matchedProduct) {
      const isAuthentic = matchedProduct.documentHash.toLowerCase() === data.hash.toLowerCase();
      setVerificationResult({
        status: isAuthentic ? 'VALID' : 'TAMPERED',
        computedHash: data.hash,
        expectedHash: matchedProduct.documentHash,
        matchedProduct,
        verificationTimestamp: Date.now(),
        executionTimeMs: data.timeMs,
      });
    } else {
      // Unregistered document hash
      setVerificationResult({
        status: 'NOT_REGISTERED',
        computedHash: data.hash,
        expectedHash: undefined,
        verificationTimestamp: Date.now(),
        executionTimeMs: data.timeMs,
      });
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300 mb-8 backdrop-blur-md shadow-glow-sm shadow-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hybrid Web3 + AI Provenance Architecture</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-semibold">Zero-Gas Verifications</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Cryptographic Certainty. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            AI-Powered Document Integrity.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Verify where international trade goods originated, inspect milestone custody transitions,
          and detect counterfeit documents with in-browser SHA-256 anchoring and explainable forensic heatmaps.
        </p>

        {/* Action CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/verify"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldCheck className="w-5 h-5 text-cyan-200" />
            <span>Verify Document Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/issuer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-medium border border-slate-700 backdrop-blur-md transition-all hover:border-slate-600"
          >
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Issuer Portal</span>
          </Link>
        </div>

        {/* Key Metrics Counter Strip */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">&lt; 10ms</span>
            <p className="text-xs text-slate-400">In-Browser Hashing</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">100%</span>
            <p className="text-xs text-slate-400">Client-Side Privacy</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-indigo-400">0 Gas</span>
            <p className="text-xs text-slate-400">Public QR Verification</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">TrOCR + ELA</span>
            <p className="text-xs text-slate-400">AI Forensics Engine</p>
          </div>
        </div>
      </section>

      {/* Interactive Try-It Live Sandbox */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            <Zap className="w-4 h-4" />
            Interactive Verification Sandbox
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Test Document Integrity in Real Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Drop an authentic certificate or a modified bill of lading to inspect the cryptographic SHA-256 match.
          </p>
        </div>

        {/* Dropzone & Live Card */}
        <div className="space-y-6">
          <DocumentDropzone onFileProcessed={handleFileProcessed} />

          {verificationResult && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
              <VerificationResultCard result={verificationResult} />
            </div>
          )}
        </div>
      </section>

      {/* Architecture Pillars & Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Engineered for International Trade Supply Chains
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Combining EVM blockchain immutability with off-chain AI forensics to solve billion-dollar document forgery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">On-Chain Hash Anchoring</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Manufacturers anchor cryptographic SHA-256 hashes of certificates on Ethereum EVM contracts. Zero private data or PII is ever exposed on-chain.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>ProofRouteRegistry.sol</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Wallet-Free Consumer QR</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Anyone with a smartphone camera can scan product packaging QR codes to immediately verify provenance, shipment milestones, and authenticity without paying gas or downloading a crypto wallet.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>Sub-Second Response</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Explainable AI Forensics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Error Level Analysis (ELA) and Copy-Move Forgery Detection (CMFD) detect if numbers, stamps, or signatures were digitally manipulated before uploading.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-indigo-400">
              <span>OpenCV + TrOCR Heuristics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Diagram */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Verification Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              How ProofRoute Protects the Supply Chain
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono font-bold text-sm">
                1
              </div>
              <h4 className="font-semibold text-white text-base">Manufacturer Registers</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects Web3 wallet, enters batch information, and uploads Certificate of Authenticity.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-sm">
                2
              </div>
              <h4 className="font-semibold text-white text-base">Hash Anchored On-Chain</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                SHA-256 fingerprint is committed to smart contract registry; QR code generated for packaging.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono font-bold text-sm">
                3
              </div>
              <h4 className="font-semibold text-white text-base">Logistics Checkpoints</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Operators advance milestone status from CREATED to IN_TRANSIT and DELIVERED with audit notes.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-bold text-sm">
                4
              </div>
              <h4 className="font-semibold text-white text-base">Consumer Scan & Forensics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Public scan provides instant cryptographic proof (VALID vs TAMPERED) plus explainable AI risk scoring.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
