import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Optimizes for production deployment
  poweredByHeader: false, // Security: remove X-Powered-By header
}

export default config
