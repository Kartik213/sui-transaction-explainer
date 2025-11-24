"use client";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center justify-center">
      {theme == "light" ? (
        <button onClick={() => setTheme("dark")}>
          <MoonIcon />
        </button>
      ) : (
        <button onClick={() => setTheme("light")}>
          <SunIcon />
        </button>
      )}
    </div>
  );
}
