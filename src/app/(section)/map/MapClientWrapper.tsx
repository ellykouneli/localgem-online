"use client";

import PageHeader from "@/components/PageHeader";
import { AnimatePresence, motion } from "framer-motion";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import MapClient from "./MapClient";

export default function MapClientWrapper() {
  const searchParams = useSearchParams();
  const tavernId = searchParams.get("tavern"); // uuid or null
  const mode = searchParams.get("mode"); // "all" when from Quick Find

  const showAllMarkers = mode === "all";

  // Sidebar open if we came with a tavern selected
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(!!tavernId);

  const hasSelectedTavern = Boolean(tavernId);

  return (
    <main className="relative w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PageHeader
          title="Interactive Map"
          subtitle={
            hasSelectedTavern
              ? "Showing selected tavern"
              : showAllMarkers
                ? "See taverns around you"
                : "See what's around you"
          }
        />
      </motion.div>

      {/* Layout container */}
      <div className="relative mt-6 flex flex-col lg:flex-row gap-4">
        {/* Map Area */}
        <div className="flex-1 min-h-[60vh]">
          <MapClient tavernId={tavernId} showAllMarkers={showAllMarkers} />
        </div>

        {/* Sidebar (future: tavern details / filters) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="lg:w-80 w-full lg:static absolute right-0 top-0 z-30 bg-white/70 backdrop-blur-lg
                         border border-brand-light/30 rounded-xl shadow-card p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-display font-semibold text-brand-dark">
                  Tavern details
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md text-brand-dark hover:text-brand-light hover:bg-brand-light/10 transition"
                  aria-label="Close details panel"
                >
                  <PanelRightClose className="w-5 h-5" />
                </button>
              </div>

              {hasSelectedTavern ? (
                <div className="text-sm text-neutral-700 space-y-2">
                  <p className="font-medium">Loading tavern data...</p>
                  <p>
                    This panel will show tavern name, photo, description, and a
                    quick “Get directions” button.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-600">
                  Select a tavern on the map to view its details here.
                </p>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle Button (mobile + desktop) */}
        <button
          onClick={() => setSidebarOpen((open) => !open)}
          className="fixed bottom-6 right-6 lg:static lg:mb-auto inline-flex items-center justify-center
                     bg-gradient-to-r from-brand-light to-brand text-white rounded-full p-3 shadow-glow
                     hover:scale-105 transition-all duration-300 z-40"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <PanelRightOpen className="w-5 h-5" />
          )}
        </button>
      </div>
    </main>
  );
}
