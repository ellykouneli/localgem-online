import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HiddenGemPageProps {
  params: Promise<{ slug: string }>;
}

export default async function HiddenGemPage({ params }: HiddenGemPageProps) {
  const { slug } = await params;

  // ✅ Fetch single hidden gem
  const { data: gem, error } = await supabase
    .from("hidden_gems")
    .select("name, description, image_url, body_md")
    .eq("slug", slug)
    .single();

  if (error || !gem) {
    console.error("Error loading gem:", error);
    return (
      <main className="p-6">
        <p>Couldn’t find this hidden gem.</p>
      </main>
    );
  }

  // ✅ Clean up Markdown text (handle paragraph spacing)
  const formattedBody =
    typeof gem.body_md === "string"
      ? gem.body_md
          .replace(/\r\n/g, "\n") // normalize Windows newlines
          .replace(/\n{1}(?!\n)/g, "\n\n") // ensure paragraph spacing
      : "";

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-3 text-gray-900">{gem.name}</h1>

      {/* Short description */}
      {gem.description && (
        <p className="text-lg text-gray-700 mb-8">{gem.description}</p>
      )}

      {/* Image */}
      {gem.image_url && (
        <div className="relative w-full max-w-3xl h-[26rem] mb-10">
          <Image
            src={gem.image_url}
            alt={gem.name}
            fill
            className="object-cover rounded-xl shadow-md"
            unoptimized
          />
        </div>
      )}

      {/* Markdown body text */}
      {formattedBody ? (
        <article className="prose prose-lg prose-gray max-w-none leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 underline"
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-semibold text-gray-900 mt-8 mb-4"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl font-semibold text-gray-800 mt-6 mb-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => <p className="mb-5" {...props} />,
            }}
          >
            {formattedBody}
          </ReactMarkdown>
        </article>
      ) : (
        <p className="text-gray-500 italic">
          No additional information available for this hidden gem.
        </p>
      )}
    </main>
  );
}
