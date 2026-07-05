"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GeocodeCandidate {
  displayName: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [place, setPlace] = useState("");

  const [candidates, setCandidates] = useState<GeocodeCandidate[]>([]);
  const [selected, setSelected] = useState<GeocodeCandidate | null>(null);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleFindPlace() {
    if (!place.trim()) return;
    setGeocodeLoading(true);
    setGeocodeError(null);
    setSelected(null);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(place)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lookup failed");
      setCandidates(data.candidates ?? []);
      if ((data.candidates ?? []).length === 0) {
        setGeocodeError("No matching locations found. Try a more specific place name.");
      }
    } catch (err) {
      setGeocodeError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setGeocodeLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !date || !time) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const [year, month, day] = date.split("-").map(Number);
      const [hour, minute] = time.split(":").map(Number);

      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          minute,
          gender,
          place: selected.displayName,
          latitude: selected.latitude,
          longitude: selected.longitude,
          fullName: fullName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate reading");

      sessionStorage.setItem("discovery:lastReading", JSON.stringify(data));
      router.push("/reading");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to generate reading");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-lg">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Discovery</h1>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Enter your birth details to receive a reading blending Western astrology, BaZi, Zi Wei
          Dou Shu, Qi Men Dun Jia, and numerology.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full birth name (optional, used for numerology)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Birth date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Birth time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female")}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Birth place
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="e.g. New York, NY"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <button
                type="button"
                onClick={handleFindPlace}
                disabled={geocodeLoading || !place.trim()}
                className="shrink-0 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-200 dark:text-zinc-900"
              >
                {geocodeLoading ? "Searching…" : "Find"}
              </button>
            </div>
            {geocodeError && <p className="mt-2 text-sm text-red-600">{geocodeError}</p>}
            {candidates.length > 0 && (
              <ul className="mt-2 divide-y divide-zinc-200 rounded-md border border-zinc-300 dark:divide-zinc-700 dark:border-zinc-700">
                {candidates.map((c) => (
                  <li key={`${c.latitude},${c.longitude}`}>
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                        selected?.displayName === c.displayName
                          ? "bg-zinc-100 dark:bg-zinc-800"
                          : ""
                      }`}
                    >
                      {c.displayName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selected && (
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                Selected: {selected.displayName}
              </p>
            )}
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting || !selected || !date || !time}
            className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Generating your reading…" : "Get my reading"}
          </button>
        </form>
      </div>
    </div>
  );
}
