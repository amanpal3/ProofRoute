'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Cpu,
  Building2,
  Lock,
  ArrowRight,
  QrCode,
  Zap,
  Loader2,
} from 'lucide-react';
import DocumentDropzone from '@/components/verification/DocumentDropzone';
import VerificationResultCard from '@/components/verification/VerificationResultCard';
import { VerificationResult } from '@/lib/types';
import { verifyHashAgainstRegistry } from '@/lib/verification';
import { verifyDocumentViaApi } from '@/lib/api';

export default function HomePage() {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFileProcessed = async (data: {
    file?: File;
    fileName: string;
    fileSize: number;
    mimeType: string;
    hash: string;
    timeMs: number;
    presetProductId?: string;
  }) => {
    setIsVerifying(true);
    try {
      const apiResult = await verifyDocumentViaApi({
        file: data.file,
        docHash: data.hash,
        productId: data.presetProductId,
      });

      if (apiResult.matchedProduct || apiResult.status !== 'NOT_REGISTERED' || !data.presetProductId) {
        setVerificationResult({
          ...apiResult,
          executionTimeMs: data.timeMs + (apiResult.executionTimeMs || 0),
        });
        return;
      }

      const result = verifyHashAgainstRegistry(data.hash, data.presetProductId);
      setVerificationResult({ ...result, executionTimeMs: data.timeMs });
    } catch {
      const result = verifyHashAgainstRegistry(data.hash, data.presetProductId);
      setVerificationResult({ ...result, executionTimeMs: data.timeMs });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-300 mb-8 backdrop-blur-sm shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span className="font-medium">Enterprise Provenance Engine</span>
          <span className="text-zinc-400 dark:text-zinc-600">/</span>
          <span className="text-zinc-700 dark:text-zinc-400">Zero-Gas Public Verification</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-bold tracking-[-0.03em] text-zinc-950 dark:text-white max-w-4xl mx-auto leading-[1.08]">
          Cryptographic provenance. <br />
          <span className="text-zinc-600 dark:text-zinc-400 font-semibold">
            Explainable document integrity.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-zinc-800 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Verify origin authenticity, track custody milestones, and detect physical or digital
          document tampering with client-side SHA-256 anchoring and explainable vision forensics.
        </p>

        {/* Action CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/verify"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs border border-zinc-950 dark:border-white/20 shadow-sm transition-all active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-zinc-900" />
            <span>Verify Document Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/issuer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-900 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 dark:text-zinc-200 font-medium text-xs border border-zinc-300 dark:border-zinc-700/80 transition-all active:scale-[0.98] shadow-sm"
          >
            <Building2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <span>Manufacturer Portal</span>
          </Link>
        </div>

        {/* Key Metrics Counter Strip (Clean tabular layout) */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px max-w-4xl mx-auto rounded-xl bg-zinc-300 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="p-5 bg-white dark:bg-[#0c0d12]/90 flex flex-col items-center sm:items-start text-left">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-100">&lt; 10ms</span>
            <p className="text-xs text-zinc-700 dark:text-zinc-400 mt-1 font-medium">In-Browser Hashing</p>
          </div>
          <div className="p-5 bg-white dark:bg-[#0c0d12]/90 flex flex-col items-center sm:items-start text-left">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">100%</span>
            <p className="text-xs text-zinc-700 dark:text-zinc-400 mt-1 font-medium">Client-Side Privacy</p>
          </div>
          <div className="p-5 bg-white dark:bg-[#0c0d12]/90 flex flex-col items-center sm:items-start text-left">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-100">0 Gas</span>
            <p className="text-xs text-zinc-700 dark:text-zinc-400 mt-1 font-medium">Public QR Verification</p>
          </div>
          <div className="p-5 bg-white dark:bg-[#0c0d12]/90 flex flex-col items-center sm:items-start text-left">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-100">TrOCR + ELA</span>
            <p className="text-xs text-zinc-700 dark:text-zinc-400 mt-1 font-medium">Forensics Engine</p>
          </div>
        </div>
      </section>

      {/* Interactive Try-It Live Sandbox */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Interactive Verification Sandbox
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Test Document Integrity in Real Time
          </h2>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400 max-w-xl mx-auto">
            Drop an authentic certificate or an altered sample to inspect instant cryptographic hash matching.
          </p>
        </div>

        {/* Dropzone & Live Card */}
        <div className="space-y-4">
          <DocumentDropzone onFileProcessed={handleFileProcessed} />

          {isVerifying && (
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center gap-2.5 text-xs text-zinc-900 dark:text-zinc-300 shadow-sm font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-700 dark:text-zinc-400" />
              <span>Verifying hash against smart contract registry & running forensics analysis...</span>
            </div>
          )}

          {verificationResult && (
            <div className="animate-in fade-in duration-200">
              <VerificationResultCard result={verificationResult} />
            </div>
          )}
        </div>
      </section>

      {/* Architecture Pillars & Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-1.5 mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Engineered for International Supply Chains
          </h2>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400 max-w-xl mx-auto">
            Pairing EVM immutability with localized computer vision forensics to eliminate trade documentation fraud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="specular-card rounded-xl p-6 sm:p-7 space-y-3 transition-all hover:border-zinc-400 dark:hover:border-zinc-700/80">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-300 shadow-sm">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">On-Chain Hash Anchoring</h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed">
              Manufacturers record cryptographic SHA-256 digests on EVM smart contracts. No sensitive trade secrets, PII, or document contents are ever stored on-chain.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-300">
              <span>ProofRouteRegistry.sol</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="specular-card rounded-xl p-6 sm:p-7 space-y-3 transition-all hover:border-zinc-400 dark:hover:border-zinc-700/80">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-300 shadow-sm">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">Wallet-Free Consumer QR</h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed">
              Customs inspectors and consumers scan packaging QR codes to immediately verify provenance and milestone audit trails without paying gas or configuring wallets.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
              <span>Sub-Second Response</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="specular-card rounded-xl p-6 sm:p-7 space-y-3 transition-all hover:border-zinc-400 dark:hover:border-zinc-700/80">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-300 shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">Explainable Vision Forensics</h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed">
              Error Level Analysis (ELA) and Copy-Move Forgery Detection (CMFD) detect if invoice figures, inspection stamps, or signatures were digitally manipulated.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-300">
              <span>OpenCV + TrOCR Heuristics</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Diagram */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-2xl bg-black text-white dark:bg-white dark:text-zinc-950 border border-zinc-900 dark:border-zinc-200 shadow-2xl transition-colors">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              Verification Pipeline
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight text-white dark:text-zinc-950">
              How ProofRoute Secures the Supply Chain
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2.5 p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white dark:bg-zinc-50 dark:border-zinc-200 dark:text-zinc-950 shadow-sm transition-colors">
              <div className="w-7 h-7 rounded bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-white dark:text-zinc-950">Manufacturer Registers</h4>
              <p className="text-xs text-zinc-300 dark:text-zinc-600 leading-relaxed">
                Connects Web3 wallet, inputs batch attributes, and uploads Certificate of Authenticity.
              </p>
            </div>

            <div className="space-y-2.5 p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white dark:bg-zinc-50 dark:border-zinc-200 dark:text-zinc-950 shadow-sm transition-colors">
              <div className="w-7 h-7 rounded bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-white dark:text-zinc-950">Hash Anchored On-Chain</h4>
              <p className="text-xs text-zinc-300 dark:text-zinc-600 leading-relaxed">
                SHA-256 fingerprint is committed to smart contract registry; packaging QR code is generated.
              </p>
            </div>

            <div className="space-y-2.5 p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white dark:bg-zinc-50 dark:border-zinc-200 dark:text-zinc-950 shadow-sm transition-colors">
              <div className="w-7 h-7 rounded bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-white dark:text-zinc-950">Logistics Milestones</h4>
              <p className="text-xs text-zinc-300 dark:text-zinc-600 leading-relaxed">
                Carriers advance status from CREATED to IN_TRANSIT and DELIVERED with audit notes.
              </p>
            </div>

            <div className="space-y-2.5 p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white dark:bg-zinc-50 dark:border-zinc-200 dark:text-zinc-950 shadow-sm transition-colors">
              <div className="w-7 h-7 rounded bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                4
              </div>
              <h4 className="font-bold text-sm text-white dark:text-zinc-950">Inspection & Forensics</h4>
              <p className="text-xs text-zinc-300 dark:text-zinc-600 leading-relaxed">
                Public scan yields cryptographic verification (VALID vs TAMPERED) plus explainable AI scoring.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
