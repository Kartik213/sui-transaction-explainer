// 5oTyxfKgq7qo6huBZe26c1C2oK16yYz1qQYkuC8W96o4
import SearchBox from "@/components/SearchBox";

export default function Home() {
  return (
    // bg-linear-to-br from-zinc-50 via-white to-zinc-100 px-4 font-sans dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800
    <div className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-center">
      <main className="w-full max-w-xl rounded-2xl border bg-sidebar p-8 shadow-lg transition-all">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">🧩 Sui Transaction Explainer</h1>
          <p className="mt-2">
            Paste a transaction digest and see what happened on-chain.
          </p>
        </div>
        <SearchBox />
      </main>
    </div>
  );
}
