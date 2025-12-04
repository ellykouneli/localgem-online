"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const tiles = [
    { name: "Hidden Gems", href: "/hidden_gems" },
    { name: "Our Classics", href: "/classics" },
    { name: "Experiences", href: "/experiences" },
    { name: "Transportation", href: "/transportation" },
    { name: "Map", href: "/map" },
    { name: "On Duty Hospitals and Pharmacies", href: "/on-duty" },
  ];

  return (
    <div className="flex flex-col items-center pb-16">
      {/* HERO CARD */}
      <section className="w-full flex justify-center pt-8 px-4">
        {/* ✅ make the card the positioning context */}
        <div className="relative max-w-6xl w-full bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          {/* ✅ NO `fill` — explicit size; image is a normal block */}
          <Image
            src="/images/a3.jpg"
            alt="Athens street view"
            width={1920}
            height={1080}
            priority
            className="block w-full h-[45vh] min-h-[280px] object-cover"
          />

          {/* overlay content sits absolutely on top of the image */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-5xl font-serif font-semibold drop-shadow-lg"
            >
              Discover Athens Like a Local
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-3 text-base sm:text-lg max-w-2xl font-light drop-shadow-md"
            >
              Hidden gems, authentic food, and timeless routes — curated for
              travelers who love real experiences.
            </motion.p>

            <motion.a
              href="#explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold transition pointer-events-auto"
            >
              Explore LocalGem
            </motion.a>
          </div>
        </div>
      </section>

      {/* TITLE UNDER HERO */}
      <h2
        id="explore"
        className="mt-10 text-xl sm:text-2xl font-semibold text-center"
      >
        Explore LocalGem
      </h2>

      {/* TILES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-6 max-w-6xl w-full relative z-10">
        {tiles.map((tile, index) => (
          <motion.div
            key={tile.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-olive mb-2">
              {tile.name}
            </h3>
            <Link
              href={tile.href}
              className="text-emerald-600 hover:underline font-medium"
            >
              Explore →
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
