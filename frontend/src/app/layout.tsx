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
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable} dark`}>
      <body className="font-sans antialiased bg-proof-dark text-slate-100 min-h-screen flex flex-col relative selection:bg-indigo-500/30 selection:text-indigo-200">
        <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />
        <div className="ambient-glow top-0 left-1/4 w-[500px] h-[350px] bg-indigo-600/15" />
        <div className="ambient-glow top-1/3 right-10 w-[450px] h-[350px] bg-cyan-600/10" />
        <div className="ambient-glow bottom-10 left-10 w-[550px] h-[350px] bg-emerald-600/10" />

        <AppProviders>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
