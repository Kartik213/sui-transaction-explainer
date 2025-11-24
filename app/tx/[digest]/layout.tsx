import Header from "@/components/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[calc(100vh-48px)] bg-zinc-50 dark:bg-zinc-900 p-4">
      <Header />
      {children}
    </div>
  );
}
