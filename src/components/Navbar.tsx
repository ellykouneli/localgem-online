"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/hidden_gems", label: "Hidden Gems" },
  { href: "/classics", label: "Our Classics" },
  { href: "/experiences", label: "Experiences" },
  { href: "/transportation", label: "Transportation" },
  { href: "/map", label: "Map" },
  { href: "/on-duty", label: "On Duty" },
  { href: "/me", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const linkClasses = (href: string) =>
    clsx(
      "block rounded-md px-3 py-2 text-sm font-medium transition-all duration-300",
      isActive(href)
        ? "bg-brand-light/20 text-brand-dark font-semibold"
        : "text-gray-700 hover:text-brand-dark hover:bg-brand-light/10"
    );

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg shadow-header transition-all duration-300">
      {/* accessibility skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2
                   focus:z-50 focus:rounded-md focus:bg-brand-light/20 focus:px-3 focus:py-1"
      >
        Skip to content
      </a>

      <nav role="navigation" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* brand */}
            <Link
              href="/"
              className="text-2xl font-display font-bold tracking-tight text-brand-dark
                         hover:text-brand transition-colors duration-300"
            >
              LocalGem<span className="text-brand-light">.online</span>
            </Link>

            {/* desktop links */}
            <div className="hidden md:flex items-center gap-1">
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

              {/* sign in button */}
              <Link
                href="/signin"
                className="ml-3 inline-flex items-center rounded-full bg-gradient-to-r from-brand-light to-brand
                           px-4 py-2 text-sm font-semibold text-white shadow-card
                           transition-transform duration-300 hover:scale-105 hover:shadow-glow"
              >
                Sign in
              </Link>
            </div>

            {/* mobile hamburger */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2
                         text-brand-dark hover:bg-brand-light/10 focus:outline-none focus:ring-2
                         focus:ring-brand-light focus:ring-offset-2"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* mobile dropdown */}
        <div
          id="mobile-nav"
          className={clsx(
            "md:hidden overflow-hidden border-t border-gray-100 bg-white/90 backdrop-blur-md shadow-card transition-all duration-500 ease-in-out",
            open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 pb-4 pt-2 flex flex-col gap-1">
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
                className="w-full inline-flex justify-center rounded-full bg-gradient-to-r from-brand-light to-brand
                           px-4 py-2 text-sm font-semibold text-white shadow-card
                           transition-transform duration-300 hover:scale-105 hover:shadow-glow"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
