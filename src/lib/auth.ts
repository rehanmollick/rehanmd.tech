import type { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";

const ADMIN_LOGIN = process.env.ADMIN_GITHUB_LOGIN || "rehanmollick";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile }) {
      // Only allow the admin GitHub login to sign in at all.
      const login = (profile as { login?: string } | undefined)?.login;
      return login === ADMIN_LOGIN;
    },
    async jwt({ token, profile }) {
      if (profile) {
        const login = (profile as { login?: string }).login;
        if (login) token.githubLogin = login;
      }
      return token;
    },
    async session({ session, token }) {
      (session as { githubLogin?: string }).githubLogin =
        (token as { githubLogin?: string }).githubLogin;
      return session;
    },
  },
  pages: {
    signIn: "/api/auth/signin",
  },
};
