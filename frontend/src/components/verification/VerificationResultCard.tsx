'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Fingerprint,
  Blocks,
  Cpu,
} from 'lucide-react';
import { VerificationResult } from '@/lib/types';
import { truncateHash } from '@/lib/crypto';
import QrCodeModal from './QrCodeModal';

interface VerificationResultCardProps {
  result: VerificationResult;
}

export default function VerificationResultCard({ result }: VerificationResultCardProps) {
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const { status, computedHash, expectedHash, matchedProduct, riskAssessment } = result;
  const isAuthentic = status === 'VALID';
  const isTampered = status === 'TAMPERED';

  const copyToClipboard = (text: string, type: 'tx' | 'hash') => {
    navigator.clipboard.writeText(text);
    if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-xl p-5 sm:p-7 transition-all border ${
        isAuthentic
          ? 'glass-card-emerald'
          : isTampered
          ? 'glass-card-crimson'
          : 'glass-panel'
      }`}
    >
      {/* Top Banner Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
              isAuthentic
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                : isTampered
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
            }`}
          >
            {isAuthentic ? (
              <ShieldCheck className="w-5 h-5" />
            ) : isTampered ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <HelpCircle className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-mono font-medium uppercase px-2 py-0.5 rounded border ${
                  isAuthentic
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                    : isTampered
                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
                }`}
              >
                {status} Cryptographic Proof
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                Verified in {result.executionTimeMs}ms
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white mt-1 tracking-tight">
              {isAuthentic
                ? 'Authentic & Integrity Verified'
                : isTampered
                ? 'Cryptographic Tampering Detected'
                : 'Document Hash Not Found'}
            </h2>
          </div>
        </div>

        {/* Quick QR Button */}
        {matchedProduct && (
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80 text-xs font-medium self-start sm:self-auto transition-colors active:scale-[0.98] shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Generate QR</span>
          </button>
        )}
      </div>

      {/* Product Metadata Summary */}
      {matchedProduct && (
        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-lg bg-white dark:bg-zinc-950/60 border border-zinc-300 dark:border-zinc-800/80 text-xs shadow-sm">
          <div>
            <span className="text-zinc-700 dark:text-zinc-400 block mb-0.5 font-semibold text-[11px]">Product Name</span>
            <span className="font-bold text-zinc-950 dark:text-zinc-100 text-xs block truncate">
              {matchedProduct.name}
            </span>
            <span className="font-mono text-zinc-800 dark:text-zinc-300 font-medium text-[11px]">{matchedProduct.id}</span>
          </div>

          <div>
            <span className="text-zinc-700 dark:text-zinc-400 block mb-0.5 font-semibold text-[11px]">Manufacturer</span>
            <span className="font-bold text-zinc-950 dark:text-zinc-100 text-xs block truncate">
              {matchedProduct.manufacturer}
            </span>
            <span className="text-zinc-700 dark:text-zinc-400 font-medium text-[11px]">{matchedProduct.originCountry}</span>
          </div>

          <div>
            <span className="text-zinc-700 dark:text-zinc-400 block mb-0.5 font-semibold text-[11px]">Batch Code</span>
            <span className="font-mono font-bold text-zinc-950 dark:text-zinc-100 text-xs block">
              {matchedProduct.batchNumber}
            </span>
            <span className="text-zinc-700 dark:text-zinc-400 font-medium text-[11px]">Mfg: {matchedProduct.manufactureDate}</span>
          </div>

          <div>
            <span className="text-zinc-700 dark:text-zinc-400 block mb-0.5 font-semibold text-[11px]">Shipment Status</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-200 font-mono text-[11px] font-bold border border-zinc-300 dark:border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              {matchedProduct.status}
            </span>
          </div>
        </div>
      )}

      {/* Cryptographic Hash Comparison Grid */}
      <div className="space-y-3 my-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-300 font-mono flex items-center gap-2">
          <Fingerprint className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-400" />
          Cryptographic Hash Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {/* Computed Hash */}
          <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-400 font-semibold text-[11px]">
              <span>Computed SHA-256 (In-Browser)</span>
              <button
                onClick={() => copyToClipboard(computedHash, 'hash')}
                className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
                title="Copy Hash"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-zinc-950 dark:text-zinc-200 break-all select-all font-semibold text-[11px] leading-relaxed">
              {computedHash}
            </p>
          </div>

          {/* On-Chain Anchored Hash */}
          <div
            className={`p-3.5 rounded-lg border space-y-1 shadow-sm ${
              isAuthentic
                ? 'bg-emerald-50/70 dark:bg-zinc-950 border-emerald-400 dark:border-emerald-500/30'
                : isTampered
                ? 'bg-rose-50/70 dark:bg-zinc-950 border-rose-400 dark:border-rose-500/30'
                : 'bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-400 font-semibold text-[11px]">
              <span>On-Chain Anchored Commitment</span>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                  isAuthentic
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20'
                    : isTampered
                    ? 'bg-rose-100 text-rose-900 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20'
                    : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {isAuthentic ? '100% Match' : isTampered ? 'Mismatch' : 'No Record'}
              </span>
            </div>
            <p
              className={`break-all select-all font-semibold text-[11px] leading-relaxed ${
                isAuthentic ? 'text-emerald-800 dark:text-emerald-400' : isTampered ? 'text-rose-800 dark:text-rose-400 line-through' : 'text-zinc-600'
              }`}
            >
              {expectedHash || 'No matching hash anchored on-chain'}
            </p>
          </div>
        </div>
      </div>

      {/* On-Chain Attestation Details */}
      {matchedProduct?.onChainRecord && (
        <div className="p-4 rounded-lg bg-white dark:bg-zinc-950/60 border border-zinc-300 dark:border-zinc-800/80 space-y-2.5 text-xs mb-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-900 dark:text-zinc-300 flex items-center gap-1.5 font-mono text-[11px]">
              <Blocks className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-400" />
              Smart Contract Proof Details
            </span>
            <span className="text-[11px] font-mono text-zinc-700 dark:text-zinc-400 font-medium">
              {matchedProduct.onChainRecord.network}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
            <div>
              <span className="text-zinc-700 dark:text-zinc-400 block mb-0.5 text-[11px] font-medium">Transaction Hash</span>
              <div className="flex items-center gap-1.5 font-mono text-zinc-950 dark:text-zinc-300 text-[11px] font-semibold">
                <span>{truncateHash(matchedProduct.onChainRecord.txHash, 6, 6)}</span>
                <button
                  onClick={() => copyToClipboard(matchedProduct.onChainRecord.txHash, 'tx')}
                  className="hover:text-black dark:hover:text-white"
                >
                  {copiedTx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-zinc-700 dark:text-zinc-400 block mb-0.5 text-[11px] font-medium">Block Number</span>
              <span className="font-mono text-zinc-950 dark:text-zinc-200 font-bold text-[11px]">
                #{matchedProduct.onChainRecord.blockNumber}
              </span>
            </div>

            <div>
              <span className="text-zinc-700 dark:text-zinc-400 block mb-0.5 text-[11px] font-medium">Issuer Contract Address</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-300 truncate block text-[11px] font-semibold">
                {truncateHash(matchedProduct.onChainRecord.contractAddress, 6, 4)}
              </span>
            </div>
          </div>
        </div>
      )}

      {riskAssessment && (
        <div className="p-4 rounded-lg bg-white dark:bg-zinc-950/60 border border-zinc-300 dark:border-zinc-800/80 space-y-2 text-xs mb-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-900 dark:text-zinc-300 flex items-center gap-1.5 font-mono text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-400" />
              ML Forensics Assessment
            </span>
            <span className="font-mono text-zinc-950 dark:text-zinc-200 text-[11px] font-bold">
              {riskAssessment.riskLevel} · {riskAssessment.riskScore.toFixed(1)}/100
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 text-zinc-800 dark:text-zinc-400 text-[11px] font-mono font-medium">
            <span>Confidence: {(riskAssessment.confidence * 100).toFixed(0)}%</span>
            <span>ELA: {((riskAssessment.elaScore ?? 0) * 100).toFixed(0)}%</span>
            <span>CMFD: {((riskAssessment.cmfdScore ?? 0) * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Navigation Shortcuts */}
      {matchedProduct && (
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <Link
            href={`/verify/${matchedProduct.id}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-xs font-medium border border-zinc-900 dark:border-white/20 shadow-sm transition-all active:scale-[0.98]"
          >
            <span>View Full Journey Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/forensics?id=${matchedProduct.id}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80 text-xs font-medium transition-colors active:scale-[0.98] shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Inspect AI Forensics Heatmap</span>
          </Link>
        </div>
      )}

      {matchedProduct && (
        <QrCodeModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          productId={matchedProduct.id}
          productName={matchedProduct.name}
        />
      )}
    </div>
  );
}
