import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ігнорувати помилки eslint під час збірки
  },
  typescript: {
    ignoreBuildErrors: true, // ігнорувати помилки TypeScript під час збірки
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['localhost'], // дозволені локальні домени для зображень
    unoptimized: true, // відключити оптимізацію зображень
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*', // статичні файли uploads доступні напряму
      },
      {
        source: '/documents/:path*',
        destination: '/documents/:path*', // статичні файли documents доступні напряму
      },
    ];
  },
};

export default nextConfig;
