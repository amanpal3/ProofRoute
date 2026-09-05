'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  QrCode,
  Truck,
  Cpu,
  Building2,
  Calendar,
  Globe2,
  Loader2,
} from 'lucide-react';
import { fetchProductById } from '@/lib/api';
import { ProductItem } from '@/lib/types';
import VerificationResultCard from '@/components/verification/VerificationResultCard';
import ShipmentTimeline from '@/components/timeline/ShipmentTimeline';
import TamperHeatmapViewer from '@/components/forensics/TamperHeatmapViewer';
import QrCodeModal from '@/components/verification/QrCodeModal';

export default function ProductVerificationPage() {
  const params = useParams();
  const productId = typeof params?.productId === 'string' ? params.productId.toUpperCase() : '';
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'provenance' | 'forensics'>('provenance');

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProductById(productId).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-3">
        <Loader2 className="w-6 h-6 text-zinc-400 animate-spin mx-auto" />
        <p className="text-xs text-zinc-500 font-mono">Loading on-chain provenance record…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/25 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">Product Not Found</h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          No registered on-chain commitment was found for Product ID{' '}
          <span className="font-mono text-rose-600 dark:text-rose-300 font-medium">{productId}</span>.
        </p>
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-medium transition-all active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Verifier
        </Link>
      </div>
    );
  }

  const isAuthentic = product.riskAssessment.riskLevel === 'LOW';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Back button & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/verify"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Document Verifier
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-[0.98] shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Show QR Code</span>
          </button>
        </div>
      </div>

      {/* Product Overview Header Card */}
      <div className="specular-card p-6 sm:p-7 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-zinc-950 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 px-2 py-0.5 rounded font-bold shadow-sm">
                {product.id}
              </span>
              <span className="text-xs text-zinc-700 dark:text-zinc-400 font-medium">• {product.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-800 dark:text-zinc-300 pt-0.5 font-mono">
              <span className="flex items-center gap-1.5 text-zinc-950 dark:text-zinc-200 font-semibold">
                <Building2 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                {product.manufacturer}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                {product.originCountry} ➔ {product.destinationCountry}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                Batch: {product.batchNumber}
              </span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="shrink-0">
            <div
              className={`p-3.5 rounded-lg border text-center space-y-1 shadow-sm ${
                isAuthentic
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] font-bold uppercase">
                {isAuthentic ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    AUTHENTIC PRODUCT
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                    TAMPER ALERT
                  </>
                )}
              </div>
              <p className="text-[10px] text-zinc-700 dark:text-zinc-400 font-mono font-medium">
                {isAuthentic ? 'Cryptographically Anchored' : 'Integrity Mismatch Detected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Provenance & Milestones vs AI Tamper Forensics */}
      <div className="flex items-center gap-1.5 border-b border-zinc-300 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('provenance')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'provenance'
              ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm font-semibold'
              : 'text-zinc-800 hover:bg-zinc-800 hover:text-white dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Shipment Journey & On-Chain Proof</span>
        </button>

        <button
          onClick={() => setActiveTab('forensics')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'forensics'
              ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm font-semibold'
              : 'text-zinc-800 hover:bg-zinc-800 hover:text-white dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
          <span>AI Tamper Forensics & Heatmap</span>
        </button>
      </div>

      {/* Tab 1: Provenance & Milestones */}
      {activeTab === 'provenance' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Verification Status Card */}
          <VerificationResultCard
            result={{
              status: isAuthentic ? 'VALID' : 'TAMPERED',
              computedHash: product.documentHash,
              expectedHash: product.documentHash,
              matchedProduct: product,
              verificationTimestamp: Date.now(),
              executionTimeMs: 2.1,
            }}
          />

          {/* Shipment Journey Timeline */}
          <div className="specular-card p-5 sm:p-7 rounded-xl">
            <ShipmentTimeline milestones={product.milestones} currentStatus={product.status} />
          </div>
        </div>
      )}

      {/* Tab 2: Forensics & Heatmap */}
      {activeTab === 'forensics' && (
        <div className="animate-in fade-in duration-200">
          <TamperHeatmapViewer
            assessment={product.riskAssessment}
            documentName={product.documentName}
          />
        </div>
      )}

      {/* QR Code Modal instance */}
      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        productId={product.id}
        productName={product.name}
      />
    </div>
  );
}
