'use client';

import React, { useRef, useState } from 'react';
import { FileCheck, Loader2, PlusCircle } from 'lucide-react';
import DocumentDropzone from '@/components/verification/DocumentDropzone';
import DocumentHashCalculator from '@/components/verification/DocumentHashCalculator';
import Web3TransactionModal from '@/components/issuer/Web3TransactionModal';
import Button from '@/components/ui/Button';
import { ProductItem } from '@/lib/types';
import { TxStep } from '@/lib/tx';
import { createProductBatch } from '@/lib/api';

interface BatchRegisterFormProps {
  walletAccount: string | null;
  onNeedWallet: () => void;
  onRegistered: (product: ProductItem) => void;
}

export default function BatchRegisterForm({
  walletAccount,
  onNeedWallet,
  onRegistered,
}: BatchRegisterFormProps) {
  const [productName, setProductName] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [category, setCategory] = useState('Pharmaceuticals & Biologics');
  const [originCountry, setOriginCountry] = useState('Germany');
  const [destinationCountry, setDestinationCountry] = useState('United States');
  const [manufactureDate, setManufactureDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formError, setFormError] = useState('');
  const [attachedDoc, setAttachedDoc] = useState<{
    name: string;
    size: number;
    hash: string;
    timeMs: number;
  } | null>(null);

  const [txStep, setTxStep] = useState<TxStep>('idle');
  const [txHash, setTxHash] = useState('');
  const [newlyCreatedId, setNewlyCreatedId] = useState('');
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const handleFileAttached = (data: {
    fileName: string;
    fileSize: number;
    hash: string;
    timeMs: number;
  }) => {
    setAttachedDoc({
      name: data.fileName,
      size: data.fileSize,
      hash: data.hash,
      timeMs: data.timeMs,
    });
    setFormError('');
  };

  const handleCancel = () => {
    clearTimers();
    setTxStep('cancelled');
  };

  const handleRegisterBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAccount) {
      onNeedWallet();
      return;
    }
    if (!attachedDoc) {
      setFormError('Attach and hash a certificate before anchoring on-chain.');
      return;
    }
    if (txStep !== 'idle' && txStep !== 'confirmed' && txStep !== 'cancelled' && txStep !== 'reverted') {
      return;
    }

    clearTimers();
    setFormError('');
    setNewlyCreatedId('');
    setTxHash('');
    setTxStep('wallet_confirmation');

    const t1 = window.setTimeout(() => {
      const mockTx =
        '0x' +
        Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(mockTx);
      setTxStep('submitted');

      const t2 = window.setTimeout(() => {
        setTxStep('confirming');
        const t3 = window.setTimeout(() => {
          const suffix = (productName.trim()[0] || 'X').toUpperCase();
          const generatedId = `PR-${Math.floor(1000 + Math.random() * 9000)}-${suffix}`;
          setNewlyCreatedId(generatedId);
          setTxStep('confirmed');

          const newEntry: ProductItem = {
            id: generatedId,
            batchNumber: batchCode || `BATCH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            name: productName || 'Certified Industrial Cargo Batch',
            category,
            manufacturer: 'Authorized Verified Manufacturer',
            originCountry,
            destinationCountry,
            manufactureDate,
            documentHash: attachedDoc.hash,
            documentName: attachedDoc.name,
            documentMime: 'application/pdf',
            fileSizeBytes: attachedDoc.size,
            status: 'CREATED',
            onChainRecord: {
              txHash: mockTx,
              blockNumber: 19482500,
              contractAddress: '0x71C676D2f4C68B25e1aF28cbe9426fFF566A6b19',
              issuerAddress: walletAccount,
              timestamp: Math.floor(Date.now() / 1000),
              network: 'Ethereum Sepolia (ID: 11155111)',
              status: 'CONFIRMED',
            },
            riskAssessment: {
              riskScore: 4.8,
              riskLevel: 'LOW',
              tamperingDetected: false,
              confidence: 0.99,
              reasons: ['Newly registered proof anchored directly on-chain'],
            },
            milestones: [
              {
                id: 'm-new-1',
                status: 'CREATED',
                title: 'Batch Created & Document Anchored',
                location: `${originCountry} Logistics Hub`,
                timestamp: 'Just now',
                operator: walletAccount,
                completed: true,
                current: true,
              },
            ],
          };

          createProductBatch({
            id: generatedId,
            name: productName || 'Certified Industrial Cargo Batch',
            batchNumber: batchCode || `BATCH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            manufacturerAddress: walletAccount,
            originCountry,
            destinationCountry,
            documentHash: attachedDoc.hash,
            txHash: mockTx,
          }).then((persisted) => {
            onRegistered(persisted || newEntry);
          }).catch(() => {
            onRegistered(newEntry);
          });
        }, 1200);
        timersRef.current.push(t3);
      }, 1000);
      timersRef.current.push(t2);
    }, 1000);
    timersRef.current.push(t1);
  };

  const busy = txStep === 'wallet_confirmation' || txStep === 'submitted' || txStep === 'confirming';

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">1. Register New Product Batch</h2>
          </div>

          <form onSubmit={handleRegisterBatch} className="space-y-4 text-xs">
            <div>
              <label htmlFor="product-name" className="block text-slate-300 font-medium mb-1">
                Product Batch Name
              </label>
              <input
                id="product-name"
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Pfizer BioPharma Cold-Chain Vaccines (v2.4)"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="batch-code" className="block text-slate-300 font-medium mb-1">
                  Batch Number
                </label>
                <input
                  id="batch-code"
                  type="text"
                  required
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="BATCH-2026-9901"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-slate-300 font-medium mb-1">
                  Industry Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <option>Pharmaceuticals & Biologics</option>
                  <option>Aviation & Industrial Hardware</option>
                  <option>Electronics & Semiconductors</option>
                  <option>Luxury Goods & Timepieces</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="mfg-date" className="block text-slate-300 font-medium mb-1">
                Manufacture Date
              </label>
              <input
                id="mfg-date"
                type="date"
                required
                value={manufactureDate}
                onChange={(e) => setManufactureDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="origin" className="block text-slate-300 font-medium mb-1">
                  Country of Origin
                </label>
                <input
                  id="origin"
                  type="text"
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
              </div>
              <div>
                <label htmlFor="destination" className="block text-slate-300 font-medium mb-1">
                  Destination
                </label>
                <input
                  id="destination"
                  type="text"
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
              </div>
            </div>

            {formError && (
              <p className="text-rose-400 text-xs" role="alert">
                {formError}
              </p>
            )}

            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing On-Chain Transaction...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    Anchor Document Hash On-Chain
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <h2 className="text-base font-semibold text-white">
                2. Attach Certificate & Calculate Hash
              </h2>
            </div>
            <DocumentDropzone onFileProcessed={handleFileAttached} />
            <DocumentHashCalculator
              hash={attachedDoc?.hash}
              fileName={attachedDoc?.name}
              timeMs={attachedDoc?.timeMs}
            />
          </div>
        </div>
      </div>

      <Web3TransactionModal
        isOpen={txStep !== 'idle'}
        step={txStep}
        productId={newlyCreatedId || undefined}
        txHash={txHash || undefined}
        onCancel={handleCancel}
        onClose={() => setTxStep('idle')}
      />
    </>
  );
}
