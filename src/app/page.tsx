"use client";

import Link from "next/link";

export default function HomePage() {
  const items = [
    {
      title: "Hidden Gems",
      href: "/hidden_gems",
      fill: "bg-[linear-gradient(135deg,rgba(166,227,233,0.26),rgba(94,198,232,0.26),rgba(63,193,201,0.26))]",
    },
    {
      title: "Our Classics",
      href: "/classics",
      fill: "bg-[linear-gradient(135deg,rgba(94,198,232,0.26),rgba(77,208,215,0.26),rgba(63,193,201,0.26))]",
    },
    {
      title: "Experiences",
      href: "/experiences",
      fill: "bg-[linear-gradient(135deg,rgba(166,227,233,0.26),rgba(94,198,232,0.26),rgba(77,208,215,0.26))]",
    },
    {
      title: "Transportation",
      href: "/transportation",
      fill: "bg-[linear-gradient(135deg,rgba(94,198,232,0.26),rgba(63,193,201,0.26),rgba(94,232,220,0.26))]",
    },
    {
      title: "Map",
      href: "/map",
      fill: "bg-[linear-gradient(135deg,rgba(63,193,201,0.26),rgba(94,198,232,0.26),rgba(166,227,233,0.26))]",
    },
    {
      title: "On duty Hospitals & Pharmacies",
      href: "/hospitals",
      fill: "bg-[linear-gradient(135deg,rgba(77,208,215,0.26),rgba(94,198,232,0.26),rgba(63,193,201,0.26))]",
    },
  ];

  return (
    <main className="mx-auto max-w-[1100px] px-4 pb-20 text-center">
      <h1 className="mt-6 text-3xl font-semibold">
        Welcome to LocalGem.online 🌍
      </h1>
      <p className="mt-2 mb-8 text-gray-600">
        Discover Athens with local picks, essentials, and practical info.
      </p>

      {/* 3 up / 3 below */}
      <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className={`flex h-[110px] w-full max-w-[340px] items-center justify-center rounded-2xl border-2 border-black/60 shadow-sm transition-transform duration-200 hover:-translate-y-1 ${it.fill}`}
          >
            <span className="select-none text-[1.1rem] font-semibold text-slate-900">
              {it.title}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
