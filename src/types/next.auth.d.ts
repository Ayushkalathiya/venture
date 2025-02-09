import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      credits: number;
    } & DefaultSession['user']
  }
}