// src/app/(section)/layout.tsx
import type { ReactNode } from "react";

// 🧩 Force this entire section (including /map) to render dynamically
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sidebar placeholder (hidden on small screens) */}
        <aside className="hidden lg:block lg:col-span-3" aria-hidden="true" />

        {/* Main content */}
        <main className="lg:col-span-9" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
