"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  href: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
};

export default function HiddenGemCard({ href, title, subtitle, image }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full"
    >
      <Link
        href={href}
        className="group block rounded-xl overflow-hidden border border-brand-light/30 bg-white/80 backdrop-blur-sm
                   shadow-card hover:shadow-glow transition-all duration-300"
      >
        {/* Image */}
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg sm:text-xl font-display font-semibold text-brand-dark mb-1 group-hover:text-brand-light transition-colors">
            {title}
          </h3>

          {subtitle && (
            <p className="text-sm text-neutral-600 leading-snug">{subtitle}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
