"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="opacity-60">…</span>;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => signIn("google")}
          className="px-3 py-1 border rounded"
        >
          Sign in with Google
        </button>
        <Link href="/signin" className="px-3 py-1 border rounded">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {session.user?.image && (
        <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
      )}
      <span className="text-sm">
        {session.user?.name ?? session.user?.email}
      </span>
      <button onClick={() => signOut()} className="px-3 py-1 border rounded">
        Sign out
      </button>
    </div>
  );
}
