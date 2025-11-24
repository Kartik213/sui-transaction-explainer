"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
        <div className="flex flex-col sm:flex-row w-full items-center space-x-2 space-y-2 sm:space-y-0">
          <Input
            type="text"
            value={digest}
            onChange={(e) => setDigest(e.target.value)}
            placeholder="Enter transaction digest"
            className="hover:"
          />
          <Button
            type="submit"
            disabled={loading}
            variant={"secondary"}
            size={"lg"}
            aria-label="Submit"
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
          </Button>

        </div>
      </form>

      {error && (
        <div className="mt-4 flex items-center justify-center rounded-lg border border-red-300 
                        bg-red-50 px-2 sm:px-3 py-2 text-xs sm:text-sm text-red-600 dark:border-red-800 
                        dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="mr-2 h-4 w-4" /> {error}
        </div>
      )}
    </>
  );
}
