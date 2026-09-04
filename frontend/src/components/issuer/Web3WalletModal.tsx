'use client';

import React, { useState } from 'react';
import { X, Wallet, Shield, ArrowUpRight, Copy, Check } from 'lucide-react';
import { truncateHash } from '@/lib/crypto';

interface Web3WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedAccount: string | null;
  onConnect: (account: string) => void;
  onDisconnect: () => void;
}

const WALLET_OPTIONS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    badge: 'Popular',
    desc: 'Connect to your MetaMask wallet extension',
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '🌈',
    desc: 'Connect using Rainbow Web3 Wallet',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔵',
    desc: 'Connect using Coinbase Wallet App or SDK',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    desc: 'Scan QR with any mobile Web3 wallet',
  },
];

export default function Web3WalletModal({
  isOpen,
  onClose,
  connectedAccount,
  onConnect,
  onDisconnect,
}: Web3WalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('11155111'); // Sepolia

  if (!isOpen) return null;

  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      // Deterministic demo issuer account
      const mockIssuer = '0x1234567890123456789012345678901234567890';
      onConnect(mockIssuer);
      setIsConnecting(false);
    }, 600);
  };

  const copyAddress = () => {
    if (!connectedAccount) return;
    navigator.clipboard.writeText(connectedAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-indigo-950/40 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {connectedAccount ? 'Connected Wallet' : 'Connect Web3 Wallet'}
              </h3>
              <p className="text-xs text-slate-400">
                {connectedAccount ? 'EVM Authorized Issuer' : 'Select your EVM provider'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {connectedAccount ? (
          /* Connected State */
          <div className="py-6 space-y-5">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Active Account</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Authorized Issuer
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-slate-200 font-medium">
                  {truncateHash(connectedAccount, 10, 8)}
                </span>
                <button
                  onClick={copyAddress}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Copy address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>Balance</span>
                <span className="font-mono text-slate-200">2.4820 ETH</span>
              </div>
            </div>

            {/* Network Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Target EVM Network</label>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="11155111">Ethereum Sepolia (Chain ID: 11155111)</option>
                <option value="31337">Local Foundry / Anvil (Chain ID: 31337)</option>
                <option value="80002">Polygon Amoy Testnet (Chain ID: 80002)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  onDisconnect();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-sm font-medium transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          /* Connect Wallet Options */
          <div className="py-5 space-y-2.5">
            {WALLET_OPTIONS.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnectWallet()}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/40 text-left transition-all duration-150 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{wallet.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                        {wallet.name}
                      </span>
                      {wallet.badge && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          {wallet.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{wallet.desc}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}

            <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-indigo-300">
              <Shield className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" />
              <span>
                ProofRoute only requests signatures to anchor SHA-256 document proofs. No gas is spent for verifications.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
