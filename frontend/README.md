# ProofRoute Frontend

Production-ready Next.js 14 demo portal for decentralized product provenance, cryptographic document integrity, and AI risk analysis.

## Feature Modules

| Route | Description |
|---|---|
| `/` | Landing page with hero, live stats, and interactive verification sandbox |
| `/verify` | Wallet-free public document verifier (drag & drop + SHA-256) |
| `/verify/[productId]` | QR verification and milestone provenance explorer |
| `/issuer` | Manufacturer batch registration and on-chain anchoring simulator |
| `/logistics` | Logistics operator milestone updater |
| `/forensics` | AI tampering inspector with ELA heatmap and CMFD/OCR breakdown |

## Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Crypto**: Native WebCrypto API (`crypto.subtle.digest`)
- **QR**: `qrcode` library for downloadable verification codes
- **Data**: Built-in mock registry with optional FastAPI backend fallback

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Connect to Live Backend

Set the API URL to enable live backend mode (falls back to mock data when offline):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 npm run dev
```

## Verification

```bash
npm run build    # Production build + TypeScript check
npm run lint     # ESLint
```

## Demo Presets

- **PR-8829-X** — Authentic pharmaceutical certificate (VALID)
- **PR-4410-T** — Tampered aerospace MTR (TAMPERED / HIGH risk)

Use the preset buttons on any document dropzone, or visit `/verify/PR-8829-X` directly.
