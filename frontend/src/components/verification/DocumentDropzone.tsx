'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Zap, Sparkles, Hash } from 'lucide-react';
import { computeFileSHA256 } from '@/lib/crypto';
import { SAMPLE_PRODUCTS } from '@/lib/mockData';

interface DocumentDropzoneProps {
  onFileProcessed: (data: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    hash: string;
    timeMs: number;
    presetProductId?: string;
  }) => void;
  isProcessing?: boolean;
}

export default function DocumentDropzone({
  onFileProcessed,
  isProcessing = false,
}: DocumentDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentFile, setCurrentFile] = useState<{
    name: string;
    size: number;
    hash: string;
    timeMs: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File, presetId?: string) => {
    try {
      const { hash, timeMs } = await computeFileSHA256(file);
      setCurrentFile({
        name: file.name,
        size: file.size,
        hash,
        timeMs,
      });
      onFileProcessed({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
        hash,
        timeMs,
        presetProductId: presetId,
      });
    } catch (err) {
      console.error('Failed to hash file', err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Preset quick-testers for instant demo without uploading local files
  const loadPresetValid = () => {
    const valid = SAMPLE_PRODUCTS['PR-8829-X'];
    const fakeFile = new File(['Authentic pharmaceutical batch certificate content 2026'], valid.documentName, {
      type: 'application/pdf',
    });
    // Use the exact anchored hash for the authentic preset
    setCurrentFile({
      name: valid.documentName,
      size: valid.fileSizeBytes,
      hash: valid.documentHash,
      timeMs: 4.2,
    });
    onFileProcessed({
      fileName: valid.documentName,
      fileSize: valid.fileSizeBytes,
      mimeType: valid.documentMime,
      hash: valid.documentHash,
      timeMs: 4.2,
      presetProductId: 'PR-8829-X',
    });
  };

  const loadPresetTampered = () => {
    const tampered = SAMPLE_PRODUCTS['PR-4410-T'];
    // Tampered hash with altered byte
    const alteredHash = '0x18471cba8829ef10023741829374019283740192837401928374019283740199';
    setCurrentFile({
      name: tampered.documentName,
      size: tampered.fileSizeBytes,
      hash: alteredHash,
      timeMs: 5.1,
    });
    onFileProcessed({
      fileName: tampered.documentName,
      fileSize: tampered.fileSizeBytes,
      mimeType: tampered.documentMime,
      hash: alteredHash,
      timeMs: 5.1,
      presetProductId: 'PR-4410-T',
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 group ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-800 hover:border-indigo-500/40 bg-slate-900/40 hover:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Ambient background hover glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:text-cyan-400 transition-all shadow-glow-sm shadow-indigo-500/10">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Drop your Certificate or Bill of Lading here
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Supports <span className="text-slate-300 font-mono">PDF, PNG, JPEG</span> up to 10MB
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Client-side WebCrypto SHA-256 (Zero cloud leak)</span>
          </div>
        </div>
      </div>

      {/* Preset Fast-Testers */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-white/5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-slate-300">Don&apos;t have a file ready?</span>
          <span>Try instant verification presets:</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadPresetValid}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Authentic Batch (Valid)
          </button>
          <button
            type="button"
            onClick={loadPresetTampered}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Altered MTR (Tampered)
          </button>
        </div>
      </div>

      {/* Current File Hashing Feedback */}
      {currentFile && (
        <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white truncate max-w-xs sm:max-w-md">
                  {currentFile.name}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  {(currentFile.size / 1024).toFixed(1)} KB • Computed in {currentFile.timeMs}ms
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400">
              <Hash className="w-3 h-3 text-slate-500" />
              <span className="truncate max-w-[200px] sm:max-w-[280px]">
                {currentFile.hash}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
