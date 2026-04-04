# 💧 Sui Transaction Explainer

A small, user-friendly web app that takes a Sui transaction digest (hash) and explains in plain language what actually happened.

## 🚀 Features

- **Plain Language Summary**: Understand the essence of a transaction without digging through raw JSON.
- **Move Call Analysis**: Detailed breakdown of Move functions called, including package, module, and visibility.
- **Object Tracking**: See exactly which objects were created, mutated, or transferred.
- **Gas Breakdown**: Clear view of computation costs in SUI.
- **Deep Dive**: Access raw transaction events and the full RPC JSON response for advanced debugging.
- **Modern UI**: Clean, responsive design with full light/dark mode support.

## Built with

- **Next.js 15 & TS** for the foundation.
- **Sui SDK** for fetching on-chain data.
- **Tailwind & shadcn/ui** for the look and feel.
- **Lucide** for the icons.

## Quick Start

```bash
# install
npm install

# run
npm run dev
```

The app lives at `http://localhost:3000`.

## 📖 How It Works

1. **Grab the data**: Uses the Sui SDK to fetch transaction details and effects.
2. **Normalize**: Hits the RPC to get Move module metadata so we can show more than just addresses.
3. **Summarize**: Combines all that raw data into a human-readable format.

*Got a digest? Try it out on Mainnet.*

---
MIT License. Built for the Sui community.
