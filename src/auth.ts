import { sign, verify } from 'jsonwebtoken';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';

import { login, logout, socialLogin } from './libs/user';

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, '\n');
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!.replace(/\\n/g, '\n');

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'text' },
        password: { label: '비밀번호', type: 'password' },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await login(
            credentials?.email as string,
            credentials?.password as string
          );

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            image: user.image,
            phone: user.phone,
            role: user.role,
            socials: user.socials,
          };
        } catch {
          return null;
        }
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),

    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  jwt: {
    encode: async ({ token }) => {
      return sign(token as object, JWT_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '1d',
      });
    },
    decode: async ({ token }): Promise<JWT | null> => {
      if (!token) return null;
      try {
        const decodedToken = verify(token, JWT_PUBLIC_KEY, {
          algorithms: ['RS256'],
        });

        if (typeof decodedToken === 'string') return null;

        return {
          id: decodedToken.id,
          email: decodedToken.email,
          name: decodedToken.name,
          nickname: decodedToken.nickname,
          phone: decodedToken.phone,
          role: decodedToken.role,
          image: decodedToken.image ?? null,
          socials: decodedToken.socials,
        } satisfies JWT;
      } catch {
        return null;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        let backendUser = user;

        if (account?.provider && account.provider !== 'credentials') {
          // 소셜 로그인 시 백엔드에 등록
          try {
            const res = await socialLogin({
              provider: account?.provider?.toUpperCase(),
              socialId: account?.providerAccountId,
              email: user.email!,
              name: user.name,
              image: user.image,
            });

            if (res) {
              backendUser = res;
            }
          } catch {
            return token;
          }
        }
        token.id = backendUser.id;
        token.email = backendUser.email;
        token.role = backendUser.role;
        token.name = backendUser.name;
        token.nickname = backendUser.nickname;
        token.phone = backendUser.phone;
        token.image = backendUser.image ?? null;
        token.socials = backendUser.socials ?? [];
      }
      if (trigger === 'update') {
        if (session?.fcm) token.fcm = session.fcm as string;

        if (session?.nickname) token.nickname = session.nickname;
        if (session?.phone) token.phone = session.phone;
        if (session?.image) token.image = session.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          nickname: token.nickname as string,
          phone: token.phone as string,
          role: token.role as string,
          image: token.image as string | null,
          socials: token.socials ?? [],
        };
        session.accessToken = sign(
          {
            sub: token.id,
            email: token.email,
            role: token.role,
            name: token.name,
          },
          JWT_PRIVATE_KEY,
          {
            algorithm: 'RS256',
            expiresIn: '1h',
          }
        );
      }
      return session;
    },

    async signIn({ account }) {
      if (account && account.provider !== 'credentials') {
        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 관리자 자동 이동은 세션이 완전히 설정된 후 처리되므로
      // 기본 URL로 리다이렉트하고, 실제 리다이렉트는 클라이언트/미들웨어에서 처리
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  events: {
    async signOut() {
      try {
        logout();
      } catch (error) {
        console.error('로그아웃 알림 에러:', error);
      }
    },
  },
});
