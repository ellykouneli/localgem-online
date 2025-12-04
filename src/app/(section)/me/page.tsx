"use client";

import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { useState } from "react";

export default function MePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="min-h-[100vh] bg-emerald-50 px-6 md:px-12 py-20">
      <section className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-emerald-100 p-10">
        <PageHeader
          title={isLoggedIn ? "My Profile" : "Sign in / Join (€3.99 once)"}
          subtitle={
            isLoggedIn
              ? "Your personal corner in Athens"
              : "Access your saved gems, itineraries & achievements"
          }
        />

        {/* === Not logged in === */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto mt-10"
          >
            <button className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 font-semibold transition">
              Continue with Google
            </button>

            <div className="my-5 h-px bg-gray-200" />

            <form className="space-y-3">
              <input
                className="w-full rounded-lg border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Email"
                type="email"
              />
              <input
                className="w-full rounded-lg border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Password"
                type="password"
              />
              <button
                type="button"
                className="w-full rounded-lg border border-emerald-600 text-emerald-700 py-2.5 font-semibold hover:bg-emerald-50 transition"
                onClick={() => setIsLoggedIn(true)}
              >
                Create account (€3.99)
              </button>
            </form>
          </motion.div>
        )}

        {/* === Logged in preview === */}
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center mt-12 text-center"
          >
            <div className="w-24 h-24 bg-emerald-200 rounded-full mb-4" />
            <h3 className="font-semibold text-xl text-gray-800">
              Welcome, Traveler!
            </h3>
            <p className="text-sm text-gray-600 mt-2 max-w-md">
              Your adventures, bookings, and achievements will appear here soon.
            </p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
