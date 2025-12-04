"use client";

import Reveal from "@/components/Reveal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HiddenGem {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
}

export default function HiddenGemsPage() {
  const supabase = createClientComponentClient();
  const [gems, setGems] = useState<HiddenGem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGems = async () => {
      const { data, error } = await supabase.from("hidden_gems").select("*");
      if (!error && data) setGems(data);
      setLoading(false);
    };
    fetchGems();
  }, [supabase]);

  return (
    <main className="container mx-auto px-6 py-16">
      {/* === Header === */}
      <Reveal>
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-emerald-700 mb-3">
            Hidden Gems
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-balance">
            Discover Athens’ lesser-known treasures, curated by locals.
          </p>
        </header>
      </Reveal>

      {/* === Loading State === */}
      {loading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500"
        >
          Loading gems...
        </motion.p>
      ) : gems.length > 0 ? (
        /* === Gems Grid === */
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {gems.map((gem, i) => (
            <Reveal key={gem.id} delay={i * 0.1}>
              <div className="group bg-white border border-emerald-100 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
                {gem.image_url ? (
                  <Image
                    src={gem.image_url}
                    alt={gem.name}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-56 bg-emerald-50 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-emerald-700 mb-1">
                    {gem.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {gem.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 mt-10"
        >
          No hidden gems found. Add some in Supabase!
        </motion.p>
      )}
    </main>
  );
}
