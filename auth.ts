import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(1),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!configuredEmail || !passwordHash) {
          throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be configured.");
        }

        if (parsed.data.email.trim().toLowerCase() !== configuredEmail) return null;
        if (!(await bcrypt.compare(parsed.data.password, passwordHash))) return null;

        return {
          id: configuredEmail,
          email: configuredEmail,
          name: "Ward administrator",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
