/** @type {import('next').NextConfig} */
const nextConfig = {
 typescript: {ignoreBuildErrors: true},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig
