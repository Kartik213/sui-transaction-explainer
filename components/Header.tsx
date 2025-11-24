"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [digest, setDigest] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const path = usePathname();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!digest.trim()) return;

    setOpen(false);
    router.push(`/tx/${digest.trim()}`);
  }

  return (
    <div
      className={cn(
        "flex justify-between items-center gap-2 px-6 bg-secondary h-16"
      )}
    >
      {/* Logo */}
      <button onClick={() => router.push("/")}>
        <Image
          src={"/image.png"}
          height={50}
          width={50}
          alt="logo"
          className="dark:invert-100 h-10 w-10"
        />
      </button>

      <div className="flex items-center gap-3">
        {path !== "/" && (
          <form onSubmit={handleSubmit} className="hidden md:block">
            <Input
              type="text"
              value={digest}
              onChange={(e) => setDigest(e.target.value)}
              placeholder="Enter transaction digest"
              className="w-[320px]"
            />
          </form>
        )}

        {path !== "/" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="md:hidden p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800">
              <Search className="h-5 w-5" />
            </DialogTrigger>

            {/* Modal */}
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Search Transaction</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  value={digest}
                  onChange={(e) => setDigest(e.target.value)}
                  placeholder="Enter transaction digest"
                />
              </form>
            </DialogContent>
          </Dialog>
        )}

        <ThemeToggle />
      </div>
    </div>
  );
}
