'use client';

import React from 'react';
import { WalletProvider } from '@/components/providers/WalletProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
