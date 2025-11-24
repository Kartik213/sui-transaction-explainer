// 5oTyxfKgq7qo6huBZe26c1C2oK16yYz1qQYkuC8W96o4
import SearchBox from "@/components/SearchBox";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col items-center justify-center bg-linear-to-br from-zinc-50 via-white to-zinc-100 px-4 font-sans dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 transition-all">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            🧩 Sui Transaction Explainer
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Paste a transaction digest and see what happened on-chain.
          </p>
        </div>

        <SearchBox />
      </main>
    </div>
  );
}
