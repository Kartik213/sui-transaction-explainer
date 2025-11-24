"use client";

import { useState, useEffect } from "react";
import { SuiClient } from "@mysten/sui.js/client";
import { Loader2, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";

const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io:443" });

interface TxSummary {
  sender: string;
  created: number;
  mutated: number;
  transferred: number;
  gasUsed: number;
  moveCalls: any[];
}

export default function TxPage() {
  const { digest } = useParams() || "";
  const [txData, setTxData] = useState<TxSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTx() {
      try {
        const tx = await client.getTransactionBlock({
          digest,
          options: { showEffects: true, showInput: true, showEvents: true },
        });

        setTxData(await summarize(tx));
      } catch (err) {
        console.error(err);
        setError("Transaction not found or invalid digest.");
      } finally {
        setLoading(false);
      }
    }

    fetchTx();
  }, [digest]);

  async function summarizeMoveCalls(txs: any[]) {
    const result = [];

    for (const t of txs) {
      if (!t.MoveCall) continue;

      const { package: pkg, module, function: func } = t.MoveCall;

      const moduleInfo = await client.getNormalizedMoveModule({
        package: pkg,
        module,
      });

      result.push({
        raw: `${pkg}::${module}::${func}`,
        package: pkg,
        module,
        function: func,
        visibility: moduleInfo?.exposedFunctions?.[func]?.visibility,
        isEntry: moduleInfo?.exposedFunctions?.[func]?.isEntry,
        params: moduleInfo?.exposedFunctions?.[func]?.parameters || [],
        returns: moduleInfo?.exposedFunctions?.[func]?.return || [],
      });
    }

    return result;
  }

  async function summarize(tx: any): Promise<TxSummary> {
    const sender = tx.transaction.data.sender;
    const gasUsed = tx.effects.gasUsed.computationCost;
    const created = tx.effects.created?.length || 0;
    const mutated = tx.effects.mutated?.length || 0;
    const transferred = tx.effects.transferObject?.length || 0;

    const txs = tx.transaction.data.transaction.transactions;
    const transactions = Array.isArray(txs) ? txs : [txs];

    const moveCalls = await summarizeMoveCalls(transactions);

    return {
      sender,
      created,
      mutated,
      transferred,
      gasUsed: Number(gasUsed) / 1e9,
      moveCalls,
    };
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-zinc-600 dark:text-zinc-300">
            Fetching transaction…
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-lg border border-red-400 bg-red-100 dark:bg-red-950/40 p-4 flex items-center text-red-700 dark:text-red-300">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      {/* Data */}
      {!loading && txData && (
        <div className="w-full max-w-2xl mt-6 p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 shadow">
          <h2 className="text-xl font-bold mb-4">Transaction Summary</h2>

          <p>
            <b>Sender:</b> {txData.sender}
          </p>
          <p>🪙 Created: {txData.created}</p>
          <p>🔁 Mutated: {txData.mutated}</p>
          <p>📦 Transferred: {txData.transferred}</p>
          <p>⛽ Gas Used: {txData.gasUsed.toFixed(6)} SUI</p>

          {txData.moveCalls.length > 0 && (
            <div className="mt-5">
              <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {" "}
                Move Calls{" "}
              </h3>
              {txData.moveCalls.map((call: any, i: number) => (
                <div
                  key={i}
                  className="rounded-md bg-zinc-100 dark:bg-zinc-800/80 px-3 py-3 mb-2"
                >
                  <div className="font-mono text-blue-600 dark:text-blue-400 break-all">
                    {call.package}
                  </div>
                  <div className="font-mono text-blue-600 dark:text-blue-400 break-all">
                    {call.module}
                  </div>
                  <div className="font-mono text-blue-600 dark:text-blue-400 break-all">
                    {call.function}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    <b>Visibility:</b> {call.visibility}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    <b>Entry Function:</b> {call.isEntry ? "Yes" : "No"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
