'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Zap, Hash } from 'lucide-react';
import { computeFileSHA256 } from '@/lib/crypto';
import { SAMPLE_PRODUCTS } from '@/lib/mockData';

interface DocumentDropzoneProps {
  onFileProcessed: (data: {
    file?: File;
    fileName: string;
    fileSize: number;
    mimeType: string;
    hash: string;
    timeMs: number;
    presetProductId?: string;
  }) => void;
}

export default function DocumentDropzone({
  onFileProcessed,
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
        file,
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
    <div className="space-y-3">
      {/* Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden cursor-pointer rounded-2xl border border-dashed p-8 sm:p-12 text-center transition-all duration-150 group ${
          isDragOver
            ? 'border-white bg-zinc-900 dark:border-zinc-950 dark:bg-zinc-100'
            : 'border-zinc-800 dark:border-zinc-300 hover:border-zinc-700 dark:hover:border-zinc-400 bg-black text-white dark:bg-white dark:text-zinc-950 shadow-2xl'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-3.5">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white dark:bg-zinc-100 dark:border-zinc-300 dark:text-zinc-950 flex items-center justify-center group-hover:scale-105 transition-all shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white dark:text-zinc-950 tracking-tight">
              Drop Certificate of Authenticity or Bill of Lading
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Supports <span className="text-white dark:text-zinc-950 font-mono font-semibold">PDF, PNG, JPEG</span> up to 10MB
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300 dark:bg-zinc-100 dark:border-zinc-300 dark:text-zinc-800 font-medium shadow-sm">
            <Zap className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span>In-browser WebCrypto SHA-256 (Zero cloud leak)</span>
          </div>
        </div>
      </div>

      {/* Preset Fast-Testers */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-black text-white dark:bg-white dark:text-zinc-950 border border-zinc-900 dark:border-zinc-200 shadow-xl transition-colors">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-300 dark:text-zinc-700">
          <span className="font-bold text-white dark:text-zinc-950">Preset Samples:</span>
          <span>Test without uploading a file:</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadPresetValid}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-zinc-900 text-emerald-400 hover:bg-zinc-800 border border-emerald-500/40 dark:bg-emerald-50 dark:hover:bg-emerald-100 dark:text-emerald-800 dark:border-emerald-300 transition-all active:scale-[0.98] shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Valid Batch (PR-8829-X)
          </button>
          <button
            type="button"
            onClick={loadPresetTampered}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-zinc-900 text-rose-400 hover:bg-zinc-800 border border-rose-500/40 dark:bg-rose-50 dark:hover:bg-rose-100 dark:text-rose-800 dark:border-rose-300 transition-all active:scale-[0.98] shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Altered Batch (PR-4410-T)
          </button>
        </div>
      </div>

      {/* Current File Hashing Feedback */}
      {currentFile && (
        <div className="p-3.5 rounded-xl bg-black text-white dark:bg-white dark:text-zinc-950 border border-zinc-900 dark:border-zinc-200 animate-in fade-in duration-200 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white dark:text-zinc-950 truncate max-w-xs sm:max-w-md">
                  {currentFile.name}
                </p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-600 font-mono font-medium">
                  {(currentFile.size / 1024).toFixed(1)} KB • Computed in {currentFile.timeMs}ms
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border border-zinc-800 dark:border-zinc-300 text-[11px] font-mono font-semibold">
              <Hash className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
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
