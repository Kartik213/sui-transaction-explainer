"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";

export default function SearchBox() {
  const [digest, setDigest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!digest.trim()) {
      setError("Please enter a transaction digest.");
      return;
    }

    setLoading(true);
    router.push(`/tx/${digest.trim()}`);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex w-full items-center space-x-2">

          <input
            type="text"
            value={digest}
            onChange={(e) => setDigest(e.target.value)}
            placeholder="Enter transaction digest"
            className="flex-1 rounded-lg border border-zinc-300 bg-white p-3 text-sm 
                       text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 
                       dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 
                       text-sm font-medium text-white transition-colors hover:bg-blue-700 
                       focus:outline-none disabled:opacity-50"
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

      {error && (
        <div className="mt-4 flex items-center justify-center rounded-lg border border-red-300 
                        bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800 
                        dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="mr-2 h-4 w-4" /> {error}
        </div>
      )}
    </>
  );
}
