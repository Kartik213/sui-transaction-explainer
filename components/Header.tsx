"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

export default function Header() {
  const [digest, setDigest] = useState("");
  const router = useRouter();
  const path = usePathname();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!digest.trim()) {
      return;
    }
    router.push(`/tx/${digest.trim()}`);
  }

  return (
    <div className={cn("flex flex-row-reverse items-center gap-2 px-4 bg-secondary h-16"
    )}>
      <ThemeToggle />
      {path != "/" && (
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={digest}
            onChange={(e) => setDigest(e.target.value)}
            placeholder="Enter transaction digest"
            className="flex-1 max-w-xl min-w-lg "
          />
        </form>
      )}
    </div>
  );
}
