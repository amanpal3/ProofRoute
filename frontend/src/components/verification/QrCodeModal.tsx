'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Download, Copy, Check, Smartphone } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export default function QrCodeModal({
  isOpen,
  onClose,
  productId,
  productName,
}: QrCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Verification URL that consumers scan
  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${productId}`
    : `https://proofroute.network/verify/${productId}`;

  useEffect(() => {
    if (isOpen && productId) {
      QRCode.toDataURL(verificationUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#080c14',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR', err));
    }
  }, [isOpen, productId, verificationUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `ProofRoute-QR-${productId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-indigo-950/50 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-2">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Public Verification QR</h3>
          <p className="text-xs text-slate-400 line-clamp-1">{productName}</p>
          <div className="font-mono text-xs text-cyan-300 font-semibold">{productId}</div>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl inline-block shadow-xl shadow-black/40 mb-5">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR code for ${productId}`}
              className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-slate-400 text-xs">
              Generating QR...
            </div>
          )}
        </div>

        {/* Scan notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-5">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>No wallet or app required. Scan with camera.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy URL'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
