import GoogleProvider from "next-auth/providers/google"

export const AuthOptions = {
      // Configure one or more authentication providers
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_ID as string,
          clientSecret: process.env.GOOGLE_SECRET as string,
          allowDangerousEmailAccountLinking: true,
        }),
        // ...add more providers here
      ],
      secret: process.env.NEXTAUTH_SECRET
    }