"use client";

import Reveal from "@/components/Reveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function PanigiriaPage() {
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
        className="relative w-full h-[60vh] flex items-center justify-center text-center overflow-hidden"
      >
        <motion.div style={{ y: yImage }} className="absolute inset-0">
          <img
            src="/images/a3.jpg"
            alt="Greek Panigiria"
            className="object-cover w-full h-full brightness-95"
          />
        </motion.div>
        <motion.div
          style={{ y: yImage }}
          className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        />
        <motion.div style={{ y: yText }} className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white drop-shadow-xl">
            Panigiria
          </h1>
          <p className="text-gray-100 mt-3 max-w-xl mx-auto">
            Authentic Greek village festivals — food, clarino, and endless
            dancing.
          </p>
        </motion.div>
      </section>

      {/* === Content === */}
      <section className="container mx-auto px-6 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal delay={0.1}>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-5">
            <h3 className="text-lg font-semibold text-primary mb-1">
              Island-Style Panigiri
            </h3>
            <p className="text-gray-600 text-sm">
              Live clarino, grilled meats, and dancing under summer skies.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-5">
            <h3 className="text-lg font-semibold text-primary mb-1">
              Church Feast Day Celebration
            </h3>
            <p className="text-gray-600 text-sm">
              Folk music, costumes, and local dishes shared in community spirit.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
