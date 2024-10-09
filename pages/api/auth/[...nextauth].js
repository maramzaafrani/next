
// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',  // Page de connexion personnalisée
    error: '/auth/error',    // Page d'erreur personnalisée
    // Définir la redirection après la connexion
    // callbackUrl: '/dashboard', 
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Ajout des informations du compte dans le token
        token.accessToken = account.access_token;
        token.email = account.email || '';
        token.name = account.name || '';
      }
      return token;
    },
    async session({ session, token }) {
      // Ajout des informations du token dans la session
      session.accessToken = token.accessToken;
      session.email = token.email;
      session.name = token.name;
      return session;
    },
  },
});
