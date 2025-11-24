// 5oTyxfKgq7qo6huBZe26c1C2oK16yYz1qQYkuC8W96o4
// import SearchBox from "@/components/SearchBox";
// import Image from "next/image";

// export default function Home() {
//   return (
//     // bg-linear-to-br from-zinc-50 via-white to-zinc-100 px-4 font-sans dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800
//     <div className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-center px-4">
//       <main className="w-fit rounded-2xl border bg-sidebar p-8 shadow-lg transition-all">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold flex items-center gap-2">
//             <span>
//               <Image src="/logo.svg" height={50} width={50} alt="sui-logo" />{" "}
//             </span>
//             <span>Sui Transaction Explainer</span>
//           </h1>
//           <p className="mt-2">
//             Paste a transaction digest and see what happened on-chain.
//           </p>
//         </div>
//         <SearchBox />
//       </main>
//     </div>
//   );
// }

import SearchBox from "@/components/SearchBox";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-center px-4">
      <main className="
        w-full max-w-lg 
        sm:max-w-xl 
        md:max-w-2xl 
        rounded-2xl border bg-sidebar p-3 sm:p-8 shadow-lg transition-all
      ">
        <div className="mb-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>
              <Image 
                src="/logo.svg" 
                height={50} 
                width={50} 
                alt="sui-logo" 
                className="h-10 w-10 sm:h-14 sm:w-14"
              />
            </span>
            <span>Sui Transaction Explainer</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base">
            Paste a transaction digest and see what happened on-chain.
          </p>
        </div>

        <SearchBox />
      </main>
    </div>
  );
}
