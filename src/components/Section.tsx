"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h2 className="relative text-2xl sm:text-3xl font-display font-semibold text-brand-dark mb-1">
            {title}
            <span className="absolute -bottom-2 left-0 h-[3px] w-14 bg-gradient-to-r from-brand-light to-brand rounded-full" />
          </h2>

          {subtitle ? (
            <p className="text-sm sm:text-base text-neutral-600 mt-4 max-w-prose">
              {subtitle}
            </p>
          ) : null}
        </div>

        {action && <div className="mt-4 sm:mt-0 flex-shrink-0">{action}</div>}
      </div>

      <div className="space-y-6 sm:space-y-8">{children}</div>
    </motion.section>
  );
}
