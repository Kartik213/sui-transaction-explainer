"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SuiClient } from "@mysten/sui.js/client";
import { Loader2, AlertCircle, Copy } from "lucide-react";

// ShadCN Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSonner, toast } from "sonner";
import { Button } from "@/components/ui/button";

const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io:443" });

export default function TxPage() {
  const { digest } = useParams();
  const [tx, setTx] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTx() {
      try {
        const result = await client.getTransactionBlock({
          digest,
          options: {
            showEffects: true,
            showInput: true,
            showEvents: true,
          },
        });

        setTx(result);
        setSummary(await summarize(result));
      } catch (err) {
        console.log(err);
        setError("Invalid digest or transaction not found.");
      } finally {
        setLoading(false);
      }
    }

    fetchTx();
  }, [digest]);

  async function summarizeMoveCalls(txs: any[]) {
    const arr: any[] = [];
    for (const t of txs) {
      if (!t.MoveCall) continue;

      const { package: pkg, module, function: func } = t.MoveCall;

      let info;
      try {
        info = await client.getNormalizedMoveModule({ package: pkg, module });
      } catch {
        info = null;
      }

      arr.push({
        raw: `${pkg}::${module}::${func}`,
        pkg,
        module,
        func,
        visibility: info?.exposedFunctions?.[func]?.visibility,
        isEntry: info?.exposedFunctions?.[func]?.isEntry,
        params: info?.exposedFunctions?.[func]?.parameters || [],
        returns: info?.exposedFunctions?.[func]?.return || [],
      });
    }
    return arr;
  }

  async function summarize(tx: any) {
    const sender = tx.transaction.data.sender;
    const gas = tx.effects.gasUsed.computationCost;
    const created = tx.effects.created?.length || 0;
    const mutated = tx.effects.mutated?.length || 0;
    const transferred = tx.effects.transferObject?.length || 0;

    const movesRaw = tx.transaction.data.transaction.transactions;
    const moves = Array.isArray(movesRaw) ? movesRaw : [movesRaw];

    const moveCalls = await summarizeMoveCalls(moves);

    return {
      sender,
      created,
      mutated,
      transferred,
      gas: Number(gas) / 1e9,
      moveCalls,
      events: tx.events || [],
      effects: tx.effects,
      raw: tx,
    };
  }

  const copyRawJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(summary.raw, null, 2));
    toast("Copied!", {
      description: "Raw JSON copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-112px)]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-112px)] text-red-500">
        <AlertCircle className="mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-112px)] p-10 max-w-screen">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">
        Transaction Details
      </h1>
      <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Digest: {digest}
      </p>

      <Separator className="mb-6" />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 w-full bg-transparent">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="move-calls">Move Calls</TabsTrigger>
          <TabsTrigger value="changes">Changes</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="raw">Raw JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <b>Sender:</b> {summary.sender}
              </p>
              <p>🪙 Created: {summary.created}</p>
              <p>🔁 Mutated: {summary.mutated}</p>
              <p>📦 Transferred: {summary.transferred}</p>
              <p>⛽ Gas Used: {summary.gas.toFixed(6)} SUI</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="move-calls">
          <Card>
            <CardHeader>
              <CardTitle>Move Calls</CardTitle>
            </CardHeader>
            <CardContent>
              {summary.moveCalls.length === 0 && (
                <p className="text-sm text-zinc-500">No Move calls found.</p>
              )}

              <Accordion type="single" collapsible>
                {summary.moveCalls.map((call: any, i: number) => (
                  <AccordionItem key={i} value={`call-${i}`}>
                    <AccordionTrigger>
                      <span className="font-mono text-blue-500">
                        {call.module}::{call.func}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1">
                        <p>
                          <b>Package:</b> {call.pkg}
                        </p>
                        <p>
                          <b>Module:</b> {call.module}
                        </p>
                        <p>
                          <b>Function:</b> {call.func}
                        </p>
                        <p>
                          <b>Visibility:</b> {call.visibility}
                        </p>
                        <p>
                          <b>Entry:</b> {call.isEntry ? "Yes" : "No"}
                        </p>
                        <p>
                          <b>Parameters:</b> {JSON.stringify(call.params)}
                        </p>
                        <p>
                          <b>Returns:</b> {JSON.stringify(call.returns)}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changes">
          <Card>
            <CardHeader>
              <CardTitle>Object Changes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <b>Created:</b> {summary.created}
              </p>
              <p>
                <b>Mutated:</b> {summary.mutated}
              </p>
              <p>
                <b>Transferred:</b> {summary.transferred}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              {summary.events.length === 0 && (
                <p className="text-sm text-zinc-500">No events emitted.</p>
              )}
              {summary.events.map((ev: any, i: number) => (
                <pre
                  key={i}
                  className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded mb-2 text-xs overflow-auto"
                >
                  {JSON.stringify(ev, null, 2)}
                </pre>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Raw Transaction</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyRawJSON}
                  className="w-fit"
                >
                  <Copy />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 p-4 rounded overflow-auto">
                {JSON.stringify(summary.raw, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
