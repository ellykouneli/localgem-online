"use client";

import Reveal from "@/components/Reveal";
import Link from "next/link";

const CONTENT: Record<
  string,
  { title: string; intro: string; suggestions: string[] }
> = {
  festivals: {
    title: "Festivals",
    intro: "Major and indie festivals across Athens and nearby regions.",
    suggestions: [
      "Summer music festival near the sea",
      "Film festival pop-ups",
      "Neighborhood cultural weekends",
    ],
  },
  panigiria: {
    title: "Panigiria",
    intro: "Traditional village fairs with food, music, and dance.",
    suggestions: [
      "Island-style panigiri with live clarino",
      "Local church feast day events",
      "Dance nights in the squares",
    ],
  },
  foodie: {
    title: "Foodie",
    intro: "Eat your way through markets, tastings, and hands-on classes.",
    suggestions: [
      "Central market walk & tastings",
      "Olive oil & wine pairing",
      "Home-style cooking workshop",
    ],
  },
  "alternative-tours": {
    title: "Alternative Tours",
    intro: "Street art, hidden neighborhoods, and unusual angles on the city.",
    suggestions: [
      "Street art & stories circuit",
      "Rooftop sunsets & photo walk",
      "Modern Athens architecture stroll",
    ],
  },
};

export default function ExperienceCategory({
  params,
}: {
  params: { category: string };
}) {
  const data = CONTENT[params.category];

  if (!data) {
    return (
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-primary mb-2">Not found</h1>
        <p className="text-gray-600 mb-4">This category doesn’t exist.</p>
        <Link
          href="/experiences"
          className="text-primary hover:text-secondary underline"
        >
          ← Back to Experiences
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        ›{" "}
        <Link href="/experiences" className="hover:text-primary">
          Experiences
        </Link>{" "}
        › <span className="text-gray-700">{data.title}</span>
      </nav>

      {/* Title & intro */}
      <Reveal>
        <h1 className="text-3xl font-serif font-semibold text-primary mb-2">
          {data.title}
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-gray-700 mb-8 max-w-prose">{data.intro}</p>
      </Reveal>

      {/* Suggestions list */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {data.suggestions.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <li className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              {s}
            </li>
          </Reveal>
        ))}
      </ul>

      {/* Back link */}
      <Reveal delay={0.2}>
        <Link
          href="/experiences"
          className="text-primary hover:text-secondary underline text-sm"
        >
          ← Back to all categories
        </Link>
      </Reveal>
    </main>
  );
}
