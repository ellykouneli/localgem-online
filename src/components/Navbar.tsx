// src/components/Navbar.tsx
"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

/** ORDER + NAMES you asked for */
const links = [
  { href: "/hidden_gems", label: "Hidden Gems" },
  { href: "/classics", label: "Our Classics" },
  { href: "/experiences", label: "Experiences" },
  { href: "/transportation", label: "Transportation" },
  { href: "/map", label: "Map" },
  { href: "/hospitals", label: "On duty Hospitals and Pharmacies" },
  { href: "/me", label: "My Profile" },
];

export default function Navbar(): ReactNode {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const linkClasses = (href: string) =>
    clsx(
      "block px-3 py-2 rounded-md text-sm font-medium transition",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2",
      isActive(href)
        ? "bg-emerald-100 text-emerald-700"
        : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
    );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50
                   focus:rounded-md focus:bg-yellow-100 focus:px-3 focus:py-1"
      >
        Skip to content
      </a>

      <nav role="navigation" aria-label="Main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold tracking-tight text-emerald-700
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 rounded"
            >
              LocalGem<span className="text-emerald-500">.online</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={linkClasses(l.href)}
                >
                  {l.label}
                </Link>
              ))}

              {/* Auth button (fixed to /signin) */}
              <Link
                href="/signin"
                className="ml-2 inline-flex items-center rounded-lg border border-emerald-600 px-3 py-2
                           text-sm font-semibold text-emerald-700 hover:bg-emerald-50
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-emerald-50
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          id="mobile-nav"
          className={clsx(
            "md:hidden overflow-hidden border-t border-gray-100 transition-[max-height] duration-300 ease-in-out",
            open ? "max-h-[420px]" : "max-h-0"
          )}
        >
          <div className="px-4 pb-4 pt-2 bg-white">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={linkClasses(l.href)}
                >
                  {l.label}
                </Link>
              ))}

              <div className="pt-2">
                <Link
                  href="/signin"
                  className="w-full inline-flex justify-center rounded-lg border border-emerald-600 px-3 py-2
                             text-sm font-semibold text-emerald-700 hover:bg-emerald-50
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
