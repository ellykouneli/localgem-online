"use client";

import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";

export type Tavern = {
  id: string; // ← Supabase uuid (string)
  name: string;
  image: string; // ← Supabase image_url or placeholder
  shortDescription: string;
};

interface FoodieCarouselProps {
  taverns: Tavern[];
  onViewTavern?: (id: string) => void; // ← pass uuid through
}

export default function FoodieCarousel({
  taverns,
  onViewTavern,
}: FoodieCarouselProps) {
  return (
    <section className="overflow-x-auto flex gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-hide">
      {taverns.map((t, i) => (
        <Reveal key={t.id} delay={i * 0.1}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className="flex-shrink-0 w-72 bg-white/80 backdrop-blur-md border border-emerald-100
                       rounded-xl shadow-sm hover:shadow-md transition-all duration-300 snap-start overflow-hidden"
          >
            {/* Image */}
            <div className="relative w-full h-44 overflow-hidden">
              <motion.img
                src={t.image}
                alt={t.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                {t.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-snug">
                {t.shortDescription}
              </p>
              <motion.button
                onClick={() => onViewTavern?.(t.id)} // ← passes uuid
                whileHover={{ scale: 1.07 }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2 rounded-full shadow-sm transition"
              >
                View Tavern
              </motion.button>
            </div>
          </motion.div>
        </Reveal>
      ))}
    </section>
  );
}
