import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ddbak.vercel.app', // if your CMS serves images too
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
