import Link from "next/link";

type Props = {
  href: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
};

export default function HiddenGemCard({ href, title, subtitle, image }: Props) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border p-4 shadow-sm hover:shadow-md transition"
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title}
          className="mb-3 h-40 w-full object-cover rounded-xl"
        />
      ) : null}

      <div className="text-lg font-semibold">{title}</div>

      {subtitle ? <div className="text-sm opacity-70">{subtitle}</div> : null}
    </Link>
  );
}
