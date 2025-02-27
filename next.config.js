/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'http',
            hostname: 'k.kakaocdn.net',
            port: '',
        }, {
            protocol: 'https',
            hostname: 'ssl.pstatic.net',
            port: '',
        }, {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
        }, {
            protocol: 'https',
            hostname: 'picsum.photos',
            port: '',
        }, {
            protocol: 'http',
            hostname: 'localhost',
            port: '3030',
        }],
    },
    webpack: (config, {dev, isServer}) => {
        if (dev) {
            config.cache = {
                type: 'filesystem',
                // 빌드 의존성 설정
                buildDependencies: {
                    config: [__filename]
                },
                name: 'development-cache'
            }
        }
        // svg설정
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;

    },
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
};

module.exports = nextConfig
