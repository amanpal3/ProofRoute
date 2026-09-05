'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScanEye, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import TamperHeatmapViewer from '@/components/forensics/TamperHeatmapViewer';
import { SAMPLE_PRODUCTS } from '@/lib/mockData';

function ForensicsContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || 'PR-IND-2002';
  const [selectedId, setSelectedId] = useState<string>(
    SAMPLE_PRODUCTS[initialId] ? initialId : 'PR-IND-2002'
  );

  const currentProduct = SAMPLE_PRODUCTS[selectedId] || SAMPLE_PRODUCTS['PR-IND-2002'];

  return (
    <div className="space-y-8">
      {/* Target Document Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-white/10">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">Select Target Document for Forensic Analysis:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedId('PR-IND-2002')}
            className={`flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedId === 'PR-IND-2002'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Surat Cotton Report (High Risk / Tampered)</span>
          </button>

          <button
            onClick={() => setSelectedId('PR-IND-1001')}
            className={`flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedId === 'PR-IND-1001'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pune MedTech Certificate (Authentic)</span>
          </button>
        </div>
      </div>

      {/* Forensics Viewer Component */}
      <TamperHeatmapViewer
        assessment={currentProduct.riskAssessment}
        documentName={currentProduct.documentName}
      />
    </div>
  );
}

export default function ForensicsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300">
          <ScanEye className="w-4 h-4 text-cyan-400" />
          <span>Error Level Analysis (ELA) • TrOCR Anomaly Detection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Document Forensics & Tampering Inspector
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Inspect digital image artifacts, font inconsistencies, and altered numerical fields
          using explainable computer vision and machine learning forensics.
        </p>
      </div>

      <Suspense fallback={<div className="text-center text-slate-400 py-10">Loading forensics inspector...</div>}>
        <ForensicsContent />
      </Suspense>
    </div>
  );
}
