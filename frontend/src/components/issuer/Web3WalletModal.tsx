'use client';

import React, { useState } from 'react';
import { X, Wallet, Shield, ArrowUpRight, Copy, Check } from 'lucide-react';
import { truncateHash } from '@/lib/crypto';
import { requestWalletConnection } from '@/lib/web3';

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
    desc: 'Connect using MetaMask browser extension',
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
    desc: 'Scan QR with mobile Web3 wallet',
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
  const [selectedNetwork, setSelectedNetwork] = useState('31337'); // Local Anvil / Sepolia

  if (!isOpen) return null;

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const account = await requestWalletConnection();
      onConnect(account);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    } finally {
      setIsConnecting(false);
      onClose();
    }
  };

  const copyAddress = () => {
    if (!connectedAccount) return;
    navigator.clipboard.writeText(connectedAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#0d0f14] border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-2xl text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                {connectedAccount ? 'Connected Wallet' : 'Connect Web3 Wallet'}
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                {connectedAccount ? 'EVM Authorized Issuer' : 'Select your EVM provider'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {connectedAccount ? (
          /* Connected State */
          <div className="py-5 space-y-4">
            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Active Account</span>
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Authorized Issuer
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-200 font-medium">
                  {truncateHash(connectedAccount, 10, 8)}
                </span>
                <button
                  onClick={copyAddress}
                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Balance</span>
                <span className="text-zinc-300">2.4820 ETH</span>
              </div>
            </div>

            {/* Network Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400 font-mono">Target EVM Network</label>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-600"
              >
                <option value="31337">Local Foundry / Anvil (Chain ID: 31337)</option>
                <option value="11155111">Ethereum Sepolia (Chain ID: 11155111)</option>
                <option value="80002">Polygon Amoy Testnet (Chain ID: 80002)</option>
              </select>
            </div>

            <div className="pt-1">
              <button
                onClick={() => {
                  onDisconnect();
                  onClose();
                }}
                className="w-full py-2 rounded-lg border border-rose-900/50 text-rose-400 hover:bg-rose-950/30 text-xs font-medium transition-colors active:scale-[0.98]"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          /* Connect Wallet Options */
          <div className="py-4 space-y-2">
            {WALLET_OPTIONS.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnectWallet()}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{wallet.icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-zinc-200 group-hover:text-white">
                        {wallet.name}
                      </span>
                      {wallet.badge && (
                        <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
                          {wallet.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500">{wallet.desc}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </button>
            ))}

            <div className="mt-3 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2 text-[11px] text-zinc-500 font-mono">
              <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
              <span>
                ProofRoute only requests signatures to anchor SHA-256 document proofs. Zero gas for public scans.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
