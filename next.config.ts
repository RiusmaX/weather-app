import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration de production optimisée
  reactStrictMode: true,
  
  // Optimisation des images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/wn/**',
      },
    ],
    // Optimisation de performance pour les images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Optimisation des polices et CSS
  optimizeFonts: true,
  
  // Headers de sécurité pour la production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(self)',
          },
        ],
      },
    ];
  },
  
  // Optimisation du build
  swcMinify: true,
  
  // Configuration PWA (optionnelle)
  // generateEtags: false,
  // poweredByHeader: false,
};

export default nextConfig;
