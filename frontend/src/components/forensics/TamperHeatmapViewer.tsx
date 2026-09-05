'use client';

import React, { useState } from 'react';
import {
  ScanEye,
  Sliders,
  AlertOctagon,
  CheckCircle2,
  FileSearch,
  Eye,
  Layers,
  Info,
} from 'lucide-react';
import { RiskAssessment } from '@/lib/types';

interface TamperHeatmapViewerProps {
  assessment: RiskAssessment;
  documentName: string;
}

export default function TamperHeatmapViewer({
  assessment,
  documentName,
}: TamperHeatmapViewerProps) {
  const [viewMode, setViewMode] = useState<'original' | 'ela_heatmap' | 'split'>('split');
  const [overlayOpacity, setOverlayOpacity] = useState(75);

  const isMediumRisk = assessment.riskLevel === 'MEDIUM';
  const isLowRisk = assessment.riskLevel === 'LOW';

  return (
    <div className="space-y-6">
      {/* Top Header & Risk Gauge */}
      <div className="specular-card p-5 sm:p-7 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-mono font-medium uppercase px-2 py-0.5 rounded border ${
                  isLowRisk
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                    : isMediumRisk
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25'
                }`}
              >
                Risk Level: {assessment.riskLevel}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                Engine: TrOCR + OpenCV
              </span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-1 tracking-tight">
              AI / ML Tampering Forensics & Risk Engine
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
              Target Document: {documentName}
            </p>
          </div>

          {/* Numerical Risk Gauge */}
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="text-right">
              <span className="text-[11px] text-zinc-500 block">Risk Score</span>
              <span
                className={`text-2xl font-bold font-mono ${
                  isLowRisk ? 'text-emerald-600 dark:text-emerald-400' : isMediumRisk ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {assessment.riskScore.toFixed(1)}
              </span>
              <span className="text-zinc-400 dark:text-zinc-600 text-xs font-mono"> / 100</span>
            </div>
            <div
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-xs font-semibold shrink-0"
              style={{
                borderColor: isLowRisk ? '#10b981' : isMediumRisk ? '#f59e0b' : '#f43f5e',
                color: isLowRisk ? '#10b981' : isMediumRisk ? '#f59e0b' : '#f43f5e',
              }}
            >
              {Math.round(assessment.confidence * 100)}%
            </div>
          </div>
        </div>

        {/* Forensics Algorithm Breakdown: ELA, CMFD, OCR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                ELA Delta
              </span>
              <span className={assessment.elaScore && assessment.elaScore > 0.5 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                {((assessment.elaScore ?? 0) * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Error Level Analysis compression delta across surface pixels.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                CMFD Score
              </span>
              <span className={assessment.cmfdScore && assessment.cmfdScore > 0.5 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                {((assessment.cmfdScore ?? 0) * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Copy-Move Forgery Detection for duplicated stamps and seals.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                OCR Font Consistency
              </span>
              <span className={assessment.fontAnomalyDetected ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                {assessment.fontAnomalyDetected ? 'MISMATCH' : 'CONSISTENT'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              TrOCR font consistency check across numeric fields.
            </p>
          </div>
        </div>

        {/* Explainability Breakdown Reasons */}
        <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
          <h4 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Explainable Detection Factors:
          </h4>
          <ul className="space-y-1.5">
            {assessment.reasons.map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80"
              >
                {assessment.tamperingDetected ? (
                  <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed text-xs">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive ELA Tampering Visualizer */}
      <div className="specular-card p-5 sm:p-7 rounded-xl space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ScanEye className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Error Level Analysis (ELA) Heatmap Inspector
              </h4>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
              <button
                onClick={() => setViewMode('original')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'original'
                    ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'split'
                    ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setViewMode('ela_heatmap')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'ela_heatmap'
                    ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Heatmap
              </button>
            </div>
          </div>

          {/* ELA Overlay Opacity Slider */}
          {(viewMode === 'split' || viewMode === 'ela_heatmap') && (
            <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 px-1">
              <Sliders className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="font-mono text-xs whitespace-nowrap">Heatmap Opacity</span>
              <input
                type="range"
                min={20}
                max={100}
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="flex-1 max-w-xs accent-zinc-700 dark:accent-zinc-400"
                aria-label="ELA heatmap overlay opacity"
              />
              <span className="font-mono text-zinc-800 dark:text-zinc-200 w-8 text-xs">{overlayOpacity}%</span>
            </div>
          )}
        </div>

        {/* ELA Canvas Viewport */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document Simulation Panel */}
          {(viewMode === 'original' || viewMode === 'split') && (
            <div className="relative rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 font-mono text-xs text-zinc-800 dark:text-zinc-300 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-2 text-[11px] text-zinc-500">
                <span>DOCUMENT SURFACE</span>
                <span className="text-zinc-500 dark:text-zinc-400">RGB 300 DPI</span>
              </div>

              <div className="space-y-2.5 font-sans text-xs">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] font-mono uppercase">Document Header</span>
                  <p className="font-medium text-zinc-900 dark:text-white text-xs">Certificate of Conformance & Quality Inspection</p>
                  <p className="text-zinc-500 text-[11px]">ISO 9001:2015 & AS9100 Certified Release</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/40 rounded border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Test Spec:</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">ASTM E8 / E8M-21</span>
                  </div>
                  <div className={`p-2.5 rounded border ${assessment.tamperingDetected ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/40' : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800'}`}>
                    <span className="text-zinc-500 block text-[10px]">Tensile Strength:</span>
                    <span className={`font-mono font-medium text-[11px] ${assessment.tamperingDetected ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                      {assessment.tamperingDetected ? '680 MPa [ALTERED]' : '420 MPa [VERIFIED]'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/40 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Authorized Signatory:</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">Dr. Markus Richter, Lead Auditor</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full border border-dashed flex items-center justify-center text-[9px] uppercase font-mono ${
                    assessment.tamperingDetected ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {assessment.tamperingDetected ? 'FORGED' : 'VALID'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ELA Heatmap View */}
          {(viewMode === 'ela_heatmap' || viewMode === 'split') && (
            <div
              className="relative rounded-xl bg-black border border-zinc-800 p-4 font-mono text-xs overflow-hidden transition-opacity"
              style={{ opacity: viewMode === 'ela_heatmap' ? overlayOpacity / 100 : 1 }}
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  ERROR LEVEL ANALYSIS (ELA)
                </span>
                <span className="text-zinc-500">JPEG Q=95 Delta</span>
              </div>

              {/* Heatmap Graphic Representation */}
              <div className="relative h-48 flex flex-col justify-center items-center my-2 rounded-lg bg-zinc-950 border border-zinc-800/80 p-4">
                {/* Background noise grid representing compression uniformity */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#a1a1aa_1px,transparent_1px)] [background-size:12px_12px]" />

                {assessment.tamperingDetected ? (
                  /* High Tampering Anomaly Highlights */
                  <div className="relative z-10 w-full space-y-3">
                    <div className="flex items-center justify-center">
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-center">
                        <div className="text-xs font-semibold text-rose-400 font-mono">
                          HIGH ELA DELTA: 0.88 (Altered Pixels)
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Region: Tensile Metric & Stamp Contour
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-[11px] text-rose-300 font-mono">
                      Pixel artifact discontinuity detected at byte offset 0x4F12.
                    </div>
                  </div>
                ) : (
                  /* Uniform Authentic ELA */
                  <div className="relative z-10 text-center space-y-1.5">
                    <div className="inline-flex p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-mono font-medium text-emerald-400">
                      ELA DELTA: 0.02 (Uniform Compression)
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Zero high-frequency anomaly clusters detected.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                <span>Low Anomaly (0.0)</span>
                <div className="w-28 h-1.5 rounded-full bg-gradient-to-r from-zinc-700 via-amber-500 to-rose-500" />
                <span>Critical (1.0)</span>
              </div>
            </div>
          )}
        </div>

        {/* Mandatory Legal Disclaimer per ProofRoute Specification */}
        <div className="p-3 rounded-lg bg-zinc-100/80 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-[11px]">
            <strong className="text-zinc-900 dark:text-zinc-200">Mandatory Disclaimer:</strong> Risk analysis and Error
            Level Analysis (ELA) scores are generated via automated machine learning heuristics for
            decision support and do not constitute absolute legal proof of authenticity or fraud.
            Authoritative proof remains anchored on-chain.
          </p>
        </div>
      </div>
    </div>
  );
}
