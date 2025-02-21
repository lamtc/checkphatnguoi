import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Optimizes for production deployment
  poweredByHeader: false, // Security: remove X-Powered-By header
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

export default config
