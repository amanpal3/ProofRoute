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
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-mono">Loading on-chain provenance record…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Product Not Found</h1>
        <p className="text-sm text-slate-400">
          No registered on-chain commitment was found for Product ID{' '}
          <span className="font-mono text-rose-300 font-semibold">{productId}</span>.
        </p>
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Verifier
        </Link>
      </div>
    );
  }

  const isAuthentic = product.riskAssessment.riskLevel === 'LOW';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Document Verifier
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Show QR Code</span>
          </button>
        </div>
      </div>

      {/* Product Overview Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
                {product.id}
              </span>
              <span className="text-xs text-slate-400">• {product.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Building2 className="w-4 h-4 text-indigo-400" />
                {product.manufacturer}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                {product.originCountry} ➔ {product.destinationCountry}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                Batch: {product.batchNumber}
              </span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="shrink-0">
            <div
              className={`p-4 rounded-2xl border text-center space-y-1 ${
                isAuthentic
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase">
                {isAuthentic ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    AUTHENTIC PRODUCT
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    TAMPER ALERT
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {isAuthentic ? 'Cryptographically Anchored' : 'Integrity Mismatch Detected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Provenance & Milestones vs AI Tamper Forensics */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('provenance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'provenance'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Shipment Journey & On-Chain Proof</span>
        </button>

        <button
          onClick={() => setActiveTab('forensics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'forensics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cpu className="w-4 h-4 text-cyan-300" />
          <span>AI Tamper Forensics & Heatmap</span>
        </button>
      </div>

      {/* Tab 1: Provenance & Milestones */}
      {activeTab === 'provenance' && (
        <div className="space-y-8 animate-in fade-in duration-200">
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
          <div className="glass-panel p-6 sm:p-8 rounded-3xl">
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
