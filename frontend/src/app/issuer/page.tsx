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
import { getContractAddress } from '@/lib/web3';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-300 mb-2 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-400" />
            <span className="font-semibold">Authorized Manufacturer & Issuer Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Issuer Batch Registration
          </h1>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400">
            Commit immutable SHA-256 document proofs and initialize provenance lifecycles on-chain.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {account ? (
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700/80 text-xs shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              <div>
                <span className="text-[10px] text-zinc-700 dark:text-zinc-400 block font-mono font-semibold">AUTHORIZED ISSUER</span>
                <span className="font-mono text-zinc-950 dark:text-zinc-200 font-bold text-xs">
                  {truncateHash(account, 6, 4)}
                </span>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={openModal}>
                Change
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={openModal}>
              <Wallet className="w-3.5 h-3.5" />
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

      <div className="specular-card p-5 sm:p-7 rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-bold text-zinc-950 dark:text-white">Registered Batches on Registry Contract</h2>
            <p className="text-[11px] text-zinc-700 dark:text-zinc-400 font-mono">
              Contract Address:{' '}
              <span className="text-zinc-900 dark:text-zinc-300 font-semibold">{getContractAddress()}</span>
            </p>
          </div>
          <Badge tone="emerald">{batches.length} Batches Indexed</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-zinc-800 dark:text-zinc-400 font-bold border-b border-zinc-300 dark:border-zinc-800/80">
                <th className="py-2.5 px-3">Product ID</th>
                <th className="py-2.5 px-3">Batch Number</th>
                <th className="py-2.5 px-3">SHA-256 Commitment</th>
                <th className="py-2.5 px-3">Milestone</th>
                <th className="py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/60">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-zinc-950 dark:text-white">{batch.id}</td>
                  <td className="py-3 px-3 text-zinc-800 dark:text-zinc-300 font-medium">{batch.batchNumber}</td>
                  <td className="py-3 px-3 text-zinc-900 dark:text-zinc-400 font-mono font-semibold">
                    {truncateHash(batch.documentHash, 8, 6)}
                  </td>
                  <td className="py-3 px-3">
                    <Badge tone="indigo">{batch.status}</Badge>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveQrId(batch.id)}
                        className="p-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors active:scale-[0.98]"
                        title="View QR"
                      >
                        <QrCode className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      </button>
                      <a
                        href={`/verify/${batch.id}`}
                        className="p-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors active:scale-[0.98]"
                        title="Public Verifier Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
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
