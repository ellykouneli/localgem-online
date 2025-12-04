"use client";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";

export default function Classics() {
  return (
    <section className="min-h-[70vh] bg-emerald-50 px-6 md:px-12 py-10 rounded-3xl">
      <PageHeader
        title="Our Classics"
        subtitle="Timeless favorites loved by locals and travelers alike"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap justify-center gap-6 mt-6"
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition w-64"
          >
            <h3 className="font-semibold text-gray-900 mb-2">
              Classic Place {i}
            </h3>
            <p className="text-sm text-gray-600">A must-see in Athens.</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
