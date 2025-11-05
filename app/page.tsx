"use client";

import { useEffect, useState } from "react";
import { SuiClient } from "@mysten/sui.js/client";
import { Loader2, AlertCircle } from "lucide-react";

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

  // Debounce input (to avoid excessive RPC calls)
  useEffect(() => {
    if (!digest) return;
    const timeout = setTimeout(() => fetchTransaction(digest), 800);
    return () => clearTimeout(timeout);
  }, [digest]);

  async function fetchTransaction(digest: string) {
    try {
      setLoading(true);
      setError("");
      const tx = await client.getTransactionBlock({
        digest,
        options: { showEffects: true, showInput: true, showEvents: true },
      });

      const summary = summarize(tx);
      setTxData(summary);
    } catch (err: any) {
      setError("Invalid digest or transaction not found.");
      setTxData(null);
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center space-y-6 p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          🧩 Sui Transaction Explainer
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-center">
          Paste a transaction digest to see what happened on-chain.
        </p>

        {/* Input box */}
        <input
          type="text"
          value={digest}
          onChange={(e) => setDigest(e.target.value.trim())}
          placeholder="Enter Sui transaction digest (e.g. 3HE8N4H6bnvU...)"
          className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-black shadow-sm placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />

        {/* Status / Summary */}
        <div className="w-full min-h-[120px] rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {loading ? (
            <div className="flex items-center justify-center text-zinc-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Fetching transaction details...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center text-red-500">
              <AlertCircle className="mr-2 h-5 w-5" /> {error}
            </div>
          ) : txData ? (
            <div className="space-y-2">
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                Sender:{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {txData.sender}
                </span>
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                🪙 {txData.created} new objects created
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                🔁 {txData.mutated} objects mutated
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                📦 {txData.transferred} objects transferred
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                ⛽ Gas used: {txData.gasUsed.toFixed(6)} SUI
              </p>
            </div>
          ) : (
            <div className="text-zinc-500 dark:text-zinc-400 text-center">
              Enter a valid digest to view the transaction summary.
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-xs text-zinc-500 dark:text-zinc-600">
          Powered by @mysten/sui.js
        </footer>
      </main>
    </div>
  );
}
