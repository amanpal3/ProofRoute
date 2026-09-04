'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface WalletContextValue {
  account: string | null;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  connect: (account: string) => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const connect = useCallback((nextAccount: string) => {
    setAccount(nextAccount);
    setIsModalOpen(false);
  }, []);
  const disconnect = useCallback(() => setAccount(null), []);

  const value = useMemo(
    () => ({
      account,
      isModalOpen,
      openModal,
      closeModal,
      connect,
      disconnect,
    }),
    [account, isModalOpen, openModal, closeModal, connect, disconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return ctx;
}
