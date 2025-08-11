/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,               // <== Add this line
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
}

export default nextConfig;
