"use client";

import Link from "next/link";

const categories = [
  {
    title: "Festivals",
    slug: "festivals",
    description: "Seasonal music, arts & cultural events.",
    emoji: "🎉",
  },
  {
    title: "Panigiria",
    slug: "panigiria",
    description: "Village fairs with live music & dance.",
    emoji: "🕺",
  },
  {
    title: "Foodie",
    slug: "foodie",
    description: "Tastings, markets, and cooking classes.",
    emoji: "🍽️",
  },
  {
    title: "Alternative tours",
    slug: "alternative-tours",
    description: "Street art, neighborhoods, and niche walks.",
    emoji: "🗺️",
  },
];

export default function ExperiencesPage() {
  return (
    <main className="container">
      <h1>Experiences</h1>
      <p className="subtitle">
        Choose a category to explore curated local experiences.
      </p>

      <section className="grid">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/experiences/${cat.slug}`}
            className="card"
          >
            <div className="emoji">{cat.emoji}</div>
            <h2>{cat.title}</h2>
            <p>{cat.description}</p>
          </Link>
        ))}
      </section>

      <style jsx>{`
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 16px 64px;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .subtitle {
          color: #555;
          margin-bottom: 1.5rem;
        }
        .grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        }
        .emoji {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        h2 {
          margin: 0 0 0.5rem;
        }
        p {
          margin: 0;
          color: #555;
        }
      `}</style>
    </main>
  );
}
