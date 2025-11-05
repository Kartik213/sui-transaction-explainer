"use client";

import { useState } from "react";
import { SuiClient } from "@mysten/sui.js/client";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";

const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io:443" });

interface TxSummary {
  sender: string;
  created: number;
  mutated: number;
  transferred: number;
  gasUsed: number;
}

export default function Home() {
  const [digest, setDigest] = useState("");
  const [txData, setTxData] = useState<TxSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!digest.trim()) {
      setError("Please enter a transaction digest.");
      setTxData(null);
      return;
    }

    setLoading(true);
    setError("");
    setTxData(null);

    try {
      const tx = await client.getTransactionBlock({
        digest: digest.trim(),
        options: { showEffects: true, showInput: true, showEvents: true },
      });

      setTxData(summarize(tx));
    } catch (err) {
      setError("Transaction not found or invalid digest.");
    } finally {
      setLoading(false);
    }
  }

  function summarize(tx: any): TxSummary {
    const sender = tx.transaction.data.sender;
    const gasUsed = tx.effects.gasUsed.computationCost;
    const created = tx.effects.created?.length || 0;
    const mutated = tx.effects.mutated?.length || 0;
    const transferred = tx.effects.transferObject?.length || 0;

    return {
      sender,
      created,
      mutated,
      transferred,
      gasUsed: Number(gasUsed) / 1e9,
    };
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4 font-sans dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 transition-all">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            🧩 Sui Transaction Explainer
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Paste a transaction digest and see what happened on-chain.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex w-full items-center space-x-2">
            <input
              type="text"
              value={digest}
              onChange={(e) => setDigest(e.target.value)}
              placeholder="Enter transaction digest (e.g. 3HE8N4H6bnvU...)"
              className="flex-1 rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Fetch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center justify-center rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="mr-2 h-4 w-4" /> {error}
          </div>
        )}

        {/* Summary */}
        {txData && !error && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 transition-all">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
              Transaction Summary
            </h2>
            <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  Sender:
                </span>{" "}
                <span className="text-blue-600 dark:text-blue-400 break-all">
                  {txData.sender}
                </span>
              </li>
              <li>🪙 {txData.created} new objects created</li>
              <li>🔁 {txData.mutated} objects mutated</li>
              <li>📦 {txData.transferred} objects transferred</li>
              <li>⛽ Gas used: {txData.gasUsed.toFixed(6)} SUI</li>
            </ul>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-600">
          Built with ❤️ using Next.js + @mysten/sui.js
        </footer>
      </main>
    </div>
  );
}
