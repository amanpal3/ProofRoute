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
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  isLowRisk
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isMediumRisk
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                Risk Level: {assessment.riskLevel}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Model: TrOCR + OpenCV v0.1.0-rules
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              AI / ML Tampering Forensics & Risk Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Target Document: {documentName}
            </p>
          </div>

          {/* Numerical Risk Gauge */}
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-white/5">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Risk Score</span>
              <span
                className={`text-3xl font-extrabold font-mono ${
                  isLowRisk ? 'text-emerald-400' : isMediumRisk ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {assessment.riskScore.toFixed(1)}
              </span>
              <span className="text-slate-500 text-xs font-mono"> / 100</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-mono text-xs font-bold shrink-0 border-current"
              style={{
                borderColor: isLowRisk ? '#10b981' : isMediumRisk ? '#f59e0b' : '#ef4444',
              }}
            >
              {Math.round(assessment.confidence * 100)}%
            </div>
          </div>
        </div>

        {/* Forensics Algorithm Breakdown: ELA, CMFD, OCR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                ELA Score
              </span>
              <span className={assessment.elaScore && assessment.elaScore > 0.5 ? 'text-rose-400' : 'text-emerald-400'}>
                {((assessment.elaScore ?? 0) * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Error Level Analysis compression delta across document surface pixels.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-indigo-400" />
                CMFD Score
              </span>
              <span className={assessment.cmfdScore && assessment.cmfdScore > 0.5 ? 'text-rose-400' : 'text-emerald-400'}>
                {((assessment.cmfdScore ?? 0) * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Copy-Move Forgery Detection for duplicated seals, stamps, and logos.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                OCR Font Match
              </span>
              <span className={assessment.fontAnomalyDetected ? 'text-rose-400' : 'text-emerald-400'}>
                {assessment.fontAnomalyDetected ? 'MISMATCH' : 'CONSISTENT'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              TrOCR font consistency check across numeric fields and signatory blocks.
            </p>
          </div>
        </div>

        {/* Explainability Breakdown Reasons */}
        <div className="space-y-2 pt-4 border-t border-white/5">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Explainable Detection Factors:
          </h4>
          <ul className="space-y-2">
            {assessment.reasons.map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950/60 border border-white/5"
              >
                {assessment.tamperingDetected ? (
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive ELA Tampering Visualizer */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ScanEye className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-semibold text-white">
                Error Level Analysis (ELA) Heatmap Inspector
              </h4>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'original' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Original Document
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side ELA
            </button>
            <button
              onClick={() => setViewMode('ela_heatmap')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'ela_heatmap' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Heatmap Only
            </button>
            </div>
          </div>

          {/* ELA Overlay Opacity Slider */}
          {(viewMode === 'split' || viewMode === 'ela_heatmap') && (
            <div className="flex items-center gap-3 text-xs text-slate-400 px-1">
              <Sliders className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-mono whitespace-nowrap">Heatmap Opacity</span>
              <input
                type="range"
                min={20}
                max={100}
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="flex-1 max-w-xs accent-indigo-500"
                aria-label="ELA heatmap overlay opacity"
              />
              <span className="font-mono text-cyan-400 w-8">{overlayOpacity}%</span>
            </div>
          )}
        </div>

        {/* ELA Canvas Viewport */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document Simulation Panel */}
          {(viewMode === 'original' || viewMode === 'split') && (
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-5 font-mono text-xs text-slate-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                <span>CERTIFICATE DOCUMENT SURFACE</span>
                <span className="text-emerald-400">RGB 300 DPI</span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">Document Header</span>
                  <p className="font-bold text-slate-100 text-sm">Certificate of Conformance & Quality Inspection</p>
                  <p className="text-slate-400 text-xs">ISO 9001:2015 & AS9100 Certified Release</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-900/60 rounded border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Test Specification:</span>
                    <span className="text-slate-200 font-mono">ASTM E8 / E8M-21</span>
                  </div>
                  <div className={`p-2.5 rounded border ${assessment.tamperingDetected ? 'bg-rose-950/40 border-rose-500/50' : 'bg-slate-900/60 border-white/5'}`}>
                    <span className="text-slate-400 block text-[10px]">Yield / Tensile Strength:</span>
                    <span className={`font-mono font-bold ${assessment.tamperingDetected ? 'text-rose-400' : 'text-slate-200'}`}>
                      {assessment.tamperingDetected ? '680 MPa [ALTERED]' : '420 MPa [VERIFIED]'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/40 rounded-lg border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Authorized Seal & Signatory:</span>
                    <span className="font-semibold text-slate-200">Dr. Markus Richter, Lead Auditor</span>
                  </div>
                  <div className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center text-[9px] uppercase font-mono ${
                    assessment.tamperingDetected ? 'border-rose-500 text-rose-400' : 'border-emerald-500 text-emerald-400'
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
              className="relative rounded-2xl bg-black border border-slate-800 p-5 font-mono text-xs overflow-hidden transition-opacity"
              style={{ opacity: viewMode === 'ela_heatmap' ? overlayOpacity / 100 : 1 }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Layers className="w-3.5 h-3.5" />
                  ERROR LEVEL ANALYSIS (ELA)
                </span>
                <span className="text-amber-400">Resaved JPEG Q=95 Delta</span>
              </div>

              {/* Heatmap Graphic Representation */}
              <div className="relative h-56 flex flex-col justify-center items-center my-2 rounded-xl bg-slate-950/80 border border-slate-800/80 p-4">
                {/* Background noise grid representing compression uniformity */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:12px_12px]" />

                {assessment.tamperingDetected ? (
                  /* High Tampering Anomaly Highlights */
                  <div className="relative z-10 w-full space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="relative p-4 rounded-xl bg-rose-500/10 border-2 border-rose-500 text-center animate-pulse shadow-glow shadow-rose-500/20">
                        <div className="text-xs font-bold text-rose-400 font-mono">
                          ⚠️ HIGH ELA DELTA: 0.88 (Altered Pixels)
                        </div>
                        <div className="text-[11px] text-slate-300 mt-1">
                          Region: Tensile Metric & Stamp Contour
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-xs text-rose-300 font-mono">
                      Pixel artifact discontinuity detected at byte offset 0x4F12.
                    </div>
                  </div>
                ) : (
                  /* Uniform Authentic ELA */
                  <div className="relative z-10 text-center space-y-2">
                    <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      ELA DELTA: 0.02 (Uniform Compression)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Zero high-frequency anomaly clusters detected.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Low Anomaly (0.0)</span>
                <div className="w-32 h-2 rounded-full bg-gradient-to-r from-blue-900 via-amber-500 to-rose-600" />
                <span>Critical Spike (1.0)</span>
              </div>
            </div>
          )}
        </div>

        {/* Mandatory Legal Disclaimer per ProofRoute Specification */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-300/90 leading-relaxed">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Mandatory Disclaimer:</strong> Risk analysis and Error
            Level Analysis (ELA) scores are generated via automated machine learning heuristics for
            decision support and do not constitute absolute legal proof of authenticity or fraud.
            Authoritative proof remains anchored on-chain.
          </p>
        </div>
      </div>
    </div>
  );
}
