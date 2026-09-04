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
      description="ProofRoute never marks a batch as registered until a confirmation receipt is received."
      closeDisabled={step === 'submitted' || step === 'confirming'}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-white/5">
          {step === 'confirmed' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : step === 'cancelled' || step === 'reverted' ? (
            <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
          ) : (
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin shrink-0" />
          )}
          <div>
            <p className="text-xs font-mono uppercase text-cyan-300">{step.replace('_', ' ')}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {step === 'idle' ? 'Ready to submit.' : STEP_COPY[step]}
            </p>
          </div>
        </div>

        {pipelineIndex >= 0 && <ProgressSteps steps={TX_PIPELINE} currentIndex={pipelineIndex} />}

        {productId && (
          <p className="text-xs font-mono text-slate-300">
            Product ID:{' '}
            <span className="text-emerald-300">{productId}</span>
          </p>
        )}
        {txHash && (
          <p className="text-[11px] font-mono text-cyan-400 break-all">Tx: {txHash}</p>
        )}

        <div className="flex gap-2">
          {step === 'wallet_confirmation' && (
            <Button type="button" variant="danger" className="flex-1" onClick={onCancel}>
              Cancel signature
            </Button>
          )}
          {(step === 'confirmed' || step === 'cancelled' || step === 'reverted') && (
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
