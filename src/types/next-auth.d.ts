import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      nickname: string;
      phone: string;
      role: string;
      image: string | null;
      socials: string[];
      fcm?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    nickname: string;
    phone: string;
    role: string;
    image: string | null;
    socials: string[];
    fcm?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    nickname: string;
    phone: string;
    role: string;
    image: string | null;
    socials: string[];
    fcm?: string;
  }
}
