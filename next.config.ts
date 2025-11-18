import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net', // 카카오
      },
      {
        protocol: 'https',
        hostname: 'konee.shop', // 실서버
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net', // 카카오
      },
      {
        protocol: 'https',
        hostname: 'ssl.pstatic.net', // 네이버
      },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },

      {
        protocol: 'https',
        hostname: 'requirements-monetary-gtk-english.trycloudflare.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    domains: ['localhost'],
  },
  webpack(config) {
    // 일반 웹팩 모드에서도 동작하도록
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  reactStrictMode: false,
};

export default nextConfig;
