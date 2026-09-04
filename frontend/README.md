# 🖥️ ProofRoute Frontend Portal

Modern Web3-native document verification portal, issuer dashboard, and provenance explorer built with Next.js 15, Tailwind CSS, and Wagmi.

---

## 🏗️ Feature Modules

1. **Public Verifier**:
   - Drag-and-drop document uploader with in-browser SHA-256 hash computation (client-side privacy).
   - Visual certificate badge, on-chain proof explorer, and AI tampering heatmap.
2. **Issuer Dashboard**:
   - Web3 wallet connection (MetaMask, Coinbase Wallet, Rainbow, WalletConnect).
   - Batch document anchoring and cryptographic signature signing.
3. **Admin & Analytics**:
   - Network verification volume, risk distribution charts, and audit logs.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide Icons
- **Web3 / Blockchain UX**: Wagmi 2.x, Viem, RainbowKit
- **State Management**: TanStack Query (React Query) + Zustand

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```
