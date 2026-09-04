'use client';

import React, { useState } from 'react';
import { Building2, Wallet, QrCode, ExternalLink } from 'lucide-react';
import BatchRegisterForm from '@/components/issuer/BatchRegisterForm';
import QrCodeModal from '@/components/verification/QrCodeModal';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { truncateHash } from '@/lib/crypto';
import { SAMPLE_PRODUCTS } from '@/lib/mockData';
import { ProductItem } from '@/lib/types';
import { useWallet } from '@/components/providers/WalletProvider';
import { fetchProducts } from '@/lib/api';

export default function IssuerPortalPage() {
  const { account, openModal } = useWallet();
  const [activeQrId, setActiveQrId] = useState<string | null>(null);
  const [batches, setBatches] = useState<ProductItem[]>(Object.values(SAMPLE_PRODUCTS));

  React.useEffect(() => {
    fetchProducts().then((items) => {
      if (items && items.length > 0) {
        setBatches(items);
      }
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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

        <div className="flex items-center gap-3">
          {account ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">AUTHORIZED ISSUER</span>
                <span className="font-mono text-slate-200 font-medium">
                  {truncateHash(account, 6, 4)}
                </span>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={openModal}>
                Change
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={openModal}>
              <Wallet className="w-4 h-4" />
              Connect Issuer Wallet
            </Button>
          )}
        </div>
      </div>

      <BatchRegisterForm
        walletAccount={account}
        onNeedWallet={openModal}
        onRegistered={(product) => setBatches((prev) => [product, ...prev])}
      />

      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Registered Batches on Registry Contract</h2>
            <p className="text-xs text-slate-400">
              Contract Address:{' '}
              <span className="font-mono text-cyan-400">0x71C676D2f4C68B25e1aF28cbe9426fFF566A6b19</span>
            </p>
          </div>
          <Badge tone="emerald">{batches.length} Batches Indexed</Badge>
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
                    <Badge tone="indigo">{batch.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeQrId && (
        <QrCodeModal
          isOpen={!!activeQrId}
          onClose={() => setActiveQrId(null)}
          productId={activeQrId}
          productName={batches.find((b) => b.id === activeQrId)?.name || activeQrId}
        />
      )}

    </div>
  );
}
