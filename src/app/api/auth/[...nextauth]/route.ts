// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type AuthOptions, type SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../../lib/prisma";
import { verifyPassword } from "../../../../../lib/auth";
import { findUserByEmail, recordFailedLogin, resetFailedLogins, isBlocked } from "../../../../../lib/users";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        if (await isBlocked(email)) {
          throw new Error("account_blocked");
        }

        const user = await findUserByEmail(email);
        if (!user || !user.passwordHash) {
          await recordFailedLogin(email);
          return null;
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
          await recordFailedLogin(email);
          return null;
        }

        await resetFailedLogins(email);

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt" as SessionStrategy,
  },

  pages: {
    signIn: "/signIn",
  },

  secret: process.env.NEXTAUTH_SECRET,
};