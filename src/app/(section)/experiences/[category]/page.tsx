"use client";

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
    title: "Alternative tours",
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
      <main className="container">
        <h1>Not found</h1>
        <p>This category doesn’t exist.</p>
        <Link href="/experiences">← Back to Experiences</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <nav className="breadcrumbs">
        <Link href="/">Home</Link> ›{" "}
        <Link href="/experiences">Experiences</Link> › <span>{data.title}</span>
      </nav>

      <h1>{data.title}</h1>
      <p className="intro">{data.intro}</p>

      <ul className="list">
        {data.suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <Link href="/experiences">← Back to all categories</Link>

      <style jsx>{`
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 16px 64px;
        }
        .breadcrumbs {
          color: #666;
          margin-bottom: 0.75rem;
        }
        h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .intro {
          color: #555;
          margin-bottom: 1rem;
        }
        .list {
          list-style: none;
          padding: 0;
        }
        .list li {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 10px;
          margin-bottom: 8px;
        }
      `}</style>
    </main>
  );
}
