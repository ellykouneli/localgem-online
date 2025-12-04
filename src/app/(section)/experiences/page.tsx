"use client";

import Reveal from "@/components/Reveal";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const categories = [
  {
    title: "Festivals",
    slug: "festivals",
    description: "Seasonal music, arts & cultural events.",
    emoji: "🎉",
  },
  {
    title: "Panigiria",
    slug: "panigiria",
    description: "Village fairs with live music & dance.",
    emoji: "🕺",
  },
  {
    title: "Foodie",
    slug: "foodie",
    description: "Tastings, markets, and cooking classes.",
    emoji: "🍽️",
  },
  {
    title: "Alternative Tours",
    slug: "alternative-tours",
    description: "Street art, neighborhoods, and niche walks.",
    emoji: "🗺️",
  },
];

export default function ExperiencesPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <main>
      {/* === Parallax Hero === */}
      <section
        ref={ref}
        className="relative w-full h-[60vh] flex items-center justify-center text-center overflow-hidden rounded-b-3xl"
      >
        <motion.div style={{ y: yImage }} className="absolute inset-0">
          <img
            src="/images/a2.jpg"
            alt="Local Experiences"
            className="object-cover w-full h-full brightness-95"
          />
        </motion.div>

        {/* overlay */}
        <motion.div
          style={{ y: yImage }}
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 backdrop-blur-[1px]"
        />

        {/* title */}
        <motion.div
          style={{ y: yText }}
          className="relative z-10 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white drop-shadow-xl">
            Experiences
          </h1>
          <p className="text-gray-100 mt-3 max-w-xl mx-auto text-balance">
            Choose a category to explore curated local adventures.
          </p>
        </motion.div>
      </section>

      {/* === Categories Grid === */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.1}>
              <Link
                href={`/experiences/${cat.slug}`}
                className="group block bg-white border border-emerald-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </div>
                <h2 className="text-lg font-semibold text-emerald-700 mb-1">
                  {cat.title}
                </h2>
                <p className="text-gray-600 text-sm">{cat.description}</p>
              </Link>
            </Reveal>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
