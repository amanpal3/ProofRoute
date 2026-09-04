'use client';

import React, { useState } from 'react';
import {
  Building2,
  Wallet,
  PlusCircle,
  FileCheck,
  CheckCircle2,
  Loader2,
  Hash,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import DocumentDropzone from '@/components/verification/DocumentDropzone';
import Web3WalletModal from '@/components/issuer/Web3WalletModal';
import QrCodeModal from '@/components/verification/QrCodeModal';
import { truncateHash } from '@/lib/crypto';
import { SAMPLE_PRODUCTS } from '@/lib/mockData';

type TxStep = 'idle' | 'wallet_confirmation' | 'submitted' | 'confirming' | 'confirmed';

export default function IssuerPortalPage() {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletAccount, setWalletAccount] = useState<string | null>(
    '0x1234567890123456789012345678901234567890'
  );

  // Form fields
  const [productName, setProductName] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [category, setCategory] = useState('Pharmaceuticals & Biologics');
  const [originCountry, setOriginCountry] = useState('Germany');
  const [destinationCountry, setDestinationCountry] = useState('United States');

  // Attached Document
  const [attachedDoc, setAttachedDoc] = useState<{
    name: string;
    size: number;
    hash: string;
  } | null>(null);

  // Transaction State Machine
  const [txStep, setTxStep] = useState<TxStep>('idle');
  const [newlyCreatedId, setNewlyCreatedId] = useState('');
  const [activeQrId, setActiveQrId] = useState<string | null>(null);

  // Registered batches list
  const [batches, setBatches] = useState(Object.values(SAMPLE_PRODUCTS));

  const handleFileAttached = (data: { fileName: string; fileSize: number; hash: string }) => {
    setAttachedDoc({
      name: data.fileName,
      size: data.fileSize,
      hash: data.hash,
    });
  };

  const handleRegisterBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAccount) {
      setIsWalletOpen(true);
      return;
    }
    if (!attachedDoc) {
      alert('Please attach and hash a Certificate document before registering.');
      return;
    }

    // Step 1: Wallet Confirmation Request
    setTxStep('wallet_confirmation');

    setTimeout(() => {
      // Step 2: Transaction Submitted to EVM Node
      const mockTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxStep('submitted');

      // Step 3: Block Confirming
      setTimeout(() => {
        setTxStep('confirming');

        // Step 4: Confirmed Receipt
        setTimeout(() => {
          const generatedId = `PR-${Math.floor(1000 + Math.random() * 9000)}-${productName.slice(0, 1).toUpperCase() || 'X'}`;
          setNewlyCreatedId(generatedId);
          setTxStep('confirmed');

          // Append to local ledger table
          const newEntry = {
            id: generatedId,
            batchNumber: batchCode || `BATCH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            name: productName || 'Certified Industrial Cargo Batch',
            category,
            manufacturer: 'Authorized Verified Manufacturer',
            originCountry,
            destinationCountry,
            manufactureDate: new Date().toISOString().split('T')[0],
            documentHash: attachedDoc.hash,
            documentName: attachedDoc.name,
            documentMime: 'application/pdf',
            fileSizeBytes: attachedDoc.size,
            status: 'CREATED' as const,
            onChainRecord: {
              txHash: mockTx,
              blockNumber: 19482500,
              contractAddress: '0x71C676D2f4C68B25e1aF28cbe9426fFF566A6b19',
              issuerAddress: walletAccount,
              timestamp: Math.floor(Date.now() / 1000),
              network: 'Ethereum Sepolia (ID: 11155111)',
              status: 'CONFIRMED' as const,
            },
            riskAssessment: {
              riskScore: 4.8,
              riskLevel: 'LOW' as const,
              tamperingDetected: false,
              confidence: 0.99,
              reasons: ['Newly registered proof anchored directly on-chain'],
            },
            milestones: [
              {
                id: 'm-new-1',
                status: 'CREATED' as const,
                title: 'Batch Created & Document Anchored',
                location: `${originCountry} Logistics Hub`,
                timestamp: 'Just now',
                operator: walletAccount,
                completed: true,
                current: true,
              },
            ],
          };

          setBatches([newEntry, ...batches]);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300 mb-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Authorized Manufacturer & Issuer Gateway</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Issuer Batch Registration Portal
          </h1>
          <p className="text-sm text-slate-400">
            Commit immutable SHA-256 document proofs and initialize provenance lifecycles on-chain.
          </p>
        </div>

        {/* Wallet Status Card */}
        <div className="flex items-center gap-3">
          {walletAccount ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">AUTHORIZED ISSUER</span>
                <span className="font-mono text-slate-200 font-medium">
                  {truncateHash(walletAccount, 6, 4)}
                </span>
              </div>
              <button
                onClick={() => setIsWalletOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Wallet className="w-4 h-4" />
              Connect Issuer Wallet
            </button>
          )}
        </div>
      </div>

      {/* Registration Form & Dropzone Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Batch Details Form */}
        <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">1. Register New Product Batch</h2>
          </div>

          <form onSubmit={handleRegisterBatch} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Product Batch Name</label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Pfizer BioPharma Cold-Chain Vaccines (v2.4)"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Batch Number</label>
                <input
                  type="text"
                  required
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="BATCH-2026-9901"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Industry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option>Pharmaceuticals & Biologics</option>
                  <option>Aviation & Industrial Hardware</option>
                  <option>Electronics & Semiconductors</option>
                  <option>Luxury Goods & Timepieces</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Country of Origin</label>
                <input
                  type="text"
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Destination</label>
                <input
                  type="text"
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={txStep !== 'idle' && txStep !== 'confirmed'}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {txStep === 'idle' || txStep === 'confirmed' ? (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Anchor Document Hash On-Chain</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing On-Chain Transaction...</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Web3 Transaction Progress State Machine */}
          {txStep !== 'idle' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Transaction State:</span>
                <span className="text-cyan-400 uppercase font-bold">{txStep}</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <div
                  className="h-1.5 rounded-full bg-emerald-400"
                />
                <div
                  className={`h-1.5 rounded-full ${
                    ['submitted', 'confirming', 'confirmed'].includes(txStep)
                      ? 'bg-emerald-400'
                      : 'bg-slate-800'
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full ${
                    ['confirming', 'confirmed'].includes(txStep) ? 'bg-emerald-400' : 'bg-slate-800'
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full ${
                    txStep === 'confirmed' ? 'bg-emerald-400' : 'bg-slate-800'
                  }`}
                />
              </div>

              {txStep === 'confirmed' && (
                <div className="pt-2 text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success! Batch anchored as {newlyCreatedId}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Attach Document & SHA-256 Preview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <Hash className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">
                2. Attach Certificate & Calculate Hash
              </h2>
            </div>

            <DocumentDropzone onFileProcessed={handleFileAttached} />

            {attachedDoc && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                <span className="text-slate-400 block">SHA-256 Digest to be Committed:</span>
                <p className="text-cyan-400 break-all select-all font-semibold">
                  {attachedDoc.hash}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registered Batches Ledger */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Registered Batches on Registry Contract</h2>
            <p className="text-xs text-slate-400">
              Contract Address: <span className="font-mono text-cyan-400">0x71C676D2f4C68B25e1aF28cbe9426fFF566A6b19</span>
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {batches.length} Batches Indexed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Batch Number</th>
                <th className="py-3 px-4">SHA-256 Commitment</th>
                <th className="py-3 px-4">Milestone</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{batch.id}</td>
                  <td className="py-3.5 px-4 text-slate-300">{batch.batchNumber}</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-mono">
                    {truncateHash(batch.documentHash, 8, 6)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {batch.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 flex items-center gap-2">
                    <button
                      onClick={() => setActiveQrId(batch.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      title="View QR"
                    >
                      <QrCode className="w-4 h-4 text-cyan-400" />
                    </button>
                    <a
                      href={`/verify/${batch.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      title="Public Verifier Link"
                    >
                      <ExternalLink className="w-4 h-4 text-indigo-400" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal instance */}
      {activeQrId && (
        <QrCodeModal
          isOpen={!!activeQrId}
          onClose={() => setActiveQrId(null)}
          productId={activeQrId}
          productName={batches.find((b) => b.id === activeQrId)?.name || activeQrId}
        />
      )}

      {/* Wallet Modal */}
      <Web3WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        connectedAccount={walletAccount}
        onConnect={(acc) => setWalletAccount(acc)}
        onDisconnect={() => setWalletAccount(null)}
      />
    </div>
  );
}
