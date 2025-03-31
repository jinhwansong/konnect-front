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
        }, {
            protocol: 'https',
            hostname: 'konee.shop',
            port: '',
        }],
        // 이미지 최적화 설정
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // 반응형 이미지 크기
        imageSizes: [16, 32, 48, 64, 96, 128, 256], // 작은 이미지 크기
        formats: ['image/webp', 'image/avif'], // 최신 이미지 포맷 지원
        minimumCacheTTL: 60, // 캐시 시간 설정 (초 단위)
        dangerouslyAllowSVG: true, // SVG 지원 (필요한 경우)
        contentDispositionType: 'inline', // 이미지 제공 방식
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // CSP 정책
    },
    // 폰트 최적화
    optimizeFonts: false, // 폰트 최적화 활성화
    
    // 성능 최적화
    reactStrictMode: true, // 개발시 문제 발견을 위한 Strict Mode
    compress: true, // 응답 압축
    poweredByHeader: false, // 'X-Powered-By' 헤더 제거
    
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
        
        // 추가 최적화
        if (!dev && !isServer) {
            // 프로덕션 환경에서 클라이언트 측 번들 최적화
            config.optimization = {
                ...config.optimization,
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: 25,
                    minSize: 20000
                }
            };
        }
        
        return config;
    },
    
    // 실험적 기능
    experimental: {
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
        optimizeCss: true, // CSS 최적화
        scrollRestoration: true, // 스크롤 위치 복원 기능
        nextScriptWorkers: true, // 스크립트 웹 워커 활성화
    },
    
    // 정적 자산 최적화
    
    // 빌드 출력 최적화
    output: 'standalone', // 독립 실행형 출력 모드
};

module.exports = nextConfig