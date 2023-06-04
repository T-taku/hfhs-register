import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

type ClientType = {
  clientId: string;
  clientSecret: string;
};

const authOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      } as ClientType),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    callbacks: {
      async signIn({ account, profile }) {
        if (account.provider === "google") {
          return profile.email_verified && profile.email.endsWith("@higashifukuoka.net")
        }
      },
      async session({ session, token }) {
        session.user.accessToken = token.accessToken;
        return session;
      }
    },
};

export default NextAuth(authOptions);
