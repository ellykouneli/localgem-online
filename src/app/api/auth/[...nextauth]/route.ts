import { supabaseServer } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Username + password (from Supabase)
    Credentials({
      name: "Username",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const username = (creds?.username ?? "").trim().toLowerCase();
        const password = creds?.password ?? "";
        if (!username || !password) return null;

        const { data: user } = await supabaseServer
          .from("auth_users")
          .select("id, username, password_hash")
          .eq("username", username)
          .maybeSingle();

        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return null;

        return { id: user.id, name: user.username };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id ?? token.sub;
        token.name = user.name ?? token.name;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name;
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },

  // ⬇️ Tell NextAuth to use your custom UI at /signin
  pages: {
    signIn: "/signin",
  },
} as any);

export { handler as GET, handler as POST };
