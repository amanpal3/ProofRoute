'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
          dark: '#09090b',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-[#0d0f14] border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="space-y-1 mb-4">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 mb-1.5">
            <QrCode className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Public Verification QR</h3>
          <p className="text-xs text-zinc-400 line-clamp-1">{productName}</p>
          <div className="font-mono text-[11px] text-zinc-400 font-medium">{productId}</div>
        </div>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-lg inline-block shadow mb-4">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt={`QR code for ${productId}`}
              width={200}
              height={200}
              unoptimized
              className="w-44 h-44 sm:w-48 sm:h-48 mx-auto rounded"
            />
          ) : (
            <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center text-zinc-400 text-xs font-mono">
              Generating QR...
            </div>
          )}
        </div>

        {/* Scan notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 mb-4 font-mono">
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Scan with any standard smartphone camera.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700/80 transition-colors active:scale-[0.98]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy URL'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium border border-white/20 transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
