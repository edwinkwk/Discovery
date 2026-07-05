"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SynthesizedReading } from "@/types/reading";

export default function ReadingPage() {
  const [reading, setReading] = useState<SynthesizedReading | null | undefined>(undefined);

  useEffect(() => {
    const stored = sessionStorage.getItem("discovery:lastReading");
    // Reading sessionStorage is a sync with an external (browser) system unavailable
    // during SSR, which is exactly what this effect exists for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReading(stored ? (JSON.parse(stored) as SynthesizedReading) : null);
  }, []);

  if (reading === undefined) {
    return null;
  }

  if (reading === null) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
        <div className="text-center">
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">No reading found.</p>
          <Link href="/" className="text-indigo-600 underline">
            Go back and enter your birth details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-2xl">
        <Link href="/" className="mb-6 inline-block text-sm text-indigo-600 underline">
          &larr; New reading
        </Link>
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Your Reading
        </h1>

        {reading.warnings.length > 0 && (
          <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
            {reading.warnings.map((w, i) => (
              <p key={i}>{w}</p>
            ))}
          </div>
        )}

        <div className="mb-10 whitespace-pre-wrap text-base leading-7 text-zinc-800 dark:text-zinc-200">
          {reading.narrative}
        </div>

        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Per-system breakdown
        </h2>
        <div className="space-y-4">
          {reading.systemResults.map((result) => (
            <details
              key={result.system}
              className="rounded-md border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <summary className="cursor-pointer text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {result.traits?.label ?? result.system} {result.ok ? "" : "(unavailable)"}
              </summary>
              {result.ok && result.traits ? (
                <div className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <p className="font-medium">{result.traits.headline.join(" · ")}</p>
                  <ul className="list-inside list-disc space-y-1">
                    {result.traits.traits.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-3 text-sm text-red-600">{result.error}</p>
              )}
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
