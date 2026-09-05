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
      className={`rounded-3xl p-6 sm:p-8 transition-all border ${
        isAuthentic
          ? 'glass-card-emerald'
          : isTampered
          ? 'glass-card-crimson'
          : 'glass-panel'
      }`}
    >
      {/* Top Banner Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
              isAuthentic
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/20'
                : isTampered
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-rose-500/20 animate-pulse'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {isAuthentic ? (
              <ShieldCheck className="w-8 h-8" />
            ) : isTampered ? (
              <AlertTriangle className="w-8 h-8" />
            ) : (
              <HelpCircle className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isAuthentic
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : isTampered
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {status} Cryptographic Proof
              </span>
              <span className="text-xs text-slate-400">
                Verified in {result.executionTimeMs}ms
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {isAuthentic
                ? 'Authentic & Integrity Verified'
                : isTampered
                ? 'Cryptographic Tampering Detected!'
                : 'Document Hash Not Found'}
            </h2>
          </div>
        </div>

        {/* Quick QR Button */}
        {matchedProduct && (
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium self-start sm:self-auto transition-colors"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Generate QR</span>
          </button>
        )}
      </div>

      {/* Product Metadata Summary */}
      {matchedProduct && (
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-white/5 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Product Name</span>
            <span className="font-semibold text-white text-sm block truncate">
              {matchedProduct.name}
            </span>
            <span className="font-mono text-cyan-400 text-[11px]">{matchedProduct.id}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Manufacturer</span>
            <span className="font-semibold text-white text-sm block truncate">
              {matchedProduct.manufacturer}
            </span>
            <span className="text-slate-400 text-[11px]">{matchedProduct.originCountry}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Batch Code</span>
            <span className="font-mono font-semibold text-white text-sm block">
              {matchedProduct.batchNumber}
            </span>
            <span className="text-slate-400 text-[11px]">Mfg: {matchedProduct.manufactureDate}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Shipment Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-semibold border border-indigo-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {matchedProduct.status}
            </span>
          </div>
        </div>
      )}

      {/* Cryptographic Hash Comparison Grid */}
      <div className="space-y-4 my-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-indigo-400" />
          Cryptographic Hash Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Computed Hash */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>Computed SHA-256 (In-Browser)</span>
              <button
                onClick={() => copyToClipboard(computedHash, 'hash')}
                className="hover:text-white transition-colors"
                title="Copy Hash"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-slate-200 break-all select-all font-medium">
              {computedHash}
            </p>
          </div>

          {/* On-Chain Anchored Hash */}
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isAuthentic
                ? 'bg-slate-950/90 border-emerald-500/30'
                : isTampered
                ? 'bg-rose-950/20 border-rose-500/40'
                : 'bg-slate-950/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span>On-Chain Anchored Commitment</span>
              <span
                className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  isAuthentic
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isTampered
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isAuthentic ? '100% Match' : isTampered ? 'Mismatch' : 'No Record'}
              </span>
            </div>
            <p
              className={`break-all select-all font-medium ${
                isAuthentic ? 'text-emerald-300' : isTampered ? 'text-rose-300 line-through' : 'text-slate-400'
              }`}
            >
              {expectedHash || 'No matching hash anchored on-chain'}
            </p>
          </div>
        </div>
      </div>

      {/* On-Chain Attestation Details */}
      {matchedProduct?.onChainRecord && (
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3 text-xs mb-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <Blocks className="w-4 h-4 text-cyan-400" />
              Smart Contract Proof Details
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {matchedProduct.onChainRecord.network}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
            <div>
              <span className="text-slate-400 block mb-0.5">Transaction Hash</span>
              <div className="flex items-center gap-1.5 font-mono text-cyan-400">
                <span>{truncateHash(matchedProduct.onChainRecord.txHash, 6, 6)}</span>
                <button
                  onClick={() => copyToClipboard(matchedProduct.onChainRecord.txHash, 'tx')}
                  className="hover:text-white"
                >
                  {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Block Number</span>
              <span className="font-mono text-white font-medium">
                #{matchedProduct.onChainRecord.blockNumber}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Issuer Contract Address</span>
              <span className="font-mono text-slate-300 truncate block">
                {truncateHash(matchedProduct.onChainRecord.contractAddress, 6, 4)}
              </span>
            </div>
          </div>
        </div>
      )}

      {riskAssessment && (
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3 text-xs mb-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <Cpu className="w-4 h-4 text-cyan-400" />
              ML Risk Assessment
            </span>
            <span className="font-mono text-slate-300">
              {riskAssessment.riskLevel} · {riskAssessment.riskScore.toFixed(1)}/100
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 text-slate-400">
            <span>Confidence: {(riskAssessment.confidence * 100).toFixed(0)}%</span>
            <span>ELA: {((riskAssessment.elaScore ?? 0) * 100).toFixed(0)}%</span>
            <span>CMFD: {((riskAssessment.cmfdScore ?? 0) * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Navigation Shortcuts */}
      {matchedProduct && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/verify/${matchedProduct.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:translate-x-0.5"
          >
            <span>View Full Journey Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/forensics?id=${matchedProduct.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inspect AI Tamper Heatmap</span>
          </Link>
        </div>
      )}

      {/* QR Modal instance */}
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
