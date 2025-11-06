import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.sub;
      // Verificar rol y institución basado en el email
      if (session.user.email.endsWith('.gov.co')) {
        session.user.role = 'agente';
        session.user.institution = 'Gobierno Colombia';
      } else {
        session.user.role = 'ciudadano';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
