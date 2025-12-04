"use client";

import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TransportationPage() {
  const items = [
    { name: "Metro", icon: "🚇", desc: "Fast and reliable underground lines." },
    { name: "Bus", icon: "🚌", desc: "Connects most neighborhoods easily." },
    {
      name: "Taxi",
      icon: "🚕",
      desc: "Affordable and everywhere — just use Beat.",
    },
    { name: "Tram", icon: "🚋", desc: "Scenic route along the coast." },
  ];

  return (
    <main className="min-h-[80vh] bg-emerald-50/40 px-6 md:px-12 py-16 rounded-3xl">
      <PageHeader
        title="Transportation"
        subtitle="Getting around the city made simple"
      />

      {/* === Transport Grid === */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap justify-center gap-6 mt-10"
      >
        {items.map((t) => (
          <div
            key={t.name}
            className="w-44 h-44 bg-white flex flex-col items-center justify-center rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center p-4"
          >
            <div className="text-4xl mb-2">{t.icon}</div>
            <h3 className="font-semibold text-emerald-700">{t.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{t.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* === Info Section === */}
      <article className="prose max-w-none mt-14 text-gray-700">
        <h3 className="text-xl font-semibold text-emerald-700">Metro</h3>
        <p>
          The Athens Metro is one of the fastest ways to move between key areas.
          Trains run roughly every 5–10 minutes from early morning to midnight.
        </p>

        <h3 className="text-xl font-semibold text-emerald-700 mt-8">
          Hop-on Hop-off
        </h3>
        <p>
          The open-top buses are perfect for exploring landmarks at your own
          pace. Multiple routes cover the Acropolis, Plaka, and the Riviera.
        </p>

        {/* === Booking Button === */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/book-hop-on" // replace later with your affiliate URL
            className="inline-block rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 font-medium shadow-md transition"
          >
            Book Hop-on Hop-off 🎟️
          </Link>
        </div>
      </article>
    </main>
  );
}
