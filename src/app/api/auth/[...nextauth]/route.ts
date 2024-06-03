import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from "@prisma/client"
import prisma from '@/db/db'
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    // ...add more providers here
  ],
}
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};