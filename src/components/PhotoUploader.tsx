// src/components/PhotoUploader.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useMemo, useState } from "react";

type Result = { name: string; url: string; path: string }[];

const DEFAULT_BUCKETS = [
  "Our_classics",
  "Hidden_gems",
  "Experiences",
  "Hospitals",
  "Transportation",
  "Tips",
  "Avatars",
] as const;

export default function PhotoUploader({
  buckets = DEFAULT_BUCKETS,
  defaultBucket = "Hidden_gems", // ✅ exact casing matters
  prefix = "",
}: {
  buckets?: readonly string[];
  defaultBucket?: (typeof DEFAULT_BUCKETS)[number] | string;
  /** optional folder inside the bucket (e.g. "anafiotika"). Leave empty for root */
  prefix?: string;
}) {
  const [bucket, setBucket] = useState<string>(defaultBucket);
  const [folder, setFolder] = useState<string>(prefix);
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [results, setResults] = useState<Result>([]);
  const [progress, setProgress] = useState<number>(0);

  const targetPrefix = useMemo(() => {
    const cleaned = (folder || "").trim().replace(/^\/+|\/+$/g, "");
    return cleaned ? cleaned + "/" : "";
  }, [folder]);

  async function upload() {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    setResults([]);
    setProgress(0);

    const out: Result = [];
    const all = Array.from(files);

    for (let i = 0; i < all.length; i++) {
      const file = all[i];
      const safeName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${file.name.toLowerCase().replace(/\s+/g, "-")}`;
      const path = `${targetPrefix}${safeName}`;

      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: "31536000", // 1 year
          upsert: false,
        });

      if (upErr) {
        setErr(upErr.message);
        setBusy(false);
        return;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      out.push({ name: file.name, url: data.publicUrl, path });

      setProgress(Math.round(((i + 1) / all.length) * 100));
    }

    setResults(out);
    setBusy(false);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      /* noop */
    }
  }

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <div>
        <div className="text-sm font-semibold">Upload photos to Supabase</div>
        <p className="text-xs text-gray-500">
          Choose a bucket and (optionally) a folder. Filenames are
          auto-sanitized.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Bucket</span>
          <select
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            {buckets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Folder (optional)</span>
          <input
            placeholder="e.g. anafiotika"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Choose images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full text-sm"
          />
        </label>

        <div className="flex items-end">
          <button
            onClick={upload}
            disabled={!files || busy}
            className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>

      {busy && (
        <div className="w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          />
        </div>
      )}

      {err && <p className="text-sm text-red-600">Error: {err}</p>}

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Public URLs</div>
          <ul className="space-y-2">
            {results.map((r) => (
              <li key={r.url} className="rounded-lg border p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.name}</div>
                    <code className="block break-all text-xs">{r.url}</code>
                  </div>
                  <div className="shrink-0">
                    <button
                      className="rounded-md border px-2 py-1 text-xs"
                      onClick={() => copy(r.url)}
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <img
                    src={r.url}
                    alt={r.name}
                    loading="lazy"
                    decoding="async"
                    className="h-36 w-full rounded-md object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className="text-xs text-gray-500">
            Tip: For faster loads, use Supabase’s resize endpoint: replace{" "}
            <code className="text-[11px]">/object/public/</code> with{" "}
            <code className="text-[11px]">/render/image/public/</code> and add{" "}
            <code className="text-[11px]">?width=800&amp;quality=80</code>.
          </p>
        </div>
      )}
    </div>
  );
}
