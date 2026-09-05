import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import AppProviders from '@/components/providers/AppProviders';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ProofRoute — Decentralized Provenance & AI Document Integrity',
  description:
    'Verify where a product came from, what happened during shipment, and whether its documents were altered with on-chain cryptographic proofs and explainable AI forensics.',
  keywords: ['provenance', 'blockchain', 'document integrity', 'risk analysis', 'supply chain', 'Web3'],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable} dark`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#f8f9fa] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-100 min-h-screen flex flex-col relative selection:bg-zinc-900 selection:text-white dark:selection:bg-white/10 dark:selection:text-white transition-colors duration-150">
        <div className="fixed inset-0 bg-grid-pattern opacity-70 dark:opacity-75 pointer-events-none z-0" />
        <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none z-0" />

        <AppProviders>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
