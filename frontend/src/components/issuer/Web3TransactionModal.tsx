'use client';

import React from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ProgressSteps from '@/components/ui/ProgressSteps';
import Button from '@/components/ui/Button';
import { TX_PIPELINE, TxStep } from '@/lib/tx';

interface Web3TransactionModalProps {
  isOpen: boolean;
  step: TxStep;
  productId?: string;
  txHash?: string;
  onCancel: () => void;
  onClose: () => void;
}

const STEP_COPY: Record<Exclude<TxStep, 'idle'>, string> = {
  wallet_confirmation: 'Awaiting issuer signature in the connected wallet.',
  submitted: 'Transaction submitted to the EVM node. Waiting for inclusion.',
  confirming: 'Waiting for block confirmation receipt. Do not close this window.',
  confirmed: 'On-chain confirmation received. Batch hash is now immutable.',
  cancelled: 'Wallet signature was cancelled. No gas was spent.',
  reverted: 'Transaction reverted on-chain. The batch was not registered.',
};

export default function Web3TransactionModal({
  isOpen,
  step,
  productId,
  txHash,
  onCancel,
  onClose,
}: Web3TransactionModalProps) {
  const pipelineIndex = TX_PIPELINE.indexOf(step as (typeof TX_PIPELINE)[number]);
  const inFlight = step === 'wallet_confirmation' || step === 'submitted' || step === 'confirming';

  return (
    <Modal
      isOpen={isOpen}
      onClose={inFlight ? onCancel : onClose}
      title="On-Chain Anchoring"
      description="ProofRoute verifies execution receipt before committing batch state."
      closeDisabled={step === 'submitted' || step === 'confirming'}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
          {step === 'confirmed' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : step === 'cancelled' || step === 'reverted' ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Loader2 className="w-5 h-5 text-zinc-400 animate-spin shrink-0" />
          )}
          <div>
            <p className="text-[11px] font-mono uppercase text-zinc-300 font-medium">{step.replace('_', ' ')}</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {step === 'idle' ? 'Ready to submit.' : STEP_COPY[step]}
            </p>
          </div>
        </div>

        {pipelineIndex >= 0 && <ProgressSteps steps={TX_PIPELINE} currentIndex={pipelineIndex} />}

        {productId && (
          <p className="text-xs font-mono text-zinc-400">
            Product ID:{' '}
            <span className="text-zinc-200">{productId}</span>
          </p>
        )}
        {txHash && (
          <p className="text-[11px] font-mono text-zinc-400 break-all">Tx: {txHash}</p>
        )}

        <div className="flex gap-2 pt-1">
          {step === 'wallet_confirmation' && (
            <Button type="button" variant="danger" size="sm" className="flex-1" onClick={onCancel}>
              Cancel signature
            </Button>
          )}
          {(step === 'confirmed' || step === 'cancelled' || step === 'reverted') && (
            <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
