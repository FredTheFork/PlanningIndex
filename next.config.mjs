/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'foundationary.vercel.app',
      },
      {
        hostname: '*.supabase.co',
      },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/additional-services',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/additional-services/:path*',
        destination: '/services',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
