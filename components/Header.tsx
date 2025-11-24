"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [digest, setDigest] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!digest.trim()) {
      return;
    }
    router.push(`/tx/${digest.trim()}`);
  }

  return (
    <div className="flex flex-row-reverse">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={digest}
          onChange={(e) => setDigest(e.target.value)}
          placeholder="Enter transaction digest"
          className="flex-1 max-w-xl min-w-lg rounded-lg border border-zinc-300 bg-white p-3 text-sm 
                       text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 
                       dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
        />
      </form>
    </div>
  );
}
