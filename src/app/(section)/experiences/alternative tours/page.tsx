"use client";

import Reveal from "@/components/Reveal";

export default function AlternativeToursPage() {
  return (
    <main className="container mx-auto px-6 py-10">
      <Reveal>
        <h1 className="text-3xl font-serif font-semibold text-primary mb-2">
          Alternative Tours
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="text-gray-700 mb-10 max-w-prose">
          Coming soon — our curated collection of offbeat tours and local
          guides. You’ll be able to book unique experiences that go beyond the
          usual tourist routes.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="rounded-xl border border-gray-200 bg-gray-50 text-gray-500 p-8 text-center shadow-sm">
          🚧 We’re finalizing our partner contracts.
          <br />
          Stay tuned for updates — your next local adventure is just around the
          corner.
        </div>
      </Reveal>
    </main>
  );
}
